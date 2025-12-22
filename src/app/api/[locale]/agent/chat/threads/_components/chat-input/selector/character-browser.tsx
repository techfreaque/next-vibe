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

import {
  type Character,
  CharacterCategory,
  DEFAULT_CHARACTERS,
  getCharactersByCategory,
} from "@/app/api/[locale]/agent/chat/characters/config";
import { CATEGORY_CONFIG } from "@/app/api/[locale]/agent/chat/characters/utils";
import {
  ContentLevelFilter,
  type ContentLevelFilterValue,
  IntelligenceLevelFilter,
  type IntelligenceLevelFilterValue,
  PriceLevelFilter,
} from "@/app/api/[locale]/agent/chat/favorites/enum";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { modelOptions } from "@/app/api/[locale]/agent/chat/model-access/models";
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
 * Get default intelligence from character preferences
 */
function getDefaultIntelligence(
  character: Character,
): typeof IntelligenceLevelFilterValue {
  if (character.preferences?.preferredStrengths) {
    const { ModelUtility } = require("@/app/api/[locale]/agent/chat/types");
    if (character.preferences.preferredStrengths.includes(ModelUtility.SMART)) {
      return IntelligenceLevelFilter.BRILLIANT;
    }
    if (character.preferences.preferredStrengths.includes(ModelUtility.FAST)) {
      return IntelligenceLevelFilter.QUICK;
    }
  }
  return IntelligenceLevelFilter.SMART;
}

/**
 * Get default content from character requirements
 */
function getDefaultContent(
  character: Character,
): typeof ContentLevelFilterValue {
  if (character.requirements?.minContent) {
    return character.requirements.minContent;
  }
  return ContentLevelFilter.OPEN;
}

/**
 * Character list item component - shows character info with description and model
 */
function CharacterListItem({
  character,
  onAdd,
  onCustomize,
  locale,
}: {
  character: Character;
  onAdd: () => void;
  onCustomize: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const Icon = getIconComponent(character.icon);

  const defaultIntelligence = getDefaultIntelligence(character);
  const defaultContent = getDefaultContent(character);

  const allModels = useMemo(() => Object.values(modelOptions), []);
  const bestModel = useMemo(
    () =>
      findBestModel(allModels, character, {
        intelligence: defaultIntelligence,
        maxPrice: PriceLevelFilter.STANDARD,
        minContent: defaultContent,
      }),
    [allModels, character, defaultIntelligence, defaultContent],
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
        <Span className="font-medium text-sm">{t(character.name)}</Span>
        <Div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {t(character.description)}
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
                    : t("app.chat.selector.creditsExact", {
                        cost: bestModel.creditCost,
                      })}
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
  characters,
  onAdd,
  onCustomize,
  onExpand,
  expanded,
  locale,
}: {
  category: (typeof CharacterCategory)[keyof typeof CharacterCategory];
  characters: readonly Character[];
  onAdd: (characterId: string) => void;
  onCustomize: (characterId: string) => void;
  onExpand?: () => void;
  expanded: boolean;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const config = CATEGORY_CONFIG[category];
  const CategoryIcon = getIconComponent(config.icon);

  const displayCharacters = expanded ? characters : characters.slice(0, 3);
  const hasMore = !expanded && characters.length > 3;

  return (
    <Div className="flex flex-col gap-2">
      {/* Category header */}
      <Div className="flex items-center justify-between px-1">
        <Div className="flex items-center gap-2">
          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
          <Span className="font-medium text-sm">{t(config.label)}</Span>
          <Badge variant="outline" className="text-[10px] h-5">
            {characters.length}
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
        {displayCharacters.map((character) => (
          <CharacterListItem
            key={character.id}
            character={character}
            onAdd={() => onAdd(character.id)}
            onCustomize={() => onCustomize(character.id)}
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
    (typeof CharacterCategory)[keyof typeof CharacterCategory] | null
  >(null);

  // Get characters by category
  const companionCharacters = useMemo(
    () => getCharactersByCategory(CharacterCategory.COMPANION),
    [],
  );
  const codingCharacters = useMemo(
    () => getCharactersByCategory(CharacterCategory.CODING),
    [],
  );
  const writingCharacters = useMemo(
    () => getCharactersByCategory(CharacterCategory.WRITING),
    [],
  );
  const analysisCharacters = useMemo(
    () => getCharactersByCategory(CharacterCategory.ANALYSIS),
    [],
  );
  const roleplayCharacters = useMemo(
    () => getCharactersByCategory(CharacterCategory.ROLEPLAY),
    [],
  );
  const controversialCharacters = useMemo(
    () => getCharactersByCategory(CharacterCategory.CONTROVERSIAL),
    [],
  );

  // Filter by search
  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) {
      return null;
    }

    const query = searchQuery.toLowerCase();
    return [...DEFAULT_CHARACTERS].filter(
      (p) =>
        t(p.name).toLowerCase().includes(query) ||
        t(p.description).toLowerCase().includes(query),
    );
  }, [searchQuery, t]);

  const handleCategoryExpand = useCallback(
    (category: (typeof CharacterCategory)[keyof typeof CharacterCategory]) => {
      setExpandedCategory(expandedCategory === category ? null : category);
    },
    [expandedCategory],
  );

  // If a category is expanded, show only that category
  if (expandedCategory) {
    const characters = getCharactersByCategory(expandedCategory);
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
              {characters.length}
            </Badge>
          </Div>
        </Div>

        {/* List */}
        <Div className="flex-1 overflow-y-auto p-4">
          <Div className="flex flex-col gap-1">
            {characters.map((character) => (
              <CharacterListItem
                key={character.id}
                character={character}
                onAdd={() => onAddWithDefaults(character.id)}
                onCustomize={() => onCustomize(character.id)}
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
            <Span className="hidden sm:inline">
              {t("app.chat.selector.createCustom")}
            </Span>
          </Button>
        </Div>
      </Div>

      {/* Scrollable content */}
      <Div className="flex-1 overflow-y-auto p-4">
        {filteredCharacters ? (
          // Search results
          <Div className="flex flex-col gap-3">
            <Span className="text-xs text-muted-foreground px-1">
              {t("app.chat.selector.searchResults", {
                count: filteredCharacters.length,
              })}
            </Span>
            {filteredCharacters.length > 0 ? (
              <Div className="flex flex-col gap-1">
                {filteredCharacters.map((character) => (
                  <CharacterListItem
                    key={character.id}
                    character={character}
                    onAdd={() => onAddWithDefaults(character.id)}
                    onCustomize={() => onCustomize(character.id)}
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
            {companionCharacters.length > 0 && (
              <CategorySection
                category={CharacterCategory.COMPANION}
                characters={companionCharacters}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() =>
                  handleCategoryExpand(CharacterCategory.COMPANION)
                }
                expanded={false}
                locale={locale}
              />
            )}

            <Separator />

            {/* Expert categories */}
            {codingCharacters.length > 0 && (
              <CategorySection
                category={CharacterCategory.CODING}
                characters={codingCharacters}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() => handleCategoryExpand(CharacterCategory.CODING)}
                expanded={false}
                locale={locale}
              />
            )}

            {writingCharacters.length > 0 && (
              <CategorySection
                category={CharacterCategory.WRITING}
                characters={writingCharacters}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() => handleCategoryExpand(CharacterCategory.WRITING)}
                expanded={false}
                locale={locale}
              />
            )}

            {analysisCharacters.length > 0 && (
              <CategorySection
                category={CharacterCategory.ANALYSIS}
                characters={analysisCharacters}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() =>
                  handleCategoryExpand(CharacterCategory.ANALYSIS)
                }
                expanded={false}
                locale={locale}
              />
            )}

            {/* Roleplay section */}
            {roleplayCharacters.length > 0 && (
              <>
                <Separator />
                <CategorySection
                  category={CharacterCategory.ROLEPLAY}
                  characters={roleplayCharacters}
                  onAdd={onAddWithDefaults}
                  onCustomize={onCustomize}
                  onExpand={() =>
                    handleCategoryExpand(CharacterCategory.ROLEPLAY)
                  }
                  expanded={false}
                  locale={locale}
                />
              </>
            )}

            {/* Controversial section */}
            {controversialCharacters.length > 0 && (
              <CategorySection
                category={CharacterCategory.CONTROVERSIAL}
                characters={controversialCharacters}
                onAdd={onAddWithDefaults}
                onCustomize={onCustomize}
                onExpand={() =>
                  handleCategoryExpand(CharacterCategory.CONTROVERSIAL)
                }
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
