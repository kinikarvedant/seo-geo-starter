import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { client } from "@/config/load";
import type { ServiceArea } from "@/config/schema";
import { hrefs } from "@/lib/linking/hrefs";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";
/** Areas come from config, so a suburb we do not serve is a 404, never a render. */
export const dynamicParams = false;

export function generateStaticParams(): { area: string }[] {
  return client.serviceAreas.map((area) => ({ area: area.slug }));
}

function findArea(slug: string): ServiceArea | undefined {
  return client.serviceAreas.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/areas/[area]">): Promise<Metadata> {
  const { area: slug } = await params;
  const area = findArea(slug);
  if (!area) notFound();
  return buildMetadata(hrefs.area(area.slug));
}

export default async function AreaPage({ params }: PageProps<"/areas/[area]">) {
  const { area: slug } = await params;
  const area = findArea(slug);
  if (!area) notFound();

  // Services that have written copy for THIS suburb. Config order, so this block, the
  // route inventory and the sitemap all list them the same way.
  const servicesHere = client.services.filter(
    (service) => service.areaPages.enabled && Object.hasOwn(service.areaPages.intros, area.slug),
  );

  const neighbours = area.adjacentTo.map(findArea).filter((a): a is ServiceArea => a !== undefined);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumbs
        trail={[
          { label: "Home", href: hrefs.home() },
          { label: "Service areas", href: hrefs.areas() },
          { label: area.name, href: hrefs.area(area.slug) },
        ]}
      />

      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
        {client.name} in {area.name}
      </h1>

      <p data-aeo="answer" className="border-brand-500 mt-6 border-l-4 pl-4 text-lg text-slate-700">
        {area.blurb}
      </p>

      <p className="mt-6 text-slate-600">
        {area.name}
        {area.postcode ? ` ${area.postcode}` : ""}, {area.state} is one of the areas we cover from{" "}
        {client.address.suburb}.
      </p>

      {area.landmarks.length > 0 && (
        <section aria-labelledby="landmarks" className="mt-10">
          <h2 id="landmarks" className="text-xl font-semibold text-slate-900">
            Around {area.name}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {area.landmarks.map((landmark) => (
              <li
                key={landmark}
                className="rounded-brand bg-brand-50 text-brand-900 px-3 py-1 text-sm"
              >
                {landmark}
              </li>
            ))}
          </ul>
        </section>
      )}

      {servicesHere.length > 0 && (
        <section aria-labelledby="services-here" className="mt-10">
          <h2 id="services-here" className="text-xl font-semibold text-slate-900">
            What we do in {area.name}
          </h2>
          <ul className="mt-4 space-y-3">
            {servicesHere.map((service) => (
              <li key={service.slug} className="rounded-brand border border-slate-200 p-4">
                <Link
                  href={hrefs.areaService(area.slug, service.slug)}
                  className="text-brand-700 font-semibold hover:underline"
                >
                  {service.areaPages.enabled
                    ? service.areaPages.titlePattern.replace("{area}", area.name)
                    : service.name}
                </Link>
                <p className="mt-1 text-sm text-slate-600">{service.shortDescription}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="all-services" className="mt-10">
        <h2 id="all-services" className="text-xl font-semibold text-slate-900">
          Every service
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {client.services.map((service) => (
            <li key={service.slug}>
              <Link href={hrefs.service(service.slug)} className="text-brand-700 hover:underline">
                {service.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {neighbours.length > 0 && (
        <section aria-labelledby="nearby" className="mt-10">
          <h2 id="nearby" className="text-xl font-semibold text-slate-900">
            Nearby suburbs
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {neighbours.map((neighbour) => (
              <li key={neighbour.slug}>
                <Link href={hrefs.area(neighbour.slug)} className="text-brand-700 hover:underline">
                  {neighbour.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <aside className="rounded-brand bg-brand-50 mt-12 p-6">
        <p className="font-semibold text-slate-900">Need us in {area.name}?</p>
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
