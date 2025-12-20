"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { Input } from "next-vibe-ui/ui/input";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { modelOptions } from "@/app/api/[locale]/agent/chat/model-access/models";
import {
  DEFAULT_PERSONAS,
  getPersonasByCategory,
  type Persona,
  PersonaCategory,
} from "@/app/api/[locale]/agent/chat/personas/config";
import { CATEGORY_CONFIG } from "@/app/api/[locale]/agent/chat/personas/utils";
import {
  type ContentLevel,
  type IntelligenceLevel,
} from "@/app/api/[locale]/agent/chat/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { findBestModel } from "./types";

interface CharacterBrowserProps {
  onAddWithDefaults: (characterId: string) => void;
  onCustomize: (characterId: string) => void;
  onCreateCustom: () => void;
  onBack?: () => void;
  locale: CountryLanguage;
}

/**
 * Get default intelligence from persona preferences
 */
function getDefaultIntelligence(persona: Persona): IntelligenceLevel {
  if (persona.preferences?.preferredStrengths) {
    const { ModelUtility } = require("@/app/api/[locale]/agent/chat/types");
    if (persona.preferences.preferredStrengths.includes(ModelUtility.SMART)) {
      return "brilliant";
    }
    if (persona.preferences.preferredStrengths.includes(ModelUtility.FAST)) {
      return "quick";
    }
  }
  return "smart";
}

/**
 * Get default content from persona requirements
 */
function getDefaultContent(persona: Persona): ContentLevel {
  if (persona.requirements?.minContent) {
    return persona.requirements.minContent;
  }
  return "open";
}

/**
 * Character list item component - shows persona info with description and model
 */
function CharacterListItem({
  persona,
  onAdd,
  onCustomize,
  locale,
}: {
  persona: Persona;
  onAdd: () => void;
  onCustomize: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const Icon = getIconComponent(persona.icon);

  const defaultIntelligence = getDefaultIntelligence(persona);
  const defaultContent = getDefaultContent(persona);

  const allModels = useMemo(() => Object.values(modelOptions), []);
  const bestModel = useMemo(
    () =>
      findBestModel(allModels, persona, {
        intelligence: defaultIntelligence,
        maxPrice: "standard",
        minContent: defaultContent,
      }),
    [allModels, persona, defaultIntelligence, defaultContent],
  );

  const ModelIcon = bestModel ? getIconComponent(bestModel.icon) : null;

  return (
    <Div
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl border transition-all",
        "hover:bg-muted/50 hover:border-primary/20 cursor-pointer group",
      )}
      onClick={onAdd}
    >
      {/* Character Icon */}
      <Div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
        <Icon className="h-5 w-5" />
      </Div>

      {/* Main Info */}
      <Div className="flex-1 min-w-0">
        <Span className="font-medium text-sm">{t(persona.name)}</Span>
        <Div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {t(persona.description)}
        </Div>
        {/* Model info row */}
        <Div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 mt-1.5">
          {bestModel && (
            <>
              {ModelIcon && <ModelIcon className="h-3 w-3" />}
              <Span className="truncate">{bestModel.name}</Span>
              <Span className="text-muted-foreground/40">•</Span>
              <Span className="shrink-0">
                {bestModel.creditCost === 0
                  ? t("app.chat.selector.free")
                  : bestModel.creditCost === 1
                    ? t("app.chat.selector.creditsSingle")
                    : t("app.chat.selector.creditsExact", { cost: bestModel.creditCost })}
              </Span>
            </>
          )}
        </Div>
      </Div>

      {/* Quick Actions - always visible on mobile, hover on desktop */}
      <Div className="flex items-center gap-1.5 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onCustomize();
          }}
          title={t("app.chat.selector.customizeSettings")}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="h-8 px-3"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {t("app.chat.selector.add")}
        </Button>
      </Div>
    </Div>
  );
}

/**
 * Category section component
 */
function CategorySection({
  category,
  personas,
  onAdd,
  onCustomize,
  onExpand,
  expanded,
  locale,
}: {
  category: typeof PersonaCategory[keyof typeof PersonaCategory];
  personas: readonly Persona[];
  onAdd: (characterId: string) => void;
  onCustomize: (characterId: string) => void;
  onExpand?: () => void;
  expanded: boolean;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const config = CATEGORY_CONFIG[category];
  const CategoryIcon = getIconComponent(config.icon);

  const displayPersonas = expanded ? personas : personas.slice(0, 3);
  const hasMore = !expanded && personas.length > 3;

  return (
    <Div className="flex flex-col gap-2">
      {/* Category header */}
      <Div className="flex items-center justify-between px-1">
        <Div className="flex items-center gap-2">
          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
          <Span className="font-medium text-sm">{t(config.label)}</Span>
          <Badge variant="outline" className="text-[10px] h-5">
            {personas.length}
          </Badge>
        </Div>
        {hasMore && onExpand && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="h-7 text-xs"
          >
            {t("app.chat.selector.seeAll")}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </Div>

      {/* Character list */}
      <Div className="flex flex-col gap-1">
        {displayPersonas.map((persona) => (
          <CharacterListItem
            key={persona.id}
            persona={persona}
            onAdd={() => onAdd(persona.id)}
            onCustomize={() => onCustomize(persona.id)}
            locale={locale}
          />
        ))}
      </Div>
    </Div>
  );
}

/**
 * Character browser component - modal for adding new favorites
 */
export function CharacterBrowser({
  onAddWithDefaults,
  onCustomize,
  onCreateCustom,
  onBack,
  locale,
}: CharacterBrowserProps): JSX.Element {
  const { t } = simpleT(locale);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<
    typeof PersonaCategory[keyof typeof PersonaCategory] | null
  >(null);

  // Get personas by category
  const companionPersonas = useMemo(() => getPersonasByCategory(PersonaCategory.COMPANION), []);
  const codingPersonas = useMemo(() => getPersonasByCategory(PersonaCategory.CODING), []);
  const writingPersonas = useMemo(() => getPersonasByCategory(PersonaCategory.WRITING), []);
  const analysisPersonas = useMemo(() => getPersonasByCategory(PersonaCategory.ANALYSIS), []);
  const roleplayPersonas = useMemo(() => getPersonasByCategory(PersonaCategory.ROLEPLAY), []);
  const controversialPersonas = useMemo(() => getPersonasByCategory(PersonaCategory.CONTROVERSIAL), []);

  // Filter by search
  const filteredPersonas = useMemo(() => {
    if (!searchQuery.trim()) {
      return null;
    }

    const query = searchQuery.toLowerCase();
    return [...DEFAULT_PERSONAS].filter(
      (p) =>
        t(p.name).toLowerCase().includes(query) ||
        t(p.description).toLowerCase().includes(query),
    );
  }, [searchQuery, t]);

  const handleCategoryExpand = useCallback(
    (category: typeof PersonaCategory[keyof typeof PersonaCategory]) => {
      setExpandedCategory(expandedCategory === category ? null : category);
    },
    [expandedCategory],
  );

  // If a category is expanded, show only that category
  if (expandedCategory) {
    const personas = getPersonasByCategory(expandedCategory);
    const config = CATEGORY_CONFIG[expandedCategory];
    const CategoryIcon = getIconComponent(config.icon);

    return (
      <Div className="flex flex-col max-h-[70vh] overflow-hidden">
        {/* Header */}
        <Div className="flex items-center gap-3 p-4 border-b bg-card shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setExpandedCategory(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Div className="flex items-center gap-2">
            <CategoryIcon className="h-5 w-5" />
            <Span className="font-medium">{t(config.label)}</Span>
            <Badge variant="outline" className="text-[10px] h-5">
              {personas.length}
            </Badge>
          </Div>
        </Div>

        {/* List */}
        <Div className="flex-1 overflow-y-auto p-4">
          <Div className="flex flex-col gap-1">
            {personas.map((persona) => (
              <CharacterListItem
                key={persona.id}
                persona={persona}
                onAdd={() => onAddWithDefaults(persona.id)}
                onCustomize={() => onCustomize(persona.id)}
                locale={locale}
              />
            ))}
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col max-h-[70vh] overflow-hidden">
      {/* Header with search and create custom */}
      <Div className="flex flex-col gap-2 p-4 border-b bg-card shrink-0">
        <Div className="flex items-center gap-3">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("app.chat.selector.searchCharacters")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </Div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCreateCustom}
            className="h-9 gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <Span className="hidden sm:inline">{t("app.chat.selector.createCustom")}</Span>
          </Button>
        </Div>
      </Div>

      {/* Scrollable content */}
      <Div className="flex-1 overflow-y-auto p-4">
        {filteredPersonas ? (
          // Search results
          <Div className="flex flex-col gap-3">
            <Span className="text-xs text-muted-foreground px-1">
              {t("app.chat.selector.searchResults", { count: filteredPersonas.length })}
            </Span>
            {filteredPersonas.length > 0 ? (
              <Div className="flex flex-col gap-1">
                {filteredPersonas.map((persona) => (
                  <CharacterListItem
                    key={persona.id}
                    persona={persona}
                    onAdd={() => onAddWithDefaults(persona.id)}
                    onCustomize={() => onCustomize(persona.id)}
                    locale={locale}
                  />
                ))}
              </Div>
            ) : (
              <Div className="flex flex-col items-center justify-center py-8 text-center">
                <Span className="text-sm text-muted-foreground">
                  {t("app.chat.selector.noResults")}
                </Span>
              </Div>
            )}
          </Div>
        ) : (
          // Category browser
          <Div className="flex flex-col gap-5">
            {/* Companions - primary */}
            {companionPersonas.length > 0 && (
              <CategorySection
                category={PersonaCategory.COMPANION}
                personas={companionPersonas}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() => handleCategoryExpand(PersonaCategory.COMPANION)}
                expanded={false}
                locale={locale}
              />
            )}

            <Separator />

            {/* Expert categories */}
            {codingPersonas.length > 0 && (
              <CategorySection
                category={PersonaCategory.CODING}
                personas={codingPersonas}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() => handleCategoryExpand(PersonaCategory.CODING)}
                expanded={false}
                locale={locale}
              />
            )}

            {writingPersonas.length > 0 && (
              <CategorySection
                category={PersonaCategory.WRITING}
                personas={writingPersonas}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() => handleCategoryExpand(PersonaCategory.WRITING)}
                expanded={false}
                locale={locale}
              />
            )}

            {analysisPersonas.length > 0 && (
              <CategorySection
                category={PersonaCategory.ANALYSIS}
                personas={analysisPersonas}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() => handleCategoryExpand(PersonaCategory.ANALYSIS)}
                expanded={false}
                locale={locale}
              />
            )}

            {/* Roleplay section */}
            {roleplayPersonas.length > 0 && (
              <>
                <Separator />
                <CategorySection
                  category={PersonaCategory.ROLEPLAY}
                  personas={roleplayPersonas}
                  onAdd={onAddWithDefaults}
                  onCustomize={onCustomize}
                  onExpand={() => handleCategoryExpand(PersonaCategory.ROLEPLAY)}
                  expanded={false}
                  locale={locale}
                />
              </>
            )}

            {/* Controversial section */}
            {controversialPersonas.length > 0 && (
              <CategorySection
                category={PersonaCategory.CONTROVERSIAL}
                personas={controversialPersonas}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() => handleCategoryExpand(PersonaCategory.CONTROVERSIAL)}
                expanded={false}
                locale={locale}
              />
            )}
          </Div>
        )}
      </Div>
    </Div>
  );
}
