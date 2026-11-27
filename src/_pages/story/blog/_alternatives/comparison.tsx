import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import type { JSX } from "react";

import { ArticleP, ArticleSection } from "../../_shared/article";
import { CardLink } from "../../_shared/marketing";
import {
  type CompareT,
  formatCompareDate,
  planText,
  platformRow,
  type TableRowData,
  usRow,
} from "../../compare/_shared/compare-data";
import { CompareTable } from "../../compare/_shared/compare-ui";
import {
  COMPARE_HUB_PATH,
  type PlatformKey,
  PLATFORMS,
} from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import { scopedTranslation as compareTranslation } from "../../compare/i18n";
import { guideCards } from "../guide-links";
import { BLOG_POST_SLUGS } from "../posts-cards";
import {
  MARKET_PLATFORMS,
  marketCheckedDate,
  type MarketPlatform,
  type MarketPlatformKey,
} from "./catalog";
import { scopedTranslation } from "./i18n";
import { ALTERNATIVE_GUIDES, type AlternativesSlug } from "./selection";

type AlternativesT = ReturnType<typeof scopedTranslation.scopedT>["t"];

function marketRow(
  key: MarketPlatformKey,
  locale: CountryLanguage,
  t: AlternativesT,
  compareT: CompareT,
): TableRowData {
  const platform: MarketPlatform = MARKET_PLATFORMS[key];
  const { fee, plan } = platform;
  const paid =
    plan === undefined
      ? t(`paid.${platform.paid}`)
      : planText(plan, locale, compareT);
  return {
    key,
    name: platform.name,
    href: null,
    external: null,
    isUs: false,
    summary: t(`summaries.${key}`),
    sources: platform.sources,
    cells: {
      kind: t(`kind.${platform.kind}`),
      free: t(`free.${platform.free}`),
      paid:
        fee === undefined
          ? paid
          : t(`fees.${fee.kind}`, {
              fee: new Intl.NumberFormat(locale, {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(fee.rate),
            }),
      filter: t(`filter.${platform.filter}`),
      privacy: t(`privacy.${platform.privacy}`),
      api: t(`api.${platform.api}`),
      media: t(`media.${platform.media}`),
      open: t(`open.${platform.open}`),
    },
  };
}

/** Oldest and newest check date of a guide's extra (market) rows. */
export function alternativesCheckedRange(slug: AlternativesSlug): {
  from: string;
  to: string;
} {
  const dates = ALTERNATIVE_GUIDES[slug].market
    .map((key) => marketCheckedDate(MARKET_PLATFORMS[key]))
    .toSorted();
  const from = dates[0] ?? "";
  return { from, to: dates.at(-1) ?? from };
}

export function alternativesTotal(
  slug: AlternativesSlug,
  platforms: readonly PlatformKey[],
): number {
  const guide = ALTERNATIVE_GUIDES[slug];
  return (
    new Set([...platforms, ...("platforms" in guide ? guide.platforms : [])])
      .size + guide.market.length
  );
}

function documentedRow(
  key: PlatformKey,
  locale: CountryLanguage,
  t: CompareT,
): TableRowData {
  const platform = PLATFORMS[key];
  const sources = platform.sources.filter(
    ({ kind }) => kind === "pricing" || kind === "privacy" || kind === "api",
  );
  return {
    ...platformRow(platform, locale, t),
    summary: t(`platforms.${key}.what`),
    sources: sources.length > 0 ? sources : platform.sources.slice(0, 2),
  };
}

export function AlternativesComparison({
  locale,
  slug,
  us,
  platforms = [],
  customRows = [],
  title,
}: {
  locale: CountryLanguage;
  slug: AlternativesSlug;
  us: UsParams;
  platforms?: readonly PlatformKey[];
  customRows?: readonly TableRowData[];
  title?: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareTranslation.scopedT(locale);
  const guide = ALTERNATIVE_GUIDES[slug];
  const platformKeys = new Set([
    ...platforms,
    ...("platforms" in guide ? guide.platforms : []),
  ]);
  const existingRows = [
    ...customRows,
    ...Array.from(platformKeys, (key) => documentedRow(key, locale, compareT)),
  ];
  const marketRows = guide.market.map((key) =>
    marketRow(key, locale, t, compareT),
  );
  const rows =
    slug === "openrouter-alternatives"
      ? [...marketRows, ...existingRows]
      : [...existingRows, ...marketRows];
  const reference = guide.subject;
  const checked = alternativesCheckedRange(slug);
  const subject =
    "market" in reference
      ? marketRow(reference.market, locale, t, compareT)
      : (customRows.find((row) => row.key === reference.platform) ??
        documentedRow(reference.platform, locale, compareT));

  return (
    <ArticleSection id="table" title={title ?? t("title")}>
      <ArticleP>
        {checked.from === checked.to
          ? t("verify", { date: formatCompareDate(checked.to, locale) })
          : t("verifyRange", {
              from: formatCompareDate(checked.from, locale),
              to: formatCompareDate(checked.to, locale),
            })}
      </ArticleP>
      <CompareTable
        locale={locale}
        rows={[
          usRow(locale, compareT, us),
          subject,
          ...rows.filter((row) => row.key !== subject.key),
        ]}
        showSources
      />
    </ArticleSection>
  );
}

export function alternativesFaq(
  slug: AlternativesSlug,
  locale: CountryLanguage,
  appName: string | number,
): { key: string; question: string; answer: string } {
  const { t } = scopedTranslation.scopedT(locale);
  return {
    key: "platform-choice",
    question: t(`articles.${slug}.question`),
    answer: t(`articles.${slug}.answer`, { appName }),
  };
}

const GUIDE_SLUGS = BLOG_POST_SLUGS.filter((slug) =>
  /-alternatives?(?:-|$)/.test(slug),
);

export function AlternativesLinks({
  locale,
  exclude,
}: {
  locale: CountryLanguage;
  exclude?: AlternativesSlug;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: compareT } = compareTranslation.scopedT(locale);
  const guides = guideCards(
    locale,
    GUIDE_SLUGS.filter((slug) => slug !== exclude),
  );

  return (
    <ArticleSection id="related-comparisons" title={t("related")}>
      <Div className="grid gap-x-6 sm:grid-cols-2">
        {exclude !== undefined && (
          <CardLink
            href={`/${locale}${COMPARE_HUB_PATH}`}
            label={compareT("links.hub")}
          />
        )}
        {guides.map((guide) => (
          <CardLink
            key={guide.slug}
            href={`/${locale}${guide.path}`}
            label={guide.title}
          />
        ))}
      </Div>
    </ArticleSection>
  );
}
