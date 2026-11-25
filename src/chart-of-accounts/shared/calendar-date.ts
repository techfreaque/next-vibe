import { z } from "zod";

/** Convert calendar-picker values to the same UTC day used by date-only CLI inputs. */
export function accountingCalendarDay(value: string | number | Date): Date {
  if (value instanceof Date) {
    return value.getHours() === 0 &&
      value.getMinutes() === 0 &&
      value.getSeconds() === 0 &&
      value.getMilliseconds() === 0
      ? new Date(
          Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
        )
      : value;
  }

  if (typeof value === "string" && !z.iso.date().safeParse(value).success) {
    const unquoted = value.startsWith('"') ? value.replaceAll('"', "") : value;
    if (
      !z.iso.date().safeParse(unquoted.slice(0, 10)).success ||
      !z.iso.datetime({ offset: true }).safeParse(unquoted).success
    ) {
      return new Date(Number.NaN);
    }
    return new Date(unquoted);
  }

  return new Date(value);
}

export const accountingDateSchema = z
  .union([z.string(), z.date(), z.coerce.number()])
  .transform((value, ctx): Date => {
    const date = accountingCalendarDay(value);
    if (!Number.isFinite(date.getTime())) {
      ctx.addIssue({ code: "invalid_type", expected: "date", input: value });
      return z.NEVER;
    }
    return date;
  });

export function formatAccountingDateInput(
  value: string | number | Date | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const date = accountingCalendarDay(value);
  return Number.isFinite(date.getTime())
    ? date.toISOString().slice(0, 10)
    : undefined;
}
