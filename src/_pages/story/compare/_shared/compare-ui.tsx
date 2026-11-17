/**
 * Shared building blocks for the comparison pages: price/fact formatting
 * from PLATFORMS data, the comparison table, source lists and the JSON-LD.
 * Server-rendered (no client state), so every fact is in the initial HTML.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";
import { Div } from "next-vibe/ui/components/div";
import type { JsonLdNode } from "next-vibe/ui/components/json-ld";
import { ExternalLink, Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { H2, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { organizationId, pageUrl } from "../../../_components/structured-data";
import { ArticleList, ArticleScroll } from "../../_shared/article";
import { CardLink, CONTAINER } from "../../_shared/marketing";
import { scopedTranslation } from "../i18n";
import {
  type Availability,
  COMPARE_CHECKED_DATE,
  COMPARE_HUB_PATH,
  COMPARE_PUBLISHED_DATE,
  isVersusKey,
  type PlatformData,
  type PlatformPlan,
  PLATFORMS,
  type PlatformSource,
  VERSUS_KEYS,
  type VersusKey,
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
export function freeText(platform: PlatformData, t: CompareT): string {
  if (platform.kind === "local") {
    return t("common.free.local");
  }
  return platform.freeTier ? t("common.free.yes") : t("common.free.no");
}

/** Paid column: cheapest plan, or pay-as-you-go. */
export function paidText(
  platform: PlatformData,
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
  platform: PlatformData,
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

export function mediaText(platform: PlatformData, t: CompareT): string {
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

export function openSourceText(platform: PlatformData, t: CompareT): string {
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

/** A source link, labelled by kind and host. */
export function SourceList({
  name,
  sources,
  locale,
}: {
  name: string;
  sources: readonly PlatformSource[];
  locale: CountryLanguage;
}): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  if (sources.length === 0) {
    return null;
  }
  return (
    <ArticleList
      items={sources.map((source) => (
        <Span key={source.url} className="text-sm">
          <ExternalLink
            href={source.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={LINK_CLASS}
          >
            {t(`common.sourceKinds.${source.kind}`, { name })}
          </ExternalLink>
          <Span className="block break-all text-xs text-muted-foreground">
            {source.url}
          </Span>
        </Span>
      ))}
    />
  );
}

export interface TableRowData {
  key: string;
  name: string;
  /** Internal versus page or our own pricing page. */
  href: string | null;
  external: string | null;
  isUs: boolean;
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

const TABLE_COLUMNS = [
  "kind",
  "free",
  "paid",
  "filter",
  "privacy",
  "api",
  "media",
  "open",
] as const;

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

export function CompareTable({
  rows,
  locale,
  minWidth = "min-w-[72rem]",
}: {
  rows: readonly TableRowData[];
  locale: CountryLanguage;
  minWidth?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <ArticleScroll>
      <Div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table className={minWidth}>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                {t("common.table.platform")}
              </TableHead>
              {TABLE_COLUMNS.map((col) => (
                <TableHead
                  key={col}
                  className="text-xs font-semibold uppercase tracking-wide"
                >
                  {t(`common.table.${col}`)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.key}
                data-platform={row.key}
                className={row.isUs ? "bg-primary/[0.04]" : undefined}
              >
                <TableCell className="align-top">
                  <Span className="block font-semibold text-foreground">
                    {row.name}
                  </Span>
                  {row.href !== null && (
                    <Link
                      href={row.href}
                      className={`${LINK_CLASS} block text-xs`}
                    >
                      {row.isUs
                        ? t("common.table.usLink")
                        : t("common.table.versusLink", { name: row.name })}
                    </Link>
                  )}
                </TableCell>
                {TABLE_COLUMNS.map((col) => (
                  <TableCell
                    key={col}
                    className="align-top text-sm text-muted-foreground"
                  >
                    {row.cells[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Div>
    </ArticleScroll>
  );
}

/** Links to every comparison page, for the hub and other pages. */
export function CompareLinks({
  locale,
  exclude,
  includeHub = true,
}: {
  locale: CountryLanguage;
  exclude?: string;
  includeHub?: boolean;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return (
    <Div className="flex flex-col">
      {includeHub && (
        <CardLink
          href={`/${locale}${COMPARE_HUB_PATH}`}
          label={t("links.hub")}
        />
      )}
      {VERSUS_KEYS.filter((key) => key !== exclude).map((key) => (
        <CardLink
          key={key}
          href={`/${locale}${versusPath(key)}`}
          label={t("links.versus", {
            appName,
            name: PLATFORMS[key].name,
          })}
        />
      ))}
    </Div>
  );
}

/** Hub link plus chosen versus pages, for existing link groups in posts. */
export function CompareInlineLinks({
  locale,
  versus,
}: {
  locale: CountryLanguage;
  versus: readonly VersusKey[];
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return (
    <>
      <CardLink href={`/${locale}${COMPARE_HUB_PATH}`} label={t("links.hub")} />
      {versus.map((key) => (
        <CardLink
          key={key}
          href={`/${locale}${versusPath(key)}`}
          label={t("links.versus", { appName, name: PLATFORMS[key].name })}
        />
      ))}
    </>
  );
}

/** Boxed "platforms compared" block for index pages (models index). */
export function CompareSection({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className={`${CONTAINER} pb-12 md:pb-16`}>
      <Div
        id="compare-platforms"
        className="flex flex-col gap-3 rounded-xl border border-border bg-card px-5 py-6"
      >
        <H2 className="m-0 border-none pb-0 text-lg font-semibold tracking-tight">
          {t("links.sectionTitle")}
        </H2>
        <P className="m-0 text-sm text-muted-foreground">
          {t("links.sectionIntro")}
        </P>
        <CompareLinks locale={locale} />
      </Div>
    </Div>
  );
}

/** Article node for a comparison page (dates from the verification pass). */
export function buildCompareArticle({
  locale,
  path,
  headline,
  description,
}: {
  locale: CountryLanguage;
  path: string;
  headline: string;
  description: string;
}): JsonLdNode {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const url = pageUrl(locale, path);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    datePublished: COMPARE_PUBLISHED_DATE,
    dateModified: COMPARE_CHECKED_DATE,
    inLanguage: getLanguageFromLocale(locale),
    url,
    mainEntityOfPage: url,
    author: { "@id": organizationId(locale) },
    publisher: {
      "@type": "Organization",
      "@id": organizationId(locale),
      name: configT("group.name"),
    },
  };
}
