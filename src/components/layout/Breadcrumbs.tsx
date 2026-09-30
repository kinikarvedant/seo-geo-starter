import Link from "next/link";
import { client } from "@/config/load";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/seo/jsonld/content";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Visible breadcrumbs, and the BreadcrumbList structured data for the same trail.
 *
 * One `Crumb[]` produces both, in one render — the same single-source rule the FAQ
 * section follows, for the same reason: a trail a crawler reads that differs from the
 * one a person sees is worse than no markup at all.
 *
 * The current page is rendered as text, not a link: a self-link adds nothing for a
 * reader and muddies the internal-link graph.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  if (trail.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <JsonLd id="breadcrumbs" data={breadcrumbListJsonLd(client.site.url, trail)} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-x-2">
              {isLast ? (
                <span aria-current="page" className="text-slate-700">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-brand-700 underline-offset-2 hover:underline"
                >
                  {crumb.label}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
