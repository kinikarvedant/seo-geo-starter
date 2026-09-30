import type { ClientConfig } from "@/config/schema";

/**
 * AI crawler policy.
 *
 * The distinction that matters, and that most robots.txt advice gets wrong, is
 * *purpose*. A training crawler takes your content to train a model; you get nothing
 * back. A retrieval crawler fetches your page at the moment someone asks a question,
 * and cites you in the answer. Blocking the second kind to protect yourself from the
 * first is how a business disappears from AI answers entirely.
 *
 * So the presets are organised by purpose, not by vendor.
 */

export type CrawlerPurpose = "training" | "search" | "user-fetch";

export interface Crawler {
  vendor: string;
  purpose: CrawlerPurpose;
  note: string;
}

export const AI_CRAWLERS = {
  GPTBot: {
    vendor: "OpenAI",
    purpose: "training",
    note: "Collects content for model training.",
  },
  "OAI-SearchBot": {
    vendor: "OpenAI",
    purpose: "search",
    note: "Builds the index ChatGPT search cites from. Blocking it removes you from those citations.",
  },
  "ChatGPT-User": {
    vendor: "OpenAI",
    purpose: "user-fetch",
    note: "Fetches a page because a user asked about it, in the moment.",
  },
  ClaudeBot: {
    vendor: "Anthropic",
    purpose: "training",
    note: "Collects content for model training.",
  },
  "Claude-User": {
    vendor: "Anthropic",
    purpose: "user-fetch",
    note: "Fetches a page on behalf of a user's request.",
  },
  PerplexityBot: {
    vendor: "Perplexity",
    purpose: "search",
    note: "Indexes for Perplexity's cited answers.",
  },
  "Google-Extended": {
    vendor: "Google",
    purpose: "training",
    note: "Gemini training and grounding only. It does NOT affect Google Search or AI Overviews.",
  },
  Applebot: {
    vendor: "Apple",
    purpose: "search",
    note: "Siri and Spotlight suggestions.",
  },
} as const satisfies Record<string, Crawler>;

export type CrawlerName = keyof typeof AI_CRAWLERS;

export type Decision = "allow" | "disallow";

/**
 * open        — everything allowed. The default, because being cited is the point.
 * search-only — retrieval and user-fetch allowed, training denied. The considered
 *               middle ground for a client who objects to training on their content
 *               but still wants to appear in AI answers.
 * closed      — everything denied. Costs the client their AI visibility; documented
 *               plainly so nobody chooses it by accident.
 */
export const PRESETS: Record<ClientConfig["ai"]["preset"], Record<CrawlerPurpose, Decision>> = {
  open: { training: "allow", search: "allow", "user-fetch": "allow" },
  "search-only": { training: "disallow", search: "allow", "user-fetch": "allow" },
  closed: { training: "disallow", search: "disallow", "user-fetch": "disallow" },
};

export interface CrawlerRule {
  userAgent: string;
  allow?: string;
  disallow?: string | string[];
}

/**
 * Nothing under /api is a page. This is repeated into every group on purpose: a crawler
 * obeys only the most specific group that matches its name, and groups do not merge, so
 * a rule in the wildcard block does not reach a named agent.
 */
const NEVER_CRAWL = "/api/";

/**
 * Resolves the preset, then applies any per-agent overrides on top.
 *
 * Overrides name a user agent directly, so a client can allow ClaudeBot while denying
 * GPTBot without abandoning the preset for a hand-written list.
 */
export function resolveAiRules(ai: ClientConfig["ai"]): CrawlerRule[] {
  const byPurpose = PRESETS[ai.preset];

  // Overrides may name an agent we have no entry for — new crawlers appear constantly,
  // and a client who explicitly asked to block one must get that rule rather than
  // silent nothing. Unknown agents have no purpose to fall back on, so the override is
  // the whole decision.
  const unknownOverrides = Object.keys(ai.overrides).filter((name) => !(name in AI_CRAWLERS));

  const known = Object.entries(AI_CRAWLERS).map(([name, crawler]) => {
    const decision: Decision = ai.overrides[name] ?? byPurpose[crawler.purpose];
    return toRule(name, decision);
  });

  return [...known, ...unknownOverrides.map((name) => toRule(name, ai.overrides[name]!))];
}

function toRule(userAgent: string, decision: Decision): CrawlerRule {
  return decision === "allow"
    ? { userAgent, allow: "/", disallow: NEVER_CRAWL }
    : { userAgent, disallow: "/" };
}

/** Human-readable explanation of the active policy, for the README and llms.txt. */
export function describeAiPolicy(ai: ClientConfig["ai"]): string[] {
  return resolveAiRules(ai).map((rule) => {
    const crawler: Crawler | undefined = AI_CRAWLERS[rule.userAgent as CrawlerName];
    const verb = rule.allow ? "allowed" : "blocked";
    const who = crawler ? `${crawler.vendor}, ${crawler.purpose}` : "configured by override";
    return `${rule.userAgent} (${who}): ${verb}`;
  });
}
