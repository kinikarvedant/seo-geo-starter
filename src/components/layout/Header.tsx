import Link from "next/link";
import { client } from "@/config/load";
import { hrefs } from "@/lib/linking/hrefs";

/**
 * Site header. The phone number is a real `tel:` link in the header on every page,
 * because for a local business the phone call *is* the conversion — and on mobile it
 * is the single highest-value element on the site.
 */
export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-4">
        <Link href={hrefs.home()} className="text-brand-800 text-lg font-bold">
          {client.brand.logoText ?? client.name}
        </Link>

        <nav aria-label="Main" className="order-3 w-full sm:order-2 sm:w-auto">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
            <li>
              <Link href={hrefs.services()} className="hover:text-brand-700">
                Services
              </Link>
            </li>
            <li>
              <Link href={hrefs.areas()} className="hover:text-brand-700">
                Areas
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
        </nav>

        <a
          href={`tel:${client.contact.phone}`}
          className="rounded-brand bg-brand-600 order-2 ml-auto px-4 py-2 text-sm font-semibold text-white sm:order-3"
        >
          {client.contact.emergency ? "24/7 " : ""}
          {client.contact.phoneDisplay}
        </a>
      </div>
    </header>
  );
}
