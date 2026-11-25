"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import type { JSX, ReactNode } from "react";

import type { CategoryDefinitionSerialized } from "./category-types";
import type { HelpGetResponseOutput } from "./definition";
import { erpCategories } from "./erp-company-scope";
import { erpDocumentNavigation } from "./erp-workflows";
import type { HelpT } from "./i18n";
import { localizedLabel } from "./localized-label";

const navRow = (
  label: string,
  active: boolean,
  onClick: () => void,
  placement: "primary" | "group" | "item" = "primary",
): JSX.Element => (
  <Button
    type="button"
    size="sm"
    variant="ghost"
    aria-current={active ? "page" : undefined}
    className={`min-h-9 h-auto w-full justify-start whitespace-normal text-start ${placement === "group" ? "text-xs font-semibold uppercase tracking-wide" : placement === "item" ? "pl-5 font-normal" : "font-medium"} ${active ? "bg-accent text-primary" : placement === "group" ? "text-muted-foreground" : ""}`}
    onClick={onClick}
  >
    {label}
  </Button>
);

export function ErpWorkspaceNav({
  t,
  locale,
  categories,
  permitted,
  defaults,
  currentCategory,
  currentSubcategory,
  currentAlias,
  onOpenTool,
  onHome,
  onAllTools,
  onSelect,
  company,
  instances,
}: {
  t: HelpT;
  locale: CountryLanguage;
  categories: readonly CategoryDefinitionSerialized[];
  permitted: HelpGetResponseOutput["webCategories"];
  defaults: readonly string[] | undefined;
  currentCategory?: string;
  currentSubcategory?: string;
  currentAlias?: string;
  onOpenTool: (alias: string) => void;
  onHome: () => void;
  onAllTools: () => void;
  onSelect: (
    category: string,
    subcategory?: string,
    defaultAlias?: string,
  ) => void;
  company?: ReactNode;
  instances?: ReactNode;
}): JSX.Element {
  const available = new Set(defaults);
  const documentGroups = (["sales", "purchases"] as const).map((group) => ({
    group,
    links: erpDocumentNavigation[group].filter(({ alias }) =>
      available.has(alias),
    ),
  }));
  const activeDocument = documentGroups.some(({ links }) =>
    links.some(({ alias }) => alias === currentAlias),
  );
  const summaries = new Map(
    permitted?.map((category) => [category.name, category]),
  );
  const items = categories
    .filter(({ key }) => erpCategories.has(key) && summaries.has(key))
    .toSorted((a, b) => {
      if (a.key === "purchasing" || b.key === "purchasing") {
        return Number(b.key === "purchasing") - Number(a.key === "purchasing");
      }
      return a.order - b.order;
    });
  const hasPurchasingCategory = items.some(({ key }) => key === "purchasing");
  const purchaseLinks = erpDocumentNavigation.purchases.filter(({ alias }) =>
    available.has(alias),
  );

  return (
    <Nav id="erp-workspace-navigation" className="flex h-full min-h-0 flex-col">
      {company && <Div className="border-b px-3 py-2">{company}</Div>}
      <Div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        {navRow(t("erp.home"), !currentCategory, onHome)}
        {documentGroups.map(({ group, links }) =>
          links.length && (group !== "purchases" || !hasPurchasingCategory) ? (
            <Div key={group} className="flex flex-col">
              <Span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(`erp.navigation.${group}`)}
              </Span>
              {links.map(({ key, alias }) => (
                <Div key={alias}>
                  {navRow(
                    t(`erp.navigation.${key}`),
                    currentAlias === alias,
                    () => onOpenTool(alias),
                    "item",
                  )}
                </Div>
              ))}
            </Div>
          ) : null,
        )}
        {items.map((category) => {
          const { key, label, labels, defaultEntryAlias, subcategories } =
            category;
          const categoryLabel = localizedLabel(labels, locale) ?? label;
          const summary = summaries.get(key);
          const names = new Set(
            summary?.subCategories?.map(({ name }) => name),
          );
          const subcategoryRows = Object.entries(subcategories ?? {})
            .filter(
              ([name, sub]) =>
                names.has(name) &&
                (sub.defaultEntryAlias !== undefined ||
                  (localizedLabel(sub.labels, locale) ?? sub.label) !==
                    categoryLabel),
            )
            .toSorted((a, b) => a[1].order - b[1].order);
          return (
            <Div key={key} className="flex flex-col">
              {navRow(
                categoryLabel,
                !activeDocument &&
                  currentCategory === key &&
                  !subcategoryRows.some(
                    ([name]) => name === currentSubcategory,
                  ),
                () =>
                  onSelect(
                    key,
                    undefined,
                    defaultEntryAlias && available.has(defaultEntryAlias)
                      ? defaultEntryAlias
                      : undefined,
                  ),
                "group",
              )}
              {key === "purchasing" &&
                purchaseLinks.map(({ key: link, alias }) => (
                  <Div key={alias}>
                    {navRow(
                      t(`erp.navigation.${link}`),
                      currentAlias === alias,
                      () => onOpenTool(alias),
                      "item",
                    )}
                  </Div>
                ))}
              {subcategoryRows.map(([name, sub]) => (
                <Div key={name}>
                  {navRow(
                    localizedLabel(sub.labels, locale) ?? sub.label,
                    !activeDocument &&
                      currentCategory === key &&
                      currentSubcategory === name,
                    () =>
                      onSelect(
                        key,
                        name,
                        sub.defaultEntryAlias &&
                          available.has(sub.defaultEntryAlias)
                          ? sub.defaultEntryAlias
                          : undefined,
                      ),
                    "item",
                  )}
                </Div>
              ))}
            </Div>
          );
        })}
      </Div>
      <Div className="flex flex-col gap-1 border-t px-3 py-2">
        {navRow(t("catalog.allTools"), false, onAllTools)}
        {instances}
      </Div>
    </Nav>
  );
}
