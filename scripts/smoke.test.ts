import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { client } from "@/config/load";
import { allRoutes } from "@/lib/seo/routes";

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
