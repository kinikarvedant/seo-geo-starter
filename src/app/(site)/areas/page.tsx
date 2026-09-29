import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { client } from "@/config/load";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * The service-areas index.
 *
 * Its job is discovery: every suburb page gets exactly one link from a crawlable list,
 * so no area page depends on the sitemap alone to be found. It deliberately shows only
 * a sentence per suburb — the full local copy is the suburb page's reason to exist, and
 * repeating it here would put the same prose on two URLs.
 */

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return buildMetadata(hrefs.areas());
}

/** First sentence of a blurb, falling back to the whole string if it has no full stop. */
function firstSentence(text: string): string {
  const match = /^.*?[.!?](?=\s|$)/.exec(text.trim());
  return match ? match[0] : text.trim();
}

export default function AreasIndex() {
  // Sorted copy, because sort mutates and the config is shared across every page of the
  // build. Array#sort is stable, so config order breaks ties between equal priorities
  // and two builds of one config emit byte-identical HTML.
  const areas = [...client.serviceAreas].sort((a, b) => b.priority - a.priority);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <Breadcrumbs
        trail={[
          { label: "Home", href: hrefs.home() },
          { label: "Service areas", href: hrefs.areas() },
        ]}
      />

      <p className="text-brand-700 text-sm font-semibold tracking-wide uppercase">
        {client.address.suburb}, {client.address.state}
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Service areas</h1>

      <p className="mt-3 max-w-3xl text-lg text-slate-600">
        {client.name} works across {areas.length} {areas.length === 1 ? "suburb" : "suburbs"} around{" "}
        {client.address.suburb}. Each one has its own page, written for that suburb rather than
        templated — pick yours to see what we do there.
      </p>

      <section aria-labelledby="suburbs-heading" className="mt-12">
        <h2 id="suburbs-heading" className="text-2xl font-semibold text-slate-900">
          Suburbs we cover
        </h2>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {areas.map((area) => (
            <li
              key={area.slug}
              className="rounded-brand hover:border-brand-300 border border-slate-200 p-5"
            >
              <h3 className="font-semibold text-slate-900">
                <Link href={hrefs.area(area.slug)} className="hover:text-brand-700">
                  {area.name}
                </Link>
                {area.postcode && (
                  <span className="ml-2 font-normal text-slate-500">{area.postcode}</span>
                )}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{firstSentence(area.blurb)}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10">
        <a
          href={`tel:${client.contact.phone}`}
          className="rounded-brand bg-brand-600 inline-flex min-h-11 items-center justify-center px-6 py-3 text-lg font-semibold text-white"
        >
          Call {client.contact.phoneDisplay}
        </a>
      </p>
    </main>
  );
}
