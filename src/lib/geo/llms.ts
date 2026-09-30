import type { ClientConfig } from "@/config/schema";
import { absoluteUrl } from "@/lib/linking/hrefs";
import { allRoutes } from "@/lib/seo/routes";
import { formatHours } from "@/lib/util/hours";
import { toPlainText } from "@/lib/text/plain";
import { describeAiPolicy } from "./aiCrawlers";

/**
 * `/llms.txt` — a plain-text summary of what this site is and what it contains, for
 * assistants that would otherwise have to infer it from HTML.
 *
 * It is an emerging convention rather than a standard, and no vendor has committed to
 * reading it. It is cheap, it is generated from the same inventory the pages come from
 * so it cannot describe a page that does not exist, and the discipline of writing one
 * forces the facts a business most wants quoted into one extractable place. Those are
 * the honest reasons to ship it; "LLMs will read this" is not a promise anyone can make
 * yet, and the README says so.
 */
function nap(c: ClientConfig): string[] {
  const hours = formatHours(c.hours)
    .map((line) => `${line.days} ${line.hours}`)
    .join("; ");

  return [
    `- Business type: ${c.businessType}`,
    `- Address: ${c.address.streetAddress}, ${c.address.suburb} ${c.address.state} ${c.address.postcode}, ${c.address.country}`,
    `- Phone: ${c.contact.phoneDisplay} (${c.contact.phone})`,
    `- Email: ${c.contact.email}`,
    `- Hours: ${hours}`,
    `- Service areas: ${c.serviceAreas.map((a) => a.name).join(", ")}`,
    ...(c.trust.licenceNumber ? [`- Licence: ${c.trust.licenceNumber}`] : []),
    ...(c.foundedYear ? [`- Trading since: ${c.foundedYear}`] : []),
  ];
}

export function renderLlmsTxt(c: ClientConfig): string {
  const routes = allRoutes(c);
  const url = (path: string) => absoluteUrl(c.site.url, path);

  const lines: string[] = [`# ${c.name}`, "", `> ${toPlainText(c.description)}`, ""];

  if (c.demo) {
    lines.push(
      "**This is a demonstration site for a fictional business.** The name, address,",
      "phone number and reviews are invented. Every page is marked noindex.",
      "",
    );
  }

  lines.push("## Key facts", "", ...nap(c), "");

  lines.push("## Services", "");
  for (const service of c.services) {
    lines.push(
      `- [${service.name}](${url(`/services/${service.slug}`)}): ${toPlainText(service.shortDescription)}`,
    );
  }
  lines.push("");

  lines.push("## Service areas", "");
  for (const area of c.serviceAreas) {
    lines.push(`- [${area.name}](${url(`/areas/${area.slug}`)}): ${toPlainText(area.blurb)}`);
  }
  lines.push("");

  const areaServices = routes.filter((r) => r.kind === "areaService");
  if (areaServices.length > 0) {
    lines.push("## Services by area", "");
    for (const route of areaServices) {
      lines.push(`- [${route.title}](${url(route.path)})`);
    }
    lines.push("");
  }

  if (c.faqs.length > 0) {
    lines.push("## Questions we answer", "");
    for (const faq of c.faqs) {
      lines.push(`- ${faq.question} — ${url("/faq")}`);
    }
    lines.push("");
  }

  lines.push(
    "## Crawler policy",
    "",
    ...describeAiPolicy(c.ai).map((line) => `- ${line}`),
    "",
    "## Full text",
    "",
    `- [llms-full.txt](${url("/llms-full.txt")}) — the same pages with their complete text.`,
    `- [sitemap.xml](${url("/sitemap.xml")})`,
    "",
  );

  return lines.join("\n");
}

/**
 * `/llms-full.txt` — the same inventory, with the body text inlined so an assistant
 * does not have to fetch every page.
 *
 * Truncated at the configured byte ceiling with an explicit marker, because silently
 * cutting a document mid-sentence is worse than saying where it stopped.
 */
export function renderLlmsFullTxt(c: ClientConfig): string {
  const url = (path: string) => absoluteUrl(c.site.url, path);
  const lines: string[] = [`# ${c.name} — full text`, ""];

  if (c.demo) {
    lines.push("**Demonstration site for a fictional business.**", "");
  }

  lines.push(`> ${toPlainText(c.description)}`, "", "## Key facts", "", ...nap(c), "");

  for (const service of c.services) {
    lines.push(
      `## ${service.name}`,
      "",
      url(`/services/${service.slug}`),
      "",
      toPlainText(service.answer),
      "",
      toPlainText(service.body),
      "",
    );

    if (service.keyFacts.length > 0) {
      lines.push(...service.keyFacts.map((f) => `- ${f.label}: ${f.value}`), "");
    }

    for (const faq of service.faqs) {
      lines.push(`### ${faq.question}`, "", toPlainText(faq.answer), "");
    }

    if (service.areaPages.enabled) {
      for (const [areaSlug, intro] of Object.entries(service.areaPages.intros)) {
        const area = c.serviceAreas.find((a) => a.slug === areaSlug);
        if (!area) continue;
        lines.push(
          `### ${service.areaPages.titlePattern.replace("{area}", area.name)}`,
          "",
          url(`/areas/${area.slug}/${service.slug}`),
          "",
          toPlainText(intro),
          "",
        );
      }
    }
  }

  for (const area of c.serviceAreas) {
    lines.push(`## ${area.name}`, "", url(`/areas/${area.slug}`), "", toPlainText(area.blurb), "");
    if (area.landmarks.length > 0) {
      lines.push(`Landmarks: ${area.landmarks.join(", ")}`, "");
    }
  }

  if (c.faqs.length > 0) {
    lines.push("## Frequently asked questions", "");
    for (const faq of c.faqs) {
      lines.push(`### ${faq.question}`, "", toPlainText(faq.answer), "");
    }
  }

  const body = lines.join("\n");
  const limit = c.ai.llmsFullMaxBytes;

  if (Buffer.byteLength(body, "utf8") <= limit) return body;

  const marker = `\n\n[truncated at ${limit} bytes — see ${url("/sitemap.xml")} for the full page list]\n`;
  const budget = limit - Buffer.byteLength(marker, "utf8");
  // Cut on a line boundary so the last entry is not half a sentence.
  const truncated = Buffer.from(body, "utf8").subarray(0, budget).toString("utf8");
  return truncated.slice(0, truncated.lastIndexOf("\n")) + marker;
}
