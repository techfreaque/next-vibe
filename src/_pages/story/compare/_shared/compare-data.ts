import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";
import type { JsonLdNode } from "next-vibe/ui/components/json-ld";

import {
  defaultImage,
  organizationNode,
  pageUrl,
  websiteId,
} from "../../../_components/structured-data";
import type { scopedTranslation } from "../i18n";
import {
  type Availability,
  COMPARE_CHECKED_DATE,
  COMPARE_PUBLISHED_DATE,
  isVersusKey,
  type PlatformData,
  type PlatformPlan,
  type PlatformSource,
  versusPath,
} from "./platforms";
import type { UsParams } from "./us-facts";

export type CompareT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export const LINK_CLASS =
  "font-medium text-primary underline-offset-4 hover:underline";

/** "17 November 2026" / "17. November 2026", UTC so SSR and client agree. */
export function formatCompareDate(
  isoDate: string,
  locale: CountryLanguage,
): string {
  return new Intl.DateTimeFormat(getLanguageFromLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** "$18" for whole amounts, "$4.99" otherwise. */
export function formatUsd(amount: number, locale: CountryLanguage): string {
  return formatCurrency(amount, "USD", locale).replace(/[.,]00(?=\D*$)/, "");
}

export function planText(
  plan: PlatformPlan,
  locale: CountryLanguage,
  t: CompareT,
): string {
  return t(`common.period.${plan.period}`, {
    plan: plan.name,
    price: formatUsd(plan.price, locale),
  });
}

/** Free tier column. */
export function freeText(
  platform: Pick<PlatformData, "kind" | "freeTier">,
  t: CompareT,
): string {
  if (platform.kind === "local") {
    return t("common.free.local");
  }
  return platform.freeTier ? t("common.free.yes") : t("common.free.no");
}

/** Paid column: cheapest plan, or pay-as-you-go. */
export function paidText(
  platform: Pick<PlatformData, "plans" | "payAsYouGo">,
  locale: CountryLanguage,
  t: CompareT,
): string {
  const cheapest = platform.plans[0];
  const parts: string[] = [];
  if (cheapest !== undefined) {
    parts.push(
      t("common.paid.from", {
        price: planText(cheapest, locale, t),
      }),
    );
  }
  if (platform.payAsYouGo) {
    parts.push(t("common.paid.payg"));
  }
  return parts.length > 0 ? parts.join(" · ") : t("common.paid.none");
}

/** Every paid plan, for the detail cards. */
export function allPlansText(
  platform: Pick<PlatformData, "plans" | "payAsYouGo">,
  locale: CountryLanguage,
  t: CompareT,
): string {
  const plans = platform.plans.map((plan) => planText(plan, locale, t));
  if (platform.payAsYouGo) {
    plans.push(t("common.paid.payg"));
  }
  return plans.length > 0 ? plans.join(", ") : t("common.paid.none");
}

export function availabilityText(value: Availability, t: CompareT): string {
  return t(`common.availability.${value}`);
}

export function mediaText(
  platform: Pick<PlatformData, "media">,
  t: CompareT,
): string {
  const items = (["image", "video", "voice"] as const).flatMap((kind) => {
    const value = platform.media[kind];
    if (value === "no") {
      return [];
    }
    const name = t(`common.media.${kind}`);
    return [value === "partial" ? t("common.media.partial", { name }) : name];
  });
  return items.length > 0 ? items.join(" · ") : t("common.media.none");
}

export function openSourceText(
  platform: Pick<PlatformData, "openSource" | "selfHost">,
  t: CompareT,
): string {
  if (platform.openSource === "yes") {
    return platform.selfHost
      ? t("common.openSource.yesSelfHost")
      : t("common.openSource.yes");
  }
  if (platform.openSource === "partial") {
    return t("common.openSource.partial");
  }
  if (platform.selfHost) {
    return t("common.openSource.closedLocal");
  }
  return t("common.openSource.no");
}

export function apiText(platform: PlatformData, t: CompareT): string {
  if (platform.api === "partial") {
    return t(`platforms.${platform.key}.apiShort`);
  }
  return availabilityText(platform.api, t);
}

export interface TableRowData {
  key: string;
  name: string;
  /** Internal versus page or our own pricing page. */
  href: string | null;
  external: string | null;
  isUs: boolean;
  summary?: string;
  sources?: readonly PlatformSource[];
  cells: {
    kind: string;
    free: string;
    paid: string;
    filter: string;
    privacy: string;
    api: string;
    media: string;
    open: string;
  };
}

/** One row per competitor, built from PLATFORMS + its translated cells. */
export function platformRow(
  platform: PlatformData,
  locale: CountryLanguage,
  t: CompareT,
): TableRowData {
  return {
    key: platform.key,
    name: platform.name,
    href: isVersusKey(platform.key)
      ? `/${locale}${versusPath(platform.key)}`
      : null,
    external: platform.url,
    isUs: false,
    cells: {
      kind: t(`common.kinds.${platform.kind}`),
      free: freeText(platform, t),
      paid: paidText(platform, locale, t),
      filter: t(`platforms.${platform.key}.filterShort`),
      privacy: t(`platforms.${platform.key}.privacyShort`),
      api: apiText(platform, t),
      media: mediaText(platform, t),
      open: openSourceText(platform, t),
    },
  };
}

/** Our row, every value from config. */
export function usRow(
  locale: CountryLanguage,
  t: CompareT,
  params: UsParams,
): TableRowData {
  return {
    key: "us",
    name: String(params.appName),
    href: `/${locale}/subscription/overview`,
    external: null,
    isUs: true,
    cells: {
      kind: t("us.kind"),
      free: t("us.free", params),
      paid: t("us.paid", params),
      filter: t("us.filterShort", params),
      privacy: t("us.privacyShort", params),
      api: t("us.apiShort", params),
      media: t("us.mediaShort", params),
      open: t("us.openShort", params),
    },
  };
}

/** Article node for a comparison page (dates from the verification pass). */
export function buildCompareArticle({
  locale,
  path,
  headline,
  description,
  datePublished = COMPARE_PUBLISHED_DATE,
  dateModified = COMPARE_CHECKED_DATE,
}: {
  locale: CountryLanguage;
  path: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}): JsonLdNode {
  const url = pageUrl(locale, path);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    datePublished,
    dateModified,
    inLanguage: getLanguageFromLocale(locale),
    url,
    mainEntityOfPage: url,
    image: defaultImage(locale),
    author: organizationNode(locale),
    publisher: organizationNode(locale),
    isPartOf: { "@id": websiteId(locale) },
  };
}
