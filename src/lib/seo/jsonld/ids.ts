import type { ClientConfig } from "@/config/schema";
import { absoluteUrl } from "@/lib/linking/hrefs";

/**
 * Stable `@id` values for the entities this site describes.
 *
 * Without them, every page that mentions the business emits a fresh, anonymous
 * LocalBusiness node, and a consumer has no way to know they are all the same
 * organisation — it sees twenty businesses that happen to share a name. With stable
 * `@id`s, the business is defined once and every other node references it by id.
 *
 * That matters more for GEO than for classic SEO: entity resolution is how an LLM
 * decides that this site, a directory listing and a Google Business Profile are one
 * business worth citing by name.
 */
export const ids = {
  organization: (c: ClientConfig) => `${c.site.url}/#organization`,
  localBusiness: (c: ClientConfig) => `${c.site.url}/#localbusiness`,
  website: (c: ClientConfig) => `${c.site.url}/#website`,
  webpage: (c: ClientConfig, path: string) => `${absoluteUrl(c.site.url, path)}#webpage`,
  service: (c: ClientConfig, slug: string) =>
    `${absoluteUrl(c.site.url, `/services/${slug}`)}#service`,
  /**
   * The same service offered in one suburb is a *different* node, not the same one with
   * a narrower areaServed. Reusing the service @id here would make a single entity
   * assert a different service area on every area page — and merging by @id is exactly
   * what these ids are for.
   */
  areaService: (c: ClientConfig, area: string, slug: string) =>
    `${absoluteUrl(c.site.url, `/areas/${area}/${slug}`)}#service`,
} as const;
