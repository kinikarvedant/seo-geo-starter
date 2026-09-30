import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQSection } from "@/components/aeo/FAQSection";
import { client } from "@/config/load";
import { absoluteUrl, hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Site-wide FAQ.
 *
 * Config order is kept and nothing is grouped: the config author decided which question
 * matters most, and re-sorting here would quietly override that ranking.
 *
 * The FAQPage structured data comes from FAQSection, which renders these same questions
 * in the same pass. This page never touches the JSON-LD generator directly, and an
 * ESLint rule makes sure it cannot.
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
        <FAQSection
          faqs={client.faqs}
          pageUrl={absoluteUrl(client.site.url, hrefs.faq())}
          heading="Questions and answers"
          headingId="faqs-heading"
          headingVisible={false}
        />
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
