/**
 * Formatting helpers shared by the admin user widgets (list, view, stats).
 * Client-safe. Locale-aware, never hardcoded.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { isValidEnumValue } from "next-vibe/unified-ui/_shared/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation as rolesTranslation } from "next-vibe/identity/roles/i18n";

import { SubscriptionStatus } from "@/subscription/enum";
import { scopedTranslation as subscriptionTranslation } from "@/subscription/i18n";

const DASH = "-";

/** BCP-47 tag from our CountryLanguage ("en-GLOBAL" is not valid for Intl). */
function intlLocale(locale: CountryLanguage): string {
  return locale.endsWith("-GLOBAL") ? locale.split("-")[0] : locale;
}

export function formatUsd(value: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function formatMoney(
  value: number,
  currency: string,
  locale: CountryLanguage,
): string {
  try {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export function formatNumber(
  value: number,
  locale: CountryLanguage,
  maxFractionDigits = 0,
): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export function formatPercent(ratio: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(ratio);
}

export function formatDay(
  date: Date | string | null | undefined,
  locale: CountryLanguage,
  utc = false,
): string {
  if (!date) {
    return DASH;
  }
  return new Date(date).toLocaleDateString(intlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(utc ? { timeZone: "UTC" } : {}),
  });
}

export function formatDateTime(
  date: Date | string | null | undefined,
  locale: CountryLanguage,
): string {
  if (!date) {
    return DASH;
  }
  return new Date(date).toLocaleString(intlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "3 days ago", "in 2 hours" etc. */
export function formatRelative(
  date: Date | string | null | undefined,
  locale: CountryLanguage,
): string {
  if (!date) {
    return DASH;
  }
  const diffMs = new Date(date).getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), {
    numeric: "auto",
  });
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (abs < hour) {
    return rtf.format(Math.round(diffMs / minute), "minute");
  }
  if (abs < day) {
    return rtf.format(Math.round(diffMs / hour), "hour");
  }
  if (abs < 30 * day) {
    return rtf.format(Math.round(diffMs / day), "day");
  }
  if (abs < 365 * day) {
    return rtf.format(Math.round(diffMs / (30 * day)), "month");
  }
  return rtf.format(Math.round(diffMs / (365 * day)), "year");
}

/** Translated label for a stored permission role ("enums.userRole.admin"). */
export function roleLabel(role: string, locale: CountryLanguage): string {
  if (isValidEnumValue(UserPermissionRole, role)) {
    return rolesTranslation.scopedT(locale).t(role);
  }
  return role;
}

/** Translated label for a stored subscription status ("enums.status.active"). */
export function subscriptionStatusLabel(
  status: string,
  locale: CountryLanguage,
): string {
  if (isValidEnumValue(SubscriptionStatus, status)) {
    return subscriptionTranslation.scopedT(locale).t(status);
  }
  return status;
}

export type PillVariant = "success" | "warning" | "danger" | "muted" | "info";

export function subscriptionStatusVariant(status: string | null): PillVariant {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
    case SubscriptionStatus.TRIALING:
      return "success";
    case SubscriptionStatus.PAST_DUE:
    case SubscriptionStatus.UNPAID:
    case SubscriptionStatus.INCOMPLETE:
      return "warning";
    case SubscriptionStatus.CANCELED:
    case SubscriptionStatus.INCOMPLETE_EXPIRED:
      return "danger";
    default:
      return "muted";
  }
}

/** Pad/truncate for fixed-width text tables (CLI/MCP). */
export function cell(value: string, width: number): string {
  if (value.length > width) {
    return `${value.slice(0, Math.max(0, width - 1))}~`;
  }
  return value.padEnd(width);
}
