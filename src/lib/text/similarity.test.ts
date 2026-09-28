import { describe, expect, it } from "vitest";
import { findSimilarPairs, normalise, shingles, similarity } from "./similarity";

describe("normalise", () => {
  it("strips punctuation and casing", () => {
    expect(normalise("Blocked Drains, Fast!")).toEqual(["blocked", "drains", "fast"]);
  });

  it("keeps the text of a markdown link and drops the URL", () => {
    expect(normalise("see [our drains page](/services/drains)")).toEqual([
      "see",
      "our",
      "drains",
      "page",
    ]);
  });
});

describe("similarity", () => {
  it("scores identical text as 1", () => {
    const text = "We clear blocked drains across Melbourne's inner north on the same day.";
    expect(similarity(text, text)).toBe(1);
  });

  it("scores unrelated text near 0", () => {
    const a = "We clear blocked drains across Melbourne's inner north on the same day.";
    const b = "Our roastery sits behind glass at the back of the Gertrude Street shop.";
    expect(similarity(a, b)).toBeLessThan(0.05);
  });

  it("catches suburb-swapped copy, which is the whole point", () => {
    // The exact failure mode the doorway-page guard exists to prevent.
    const brunswick =
      "Looking for an emergency plumber in Brunswick? We arrive within the hour, any time of day or night, and we carry the parts to fix most bursts on the first visit.";
    const preston = brunswick.replace("Brunswick", "Preston");

    // Measured at ~0.73, not the ~0.95 intuition suggests: the swapped word appears in
    // four shingles, so it destroys four on each side of a ~25-shingle text. This is
    // precisely why the threshold is 0.5 — a 0.8 cutoff would wave this copy through.
    expect(similarity(brunswick, preston)).toBeGreaterThan(0.7);
    expect(similarity(brunswick, preston)).toBeLessThan(0.8);
  });

  it("does not punish two honest paragraphs from the same trade", () => {
    const a =
      "Tree roots get into old clay pipes through the joints, and once they are in they keep growing until the drain blocks completely. A camera inspection shows exactly where.";
    const b =
      "Continuous flow units heat water on demand instead of keeping a tank hot, which suits a household that showers at unpredictable times or has run out once too often.";
    expect(similarity(a, b)).toBeLessThan(0.3);
  });

  it("handles text shorter than the shingle size", () => {
    expect(similarity("hot water", "hot water")).toBe(1);
    expect(similarity("hot water", "blocked drain")).toBe(0);
  });

  it("is symmetric", () => {
    const a = "Same-day blocked drain clearing with a camera inspection included.";
    const b = "Same-day drain clearing, camera inspection included on every job.";
    expect(similarity(a, b)).toBeCloseTo(similarity(b, a), 10);
  });
});

describe("shingles", () => {
  it("produces overlapping windows", () => {
    expect([...shingles("one two three four five", 4)]).toEqual([
      "one two three four",
      "two three four five",
    ]);
  });
});

describe("findSimilarPairs", () => {
  it("reports offending pairs worst first and stays quiet otherwise", () => {
    const base =
      "Looking for an emergency plumber in Brunswick? We arrive within the hour, any time of day or night, and carry parts to fix most bursts on the first visit.";
    const pairs = findSimilarPairs({
      brunswick: base,
      preston: base.replace("Brunswick", "Preston"),
      northcote:
        "Northcote's Edwardian terraces still run a lot of original earthenware, so the calls we get here are usually root intrusion rather than a sudden burst.",
    });

    expect(pairs).toHaveLength(1);
    expect([pairs[0].a, pairs[0].b].sort()).toEqual(["brunswick", "preston"]);
    expect(pairs[0].score).toBeGreaterThan(0.7);
  });
});
