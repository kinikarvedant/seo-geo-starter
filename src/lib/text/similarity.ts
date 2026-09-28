/**
 * Near-duplicate detection for generated pages.
 *
 * The doorway-page guard in the config schema is structural: no intro for an area
 * means no page for that area. That stops *empty* pages, but not suburb-swapped ones —
 * someone can still paste the same paragraph four times and change one word. This is
 * what catches that, and it runs in unit tests as well as in the site audit.
 *
 * Jaccard similarity over word shingles rather than character diffing: shingles ignore
 * word order at the sentence level but stay sensitive to shared phrasing, which is
 * exactly the shape of templated copy.
 */

const SHINGLE_SIZE = 4;

/** Lowercase, strip punctuation and markdown, collapse whitespace. */
export function normalise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // markdown links -> their text
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function shingles(text: string, size = SHINGLE_SIZE): Set<string> {
  const words = normalise(text);
  if (words.length < size) return new Set([words.join(" ")]);

  const set = new Set<string>();
  for (let i = 0; i <= words.length - size; i++) {
    set.add(words.slice(i, i + size).join(" "));
  }
  return set;
}

/** 0 = nothing in common, 1 = identical. */
export function similarity(a: string, b: string, size = SHINGLE_SIZE): number {
  const left = shingles(a, size);
  const right = shingles(b, size);

  let shared = 0;
  for (const shingle of left) {
    if (right.has(shingle)) shared++;
  }

  const union = left.size + right.size - shared;
  return union === 0 ? 0 : shared / union;
}

export interface SimilarPair {
  a: string;
  b: string;
  score: number;
}

/**
 * Returns every pair of labelled texts scoring at or above `threshold`, worst first.
 * 0.5 is deliberately lenient for a shared domain: two plumbing paragraphs will share
 * vocabulary honestly. What it catches is structural reuse.
 */
export function findSimilarPairs(texts: Record<string, string>, threshold = 0.5): SimilarPair[] {
  const entries = Object.entries(texts);
  const pairs: SimilarPair[] = [];

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const score = similarity(entries[i][1], entries[j][1]);
      if (score >= threshold) {
        pairs.push({ a: entries[i][0], b: entries[j][0], score });
      }
    }
  }

  return pairs.sort((x, y) => y.score - x.score);
}
