/**
 * Shared blocks for the cloud alternatives posts and the uncensored LLM API
 * hub: the "what off really means" table, the per-token price table and the
 * alternatives described one by one. Competitor values come from ./data
 * (sourced, dated), our side from live params passed in by the page loader.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { Div } from "next-vibe/ui/components/div";
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
import type { JSX } from "react";

import { modelHref } from "@/_pages/models/_shared/model-format";

import {
  ArticleH3,
  ArticleList,
  ArticleP,
  ArticleScroll,
} from "../../_shared/article";
import { CardLink } from "../../_shared/marketing";
import {
  formatCompareDate,
  LINK_CLASS,
} from "../../compare/_shared/compare-data";
import { versusPath } from "../../compare/_shared/platforms";
import type { UsParams } from "../../compare/_shared/us-facts";
import {
  CLOUD_ALTERNATIVES,
  CLOUD_CHECKED_DATE,
  CLOUD_RULE_COLUMNS,
  CLOUD_RULE_KEYS,
  CLOUD_RULES,
  type CloudAlternativeKey,
  type CloudRuleKey,
  PRICE_GROUPS,
} from "./data";
import { scopedTranslation } from "./i18n";
import type { OurTokenPrice } from "./prices";

const HEAD_CLASS = "text-xs font-semibold uppercase tracking-wide";
const CELL_CLASS = "align-top text-sm text-muted-foreground";

/** Alternatives that have a full versus page. */
const VERSUS_FOR: Partial<
  Record<CloudAlternativeKey, "openRouter" | "venice" | "nanoGpt">
> = {
  openRouter: "openRouter",
  venice: "venice",
  nanoGpt: "nanoGpt",
};

export function CloudRulesTable({
  locale,
  us,
  keys = CLOUD_RULE_KEYS,
}: {
  locale: CountryLanguage;
  us: UsParams;
  keys?: readonly CloudRuleKey[];
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="flex flex-col gap-3">
      <ArticleP>
        {t("rules.checked", {
          date: formatCompareDate(CLOUD_CHECKED_DATE, locale),
        })}
      </ArticleP>
      <ArticleScroll>
        <Div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table className="min-w-[56rem]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className={HEAD_CLASS}>
                  {t("rules.columns.name")}
                </TableHead>
                {CLOUD_RULE_COLUMNS.map((column) => (
                  <TableHead key={column} className={HEAD_CLASS}>
                    {t(`rules.columns.${column}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow data-platform="us" className="bg-primary/5">
                <TableCell className="align-top text-sm font-semibold text-foreground">
                  {us.appName}
                </TableCell>
                {CLOUD_RULE_COLUMNS.map((column) => (
                  <TableCell key={column} className={CELL_CLASS}>
                    {t(`rules.rows.us.${column}`, us)}
                  </TableCell>
                ))}
              </TableRow>
              {keys.map((key) => (
                <TableRow key={key} data-platform={key}>
                  <TableCell className="align-top text-sm font-semibold text-foreground">
                    {CLOUD_RULES[key].name}
                  </TableCell>
                  {CLOUD_RULE_COLUMNS.map((column) => (
                    <TableCell key={column} className={CELL_CLASS}>
                      {t(`rules.rows.${key}.${column}`)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Div>
      </ArticleScroll>
      <Span className="text-sm font-semibold text-foreground">
        {t("rules.sourcesTitle")}
      </Span>
      <ArticleList
        items={keys.flatMap((key) =>
          CLOUD_RULES[key].sources.map((source) => (
            <Span key={source.url} className="text-sm">
              <ExternalLink
                href={source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={LINK_CLASS}
              >
                {t(`rules.sourceLabels.${source.label}`, {
                  name: CLOUD_RULES[key].name,
                })}
              </ExternalLink>
            </Span>
          )),
        )}
      />
    </Div>
  );
}

function usd(value: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(getLanguageFromLocale(locale), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function PriceTable({
  locale,
  prices,
  us,
}: {
  locale: CountryLanguage;
  prices: readonly OurTokenPrice[];
  us: UsParams;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const groups = PRICE_GROUPS.flatMap((group) => {
    const ours = prices.find((price) => price.model === group.model);
    return ours === undefined ? [] : [{ ours, offers: group.offers }];
  });
  return (
    <Div className="flex flex-col gap-3">
      <ArticleScroll>
        <Div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table className="min-w-[36rem]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className={HEAD_CLASS}>
                  {t("prices.columns.model")}
                </TableHead>
                <TableHead className={HEAD_CLASS}>
                  {t("prices.columns.provider")}
                </TableHead>
                <TableHead className={HEAD_CLASS}>
                  {t("prices.columns.input")}
                </TableHead>
                <TableHead className={HEAD_CLASS}>
                  {t("prices.columns.output")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.flatMap(({ ours, offers }) => [
                <TableRow
                  key={`${ours.model}-us`}
                  data-model={ours.model}
                  className="bg-primary/5"
                >
                  <TableCell className="align-top text-sm">
                    <Link
                      href={modelHref(locale, ours.slug)}
                      className={LINK_CLASS}
                    >
                      {ours.name}
                    </Link>
                  </TableCell>
                  <TableCell className="align-top text-sm font-semibold text-foreground">
                    {t("prices.us", us)}
                    <Span className="block text-xs font-normal text-muted-foreground">
                      {t("prices.live")}
                    </Span>
                  </TableCell>
                  <TableCell className={`${CELL_CLASS} tabular-nums`}>
                    {usd(ours.input, locale)}
                  </TableCell>
                  <TableCell className={`${CELL_CLASS} tabular-nums`}>
                    {usd(ours.output, locale)}
                  </TableCell>
                </TableRow>,
                ...offers.map((offer) => (
                  <TableRow key={`${ours.model}-${offer.provider}`}>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {ours.name}
                    </TableCell>
                    <TableCell className="align-top text-sm text-foreground">
                      {offer.provider}
                      <Span className="block text-xs">
                        <ExternalLink
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className={LINK_CLASS}
                        >
                          {t("prices.source")}
                        </ExternalLink>
                      </Span>
                    </TableCell>
                    <TableCell className={`${CELL_CLASS} tabular-nums`}>
                      {usd(offer.input, locale)}
                    </TableCell>
                    <TableCell className={`${CELL_CLASS} tabular-nums`}>
                      {usd(offer.output, locale)}
                    </TableCell>
                  </TableRow>
                )),
              ])}
            </TableBody>
          </Table>
        </Div>
      </ArticleScroll>
      <ArticleP>
        {t("prices.note", {
          ...us,
          date: formatCompareDate(CLOUD_CHECKED_DATE, locale),
        })}
      </ArticleP>
    </Div>
  );
}

export function CloudAlternatives({
  locale,
  us,
  keys,
  startAt = 1,
}: {
  locale: CountryLanguage;
  us: UsParams;
  keys: readonly CloudAlternativeKey[];
  startAt?: number;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="flex flex-col gap-8">
      {keys.map((key, index) => {
        const alternative = CLOUD_ALTERNATIVES[key];
        const versus = VERSUS_FOR[key];
        return (
          <Div key={key} data-platform={key} className="flex flex-col gap-3">
            <ArticleH3>
              {t("alts.heading", {
                number: startAt + index,
                name: alternative.name,
              })}
            </ArticleH3>
            <ArticleP>{t(`alts.${key}.what`)}</ArticleP>
            <ArticleList
              items={[
                <Span key="strength">
                  <Span className="font-semibold text-foreground">
                    {t("alts.strength")}
                  </Span>{" "}
                  {t(`alts.${key}.strength`)}
                </Span>,
                <Span key="catch">
                  <Span className="font-semibold text-foreground">
                    {t("alts.catch")}
                  </Span>{" "}
                  {t(`alts.${key}.catch`)}
                </Span>,
              ]}
            />
            <Span className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Span className="text-muted-foreground">{t("alts.sources")}</Span>
              {alternative.sources.map((url) => (
                <ExternalLink
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={`${LINK_CLASS} break-all`}
                >
                  {url.replace(/^https?:\/\//, "")}
                </ExternalLink>
              ))}
            </Span>
            {versus !== undefined && (
              <CardLink
                href={`/${locale}${versusPath(versus)}`}
                label={t("alts.versusLink", {
                  appName: us.appName,
                  name: alternative.name,
                })}
              />
            )}
          </Div>
        );
      })}
    </Div>
  );
}
