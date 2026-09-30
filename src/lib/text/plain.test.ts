import { describe, expect, it } from "vitest";
import { toPlainText } from "./plain";

describe("toPlainText", () => {
  it("keeps a link's text and drops its target", () => {
    expect(toPlainText("see [our fees](/fees) for detail")).toBe("see our fees for detail");
  });

  it("unwraps bold", () => {
    expect(toPlainText("we have **HICAPS** on site")).toBe("we have HICAPS on site");
  });

  it("unwraps inline code", () => {
    expect(toPlainText("call `000` in an emergency")).toBe("call 000 in an emergency");
  });

  it("strips headings, bullets and blockquotes", () => {
    expect(toPlainText("## Costs\n\n- from $99\n- after hours differs\n\n> ask us")).toBe(
      "Costs from $99 after hours differs ask us",
    );
  });

  it("leaves ordinary underscores alone", () => {
    // A naive italic pass turns this into "newpatientform", which then disagrees with
    // what the page displays — the exact drift this function exists to prevent.
    expect(toPlainText("bring the new_patient_form with you")).toBe(
      "bring the new_patient_form with you",
    );
  });

  it("does not eat a pair of asterisks used as footnote markers", () => {
    expect(toPlainText("fees apply* and vary by health fund*")).toBe(
      "fees apply* and vary by health fund*",
    );
  });

  it("collapses whitespace", () => {
    expect(toPlainText("one\n\ntwo   three\n")).toBe("one two three");
  });

  it("is idempotent on text that has no markup", () => {
    const plain = "We answer the phone around the clock, every day of the year.";
    expect(toPlainText(plain)).toBe(plain);
  });
});
