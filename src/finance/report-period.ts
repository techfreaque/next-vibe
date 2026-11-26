export const reportPeriodPresets = [
  "thisMonth",
  "lastMonth",
  "thisQuarter",
  "yearToDate",
  "lastYear",
] as const;

export type ReportPeriodPreset = (typeof reportPeriodPresets)[number];
export type ReportPeriodChoice = ReportPeriodPreset | "custom";

export interface ReportDateRange {
  from: Date;
  to: Date;
}

export function reportDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function reportMonth(date: Date): string {
  return reportDay(date).slice(0, 7);
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

/** Inclusive UTC dates. Running periods end today. */
export function reportPeriodRange(
  preset: ReportPeriodPreset,
  now = new Date(),
): ReportDateRange {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const today = utcDate(year, month, now.getUTCDate());
  switch (preset) {
    case "lastMonth":
      return { from: utcDate(year, month - 1, 1), to: utcDate(year, month, 0) };
    case "thisQuarter":
      return { from: utcDate(year, month - (month % 3), 1), to: today };
    case "yearToDate":
      return { from: utcDate(year, 0, 1), to: today };
    case "lastYear":
      return { from: utcDate(year - 1, 0, 1), to: utcDate(year, 0, 0) };
    default:
      return { from: utcDate(year, month, 1), to: today };
  }
}

export function monthRange(month: string): { start: Date; end: Date } {
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start, end };
}
