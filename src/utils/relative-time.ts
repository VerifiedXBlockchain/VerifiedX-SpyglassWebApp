const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

/**
 * "14s ago" / "hace 14 s": localized relative time via Intl, so no locale
 * tables to maintain. Sub-second differences round to one second so a block
 * that just arrived reads "1s ago" rather than "0s ago".
 */
export function formatRelativeTime(
  date: Date,
  now: Date | number = Date.now(),
  locale: string = "en",
  style: Intl.RelativeTimeFormatStyle = "narrow"
): string {
  const nowMs = typeof now === "number" ? now : now.getTime();
  let duration = (date.getTime() - nowMs) / 1000;
  if (Math.abs(duration) < 1) duration = duration < 0 || duration === 0 ? -1 : 1;

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "always", style });
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return formatter.format(Math.round(duration), "year");
}
