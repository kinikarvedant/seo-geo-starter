import { describe, expect, it } from "vitest";
import {
  contrastRatio,
  hexToRgb,
  relativeLuminance,
  rgbToHex,
  rgbToOklab,
  oklabToRgb,
} from "./color";
import { scaleFrom, SHADES } from "./palette";

describe("colour conversion", () => {
  it("round-trips hex through rgb", () => {
    expect(rgbToHex(hexToRgb("#0f766e"))).toBe("#0f766e");
  });

  it("expands three-digit hex", () => {
    expect(hexToRgb("#f00")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("rejects a value that is not a colour", () => {
    expect(() => hexToRgb("teal")).toThrow(/Not a hex colour/);
  });

  it("round-trips rgb through OKLab within a rounding error", () => {
    const original = { r: 15, g: 118, b: 110 };
    const back = oklabToRgb(rgbToOklab(original));
    expect(Math.abs(back.r - original.r)).toBeLessThan(1);
    expect(Math.abs(back.g - original.g)).toBeLessThan(1);
    expect(Math.abs(back.b - original.b)).toBeLessThan(1);
  });

  it("computes the known contrast ratio of black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#0f766e", "#ffffff")).toBeCloseTo(
      contrastRatio("#ffffff", "#0f766e"),
      10,
    );
  });

  it("puts white at full luminance and black at zero", () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 10);
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 10);
  });
});

describe("scaleFrom", () => {
  const brands = ["#0f766e", "#b45309", "#1d4ed8", "#be123c", "#4d7c0f"];

  it("produces every shade", () => {
    const ramp = scaleFrom("#0f766e");
    expect(
      Object.keys(ramp)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual([...SHADES]);
  });

  it("is deterministic", () => {
    expect(scaleFrom("#1d4ed8")).toEqual(scaleFrom("#1d4ed8"));
  });

  it.each(brands)("darkens monotonically for %s", (brand) => {
    const ramp = scaleFrom(brand);
    const luminances = SHADES.map((s) => relativeLuminance(hexToRgb(ramp[s])));
    for (let i = 1; i < luminances.length; i++) {
      expect(luminances[i]).toBeLessThan(luminances[i - 1]);
    }
  });

  it.each(brands)("keeps shade 600 readable on white for %s", (brand) => {
    // WCAG AA body text. A brand colour that fails here would ship unreadable
    // links and buttons, so this is a real accessibility gate, not a nicety.
    expect(contrastRatio(scaleFrom(brand)[600], "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it.each(brands)("keeps white readable on shade 700 for %s", (brand) => {
    expect(contrastRatio(scaleFrom(brand)[700], "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it.each(brands)("keeps body text readable on the shade-50 tint for %s", (brand) => {
    // What actually matters for a tinted section is text-on-tint contrast, not raw
    // luminance: WCAG weights red at 0.2126 and green at 0.7152, so a crimson tint
    // measures darker than a green one that looks identically pale.
    const ramp = scaleFrom(brand);
    expect(contrastRatio(ramp[900], ramp[50])).toBeGreaterThanOrEqual(7);
    expect(relativeLuminance(hexToRgb(ramp[50]))).toBeGreaterThan(0.8);
  });

  it("produces a neutral ramp from a grey seed without inventing a hue", () => {
    const ramp = scaleFrom("#808080");
    const { r, g, b } = hexToRgb(ramp[500]);
    expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThanOrEqual(2);
  });
});
