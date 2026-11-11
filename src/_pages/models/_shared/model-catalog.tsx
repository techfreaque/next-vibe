"use client";

/**
 * Shared model catalog - one component for the public /models page and the
 * "What things cost" section of the pricing widget.
 *
 * Options: model type (tabs across every role). Always the same compact rows,
 * grouped content level > provider. Every entry shows the detailed per-unit price
 * (per message / image / clip / second / character) with the "≈ $" hint via
 * ModelCreditDisplay.
 */

import { ModelCreditDisplay } from "next-vibe/agent/models/widget/model-credit-display";
import { ContentLevel } from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { JSX, ReactNode } from "react";
import { useState } from "react";

import { scopedTranslation } from "../i18n";
import type { CatalogEntry, CatalogType } from "./model-catalog-entries";
import { CATALOG_TYPE_ORDER } from "./model-catalog-entries";
import { CONTENT_TIER_ORDER } from "./model-facts";
import { modelHref, tierLine, tierName } from "./model-format";

const PILL_ACTIVE =
  "h-10 shrink-0 rounded-lg bg-primary/10 px-3 font-semibold text-primary hover:bg-primary/15 hover:text-primary";
const PILL_IDLE = "h-10 shrink-0 rounded-lg px-3 text-muted-foreground";

/** Per-tier accent: a small dot + heading color only, no tinted blocks. */
const TIER_DOT: Record<CatalogEntry["content"], string> = {
  [ContentLevel.MAINSTREAM]: "bg-primary",
  [ContentLevel.OPEN]: "bg-info",
  [ContentLevel.UNCENSORED]: "bg-warning",
};

interface ProviderGroup {
  id: string;
  label: string;
  icon: CatalogEntry["labIcon"];
  entries: CatalogEntry[];
  legacy: CatalogEntry[];
}

interface ContentGroup {
  tier: CatalogEntry["content"];
  count: number;
  providers: ProviderGroup[];
}

/** Content level (outer, CONTENT_TIER_ORDER) > provider A-Z (inner) > cheapest first. */
function groupEntries(entries: CatalogEntry[]): ContentGroup[] {
  return CONTENT_TIER_ORDER.map((tier) => {
    const labs = new Map<string, ProviderGroup>();
    for (const entry of entries) {
      if (entry.content !== tier) {
        continue;
      }
      const existing = labs.get(entry.labId);
      if (existing === undefined) {
        labs.set(entry.labId, {
          id: entry.labId,
          label: entry.labName,
          icon: entry.labIcon,
          entries: entry.isLegacy ? [] : [entry],
          legacy: entry.isLegacy ? [entry] : [],
        });
      } else if (entry.isLegacy) {
        existing.legacy.push(entry);
      } else {
        existing.entries.push(entry);
      }
    }
    const providers = [...labs.values()]
      .map((group) => ({
        ...group,
        entries: group.entries.toSorted((a, b) => a.sortPrice - b.sortPrice),
        legacy: group.legacy.toSorted((a, b) => a.sortPrice - b.sortPrice),
      }))
      .toSorted((a, b) => a.label.localeCompare(b.label));
    return {
      tier,
      count: providers.reduce(
        (sum, p) => sum + p.entries.length + p.legacy.length,
        0,
      ),
      providers,
    };
  }).filter((group) => group.count > 0);
}

function EntryRow({
  entry,
  locale,
  link,
  showLab,
}: {
  entry: CatalogEntry;
  locale: CountryLanguage;
  link: boolean;
  showLab: boolean;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const sub = [
    showLab ? entry.labName : null,
    entry.meta === null ? null : t("catalog.context", { size: entry.meta }),
  ]
    .filter((part) => part !== null)
    .join(" · ");
  const className =
    "group flex flex-col gap-1 border-b border-border/60 px-1 py-2.5 text-sm min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between min-[480px]:gap-3";
  const body = (
    <>
      <Span className="flex min-w-0 flex-col">
        <Span className="flex min-w-0 items-center gap-1.5">
          <Span
            className={cn(
              "min-w-0 break-words font-medium",
              link && "group-hover:text-primary group-hover:underline",
            )}
          >
            {entry.name}
          </Span>
          {entry.isLegacy && (
            <Span className="shrink-0 rounded bg-muted px-1.5 text-[10px] font-medium uppercase text-muted-foreground">
              {t("catalog.legacyBadge")}
            </Span>
          )}
        </Span>
        {sub.length > 0 && (
          <Span className="break-words text-xs text-muted-foreground">
            {sub}
          </Span>
        )}
      </Span>
      <ModelCreditDisplay
        modelId={entry.modelId}
        variant="text"
        interactive={false}
        locale={locale}
        className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground min-[480px]:text-right"
      />
    </>
  );
  const href = entry.slug === null ? null : modelHref(locale, entry.slug);
  if (link && href !== null) {
    return (
      <Link
        href={href}
        className={cn(className, "rounded-md hover:bg-muted/40")}
        data-model-card={entry.key}
      >
        {body}
      </Link>
    );
  }
  return (
    <Div className={className} data-model-card={entry.key}>
      {body}
    </Div>
  );
}

function ProviderBlock({
  tier,
  provider,
  locale,
  link,
}: {
  tier: CatalogEntry["content"];
  provider: ProviderGroup;
  locale: CountryLanguage;
  link: boolean;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [showLegacy, setShowLegacy] = useState(false);
  const rows = showLegacy
    ? [...provider.entries, ...provider.legacy]
    : provider.entries;
  return (
    <Div className="flex flex-col" data-group={`${tier}:${provider.id}`}>
      <Div className="flex items-center gap-2 border-b border-border/70 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon icon={provider.icon} className="h-4 w-4" />
        {provider.label}
      </Div>
      <Div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {rows.map((entry) => (
          <EntryRow
            key={entry.key}
            entry={entry}
            locale={locale}
            link={link}
            showLab={false}
          />
        ))}
      </Div>
      {provider.legacy.length > 0 && (
        <Div className="pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-legacy-toggle={`${tier}:${provider.id}`}
            aria-expanded={showLegacy}
            onClick={() => setShowLegacy(!showLegacy)}
            className="h-9 px-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {showLegacy
              ? t("catalog.hideLegacy")
              : t("catalog.showLegacy", { count: provider.legacy.length })}
          </Button>
        </Div>
      )}
    </Div>
  );
}

function GroupBody({
  group,
  locale,
  link,
}: {
  group: ContentGroup;
  locale: CountryLanguage;
  link: boolean;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div
      className="flex flex-col gap-6 border-t border-border pt-10 first:border-t-0 first:pt-0"
      data-tier={group.tier}
    >
      <Div className="flex flex-col gap-1.5">
        <Div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Span
            className={cn(
              "h-2.5 w-2.5 shrink-0 rounded-full",
              TIER_DOT[group.tier],
            )}
          />
          <H2 className="m-0 border-none pb-0 text-2xl font-bold tracking-tight">
            {tierName(group.tier, locale)}
          </H2>
          <Span className="text-sm font-medium tabular-nums text-muted-foreground">
            {t("catalog.count", { count: group.count })}
          </Span>
        </Div>
        <P className="m-0 text-sm text-muted-foreground">
          {tierLine(group.tier, locale)}
        </P>
      </Div>
      {group.providers.map((provider) => (
        <ProviderBlock
          key={provider.id}
          tier={group.tier}
          provider={provider}
          locale={locale}
          link={link}
        />
      ))}
    </Div>
  );
}

export interface ModelCatalogProps {
  locale: CountryLanguage;
  /** Entries per model type; types without entries get no tab */
  entriesByType: Partial<Record<CatalogType, CatalogEntry[]>>;
  /** Chat rows link to /models/<slug> for chat models */
  linkModels?: boolean;
  /** Shown instead of the groups when the active type has no entries */
  emptyText?: string;
  /** Extra trailing tab (e.g. the pricing widget's Features tab) */
  extraTab?: { label: string; content: ReactNode };
  className?: string;
}

export function ModelCatalog({
  locale,
  entriesByType,
  linkModels = false,
  emptyText,
  extraTab,
  className,
}: ModelCatalogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [activeType, setActiveType] = useState<CatalogType>("text");
  const [extraActive, setExtraActive] = useState(false);

  const types = CATALOG_TYPE_ORDER.filter(
    (type) => (entriesByType[type]?.length ?? 0) > 0,
  );
  const current =
    types.includes(activeType) || types.length === 0
      ? activeType
      : (types[0] ?? "text");
  const entries = entriesByType[current] ?? [];
  const showModels = !extraActive;

  return (
    <Div className={cn("flex flex-col", className)} data-catalog="rows">
      <Div className="flex flex-col gap-3 border-b px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <Div
          role="tablist"
          aria-label={t("catalog.typesLabel")}
          className="flex gap-1 overflow-x-auto [scrollbar-width:none]"
        >
          {types.map((type) => (
            <Button
              key={type}
              type="button"
              variant="ghost"
              size="sm"
              role="tab"
              data-type={type}
              aria-selected={showModels && type === current}
              onClick={() => {
                setActiveType(type);
                setExtraActive(false);
              }}
              className={
                showModels && type === current ? PILL_ACTIVE : PILL_IDLE
              }
            >
              {t(`catalog.types.${type}`)}
            </Button>
          ))}
          {extraTab !== undefined && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              role="tab"
              data-type="extra"
              aria-selected={extraActive}
              onClick={() => setExtraActive(true)}
              className={extraActive ? PILL_ACTIVE : PILL_IDLE}
            >
              {extraTab.label}
            </Button>
          )}
        </Div>
      </Div>

      {showModels && (
        <Div className="flex flex-col gap-10 p-5 sm:p-6">
          {entries.length === 0 && emptyText !== undefined && (
            <P className="py-8 text-center text-muted-foreground">
              {emptyText}
            </P>
          )}
          {groupEntries(entries).map((group) => (
            <GroupBody
              key={group.tier}
              group={group}
              locale={locale}
              link={linkModels}
            />
          ))}
        </Div>
      )}
      {!showModels && extraTab?.content}
    </Div>
  );
}
