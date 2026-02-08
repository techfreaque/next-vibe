"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import { useTourState } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-state-context";
import { NO_CHARACTER } from "@/app/api/[locale]/agent/chat/characters/config";
import type { CharacterListItem as CharacterListItemType } from "@/app/api/[locale]/agent/chat/characters/definition";
import favoriteEditDefinition from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import favoritesCreateDefinition from "@/app/api/[locale]/agent/chat/favorites/create/definition";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import {
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import { NavigationStackProvider } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useIsMobile } from "@/hooks/use-media-query";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import {
  CATEGORY_CONFIG,
  CharacterCategory,
  ModelSelectionType,
} from "../enum";
import { useCharacters } from "../hooks";

interface CharacterBrowserProps {
  onAddWithDefaults: (characterId: string) => void;
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
            {t(character.name)}
          </Span>
          {character.tagline && (
            <Span className="text-xs text-muted-foreground truncate">
              {t(character.tagline)}
            </Span>
          )}
        </Div>

        {/* Description */}
        <Span className="text-xs text-muted-foreground block mt-1 truncate">
          {t(character.description)}
        </Span>

        {/* Model row - model info, provider, credits */}
        <Div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
          {character.modelInfo && (
            <>
              <Icon icon={character.modelIcon} className="h-4 w-4" />
              <Span className="truncate">{character.modelInfo}</Span>
              <Span className="text-muted-foreground/40">•</Span>
            </>
          )}
          {character.modelProvider && (
            <>
              <Span className="shrink-0">
                {modelProviders[character.modelProvider]?.name}
              </Span>
              <Span className="text-muted-foreground/40">•</Span>
            </>
          )}
          <Span className="shrink-0">{character.creditCost}</Span>
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
  favorites: FavoriteCard[];
  locale: CountryLanguage;
  searchQuery?: string;
  hideCompanions?: boolean;
  logger: EndpointLogger;
  user: JwtPayloadType;
  /** Selected character ID for showing success indicator */
  selectedCharacterId?: string;
  /** Characters map for displaying selected character name */
  characters?: Record<string, CharacterListItemType>;
  /** Show specialist step wrapper (header + footer) */
  showSpecialistWrapper?: boolean;
}

/**
 * Core character browser logic and rendering - shared between full browser and onboarding
 */
export function CharacterBrowserCore({
  onAdd,
  favorites,
  locale,
  searchQuery = "",
  hideCompanions = false,
  logger,
  user,
  selectedCharacterId,
  characters,
  showSpecialistWrapper = false,
}: CharacterBrowserCoreProps): JSX.Element {
  const { t } = simpleT(locale);
  const setPopoverOpen = useTourState((state) => state.setModelSelectorOpen);

  const [expandedCategories, setExpandedCategories] = useState<
    Set<(typeof CharacterCategory)[keyof typeof CharacterCategory]>
  >(new Set());
  const [customizeCharacterId, setCustomizeCharacterId] = useState<
    string | null
  >(null);

  const handleStartChatting = useCallback(() => {
    setPopoverOpen(false);
  }, [setPopoverOpen]);

  const character =
    selectedCharacterId && characters
      ? characters[selectedCharacterId]
      : undefined;
  const characterName = character ? t(character.name) : "";

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
    if (!charactersEndpoint.read?.data?.sections) {
      return [];
    }
    return charactersEndpoint.read.data.sections.flatMap(
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
        t(p.name).toLowerCase().includes(query) ||
        t(p.description).toLowerCase().includes(query),
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

  const handleCustomize = useCallback((characterId: string) => {
    setCustomizeCharacterId(characterId);
  }, []);

  // If customizing, replace entire view with EndpointsPage
  if (customizeCharacterId) {
    const character = allCharacters.find((c) => c.id === customizeCharacterId);

    const prefillData = character
      ? {
          characterId: character.id,
          container: {
            character: {
              icon: character.icon,
              info: {
                titleRow: {
                  name: character.name,
                  tagline: character.tagline,
                },
                description: character.description,
              },
            },
            voice: null,
            modelSelection: {
              currentSelection: {
                selectionType: ModelSelectionType.CHARACTER_BASED,
              },
            },
          },
        }
      : undefined;

    // Replace the entire CharacterBrowserCore view with EndpointsPage
    return (
      <EndpointsPage
        endpoint={{
          POST: favoritesCreateDefinition.POST,
          GET: favoriteEditDefinition.GET,
        }}
        forceMethod={Methods.POST}
        user={user}
        locale={locale}
        navigationOverride={{
          pop: () => {
            setCustomizeCharacterId(null);
          },
          canGoBack: true,
          stack: [
            {
              endpoint: favoritesCreateDefinition.POST,
              params: {
                data: prefillData,
              },
              timestamp: Date.now(),
              popNavigationOnSuccess: 1,
            },
          ],
        }}
        endpointOptions={{
          read: {
            urlPathParams: {
              id: customizeCharacterId,
            },
          },
          create: {
            autoPrefillData: prefillData,
            initialState: prefillData,
            mutationOptions: {
              onSuccess: async () => {
                setCustomizeCharacterId(null);
              },
            },
          },
        }}
      />
    );
  }

  const browserContent = searchFilteredCharacters ? (
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
                  onCustomize={() => handleCustomize(character.id)}
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
              onClick={() => handleCustomize(NO_CHARACTER.id)}
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
                onCustomize={handleCustomize}
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

  // Wrap with specialist step UI if requested
  if (showSpecialistWrapper) {
    return (
      <Div className="flex flex-col flex-1 overflow-hidden">
        {/* Scrollable content - includes header and character browser */}
        <Div className="flex-1 overflow-y-auto min-h-0">
          {/* Success indicator */}
          {selectedCharacterId && (
            <Div className="flex justify-center p-3 border-b bg-card">
              <Div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                <Check className="h-4 w-4" />
                {t("app.chat.onboarding.specialists.chosen", {
                  name: characterName,
                })}
              </Div>
            </Div>
          )}

          {/* Title + Description - inside scroll */}
          <Div className="p-4 pb-2 border-b bg-card">
            <H3 className="text-base font-semibold mb-1 text-center">
              {t("app.chat.onboarding.specialists.title")}
            </H3>
            <P className="text-xs text-muted-foreground text-center">
              {t("app.chat.onboarding.specialists.subtitle")}
            </P>
          </Div>

          {/* Character browser content */}
          {browserContent}
        </Div>

        {/* Sticky footer at bottom */}
        <Div className="p-4 border-t bg-card shrink-0">
          <Button
            type="button"
            className="w-full h-10"
            onClick={handleStartChatting}
          >
            {t("app.chat.onboarding.specialists.start")}
          </Button>
        </Div>
      </Div>
    );
  }

  return browserContent;
}

/**
 * Character browser component - modal for adding new favorites
 * Provides NavigationStackProvider for EndpointsPage instances
 */
export function CharacterBrowser({
  onAddWithDefaults,
  locale,
  favorites = [],
  logger,
  user,
}: CharacterBrowserProps): JSX.Element {
  return (
    <NavigationStackProvider>
      <CharacterBrowserCore
        onAdd={onAddWithDefaults}
        favorites={favorites}
        locale={locale}
        hideCompanions={false}
        logger={logger}
        user={user}
      />
    </NavigationStackProvider>
  );
}
