import type { Metadata } from "next";
import { client } from "@/config/load";
import { themeCss } from "@/lib/theme/cssVars";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteGraphJsonLd } from "@/lib/seo/jsonld/graph";
import "./globals.css";

/**
 * `metadataBase` is what lets every other route hand Next a relative path and still
 * emit an absolute canonical. It comes from the build-time config, never from request
 * headers — deriving an origin from `Host` behind a reverse proxy is the classic way
 * to ship wrong canonicals to production.
 */
export const metadata: Metadata = {
  metadataBase: new URL(client.site.url),
  title: {
    default: `${client.name} | ${client.tagline}`,
    // Applies to child segments only; the default above covers this one.
    template: client.site.titleTemplate.replace("%site%", client.name),
  },
  description: client.description,
  applicationName: client.name,
  // A demo site must never enter the index. See DemoBanner for the reasoning.
  robots: client.demo
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          // Without these, Google may truncate the snippet it is willing to quote —
          // which is exactly the text the AEO work exists to get quoted.
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      },
  openGraph: {
    type: "website",
    siteName: client.name,
    locale: client.site.locale.replace("-", "_"),
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={client.site.locale}>
      <head>
        {/* Inline so the brand is applied before first paint — no FOUC, no extra request. */}
        <style id="brand-theme" dangerouslySetInnerHTML={{ __html: themeCss(client.brand) }} />
        {/* Organization, LocalBusiness and WebSite, declared once for the whole site.
            Page-level nodes reference these by @id rather than repeating them. */}
        <JsonLd id="site" data={siteGraphJsonLd(client)} />
      </head>
      <body className="bg-white text-slate-800 antialiased">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
