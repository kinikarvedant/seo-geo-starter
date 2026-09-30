import type { BreadcrumbList, FAQPage, Service, WithContext } from "schema-dts";
import type { ClientConfig, Faq, Service as ServiceConfig } from "@/config/schema";
import { absoluteUrl } from "@/lib/linking/hrefs";
import type { Crumb } from "@/components/layout/Breadcrumbs";
import { ids } from "./ids";
import { toPlainText } from "@/lib/text/plain";

/**
 * `satisfies` rather than an explicit return type throughout this file: schema-dts
 * checks the literal against the real vocabulary, but its property types are unions
 * wide enough that callers cannot read the fields back. See business.ts for the detail.
 */
export function serviceJsonLd(
  c: ClientConfig,
  service: ServiceConfig,
  options: { areaSlug?: string } = {},
) {
  const areas = options.areaSlug
    ? c.serviceAreas.filter((a) => a.slug === options.areaSlug)
    : c.serviceAreas;

  // An area-scoped node is its own entity with its own id and url. Sharing the parent
  // service's @id would publish one entity whose areaServed contradicts itself once
  // per area page.
  const id = options.areaSlug
    ? ids.areaService(c, options.areaSlug, service.slug)
    : ids.service(c, service.slug);
  const url = options.areaSlug
    ? absoluteUrl(c.site.url, `/areas/${options.areaSlug}/${service.slug}`)
    : absoluteUrl(c.site.url, `/services/${service.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": id,
    name: service.name,
    description: service.shortDescription,
    url,
    // By reference, not by value: the business is defined once, in the site graph.
    provider: { "@id": ids.localBusiness(c) },
    areaServed: areas.map((area) => ({
      "@type": "City" as const,
      name: area.name,
    })),
    ...(service.category ? { serviceType: service.category } : {}),
    ...(service.priceFrom
      ? {
          offers: {
            "@type": "Offer" as const,
            price: service.priceFrom.amount,
            priceCurrency: service.priceFrom.currency,
            availability: "https://schema.org/InStock",
            ...(service.priceFrom.qualifier ? { description: service.priceFrom.qualifier } : {}),
          },
        }
      : {}),
  } satisfies WithContext<Service>;
}

/**
 * FAQPage markup.
 *
 * Only `FAQSection` may call this — an ESLint rule enforces that. The reason is the
 * single-source guarantee: the visible questions and this markup must come from one
 * array in one render, or they drift the first time someone edits the copy without
 * touching the schema. A page that could emit FAQ markup without rendering the FAQs
 * would break that.
 *
 * Note on expectations: Google restricted FAQ rich results to authoritative government
 * and health sites in 2023, so this will not generally produce the expandable snippet
 * any more. It is still worth emitting — answer-extraction for AI answers and voice
 * reads it — but the README must not promise rich results.
 */
export function faqPageJsonLd(faqs: readonly Faq[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question" as const,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        // The visible answer may carry light markdown; the schema wants plain text.
        // Both are transforms of the same string, so they cannot disagree.
        text: toPlainText(faq.answer),
      },
    })),
  } satisfies WithContext<FAQPage>;
}

export function breadcrumbListJsonLd(origin: string, trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem" as const,
      // 1-based and contiguous. Google drops the whole breadcrumb if positions skip.
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(origin, crumb.href),
    })),
  } satisfies WithContext<BreadcrumbList>;
}
