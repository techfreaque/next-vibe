"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe/ui/components/accordion";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Wrench } from "next-vibe/ui/components/icons/Wrench";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, H3, P } from "next-vibe/ui/components/typography";
import type { JSX, ReactNode } from "react";

import { ADMIN_GROUPS } from "@/generated/categories/registry";

import { Platform } from "../platforms/platforms";
import { Icon } from "../unified-ui/widgets/form-fields/icon-field/icon-component";
import {
  groupVisibleCategories,
  humanCategoryName,
} from "./admin-catalog-model";
import type { CategoryDefinitionSerialized } from "./category-types";
import type {
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
} from "./definition";
import type { HelpT } from "./i18n";
import { localizedLabel } from "./localized-label";

type Summary = NonNullable<HelpGetResponseOutput["webCategories"]>[number];
type Landing = NonNullable<
  HelpGetResponseOutput["adminCategoryLandings"]
>[string];

interface PlatformAdminCatalogProps {
  t: HelpT;
  locale: CountryLanguage;
  registry: ReadonlyMap<string, CategoryDefinitionSerialized>;
  summaries: readonly Summary[];
  tools: readonly HelpToolMetadataSerialized[];
  activeCategory?: string;
  activeSubCategory?: string;
  landing?: Landing;
  contextualActionAlias?: string;
  landings?: HelpGetResponseOutput["adminCategoryLandings"];
  /** Record counts reported by the landing summary, keyed by tool alias. */
  counts?: Readonly<Record<string, number>>;
  query: string;
  overview?: ReactNode;
  homeSummary?: ReactNode;
  recordSearch?: ReactNode;
  loading: boolean;
  error?: string;
  currentPage: number;
  totalPages: number;
  matchedCount: number;
  onHome: () => void;
  onSelectCategory: (category: string, sub?: string) => void;
  onOpenTool: (alias: string) => void;
  onAllTools: (category?: string) => void;
  onPage: (page: number) => void;
  onRetry: () => void;
}

function ToolCard({
  tool,
  t,
  compact = false,
  onOpenTool,
}: {
  tool: HelpToolMetadataSerialized;
  compact?: boolean;
  t: HelpT;
  onOpenTool: PlatformAdminCatalogProps["onOpenTool"];
}): JSX.Element {
  const title = tool.titleShort || tool.title || t("admin.tool");
  const canOpen =
    !tool.platforms || tool.platforms.includes(Platform.NEXT_PAGE);
  return (
    <Button
      type="button"
      variant={compact ? "ghost" : "outline"}
      size="unset"
      disabled={!canOpen}
      className={
        compact
          ? "h-auto w-full min-w-0 justify-start gap-3 whitespace-normal rounded-none px-3 py-2 text-start"
          : "h-full min-w-0 justify-start gap-3 whitespace-normal rounded-xl bg-card p-4 text-start shadow-none"
      }
      onClick={() => onOpenTool(tool.id ?? tool.name)}
    >
      <Div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
        {tool.icon ? (
          <Icon icon={tool.icon} className="size-4" />
        ) : (
          <Wrench className="size-4" />
        )}
      </Div>
      <Div className="flex min-w-0 flex-1 flex-col gap-1">
        <Span className="break-words font-medium">{title}</Span>
        <Span className="line-clamp-2 break-words text-xs font-normal text-muted-foreground">
          {tool.description}
        </Span>
        {!canOpen && (
          <Span className="text-xs text-muted-foreground">
            {t("catalog.toolUnavailable")}
          </Span>
        )}
      </Div>
      {canOpen && (
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </Button>
  );
}

function ToolGrid({
  tools,
  onOpenTool,
  t,
}: {
  tools: readonly HelpToolMetadataSerialized[];
  onOpenTool: PlatformAdminCatalogProps["onOpenTool"];
  t: HelpT;
}): JSX.Element {
  return (
    <Div className="grid min-w-0 gap-3 @2xl:grid-cols-2">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id ?? tool.name}
          tool={tool}
          t={t}
          onOpenTool={onOpenTool}
        />
      ))}
    </Div>
  );
}

/**
 * Within a workspace, places to go and create actions come before actions on a
 * single record, which need a record picked first.
 */
function searchRank(tool: HelpToolMetadataSerialized): number {
  const id = tool.id ?? tool.name;
  if (id.includes("[")) {
    return 2;
  }
  return tool.method === "GET" || id.endsWith("_create_POST") ? 0 : 1;
}

function SearchResults({
  tools,
  registry,
  locale,
  t,
  onOpenTool,
}: Pick<
  PlatformAdminCatalogProps,
  "tools" | "registry" | "locale" | "t" | "onOpenTool"
>): JSX.Element {
  // First occurrence preserves the server's relevance ranking between workspaces.
  const sections = new Map<string, HelpToolMetadataSerialized[]>();
  for (const tool of tools.toSorted((a, b) => searchRank(a) - searchRank(b))) {
    const key = tool.category ?? "";
    const section = sections.get(key);
    if (section) {
      section.push(tool);
    } else {
      sections.set(key, [tool]);
    }
  }
  const row = (tool: HelpToolMetadataSerialized): JSX.Element => (
    <ToolCard
      key={tool.id ?? tool.name}
      tool={tool}
      compact
      t={t}
      onOpenTool={onOpenTool}
    />
  );
  return (
    <Div className="flex w-full min-w-0 flex-col gap-4">
      {[...sections].map(([key, entries]) => {
        const category = registry.get(key);
        const label = category
          ? (localizedLabel(category.labels, locale) ?? category.label)
          : key
            ? humanCategoryName(key)
            : t("uncategorized");
        return (
          <Div
            key={key}
            className="min-w-0 overflow-hidden rounded-lg border bg-card"
          >
            <H2 className="border-b bg-muted/30 px-3 py-2 text-sm font-semibold">
              {label}
            </H2>
            <Div className="divide-y">{entries.slice(0, 5).map(row)}</Div>
            {entries.length > 5 && (
              <Accordion collapsible className="border-t px-3">
                <AccordionItem value="more" className="border-0">
                  <AccordionTrigger className="text-sm">
                    {t("catalog.moreMatches", { count: entries.length - 5 })}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Div className="divide-y">{entries.slice(5).map(row)}</Div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </Div>
        );
      })}
    </Div>
  );
}

function LandingLinks({
  links,
  counts,
  locale,
  onOpenTool,
  grid = false,
}: {
  links: Landing["destinations"];
  counts?: Readonly<Record<string, number>>;
  locale: CountryLanguage;
  onOpenTool: PlatformAdminCatalogProps["onOpenTool"];
  grid?: boolean;
}): JSX.Element {
  const number = new Intl.NumberFormat(locale);
  return (
    <Div
      className={
        grid
          ? "grid min-w-0 gap-3 @xl:grid-cols-2"
          : "flex min-w-0 flex-col divide-y"
      }
    >
      {links.map(({ alias, title, description }) => (
        <Button
          key={alias}
          type="button"
          variant="ghost"
          size="unset"
          className={
            grid
              ? "h-full min-h-20 w-full justify-between gap-3 whitespace-normal rounded-lg border bg-card px-4 py-3 text-start"
              : "h-auto min-h-11 w-full justify-between gap-3 whitespace-normal rounded-none px-3 py-2.5 text-start @lg:py-3"
          }
          onClick={() => onOpenTool(alias)}
        >
          <Div className="flex min-w-0 flex-col gap-1">
            <Span className="break-words text-sm font-medium">{title}</Span>
            {description && (
              <Span className="line-clamp-2 break-words text-xs font-normal text-muted-foreground">
                {description}
              </Span>
            )}
          </Div>
          <Span className="flex shrink-0 items-center gap-2">
            {counts?.[alias] !== undefined && (
              <Span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                {number.format(counts[alias])}
              </Span>
            )}
            <ChevronRight
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </Span>
        </Button>
      ))}
    </Div>
  );
}

export function PlatformAdminCatalog({
  t,
  locale,
  registry,
  summaries,
  tools,
  activeCategory,
  activeSubCategory,
  landing,
  contextualActionAlias,
  landings,
  counts,
  query,
  overview,
  homeSummary,
  recordSearch,
  loading,
  error,
  currentPage,
  totalPages,
  matchedCount,
  onHome,
  onSelectCategory,
  onOpenTool,
  onAllTools,
  onPage,
  onRetry,
}: PlatformAdminCatalogProps): JSX.Element {
  const searching = query.trim().length > 0;
  const isHome = !activeCategory && !searching;
  const active = activeCategory ? registry.get(activeCategory) : undefined;
  const section =
    active?.group === "comms"
      ? "analytics"
      : active?.group === "platform"
        ? "system"
        : active?.group;
  const title = active
    ? (localizedLabel(active.labels, locale) ?? active.label)
    : activeCategory
      ? humanCategoryName(activeCategory)
      : t("admin.title");
  const summariesByGroup = groupVisibleCategories(
    summaries,
    registry,
    ADMIN_GROUPS,
    locale,
  );
  const subcategories =
    summaries.find(({ name }) => name === activeCategory)?.subCategories ?? [];
  const orderedSubcategories = subcategories
    .filter(({ name }) => name.trim().length > 0)
    .toSorted(
      (a, b) =>
        (active?.subcategories?.[a.name]?.order ?? Infinity) -
          (active?.subcategories?.[b.name]?.order ?? Infinity) ||
        a.name.localeCompare(b.name, locale),
    );
  const showCategoryLanding =
    !!activeCategory && !activeSubCategory && !searching;
  const destinations = landing?.destinations ?? [];
  const actions = (landing?.actions ?? []).filter((action, index) =>
    landing?.contextualActions
      ? action.alias === contextualActionAlias
      : index === 0 ||
        !destinations.some((item) => item.alias === action.alias),
  );
  const shortcutGrid =
    activeCategory === "cortex" || activeCategory === "accountSettings";
  const otherDestinations = destinations.filter(
    (destination) =>
      !actions.some((action) => action.alias === destination.alias),
  );
  return (
    <Div className="@container mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pb-10 pt-5 sm:gap-6 sm:px-8 sm:pt-8">
      <Div className="flex flex-col gap-4">
        {activeCategory && (
          <Div className="flex min-w-0 flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2 self-start text-muted-foreground"
              onClick={onHome}
            >
              {t("admin.title")}
            </Button>
            {section && activeCategory !== "accountSettings" && (
              <>
                <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
                <Span>{t(`groups.${section}`)}</Span>
              </>
            )}
          </Div>
        )}
        <Div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <Div className="flex min-w-0 items-start gap-3">
            {active?.icon && (
              <Div className="grid size-11 shrink-0 place-items-center rounded-xl border bg-card text-primary">
                <Icon icon={active.icon} className="size-5" />
              </Div>
            )}
            <Div className="flex min-w-0 flex-col gap-1">
              <H1 className="break-words text-2xl font-semibold tracking-tight lg:text-2xl">
                {searching && !activeCategory
                  ? t("admin.results")
                  : showCategoryLanding
                    ? (landing?.heading ?? title)
                    : title}
              </H1>
              {searching && !loading && !error && matchedCount > 0 && (
                <P className="break-words text-sm text-muted-foreground">
                  {matchedCount === 1
                    ? t("admin.resultsForOne", { query: query.trim() })
                    : t("admin.resultsFor", {
                        count: matchedCount,
                        query: query.trim(),
                      })}
                </P>
              )}
              {isHome && (
                <P className="text-sm text-muted-foreground">
                  {t("admin.homeDescription")}
                </P>
              )}
              {showCategoryLanding && landing?.description && (
                <P className="max-w-xl break-words text-sm text-muted-foreground">
                  {landing.description}
                </P>
              )}
            </Div>
          </Div>
          {showCategoryLanding && actions.length ? (
            <Div className="flex min-w-0 flex-wrap items-center gap-2">
              {actions.toReversed().map((action) => (
                <Button
                  key={action.alias}
                  type="button"
                  variant={action === actions[0] ? "default" : "outline"}
                  className="h-auto min-h-10 max-w-full whitespace-normal text-start"
                  onClick={() => onOpenTool(action.alias)}
                >
                  {!landing?.contextualActions && (
                    <Plus className="size-4 shrink-0" aria-hidden="true" />
                  )}
                  {action.title}
                </Button>
              ))}
            </Div>
          ) : null}
        </Div>
      </Div>

      {isHome && homeSummary}

      {error ? (
        <EmptyBlock
          title={t("catalog.loadError")}
          message={error}
          action={{ label: t("catalog.retry"), onClick: onRetry }}
        />
      ) : loading ? (
        <Div className="flex flex-col gap-3">
          <P className="text-sm text-muted-foreground">
            {t("aiTools.modal.loading")}
          </P>
          <Div className="grid gap-3 @2xl:grid-cols-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </Div>
        </Div>
      ) : isHome ? (
        <>
          <Div className="flex flex-col gap-3">
            <H2 className="border-0 text-base font-semibold">
              {t("admin.workspaces")}
            </H2>
            {summariesByGroup.length ? (
              <Div className="grid min-w-0 items-stretch gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
                {summariesByGroup.map(({ group, categories }) => (
                  <Div
                    key={group ?? "other"}
                    className="flex min-w-0 flex-col rounded-xl border bg-card p-2"
                  >
                    <H3 className="px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group ? t(`groups.${group}`) : t("uncategorized")}
                    </H3>
                    {categories.map(({ name, label, metadata }) => (
                      <Button
                        key={name}
                        type="button"
                        variant="ghost"
                        size="unset"
                        onClick={() => onSelectCategory(name)}
                        className="h-auto min-h-10 w-full justify-start gap-3 whitespace-normal px-3 py-2 text-start"
                      >
                        {metadata?.icon && (
                          <Icon
                            icon={metadata.icon}
                            className="size-4 shrink-0 text-primary"
                          />
                        )}
                        <Div className="flex min-w-0 flex-1 flex-col gap-1">
                          <Span className="break-words font-medium">
                            {label}
                          </Span>
                          {landings?.[name]?.description && (
                            <Span className="break-words text-xs font-normal leading-relaxed text-muted-foreground">
                              {landings[name].description}
                            </Span>
                          )}
                        </Div>
                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </Button>
                    ))}
                  </Div>
                ))}
              </Div>
            ) : (
              <EmptyBlock title={t("catalog.noTools")} />
            )}
          </Div>
          {recordSearch && (
            <Accordion collapsible className="rounded-xl border bg-card px-4">
              <AccordionItem value="record-search" className="border-0">
                <AccordionTrigger className="min-h-11 text-start">
                  {t("catalog.findRecord")}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  {recordSearch}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </>
      ) : showCategoryLanding ? (
        <Div
          className={
            overview
              ? "grid min-w-0 items-start gap-4 @4xl:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] @4xl:gap-5"
              : "flex min-w-0 flex-col gap-4"
          }
        >
          {overview && <Div className="min-w-0">{overview}</Div>}
          <Div className="flex min-w-0 flex-col gap-3">
            {otherDestinations.length > 0 ? (
              <Div
                className={
                  shortcutGrid ? "min-w-0" : "min-w-0 rounded-xl border bg-card"
                }
              >
                {!shortcutGrid && (
                  <H2 className="border-0 px-3 pb-1 pt-3 text-base font-semibold">
                    {t("admin.destinations")}
                  </H2>
                )}
                <LandingLinks
                  grid={shortcutGrid}
                  links={otherDestinations}
                  counts={counts}
                  locale={locale}
                  onOpenTool={onOpenTool}
                />
              </Div>
            ) : !actions.length &&
              !overview &&
              !landing?.automationCount &&
              !landing?.developerCount ? (
              <EmptyBlock
                title={t("admin.noDestinations")}
                action={{
                  label: t("catalog.allTools"),
                  onClick: () => onAllTools(activeCategory),
                }}
              />
            ) : null}
            {!!(landing?.automationCount || landing?.developerCount) && (
              <Accordion collapsible className="rounded-xl border bg-card px-3">
                {!!landing?.automationCount && (
                  <AccordionItem value="automations">
                    <AccordionTrigger className="min-h-11 text-start">
                      {t("admin.automations")} ({landing.automationCount})
                    </AccordionTrigger>
                    <AccordionContent>
                      <LandingLinks
                        links={landing.automations}
                        locale={locale}
                        onOpenTool={onOpenTool}
                      />
                      {landing.automationCount > landing.automations.length && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => onAllTools(activeCategory)}
                        >
                          {t("catalog.allTools")}
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
                {!!landing?.developerCount && (
                  <AccordionItem value="developer" className="border-0">
                    <AccordionTrigger className="min-h-11 text-start">
                      {t("admin.developer")} ({landing.developerCount})
                    </AccordionTrigger>
                    <AccordionContent>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onAllTools(activeCategory)}
                      >
                        {t("admin.openDeveloper")}
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            )}
          </Div>
        </Div>
      ) : (
        <Div className="flex min-w-0 flex-col gap-4">
          {!searching && activeCategory && (
            <H2 className="border-0 text-base font-semibold">
              {t("admin.categoryTools")}
            </H2>
          )}
          {!searching && activeCategory && orderedSubcategories.length > 0 && (
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={activeSubCategory ? "outline" : "secondary"}
                aria-pressed={!activeSubCategory}
                onClick={() => onSelectCategory(activeCategory)}
              >
                {t("catalog.allInCategory")}
              </Button>
              {orderedSubcategories.map(({ name }) => {
                const sub = active?.subcategories?.[name];
                return (
                  <Button
                    key={name}
                    type="button"
                    size="sm"
                    variant={
                      activeSubCategory === name ? "secondary" : "outline"
                    }
                    className="h-auto whitespace-normal py-2 text-start"
                    aria-pressed={activeSubCategory === name}
                    onClick={() => onSelectCategory(activeCategory, name)}
                  >
                    {sub
                      ? (localizedLabel(sub.labels, locale) ?? sub.label)
                      : humanCategoryName(name)}
                  </Button>
                );
              })}
            </Div>
          )}
          {tools.length ? (
            searching ? (
              <SearchResults
                tools={tools}
                registry={registry}
                locale={locale}
                t={t}
                onOpenTool={onOpenTool}
              />
            ) : (
              <ToolGrid tools={tools} t={t} onOpenTool={onOpenTool} />
            )
          ) : (
            <Div className="flex min-w-0 flex-col gap-6">
              <EmptyBlock
                size="page"
                className="rounded-xl border bg-card py-8"
                icon={<Search className="size-6" />}
                title={t(
                  searching
                    ? "aiTools.modal.searchNoResults"
                    : "catalog.noTools",
                )}
                message={
                  searching ? t("catalog.noMatches", { query }) : undefined
                }
                action={{
                  label: t("catalog.allTools"),
                  onClick: () => onAllTools(activeCategory),
                }}
              />
              {searching && !activeCategory && summariesByGroup.length > 0 && (
                <Div className="flex min-w-0 flex-col gap-3">
                  <H2 className="border-0 text-sm font-semibold text-muted-foreground">
                    {t("admin.jumpTo")}
                  </H2>
                  <Div className="flex flex-wrap gap-2">
                    {summariesByGroup
                      .flatMap(({ categories }) => categories.slice(0, 2))
                      .map(({ name, label, metadata }) => (
                        <Button
                          key={name}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-auto min-h-9 gap-2 whitespace-normal bg-card text-start"
                          onClick={() => onSelectCategory(name)}
                        >
                          {metadata?.icon && (
                            <Icon
                              icon={metadata.icon}
                              className="size-4 shrink-0 text-muted-foreground"
                            />
                          )}
                          {label}
                        </Button>
                      ))}
                  </Div>
                </Div>
              )}
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
      )}
    </Div>
  );
}
