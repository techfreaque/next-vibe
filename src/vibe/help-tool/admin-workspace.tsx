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
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, P } from "next-vibe/ui/components/typography";
import type { JSX, ReactNode } from "react";

import { Platform } from "../platforms/platforms";
import { Icon } from "../unified-ui/widgets/form-fields/icon-field/icon-component";
import { humanCategoryName } from "./admin-catalog-model";
import type { CategoryDefinitionSerialized } from "./category-types";
import type {
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
} from "./definition";
import type { HelpT } from "./i18n";
import { localizedLabel } from "./localized-label";

type Landing = NonNullable<
  HelpGetResponseOutput["adminCategoryLandings"]
>[string];
interface CatalogLink {
  alias: string;
  title: string;
}
type ToolControls = (
  alias: string,
  tool?: HelpToolMetadataSerialized,
) => ReactNode;

interface AdminCatalogProps {
  t: HelpT;
  locale: CountryLanguage;
  registry: ReadonlyMap<string, CategoryDefinitionSerialized>;
  tools: readonly HelpToolMetadataSerialized[];
  activeCategory?: string;
  activeSubCategory?: string;
  landing?: Landing;
  contextualActionAlias?: string;
  counts?: Readonly<Record<string, number>>;
  query: string;
  isHome: boolean;
  showLanding: boolean;
  viewTitle?: string;
  overview?: ReactNode;
  homeSummary?: ReactNode;
  recordSearch?: ReactNode;
  recents: readonly CatalogLink[];
  loading: boolean;
  error?: string;
  currentPage: number;
  totalPages: number;
  matchedCount: number;
  onOpenTool: (alias: string) => void;
  onAllTools: (category?: string) => void;
  onFavorites: () => void;
  onPage: (page: number) => void;
  onRetry: () => void;
  toolControls?: ToolControls;
}

export function CatalogPagination({
  t,
  currentPage,
  totalPages,
  onPage,
}: Pick<
  AdminCatalogProps,
  "t" | "currentPage" | "totalPages" | "onPage"
>): JSX.Element | null {
  return totalPages > 1 ? (
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
  ) : null;
}

export function CatalogToolList({
  tools,
  t,
  onOpenTool,
  toolControls,
}: Pick<AdminCatalogProps, "tools" | "t" | "toolControls"> & {
  onOpenTool?: AdminCatalogProps["onOpenTool"];
}): JSX.Element {
  return (
    <Div className="min-w-0 divide-y overflow-hidden rounded-xl border bg-card">
      {tools.map((tool) => {
        const id = tool.id ?? tool.name;
        const canOpen =
          !tool.platforms || tool.platforms.includes(Platform.NEXT_PAGE);
        const label = (
          <>
            <Div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-primary">
              {tool.icon ? (
                <Icon icon={tool.icon} className="size-4" />
              ) : (
                <Wrench className="size-4" aria-hidden="true" />
              )}
            </Div>
            <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <Span className="break-words text-sm font-medium">
                {tool.titleShort || tool.title || t("admin.tool")}
              </Span>
              {tool.description && (
                <Span className="line-clamp-2 break-words text-xs font-normal text-muted-foreground">
                  {tool.description}
                </Span>
              )}
              {onOpenTool && !canOpen && (
                <Span className="text-xs text-muted-foreground">
                  {t("catalog.toolUnavailable")}
                </Span>
              )}
            </Div>
          </>
        );
        return (
          <Div key={id} className="flex min-w-0 items-center gap-1 pr-2">
            {onOpenTool ? (
              <Button
                type="button"
                variant="ghost"
                size="unset"
                disabled={!canOpen}
                className="h-auto min-h-14 min-w-0 flex-1 justify-start gap-3 whitespace-normal rounded-none px-3 py-2.5 text-start"
                onClick={() => onOpenTool(id)}
              >
                {label}
                {canOpen && (
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </Button>
            ) : (
              <Div className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3 py-2.5">
                {label}
              </Div>
            )}
            {toolControls?.(id, tool)}
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
  toolControls,
}: {
  links: readonly Landing["destinations"][number][];
  counts?: Readonly<Record<string, number>>;
  locale: CountryLanguage;
  onOpenTool: AdminCatalogProps["onOpenTool"];
  toolControls?: ToolControls;
}): JSX.Element {
  const number = new Intl.NumberFormat(locale);
  return (
    <Div className="flex min-w-0 flex-col divide-y">
      {links.map(({ alias, title, description }) => (
        <Div key={alias} className="flex min-w-0 items-center pr-2">
          <Button
            type="button"
            variant="ghost"
            size="unset"
            className="h-auto min-h-11 min-w-0 flex-1 justify-between gap-3 whitespace-normal rounded-none px-3 py-2.5 text-start"
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
          {toolControls?.(alias)}
        </Div>
      ))}
    </Div>
  );
}

export function AdminCatalog({
  t,
  locale,
  registry,
  tools,
  activeCategory,
  activeSubCategory,
  landing,
  contextualActionAlias,
  counts,
  query,
  isHome,
  showLanding,
  viewTitle,
  overview,
  homeSummary,
  recordSearch,
  recents,
  loading,
  error,
  currentPage,
  totalPages,
  matchedCount,
  onOpenTool,
  onAllTools,
  onFavorites,
  onPage,
  onRetry,
  toolControls,
}: AdminCatalogProps): JSX.Element {
  const searching = query.trim().length > 0;
  const category = activeCategory ? registry.get(activeCategory) : undefined;
  const subCategory = activeSubCategory
    ? category?.subcategories?.[activeSubCategory]
    : undefined;
  const categoryTitle = category
    ? (localizedLabel(category.labels, locale) ?? category.label)
    : humanCategoryName(activeCategory ?? "");
  const heading = searching
    ? t("admin.results")
    : activeSubCategory
      ? ((subCategory &&
          (localizedLabel(subCategory.labels, locale) ?? subCategory.label)) ??
        humanCategoryName(activeSubCategory))
      : activeCategory
        ? ((showLanding ? landing?.heading : undefined) ?? categoryTitle)
        : isHome
          ? t("admin.title")
          : (viewTitle ?? t("catalog.title"));
  const actions = showLanding
    ? (landing?.actions ?? []).filter(
        (action) =>
          !landing?.contextualActions || action.alias === contextualActionAlias,
      )
    : [];
  const destinations = showLanding
    ? (landing?.destinations ?? []).filter(
        ({ alias }) => !actions.some((action) => action.alias === alias),
      )
    : [];
  const filtersDescription =
    category?.descriptions && localizedLabel(category.descriptions, locale);
  const description = isHome
    ? t("admin.homeDescription")
    : showLanding
      ? (landing?.description ?? filtersDescription)
      : undefined;

  return (
    <Div className="@container mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5 px-4 pb-10 pt-5 sm:gap-6 sm:px-8">
      <Div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <Div className="flex min-w-0 items-start gap-3">
          {(subCategory?.icon ?? category?.icon) && (
            <Div className="grid size-10 shrink-0 place-items-center rounded-lg border bg-card text-primary">
              {subCategory ? (
                <Icon icon={subCategory.icon} className="size-5" />
              ) : (
                category && <Icon icon={category.icon} className="size-5" />
              )}
            </Div>
          )}
          <Div className="flex min-w-0 flex-col gap-1">
            <H1 className="break-words text-2xl font-semibold tracking-tight lg:text-3xl">
              {heading}
            </H1>
            {description && (
              <P className="max-w-xl break-words text-sm text-muted-foreground">
                {description}
              </P>
            )}
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
          </Div>
        </Div>
        {actions.length > 0 && (
          <Div className="flex min-w-0 flex-wrap items-center gap-2">
            {actions.map(({ alias, title }, index) => (
              <Button
                key={alias}
                type="button"
                variant={index === 0 ? "default" : "outline"}
                className="h-auto min-h-10 max-w-full whitespace-normal text-start"
                onClick={() => onOpenTool(alias)}
              >
                {!landing?.contextualActions && (
                  <Plus className="size-4 shrink-0" aria-hidden="true" />
                )}
                {title}
              </Button>
            ))}
          </Div>
        )}
      </Div>

      {error ? (
        <EmptyBlock
          title={t("catalog.loadError")}
          message={error}
          action={{ label: t("catalog.retry"), onClick: onRetry }}
        />
      ) : (
        <>
          {isHome && homeSummary}
          {isHome && recordSearch && (
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
          {showLanding &&
          (overview ||
            destinations.length > 0 ||
            landing?.automationCount ||
            landing?.developerCount) ? (
            <Div
              className={
                overview
                  ? "grid min-w-0 items-start gap-4 @4xl:grid-cols-[minmax(0,1fr)_minmax(240px,320px)]"
                  : "flex min-w-0 flex-col gap-4"
              }
            >
              {overview && <Div className="min-w-0">{overview}</Div>}
              <Div className="flex min-w-0 flex-col gap-3">
                {destinations.length > 0 && (
                  <Div className="min-w-0 rounded-xl border bg-card">
                    <H2 className="border-0 px-3 pb-1 pt-3 text-base font-semibold">
                      {t("admin.destinations")}
                    </H2>
                    <LandingLinks
                      links={destinations}
                      counts={counts}
                      locale={locale}
                      onOpenTool={onOpenTool}
                      toolControls={toolControls}
                    />
                  </Div>
                )}
                {!!(landing?.automationCount || landing?.developerCount) && (
                  <Accordion
                    collapsible
                    className="rounded-xl border bg-card px-3"
                  >
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
                            toolControls={toolControls}
                          />
                          {landing.automationCount >
                            landing.automations.length && (
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
          ) : null}
          {loading ? (
            <LoadingBlock announce message={t("aiTools.modal.loading")} />
          ) : isHome ? (
            <Div className="grid min-w-0 items-start gap-4 @3xl:grid-cols-2">
              <Div className="flex min-w-0 flex-col gap-2">
                <Div className="flex items-center justify-between gap-2">
                  <H2 className="border-0 text-base font-semibold">
                    {t("catalog.favorites")}
                  </H2>
                  {matchedCount > 6 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onFavorites}
                    >
                      {t("catalog.viewFavorites")}
                    </Button>
                  )}
                </Div>
                {tools.length > 0 ? (
                  <CatalogToolList
                    tools={tools.slice(0, 6)}
                    t={t}
                    onOpenTool={onOpenTool}
                    toolControls={toolControls}
                  />
                ) : (
                  <EmptyBlock title={t("catalog.noFavorites")} />
                )}
              </Div>
              <Div className="flex min-w-0 flex-col gap-2">
                <H2 className="flex min-h-8 items-center border-0 text-base font-semibold">
                  {t("catalog.recent")}
                </H2>
                {recents.length > 0 ? (
                  <Div className="rounded-xl border bg-card">
                    <LandingLinks
                      links={recents}
                      locale={locale}
                      onOpenTool={onOpenTool}
                    />
                  </Div>
                ) : (
                  <EmptyBlock title={t("catalog.noRecent")} />
                )}
              </Div>
            </Div>
          ) : (
            <Div className="flex min-w-0 flex-col gap-3">
              {tools.length > 0 ? (
                <>
                  {showLanding && (overview || destinations.length > 0) && (
                    <H2 className="border-0 text-base font-semibold">
                      {t("admin.categoryTools")}
                    </H2>
                  )}
                  <CatalogToolList
                    tools={tools}
                    t={t}
                    onOpenTool={onOpenTool}
                    toolControls={toolControls}
                  />
                </>
              ) : tools.length === 0 &&
                !overview &&
                !destinations.length &&
                !actions.length ? (
                <EmptyBlock
                  className="rounded-xl border bg-card"
                  icon={<Search className="size-6" />}
                  title={t(
                    searching
                      ? "aiTools.modal.searchNoResults"
                      : "catalog.noTools",
                  )}
                  message={
                    searching ? t("catalog.noMatches", { query }) : undefined
                  }
                />
              ) : null}
              <CatalogPagination
                t={t}
                currentPage={currentPage}
                totalPages={totalPages}
                onPage={onPage}
              />
            </Div>
          )}
        </>
      )}
    </Div>
  );
}
