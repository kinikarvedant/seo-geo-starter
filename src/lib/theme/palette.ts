import {
  contrastRatio,
  hexToRgb,
  oklabToRgb,
  relativeLuminance,
  rgbToHex,
  rgbToOklab,
} from "./color";

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Shade = (typeof SHADES)[number];
export type Ramp = Record<Shade, string>;

/**
 * Target OKLab lightness per shade. These are the values Tailwind's own palettes sit
 * close to, so a generated ramp lands in familiar territory: 500 reads as "the brand
 * colour", 600/700 are safe for text and buttons, 50/100 are page-tint backgrounds.
 */
const TARGET_LIGHTNESS: Record<Shade, number> = {
  50: 0.971,
  100: 0.936,
  200: 0.885,
  300: 0.808,
  400: 0.704,
  500: 0.637,
  600: 0.577,
  700: 0.505,
  800: 0.443,
  900: 0.396,
  950: 0.262,
};

/**
 * Chroma is scaled rather than held constant: real palettes lose saturation at the
 * extremes because near-white and near-black simply cannot hold much chroma, and
 * forcing it produces the neon-pastel look that gives generated palettes away.
 */
const CHROMA_SCALE: Record<Shade, number> = {
  50: 0.28,
  100: 0.42,
  200: 0.6,
  300: 0.8,
  400: 0.95,
  500: 1,
  600: 1,
  700: 0.94,
  800: 0.84,
  900: 0.76,
  950: 0.6,
};

/**
 * The shades used for text and solid buttons on a white surface, and the WCAG ratio
 * each must clear. A fixed lightness cannot guarantee this: at the same perceptual
 * lightness a green carries far more relative luminance than a blue, so a ramp tuned
 * on one hue quietly fails AA on another. These shades are therefore *solved* for
 * contrast rather than assumed.
 */
const MIN_CONTRAST_ON_WHITE: Partial<Record<Shade, number>> = {
  600: 4.5,
  700: 4.5,
  800: 7,
  900: 8,
  950: 12,
};

const WHITE = "#ffffff";

function atLightness(L: number, hue: number, chroma: number): string {
  return rgbToHex(oklabToRgb({ L, a: Math.cos(hue) * chroma, b: Math.sin(hue) * chroma }));
}

/**
 * Finds the lightest colour on this hue that still clears `target` contrast on white.
 * Binary search rather than a lookup table, because the answer depends on the client's
 * hue and we would otherwise be maintaining a table per brand colour.
 */
function darkenToContrast(startL: number, hue: number, chroma: number, target: number): number {
  if (contrastRatio(atLightness(startL, hue, chroma), WHITE) >= target) return startL;

  let lo = 0;
  let hi = startL;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (contrastRatio(atLightness(mid, hue, chroma), WHITE) >= target) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
}

/**
 * Builds a full 50–950 ramp from one authored hex.
 *
 * The client config asks for two colours, not twenty-two: agencies do not have brand
 * ramps for small local businesses, they have a logo with a colour in it. Deriving the
 * rest keeps the config honest about what a client can actually supply — and means
 * accessibility is a property of the generator, not of the colour the client picked.
 */
export function scaleFrom(hex: string): Ramp {
  const base = rgbToOklab(hexToRgb(hex));
  const chroma = Math.hypot(base.a, base.b);
  const hue = Math.atan2(base.b, base.a);

  const ramp = {} as Ramp;
  let previousLuminance = Number.POSITIVE_INFINITY;

  for (const shade of SHADES) {
    const c = chroma * CHROMA_SCALE[shade];
    const required = MIN_CONTRAST_ON_WHITE[shade];
    let L = TARGET_LIGHTNESS[shade];

    if (required !== undefined) {
      L = darkenToContrast(L, hue, c, required);
    }

    let hexValue = atLightness(L, hue, c);

    // Keep the ramp monotonically darker. Solving for contrast can otherwise make a
    // shade land lighter than the one before it on hues that needed heavy correction.
    let luminance = relativeLuminance(hexToRgb(hexValue));
    while (luminance >= previousLuminance && L > 0) {
      L -= 0.005;
      hexValue = atLightness(L, hue, c);
      luminance = relativeLuminance(hexToRgb(hexValue));
    }

    previousLuminance = luminance;
    ramp[shade] = hexValue;
  }

  return ramp;
}
