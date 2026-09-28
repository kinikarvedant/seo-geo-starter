import { describe, expect, it } from "vitest";
import { clientConfigSchema } from "@/config/schema";
import { loadClient } from "@/config/load";
import { registry, clientIds } from "./registry";
import { scaleFrom } from "@/lib/theme/palette";
import { contrastRatio } from "@/lib/theme/color";
import { findSimilarPairs } from "@/lib/text/similarity";

/**
 * Every shipped client config is parsed here. This is the test that fails first when
 * someone adds a client and gets a slug wrong, and it runs in milliseconds — far
 * cheaper than discovering it during a Docker build.
 */
describe.each(clientIds)("client config: %s", (id) => {
  const result = clientConfigSchema.safeParse(registry[id]);

  it("parses against the schema", () => {
    if (!result.success) {
      throw new Error(
        result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n"),
      );
    }
    expect(result.success).toBe(true);
  });

  it("has an id matching its registry key", () => {
    expect(result.success && result.data.id).toBe(id);
  });

  it("is marked as a demo, because the business is fictional", () => {
    expect(result.success && result.data.demo).toBe(true);
  });

  it("keeps brand colours readable on white", () => {
    if (!result.success) return;
    const { primary, accent } = result.data.brand;
    expect(contrastRatio(scaleFrom(primary)[600], "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(scaleFrom(accent)[600], "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("gives every service a distinct short description", () => {
    if (!result.success) return;
    const descriptions = result.data.services.map((s) => s.shortDescription);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("gives every area a distinct blurb", () => {
    if (!result.success) return;
    const blurbs = result.data.serviceAreas.map((a) => a.blurb);
    expect(new Set(blurbs).size).toBe(blurbs.length);
  });

  it("writes a unique intro for every generated area page", () => {
    if (!result.success) return;
    const intros = result.data.services.flatMap((s) =>
      s.areaPages.enabled ? Object.values(s.areaPages.intros) : [],
    );
    expect(new Set(intros).size).toBe(intros.length);
  });

  it("has no near-duplicate prose anywhere in the config", () => {
    if (!result.success) return;
    const config = result.data;

    // Every piece of prose that reaches a page, labelled so a failure says where.
    // `body` and the FAQ answers matter most here: they are the bulk of each page, so
    // leaving them out would let someone clone a service wholesale and still pass.
    const prose: Record<string, string> = {};

    for (const area of config.serviceAreas) {
      prose[`area:${area.slug}`] = area.blurb;
    }

    config.faqs.forEach((faq, i) => {
      prose[`faq:site:${i}`] = faq.answer;
    });

    for (const service of config.services) {
      prose[`service:${service.slug}:answer`] = service.answer;
      prose[`service:${service.slug}:description`] = service.shortDescription;
      prose[`service:${service.slug}:body`] = service.body;

      service.faqs.forEach((faq, i) => {
        prose[`faq:${service.slug}:${i}`] = faq.answer;
      });

      if (service.areaPages.enabled) {
        for (const [area, intro] of Object.entries(service.areaPages.intros)) {
          prose[`intro:${service.slug}@${area}`] = intro;
        }
      }
    }

    // Uniqueness alone would pass suburb-swapped copy, which is exactly what the
    // doorway-page guard exists to stop. This is the check with teeth.
    const offenders = findSimilarPairs(prose, 0.5);
    expect(
      offenders,
      offenders.map((p) => `${p.a} ~ ${p.b} (${p.score.toFixed(2)})`).join("\n"),
    ).toEqual([]);
  });

  it("keeps every service answer inside snippet range", () => {
    if (!result.success) return;
    for (const service of result.data.services) {
      const words = service.answer.trim().split(/\s+/).length;
      // Snippet extractors truncate around here; outside this band the answer either
      // gets cut mid-sentence or is too thin to be worth quoting.
      expect(words, `${service.slug} answer is ${words} words`).toBeGreaterThanOrEqual(30);
      expect(words, `${service.slug} answer is ${words} words`).toBeLessThanOrEqual(75);
    }
  });

  it("never emits a self-serving aggregateRating", () => {
    if (!result.success) return;
    expect(result.data.trust.reviews?.emitSchema ?? false).toBe(false);
  });
});

describe("loadClient", () => {
  it.each(clientIds)("loads %s by id", (id) => {
    expect(loadClient(id).id).toBe(id);
  });

  it("names the known clients when given an unknown id", () => {
    expect(() => loadClient("not-a-client")).toThrow(/Unknown CLIENT_ID/);
  });

  it("gives every client a distinct origin", () => {
    // Read the authored origins, not loadClient's: NEXT_PUBLIC_SITE_URL legitimately
    // overrides every client with one value, and the README tells people to export it
    // for builds — so asserting on loadClient would fail on a correct tree.
    const origins = clientIds.map((id) => registry[id].site.url);
    expect(new Set(origins).size).toBe(origins.length);
  });

  it("rejects a malformed NEXT_PUBLIC_SITE_URL rather than baking it into canonicals", () => {
    const original = process.env.NEXT_PUBLIC_SITE_URL;
    try {
      // One missing "t". new URL() accepts this happily, which is exactly the problem.
      process.env.NEXT_PUBLIC_SITE_URL = "htps://bridgeroaddental.duckdns.org";
      expect(() => loadClient("dental")).toThrow(/not a valid http\(s\) origin/);

      process.env.NEXT_PUBLIC_SITE_URL = "bridgeroaddental.duckdns.org";
      expect(() => loadClient("dental")).toThrow(/not a valid http\(s\) origin/);
    } finally {
      if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = original;
    }
  });

  it("applies a valid NEXT_PUBLIC_SITE_URL and strips its trailing slash", () => {
    const original = process.env.NEXT_PUBLIC_SITE_URL;
    try {
      process.env.NEXT_PUBLIC_SITE_URL = "https://staging.example.com/";
      expect(loadClient("cafe").site.url).toBe("https://staging.example.com");
    } finally {
      if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = original;
    }
  });

  it("does not mistake a prototype property for a client id", () => {
    expect(() => loadClient("toString")).toThrow(/Unknown CLIENT_ID/);
    expect(() => loadClient("constructor")).toThrow(/Unknown CLIENT_ID/);
  });

  it("strips any trailing slash from the origin", () => {
    for (const id of clientIds) {
      expect(loadClient(id).site.url).not.toMatch(/\/$/);
    }
  });
});
