import type { JSX } from "react";

/**
 * A question as a heading, then a direct answer as the first paragraph.
 *
 * This is the whole of answer-engine optimisation in one component. Featured snippets,
 * AI Overviews and voice answers all work by lifting a short passage that answers a
 * question *without* the surrounding page for context. A page that opens with "At
 * Bridge Road Dental we pride ourselves on…" gives an extractor nothing to take; one
 * that opens with the answer gives it something quotable.
 *
 * `data-aeo="answer"` marks the passage so the audit can check every service and area
 * page has exactly one, and the smoke test can find it in served HTML.
 */
export function AnswerBlock({
  question,
  answer,
  as: Heading = "h2",
  id,
  children,
}: {
  /** Phrased the way someone would actually ask it, not as a marketing headline. */
  question: string;
  /** 40–60 words. Must stand alone, out of context. */
  answer: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  /** Supporting detail, rendered after the answer rather than before it. */
  children?: JSX.Element | JSX.Element[];
}) {
  return (
    <section aria-labelledby={id} className="mt-8 first:mt-0">
      <Heading id={id} className="text-xl font-semibold text-slate-900">
        {question}
      </Heading>

      <p data-aeo="answer" className="border-brand-500 mt-3 border-l-4 pl-4 text-lg text-slate-700">
        {answer}
      </p>

      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}
