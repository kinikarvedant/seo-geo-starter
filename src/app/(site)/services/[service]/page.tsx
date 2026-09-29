import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Markdown } from "@/components/ui/Markdown";
import { client } from "@/config/load";
import type { Service } from "@/config/schema";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";
/** Every service page comes from config, so an unknown slug is a 404, never a render. */
export const dynamicParams = false;

export function generateStaticParams(): { service: string }[] {
  return client.services.map((service) => ({ service: service.slug }));
}

function findService(slug: string): Service | undefined {
  return client.services.find((s) => s.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[service]">): Promise<Metadata> {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service) notFound();
  return buildMetadata(hrefs.service(service.slug));
}

function formatPrice(price: NonNullable<Service["priceFrom"]>): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: price.amount % 1 === 0 ? 0 : 2,
  }).format(price.amount);
}

export default async function ServiceDetail({ params }: PageProps<"/services/[service]">) {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  const related = service.relatedServices
    .map(findService)
    .filter((s): s is Service => s !== undefined);

  // Kept as a plain object so no discriminated-union narrowing has to survive a closure.
  const areaIntros = service.areaPages.enabled ? service.areaPages.intros : {};
  // Config order, so the link block matches the areas index and the route inventory.
  const areas = client.serviceAreas.filter((area) => Object.hasOwn(areaIntros, area.slug));

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs
        trail={[
          { label: "Home", href: hrefs.home() },
          { label: "Services", href: hrefs.services() },
          { label: service.name, href: hrefs.service(service.slug) },
        ]}
      />

      <article>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{service.name}</h1>

        {/* The answer-first block: the passage most likely to be lifted into a snippet
            or an AI answer, so it leads the page and is marked for the audit. */}
        <p
          data-aeo="answer"
          className="rounded-brand border-brand-500 bg-brand-50/60 mt-6 border-l-4 p-5 text-lg leading-relaxed text-slate-800"
        >
          {service.answer}
        </p>

        {service.priceFrom && (
          <p className="mt-4 text-slate-700">
            <span className="font-semibold text-slate-900">
              From {formatPrice(service.priceFrom)}
            </span>
            {service.priceFrom.qualifier && (
              <span className="text-slate-500"> — {service.priceFrom.qualifier}</span>
            )}
          </p>
        )}

        {service.keyFacts.length > 0 && (
          <section aria-labelledby="key-facts" className="mt-8">
            <h2 id="key-facts" className="text-xl font-semibold text-slate-900">
              At a glance
            </h2>
            <dl className="rounded-brand mt-3 divide-y divide-slate-200 border border-slate-200">
              {service.keyFacts.map((fact) => (
                <div key={fact.label} className="gap-1 p-4 sm:flex sm:gap-4">
                  <dt className="text-sm font-semibold text-slate-500 sm:w-40 sm:shrink-0">
                    {fact.label}
                  </dt>
                  <dd className="text-slate-800">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mt-8">
          <Markdown content={service.body} />
        </div>

        {service.faqs.length > 0 && (
          <section aria-labelledby="service-faqs" className="mt-12">
            <h2 id="service-faqs" className="text-xl font-semibold text-slate-900">
              {service.name}: common questions
            </h2>
            {/* Plain markup for now: the FAQPage JSON-LD is a later milestone and must
                come from the same field as this copy, not a second rendering of it. */}
            <dl data-aeo="faq" className="mt-4 space-y-5">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="rounded-brand border border-slate-200 p-5">
                  <dt className="font-semibold text-slate-900">{faq.question}</dt>
                  <dd className="mt-2 text-slate-700">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-services" className="mt-12">
          <h2 id="related-services" className="text-xl font-semibold text-slate-900">
            Related services
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((other) => (
              <li key={other.slug} className="rounded-brand border border-slate-200 p-4">
                <Link
                  href={hrefs.service(other.slug)}
                  className="hover:text-brand-700 font-semibold text-slate-900"
                >
                  {other.name}
                </Link>
                <p className="mt-1 text-sm text-slate-600">{other.shortDescription}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {areas.length > 0 && (
        <section aria-labelledby="service-areas" className="mt-12">
          <h2 id="service-areas" className="text-xl font-semibold text-slate-900">
            {service.name} by suburb
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={hrefs.areaService(area.slug, service.slug)}
                  className="rounded-brand hover:border-brand-300 hover:text-brand-700 inline-block border border-slate-200 px-3 py-1.5 text-sm text-slate-700"
                >
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        aria-labelledby="service-cta"
        className="rounded-brand bg-brand-50 mt-12 p-6 text-center"
      >
        <h2 id="service-cta" className="text-xl font-semibold text-slate-900">
          Need {service.name.toLowerCase()}?
        </h2>
        <p className="mt-2 text-slate-700">
          Call {client.name} in {client.address.suburb}
          {client.contact.emergency ? " — the phone is answered around the clock." : "."}
        </p>
        <a
          href={`tel:${client.contact.phone}`}
          className="rounded-brand bg-brand-600 mt-5 inline-block px-5 py-3 font-semibold text-white"
        >
          Call {client.contact.phoneDisplay}
        </a>
        <p className="mt-3 text-sm text-slate-600">
          Or{" "}
          <Link href={hrefs.contact()} className="text-brand-700 underline underline-offset-2">
            send a message
          </Link>
          {client.contact.bookingUrl && (
            <>
              {" "}
              or{" "}
              <a
                href={client.contact.bookingUrl}
                className="text-brand-700 underline underline-offset-2"
              >
                book online
              </a>
            </>
          )}
          .
        </p>
      </section>
    </main>
  );
}
