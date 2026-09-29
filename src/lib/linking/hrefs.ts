/**
 * The only place that constructs an internal URL.
 *
 * String-concatenated hrefs scattered through components are how a site ends up with
 * `/services/x/` in one place and `/services/x` in another — two URLs, one page, split
 * ranking signals. Every link goes through a builder here, so the shape of a URL is
 * changed in one file and the audit can compare links against the route inventory.
 */

export const hrefs = {
  home: () => "/",
  services: () => "/services",
  service: (slug: string) => `/services/${slug}`,
  areas: () => "/areas",
  area: (slug: string) => `/areas/${slug}`,
  areaService: (area: string, service: string) => `/areas/${area}/${service}`,
  about: () => "/about",
  contact: () => "/contact",
  faq: () => "/faq",
} as const;

/** Absolute URL for canonicals, JSON-LD @id values and llms.txt. */
export function absoluteUrl(origin: string, path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`absoluteUrl needs a rooted path, got "${path}"`);
  }
  // Trailing slashes are stripped everywhere except the root itself, matching
  // next.config.ts's `trailingSlash: false`.
  const normalised = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${origin}${normalised}`;
}
