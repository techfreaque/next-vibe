/**
 * Formatting helpers for the outreach widgets. Client-safe, locale-aware.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StatusPillVariant } from "next-vibe/ui/components/status-pill";

import type {
  OutreachContactStatusValue,
  OutreachDealStatusValue,
} from "./enum";
import { OutreachContactStatus, OutreachDealStatus } from "./enum";

/** BCP-47 tag from our CountryLanguage ("en-GLOBAL" is not valid for Intl). */
function intlLocale(locale: CountryLanguage): string {
  return locale.endsWith("-GLOBAL") ? locale.split("-")[0] : locale;
}

export function formatCents(
  cents: number,
  currency: string,
  locale: CountryLanguage,
): string {
  try {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export function formatNumber(value: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(value);
}

export function formatPercent(ratio: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(ratio);
}

export function formatDay(
  value: Date | string | null,
  locale: CountryLanguage,
): string {
  if (!value) {
    return "-";
  }
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString(intlLocale(locale), {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  });
}

/** Fixed-width text cell for CLI tables. */
export function cell(value: string, width: number): string {
  const clipped =
    value.length > width ? `${value.slice(0, width - 1)}…` : value;
  return clipped.padEnd(width);
}

export function contactStatusVariant(
  status: typeof OutreachContactStatusValue,
): StatusPillVariant {
  switch (status) {
    case OutreachContactStatus.SENT:
      return "muted";
    case OutreachContactStatus.REPLIED:
      return "info";
    case OutreachContactStatus.INTERESTED:
      return "warning";
    case OutreachContactStatus.DEAL:
      return "success";
    case OutreachContactStatus.DECLINED:
      return "default";
    case OutreachContactStatus.OPT_OUT:
    case OutreachContactStatus.BOUNCED:
      return "danger";
  }
}

export function dealStatusVariant(
  status: typeof OutreachDealStatusValue,
): StatusPillVariant {
  switch (status) {
    case OutreachDealStatus.PROPOSED:
      return "info";
    case OutreachDealStatus.COMMITTED:
      return "warning";
    case OutreachDealStatus.PAID:
      return "success";
    case OutreachDealStatus.CANCELED:
      return "muted";
  }
}
