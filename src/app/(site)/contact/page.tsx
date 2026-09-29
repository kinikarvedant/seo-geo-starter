import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { client } from "@/config/load";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatHours } from "@/lib/util/hours";

/**
 * Contact.
 *
 * Deliberately no form. The contact form needs a route handler with server-side
 * validation, which is a later milestone; a form posting to nothing loses enquiries
 * silently, which is worse than a page that hands over a phone number and an address.
 * The channels below all work today.
 */

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return buildMetadata(hrefs.contact());
}

export default function Contact() {
  const { address, contact } = client;
  const hoursLines = formatHours(client.hours);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Breadcrumbs
        trail={[
          { label: "Home", href: hrefs.home() },
          { label: "Contact", href: hrefs.contact() },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Contact {client.name}</h1>

      <p className="mt-4 text-lg text-slate-700">
        The fastest way to reach us is the phone. Email and post both reach the same people.
      </p>

      {/* The phone number is the conversion on a local site, so it gets the largest target. */}
      <a
        href={`tel:${contact.phone}`}
        className="rounded-brand bg-brand-600 mt-8 flex min-h-11 w-full flex-col items-center justify-center px-6 py-4 text-white sm:w-auto sm:self-start"
      >
        <span className="text-sm font-medium tracking-wide uppercase opacity-90">Call us</span>
        <span className="text-2xl font-bold sm:text-3xl">{contact.phoneDisplay}</span>
      </a>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <section aria-labelledby="reach-us-heading">
          <h2 id="reach-us-heading" className="text-xl font-semibold text-slate-900">
            Phone, email and post
          </h2>
          <dl className="mt-3 space-y-4 text-slate-700">
            <div>
              <dt className="text-sm font-medium text-slate-500">Phone</dt>
              <dd>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-brand-700 inline-flex min-h-11 items-center text-lg font-semibold"
                >
                  {contact.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-brand-700 inline-flex min-h-11 items-center break-words"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Address</dt>
              <dd>
                <address className="not-italic">
                  {client.legalName ?? client.name}
                  <br />
                  {address.streetAddress}
                  <br />
                  {address.suburb} {address.state} {address.postcode}
                </address>
                {address.mapUrl && (
                  <a
                    href={address.mapUrl}
                    className="text-brand-700 mt-1 inline-block hover:underline"
                  >
                    Open in maps
                  </a>
                )}
              </dd>
            </div>
            {contact.bookingUrl && (
              <div>
                <dt className="text-sm font-medium text-slate-500">Online</dt>
                <dd>
                  <a
                    href={contact.bookingUrl}
                    className="rounded-brand border-brand-600 text-brand-700 inline-flex min-h-11 items-center border px-5 py-2 font-semibold"
                  >
                    Book or enquire online
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section aria-labelledby="hours-heading">
          <h2 id="hours-heading" className="text-xl font-semibold text-slate-900">
            When we are open
          </h2>
          <dl className="mt-3 space-y-1 text-slate-700">
            {hoursLines.map((line) => (
              <div key={line.days} className="flex justify-between gap-6">
                <dt>{line.days}</dt>
                <dd className="text-right">{line.hours}</dd>
              </div>
            ))}
          </dl>
          {client.hours.closures.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-900">Closed</h3>
              <ul className="mt-1 space-y-1 text-sm text-slate-600">
                {client.hours.closures.map((closure) => (
                  <li key={closure.date}>{closure.name}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-sm text-slate-600">
            Email outside these hours and we will reply when we are next open.
          </p>
        </section>
      </div>

      <p className="mt-12 text-slate-700">
        Not sure what you need yet?{" "}
        <Link href={hrefs.faq()} className="text-brand-700 font-medium hover:underline">
          Read the frequently asked questions
        </Link>{" "}
        or{" "}
        <Link href={hrefs.services()} className="text-brand-700 font-medium hover:underline">
          browse what we do
        </Link>
        .
      </p>
    </main>
  );
}
