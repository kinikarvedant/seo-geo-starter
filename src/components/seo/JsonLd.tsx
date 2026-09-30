/**
 * Renders a structured-data block.
 *
 * `JSON.stringify` does not escape `<`, so a config string containing `</script>` would
 * close the tag early and everything after it would be parsed as HTML — a script
 * injection through ordinary content. Replacing `<` with its unicode escape closes
 * that, and is what the Next.js JSON-LD guide recommends.
 *
 * A native <script> tag, not next/script: JSON-LD is data, not executable code, and
 * next/script exists to schedule execution.
 */
export function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={`ld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
