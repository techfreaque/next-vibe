/**
 * Shared comparison table, source list, and navigation components.
 * Server-rendered (no client state), so every fact is in the initial HTML.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
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
import { H2, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { ArticleList, ArticleScroll } from "../../_shared/article";
import { CardLink, CONTAINER } from "../../_shared/marketing";
import { scopedTranslation } from "../i18n";
import { LINK_CLASS, type TableRowData } from "./compare-data";
import {
  COMPARE_HUB_PATH,
  PLATFORMS,
  type PlatformSource,
  VERSUS_KEYS,
  type VersusKey,
  versusPath,
} from "./platforms";

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

export function CompareTable({
  rows,
  locale,
  minWidth = "min-w-[72rem]",
  showSources = false,
}: {
  rows: readonly TableRowData[];
  locale: CountryLanguage;
  minWidth?: string;
  showSources?: boolean;
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
                  {row.summary !== undefined && (
                    <P className="mt-1 min-w-44 max-w-64 text-xs leading-relaxed text-muted-foreground">
                      {row.summary}
                    </P>
                  )}
                  {showSources &&
                    row.sources?.map((source) => (
                      <ExternalLink
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className={`${LINK_CLASS} mt-1 block text-xs`}
                      >
                        {t(`common.sourceKinds.${source.kind}`, {
                          name: row.name,
                        })}
                      </ExternalLink>
                    ))}
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
  includeHub = true,
}: {
  locale: CountryLanguage;
  versus: readonly VersusKey[];
  includeHub?: boolean;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return (
    <>
      {includeHub && (
        <CardLink
          href={`/${locale}${COMPARE_HUB_PATH}`}
          label={t("links.hub")}
        />
      )}
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
