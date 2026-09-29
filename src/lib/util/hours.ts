import { DAYS, type ClientConfig } from "@/config/schema";

type Day = (typeof DAYS)[number];

export interface HoursLine {
  days: string;
  hours: string;
}

const DAY_ORDER = new Map(DAYS.map((d, i) => [d, i]));

/** "08:00" -> "8am", "17:30" -> "5:30pm". Australian convention, no leading zero. */
export function formatTime(time: string): string {
  const [hourText, minuteText] = time.split(":");
  const hour24 = Number(hourText);
  const suffix = hour24 < 12 ? "am" : "pm";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return minuteText === "00" ? `${hour12}${suffix}` : `${hour12}:${minuteText}${suffix}`;
}

/** Collapses a run of consecutive days into "Mon–Fri"; leaves gaps as "Mon, Wed". */
function formatDayRange(days: readonly Day[]): string {
  const sorted = [...days].sort((a, b) => (DAY_ORDER.get(a) ?? 0) - (DAY_ORDER.get(b) ?? 0));
  if (sorted.length === 1) return sorted[0];

  const isConsecutive = sorted.every((day, i) => {
    if (i === 0) return true;
    return (DAY_ORDER.get(day) ?? 0) === (DAY_ORDER.get(sorted[i - 1]) ?? 0) + 1;
  });

  return isConsecutive ? `${sorted[0]}–${sorted[sorted.length - 1]}` : sorted.join(", ");
}

/**
 * Human-readable opening hours for display.
 *
 * Kept separate from the structured-data generator on purpose: JSON-LD needs 24-hour
 * `openingHoursSpecification`, a reader wants "Mon–Fri 8am–6pm". Both derive from the
 * same config, so they cannot disagree about when the business is open.
 */
export function formatHours(hours: ClientConfig["hours"]): HoursLine[] {
  if (hours.alwaysOpen) {
    return [{ days: "Every day", hours: "Open 24 hours" }];
  }

  return hours.regular.map((block) => ({
    days: formatDayRange(block.days),
    hours: `${formatTime(block.opens)}–${formatTime(block.closes)}`,
  }));
}
