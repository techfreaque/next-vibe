"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TOUR_DATA_ATTRS } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-config";
import { useTourState } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-state-context";
import {
  type Character,
  getCharacterById,
} from "@/app/api/[locale]/agent/chat/characters/config";
import charactersDefinition, {
  type CharacterListResponseOutput,
} from "@/app/api/[locale]/agent/chat/characters/definition";
import {
  ContentLevelFilter,
  type ContentLevelFilterValue,
  IntelligenceLevelFilter,
  type IntelligenceLevelFilterValue,
  ModelSelectionMode,
  PriceLevelFilter,
  type PriceLevelFilterValue,
} from "@/app/api/[locale]/agent/chat/favorites/enum";
import {
  getIconComponent,
  type IconKey,
} from "@/app/api/[locale]/agent/chat/model-access/icons";
import {
  type ModelId,
  modelOptions,
} from "@/app/api/[locale]/agent/chat/model-access/models";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ModelUtility } from "../../../../types";
import { CharacterBrowser } from "./character-browser";
import { CreateCharacterForm } from "./create-character-form";
import { EditCharacterModal } from "./edit-character-modal";
import { type FavoriteItem, FavoritesBar } from "./favorites-bar";
import { QuickSettingsPanel } from "./quick-settings-panel";
import { SelectorOnboarding } from "./selector-onboarding";
import { selectModelForCharacter } from "./types";
import { useChatFavorites } from "./use-chat-favorites";

interface SelectorProps {
  characterId: string;
  modelId: ModelId;
  onCharacterChange: (characterId: string) => void;
  onModelChange: (modelId: ModelId) => void;
  locale: CountryLanguage;
  user?: JwtPayloadType;
  logger: EndpointLogger;
  className?: string;
  buttonClassName?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
}

type SelectorView =
  | "onboarding"
  | "favorites"
  | "settings"
  | "browser"
  | "create"
  | "edit"
  | "character-switch";

/**
 * Get default intelligence from character preferences
 */
function getDefaultIntelligence(
  character: Character | null,
): typeof IntelligenceLevelFilterValue {
  if (character?.preferences?.preferredStrengths) {
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
  character: Character | null,
): typeof ContentLevelFilterValue {
  if (character?.requirements?.minContent) {
    return character.requirements.minContent;
  }
  return ContentLevelFilter.OPEN;
}

/**
 * Create a new favorite from character
 */
function createFavoriteFromCharacter(
  characterId: string | null,
  intelligence?: typeof IntelligenceLevelFilterValue,
  maxPrice: typeof PriceLevelFilterValue = PriceLevelFilter.STANDARD,
  content?: typeof ContentLevelFilterValue,
): FavoriteItem {
  const character = characterId ? getCharacterById(characterId) : null;

  // Use character-specific defaults if not provided
  const defaultIntelligence =
    intelligence ?? getDefaultIntelligence(character ?? null);
  const defaultContent = content ?? getDefaultContent(character ?? null);

  return {
    id: `local-${Date.now()}-${characterId ?? "model"}`,
    characterId,
    voice: character?.voice,
    modelSettings: {
      mode: ModelSelectionMode.AUTO,
      filters: {
        intelligence: defaultIntelligence,
        maxPrice,
        content: defaultContent,
      },
    },
    isActive: false,
  };
}

/**
 * Create a new favorite from a character object
 * This version accepts the character object from API response, avoiding the need for getCharacterById()
 * Used when we have the character object already (e.g., from API response or refetched data)
 */
function createFavoriteFromCharacterObject(
  character: CharacterListResponseOutput["characters"][number],
  intelligence?: typeof IntelligenceLevelFilterValue,
  maxPrice: typeof PriceLevelFilterValue = PriceLevelFilter.STANDARD,
  content?: typeof ContentLevelFilterValue,
): FavoriteItem {
  // Use character-specific defaults if not provided
  const defaultIntelligence =
    intelligence ?? getDefaultIntelligence(character as Character);
  const defaultContent = content ?? getDefaultContent(character as Character);

  return {
    id: `local-${Date.now()}-${character.id}`,
    characterId: character.id,
    voice: character.voice,
    modelSettings: {
      mode: ModelSelectionMode.AUTO,
      filters: {
        intelligence: defaultIntelligence,
        maxPrice,
        content: defaultContent,
      },
    },
    isActive: false,
  };
}

export function Selector({
  characterId,
  modelId,
  onCharacterChange,
  onModelChange,
  locale,
  user,
  logger,
  className,
  buttonClassName,
  triggerSize = "sm",
}: SelectorProps): JSX.Element {
  const { t } = simpleT(locale);

  // Tour state
  const tourIsActive = useTourState((state) => state.isActive);
  const tourOpen = useTourState((state) => state.modelSelectorOpen);
  const setTourOpen = useTourState((state) => state.setModelSelectorOpen);

  // Use unified favorites hook - handles server/local storage automatically
  const {
    favorites,
    isLoading: favoritesLoading,
    addFavorite,
    updateFavorite,
    deleteFavorite,
    setActiveFavorite,
  } = useChatFavorites({
    user,
    logger,
  });

  // Fetch characters list (for edit character feature)
  const charactersEndpoint = useEndpoint(charactersDefinition, {}, logger);
  const characters = useMemo(() => {
    const response = charactersEndpoint.read?.response;
    if (
      response &&
      "success" in response &&
      response.success &&
      "data" in response &&
      response.data &&
      "characters" in response.data
    ) {
      const charactersList = response.data.characters;
      const map: Record<
        string,
        CharacterListResponseOutput["characters"][number]
      > = {};
      charactersList.forEach((p) => {
        map[p.id] = p;
      });
      return map;
    }
    return {};
  }, [charactersEndpoint.read?.response]);

  // Local state
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [view, setView] = useState<SelectorView>("favorites");

  const [needsOnboarding, setNeedsOnboarding] = useState(true);

  // Use tour state if active
  const open = tourIsActive ? tourOpen : popoverOpen;

  // Show onboarding when there are no favorites
  useEffect(() => {
    if (!favoritesLoading) {
      // Show onboarding if user has no favorites
      const shouldShowOnboarding = favorites.length === 0;
      setNeedsOnboarding(shouldShowOnboarding);

      // If popover is open, update view based on loading completion
      if (open) {
        setView(shouldShowOnboarding ? "onboarding" : "favorites");
      }
    }
  }, [favoritesLoading, favorites.length, open]);
  const [editingFavoriteId, setEditingFavoriteId] = useState<string | null>(
    null,
  );
  const [editingCharacterData, setEditingCharacterData] = useState<
    CharacterListResponseOutput["characters"][number] | null
  >(null);

  // Handle tour opening the selector - set correct view only on OPEN
  const prevTourOpen = useRef(tourOpen);
  useEffect(() => {
    // Only run when tourOpen transitions from false to true (opening)
    if (tourIsActive && tourOpen && !prevTourOpen.current) {
      // When tour opens the selector, only set view if favorites are loaded
      if (!favoritesLoading) {
        setView(needsOnboarding ? "onboarding" : "favorites");
      }
    }
    prevTourOpen.current = tourOpen;
  }, [tourIsActive, tourOpen, needsOnboarding, favoritesLoading]);

  // Get current selections
  const currentCharacter = useMemo(
    () => getCharacterById(characterId),
    [characterId],
  );
  const currentModel = useMemo(() => modelOptions[modelId], [modelId]);

  // Get active favorite
  const activeFavorite = useMemo(
    () => favorites.find((f) => f.isActive),
    [favorites],
  );

  // Get the favorite being edited (could be different from active)
  const editingFavorite = useMemo(
    () =>
      editingFavoriteId
        ? favorites.find((f) => f.id === editingFavoriteId)
        : activeFavorite,
    [editingFavoriteId, favorites, activeFavorite],
  );

  // Handle open state changes
  const handleOpenChange = useCallback(
    (newOpen: boolean): void => {
      if (tourIsActive) {
        setTourOpen(newOpen);
      } else {
        setPopoverOpen(newOpen);
      }

      if (newOpen) {
        // When opening, only set view if favorites are loaded
        // Otherwise, the useEffect will set it when loading completes
        if (!favoritesLoading) {
          setView(needsOnboarding ? "onboarding" : "favorites");
        }
      } else {
        // When closing, reset view
        setView("favorites");
      }
    },
    [tourIsActive, setTourOpen, needsOnboarding, favoritesLoading],
  );

  // Handle favorite selection
  const handleFavoriteSelect = useCallback(
    async (favoriteId: string): Promise<void> => {
      // Set this favorite as active (persists to server if authenticated)
      await setActiveFavorite(favoriteId);

      const selected = favorites.find((f) => f.id === favoriteId);
      if (selected) {
        // Only change character if not model-only
        if (selected.characterId) {
          onCharacterChange(selected.characterId);
        }

        // Resolve model with priority: manual override > preferredModel > auto
        const allModels = Object.values(modelOptions);
        const character = selected.characterId
          ? getCharacterById(selected.characterId)
          : null;

        const selectedModelId = selectModelForCharacter(
          allModels,
          character ?? null,
          {
            mode:
              selected.modelSettings.mode === ModelSelectionMode.MANUAL
                ? "manual"
                : "auto",
            manualModelId: selected.modelSettings.manualModelId,
            filters: selected.modelSettings.filters,
          },
        );

        if (selectedModelId) {
          onModelChange(selectedModelId);
        } else if (!character) {
          // Model-only fallback: use first model matching filters
          const matchingModel = allModels.find((m) => {
            const { filters } = selected.modelSettings;
            if (
              filters.intelligence !== IntelligenceLevelFilter.ANY &&
              m.intelligence !== filters.intelligence
            ) {
              return false;
            }
            return true;
          });
          if (matchingModel) {
            onModelChange(matchingModel.id);
          }
        }
      }
      handleOpenChange(false);
    },
    [
      favorites,
      onCharacterChange,
      onModelChange,
      handleOpenChange,
      setActiveFavorite,
    ],
  );

  // Handle settings click (from FavoritesBar)
  const handleSettingsClick = useCallback((favoriteId: string): void => {
    setEditingFavoriteId(favoriteId);
    setView("settings");
  }, []);

  // Handle add click (from FavoritesBar)
  const handleAddClick = useCallback((): void => {
    setView("browser");
  }, []);

  // Handle settings save
  const handleSettingsSave = useCallback(
    async (
      settings: FavoriteItem["modelSettings"],
      saveMode: "temporary" | "update" | "new",
    ): Promise<void> => {
      if (!editingFavorite) {
        return;
      }

      // Helper to apply model changes with priority: manual > preferredModel > auto
      const applyModelChange = (): void => {
        const allModels = Object.values(modelOptions);
        const character = editingFavorite.characterId
          ? getCharacterById(editingFavorite.characterId)
          : null;

        const selectedModelId = selectModelForCharacter(
          allModels,
          character ?? null,
          {
            mode:
              settings.mode === ModelSelectionMode.MANUAL ? "manual" : "auto",
            manualModelId: settings.manualModelId,
            filters: settings.filters,
          },
        );

        if (selectedModelId) {
          onModelChange(selectedModelId);
        }
      };

      if (saveMode === "temporary") {
        // Just apply to current chat without saving
        applyModelChange();
      } else if (saveMode === "update") {
        // Update existing favorite (persists to server if authenticated)
        await updateFavorite(editingFavorite.id, { modelSettings: settings });

        // Apply changes if this is the active favorite
        if (editingFavorite.isActive) {
          applyModelChange();
        }
      } else {
        // Create new favorite (persists to server if authenticated)
        const newFavorite = await addFavorite({
          characterId: editingFavorite.characterId,
          modelSettings: settings,
          isActive: true,
        });

        // Deactivate other favorites
        for (const f of favorites) {
          if (f.isActive && f.id !== newFavorite.id) {
            await updateFavorite(f.id, { isActive: false });
          }
        }

        // Apply changes (new favorite is always active)
        applyModelChange();
      }

      setEditingFavoriteId(null);
      setView("favorites");
      handleOpenChange(false);
    },
    [
      editingFavorite,
      favorites,
      onModelChange,
      handleOpenChange,
      addFavorite,
      updateFavorite,
    ],
  );

  // Handle add character with defaults
  const handleAddWithDefaults = useCallback(
    async (newCharacterId: string): Promise<void> => {
      const favoriteData = createFavoriteFromCharacter(newCharacterId);

      // Deactivate existing favorites
      for (const f of favorites) {
        if (f.isActive) {
          await updateFavorite(f.id, { isActive: false });
        }
      }

      // Add new favorite (persists to server if authenticated)
      await addFavorite({
        characterId: favoriteData.characterId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      // Apply selection with priority: manual > preferredModel > auto
      onCharacterChange(newCharacterId);
      const character = getCharacterById(newCharacterId);
      if (character) {
        const allModels = Object.values(modelOptions);
        const selectedModelId = selectModelForCharacter(allModels, character, {
          mode:
            favoriteData.modelSettings.mode === ModelSelectionMode.MANUAL
              ? "manual"
              : "auto",
          manualModelId: favoriteData.modelSettings.manualModelId,
          filters: favoriteData.modelSettings.filters,
        });
        if (selectedModelId) {
          onModelChange(selectedModelId);
        }
      }

      setView("favorites");
      handleOpenChange(false);
    },
    [
      favorites,
      onCharacterChange,
      onModelChange,
      handleOpenChange,
      addFavorite,
      updateFavorite,
    ],
  );

  // Handle customize character
  const handleCustomize = useCallback(
    async (newCharacterId: string): Promise<void> => {
      // Create favorite for customization
      const favoriteData = createFavoriteFromCharacter(newCharacterId);

      // Deactivate existing favorites
      for (const f of favorites) {
        if (f.isActive) {
          await updateFavorite(f.id, { isActive: false });
        }
      }

      // Add new favorite (persists to server if authenticated)
      const newFavorite = await addFavorite({
        characterId: favoriteData.characterId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      setEditingFavoriteId(newFavorite.id);
      setView("settings");
    },
    [favorites, addFavorite, updateFavorite],
  );

  // Handle create custom character
  const handleCreateCustom = useCallback((): void => {
    setView("create");
  }, []);

  // Handle custom character created
  const handleCharacterCreated = useCallback(
    async (characterId: string): Promise<void> => {
      // Refetch characters to get the newly created custom character
      if (charactersEndpoint.read?.refetch) {
        await charactersEndpoint.read.refetch();
      }

      // Get character from refreshed characters map
      const character = characters[characterId];

      if (!character) {
        logger.error("Character not found after creation", { characterId });
        // Fallback to old behavior if character not found
        const fallbackData = createFavoriteFromCharacter(characterId);

        // Deactivate existing favorites
        for (const f of favorites) {
          if (f.isActive) {
            await updateFavorite(f.id, { isActive: false });
          }
        }

        await addFavorite({
          characterId: fallbackData.characterId,
          modelSettings: fallbackData.modelSettings,
          isActive: true,
        });

        onCharacterChange(characterId);
        setView("favorites");
        handleOpenChange(false);
        return;
      }

      // Create favorite from the character object
      const favoriteData = createFavoriteFromCharacterObject(character);

      // Deactivate existing favorites
      for (const f of favorites) {
        if (f.isActive) {
          await updateFavorite(f.id, { isActive: false });
        }
      }

      // Add new favorite (persists to server if authenticated)
      await addFavorite({
        characterId: favoriteData.characterId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      // Apply selection with priority: manual > preferredModel > auto
      onCharacterChange(characterId);

      // Try getCharacterById first for full character with all fields, fallback to API character
      const fullCharacter = getCharacterById(characterId) || character;
      const allModels = Object.values(modelOptions);
      const selectedModelId = selectModelForCharacter(
        allModels,
        fullCharacter as Character,
        {
          mode:
            favoriteData.modelSettings.mode === ModelSelectionMode.MANUAL
              ? "manual"
              : "auto",
          manualModelId: favoriteData.modelSettings.manualModelId,
          filters: favoriteData.modelSettings.filters,
        },
      );
      if (selectedModelId) {
        onModelChange(selectedModelId);
      }

      setView("favorites");
      handleOpenChange(false);
    },
    [
      favorites,
      onCharacterChange,
      onModelChange,
      handleOpenChange,
      addFavorite,
      updateFavorite,
      logger,
      characters,
      charactersEndpoint.read,
    ],
  );

  // Handle character switch from QuickSettingsPanel
  const handleCharacterSwitch = useCallback(
    async (newCharacterId: string, keepSettings: boolean): Promise<void> => {
      if (!editingFavorite) {
        return;
      }

      // Prepare update
      const updates: Partial<FavoriteItem> = {
        characterId: newCharacterId,
      };

      if (!keepSettings) {
        // Reset to character defaults
        const character = characters[newCharacterId];
        if (character) {
          updates.modelSettings = {
            mode: ModelSelectionMode.AUTO,
            filters: {
              intelligence:
                character.requirements?.minIntelligence ||
                IntelligenceLevelFilter.SMART,
              content:
                character.requirements?.minContent || ContentLevelFilter.OPEN,
              maxPrice: PriceLevelFilter.STANDARD,
            },
          };
        }
      }

      // Update the favorite (persists to server if authenticated)
      await updateFavorite(editingFavorite.id, updates);

      // If this is the active favorite, apply the character change
      if (editingFavorite.isActive) {
        onCharacterChange(newCharacterId);

        // Update model with priority: manual > preferredModel > auto
        const character = getCharacterById(newCharacterId);
        if (character) {
          const allModels = Object.values(modelOptions);
          const settings =
            updates.modelSettings || editingFavorite.modelSettings;
          const selectedModelId = selectModelForCharacter(
            allModels,
            character,
            {
              mode:
                settings.mode === ModelSelectionMode.MANUAL ? "manual" : "auto",
              manualModelId: settings.manualModelId,
              filters: settings.filters,
            },
          );
          if (selectedModelId) {
            onModelChange(selectedModelId);
          }
        }
      }
    },
    [
      editingFavorite,
      updateFavorite,
      onCharacterChange,
      onModelChange,
      characters,
    ],
  );

  // Track if favorite was already saved during onboarding
  const savedOnboardingCharacterRef = useRef<string | null>(null);

  // Handle saving favorite during onboarding (called when clicking Continue on pick screen)
  const handleSaveFavorite = useCallback(
    async (selectedCharacterId: string): Promise<void> => {
      // Create favorite from selected character
      const favoriteData = createFavoriteFromCharacter(selectedCharacterId);

      // Add new favorite (persists to server if authenticated)
      await addFavorite({
        characterId: favoriteData.characterId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      // Track that we saved this character's favorite
      savedOnboardingCharacterRef.current = selectedCharacterId;

      // Apply selection immediately with priority: manual > preferredModel > auto
      onCharacterChange(selectedCharacterId);
      const character = getCharacterById(selectedCharacterId);
      if (character) {
        const allModels = Object.values(modelOptions);
        const selectedModelId = selectModelForCharacter(allModels, character, {
          mode:
            favoriteData.modelSettings.mode === ModelSelectionMode.MANUAL
              ? "manual"
              : "auto",
          manualModelId: favoriteData.modelSettings.manualModelId,
          filters: favoriteData.modelSettings.filters,
        });
        if (selectedModelId) {
          onModelChange(selectedModelId);
        }
      }
    },
    [onCharacterChange, onModelChange, addFavorite],
  );

  // Handle onboarding completion (Start Chatting clicked)
  const handleOnboardingComplete = useCallback(
    async (selectedCharacterId: string): Promise<void> => {
      // Close the popover FIRST to ensure tour resumes
      // Tour advancement is handled by welcome-tour when modal closes
      handleOpenChange(false);

      // If favorite was already saved in handleSaveFavorite, skip saving again
      if (savedOnboardingCharacterRef.current === selectedCharacterId) {
        savedOnboardingCharacterRef.current = null;
        return;
      }

      // Fallback: save favorite if not already saved (shouldn't happen normally)
      const favoriteData = createFavoriteFromCharacter(selectedCharacterId);

      // Add new favorite (persists to server if authenticated)
      await addFavorite({
        characterId: favoriteData.characterId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      // Apply selection with priority: manual > preferredModel > auto
      onCharacterChange(selectedCharacterId);
      const character = getCharacterById(selectedCharacterId);
      if (character) {
        const allModels = Object.values(modelOptions);
        const selectedModelId = selectModelForCharacter(allModels, character, {
          mode:
            favoriteData.modelSettings.mode === ModelSelectionMode.MANUAL
              ? "manual"
              : "auto",
          manualModelId: favoriteData.modelSettings.manualModelId,
          filters: favoriteData.modelSettings.filters,
        });
        if (selectedModelId) {
          onModelChange(selectedModelId);
        }
      }
    },
    [onCharacterChange, onModelChange, handleOpenChange, addFavorite],
  );

  // Handle browse all characters from onboarding
  const handleBrowseAll = useCallback((): void => {
    setView("browser");
  }, []);

  // Render icon helper
  const renderIcon = (
    icon: IconKey,
    iconClassName = "h-4 w-4",
  ): JSX.Element => {
    const Icon = getIconComponent(icon);
    return <Icon className={iconClassName} />;
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={triggerSize}
          className={cn(
            "h-auto min-h-9 gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-accent text-sm font-normal touch-manipulation",
            buttonClassName,
          )}
          data-tour={TOUR_DATA_ATTRS.MODEL_SELECTOR}
        >
          {/* Character icon */}
          <Span className="flex items-center justify-center w-5 h-5 shrink-0">
            {currentCharacter
              ? renderIcon(currentCharacter.icon, "h-4 w-4")
              : null}
          </Span>

          {/* Character name - hidden on mobile */}
          <Span className="hidden sm:inline max-w-[80px] md:max-w-[100px] truncate">
            {currentCharacter ? t(currentCharacter.name) : ""}
          </Span>

          {/* Separator - hidden on mobile */}
          <Span className="hidden sm:inline text-muted-foreground/50">+</Span>

          {/* Model icon */}
          <Span className="flex items-center justify-center w-5 h-5 shrink-0 opacity-70">
            {renderIcon(currentModel.icon, "h-4 w-4")}
          </Span>

          {/* Model name - shown on larger screens */}
          <Span className="hidden md:inline max-w-[80px] lg:max-w-[100px] truncate text-muted-foreground">
            {currentModel.name}
          </Span>

          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "p-0 w-screen sm:w-[480px] sm:max-w-[520px]",
          // Ensure popover appears above tour overlay (z-index 10000) when tour is active
          tourIsActive && "z-[10001]",
          className,
        )}
        align="start"
        side="top"
        sideOffset={8}
      >
        <Div className="flex flex-col max-h-[min(600px,calc(100dvh-100px))] overflow-hidden">
          {/* Loading state */}
          {favoritesLoading && (
            <Div className="flex items-center justify-center p-8">
              <Div className="flex flex-col items-center gap-3">
                <Div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <Span className="text-sm text-muted-foreground">
                  {t("app.chat.selector.loading")}
                </Span>
              </Div>
            </Div>
          )}

          {/* Onboarding view - shown on first open when no favorites exist */}
          {!favoritesLoading && view === "onboarding" && (
            <SelectorOnboarding
              onSelect={handleOnboardingComplete}
              onSaveFavorite={handleSaveFavorite}
              onBrowseAll={handleBrowseAll}
              locale={locale}
            />
          )}

          {/* Favorites view */}
          {!favoritesLoading && view === "favorites" && (
            <Div className="p-4 overflow-y-auto">
              <FavoritesBar
                favorites={favorites}
                onFavoriteSelect={handleFavoriteSelect}
                onSettingsClick={handleSettingsClick}
                onAddClick={handleAddClick}
                locale={locale}
              />
            </Div>
          )}

          {/* Settings view */}
          {view === "settings" && editingFavorite && (
            <QuickSettingsPanel
              favorite={editingFavorite}
              onSave={handleSettingsSave}
              onCancel={() => {
                setEditingFavoriteId(null);
                setView("favorites");
              }}
              onDelete={async () => {
                // Delete the favorite (persists to server if authenticated)
                await deleteFavorite(editingFavorite.id);

                // If we deleted the active one, make the first remaining active
                if (editingFavorite.isActive) {
                  const remaining = favorites.filter(
                    (f) => f.id !== editingFavorite.id,
                  );
                  if (remaining.length > 0) {
                    await setActiveFavorite(remaining[0].id);
                  }
                }

                setEditingFavoriteId(null);
                setView("favorites");
              }}
              onEditCharacter={(characterData) => {
                setEditingCharacterData(characterData);
                setView("edit");
              }}
              onSwitchCharacterView={() => setView("character-switch")}
              onCharacterSwitch={handleCharacterSwitch}
              characters={characters}
              isAuthenticated={!!(user && !user.isPublic)}
              locale={locale}
            />
          )}

          {/* Browser view */}
          {view === "browser" && (
            <CharacterBrowser
              onAddWithDefaults={handleAddWithDefaults}
              onCustomize={handleCustomize}
              onCreateCustom={handleCreateCustom}
              onBack={() => setView("favorites")}
              locale={locale}
            />
          )}

          {/* Create character view */}
          {view === "create" && (
            <CreateCharacterForm
              onBack={() => setView("browser")}
              onSave={handleCharacterCreated}
              isAuthenticated={!!(user && !user.isPublic)}
              locale={locale}
            />
          )}

          {/* Edit character view */}
          {view === "edit" && editingCharacterData && (
            <EditCharacterModal
              onBack={() => setView("settings")}
              onCharacterCreated={async (newCharacterId) => {
                logger.info("Character edited, updating favorite", {
                  newCharacterId,
                });
                if (editingFavorite) {
                  await updateFavorite(editingFavorite.id, {
                    characterId: newCharacterId,
                  });
                }
                setView("favorites");
              }}
              initialData={editingCharacterData}
              isAuthenticated={!!(user && !user.isPublic)}
              locale={locale}
            />
          )}

          {/* Character switch view - allows changing character without deleting favorite */}
          {view === "character-switch" && editingFavorite && (
            <CharacterBrowser
              onAddWithDefaults={async (characterId) => {
                // Switch character and reset to defaults
                await handleCharacterSwitch(characterId, false);
                setView("settings");
              }}
              onCustomize={async (characterId) => {
                // Switch character but keep current settings
                await handleCharacterSwitch(characterId, true);
                setView("settings");
              }}
              onCreateCustom={handleCreateCustom}
              onBack={() => setView("settings")}
              locale={locale}
            />
          )}
        </Div>
      </PopoverContent>
    </Popover>
  );
}
