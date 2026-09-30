import { describe, expect, it } from "vitest";
import { clientConfigSchema } from "@/config/schema";
import { registry, clientIds } from "@/clients/registry";
import {
  localBusinessJsonLd,
  organizationJsonLd,
  websiteJsonLd,
  LOCAL_BUSINESS_TYPE,
} from "./business";
import { breadcrumbListJsonLd, faqPageJsonLd, serviceJsonLd } from "./content";
import { siteGraphJsonLd } from "./graph";
import { ids } from "./ids";
import { validateJsonLdBlob, validators } from "./validators";
import { toPlainText } from "@/lib/text/plain";

const configs = clientIds.map((id) => ({ id, config: clientConfigSchema.parse(registry[id]) }));

describe.each(configs)("structured data: $id", ({ config }) => {
  it("uses the right LocalBusiness subtype for the business", () => {
    const node = localBusinessJsonLd(config);
    expect(node["@type"]).toBe(LOCAL_BUSINESS_TYPE[config.businessType]);
  });

  it("passes the LocalBusiness contract", () => {
    const result = validators.LocalBusiness.safeParse(localBusinessJsonLd(config));
    expect(result.success, result.success ? "" : JSON.stringify(result.error.issues, null, 2)).toBe(
      true,
    );
  });

  it("passes the Organization and WebSite contracts", () => {
    expect(validators.Organization.safeParse(organizationJsonLd(config)).success).toBe(true);
    expect(validators.WebSite.safeParse(websiteJsonLd(config)).success).toBe(true);
  });

  it("never emits aggregateRating, whatever the config says about reviews", () => {
    const serialised = JSON.stringify(siteGraphJsonLd(config));
    expect(serialised).not.toContain("aggregateRating");
    expect(serialised).not.toContain('"review"');
  });

  it("gives the business stable ids that other nodes can reference", () => {
    const node = localBusinessJsonLd(config);
    expect(node["@id"]).toBe(ids.localBusiness(config));
    expect(node.parentOrganization).toEqual({ "@id": ids.organization(config) });
  });

  it("references the business by id from services rather than copying it", () => {
    for (const service of config.services) {
      const node = serviceJsonLd(config, service);
      expect(node.provider).toEqual({ "@id": ids.localBusiness(config) });
      expect(validators.Service.safeParse(node).success).toBe(true);
    }
  });

  it("emits opening hours that match the config", () => {
    const node = localBusinessJsonLd(config);
    const spec = node.openingHoursSpecification;

    if (config.hours.alwaysOpen) {
      // A 24/7 business collapses to one entry, not seven identical ones.
      expect(spec).toHaveLength(1);
      expect(spec[0].dayOfWeek).toHaveLength(7);
    } else {
      expect(spec).toHaveLength(config.hours.regular.length);
    }
  });

  it("lists every service area the config declares", () => {
    const node = localBusinessJsonLd(config);
    const served = node.areaServed.map((a) => a.name);
    expect(served.sort()).toEqual(config.serviceAreas.map((a) => a.name).sort());
  });

  it("puts a price on exactly the services that declare one", () => {
    for (const service of config.services) {
      const node = serviceJsonLd(config, service);
      if (service.priceFrom) {
        expect(node.offers).toMatchObject({
          price: service.priceFrom.amount,
          priceCurrency: service.priceFrom.currency,
        });
      } else {
        // An invented price is worse than no price.
        expect(node.offers).toBeUndefined();
      }
    }
  });

  it("validates the whole site graph through the shared blob validator", () => {
    const issues = validateJsonLdBlob(JSON.stringify(siteGraphJsonLd(config)));
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
  });

  it("emits the site graph once, with the context only on the wrapper", () => {
    const graph = siteGraphJsonLd(config);
    expect(graph["@graph"]).toHaveLength(3);
    for (const node of graph["@graph"]) {
      expect(node).not.toHaveProperty("@context");
    }
  });
});

describe("FAQPage", () => {
  const config = clientConfigSchema.parse(registry.dental);
  const pageUrl = `${config.site.url}/faq`;

  it("passes the FAQPage contract", () => {
    const node = faqPageJsonLd(config.faqs, pageUrl);
    expect(validators.FAQPage.safeParse(node).success).toBe(true);
  });

  it("carries one Question per configured FAQ, in order", () => {
    const node = faqPageJsonLd(config.faqs, pageUrl);
    expect(node.mainEntity).toHaveLength(config.faqs.length);
    expect(node.mainEntity.map((q) => q.name)).toEqual(config.faqs.map((f) => f.question));
  });

  it("strips markdown from the answer text, since schema wants plain text", () => {
    const node = faqPageJsonLd(
      [
        {
          question: "Do you take health funds?",
          answer: "Yes — we have **HICAPS** on site, see [our fees](/fees) for detail.",
          tags: [],
        },
      ],
      pageUrl,
    );
    const text = node.mainEntity[0].acceptedAnswer.text;
    expect(text).toBe("Yes — we have HICAPS on site, see our fees for detail.");
    expect(text).not.toContain("**");
    expect(text).not.toContain("](");
  });

  it("derives its text from the same string the page renders", () => {
    // The single-source guarantee, asserted rather than assumed: schema text is a pure
    // transform of the authored answer, so the two cannot describe different things.
    for (const faq of config.faqs) {
      const node = faqPageJsonLd([faq], pageUrl);
      const text = node.mainEntity[0].acceptedAnswer.text;
      expect(text).toBe(toPlainText(faq.answer));
    }
  });
});

describe("BreadcrumbList", () => {
  const origin = "https://bridgeroaddental.duckdns.org";

  it("numbers positions from 1, contiguously", () => {
    const node = breadcrumbListJsonLd(origin, [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Emergency dentist", href: "/services/emergency-dentist" },
    ]);

    expect(node.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(validators.BreadcrumbList.safeParse(node).success).toBe(true);
  });

  it("makes every item an absolute URL", () => {
    const node = breadcrumbListJsonLd(origin, [{ label: "Home", href: "/" }]);
    expect(node.itemListElement[0].item).toBe(origin);
  });

  it("is rejected by the validator when positions are not contiguous", () => {
    const broken = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: origin },
        { "@type": "ListItem", position: 3, name: "Services", item: `${origin}/services` },
      ],
    };
    expect(validators.BreadcrumbList.safeParse(broken).success).toBe(false);
  });
});

describe("area-scoped service nodes", () => {
  const config = clientConfigSchema.parse(registry.plumber);
  const service = config.services.find((s) => s.areaPages.enabled)!;
  const areaSlug = Object.keys(service.areaPages.enabled ? service.areaPages.intros : {})[0];

  it("gets its own @id, so it is a different entity from the parent service", () => {
    const parent = serviceJsonLd(config, service);
    const scoped = serviceJsonLd(config, service, { areaSlug });

    // Sharing the parent's @id would publish one entity whose areaServed contradicts
    // itself once per area page, since consumers merge nodes by @id.
    expect(scoped["@id"]).not.toBe(parent["@id"]);
    expect(scoped["@id"]).toBe(ids.areaService(config, areaSlug, service.slug));
  });

  it("points its url at the page it actually appears on", () => {
    const scoped = serviceJsonLd(config, service, { areaSlug });
    expect(scoped.url).toBe(`${config.site.url}/areas/${areaSlug}/${service.slug}`);
  });

  it("narrows areaServed to that one suburb", () => {
    const scoped = serviceJsonLd(config, service, { areaSlug });
    const expected = config.serviceAreas.find((a) => a.slug === areaSlug)!.name;
    expect(scoped.areaServed.map((a) => a.name)).toEqual([expected]);
  });

  it("still references the one business by id", () => {
    const scoped = serviceJsonLd(config, service, { areaSlug });
    expect(scoped.provider).toEqual({ "@id": ids.localBusiness(config) });
  });
});

describe("validateJsonLdBlob", () => {
  it("reports unparseable JSON rather than throwing", () => {
    const issues = validateJsonLdBlob("{not json");
    expect(issues).toHaveLength(1);
    expect(issues[0].type).toBe("(unparseable)");
  });

  it("catches a business node that is missing its address", () => {
    const issues = validateJsonLdBlob(
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Dentist",
        "@id": "https://example.com/#localbusiness",
        name: "Test",
        telephone: "+61390001234",
      }),
    );
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((i) => i.message.includes("address"))).toBe(true);
  });

  it("rejects aggregateRating wherever it appears", () => {
    const config = clientConfigSchema.parse(registry.dental);
    const node = {
      ...localBusinessJsonLd(config),
      aggregateRating: { "@type": "AggregateRating", ratingValue: 4.9, reviewCount: 312 },
    };
    const issues = validateJsonLdBlob(JSON.stringify(node));
    expect(issues.some((i) => i.message.includes("aggregateRating"))).toBe(true);
  });

  it("reports a malformed @graph instead of throwing", () => {
    // This is the audit's entry point for HTML we did not write, so it has to survive
    // whatever it is handed.
    expect(() =>
      validateJsonLdBlob(JSON.stringify({ "@context": "https://schema.org", "@graph": {} })),
    ).not.toThrow();
    expect(
      validateJsonLdBlob(JSON.stringify({ "@context": "https://schema.org", "@graph": {} })),
    ).toEqual([{ type: "(root)", message: "@graph must be an array" }]);
  });

  it("ignores types it holds no contract for", () => {
    expect(
      validateJsonLdBlob(JSON.stringify({ "@context": "https://schema.org", "@type": "Recipe" })),
    ).toEqual([]);
  });
});
