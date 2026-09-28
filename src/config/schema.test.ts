import { describe, expect, it } from "vitest";
import { clientConfigSchema, type ClientConfigInput } from "./schema";

/** Smallest config the schema accepts. Each test starts from this and breaks one thing. */
const minimal: ClientConfigInput = {
  id: "test-co",
  businessType: "plumber",
  name: "Test Co",
  tagline: "Plumbing that turns up",
  description:
    "A fictional plumbing business used to exercise the config schema in unit tests, with enough description text to clear the minimum length.",
  site: { url: "https://example.com/" },
  contact: {
    phone: "+61390001234",
    phoneDisplay: "(03) 9000 1234",
    email: "hello@example.com",
  },
  address: {
    streetAddress: "1 Test Street",
    suburb: "Brunswick",
    state: "VIC",
    postcode: "3056",
    geo: { lat: -37.767, lng: 144.96 },
  },
  hours: { alwaysOpen: true },
  serviceAreas: [
    {
      slug: "brunswick",
      name: "Brunswick",
      blurb:
        "Brunswick is a dense inner-north suburb where most of the housing stock predates modern plumbing standards, so callouts skew towards old copper and cast iron.",
    },
  ],
  services: [
    {
      slug: "blocked-drains",
      name: "Blocked drains",
      shortDescription:
        "Same-day blocked drain clearing across Melbourne's inner north, with a camera inspection included on every job.",
      answer:
        "We clear blocked drains the same day, using a camera inspection first so you know what caused the blockage before we quote. Most jobs take under two hours and we leave the pipe footage with you.",
      body: "A longer body field describing the service in detail. ".repeat(6),
    },
  ],
  brand: { primary: "#0f766e", accent: "#f59e0b" },
};

const parse = (overrides: Partial<ClientConfigInput> = {}) =>
  clientConfigSchema.safeParse({ ...minimal, ...overrides });

describe("clientConfigSchema", () => {
  it("accepts a minimal config and applies defaults", () => {
    const result = parse();
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.demo).toBe(false);
    expect(result.data.site.locale).toBe("en-AU");
    expect(result.data.ai.preset).toBe("open");
    expect(result.data.services[0].areaPages.enabled).toBe(false);
    expect(result.data.serviceAreas[0].priority).toBe(5);
  });

  it("strips the trailing slash from the site origin", () => {
    const result = parse();
    expect(result.success && result.data.site.url).toBe("https://example.com");
  });

  it("rejects a phone number that is not E.164", () => {
    const result = parse({ contact: { ...minimal.contact, phone: "0390001234" } });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0].path).toEqual(["contact", "phone"]);
  });

  it("rejects duplicate service slugs", () => {
    const result = parse({ services: [minimal.services[0], minimal.services[0]] });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.some((i) => i.message.includes("duplicate service slug"))).toBe(
      true,
    );
  });

  it("rejects a related service that does not exist", () => {
    const result = parse({
      services: [{ ...minimal.services[0], relatedServices: ["hot-water-repairs"] }],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0].message).toContain('unknown service "hot-water-repairs"');
  });

  it("rejects a service that lists itself as related", () => {
    const result = parse({
      services: [{ ...minimal.services[0], relatedServices: ["blocked-drains"] }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an area-page intro written for an unknown area", () => {
    const result = parse({
      services: [
        {
          ...minimal.services[0],
          areaPages: {
            enabled: true,
            titlePattern: "Blocked drains in {area}",
            intros: {
              coburg:
                "Coburg's drainage runs into an older council main, which is why tree-root intrusion shows up here more often than anywhere else we work in the inner north.",
            },
          },
        },
      ],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0].message).toContain('unknown area "coburg"');
  });

  it("requires a titlePattern containing {area} when area pages are enabled", () => {
    const result = parse({
      services: [
        {
          ...minimal.services[0],
          areaPages: {
            enabled: true,
            titlePattern: "Blocked drains near you",
            intros: {
              brunswick:
                "Brunswick's drainage runs into an older council main, which is why tree-root intrusion shows up here more often than anywhere else we work in the inner north.",
            },
          },
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an area page whose intro is too short to be unique copy", () => {
    const result = parse({
      services: [
        {
          ...minimal.services[0],
          areaPages: {
            enabled: true,
            titlePattern: "Blocked drains in {area}",
            intros: { brunswick: "Blocked drains in Brunswick." },
          },
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects area pages that are enabled but would generate nothing", () => {
    const result = parse({
      services: [
        {
          ...minimal.services[0],
          areaPages: { enabled: true, titlePattern: "Blocked drains in {area}", intros: {} },
        },
      ],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0].message).toContain("no intros");
  });

  describe("area adjacency", () => {
    const twoAreas = (a: string[], b: string[]) => [
      { ...minimal.serviceAreas[0], adjacentTo: a },
      {
        slug: "coburg",
        name: "Coburg",
        blurb:
          "Coburg's post-war brick veneer stock still has galvanised water service in the ground on plenty of streets, so the calls here are pinhole leaks rather than dramatic bursts.",
        adjacentTo: b,
      },
    ];

    it("accepts a symmetric edge", () => {
      const result = parse({ serviceAreas: twoAreas(["coburg"], ["brunswick"]) });
      expect(result.success).toBe(true);
    });

    it("rejects a one-way edge, which would be a one-way internal link", () => {
      const result = parse({ serviceAreas: twoAreas(["coburg"], []) });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].message).toContain("does not list");
    });
  });

  describe("opening hours", () => {
    const withHours = (regular: ClientConfigInput["hours"]["regular"]) =>
      parse({ hours: { alwaysOpen: false, regular } });

    it("rejects a day that closes before it opens", () => {
      const result = withHours([{ days: ["Mon"], opens: "17:00", closes: "09:00" }]);
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].message).toContain("alwaysOpen");
    });

    it("rejects a zero-length day", () => {
      expect(withHours([{ days: ["Mon"], opens: "09:00", closes: "09:00" }]).success).toBe(false);
    });

    it("rejects the same weekday appearing twice", () => {
      const result = withHours([
        { days: ["Mon"], opens: "08:00", closes: "12:00" },
        { days: ["Mon", "Tue"], opens: "09:00", closes: "17:00" },
      ]);
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].message).toContain("Mon already has hours");
    });

    it("rejects alwaysOpen alongside regular hours, which would contradict it", () => {
      const result = parse({
        hours: {
          alwaysOpen: true,
          regular: [{ days: ["Mon"], opens: "08:00", closes: "17:00" }],
        },
      });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].message).toContain("contradict");
    });
  });

  it("rejects an unknown adjacent area", () => {
    const result = parse({
      serviceAreas: [{ ...minimal.serviceAreas[0], adjacentTo: ["fitzroy"] }],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0].message).toContain('unknown area "fitzroy"');
  });

  it("requires hours unless the business is always open", () => {
    const result = parse({ hours: { alwaysOpen: false, regular: [] } });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0].path).toEqual(["hours"]);
  });

  it("accepts regular opening hours", () => {
    const result = parse({
      hours: {
        regular: [{ days: ["Mon", "Tue", "Wed", "Thu", "Fri"], opens: "08:00", closes: "17:30" }],
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a brand colour that is not hex", () => {
    const result = parse({ brand: { primary: "teal", accent: "#f59e0b" } });
    expect(result.success).toBe(false);
  });

  it("cannot be configured to emit aggregateRating", () => {
    const result = parse({
      trust: {
        // @ts-expect-error emitSchema is typed as literal false on purpose
        reviews: { rating: 4.9, count: 120, source: "Google", emitSchema: true },
      },
    });
    expect(result.success).toBe(false);
  });
});
