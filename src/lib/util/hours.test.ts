import { describe, expect, it } from "vitest";
import { formatHours, formatTime } from "./hours";

describe("formatTime", () => {
  it("drops the leading zero and the :00", () => {
    expect(formatTime("08:00")).toBe("8am");
  });

  it("keeps minutes when they are not zero", () => {
    expect(formatTime("17:30")).toBe("5:30pm");
  });

  it("renders midday as 12pm, not 0pm", () => {
    expect(formatTime("12:00")).toBe("12pm");
  });

  it("renders midnight as 12am, not 0am", () => {
    expect(formatTime("00:00")).toBe("12am");
  });

  it("handles the hour after midday", () => {
    expect(formatTime("13:15")).toBe("1:15pm");
  });
});

describe("formatHours", () => {
  it("collapses a consecutive run into a range", () => {
    expect(
      formatHours({
        alwaysOpen: false,
        regular: [{ days: ["Mon", "Tue", "Wed", "Thu", "Fri"], opens: "08:00", closes: "18:00" }],
        closures: [],
      }),
    ).toEqual([{ days: "Mon–Fri", hours: "8am–6pm" }]);
  });

  it("lists non-consecutive days separately rather than implying a range", () => {
    expect(
      formatHours({
        alwaysOpen: false,
        regular: [{ days: ["Mon", "Wed", "Fri"], opens: "09:00", closes: "17:00" }],
        closures: [],
      }),
    ).toEqual([{ days: "Mon, Wed, Fri", hours: "9am–5pm" }]);
  });

  it("sorts days into week order regardless of how they were authored", () => {
    expect(
      formatHours({
        alwaysOpen: false,
        regular: [{ days: ["Wed", "Mon", "Tue"], opens: "09:00", closes: "17:00" }],
        closures: [],
      })[0].days,
    ).toBe("Mon–Wed");
  });

  it("renders a single day without a range", () => {
    expect(
      formatHours({
        alwaysOpen: false,
        regular: [{ days: ["Sat"], opens: "09:00", closes: "13:00" }],
        closures: [],
      }),
    ).toEqual([{ days: "Sat", hours: "9am–1pm" }]);
  });

  it("keeps separate blocks separate", () => {
    const lines = formatHours({
      alwaysOpen: false,
      regular: [
        { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], opens: "07:00", closes: "15:30" },
        { days: ["Sat"], opens: "08:00", closes: "16:00" },
      ],
      closures: [],
    });
    expect(lines).toEqual([
      { days: "Mon–Fri", hours: "7am–3:30pm" },
      { days: "Sat", hours: "8am–4pm" },
    ]);
  });

  it("says open 24 hours instead of listing anything, when alwaysOpen", () => {
    expect(formatHours({ alwaysOpen: true, regular: [], closures: [] })).toEqual([
      { days: "Every day", hours: "Open 24 hours" },
    ]);
  });
});
