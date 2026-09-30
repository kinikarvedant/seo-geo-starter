import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { client } from "@/config/load";
import { allRoutes } from "@/lib/seo/routes";
import { validateJsonLdBlob } from "@/lib/seo/jsonld/validators";
import { resolveAiRules } from "@/lib/geo/aiCrawlers";

/**
 * Endpoint smoke test against a real running build.
 *
 * Unit tests prove the route inventory is internally consistent. They cannot prove the
 * server actually serves those URLs, that the title on the page matches the one the
 * sitemap will advertise, or that a page we deliberately did not generate really 404s.
 * That needs HTTP, so this boots `.next/standalone/server.js` and asks it.
 *
 *   CLIENT_ID=plumber npm run build && CLIENT_ID=plumber npm run smoke
 *
 * Crawling over HTTP rather than reading `.next/server/app/**\/*.html` is deliberate:
 * the same checks then run unchanged against a container or a live origin, which is
 * what the full audit script needs in a later milestone.
 */

const PORT = Number(process.env.SMOKE_PORT ?? 3987);
const BASE = `http://127.0.0.1:${PORT}`;
const SERVER = ".next/standalone/server.js";

const routes = allRoutes(client);
let server: ChildProcess | undefined;

async function waitForHealth(timeoutMs = 30_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError = "never responded";
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return;
      lastError = `status ${res.status}`;
    } catch (error) {
      lastError = String(error);
    }
    await sleep(250);
  }
  throw new Error(`Server not healthy on ${BASE} after ${timeoutMs}ms: ${lastError}`);
}

/** The served HTML is entity-encoded; the route inventory holds the raw text. */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/");
}

beforeAll(async () => {
  if (!existsSync(SERVER)) {
    throw new Error(`${SERVER} not found. Build first: CLIENT_ID=${client.id} npm run build`);
  }

  server = spawn("node", [SERVER], {
    env: { ...process.env, PORT: String(PORT), HOSTNAME: "127.0.0.1" },
    stdio: "ignore",
  });

  await waitForHealth();
});

afterAll(() => {
  server?.kill("SIGTERM");
});

describe(`API endpoints (${client.id})`, () => {
  it("GET /api/health returns 200 and JSON", async () => {
    const res = await fetch(`${BASE}/api/health`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it("does not answer POST on the health endpoint", async () => {
    // Only GET is exported, so anything else must be a 405, not a silent 200.
    const res = await fetch(`${BASE}/api/health`, { method: "POST" });
    expect(res.status).toBe(405);
  });
});

describe(`every route in the inventory is served (${client.id}: ${routes.length} routes)`, () => {
  it.each(routes.map((r) => [r.path, r] as const))("GET %s", async (path, route) => {
    const res = await fetch(`${BASE}${path}`);
    expect(res.status, `${path} returned ${res.status}`).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");

    const html = await res.text();

    // The check that catches drift: what the page says it is, versus what the sitemap
    // and the audit will claim it is. These come from one source and must stay equal.
    const title = decodeEntities(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "");
    expect(title, `${path} title`).toBe(route.title);

    const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
    expect(h1Count, `${path} should have exactly one h1`).toBe(1);

    expect(html, `${path} is missing a meta description`).toMatch(/<meta name="description"/);

    // Demo clients must never be indexable — fabricated NAP data staying out of the
    // index is the whole reason the flag exists.
    if (client.demo) {
      expect(html, `${path} should be noindex on a demo site`).toMatch(/noindex/);
    }
  });
});

describe(`routes that must not exist (${client.id})`, () => {
  // Every service × area pair the config wrote no copy for. This is the doorway-page
  // guard verified from outside the process: no unique prose, no page, 404.
  const generated = new Set(routes.filter((r) => r.kind === "areaService").map((r) => r.path));
  const ungenerated = client.serviceAreas.flatMap((area) =>
    client.services
      .map((service) => `/areas/${area.slug}/${service.slug}`)
      .filter((path) => !generated.has(path)),
  );

  it("has pairs that were deliberately not generated", () => {
    expect(ungenerated.length).toBeGreaterThan(0);
  });

  it.each(ungenerated.slice(0, 8))("404s on %s", async (path) => {
    const res = await fetch(`${BASE}${path}`);
    expect(res.status).toBe(404);
  });

  it.each(["/services/not-a-real-service", "/areas/not-a-real-suburb", "/nope"])(
    "404s on %s",
    async (path) => {
      const res = await fetch(`${BASE}${path}`);
      expect(res.status).toBe(404);
    },
  );
});

describe(`internal links resolve (${client.id})`, () => {
  it("every internal href on every page is a route that exists", async () => {
    const known = new Set(routes.map((r) => r.path));
    const broken: string[] = [];

    for (const route of routes) {
      const html = await (await fetch(`${BASE}${route.path}`)).text();
      const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);

      for (const href of new Set(hrefs)) {
        // Next's own asset paths are not pages.
        if (href.startsWith("/_next") || href.startsWith("/api")) continue;
        const normalised = href.length > 1 ? href.replace(/\/$/, "") : href;
        if (!known.has(normalised)) broken.push(`${route.path} -> ${href}`);
      }
    }

    expect(broken, broken.join("\n")).toEqual([]);
  });
});

/** Every JSON-LD payload embedded in a page. */
function jsonLdBlobs(html: string): string[] {
  return [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);
}

/**
 * Text content of every element carrying the given attribute.
 *
 * Matches to the element's own closing tag rather than the next `<`, because answer
 * bodies contain nested markup from the Markdown renderer — stopping at the first `<`
 * returns an empty string and makes a comparison test silently pass on nothing.
 */
function textOf(html: string, attribute: string): string[] {
  const pattern = new RegExp(`<(\\w+)[^>]*\\b${attribute}\\b[^>]*>([\\s\\S]*?)</\\1>`, "g");
  return [...html.matchAll(pattern)].map((m) =>
    decodeEntities(
      m[2]
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    ),
  );
}

describe(`structured data (${client.id})`, () => {
  it("emits a valid site entity graph on every page", async () => {
    for (const route of routes) {
      const html = await (await fetch(`${BASE}${route.path}`)).text();
      const blobs = jsonLdBlobs(html);
      expect(blobs.length, `${route.path} has no JSON-LD`).toBeGreaterThan(0);

      for (const blob of blobs) {
        const issues = validateJsonLdBlob(blob);
        expect(issues, `${route.path}: ${JSON.stringify(issues)}`).toEqual([]);
      }
    }
  });

  it("never serves aggregateRating anywhere on the site", async () => {
    for (const route of routes) {
      const html = await (await fetch(`${BASE}${route.path}`)).text();
      expect(html, `${route.path} leaked aggregateRating`).not.toContain("aggregateRating");
    }
  });

  it("escapes < in JSON-LD so config copy cannot break out of the script tag", async () => {
    const html = await (await fetch(`${BASE}/`)).text();
    for (const blob of jsonLdBlobs(html)) {
      expect(blob).not.toContain("</script");
      expect(blob).not.toMatch(/<[a-zA-Z/]/);
    }
  });

  it("declares exactly one FAQPage node per page, never more", async () => {
    for (const route of routes) {
      const html = await (await fetch(`${BASE}${route.path}`)).text();
      const faqNodes = jsonLdBlobs(html).filter((b) => b.includes('"FAQPage"'));
      expect(
        faqNodes.length,
        `${route.path} has ${faqNodes.length} FAQPage nodes`,
      ).toBeLessThanOrEqual(1);
    }
  });

  it("keeps the visible FAQs and the FAQ markup identical", async () => {
    // The single-source guarantee, checked against what the server actually sent —
    // stronger than asserting it in a component test, because it survives the whole
    // render pipeline.
    let pagesChecked = 0;

    for (const route of routes) {
      const html = await (await fetch(`${BASE}${route.path}`)).text();
      const faqNode = jsonLdBlobs(html).find((b) => b.includes('"FAQPage"'));
      if (!faqNode) continue;

      const parsed = JSON.parse(faqNode) as {
        mainEntity: { name: string; acceptedAnswer: { text: string } }[];
      };
      const markupQuestions = parsed.mainEntity.map((q) => q.name).sort();
      const visibleQuestions = textOf(html, "data-faq-q").sort();
      expect(visibleQuestions, `${route.path} question mismatch`).toEqual(markupQuestions);

      // Answers too, not just questions. Comparing only the questions would miss the
      // case where the rendered answer and the schema text disagree — which is the
      // drift most likely to happen, because the answer is where the markdown is.
      const answerText = (value: string) => value.replace(/\s+/g, " ").trim();
      const markupAnswers = parsed.mainEntity.map((q) => answerText(q.acceptedAnswer.text)).sort();
      const visibleAnswers = textOf(html, "data-faq-a").map(answerText).sort();
      expect(visibleAnswers, `${route.path} answer mismatch`).toEqual(markupAnswers);

      pagesChecked++;
    }

    expect(pagesChecked, "no page emitted FAQ markup, so nothing was verified").toBeGreaterThan(0);
  });
});

describe(`sitemap and robots (${client.id})`, () => {
  it("serves a sitemap listing exactly the indexable routes", async () => {
    const res = await fetch(`${BASE}/sitemap.xml`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("xml");

    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const expected = routes
      .filter((r) => r.indexable)
      .map((r) => (r.path === "/" ? client.site.url : `${client.site.url}${r.path}`));

    expect(urls.sort()).toEqual(expected.sort());
  });

  it("serves robots.txt with the sitemap and the configured AI crawler policy", async () => {
    const res = await fetch(`${BASE}/robots.txt`);
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain(`Sitemap: ${client.site.url}/sitemap.xml`);

    for (const rule of resolveAiRules(client.ai)) {
      expect(body, `${rule.userAgent} missing from robots.txt`).toContain(
        `User-Agent: ${rule.userAgent}`,
      );
    }
  });

  it("does not block crawlers on a demo site, so its noindex stays readable", async () => {
    // A Disallow would stop the crawler fetching the page, which means it never sees
    // the noindex meta tag — the page can then be indexed from inbound links anyway.
    if (!client.demo) return;
    const body = await (await fetch(`${BASE}/robots.txt`)).text();
    const wildcard = body.split(/User-Agent:/i)[1] ?? "";
    expect(wildcard).not.toMatch(/Disallow:\s*\/\s*$/m);
  });
});
