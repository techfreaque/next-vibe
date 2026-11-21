"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, P } from "next-vibe/ui/components/typography";
import type { JSX, ReactNode } from "react";
import { useState } from "react";

import { ADMIN_GROUPS } from "@/generated/categories/registry";

import type { CountryLanguage } from "../core/i18n/core/config";
import { Platform } from "../platforms/platforms";
import { Icon } from "../unified-ui/widgets/form-fields/icon-field/icon-component";
import type {
  AdminGroup,
  CategoryDefinitionSerialized,
} from "./category-types";
import type {
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
} from "./definition";
import type { HelpT } from "./i18n";

type CategorySummary = NonNullable<
  HelpGetResponseOutput["webCategories"]
>[number];

export function localizedLabel(
  labels: Record<string, string>,
  locale: string,
): string | undefined {
  const language = `${locale.split("-")[0]}-`;
  return (
    labels[locale] ??
    Object.entries(labels).find(([key]) => key.startsWith(language))?.[1]
  );
}

function categoryLabel(
  key: string,
  locale: CountryLanguage,
  metadata?: CategoryDefinitionSerialized,
): string {
  return metadata
    ? (localizedLabel(metadata.labels, locale) ?? metadata.label)
    : key;
}

function RecordSearch({
  targets,
  onSearch,
  t,
}: {
  targets: readonly { label: string; alias: string; field: string }[];
  onSearch: (alias: string, field: string, value: string) => void;
  t: HelpT;
}): JSX.Element {
  const [draft, setDraft] = useState("");
  const value = draft.trim();

  return (
    <SectionGroup title={t("catalog.findRecord")}>
      <Div className="flex flex-wrap items-end gap-2">
        <Input
          type="text"
          value={draft}
          autoComplete="off"
          maxLength={200}
          onChange={(event) => setDraft(event.target.value)}
          aria-label={t("catalog.recordPlaceholder")}
          placeholder={t("catalog.recordPlaceholder")}
          className="min-w-0 basis-56 grow"
        />
        {targets.map((target) => (
          <Button
            key={target.alias}
            type="button"
            variant="outline"
            disabled={!value}
            onClick={() => onSearch(target.alias, target.field, value)}
          >
            {target.label}
            <ArrowRight className="size-4" />
          </Button>
        ))}
      </Div>
    </SectionGroup>
  );
}

export function AdminCatalog({
  locale,
  t,
  categoryByKey,
  webCategories,
  activeCategory,
  activeSubCategory,
  tools,
  primaryTool,
  query,
  search,
  layoutControls,
  recordSearchTargets,
  overview,
  loading,
  error,
  currentPage,
  totalPages,
  onSelectCategory,
  onOpenTool,
  onRecordSearch,
  onPage,
  onRetry,
}: {
  locale: CountryLanguage;
  t: HelpT;
  categoryByKey: ReadonlyMap<string, CategoryDefinitionSerialized>;
  webCategories: readonly CategorySummary[];
  activeCategory?: string;
  activeSubCategory?: string;
  tools: readonly HelpToolMetadataSerialized[];
  primaryTool?: HelpToolMetadataSerialized;
  query: string;
  search: ReactNode;
  layoutControls?: ReactNode;
  recordSearchTargets: NonNullable<
    HelpGetResponseOutput["recordSearchTargets"]
  >;
  /** Business overview report shown first at the catalog root. */
  overview?: ReactNode;
  loading: boolean;
  error?: string;
  currentPage: number;
  totalPages: number;
  onSelectCategory: (category?: string, subCategory?: string) => void;
  onOpenTool: (toolName: string) => void;
  onRecordSearch: (alias: string, field: string, value: string) => void;
  onPage: (page: number) => void;
  onRetry: () => void;
}): JSX.Element {
  const activeMetadata =
    activeCategory === undefined
      ? undefined
      : categoryByKey.get(activeCategory);
  const activeLabel =
    activeCategory === undefined
      ? undefined
      : categoryLabel(activeCategory, locale, activeMetadata);
  const activeSummary = webCategories.find(
    (summary) => summary.name === activeCategory,
  );
  const namedSubCategories =
    activeSummary?.subCategories?.filter(
      ({ name }) => name.trim().length > 0,
    ) ?? [];
  const isSearching = query.trim().length > 0;
  const showingTools = !!activeCategory || isSearching;
  const groups = new Map<AdminGroup | undefined, CategorySummary[]>();

  for (const summary of webCategories) {
    const group = categoryByKey.get(summary.name)?.group;
    const items = groups.get(group) ?? [];
    items.push(summary);
    groups.set(group, items);
  }

  const showOverview = !!overview && !activeCategory && !isSearching;

  return (
    <Div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-6 sm:px-8">
      {showOverview && (
        <Div className="flex flex-col gap-3">
          <Div className="flex flex-wrap items-center justify-between gap-3">
            <H1 className="min-w-0 break-words text-2xl font-semibold sm:text-3xl">
              {t("catalog.overview")}
            </H1>
            {layoutControls}
          </Div>
          {overview}
        </Div>
      )}
      <Div className="flex flex-col gap-3">
        {activeLabel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="self-start gap-1 -ml-2"
            onClick={() => onSelectCategory()}
          >
            <ChevronRight className="size-4 rotate-180" />
            {t("catalog.title")}
          </Button>
        )}
        {showOverview ? (
          <H2 className="min-w-0 break-words pt-2 text-lg font-semibold">
            {t("catalog.allTools")}
          </H2>
        ) : (
          <Div className="flex flex-wrap items-center justify-between gap-3">
            <H1 className="min-w-0 break-words text-2xl font-semibold sm:text-3xl">
              {activeLabel ?? t("catalog.title")}
            </H1>
            {layoutControls}
          </Div>
        )}
        {search}
      </Div>
      {!activeCategory && !isSearching && recordSearchTargets.length > 0 && (
        <RecordSearch
          targets={recordSearchTargets}
          onSearch={onRecordSearch}
          t={t}
        />
      )}
      {error ? (
        <EmptyBlock
          title={t("catalog.loadError")}
          message={error}
          action={{ label: t("catalog.retry"), onClick: onRetry }}
        />
      ) : loading ? (
        <LoadingBlock message={t("aiTools.modal.loading")} />
      ) : showingTools ? (
        <Div className="flex flex-col gap-4">
          {!isSearching && primaryTool && (
            <Button
              type="button"
              variant="outline"
              className="h-auto min-h-9 self-start whitespace-normal text-start"
              onClick={() => onOpenTool(primaryTool.id ?? primaryTool.name)}
            >
              {t("catalog.openPrimary", {
                title:
                  primaryTool.titleShort ??
                  primaryTool.title ??
                  primaryTool.name,
              })}
              <ArrowRight className="size-4" />
            </Button>
          )}
          {namedSubCategories.length > 0 && (
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={activeSubCategory ? "outline" : "secondary"}
                size="sm"
                aria-pressed={!activeSubCategory}
                onClick={() => onSelectCategory(activeCategory)}
              >
                {t("catalog.allInCategory")}
              </Button>
              {namedSubCategories.map(({ name }) => {
                const metadata = activeMetadata?.subcategories?.[name];
                const label = metadata
                  ? (localizedLabel(metadata.labels, locale) ?? metadata.label)
                  : name === activeCategory
                    ? t("catalog.general")
                    : name;
                return (
                  <Button
                    key={name}
                    type="button"
                    variant={
                      activeSubCategory === name ? "secondary" : "outline"
                    }
                    size="sm"
                    aria-pressed={activeSubCategory === name}
                    className="h-auto min-h-9 whitespace-normal text-start"
                    onClick={() => onSelectCategory(activeCategory, name)}
                  >
                    {label}
                  </Button>
                );
              })}
            </Div>
          )}
          {tools.length === 0 ? (
            <EmptyBlock
              icon={<Search className="size-7" />}
              title={
                isSearching
                  ? t("aiTools.modal.searchNoResults")
                  : t("catalog.noTools")
              }
              message={
                isSearching ? t("catalog.noMatches", { query }) : undefined
              }
            />
          ) : (
            <Div className="grid min-w-0 gap-2 lg:grid-cols-2">
              {tools.map((tool) => {
                const title =
                  tool.titleShort ??
                  tool.title ??
                  tool.aliases?.[0] ??
                  tool.name;
                const canOpen =
                  !tool.platforms ||
                  tool.platforms.includes(Platform.NEXT_PAGE);
                return (
                  <Button
                    key={tool.id ?? tool.name}
                    type="button"
                    variant="outline"
                    size="unset"
                    disabled={!canOpen}
                    className="h-full min-w-0 justify-start gap-3 whitespace-normal p-3 text-start"
                    onClick={() => onOpenTool(tool.id ?? tool.name)}
                  >
                    {tool.icon && (
                      <Icon
                        icon={tool.icon}
                        className="size-5 shrink-0 text-primary"
                      />
                    )}
                    <Div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Span className="break-words font-medium">{title}</Span>
                      <Span className="line-clamp-2 break-words text-xs font-normal text-muted-foreground">
                        {tool.description}
                      </Span>
                      {!canOpen && (
                        <Span className="text-xs font-normal text-muted-foreground">
                          {t("catalog.toolUnavailable")}
                        </Span>
                      )}
                    </Div>
                    {canOpen && (
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </Button>
                );
              })}
            </Div>
          )}
          {totalPages > 1 && (
            <Div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => onPage(currentPage - 1)}
              >
                {t("catalog.previous")}
              </Button>
              <P className="text-sm text-muted-foreground">
                {t("catalog.page", { page: currentPage, total: totalPages })}
              </P>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => onPage(currentPage + 1)}
              >
                {t("catalog.next")}
              </Button>
            </Div>
          )}
        </Div>
      ) : webCategories.length > 0 ? (
        <Div className="flex flex-col gap-5">
          {[...ADMIN_GROUPS, undefined].map((group) => {
            const categories = groups.get(group);
            if (!categories?.length) {
              return null;
            }
            return (
              <Div key={group ?? "other"} className="flex flex-col gap-2">
                <H2 className="text-sm font-semibold text-muted-foreground">
                  {group ? t(`groups.${group}`) : t("uncategorized")}
                </H2>
                <Div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {categories
                    .toSorted(
                      (a, b) =>
                        (categoryByKey.get(a.name)?.order ?? 999) -
                        (categoryByKey.get(b.name)?.order ?? 999),
                    )
                    .map(({ name, count }) => {
                      const metadata = categoryByKey.get(name);
                      return (
                        <Button
                          key={name}
                          type="button"
                          variant="outline"
                          size="unset"
                          className="h-auto min-w-0 justify-start gap-3 whitespace-normal p-3 text-start"
                          onClick={() => onSelectCategory(name)}
                        >
                          {metadata && (
                            <Icon
                              icon={metadata.icon}
                              className="size-5 shrink-0 text-primary"
                            />
                          )}
                          <Span className="min-w-0 flex-1 break-words">
                            {categoryLabel(name, locale, metadata)}
                          </Span>
                          <Badge
                            variant="secondary"
                            className="shrink-0 tabular-nums"
                          >
                            {count}
                          </Badge>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                        </Button>
                      );
                    })}
                </Div>
              </Div>
            );
          })}
        </Div>
      ) : (
        <EmptyBlock title={t("catalog.noTools")} />
      )}
    </Div>
  );
}
