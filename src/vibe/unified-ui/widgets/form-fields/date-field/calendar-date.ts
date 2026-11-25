import { parseFormDate } from "../_shared/date-value";

export function utcDayFromPickerDate(
  value: Date | undefined,
): Date | undefined {
  if (!value) {
    return undefined;
  }
  const utc = new Date(0);
  utc.setUTCFullYear(value.getFullYear(), value.getMonth(), value.getDate());
  return utc;
}

export function pickerDateFromUtcDay(
  value: Date | string | null | undefined,
): Date | undefined {
  const date = parseFormDate(value);
  if (
    !date ||
    (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/u.test(value))
  ) {
    return date;
  }
  const localDate = new Date(0);
  localDate.setHours(0, 0, 0, 0);
  localDate.setFullYear(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return localDate;
}
