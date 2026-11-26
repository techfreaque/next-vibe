"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Home } from "next-vibe/ui/components/icons/Home";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import type { JSX, ReactNode } from "react";

import { ADMIN_GROUPS } from "@/generated/categories/registry";

import { Icon } from "../unified-ui/widgets/form-fields/icon-field/icon-component";
import { groupVisibleCategories } from "./admin-catalog-model";
import type { CategoryDefinitionSerialized } from "./category-types";
import type { HelpGetResponseOutput } from "./definition";
import type { HelpT } from "./i18n";

export function PlatformAdminNav({
  t,
  locale,
  registry,
  summaries,
  landings,
  activeCategory,
  homeActive,
  onHome,
  onSelectCategory,
  onOpenTool,
  onAllTools,
  company,
  instances,
}: {
  t: HelpT;
  locale: CountryLanguage;
  registry: ReadonlyMap<string, CategoryDefinitionSerialized>;
  summaries: NonNullable<HelpGetResponseOutput["webCategories"]>;
  landings?: HelpGetResponseOutput["adminCategoryLandings"];
  activeCategory?: string;
  homeActive: boolean;
  onHome: () => void;
  onSelectCategory: (category: string) => void;
  onOpenTool: (alias: string) => void;
  onAllTools: () => void;
  company?: ReactNode;
  instances?: ReactNode;
}): JSX.Element {
  const groups = groupVisibleCategories(
    summaries,
    registry,
    ADMIN_GROUPS,
    locale,
  );
  return (
    <Nav
      id="platform-admin-navigation"
      className="flex h-full min-h-0 flex-col bg-card/60"
    >
      {company && (
        <Div className="w-full min-w-0 border-b px-3 py-2">{company}</Div>
      )}
      <Div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`min-h-10 justify-start gap-2 ${homeActive ? "bg-accent font-semibold text-primary" : "font-medium"}`}
          aria-current={homeActive ? "page" : undefined}
          onClick={onHome}
        >
          <Home className="size-4 shrink-0" aria-hidden="true" />{" "}
          {t("erp.home")}
        </Button>
        {groups.map(({ group, categories }) => (
          <Div key={group ?? "other"} className="flex min-w-0 flex-col gap-1">
            <Span className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group ? t(`groups.${group}`) : t("uncategorized")}
            </Span>
            {categories.map(({ name, label, metadata }) => (
              <Div key={name} className="min-w-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-current={activeCategory === name ? "page" : undefined}
                  className={`h-auto min-h-9 w-full min-w-0 justify-start gap-2 whitespace-normal px-2 text-start ${activeCategory === name ? "bg-accent font-semibold text-primary" : "font-normal"}`}
                  onClick={() => onSelectCategory(name)}
                >
                  {metadata?.icon && (
                    <Icon
                      icon={metadata.icon}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                  )}
                  <Span className="min-w-0 break-words">{label}</Span>
                </Button>
                {activeCategory === name &&
                landings?.[name]?.destinations.length ? (
                  <Div className="ml-4 border-l pl-2">
                    {landings[name].destinations.map(({ alias, title }) => (
                      <Button
                        key={alias}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto min-h-9 w-full justify-start whitespace-normal text-start font-normal"
                        onClick={() => onOpenTool(alias)}
                      >
                        {title}
                      </Button>
                    ))}
                  </Div>
                ) : null}
              </Div>
            ))}
          </Div>
        ))}
      </Div>
      <Div className="flex shrink-0 flex-col gap-2 border-t bg-card px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-h-10 justify-start gap-2 font-medium"
          onClick={() => onAllTools()}
        >
          <Layers className="size-4 shrink-0" aria-hidden="true" />
          {t("catalog.allTools")}
        </Button>
        {instances}
      </Div>
    </Nav>
  );
}
