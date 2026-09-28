import type { Brand } from "@/config/schema";
import { scaleFrom, SHADES } from "./palette";

const RADIUS: Record<Brand["radius"], string> = {
  none: "0",
  sm: "0.25rem",
  md: "0.75rem",
  lg: "1.25rem",
  full: "2rem",
};

/**
 * Renders the client's brand as CSS custom properties for the document head.
 *
 * Deliberately *not* baked into the Tailwind build. The compiled stylesheet stays
 * byte-identical across clients, which means: the design system cannot quietly fork
 * per client, `CLIENT_ID=cafe npm run dev` swaps the whole brand with no recompile,
 * and a future "change your brand colour" control needs no deploy. Tailwind v4 reads
 * these through `@theme inline` in globals.css.
 *
 * It is ~600 bytes inline, so it costs no extra request and cannot flash unstyled.
 */
export function themeCss(brand: Brand): string {
  const primary = scaleFrom(brand.primary);
  const accent = scaleFrom(brand.accent);

  const declarations = [
    ...SHADES.map((shade) => `--brand-${shade}:${primary[shade]}`),
    ...SHADES.map((shade) => `--accent-${shade}:${accent[shade]}`),
    `--brand-radius:${RADIUS[brand.radius]}`,
  ];

  return `:root{${declarations.join(";")}}`;
}
