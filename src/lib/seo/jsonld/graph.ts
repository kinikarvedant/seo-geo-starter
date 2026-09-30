import type { ClientConfig } from "@/config/schema";
import { localBusinessJsonLd, organizationJsonLd, websiteJsonLd } from "./business";

/**
 * The site-wide entity graph: Organization, LocalBusiness and WebSite in one node,
 * emitted once from the root layout.
 *
 * One `@graph` rather than three separate script tags, and once per site rather than
 * per page, because these three facts do not vary by URL. Repeating them on every page
 * is the most common cause of bloated structured data, and referencing them by `@id`
 * from page-level nodes says the same thing in a fraction of the bytes.
 */
export function siteGraphJsonLd(c: ClientConfig) {
  const organization = organizationJsonLd(c);
  const business = localBusinessJsonLd(c);
  const website = websiteJsonLd(c);

  // The context lives once on the wrapper, so strip it from the members.
  const strip = <T extends { "@context"?: unknown }>(node: T) => {
    const rest: Record<string, unknown> = { ...node };
    delete rest["@context"];
    return rest;
  };

  return {
    "@context": "https://schema.org",
    "@graph": [strip(organization), strip(business), strip(website)],
  };
}
