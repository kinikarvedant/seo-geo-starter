import type { ClientConfig } from "@/config/schema";

/**
 * The route inventory: one function that enumerates every URL this client's site has.
 *
 * Nothing else in the codebase is allowed to enumerate URLs. `sitemap.ts`, `llms.txt`,
 * the internal-linking graph, breadcrumbs and the audit script all read from here.
 *
 * The reason is specific. The most common SEO defect in generated sites is drift: the
 * sitemap lists a page that 404s, or a page exists that nothing links to, or the title
 * in the sitemap differs from the one on the page. Those are three symptoms of one
 * cause — several pieces of code independently deciding what the site contains. With a
 * single inventory that class of bug cannot be expressed.
 */

export type RouteKind =
  "home" | "services" | "service" | "areas" | "area" | "areaService" | "about" | "contact" | "faq";

export interface RouteRecord {
  /** Canonical path: leading slash, no trailing slash, no origin. */
  path: string;
  kind: RouteKind;
  /** The <title> and the sitemap's idea of this page, from one place. */
  title: string;
  /** The meta description. Kept inside the length Google will actually render. */
  description: string;
  /** Relative importance for the sitemap, 0–1. */
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  /** Whether this page should be indexed at all, before the demo flag is applied. */
  indexable: boolean;
  /** Which config entries produced this route, for pages that need to look them up. */
  source?: { service?: string; area?: string };
}

/** Meta descriptions outside roughly 70–155 chars get truncated or padded by Google. */
const MAX_DESCRIPTION = 155;

function clamp(text: string, max = MAX_DESCRIPTION): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[.,;:]$/, "")}…`;
}

export function homeRoute(c: ClientConfig): RouteRecord {
  return {
    path: "/",
    kind: "home",
    title: `${c.name} | ${c.tagline}`,
    description: clamp(c.description),
    priority: 1,
    changeFrequency: "weekly",
    indexable: true,
  };
}

export function serviceRoutes(c: ClientConfig): RouteRecord[] {
  return c.services.map((service) => ({
    path: `/services/${service.slug}`,
    kind: "service" as const,
    title: `${service.name} | ${c.name}`,
    description: clamp(service.shortDescription),
    priority: 0.8,
    changeFrequency: "monthly" as const,
    indexable: true,
    source: { service: service.slug },
  }));
}

export function areaRoutes(c: ClientConfig): RouteRecord[] {
  return c.serviceAreas.map((area) => ({
    path: `/areas/${area.slug}`,
    kind: "area" as const,
    title: `${c.name} in ${area.name} | ${c.tagline}`,
    description: clamp(area.blurb),
    // Areas are ranked by the config's own priority, 1–10, mapped into 0.5–0.75.
    priority: Number((0.5 + (area.priority / 10) * 0.25).toFixed(2)),
    changeFrequency: "monthly" as const,
    indexable: true,
    source: { area: area.slug },
  }));
}

/**
 * Service × area pages, and the doorway-page guard in its operative form.
 *
 * A page is emitted only where the config holds prose written for that exact pair.
 * The schema makes the missing-copy case unrepresentable; this is where that decision
 * turns into which URLs exist.
 */
export function areaServiceRoutes(c: ClientConfig): RouteRecord[] {
  const areasBySlug = new Map(c.serviceAreas.map((a) => [a.slug, a]));
  const routes: RouteRecord[] = [];

  for (const service of c.services) {
    if (!service.areaPages.enabled) continue;

    for (const [areaSlug, intro] of Object.entries(service.areaPages.intros)) {
      const area = areasBySlug.get(areaSlug);
      if (!area) continue; // unreachable: the schema rejects unknown area keys

      routes.push({
        path: `/areas/${area.slug}/${service.slug}`,
        kind: "areaService",
        title: `${service.areaPages.titlePattern.replace("{area}", area.name)} | ${c.name}`,
        description: clamp(intro),
        priority: 0.7,
        changeFrequency: "monthly",
        indexable: true,
        source: { service: service.slug, area: area.slug },
      });
    }
  }

  return routes;
}

function staticRoutes(c: ClientConfig): RouteRecord[] {
  return [
    {
      path: "/services",
      kind: "services",
      title: `Services | ${c.name}`,
      description: clamp(
        `Everything ${c.name} offers in ${c.address.suburb} and the surrounding suburbs. ${c.tagline}.`,
      ),
      priority: 0.9,
      changeFrequency: "monthly",
      indexable: true,
    },
    {
      path: "/areas",
      kind: "areas",
      title: `Service areas | ${c.name}`,
      description: clamp(`Where ${c.name} works: ${c.serviceAreas.map((a) => a.name).join(", ")}.`),
      priority: 0.7,
      changeFrequency: "monthly",
      indexable: true,
    },
    {
      path: "/about",
      kind: "about",
      title: `About | ${c.name}`,
      description: clamp(
        `${c.name} in ${c.address.suburb}${c.foundedYear ? `, established ${c.foundedYear}` : ""}. ${c.description}`,
      ),
      priority: 0.5,
      changeFrequency: "yearly",
      indexable: true,
    },
    {
      path: "/contact",
      kind: "contact",
      title: `Contact | ${c.name}`,
      description: clamp(
        `Call ${c.name} on ${c.contact.phoneDisplay} or send a message. ${c.address.streetAddress}, ${c.address.suburb} ${c.address.state} ${c.address.postcode}.`,
      ),
      priority: 0.6,
      changeFrequency: "yearly",
      indexable: true,
    },
    {
      path: "/faq",
      kind: "faq",
      title: `Frequently asked questions | ${c.name}`,
      description: clamp(
        `Answers to what people ask ${c.name} most often, about pricing, bookings and how we work.`,
      ),
      priority: 0.6,
      changeFrequency: "monthly",
      indexable: true,
    },
  ];
}

/**
 * Every route on this client's site, in a stable order.
 *
 * Stability matters: two builds of the same config must produce identical HTML, or
 * sitemap diffs, internal-link ordering and Lighthouse comparisons all become noise.
 */
export function allRoutes(c: ClientConfig): RouteRecord[] {
  return [
    homeRoute(c),
    ...staticRoutes(c).filter((r) => r.kind === "services"),
    ...serviceRoutes(c),
    ...staticRoutes(c).filter((r) => r.kind === "areas"),
    ...areaRoutes(c),
    ...areaServiceRoutes(c),
    ...staticRoutes(c).filter((r) => ["about", "contact", "faq"].includes(r.kind)),
  ];
}

/** Looks up a single route, for a page that needs its own title and description. */
export function routeFor(c: ClientConfig, path: string): RouteRecord {
  const route = allRoutes(c).find((r) => r.path === path);
  if (!route) throw new Error(`No route in the inventory for "${path}"`);
  return route;
}
