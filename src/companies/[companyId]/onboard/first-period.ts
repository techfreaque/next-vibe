import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

export interface OpeningPeriodProposal {
  periodName: string;
  periodStart: string;
  periodEnd: string;
}

export function proposeOpeningMonth(
  locale: CountryLanguage,
  today = new Date(),
): OpeningPeriodProposal {
  const start = new Date(today);
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);

  return {
    periodName: new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(start),
    periodStart: start.toISOString().slice(0, 10),
    periodEnd: end.toISOString().slice(0, 10),
  };
}
