import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { client } from "@/config/load";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatHours } from "@/lib/util/hours";

/**
 * About.
 *
 * For a local business this page carries the entity, not a story: the same name,
 * address and phone as the footer and the JSON-LD, plus the licence and ABN that let a
 * reader — or a model deciding whether to cite this site — check the business is real.
 */

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return buildMetadata(hrefs.about());
}

export default function About() {
  const { address, contact, trust } = client;
  const hoursLines = formatHours(client.hours);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Breadcrumbs
        trail={[
          { label: "Home", href: hrefs.home() },
          { label: "About", href: hrefs.about() },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">About {client.name}</h1>

      <p className="mt-4 text-lg text-slate-700">{client.description}</p>

      {client.foundedYear && (
        <p className="mt-3 text-slate-700">
          Serving {address.suburb} since {client.foundedYear}.
        </p>
      )}

      {/*
        Plain copy only. trust.reviews.emitSchema is typed as literal false because a
        self-serving aggregateRating on your own site breaks Google's structured-data
        policy — so the numbers are stated here and never marked up.
      */}
      {trust.reviews && (
        <p className="mt-3 text-slate-700">
          Rated {trust.reviews.rating} out of 5 from {trust.reviews.count} {trust.reviews.source}.
        </p>
      )}

      <section aria-labelledby="find-us-heading" className="mt-12">
        <h2 id="find-us-heading" className="text-2xl font-semibold text-slate-900">
          Where to find us
        </h2>

        <div className="mt-4 grid gap-8 sm:grid-cols-2">
          {/* Same NAP idiom as the footer: one shape, rendered from config, never retyped. */}
          <address className="text-slate-700 not-italic">
            <span className="font-semibold text-slate-900">{client.legalName ?? client.name}</span>
            <br />
            {address.streetAddress}
            <br />
            {address.suburb} {address.state} {address.postcode}
            <br />
            <a
              href={`tel:${contact.phone}`}
              className="text-brand-700 inline-flex min-h-11 items-center font-semibold"
            >
              {contact.phoneDisplay}
            </a>
            <br />
            <a href={`mailto:${contact.email}`} className="hover:text-brand-700 break-words">
              {contact.email}
            </a>
            {address.mapUrl && (
              <>
                <br />
                <a href={address.mapUrl} className="text-brand-700 hover:underline">
                  View on the map
                </a>
              </>
            )}
          </address>

          <div>
            <h3 className="font-semibold text-slate-900">Opening hours</h3>
            <dl className="mt-2 space-y-1 text-slate-700">
              {hoursLines.map((line) => (
                <div key={line.days} className="flex justify-between gap-6">
                  <dt>{line.days}</dt>
                  <dd className="text-right">{line.hours}</dd>
                </div>
              ))}
            </dl>
            {client.hours.closures.length > 0 && (
              <p className="mt-3 text-sm text-slate-500">
                Closed on {client.hours.closures.map((closure) => closure.name).join(", ")}.
              </p>
            )}
          </div>
        </div>

        {(trust.licenceNumber || trust.abn) && (
          <dl className="mt-8 space-y-1 text-sm text-slate-600">
            {trust.licenceNumber && (
              <div className="flex gap-2">
                <dt className="font-medium text-slate-700">Licence</dt>
                <dd>{trust.licenceNumber}</dd>
              </div>
            )}
            {trust.abn && (
              <div className="flex gap-2">
                <dt className="font-medium text-slate-700">ABN</dt>
                <dd>{trust.abn}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      <section aria-labelledby="what-we-do-heading" className="mt-12">
        <h2 id="what-we-do-heading" className="text-2xl font-semibold text-slate-900">
          What we do, and where
        </h2>
        <p className="mt-2 text-slate-700">
          <Link href={hrefs.services()} className="text-brand-700 font-medium hover:underline">
            All services
          </Link>
          {" · "}
          <Link href={hrefs.areas()} className="text-brand-700 font-medium hover:underline">
            All service areas
          </Link>
        </p>

        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-slate-900">Services</h3>
            <ul className="mt-2 space-y-1 text-slate-700">
              {client.services.map((service) => (
                <li key={service.slug}>
                  <Link href={hrefs.service(service.slug)} className="hover:text-brand-700">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Areas</h3>
            <ul className="mt-2 space-y-1 text-slate-700">
              {client.serviceAreas.map((area) => (
                <li key={area.slug}>
                  <Link href={hrefs.area(area.slug)} className="hover:text-brand-700">
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <p className="mt-12 text-slate-700">
        <Link href={hrefs.contact()} className="text-brand-700 font-medium hover:underline">
          How to get in touch
        </Link>
      </p>
    </main>
  );
}
