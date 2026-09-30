import type { MetadataRoute } from "next";
import { client } from "@/config/load";
import { absoluteUrl } from "@/lib/linking/hrefs";
import { resolveAiRules } from "@/lib/geo/aiCrawlers";

/**
 * robots.txt, including per-bot AI crawler policy from config.
 *
 * Two things worth knowing, because both are widely got wrong:
 *
 * 1. robots.txt is a crawl directive, not access control. It asks well-behaved crawlers
 *    not to fetch; it does not stop anyone. Anything genuinely private goes behind
 *    authentication, never behind a Disallow.
 *
 * 2. A `Disallow` here is not the same as `noindex`. A blocked page can still be
 *    indexed from inbound links, and because the crawler cannot read it, it cannot see
 *    a noindex directive either. That is why demo sites use a meta robots tag and keep
 *    robots.txt fully open — blocking the crawler would make the noindex unreadable.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Not a page, and nothing here for a crawler.
        disallow: "/api/",
      },
      ...resolveAiRules(client.ai),
    ],
    sitemap: absoluteUrl(client.site.url, "/sitemap.xml"),
    host: new URL(client.site.url).host,
  };
}
