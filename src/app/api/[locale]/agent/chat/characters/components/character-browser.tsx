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

import { NO_CHARACTER } from "@/app/api/[locale]/agent/chat/characters/config";
import type { CharacterListItem as CharacterListItemType } from "@/app/api/[locale]/agent/chat/characters/definition";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import {
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useIsMobile } from "@/hooks/use-media-query";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CATEGORY_CONFIG, CharacterCategory } from "../enum";
import { useCharacters } from "../hooks";

interface CharacterBrowserProps {
  onAddWithDefaults: (characterId: string) => void;
  onCustomize: (characterId: string) => void;
  onCreateCustom?: () => void;
  onBack?: () => void;
  locale: CountryLanguage;
  /** Favorites list to track which characters are already added */
  favorites?: FavoriteCard[];
  logger: EndpointLogger;
  user: JwtPayloadType;
}

/**
 * Character list item component - shows character info with description
 */
export function CharacterListItem({
  character,
  onAdd,
  onCustomize,
  locale,
  isAdded = false,
}: {
  character: CharacterListItemType;
  onAdd: () => void;
  onCustomize?: () => void;
  locale: CountryLanguage;
  isAdded?: boolean;
}): JSX.Element {
  const { t } = simpleT(locale);
  const isTouchDevice = useIsMobile();

  // Regular character card
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
          {isAdded
            ? t("app.api.agent.chat.selector.added")
            : t("app.api.agent.chat.selector.add")}
        </Button>
      </Div>

      {/* Character Icon */}
      <Div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
        <Icon icon={character.icon as never} className="h-5 w-5" />
      </Div>

      {/* Main Info - Full Width */}
      <Div className="flex-1 min-w-0">
        {/* Title row with name and tagline */}
        <Div className="flex items-baseline gap-1.5 min-w-0">
          <Span className="font-medium text-base shrink-0">
            {t(character.content.name)}
          </Span>
          {character.content.tagline && (
            <Span className="text-xs text-muted-foreground truncate">
              {t(character.content.tagline)}
            </Span>
          )}
        </Div>

        {/* Description */}
        <Span className="text-xs text-muted-foreground block mt-1 truncate">
          {t(character.content.description)}
        </Span>

        {/* Model row - model info, provider, credits */}
        <Div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
          {character.content.modelInfo && (
            <>
              <Icon icon={character.content.modelIcon} className="h-4 w-4" />
              <Span className="truncate">{character.content.modelInfo}</Span>
              <Span className="text-muted-foreground/40">•</Span>
            </>
          )}
          {character.content.modelProvider && (
            <>
              <Span className="shrink-0">
                {modelProviders[character.content.modelProvider]?.name}
              </Span>
              <Span className="text-muted-foreground/40">•</Span>
            </>
          )}
          <Span className="shrink-0">{character.content.creditCost}</Span>
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
  characters: readonly CharacterListItemType[];
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
  logger: EndpointLogger;
  user: JwtPayloadType;
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
  logger,
  user,
}: CharacterBrowserCoreProps): JSX.Element {
  const { t } = simpleT(locale);

  const [expandedCategories, setExpandedCategories] = useState<
    Set<(typeof CharacterCategory)[keyof typeof CharacterCategory]>
  >(new Set());

  // Fetch characters from API
  const charactersEndpoint = useCharacters(user, logger);

  // Calculate which characters are already added to favorites (non-customized)
  const addedCharacterIds = useMemo(
    () =>
      new Set(
        favorites.filter((f) => f.characterId).map((f) => f.characterId!),
      ),
    [favorites],
  );

  // Get all characters as flat array
  const allCharacters = useMemo(() => {
    if (!charactersEndpoint.read?.data?.container?.sections) {
      return [];
    }
    return charactersEndpoint.read.data.container?.sections.flatMap(
      (section: { characters: CharacterListItemType[] }) => section.characters,
    );
  }, [charactersEndpoint.read?.data]);

  // Get all categories with their characters - group by category field on each character
  // Exclude default character from categories
  const categoriesWithCharacters = useMemo(() => {
    if (allCharacters.length === 0) {
      return [];
    }

    const grouped = new Map<
      (typeof CharacterCategory)[keyof typeof CharacterCategory],
      typeof allCharacters
    >();

    allCharacters.forEach((character: CharacterListItemType) => {
      const existing = grouped.get(character.category);
      if (existing) {
        existing.push(character);
      } else {
        grouped.set(character.category, [character]);
      }
    });

    return [...grouped.entries()].map(([category, characters]) => ({
      category,
      characters,
    }));
  }, [allCharacters]);

  // Filter by search
  const searchFilteredCharacters = useMemo(() => {
    if (!searchQuery) {
      return null;
    }

    const query = searchQuery.toLowerCase();
    return allCharacters.filter(
      (p: CharacterListItemType) =>
        t(p.content.name).toLowerCase().includes(query) ||
        t(p.content.description).toLowerCase().includes(query),
    );
  }, [searchQuery, t, allCharacters]);

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
            {searchFilteredCharacters.map(
              (character: CharacterListItemType) => (
                <CharacterListItem
                  key={character.id}
                  character={character}
                  onAdd={() => onAdd(character.id)}
                  onCustomize={() => onCustomize(character.id)}
                  locale={locale}
                  isAdded={addedCharacterIds?.has(character.id) ?? false}
                />
              ),
            )}
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
      {/* Default character at the top */}
      {
        <Div className="flex flex-col gap-5">
          {/* Section: Advanced Model Access */}
          <Div className="flex flex-col gap-3">
            <Div className="flex flex-col gap-1">
              <Span className="text-sm font-semibold">
                {t(
                  "app.api.agent.chat.characters.get.browser.advancedModelAccess",
                )}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t(
                  "app.api.agent.chat.characters.get.browser.configureFiltersText",
                )}{" "}
                {Object.keys(modelOptions).length}{" "}
                {t("app.api.agent.chat.characters.get.browser.aiModels")}
              </Span>
            </Div>

            <Div
              className={cn(
                "relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all",
                "border-primary/30 bg-gradient-to-br from-primary/5 to-background/50",
                "hover:border-primary/40 hover:shadow-md cursor-pointer group",
              )}
              onClick={() => onCustomize(NO_CHARACTER.id)}
            >
              {/* Icon */}
              <Div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Icon icon="sparkles" className="h-6 w-6 text-primary" />
              </Div>

              {/* Content */}
              <Div className="flex-1 min-w-0">
                <Span className="font-semibold text-base block text-primary">
                  {t(
                    "app.api.agent.chat.characters.get.browser.configureAiModelsTitle",
                  )}
                </Span>
                <Span className="text-sm text-muted-foreground block mt-1">
                  {t(
                    "app.api.agent.chat.characters.get.browser.advancedChooseText",
                  )}{" "}
                  {Object.keys(modelOptions).length}{" "}
                  {t(
                    "app.api.agent.chat.characters.get.browser.modelsWithCustomFilters",
                  )}
                </Span>
              </Div>

              {/* Button */}
              {onCustomize && (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="shrink-0 self-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCustomize(NO_CHARACTER.id);
                  }}
                >
                  {t(
                    "app.api.agent.chat.characters.get.browser.configureButton",
                  )}
                </Button>
              )}
            </Div>
          </Div>

          {/* Separator */}
          <Div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <Span className="text-xs text-muted-foreground/70 uppercase tracking-wider font-medium">
              or
            </Span>
            <Separator className="flex-1" />
          </Div>

          {/* Section: Character Presets */}
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-semibold">
              {t("app.api.agent.chat.characters.get.browser.characterPresets")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("app.api.agent.chat.characters.get.browser.pickCharacterText")}
            </Span>
          </Div>
        </Div>
      }

      {/* All other categories */}
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
              !categoriesWithCharacters.some(
                (c) => c.category === CharacterCategory.ROLEPLAY,
              ));

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
  logger,
  user,
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
              <Span className="hidden sm:inline">
                {t("app.chat.selector.createCustom")}
              </Span>
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
          logger={logger}
          user={user}
        />
      </Div>
    </Div>
  );
}
