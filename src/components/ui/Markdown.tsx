import type { JSX } from "react";

/**
 * A deliberately small markdown renderer for config-authored body copy.
 *
 * Config bodies are written by the agency, not by users, and need paragraphs, the odd
 * subheading and bullet lists — nothing more. A full MDX pipeline arrives with the
 * content layer, where blog posts justify it. Pulling one in now would add a parser
 * and a sanitiser to render text we already control.
 *
 * Headings start at h2: every page owns exactly one h1, and a body that could emit its
 * own would break the heading hierarchy the audit checks.
 */
export function Markdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="space-y-4 text-slate-700">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="pt-2 text-lg font-semibold text-slate-900">
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-4 text-xl font-semibold text-slate-900">
              {trimmed.slice(3)}
            </h2>
          );
        }

        const lines = trimmed.split("\n");
        if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((line, j) => (
                <li key={j}>{inline(line.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{inline(trimmed.replace(/\n/g, " "))}</p>;
      })}
    </div>
  );
}

/** Bold only. Anything richer belongs in MDX, not in a config string. */
function inline(text: string): (string | JSX.Element)[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-slate-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}
