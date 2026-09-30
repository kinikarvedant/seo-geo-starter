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

> **Status: milestones 1–4 of 10.** Config layer, theme, container shape, the route
> inventory, every page type, metadata, sitemap, robots with AI-crawler policy, and the
> structured-data layer are in place. Still to come: `llms.txt`, the contact form, the
> blog/content layer, the performance pass and the full audit script.

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

**One route inventory.** `allRoutes()` is the only thing that enumerates URLs. Page
generation, metadata, the sitemap and the endpoint tests all read from it, so the
sitemap cannot advertise a page that 404s, and a page cannot exist that the sitemap
never mentions. Drift between those is the most common finding in a technical SEO audit.

**One entity, referenced everywhere.** Organization, LocalBusiness and WebSite are
declared once in the root layout with stable `@id`s; every page-level node points at
them by reference instead of repeating the business. Without that, a crawler sees a
different anonymous business on every page rather than one entity — which matters more
for LLM citation than for classic ranking.

**FAQ copy and FAQ markup cannot drift.** `FAQSection` renders the questions and emits
the `FAQPage` JSON-LD from the same array in the same pass, an ESLint rule stops any
other file importing the generator, and a test compares the questions in the served
HTML against the questions in the served markup.

**No `aggregateRating`.** Self-serving review markup on your own site is against Google's
structured data policy and risks a manual action, so `trust.reviews.emitSchema` is typed
as literal `false`, the validator rejects the property on the raw node, and the endpoint
tests assert it never appears in any served page.

## AI crawler policy

`robots.ts` writes per-bot rules from `client.ai`. The presets are organised by
_purpose_, not by vendor, because the distinction that matters is whether a crawler
trains on your content or retrieves it to cite you in an answer:

| Preset           | Training crawlers | Retrieval / user-fetch |
| ---------------- | ----------------- | ---------------------- |
| `open` (default) | allowed           | allowed                |
| `search-only`    | blocked           | allowed                |
| `closed`         | blocked           | blocked                |

Two things worth knowing, because both are commonly got wrong:

- **`Google-Extended` does not affect Google Search or AI Overviews.** It governs Gemini
  training and grounding only. AI Overviews draw on the normal Search index.
- **`Disallow` is not `noindex`.** A blocked page can still be indexed from inbound
  links, and because the crawler never fetches it, it never sees a `noindex` either.
  That is why demo sites here keep robots.txt open and use a meta robots tag.

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
