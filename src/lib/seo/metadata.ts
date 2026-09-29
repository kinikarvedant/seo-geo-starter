import type { Metadata } from "next";
import { client } from "@/config/load";
import { routeFor, type RouteRecord } from "./routes";

/**
 * Builds a page's Metadata from the route inventory.
 *
 * Pages never author their own title or description: they name their path and the
 * inventory supplies both, so the sitemap, the audit and the rendered <title> cannot
 * disagree. Canonicals are relative because the root layout sets `metadataBase` from
 * build-time config — deriving an origin from request headers behind a reverse proxy
 * is the standard way to ship wrong canonicals.
 *
 * Milestone 4 extends this with Open Graph images and article metadata.
 */
export function buildMetadata(pathOrRoute: string | RouteRecord): Metadata {
  const route = typeof pathOrRoute === "string" ? routeFor(client, pathOrRoute) : pathOrRoute;

  return {
    // `absolute` so a page title is not run through the layout's "%s | Name" template
    // twice — the inventory already includes the business name.
    title: { absolute: route.title },
    description: route.description,
    alternates: { canonical: route.path },
    openGraph: {
      title: route.title,
      description: route.description,
      url: route.path,
      siteName: client.name,
      type: "website",
    },
  };
}
