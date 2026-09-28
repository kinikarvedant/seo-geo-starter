# SEO / AEO / GEO client site starter

A config-driven Next.js template for launching agency client sites that are optimised
for three things at once:

- **SEO** — conventional search ranking: metadata, canonicals, sitemaps, internal linking
- **AEO** — answer engines: featured snippets, AI Overviews and voice answers, which need
  answer-first content structure and valid structured data
- **GEO** — being cited by LLM assistants: `llms.txt`, per-bot crawler policy, and facts
  that survive being read without JavaScript

One source tree builds every client. `CLIENT_ID=cafe npm run build` produces a different
site — different routes, sitemap, structured data, brand and copy — from the same code.

> **Status: milestone 1 of 10.** Config layer, theme derivation and container shape are
> in place. Routing, metadata, JSON-LD, AEO components, the GEO layer and the audit
> script land in later milestones. This README grows with them.

## Why it is built this way

**Config is selected at build time, not per request.** Each client gets its own image
and its own origin. Per-origin `robots.txt`, `llms.txt` and `sitemap.xml` are the point
of the project, and `NEXT_PUBLIC_*` is inlined at build time, so one image serving many
hostnames would bake the wrong canonical URL into every page.

**Brand colours are derived, not authored.** A client supplies two hex colours; the
50–950 ramp is generated in OKLab. Shades used for text and buttons are _solved_ for
WCAG contrast rather than assigned a fixed lightness — at equal perceptual lightness a
green carries far more relative luminance than a blue, so a fixed ramp passes AA on one
hue and fails it on another. See `src/lib/theme/palette.ts`.

**Service-area pages cannot exist without unique copy.** `areaPages.intros` is keyed by
area slug and a page is only generated where prose exists for that area. Mass-produced
"Emergency plumber in {suburb}" pages with the suburb swapped are what Google's
doorway-page policy targets, so the schema is written so the bad version cannot be
expressed.

**Demo sites are marked as demos.** The three showcase clients are fictional. `demo: true`
forces `noindex` and renders a banner: fabricated business names, addresses and phone
numbers should not enter the local search index, where they can be matched against real
listings.

**No `aggregateRating`.** Self-serving review markup on your own site is against Google's
structured data policy and risks a manual action, so `trust.reviews.emitSchema` is typed
as literal `false`.

## Demo clients

| Client    | Business                       | Origin                          |
| --------- | ------------------------------ | ------------------------------- |
| `dental`  | Dental clinic, Richmond VIC    | `bridgeroaddental.duckdns.org`  |
| `cafe`    | Specialty roaster, Fitzroy VIC | `fitzroyroasters.duckdns.org`   |
| `plumber` | 24/7 plumber, Northcote VIC    | `northcoteplumbing.duckdns.org` |

## Getting started

```bash
npm install
CLIENT_ID=plumber npm run dev     # any client id from src/clients/registry.ts
npm run verify                    # lint + typecheck + tests
```

Build a specific client, the way CI and Docker do:

```bash
CLIENT_ID=cafe NEXT_PUBLIC_SITE_URL=https://fitzroyroasters.duckdns.org npm run build
```

```bash
docker build --build-arg CLIENT_ID=cafe \
  --build-arg NEXT_PUBLIC_SITE_URL=https://fitzroyroasters.duckdns.org \
  -t seo-starter:cafe .
```

## Stack

Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4, Zod 4 for config
validation, schema-dts for structured-data types, Vitest for unit tests.

## Licence

MIT
