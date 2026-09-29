import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Markdown } from "@/components/ui/Markdown";
import { client } from "@/config/load";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Site-wide FAQ.
 *
 * Config order is kept and nothing is grouped: the config author decided which question
 * matters most, and re-sorting here would quietly override that ranking.
 *
 * No FAQPage JSON-LD yet. The whole point of the FAQ design is that the visible answer
 * and the structured-data answer come from one field, and the component that owns that
 * relationship lands in a later milestone — hand-rolling the markup here is how the two
 * start to drift.
 */

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return buildMetadata(hrefs.faq());
}

export default function Faq() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Breadcrumbs
        trail={[
          { label: "Home", href: hrefs.home() },
          { label: "FAQ", href: hrefs.faq() },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Frequently asked questions</h1>
      <p className="mt-4 text-lg text-slate-700">
        What people ask {client.name} most often. Questions about a particular service are answered
        on that service page.
      </p>

      {client.faqs.length > 0 ? (
        <section aria-labelledby="faqs-heading" className="mt-10">
          <h2 id="faqs-heading" className="sr-only">
            Questions and answers
          </h2>
          {/* data-aeo marks the answer block for the AEO audit and the extraction tests. */}
          <dl data-aeo="faq" className="space-y-8">
            {client.faqs.map((faq, i) => (
              <div
                key={faq.question}
                id={`faq-${i + 1}`}
                className="border-b border-slate-200 pb-8 last:border-0 last:pb-0"
              >
                <dt className="text-xl font-semibold text-slate-900">{faq.question}</dt>
                <dd className="mt-3">
                  {/* Answers are authored with a small markdown subset. */}
                  <Markdown content={faq.answer} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : (
        <p className="mt-10 text-slate-700">
          We have not published any questions yet. Call or email us and we will answer directly.
        </p>
      )}

      <section
        aria-labelledby="still-asking-heading"
        className="bg-brand-50 rounded-brand mt-12 p-6"
      >
        <h2 id="still-asking-heading" className="text-xl font-semibold text-slate-900">
          Still have a question?
        </h2>
        <p className="mt-2 text-slate-700">
          Call{" "}
          <a
            href={`tel:${client.contact.phone}`}
            className="text-brand-700 inline-flex min-h-11 items-center font-semibold"
          >
            {client.contact.phoneDisplay}
          </a>{" "}
          or see{" "}
          <Link href={hrefs.contact()} className="text-brand-700 font-medium hover:underline">
            all the ways to reach us
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
