import { describe, expect, it } from "vitest";
import { AI_CRAWLERS, describeAiPolicy, resolveAiRules } from "./aiCrawlers";

const ai = (overrides: Partial<Parameters<typeof resolveAiRules>[0]> = {}) => ({
  preset: "open" as const,
  overrides: {},
  llmsFullMaxBytes: 400_000,
  ...overrides,
});

const byAgent = (rules: ReturnType<typeof resolveAiRules>) =>
  Object.fromEntries(rules.map((r) => [r.userAgent, r]));

describe("resolveAiRules", () => {
  it("allows every crawler under the open preset", () => {
    const rules = byAgent(resolveAiRules(ai()));
    for (const name of Object.keys(AI_CRAWLERS)) {
      expect(rules[name].allow, name).toBe("/");
    }
  });

  it("blocks training crawlers but keeps retrieval ones under search-only", () => {
    const rules = byAgent(resolveAiRules(ai({ preset: "search-only" })));

    // Training: nothing comes back to the client.
    expect(rules.GPTBot.disallow).toBe("/");
    expect(rules.ClaudeBot.disallow).toBe("/");
    expect(rules["Google-Extended"].disallow).toBe("/");

    // Retrieval and user-fetch: this is what produces citations.
    expect(rules["OAI-SearchBot"].allow).toBe("/");
    expect(rules.PerplexityBot.allow).toBe("/");
    expect(rules["ChatGPT-User"].allow).toBe("/");
  });

  it("blocks everything under closed", () => {
    for (const rule of resolveAiRules(ai({ preset: "closed" }))) {
      expect(rule.disallow, rule.userAgent).toBe("/");
    }
  });

  it("lets an override beat the preset for one agent", () => {
    const rules = byAgent(
      resolveAiRules(ai({ preset: "closed", overrides: { PerplexityBot: "allow" } })),
    );
    expect(rules.PerplexityBot.allow).toBe("/");
    expect(rules.GPTBot.disallow).toBe("/");
  });

  it("emits a rule for a crawler it has never heard of", () => {
    // New crawlers appear constantly. A client who explicitly asked to block one must
    // get that rule, not silence.
    const rules = byAgent(resolveAiRules(ai({ overrides: { Bytespider: "disallow" } })));
    expect(rules.Bytespider).toEqual({ userAgent: "Bytespider", disallow: "/" });
  });

  it("repeats the /api/ exclusion into every allowed group", () => {
    // robots.txt groups do not merge: a crawler obeys only its most specific matching
    // group, so a Disallow in the wildcard block never reaches a named agent.
    for (const rule of resolveAiRules(ai())) {
      if (rule.allow) expect(rule.disallow, rule.userAgent).toBe("/api/");
    }
  });

  it("does not bother excluding /api/ from an agent already blocked entirely", () => {
    for (const rule of resolveAiRules(ai({ preset: "closed" }))) {
      expect(rule.allow).toBeUndefined();
      expect(rule.disallow).toBe("/");
    }
  });
});

describe("describeAiPolicy", () => {
  it("describes every rule, including an agent it has no entry for", () => {
    const lines = describeAiPolicy(ai({ overrides: { Bytespider: "disallow" } }));
    expect(lines).toHaveLength(Object.keys(AI_CRAWLERS).length + 1);
    expect(lines.at(-1)).toBe("Bytespider (configured by override): blocked");
  });

  it("names the vendor and purpose for a known crawler", () => {
    expect(describeAiPolicy(ai())).toContain("GPTBot (OpenAI, training): allowed");
  });
});
