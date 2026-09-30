import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    /**
     * The FAQ single-source fence.
     *
     * `faqPageJsonLd` may only be called by the component that also renders the visible
     * questions, so FAQ markup and FAQ copy cannot describe different things. Without
     * this, any page could emit FAQ schema for questions it does not display — which is
     * both a structured-data policy problem and the exact drift this design prevents.
     */
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/components/aeo/FAQSection.tsx",
      "src/lib/seo/jsonld/**",
      "src/**/*.test.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/seo/jsonld/content",
              importNames: ["faqPageJsonLd"],
              message:
                "FAQ structured data may only be emitted by components/aeo/FAQSection.tsx, which renders the same questions it marks up.",
            },
          ],
        },
      ],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
