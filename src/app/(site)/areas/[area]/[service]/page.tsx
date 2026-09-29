import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Markdown } from "@/components/ui/Markdown";
import { client } from "@/config/load";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";
import { areaServiceRoutes } from "@/lib/seo/routes";

export const dynamic = "force-static";
/**
 * The doorway-page guard, observed from outside: a service × suburb pair with no copy
 * written for it has no page, and asking for one gets a 404 rather than a rendered
 * template with the suburb name swapped in.
 */
export const dynamicParams = false;

/**
 * Derived from the route inventory rather than from `areas × services`. The inventory
 * already encodes which pairs have unique prose; re-deriving that rule here is how the
 * two would eventually disagree.
 */
export function generateStaticParams(): { area: string; service: string }[] {
  return areaServiceRoutes(client).map((route) => ({
    area: route.source!.area!,
    service: route.source!.service!,
  }));
}

function resolve(areaSlug: string, serviceSlug: string) {
  const area = client.serviceAreas.find((a) => a.slug === areaSlug);
  const service = client.services.find((s) => s.slug === serviceSlug);
  if (!area || !service || !service.areaPages.enabled) return undefined;

  const intro = service.areaPages.intros[area.slug];
  if (!intro) return undefined;

  return { area, service, intro, titlePattern: service.areaPages.titlePattern };
}

export async function generateMetadata({
  params,
}: PageProps<"/areas/[area]/[service]">): Promise<Metadata> {
  const { area, service } = await params;
  const resolved = resolve(area, service);
  if (!resolved) notFound();
  return buildMetadata(hrefs.areaService(resolved.area.slug, resolved.service.slug));
}

export default async function AreaServicePage({ params }: PageProps<"/areas/[area]/[service]">) {
  const { area: areaSlug, service: serviceSlug } = await params;
  const resolved = resolve(areaSlug, serviceSlug);
  if (!resolved) notFound();

  const { area, service, intro, titlePattern } = resolved;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs
        trail={[
          { label: "Home", href: hrefs.home() },
          { label: "Service areas", href: hrefs.areas() },
          { label: area.name, href: hrefs.area(area.slug) },
          { label: service.name, href: hrefs.areaService(area.slug, service.slug) },
        ]}
      />

      <article>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {titlePattern.replace("{area}", area.name)}
        </h1>

        {/* The area-specific intro leads, not the generic service copy. That ordering is
            the difference between a local page and a templated one. */}
        <p
          data-aeo="answer"
          className="border-brand-500 mt-6 border-l-4 pl-4 text-lg text-slate-700"
        >
          {intro}
        </p>

        <section aria-labelledby="about-service" className="mt-10">
          <h2 id="about-service" className="text-xl font-semibold text-slate-900">
            About {service.name.toLowerCase()}
          </h2>
          <p className="mt-3 text-slate-700">{service.answer}</p>
        </section>

        {service.keyFacts.length > 0 && (
          <section aria-labelledby="key-facts" className="mt-10">
            <h2 id="key-facts" className="text-xl font-semibold text-slate-900">
              The essentials
            </h2>
            <dl className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
              {service.keyFacts.map((fact) => (
                <div key={fact.label} className="flex flex-wrap gap-x-4 py-2 text-sm">
                  <dt className="w-48 shrink-0 font-medium text-slate-900">{fact.label}</dt>
                  <dd className="text-slate-600">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section aria-labelledby="detail" className="mt-10">
          <h2 id="detail" className="text-xl font-semibold text-slate-900">
            How it works
          </h2>
          <div className="mt-3">
            <Markdown content={service.body} />
          </div>
        </section>
      </article>

      <section aria-labelledby="more" className="mt-12">
        <h2 id="more" className="text-xl font-semibold text-slate-900">
          More
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href={hrefs.service(service.slug)} className="text-brand-700 hover:underline">
              {service.name} across all areas
            </Link>
          </li>
          <li>
            <Link href={hrefs.area(area.slug)} className="text-brand-700 hover:underline">
              Everything we do in {area.name}
            </Link>
          </li>
        </ul>
      </section>

      <aside className="rounded-brand bg-brand-50 mt-12 p-6">
        <p className="font-semibold text-slate-900">
          {client.contact.emergency ? "We answer around the clock." : "Get in touch."}
        </p>
        <a
          href={`tel:${client.contact.phone}`}
          className="rounded-brand bg-brand-600 mt-3 inline-block px-5 py-3 font-semibold text-white"
        >
          Call {client.contact.phoneDisplay}
        </a>
      </aside>
    </main>
  );
}
