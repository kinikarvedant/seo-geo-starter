import type {
  CafeOrCoffeeShop,
  Dentist,
  LocalBusiness,
  Organization,
  Plumber,
  WebSite,
  WithContext,
} from "schema-dts";
import type { BusinessType, ClientConfig } from "@/config/schema";
import { ids } from "./ids";

/**
 * schema.org type per business, driven by the config enum.
 *
 * `satisfies` rather than a bare object so adding a business type to the schema without
 * mapping it here is a compile error, not a silent fallback to generic LocalBusiness.
 * The subtype is worth getting right: `Dentist` inherits MedicalBusiness properties
 * that a plain LocalBusiness does not have, and consumers key off it.
 */
export const LOCAL_BUSINESS_TYPE = {
  dentist: "Dentist",
  cafe: "CafeOrCoffeeShop",
  plumber: "Plumber",
  generic: "LocalBusiness",
} as const satisfies Record<BusinessType, string>;

const DAY_NAMES = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
} as const;

/**
 * Opening hours in the 24-hour form schema.org wants.
 *
 * A 24/7 business collapses to one all-days entry rather than seven identical ones.
 * The config forbids listing regular hours alongside `alwaysOpen`, so the two branches
 * here cannot both be true and the output cannot contradict itself.
 */
function openingHours(hours: ClientConfig["hours"]) {
  if (hours.alwaysOpen) {
    return [
      {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: Object.values(DAY_NAMES),
        opens: "00:00",
        closes: "23:59",
      },
    ];
  }

  return hours.regular.map((block) => ({
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: block.days.map((day) => DAY_NAMES[day]),
    opens: block.opens,
    closes: block.closes,
  }));
}

function sameAs(c: ClientConfig): string[] {
  // Google Business Profile first: it is the strongest signal for resolving a local
  // business to a real-world entity.
  return [
    c.social.googleBusinessProfile,
    c.social.facebook,
    c.social.instagram,
    c.social.linkedin,
    c.social.youtube,
  ].filter((url): url is string => typeof url === "string");
}

function postalAddress(c: ClientConfig) {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: c.address.streetAddress,
    addressLocality: c.address.suburb,
    addressRegion: c.address.state,
    postalCode: c.address.postcode,
    addressCountry: c.address.country,
  };
}

export function organizationJsonLd(c: ClientConfig): WithContext<Organization> {
  const links = sameAs(c);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ids.organization(c),
    name: c.name,
    legalName: c.legalName,
    url: c.site.url,
    description: c.description,
    telephone: c.contact.phone,
    email: c.contact.email,
    address: postalAddress(c),
    ...(c.foundedYear ? { foundingDate: String(c.foundedYear) } : {}),
    ...(links.length ? { sameAs: links } : {}),
  };
}

/**
 * Built with `satisfies` rather than an explicit return type.
 *
 * schema-dts checks the literal against the real schema.org vocabulary — a misspelled
 * property or a bad DayOfWeek value is a compile error — but its LocalBusiness type is
 * a union wide enough that callers cannot index into it (`node["@type"]` fails).
 * `satisfies` gives us the checking without imposing the union on consumers, so tests
 * and the audit can read the fields they need.
 */
export function localBusinessJsonLd(c: ClientConfig) {
  const links = sameAs(c);

  return {
    "@context": "https://schema.org",
    "@type": LOCAL_BUSINESS_TYPE[c.businessType],
    "@id": ids.localBusiness(c),
    name: c.name,
    description: c.description,
    url: c.site.url,
    telephone: c.contact.phone,
    email: c.contact.email,
    address: postalAddress(c),
    geo: {
      "@type": "GeoCoordinates",
      latitude: c.address.geo.lat,
      longitude: c.address.geo.lng,
    },
    openingHoursSpecification: openingHours(c.hours),
    areaServed: c.serviceAreas.map((area) => ({
      "@type": "City" as const,
      name: area.name,
      ...(area.postcode ? { postalCode: area.postcode } : {}),
    })),
    parentOrganization: { "@id": ids.organization(c) },
    ...(c.address.mapUrl ? { hasMap: c.address.mapUrl } : {}),
    ...(links.length ? { sameAs: links } : {}),
    // No aggregateRating, ever. Self-serving review markup on your own site is against
    // Google's structured data policy and risks a manual action. The config makes it
    // unreachable (emitSchema is typed literal false), validateJsonLdBlob rejects it on
    // the raw node, and a test asserts it never appears.
  } satisfies WithContext<Dentist | CafeOrCoffeeShop | Plumber | LocalBusiness>;
}

export type BusinessNode = ReturnType<typeof localBusinessJsonLd>;

export function websiteJsonLd(c: ClientConfig): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ids.website(c),
    url: c.site.url,
    name: c.name,
    description: c.description,
    inLanguage: c.site.locale,
    publisher: { "@id": ids.organization(c) },
  };
}
