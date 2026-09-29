import type { Metadata } from "next";
import Link from "next/link";
import { Markdown } from "@/components/ui/Markdown";
import { client } from "@/config/load";
import type { BusinessType } from "@/config/schema";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatHours } from "@/lib/util/hours";

/**
 * The home page.
 *
 * One job, answered above the fold: is this the right business, near me, for this
 * problem? That is the h1 (who and where), the tagline (what), the phone number with
 * the hours beside it (can I reach them), and then the services and the suburbs.
 *
 * Nothing here is written for a particular trade. The same component renders a dental
 * practice, a cafe and a 24/7 plumber, so every noun comes from config and the only
 * branch on business type is the one below, which exists because config has exactly one
 * field that says what kind of business this is.
 */

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return buildMetadata(hrefs.home());
}

/**
 * Exhaustive over the enum, so adding a business type is a compile error rather than a
 * silently vague h1. `generic` has no honest noun, so the h1 falls back to name + place.
 */
const BUSINESS_NOUN: Record<BusinessType, string | null> = {
  dentist: "dentist",
  cafe: "cafe",
  plumber: "plumber",
  generic: null,
};

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export default function Home() {
  const { address, contact, trust } = client;
  const noun = BUSINESS_NOUN[client.businessType];
  const hoursLines = formatHours(client.hours);
  // Four is the most an above-the-fold-ish block can carry before it reads as a wall;
  // the rest live on /faq, which this section links to.
  const topFaqs = client.faqs.slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <p className="text-brand-700 text-sm font-semibold tracking-wide uppercase">
        {address.suburb}, {address.state}
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
        {noun
          ? `${client.name} — ${noun} in ${address.suburb}`
          : `${client.name} in ${address.suburb}`}
      </h1>

      <p className="mt-3 text-xl text-slate-600">{client.tagline}</p>

      <div className="bg-brand-50 rounded-brand mt-8 flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={`tel:${contact.phone}`}
            className="rounded-brand bg-brand-600 inline-flex min-h-11 items-center justify-center px-6 py-3 text-lg font-semibold text-white"
          >
            Call {contact.phoneDisplay}
          </a>
          {contact.bookingUrl && (
            <a
              href={contact.bookingUrl}
              className="rounded-brand border-brand-600 text-brand-700 inline-flex min-h-11 items-center justify-center border px-6 py-3 font-semibold"
            >
              Book or enquire online
            </a>
          )}
        </div>

        {/*
          Hours as published, not a computed "open now" badge: this page is prerendered
          at build time, so any freshness claim baked into the HTML would be a lie
          within the hour. The reader compares the hours to their own clock.
        */}
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">Hours</h2>
          <dl className="mt-2 space-y-1 text-sm text-slate-700">
            {hoursLines.map((line) => (
              <div key={line.days} className="flex justify-between gap-6">
                <dt>{line.days}</dt>
                <dd className="text-right">{line.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p className="mt-8 max-w-3xl text-lg text-slate-700">{client.description}</p>
      <p className="mt-3 max-w-3xl text-slate-600">
        Based at {address.streetAddress}, {address.suburb}
        {client.foundedYear ? ` since ${client.foundedYear}` : ""}, and working across{" "}
        {client.serviceAreas.map((area) => area.name).join(", ")}.
        {trust.reviews
          ? ` Rated ${trust.reviews.rating} from ${trust.reviews.count} ${trust.reviews.source}.`
          : ""}
      </p>

      <section aria-labelledby="services-heading" className="mt-14">
        <h2 id="services-heading" className="text-2xl font-semibold text-slate-900">
          What we do
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {client.services.map((service) => (
            <li
              key={service.slug}
              className="rounded-brand hover:border-brand-300 border border-slate-200 p-5"
            >
              <h3 className="font-semibold text-slate-900">
                <Link href={hrefs.service(service.slug)} className="hover:text-brand-700">
                  {service.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-600">{service.shortDescription}</p>
              {service.priceFrom && (
                <p className="text-brand-700 mt-2 text-sm font-medium">
                  From {money(service.priceFrom.amount, service.priceFrom.currency)}
                  {service.priceFrom.qualifier ? ` — ${service.priceFrom.qualifier}` : ""}
                </p>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href={hrefs.services()} className="text-brand-700 font-medium hover:underline">
            See all services
          </Link>
        </p>
      </section>

      <section aria-labelledby="areas-heading" className="mt-14">
        <h2 id="areas-heading" className="text-2xl font-semibold text-slate-900">
          Where we work
        </h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {client.serviceAreas.map((area) => (
            <li key={area.slug}>
              <Link
                href={hrefs.area(area.slug)}
                className="rounded-brand hover:border-brand-300 hover:text-brand-700 inline-flex min-h-11 items-center border border-slate-200 px-4 py-2 text-slate-700"
              >
                {area.name}
                {area.postcode ? ` ${area.postcode}` : ""}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href={hrefs.areas()} className="text-brand-700 font-medium hover:underline">
            All service areas
          </Link>
        </p>
      </section>

      {topFaqs.length > 0 && (
        <section aria-labelledby="faq-heading" className="mt-14">
          <h2 id="faq-heading" className="text-2xl font-semibold text-slate-900">
            Common questions
          </h2>
          {/*
            No data-aeo marker and no FAQ structured data here: /faq owns the site-wide
            FAQ set, and two pages both claiming to be it is the duplication the
            single-source rule exists to prevent.
          */}
          <dl className="mt-6 space-y-6">
            {topFaqs.map((faq) => (
              <div key={faq.question} className="border-b border-slate-200 pb-6 last:border-0">
                <dt className="text-lg font-semibold text-slate-900">{faq.question}</dt>
                <dd className="mt-2">
                  <Markdown content={faq.answer} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4">
            <Link href={hrefs.faq()} className="text-brand-700 font-medium hover:underline">
              Read all frequently asked questions
            </Link>
          </p>
        </section>
      )}

      <section
        aria-labelledby="contact-heading"
        className="rounded-brand mt-14 border border-slate-200 p-6"
      >
        <h2 id="contact-heading" className="text-2xl font-semibold text-slate-900">
          Get in touch
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <address className="text-slate-700 not-italic">
            <span className="font-semibold text-slate-900">{client.name}</span>
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
          </address>
          <div className="space-y-2 text-slate-700">
            {address.mapUrl && (
              <p>
                <a href={address.mapUrl} className="text-brand-700 hover:underline">
                  Find us on the map
                </a>
              </p>
            )}
            <p>
              <Link href={hrefs.contact()} className="text-brand-700 hover:underline">
                Contact details and hours
              </Link>
            </p>
            <p>
              <Link href={hrefs.about()} className="text-brand-700 hover:underline">
                About {client.name}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
