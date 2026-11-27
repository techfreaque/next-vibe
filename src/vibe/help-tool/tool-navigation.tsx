"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Home } from "next-vibe/ui/components/icons/Home";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import type { JSX, ReactNode } from "react";
import { createContext } from "react";

import { ADMIN_GROUPS } from "@/generated/categories/registry";

import { cn } from "../unified-ui/_shared/cn";
import { Icon } from "../unified-ui/widgets/form-fields/icon-field/icon-component";
import {
  groupVisibleCategories,
  orderSubcategories,
} from "./admin-catalog-model";
import type { CategoryDefinitionSerialized } from "./category-types";
import type { HelpGetResponseOutput } from "./definition";
import type { HelpT } from "./i18n";

export const ChatToolNavigationContext = createContext(false);

export function ToolNavigation({
  t,
  locale,
  registry,
  summaries,
  activeCategory,
  activeSubCategory,
  homeActive,
  onHome,
  onSelectCategory,
  controls,
  primaryTools,
  selectedTool,
  onOpenTool,
  instances,
  id,
}: {
  t: HelpT;
  locale: CountryLanguage;
  registry: ReadonlyMap<string, CategoryDefinitionSerialized>;
  summaries: NonNullable<HelpGetResponseOutput["webCategories"]>;
  activeCategory?: string;
  activeSubCategory?: string;
  homeActive: boolean;
  onHome: () => void;
  onSelectCategory: (category: string, subCategory?: string) => void;
  controls?: ReactNode;
  primaryTools?: readonly { alias: string; title: string }[];
  selectedTool?: string;
  onOpenTool?: (alias: string) => void;
  instances?: ReactNode;
  id: string;
}): JSX.Element {
  const groups = groupVisibleCategories(
    summaries,
    registry,
    ADMIN_GROUPS,
    locale,
  );
  return (
    <Nav
      id={id}
      aria-label={t("catalog.navigation")}
      className="flex h-full min-h-0 flex-col bg-card"
    >
      <Div className="flex shrink-0 flex-col gap-2 border-b px-3 py-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "min-h-10 justify-start gap-2",
            homeActive && "bg-accent font-semibold text-primary",
          )}
          aria-current={homeActive ? "page" : undefined}
          onClick={onHome}
        >
          <Home className="size-4 shrink-0" aria-hidden="true" />
          {t("erp.home")}
        </Button>
        {controls}
      </Div>
      <Div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
        {groups.map(({ group, categories }) => (
          <Div key={group ?? "other"} className="flex min-w-0 flex-col gap-0.5">
            <Span className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group ? t(`groups.${group}`) : t("uncategorized")}
            </Span>
            {categories.map(({ name, label, metadata }) => {
              const active = activeCategory === name;
              const subcategories = active
                ? orderSubcategories(
                    summaries
                      .find((summary) => summary.name === name)
                      ?.subCategories?.filter(
                        (section) => section.name !== name,
                      ) ?? [],
                    metadata,
                    locale,
                  )
                : [];
              return (
                <Div key={name} className="min-w-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-current={
                      active ? (activeSubCategory ? "true" : "page") : undefined
                    }
                    className={cn(
                      "h-auto min-h-10 w-full min-w-0 justify-start gap-2 whitespace-normal px-2 text-start font-normal",
                      active && "bg-accent font-semibold text-primary",
                    )}
                    onClick={() => onSelectCategory(name)}
                  >
                    {metadata?.icon && (
                      <Icon
                        icon={metadata.icon}
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                    )}
                    <Span className="min-w-0 flex-1 break-words">{label}</Span>
                    {subcategories.length > 0 && (
                      <ChevronRight
                        className="size-3.5 shrink-0 rotate-90"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                  {active &&
                    onOpenTool &&
                    primaryTools &&
                    primaryTools.length > 0 && (
                      <Div className="ml-4 mt-1 border-l pl-2">
                        {primaryTools.slice(0, 3).map(({ alias, title }) => (
                          <Button
                            key={alias}
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-current={
                              selectedTool === alias ? "page" : undefined
                            }
                            className={cn(
                              "h-auto min-h-9 w-full justify-start whitespace-normal px-2 text-start text-xs font-normal",
                              selectedTool === alias &&
                                "bg-accent font-semibold text-primary",
                            )}
                            onClick={() => onOpenTool(alias)}
                          >
                            {title}
                          </Button>
                        ))}
                      </Div>
                    )}
                  {subcategories.length > 0 && (
                    <Div className="mb-2 ml-4 mt-1 border-l pl-2">
                      {subcategories.map(({ name: sub, label: subLabel }) => (
                        <Button
                          key={sub}
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-current={
                            activeSubCategory === sub ? "page" : undefined
                          }
                          className={cn(
                            "h-auto min-h-9 w-full justify-start whitespace-normal px-2 text-start text-xs font-normal",
                            activeSubCategory === sub &&
                              "bg-accent font-semibold text-primary",
                          )}
                          onClick={() => onSelectCategory(name, sub)}
                        >
                          {subLabel}
                        </Button>
                      ))}
                    </Div>
                  )}
                </Div>
              );
            })}
          </Div>
        ))}
      </Div>
      {instances && (
        <Div className="shrink-0 border-t px-3 py-2">{instances}</Div>
      )}
    </Nav>
  );
}
