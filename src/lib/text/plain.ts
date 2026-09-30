/**
 * Strips the light markdown allowed in config copy, for contexts that need plain text:
 * JSON-LD answer bodies, llms.txt, meta descriptions.
 *
 * It exists so that a single authored string can serve both the rendered page and the
 * structured data. Two separate fields — one rich, one plain — is how FAQ markup drifts
 * out of sync with the visible answer, so the schema deliberately does not offer that.
 */
export function toPlainText(markdown: string): string {
  return (
    markdown
      .replace(/```[\s\S]*?```/g, " ") // fenced code
      .replace(/`([^`]+)`/g, "$1") // inline code
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> their text
      .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
      .replace(/^\s{0,3}>\s?/gm, "") // blockquotes
      .replace(/^\s*[-*+]\s+/gm, "") // list bullets
      .replace(/^\s*\d+\.\s+/gm, "") // ordered list markers
      .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
      // No italic pass. `Markdown` does not render italics, so stripping them here would
      // make the plain text disagree with the page — and the naive pattern also eats
      // ordinary underscores, turning "new_patient_form" into "newpatientform".
      .replace(/\s+/g, " ")
      .trim()
  );
}
