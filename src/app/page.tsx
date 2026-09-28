import { client } from "@/config/load";

/**
 * Milestone 1 home page: deliberately thin. Its job is to prove the chain end to end —
 * config parses, brand tokens resolve, the active client reaches a page — so that the
 * real page types built in milestone 3 land on ground that is already known to work.
 */
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-brand-700 text-sm font-semibold tracking-wide uppercase">
        {client.address.suburb}, {client.address.state}
      </p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900">{client.name}</h1>
      <p className="mt-3 text-lg text-slate-600">{client.tagline}</p>
      <p className="mt-6 text-slate-700">{client.description}</p>

      <a
        href={`tel:${client.contact.phone}`}
        className="rounded-brand bg-brand-600 mt-8 inline-block px-5 py-3 font-semibold text-white"
      >
        Call {client.contact.phoneDisplay}
      </a>

      <h2 className="mt-12 text-xl font-semibold text-slate-900">Services</h2>
      <ul className="mt-4 space-y-3">
        {client.services.map((service) => (
          <li key={service.slug} className="rounded-brand border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">{service.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{service.shortDescription}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold text-slate-900">Service areas</h2>
      <p className="mt-2 text-slate-600">
        {client.serviceAreas.map((area) => area.name).join(", ")}
      </p>
    </main>
  );
}
