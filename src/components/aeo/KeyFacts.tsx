import type { KeyFact } from "@/config/schema";

/**
 * A short, extractable list of concrete facts: price from, response time, what is
 * included.
 *
 * A `<dl>` rather than a table on purpose. Screen readers announce the label/value
 * relationship natively, and text extractors — the ones building the answer an
 * assistant gives — read a definition list cleanly, where a multi-column table
 * flattens into an ambiguous run of cells.
 *
 * The facts come from config, which is also where the structured data reads price and
 * hours from, so what a visitor sees and what a machine reads have one origin.
 */
export function KeyFacts({
  facts,
  heading = "The essentials",
  headingId,
}: {
  facts: readonly KeyFact[];
  heading?: string;
  /** Required where the page has more than one fact list, so ids cannot collide. */
  headingId: string;
}) {
  if (facts.length === 0) return null;

  return (
    <section aria-labelledby={headingId} data-aeo="keyfacts" className="mt-10">
      <h2 id={headingId} className="text-xl font-semibold text-slate-900">
        {heading}
      </h2>

      <dl className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-wrap gap-x-4 py-2 text-sm">
            <dt data-fact-label className="w-48 shrink-0 font-medium text-slate-900">
              {fact.label}
            </dt>
            <dd data-fact-value className="text-slate-600">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
