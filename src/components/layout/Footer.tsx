import Link from "next/link";
import { client } from "@/config/load";
import { hrefs } from "@/lib/linking/hrefs";
import { formatHours } from "@/lib/util/hours";

/**
 * Footer, and the site's NAP block.
 *
 * Name, address and phone are rendered from config in one place and repeated nowhere
 * by hand. Entity consistency is what lets search engines and LLMs decide that this
 * site, the Google Business Profile and a directory listing are the same business — a
 * mistyped suburb in a hand-written footer quietly breaks that.
 */
export function Footer() {
  const { address, contact } = client;

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 sm:grid-cols-3">
        <div>
          <h2 className="font-semibold text-slate-900">{client.name}</h2>
          <address className="mt-2 text-sm text-slate-600 not-italic">
            {address.streetAddress}
            <br />
            {address.suburb} {address.state} {address.postcode}
            <br />
            <a href={`tel:${contact.phone}`} className="hover:text-brand-700">
              {contact.phoneDisplay}
            </a>
            <br />
            <a href={`mailto:${contact.email}`} className="hover:text-brand-700">
              {contact.email}
            </a>
          </address>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">Hours</h2>
          <dl className="mt-2 space-y-1 text-sm text-slate-600">
            {formatHours(client.hours).map((line) => (
              <div key={line.days} className="flex justify-between gap-4">
                <dt>{line.days}</dt>
                <dd>{line.hours}</dd>
              </div>
            ))}
          </dl>
          {client.trust.licenceNumber && (
            <p className="mt-3 text-xs text-slate-500">{client.trust.licenceNumber}</p>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">Site</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              <Link href={hrefs.services()} className="hover:text-brand-700">
                Services
              </Link>
            </li>
            <li>
              <Link href={hrefs.areas()} className="hover:text-brand-700">
                Service areas
              </Link>
            </li>
            <li>
              <Link href={hrefs.about()} className="hover:text-brand-700">
                About
              </Link>
            </li>
            <li>
              <Link href={hrefs.faq()} className="hover:text-brand-700">
                FAQ
              </Link>
            </li>
            <li>
              <Link href={hrefs.contact()} className="hover:text-brand-700">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {client.legalName ?? client.name}
        {client.demo && " · Demo site for a fictional business"}
      </div>
    </footer>
  );
}
