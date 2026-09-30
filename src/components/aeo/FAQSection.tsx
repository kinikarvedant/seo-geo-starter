import type { Faq } from "@/config/schema";
import { Markdown } from "@/components/ui/Markdown";
import { JsonLd } from "@/components/seo/JsonLd";
// The only permitted import site for this generator. An ESLint rule enforces that.
import { faqPageJsonLd } from "@/lib/seo/jsonld/content";

/**
 * Visible FAQs and their FAQPage structured data, from one array in one render.
 *
 * This is the single-source guarantee the project is built around. There is no code
 * path that emits FAQ markup without rendering the questions, and none that renders
 * them without the markup unless a page explicitly opts out. Four things hold it up:
 *
 *  1. One `faqs` prop feeds both outputs, in the same render pass.
 *  2. The config gives an FAQ *one* answer field. The visible copy is that string
 *     rendered, the schema text is that string flattened — both pure transforms of the
 *     same bytes. A separate "rich" and "plain" field is how these drift.
 *  3. An ESLint fence stops any other file importing `faqPageJsonLd`, so nobody can
 *     hand-roll FAQ markup on a page.
 *  4. A test renders this component and asserts the questions in the DOM equal the
 *     questions in the emitted JSON-LD.
 *
 * `emitJsonLd={false}` exists for the case of two FAQ blocks on one page: more than one
 * FAQPage node per page is invalid, so the second block renders visibly and stays quiet.
 */
export function FAQSection({
  faqs,
  pageUrl,
  heading = "Frequently asked questions",
  headingId,
  headingVisible = true,
  emitJsonLd = true,
}: {
  faqs: readonly Faq[];
  /** Absolute URL of the page these FAQs appear on, for the node's @id. */
  pageUrl: string;
  heading?: string;
  /**
   * Required, not defaulted: it becomes a DOM id and a script id, and a default would
   * let a second FAQ block on the same page silently duplicate both.
   */
  headingId: string;
  /** False where an h1 already says the same thing; the heading stays for screen readers. */
  headingVisible?: boolean;
  emitJsonLd?: boolean;
}) {
  // No FAQs means no markup and no schema. Claiming an empty FAQPage is worse than
  // claiming nothing.
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby={headingId} data-aeo="faq" className="mt-12">
      <h2
        id={headingId}
        className={headingVisible ? "text-xl font-semibold text-slate-900" : "sr-only"}
      >
        {heading}
      </h2>

      <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-4">
            <dt data-faq-q className="font-medium text-slate-900">
              {faq.question}
            </dt>
            <dd data-faq-a className="mt-2 text-sm">
              <Markdown content={faq.answer} />
            </dd>
          </div>
        ))}
      </dl>

      {emitJsonLd && <JsonLd id={`faq-${headingId}`} data={faqPageJsonLd(faqs, pageUrl)} />}
    </section>
  );
}
