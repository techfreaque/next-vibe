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
  DEFAULT_CHARACTERS,
  getCharactersByCategory,
} from "@/app/api/[locale]/agent/chat/characters/config";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { modelOptions } from "@/app/api/[locale]/agent/models/models";
import { Icon } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { useIsMobile } from "@/hooks/use-media-query";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CATEGORY_CONFIG, CharacterCategory } from "../enum";
import { CharactersRepositoryClient } from "../repository-client";

interface CharacterBrowserProps {
  onAddWithDefaults: (characterId: string) => void;
  onCustomize: (characterId: string) => void;
  onCreateCustom?: () => void;
  onBack?: () => void;
  locale: CountryLanguage;
  /** Favorites list to track which characters are already added */
  favorites?: FavoriteCard[];
}

/**
 * Character list item component - shows character info with description and model
 */
export function CharacterListItem({
  character,
  onAdd,
  onCustomize,
  locale,
  isAdded = false,
}: {
  character: Character;
  onAdd: () => void;
  onCustomize?: () => void;
  locale: CountryLanguage;
  isAdded?: boolean;
}): JSX.Element {
  const { t } = simpleT(locale);
  const isTouchDevice = useIsMobile();

  const allModels = useMemo(() => Object.values(modelOptions), []);
  const bestModel = useMemo(() => {
    return CharactersRepositoryClient.resolveModelForSelection(character.modelSelection, allModels);
  }, [allModels, character]);

  return (
    <Div
      className={cn(
        "relative flex items-start gap-3 p-3 rounded-xl border transition-all",
        "hover:bg-muted/50 hover:border-primary/20 cursor-pointer group",
        isAdded && "border-primary bg-primary/5",
      )}
      onClick={onCustomize ?? onAdd}
    >
      {/* Quick Actions floating on top - always visible on touch devices, hover on desktop */}
      <Div
        className={cn(
          "absolute top-2 right-2 z-10 flex items-center gap-1.5 transition-opacity",
          isTouchDevice ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        {onCustomize && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              onCustomize();
            }}
            title={t("app.chat.selector.customizeSettings")}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant={isAdded ? "secondary" : "default"}
          size="sm"
          className="h-8 px-3"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          disabled={isAdded}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {isAdded ? t("app.api.agent.chat.selector.added") : t("app.api.agent.chat.selector.add")}
        </Button>
      </Div>

      {/* Character Icon */}
      <Div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
        <Icon icon={character.icon} className="h-5 w-5" />
      </Div>

      {/* Main Info - Full Width */}
      <Div className="flex-1 min-w-0">
        <Div className="font-medium text-base pr-2">{t(character.name)}</Div>
        <Div className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
          {t(character.description)}
        </Div>
        {/* Model info row */}
        <Div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 mt-1.5">
          {bestModel && (
            <>
              <Icon icon={bestModel.icon} className="h-3 w-3" />
              <Span className="truncate">{bestModel.name}</Span>
              <Span className="text-muted-foreground/40">•</Span>
              <Span className="shrink-0">
                {CharactersRepositoryClient.formatCreditCost(bestModel.creditCost, t)}
              </Span>
            </>
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Category section component
 */
export function CategorySection({
  category,
  characters,
  onAdd,
  onCustomize,
  onExpand,
  expanded,
  locale,
  addedCharacterIds,
}: {
  category: (typeof CharacterCategory)[keyof typeof CharacterCategory];
  characters: readonly Character[];
  onAdd: (characterId: string) => void;
  onCustomize: (characterId: string) => void;
  onExpand?: () => void;
  expanded: boolean;
  locale: CountryLanguage;
  addedCharacterIds?: Set<string>;
}): JSX.Element {
  const { t } = simpleT(locale);
  const config = CATEGORY_CONFIG[category];

  const displayCharacters = expanded ? characters : characters.slice(0, 3);
  const hasMore = !expanded && characters.length > 3;

  return (
    <Div className="flex flex-col gap-2">
      {/* Category header */}
      <Div className="flex items-center gap-2 px-1">
        <Icon icon={config.icon} className="h-4 w-4 text-muted-foreground" />
        <Span className="font-medium text-sm">{t(config.label)}</Span>
        <Badge variant="outline" className="text-[10px] h-5">
          {characters.length}
        </Badge>
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
            isAdded={addedCharacterIds?.has(character.id) ?? false}
          />
        ))}

        {/* Show more card */}
        {hasMore && onExpand && (
          <Div
            onClick={onExpand}
            className={cn(
              "flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed",
              "cursor-pointer transition-all hover:bg-muted/50 hover:border-primary/30",
              "text-muted-foreground hover:text-foreground",
            )}
          >
            <ChevronRight className="h-4 w-4" />
            <Span className="text-sm font-medium">
              {t("app.chat.selector.showMore", {
                count: characters.length - 3,
              })}
            </Span>
          </Div>
        )}
      </Div>
    </Div>
  );
}

interface CharacterBrowserCoreProps {
  onAdd: (characterId: string) => void;
  onCustomize: (characterId: string) => void;
  favorites: FavoriteCard[];
  locale: CountryLanguage;
  searchQuery?: string;
  hideCompanions?: boolean;
}

/**
 * Core character browser logic and rendering - shared between full browser and onboarding
 */
export function CharacterBrowserCore({
  onAdd,
  onCustomize,
  favorites,
  locale,
  searchQuery = "",
  hideCompanions = false,
}: CharacterBrowserCoreProps): JSX.Element {
  const { t } = simpleT(locale);
  const [expandedCategories, setExpandedCategories] = useState<
    Set<(typeof CharacterCategory)[keyof typeof CharacterCategory]>
  >(new Set());

  // Calculate which characters are already added to favorites (non-customized)
  const addedCharacterIds = useMemo(
    () => CharactersRepositoryClient.getDefaultFavoriteCharacterIds(favorites),
    [favorites],
  );

  // Get all categories with their characters
  const categoriesWithCharacters = useMemo(() => {
    const categories = Object.values(CharacterCategory);
    return categories
      .map((category) => ({
        category,
        characters: getCharactersByCategory(category),
      }))
      .filter((item) => item.characters.length > 0);
  }, []);

  // Filter by search
  const searchFilteredCharacters = useMemo(() => {
    if (!searchQuery) {
      return null;
    }

    const query = searchQuery.toLowerCase();
    return [...DEFAULT_CHARACTERS].filter(
      (p) =>
        t(p.name).toLowerCase().includes(query) || t(p.description).toLowerCase().includes(query),
    );
  }, [searchQuery, t]);

  const handleCategoryExpand = useCallback(
    (category: (typeof CharacterCategory)[keyof typeof CharacterCategory]) => {
      setExpandedCategories((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
          newSet.delete(category);
        } else {
          newSet.add(category);
        }
        return newSet;
      });
    },
    [],
  );

  return searchFilteredCharacters ? (
    // Search results
    <>
      <Div className="flex flex-col gap-3 p-4">
        <Span className="text-xs text-muted-foreground px-1">
          {t("app.chat.selector.searchResults", {
            count: searchFilteredCharacters.length,
          })}
        </Span>
        {searchFilteredCharacters.length > 0 ? (
          <Div className="flex flex-col gap-1">
            {searchFilteredCharacters.map((character) => (
              <CharacterListItem
                key={character.id}
                character={character}
                onAdd={() => onAdd(character.id)}
                onCustomize={() => onCustomize(character.id)}
                locale={locale}
                isAdded={addedCharacterIds?.has(character.id) ?? false}
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
    </>
  ) : (
    // Category browser
    <Div className="flex flex-col gap-5 p-4">
      {categoriesWithCharacters
        .filter((item) => {
          // Filter out companions if hideCompanions is true
          if (hideCompanions && item.category === CharacterCategory.COMPANION) {
            return false;
          }
          return true;
        })
        .map((item, index) => {
          // Add separator before roleplay and controversial sections
          const needsSeparatorBefore =
            item.category === CharacterCategory.ROLEPLAY ||
            (item.category === CharacterCategory.CONTROVERSIAL &&
              !categoriesWithCharacters.some((c) => c.category === CharacterCategory.ROLEPLAY));

          return (
            <Div key={item.category} className="flex flex-col gap-5">
              {needsSeparatorBefore && index > 0 && <Separator />}
              <CategorySection
                category={item.category}
                characters={item.characters}
                onAdd={onAdd}
                onCustomize={onCustomize}
                onExpand={() => handleCategoryExpand(item.category)}
                expanded={expandedCategories.has(item.category)}
                locale={locale}
                addedCharacterIds={addedCharacterIds}
              />
              {/* Separator after companions */}
              {item.category === CharacterCategory.COMPANION &&
                index < categoriesWithCharacters.length - 1 && <Separator />}
            </Div>
          );
        })}
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
  favorites = [],
}: CharacterBrowserProps): JSX.Element {
  const { t } = simpleT(locale);
  const [searchQuery, setSearchQuery] = useState("");

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
          {onCreateCustom && (
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
          )}
        </Div>
      </Div>

      {/* Scrollable content with core */}
      <Div className="flex-1 overflow-y-auto min-h-0">
        <CharacterBrowserCore
          onAdd={onAddWithDefaults}
          onCustomize={onCustomize}
          favorites={favorites}
          locale={locale}
          searchQuery={searchQuery}
        />
      </Div>
    </Div>
  );
}
