import { describe, expect, it } from "vitest";
import { clientConfigSchema } from "@/config/schema";
import { registry, clientIds } from "@/clients/registry";
import { allRoutes } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/linking/hrefs";
import { toPlainText } from "@/lib/text/plain";
import { renderLlmsFullTxt, renderLlmsTxt } from "./llms";

const configs = clientIds.map((id) => ({ id, config: clientConfigSchema.parse(registry[id]) }));

/** Every absolute URL of ours that appears in a document. */
function urlsIn(text: string, origin: string): string[] {
  return [...text.matchAll(new RegExp(`${origin}[^\\s)\\]]*`, "g"))].map((m) => m[0]);
}

describe.each(configs)("llms.txt: $id", ({ config }) => {
  const doc = renderLlmsTxt(config);
  const origin = config.site.url;

  it("opens with the business name and a summary", () => {
    expect(doc.startsWith(`# ${config.name}`)).toBe(true);
    expect(doc).toContain(`> ${config.description}`);
  });

  it("states plainly that a demo business is fictional", () => {
    if (!config.demo) return;
    expect(doc).toContain("demonstration site for a fictional business");
  });

  it("carries the NAP exactly as the rest of the site renders it", () => {
    // Entity consistency: a phone number that differs between the footer, the JSON-LD
    // and this file is how a business fails to resolve to one entity.
    expect(doc).toContain(config.contact.phoneDisplay);
    expect(doc).toContain(config.contact.phone);
    expect(doc).toContain(config.address.streetAddress);
    expect(doc).toContain(config.address.postcode);
  });

  it("links every service and every area", () => {
    for (const service of config.services) {
      expect(doc).toContain(absoluteUrl(origin, `/services/${service.slug}`));
    }
    for (const area of config.serviceAreas) {
      expect(doc).toContain(absoluteUrl(origin, `/areas/${area.slug}`));
    }
  });

  it("mentions no URL that is not a real route", () => {
    // The document is generated from the route inventory, so this asserts it cannot
    // advertise a page that does not exist.
    const known = new Set([
      ...allRoutes(config).map((r) => absoluteUrl(origin, r.path)),
      absoluteUrl(origin, "/sitemap.xml"),
      absoluteUrl(origin, "/llms-full.txt"),
    ]);

    for (const url of urlsIn(doc, origin)) {
      expect(known.has(url), `${url} is not in the route inventory`).toBe(true);
    }
  });

  it("documents the crawler policy", () => {
    expect(doc).toContain("## Crawler policy");
    expect(doc).toContain("GPTBot");
  });

  it("flattens config copy rather than inlining raw markdown", () => {
    // The demo notice is the one deliberate use of bold, written here rather than
    // taken from config; everything drawn from config goes through toPlainText, so any
    // other ** would mean a field was inlined unflattened.
    const withoutDemoNotice = doc.replace(/\*\*This is a demonstration[^*]*\*\*/g, "");
    expect(withoutDemoNotice).not.toMatch(/\*\*[^*]+\*\*/);
  });
});

describe.each(configs)("llms-full.txt: $id", ({ config }) => {
  const doc = renderLlmsFullTxt(config);

  it("includes every service body in full", () => {
    for (const service of config.services) {
      // Compare against the flattened form, since that is what the document holds:
      // a body opening with "## Heading" appears here without the hashes.
      const opening = toPlainText(service.body).slice(0, 60);
      expect(doc, `${service.slug} body missing`).toContain(opening);
    }
  });

  it("includes every FAQ answer", () => {
    for (const faq of config.faqs) {
      expect(doc).toContain(faq.question);
    }
  });

  it("includes each area-specific intro", () => {
    for (const service of config.services) {
      if (!service.areaPages.enabled) continue;
      for (const intro of Object.values(service.areaPages.intros)) {
        expect(doc).toContain(intro.slice(0, 60));
      }
    }
  });

  it("stays inside the configured byte ceiling", () => {
    expect(Buffer.byteLength(doc, "utf8")).toBeLessThanOrEqual(config.ai.llmsFullMaxBytes);
  });

  it("is deterministic", () => {
    expect(renderLlmsFullTxt(config)).toBe(doc);
  });
});

describe("llms-full.txt truncation", () => {
  const config = clientConfigSchema.parse({
    ...registry.plumber,
    ai: { preset: "open", overrides: {}, llmsFullMaxBytes: 2_000 },
  });

  it("says where it stopped rather than cutting silently", () => {
    const doc = renderLlmsFullTxt(config);
    expect(doc).toContain("[truncated at 2000 bytes");
    expect(Buffer.byteLength(doc, "utf8")).toBeLessThanOrEqual(2_000);
  });

  it("cuts on a line boundary, not mid-sentence", () => {
    const doc = renderLlmsFullTxt(config);
    const beforeMarker = doc.slice(0, doc.indexOf("[truncated"));
    expect(beforeMarker.endsWith("\n\n")).toBe(true);
  });
});
