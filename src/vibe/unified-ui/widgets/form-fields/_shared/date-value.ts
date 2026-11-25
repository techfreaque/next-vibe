/** Restore endpoint form dates after URL and JSON serialization. */
export function parseFormDate(
  value: Date | string | null | undefined,
): Date | undefined {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value : undefined;
  }
  if (!value) {
    return undefined;
  }
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (day) {
    const year = Number(day[1]),
      month = Number(day[2]) - 1,
      dayOfMonth = Number(day[3]);
    const parsed = new Date(0);
    parsed.setHours(0, 0, 0, 0);
    parsed.setFullYear(year, month, dayOfMonth);
    return parsed.getFullYear() === year &&
      parsed.getMonth() === month &&
      parsed.getDate() === dayOfMonth
      ? parsed
      : undefined;
  }
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return undefined;
  }
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : undefined;
}
