import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { client } from "@/config/load";
import type { Service } from "@/config/schema";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(hrefs.services());
}

/** Categories are URL-safe slugs in config; nothing stores a display form. */
function categoryLabel(category: string): string {
  const words = category.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function formatPrice(price: NonNullable<Service["priceFrom"]>): string {
  const amount = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: price.amount % 1 === 0 ? 0 : 2,
  }).format(price.amount);
  return `From ${amount}`;
}

interface Group {
  /** null for services with no category, so a mixed config still renders everything. */
  category: string | null;
  services: Service[];
}

/** Grouped in config order, which is also the order of the route inventory. */
function groupByCategory(services: readonly Service[]): Group[] {
  const groups: Group[] = [];

  for (const service of services) {
    const category = service.category ?? null;
    const existing = groups.find((g) => g.category === category);
    if (existing) existing.services.push(service);
    else groups.push({ category, services: [service] });
  }

  // An uncategorised remainder reads as an afterthought unless it is the only group.
  return groups.sort((a, b) => Number(a.category === null) - Number(b.category === null));
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="rounded-brand hover:border-brand-300 flex flex-col border border-slate-200 p-5 transition-colors">
      <h3 className="text-lg font-semibold text-slate-900">
        <Link href={hrefs.service(service.slug)} className="hover:text-brand-700">
          {service.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate-600">{service.shortDescription}</p>
      {service.priceFrom && (
        <p className="text-brand-700 mt-3 text-sm font-semibold">
          {formatPrice(service.priceFrom)}
          {service.priceFrom.qualifier && (
            <span className="block font-normal text-slate-500">{service.priceFrom.qualifier}</span>
          )}
        </p>
      )}
      <Link
        href={hrefs.service(service.slug)}
        className="text-brand-700 mt-4 text-sm font-semibold underline-offset-2 hover:underline"
      >
        {service.name} details <span aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
}

export default function ServicesIndex() {
  const groups = groupByCategory(client.services);
  const onlyGroup = groups.length === 1;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumbs
        trail={[
          { label: "Home", href: hrefs.home() },
          { label: "Services", href: hrefs.services() },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Services from {client.name}</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        {client.tagline} — everything we offer in {client.address.suburb} and the surrounding
        suburbs, with what each one covers and what it costs.
      </p>

      {groups.map((group) => {
        const headingId = `services-${group.category ?? "other"}`;
        const heading =
          group.category !== null
            ? categoryLabel(group.category)
            : onlyGroup
              ? "All services"
              : "More services";

        return (
          <section key={headingId} aria-labelledby={headingId} className="mt-10">
            <h2 id={headingId} className="text-xl font-semibold text-slate-900">
              {heading}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
