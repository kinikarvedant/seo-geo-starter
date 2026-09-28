/**
 * The client config schema.
 *
 * Every other module derives its types from here, and `loadClient()` parses against
 * this at module-init time — so an invalid config fails `next build`, not a request.
 *
 * Two rules this schema enforces structurally, rather than by convention:
 *
 * 1. A service-area page cannot exist without unique prose written for that area
 *    (`areaPages.intros`). Templated "Emergency plumber in {suburb}" pages with nothing
 *    but the suburb swapped are what Google's doorway-page policy targets. A schema that
 *    cannot express the bad version beats a lint rule someone disables.
 *
 * 2. An FAQ answer is ONE field. The visible copy and the FAQPage JSON-LD are both
 *    derived from it, so they cannot drift apart. See components/aeo/FAQSection.tsx.
 */
import { z } from "zod";

/** Kebab-case, used for every URL segment we generate. */
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case, e.g. emergency-plumber");

const hex = z
  .string()
  .regex(/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i, "must be a hex colour, e.g. #0f766e");

/** E.164 — the only phone format schema.org and tel: links both accept unambiguously. */
const e164 = z.string().regex(/^\+[1-9]\d{7,14}$/, "must be E.164, e.g. +61390001234");

const time24 = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "must be 24h HH:MM");

const postcode = z.string().regex(/^\d{4}$/, "must be a 4-digit Australian postcode");

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/**
 * The LocalBusiness subtype each business maps to in schema.org. Driving this from an
 * enum rather than a free string means a typo is a compile error, and the JSON-LD
 * generator can exhaustively switch on it.
 */
export const businessTypeSchema = z.enum(["dentist", "cafe", "plumber", "generic"]);
export type BusinessType = z.infer<typeof businessTypeSchema>;

const hoursSchema = z.object({
  days: z.array(z.enum(DAYS)).min(1),
  opens: time24,
  closes: time24,
});

const faqSchema = z.object({
  question: z.string().min(8).max(160),
  /**
   * Single source for both the rendered answer and the JSON-LD `acceptedAnswer.text`.
   * A limited inline-markdown subset is allowed; JSON-LD gets `toPlainText(answer)`.
   */
  answer: z.string().min(40).max(1200),
  tags: z.array(slug).default([]),
});

const keyFactSchema = z.object({
  label: z.string().min(2).max(40),
  value: z.string().min(1).max(120),
});

/**
 * Service-area pages are opt-in per service, and only for areas with unique copy.
 * The discriminated union makes `intros` unreachable unless `enabled` is true.
 */
const areaPagesSchema = z
  .discriminatedUnion("enabled", [
    z.object({ enabled: z.literal(false) }),
    z.object({
      enabled: z.literal(true),
      /** Must contain "{area}", e.g. "Emergency plumber in {area}". */
      titlePattern: z.string().includes("{area}"),
      /** area slug -> unique intro prose. No area key, no page. */
      intros: z.record(slug, z.string().min(140)),
    }),
  ])
  .default({ enabled: false });

const serviceSchema = z.object({
  slug,
  name: z.string().min(3).max(70),
  /** Groups services so "related services" can be derived without hand-maintained lists. */
  category: slug.optional(),
  /** Doubles as the meta description, hence the 160-char ceiling. */
  shortDescription: z.string().min(70).max(160),
  /**
   * The answer-first block: a direct 40–60 word answer rendered as the first paragraph.
   * This is the text most likely to be lifted into a featured snippet or an AI answer.
   */
  answer: z.string().min(120).max(420),
  body: z.string().min(200),
  keyFacts: z.array(keyFactSchema).max(6).default([]),
  priceFrom: z
    .object({
      amount: z.number().positive(),
      currency: z.literal("AUD"),
      qualifier: z.string().max(60).optional(),
    })
    .optional(),
  faqs: z.array(faqSchema).default([]),
  relatedServices: z.array(slug).default([]),
  areaPages: areaPagesSchema,
});

const serviceAreaSchema = z.object({
  slug,
  name: z.string().min(2).max(60),
  state: z.string().default("VIC"),
  postcode: postcode.optional(),
  geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
  /** Ordering weight for internal links and sitemap priority. */
  priority: z.number().int().min(1).max(10).default(5),
  /** Unique per area — never templated. Same reasoning as areaPages.intros. */
  blurb: z.string().min(120).max(600),
  landmarks: z.array(z.string().max(80)).max(6).default([]),
  /** Edges in the internal-link graph. */
  adjacentTo: z.array(slug).default([]),
});

export const clientConfigSchema = z
  .object({
    id: slug,
    businessType: businessTypeSchema,
    /**
     * Fictional showcase site. Forces noindex on every page and renders a visible
     * banner. Fake local-business data must not enter the search index: it pollutes
     * local results and can tangle with real Google Business Profile matching.
     * robots.txt, llms.txt and sitemap.xml stay live and honest so the demo still
     * demonstrates exactly what it claims to.
     */
    demo: z.boolean().default(false),

    name: z.string().min(2).max(70),
    legalName: z.string().max(120).optional(),
    tagline: z.string().min(10).max(90),
    description: z.string().min(70).max(300),
    foundedYear: z.number().int().min(1800).max(2100).optional(),

    site: z.object({
      /** Dev/default origin. Overridden at build time by NEXT_PUBLIC_SITE_URL. */
      url: z.url().transform((u) => u.replace(/\/+$/, "")),
      locale: z.string().default("en-AU"),
      timezone: z.string().default("Australia/Melbourne"),
      titleTemplate: z.string().includes("%s").default("%s | %site%"),
    }),

    contact: z.object({
      phone: e164,
      /** Human-readable form, e.g. "(03) 9000 1234". Must stay consistent site-wide. */
      phoneDisplay: z.string().min(6).max(30),
      email: z.email(),
      bookingUrl: z.url().optional(),
      emergency: z.boolean().default(false),
    }),

    address: z.object({
      streetAddress: z.string().min(4).max(120),
      suburb: z.string().min(2).max(60),
      state: z.string().min(2).max(3),
      postcode,
      country: z.string().default("AU"),
      geo: z.object({ lat: z.number(), lng: z.number() }),
      mapUrl: z.url().optional(),
    }),

    hours: z.object({
      regular: z.array(hoursSchema).default([]),
      alwaysOpen: z.boolean().default(false),
      closures: z.array(z.object({ date: z.string(), name: z.string().max(60) })).default([]),
    }),

    serviceAreas: z.array(serviceAreaSchema).min(1),
    services: z.array(serviceSchema).min(1),
    /** Site-wide FAQs, rendered on /faq. Per-service FAQs live on the service. */
    faqs: z.array(faqSchema).default([]),

    brand: z.object({
      /** Only two colours are authored; the 50–950 ramp is derived. See lib/theme. */
      primary: hex,
      accent: hex,
      /** Bundled font pairings — arbitrary font names can't be self-hosted, and a
       *  Google Fonts request costs LCP, so this is an enum rather than a string. */
      fontPair: z.enum(["sans-modern", "serif-editorial", "geometric"]).default("sans-modern"),
      radius: z.enum(["none", "sm", "md", "lg", "full"]).default("md"),
      logoText: z.string().min(1).max(40).optional(),
    }),

    social: z
      .object({
        facebook: z.url().optional(),
        instagram: z.url().optional(),
        linkedin: z.url().optional(),
        youtube: z.url().optional(),
        /** The strongest sameAs signal for local entity resolution. */
        googleBusinessProfile: z.url().optional(),
      })
      .prefault({}),

    analytics: z
      .object({
        ga4MeasurementId: z
          .string()
          .regex(/^G-[A-Z0-9]+$/)
          .optional(),
        gtmContainerId: z
          .string()
          .regex(/^GTM-[A-Z0-9]+$/)
          .optional(),
        consentMode: z.enum(["off", "basic", "advanced"]).default("basic"),
      })
      .prefault({}),

    ai: z
      .object({
        /**
         * open        — every AI crawler allowed (default; being cited is the point)
         * search-only — retrieval/citation bots allowed, training crawlers denied
         * closed      — all denied
         */
        preset: z.enum(["open", "search-only", "closed"]).default("open"),
        /** Per-user-agent overrides applied on top of the preset. */
        overrides: z.record(z.string(), z.enum(["allow", "disallow"])).prefault({}),
        llmsFullMaxBytes: z.number().int().positive().default(400_000),
      })
      .prefault({}),

    trust: z
      .object({
        abn: z.string().max(20).optional(),
        licenceNumber: z.string().max(40).optional(),
        /**
         * Self-serving aggregateRating on your own site is against Google's structured
         * data policy and risks a manual action, so emitting it is typed impossible.
         * The numbers may still be shown as plain copy.
         */
        reviews: z
          .object({
            rating: z.number().min(1).max(5),
            count: z.number().int().positive(),
            source: z.string().max(60),
            emitSchema: z.literal(false).default(false),
          })
          .optional(),
      })
      .prefault({}),
  })
  .superRefine((c, ctx) => {
    const dupes = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i);

    for (const dup of dupes(c.services.map((s) => s.slug))) {
      ctx.addIssue({
        code: "custom",
        path: ["services"],
        message: `duplicate service slug "${dup}"`,
      });
    }
    for (const dup of dupes(c.serviceAreas.map((a) => a.slug))) {
      ctx.addIssue({
        code: "custom",
        path: ["serviceAreas"],
        message: `duplicate area slug "${dup}"`,
      });
    }

    const serviceSlugs = new Set(c.services.map((s) => s.slug));
    const areaSlugs = new Set(c.serviceAreas.map((a) => a.slug));

    c.services.forEach((s, i) => {
      for (const related of s.relatedServices) {
        if (related === s.slug) {
          ctx.addIssue({
            code: "custom",
            path: ["services", i, "relatedServices"],
            message: `"${s.slug}" lists itself as a related service`,
          });
        } else if (!serviceSlugs.has(related)) {
          ctx.addIssue({
            code: "custom",
            path: ["services", i, "relatedServices"],
            message: `unknown service "${related}"`,
          });
        }
      }
      if (s.areaPages.enabled) {
        // Enabled with no intros generates nothing at all — almost certainly a mistake,
        // and a silent one. Not covering *every* area is fine and deliberate: a page
        // exists only where there is real local copy for it.
        if (Object.keys(s.areaPages.intros).length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["services", i, "areaPages", "intros"],
            message: `"${s.slug}" enables area pages but has no intros, so no pages would be generated`,
          });
        }
        for (const area of Object.keys(s.areaPages.intros)) {
          if (!areaSlugs.has(area)) {
            ctx.addIssue({
              code: "custom",
              path: ["services", i, "areaPages", "intros"],
              message: `intro written for unknown area "${area}"`,
            });
          }
        }
      }
    });

    const adjacency = new Map(c.serviceAreas.map((a) => [a.slug, new Set(a.adjacentTo)]));

    c.serviceAreas.forEach((a, i) => {
      for (const adjacent of a.adjacentTo) {
        if (adjacent === a.slug) {
          ctx.addIssue({
            code: "custom",
            path: ["serviceAreas", i, "adjacentTo"],
            message: `"${a.slug}" is listed as adjacent to itself`,
          });
        } else if (!areaSlugs.has(adjacent)) {
          ctx.addIssue({
            code: "custom",
            path: ["serviceAreas", i, "adjacentTo"],
            message: `unknown area "${adjacent}"`,
          });
        } else if (!adjacency.get(adjacent)?.has(a.slug)) {
          // Adjacency is geography, so it is symmetric. A one-way edge produces a
          // one-way internal link, which is a crawl dead end rather than a loop.
          ctx.addIssue({
            code: "custom",
            path: ["serviceAreas", i, "adjacentTo"],
            message: `"${a.slug}" lists "${adjacent}" as adjacent, but "${adjacent}" does not list "${a.slug}" back`,
          });
        }
      }
    });

    // Opening hours end up in LocalBusiness JSON-LD, which this schema exists to keep
    // honest. Contradictory hours there are worse than no hours: they are a claim.
    const seenDays = new Map<string, number>();
    c.hours.regular.forEach((block, i) => {
      if (block.closes <= block.opens) {
        ctx.addIssue({
          code: "custom",
          path: ["hours", "regular", i],
          message:
            `closes (${block.closes}) is not after opens (${block.opens}). ` +
            `For a business trading around the clock use hours.alwaysOpen instead.`,
        });
      }
      for (const day of block.days) {
        const previous = seenDays.get(day);
        if (previous !== undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["hours", "regular", i, "days"],
            message: `${day} already has hours in entry ${previous}`,
          });
        } else {
          seenDays.set(day, i);
        }
      }
    });

    if (c.hours.alwaysOpen && c.hours.regular.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["hours"],
        message: "alwaysOpen is set, so hours.regular would contradict it — leave it empty",
      });
    }

    if (!c.hours.alwaysOpen && c.hours.regular.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["hours"],
        message: "set hours.regular, or hours.alwaysOpen for a 24/7 business",
      });
    }
  });

export type ClientConfig = z.infer<typeof clientConfigSchema>;
export type ClientConfigInput = z.input<typeof clientConfigSchema>;
export type Service = ClientConfig["services"][number];
export type ServiceArea = ClientConfig["serviceAreas"][number];
export type Faq = ClientConfig["faqs"][number];
export type KeyFact = z.infer<typeof keyFactSchema>;
export type Hours = z.infer<typeof hoursSchema>;
export type Brand = ClientConfig["brand"];
