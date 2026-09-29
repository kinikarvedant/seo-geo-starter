import Link from "next/link";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Visible breadcrumbs. The same `Crumb[]` will feed the BreadcrumbList JSON-LD when
 * structured data lands, so the trail a person sees and the trail a crawler reads come
 * from one array — the same single-source rule the FAQ section follows.
 *
 * The current page is rendered as text, not a link: a self-link adds nothing for a
 * reader and muddies the internal-link graph.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  if (trail.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
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
