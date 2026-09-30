import type { MetadataRoute } from "next";
import { client } from "@/config/load";
import { absoluteUrl } from "@/lib/linking/hrefs";
import { allRoutes } from "@/lib/seo/routes";

/**
 * The sitemap, generated from the route inventory.
 *
 * Because `allRoutes()` is also what generates the pages themselves, the sitemap
 * cannot list a URL that 404s or omit one that exists. That pairing is the single most
 * common finding in a technical SEO audit, and here it is structurally impossible.
 *
 * `lastModified` is deliberately absent. We have no record of when a page's content
 * actually changed, and stamping every entry with the build time is worse than saying
 * nothing: it tells crawlers the whole site changed on every deploy, which trains them
 * to ignore the field. It returns when the content layer gives us real dates.
 *
 * Demo clients still publish a complete, honest sitemap even though every page carries
 * `noindex`. The demo is meant to show exactly what the template produces — a truthful
 * sitemap of pages that ask not to be indexed is the accurate picture.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes(client)
    .filter((route) => route.indexable)
    .map((route) => ({
      url: absoluteUrl(client.site.url, route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
}
