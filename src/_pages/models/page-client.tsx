"use client";

import { Div } from "next-vibe/ui/components/div";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import { CONTAINER, Cta, CtaBand, PageHero } from "../story/_shared/marketing";
import { ModelCatalog } from "./_shared/model-catalog";
import {
  CATALOG_TYPE_ORDER,
  type CatalogEntry,
  type CatalogType,
  listAllCatalogEntries,
} from "./_shared/model-catalog-entries";
import { scopedTranslation } from "./i18n";
import type { ModelsIndexPageData } from "./page";

const SEARCH_INPUT_ID = "models-search";

function matchesQuery(entry: CatalogEntry, query: string): boolean {
  if (query.length === 0) {
    return true;
  }
  const haystack =
    `${entry.name} ${entry.labName} ${entry.modelId}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .every((word) => haystack.includes(word));
}

export function ModelsIndexClient({
  locale,
  chatModelCount,
  mediaModelCounts,
}: ModelsIndexPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [query, setQuery] = useState("");

  const allEntries = useMemo(() => listAllCatalogEntries(), []);
  const entriesByType = useMemo(() => {
    const trimmed = query.trim();
    const result: Partial<Record<CatalogType, CatalogEntry[]>> = {};
    for (const type of CATALOG_TYPE_ORDER) {
      const entries = (allEntries[type] ?? []).filter((entry) =>
        matchesQuery(entry, trimmed),
      );
      if (entries.length > 0 || trimmed.length === 0) {
        result[type] = entries;
      }
    }
    return result;
  }, [allEntries, query]);

  return (
    <Div>
      <PageHero
        eyebrow={t("index.eyebrow", {
          chat: chatModelCount,
          ...mediaModelCounts,
        })}
        title={t("index.title")}
        subtitle={t("index.subtitle")}
      >
        <Div className="mt-8 max-w-xl">
          <Label htmlFor={SEARCH_INPUT_ID} className="sr-only">
            {t("index.searchLabel")}
          </Label>
          <Div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={SEARCH_INPUT_ID}
              type="text"
              value={query}
              onChangeText={setQuery}
              placeholder={t("index.searchPlaceholder")}
              aria-label={t("index.searchLabel")}
              autoComplete="off"
              className="h-12 bg-card pl-10 text-base"
            />
          </Div>
        </Div>
      </PageHero>

      <Div className={`${CONTAINER} py-12 md:py-16`}>
        <ModelCatalog
          locale={locale}
          entriesByType={entriesByType}
          linkModels
          emptyText={t("index.noResults", { query: query.trim() })}
        />
      </Div>

      <CtaBand
        title={t("index.ctaTitle")}
        subtitle={t("index.ctaSubtitle")}
        actions={
          <Cta
            href={`/${locale}/threads/private/new`}
            label={t("index.ctaButton")}
          />
        }
      />
    </Div>
  );
}
