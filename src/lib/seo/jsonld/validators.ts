import { z } from "zod";

/**
 * Runtime checks for the properties each structured-data type actually needs.
 *
 * TypeScript via schema-dts stops you naming a property that does not exist in the
 * vocabulary. It does not stop you omitting one a consumer requires — nearly every
 * schema.org property is optional in the ontology, while Google's documented
 * requirements are much narrower. These encode that narrower contract.
 *
 * Deliberately shared between the unit tests and the site audit, so a page is judged
 * against exactly the same rules whether it is checked in memory or over HTTP.
 */

const nonEmpty = z.string().min(1);

/**
 * Optional on each node: inside an `@graph` the context sits once on the wrapper, and
 * repeating it on every member is legal but redundant. `validateJsonLdBlob` checks the
 * document itself carries one.
 */
const context = z.literal("https://schema.org").optional();

/**
 * Properties that must never appear, checked against the raw node rather than through
 * a Zod refinement: `z.object()` strips unknown keys before refinements run, so a
 * refinement here would silently never fire — it would look like a guard and be none.
 */
export const FORBIDDEN_PROPERTIES = ["aggregateRating", "review", "reviews"] as const;

export const postalAddressSchema = z.object({
  "@type": z.literal("PostalAddress"),
  streetAddress: nonEmpty,
  addressLocality: nonEmpty,
  addressRegion: nonEmpty,
  postalCode: nonEmpty,
  addressCountry: nonEmpty,
});

export const localBusinessSchema = z.object({
  "@context": context,
  "@type": nonEmpty,
  "@id": z.url(),
  name: nonEmpty,
  telephone: nonEmpty,
  address: postalAddressSchema,
  geo: z.object({
    "@type": z.literal("GeoCoordinates"),
    latitude: z.number(),
    longitude: z.number(),
  }),
  openingHoursSpecification: z
    .array(
      z.object({
        "@type": z.literal("OpeningHoursSpecification"),
        dayOfWeek: z.array(nonEmpty).min(1),
        opens: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
        closes: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
      }),
    )
    .min(1),
});

export const organizationSchema = z.object({
  "@context": context,
  "@type": z.literal("Organization"),
  "@id": z.url(),
  name: nonEmpty,
  url: z.url(),
  address: postalAddressSchema,
});

export const websiteSchema = z.object({
  "@context": context,
  "@type": z.literal("WebSite"),
  "@id": z.url(),
  url: z.url(),
  name: nonEmpty,
  publisher: z.object({ "@id": z.url() }),
});

export const serviceSchema = z.object({
  "@context": context,
  "@type": z.literal("Service"),
  "@id": z.url(),
  name: nonEmpty,
  description: nonEmpty,
  // A reference, not an inlined copy of the business.
  provider: z.object({ "@id": z.url() }),
});

export const faqPageSchema = z.object({
  "@context": context,
  "@type": z.literal("FAQPage"),
  mainEntity: z
    .array(
      z.object({
        "@type": z.literal("Question"),
        name: nonEmpty,
        acceptedAnswer: z.object({
          "@type": z.literal("Answer"),
          text: nonEmpty,
        }),
      }),
    )
    .min(1),
});

export const breadcrumbListSchema = z
  .object({
    "@context": context,
    "@type": z.literal("BreadcrumbList"),
    itemListElement: z
      .array(
        z.object({
          "@type": z.literal("ListItem"),
          position: z.number().int().positive(),
          name: nonEmpty,
          item: z.url(),
        }),
      )
      .min(1),
  })
  // Google discards the whole breadcrumb if positions are not 1..n contiguous.
  .refine((node) => node.itemListElement.every((item, i) => item.position === i + 1), {
    message: "breadcrumb positions must be 1..n with no gaps",
  });

export const validators = {
  Organization: organizationSchema,
  LocalBusiness: localBusinessSchema,
  WebSite: websiteSchema,
  Service: serviceSchema,
  FAQPage: faqPageSchema,
  BreadcrumbList: breadcrumbListSchema,
} as const;

export interface JsonLdIssue {
  type: string;
  message: string;
}

/**
 * Validates a raw `<script type="application/ld+json">` payload. Used by the audit to
 * judge a served page by the same rules the unit tests apply to the generators.
 */
export function validateJsonLdBlob(raw: string): JsonLdIssue[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return [{ type: "(unparseable)", message: String(error) }];
  }

  let nodes: unknown[];
  if (Array.isArray(parsed)) {
    nodes = parsed;
  } else if (typeof parsed === "object" && parsed !== null && "@graph" in parsed) {
    const graph = (parsed as { "@graph": unknown })["@graph"];
    // This judges HTML we did not write, so a non-array @graph is a finding rather
    // than a crash inside the audit.
    if (!Array.isArray(graph)) {
      return [{ type: "(root)", message: "@graph must be an array" }];
    }
    nodes = graph;
  } else {
    nodes = [parsed];
  }

  const issues: JsonLdIssue[] = [];

  // The document must declare its vocabulary once, either on the wrapper or on each
  // standalone node.
  const documentContext = (parsed as { "@context"?: unknown })?.["@context"];
  const hasWrapperContext = documentContext === "https://schema.org";

  for (const node of nodes) {
    const type = (node as { "@type"?: string })?.["@type"];
    if (!type) {
      issues.push({ type: "(none)", message: "node has no @type" });
      continue;
    }

    if (!hasWrapperContext) {
      const nodeContext = (node as { "@context"?: unknown })["@context"];
      if (nodeContext !== "https://schema.org") {
        issues.push({ type, message: "@context: missing https://schema.org" });
      }
    }

    // Checked on the raw node, before Zod strips anything it does not know about.
    for (const forbidden of FORBIDDEN_PROPERTIES) {
      if (typeof node === "object" && node !== null && forbidden in node) {
        issues.push({
          type,
          message: `${forbidden} must never be emitted on a business's own site — it is a Google structured-data policy violation`,
        });
      }
    }

    // Business subtypes (Dentist, Plumber, …) are all judged as LocalBusiness.
    const key =
      type in validators
        ? (type as keyof typeof validators)
        : ["Dentist", "CafeOrCoffeeShop", "Plumber"].includes(type)
          ? ("LocalBusiness" as const)
          : undefined;

    if (!key) continue; // a type we hold no contract for

    const result = validators[key].safeParse(node);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          type,
          message: `${issue.path.join(".") || "(root)"}: ${issue.message}`,
        });
      }
    }
  }

  return issues;
}
