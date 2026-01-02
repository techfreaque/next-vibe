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

/**
 * Render icon helper
 */
function renderIcon(icon: IconKey, iconClassName = "h-4 w-4"): JSX.Element {
  const Icon = getIconComponent(icon);
  return <Icon className={iconClassName} />;
}

interface SelectorProps {
  characterId: string;
  modelId: ModelId;
  onCharacterChange: (characterId: string) => void;
  onModelChange: (modelId: ModelId) => void;
  locale: CountryLanguage;
  user: JwtPayloadType;
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
 * Deactivate all active favorites
 */
async function deactivateAllFavorites(
  favorites: FavoriteItem[],
  updateFavorite: (id: string, updates: Partial<FavoriteItem>) => Promise<void>,
): Promise<void> {
  for (const f of favorites) {
    if (f.isActive) {
      await updateFavorite(f.id, { isActive: false });
    }
  }
}

/**
 * Apply favorite selection - sets character (auto-sets voice) and model
 */
function applyFavoriteSelection(
  favorite: FavoriteItem,
  onCharacterChange: (characterId: string) => void,
  onModelChange: (modelId: ModelId) => void,
): void {
  // Set character if not model-only (this also sets voice via setSelectedCharacter)
  if (favorite.characterId) {
    onCharacterChange(favorite.characterId);
  }

  // Resolve and set model
  const character = favorite.characterId
    ? (getCharacterById(favorite.characterId) ?? null)
    : null;

  const allModels = Object.values(modelOptions);
  const selectedModelId = selectModelForCharacter(allModels, character, {
    mode:
      favorite.modelSettings.mode === ModelSelectionMode.MANUAL
        ? "manual"
        : "auto",
    manualModelId: favorite.modelSettings.manualModelId,
    filters: favorite.modelSettings.filters,
  });

  if (selectedModelId) {
    onModelChange(selectedModelId);
  } else if (!character) {
    // Model-only fallback: use first model matching filters
    const matchingModel = allModels.find((m) => {
      const { filters } = favorite.modelSettings;
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
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<
    "story" | "pick" | "specialists"
  >("story");
  const [onboardingSelectedId, setOnboardingSelectedId] = useState<
    string | null
  >(null);

  const needsOnboarding = useMemo(() => {
    return !favoritesLoading && favorites.length === 0;
  }, [favorites, favoritesLoading]);

  // Use tour state if active
  const open = tourIsActive ? tourOpen : popoverOpen;

  const [editingFavoriteId, setEditingFavoriteId] = useState<string | null>(
    null,
  );
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(
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
        const shouldShowOnboarding = needsOnboarding || isOnboardingActive;
        setView(shouldShowOnboarding ? "onboarding" : "favorites");
        if (shouldShowOnboarding) {
          setIsOnboardingActive(true);
        }
      }
    }
    prevTourOpen.current = tourOpen;
  }, [
    tourIsActive,
    tourOpen,
    needsOnboarding,
    favoritesLoading,
    isOnboardingActive,
  ]);

  // Derive actual view - allow switching to settings even during onboarding
  const actualView =
    isOnboardingActive && view !== "settings" && view !== "edit"
      ? "onboarding"
      : view;

  // Get current selections
  const currentCharacter = useMemo(
    () => getCharacterById(characterId),
    [characterId],
  );
  const currentModel = useMemo(() => modelOptions[modelId], [modelId]);
  const modelSupportsTools = currentModel?.supportsTools ?? false;

  // Get active favorite
  const activeFavorite = useMemo(
    () => favorites.find((f) => f.isActive),
    [favorites],
  );

  // Get the favorite being edited (could be different from active)
  const editingFavorite = useMemo(() => {
    if (editingFavoriteId) {
      return favorites.find((f) => f.id === editingFavoriteId);
    }
    if (editingCharacterId) {
      // Create temporary favorite for new character (not yet persisted)
      return createFavoriteFromCharacter(editingCharacterId);
    }
    return activeFavorite;
  }, [editingFavoriteId, editingCharacterId, favorites, activeFavorite]);

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
          const shouldShowOnboarding = needsOnboarding || isOnboardingActive;
          setView(shouldShowOnboarding ? "onboarding" : "favorites");
          if (shouldShowOnboarding) {
            setIsOnboardingActive(true);
          }
        }
      } else {
        // When closing, reset view and onboarding state
        setView("favorites");
        setIsOnboardingActive(false);
      }
    },
    [
      tourIsActive,
      setTourOpen,
      needsOnboarding,
      favoritesLoading,
      isOnboardingActive,
    ],
  );

  // Close modal and reset to favorites view
  const closeModal = useCallback((): void => {
    setView("favorites");
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Handle favorite selection
  const handleFavoriteSelect = useCallback(
    async (favoriteId: string): Promise<void> => {
      await setActiveFavorite(favoriteId);

      const selected = favorites.find((f) => f.id === favoriteId);
      if (selected) {
        applyFavoriteSelection(selected, onCharacterChange, onModelChange);
      }

      closeModal();
    },
    [
      favorites,
      onCharacterChange,
      onModelChange,
      closeModal,
      setActiveFavorite,
    ],
  );

  // Switch to settings view for a specific favorite
  const switchToSettings = useCallback((favoriteId: string): void => {
    setEditingFavoriteId(favoriteId);
    setView("settings");
  }, []);

  // Switch to browser view
  const switchToBrowser = useCallback((): void => {
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

      const updatedFavorite: FavoriteItem = {
        ...editingFavorite,
        modelSettings: settings,
      };

      // Check if this is a new character (not yet added to favorites)
      const isNewCharacter = !!editingCharacterId;

      if (saveMode === "temporary") {
        // Just apply to current chat without saving
        applyFavoriteSelection(
          updatedFavorite,
          onCharacterChange,
          onModelChange,
        );
      } else if (saveMode === "update") {
        if (isNewCharacter) {
          // Creating new favorite from character browser
          await addFavorite({
            characterId: editingFavorite.characterId,
            voice: editingFavorite.voice,
            modelSettings: settings,
            isActive: false,
          });
        } else {
          // Update existing favorite (persists to server if authenticated)
          await updateFavorite(editingFavorite.id, { modelSettings: settings });

          // Apply changes if this is the active favorite
          if (editingFavorite.isActive) {
            applyFavoriteSelection(
              updatedFavorite,
              onCharacterChange,
              onModelChange,
            );
          }
        }
      } else {
        // Deactivate existing favorites before creating new one
        await deactivateAllFavorites(favorites, updateFavorite);

        // Create new favorite (persists to server if authenticated)
        await addFavorite({
          characterId: editingFavorite.characterId,
          voice: editingFavorite.voice,
          modelSettings: settings,
          isActive: true,
        });

        // Apply changes (new favorite is always active)
        applyFavoriteSelection(
          updatedFavorite,
          onCharacterChange,
          onModelChange,
        );
      }

      setEditingFavoriteId(null);
      setEditingCharacterId(null);

      // During onboarding, return to onboarding view instead of closing
      if (isOnboardingActive && saveMode === "update" && isNewCharacter) {
        setView("onboarding");
      } else {
        closeModal();
      }
    },
    [
      editingFavorite,
      editingCharacterId,
      favorites,
      onCharacterChange,
      onModelChange,
      closeModal,
      addFavorite,
      updateFavorite,
      isOnboardingActive,
    ],
  );

  // Handle add character with defaults - just add to favorites, don't activate
  const handleAddWithDefaults = useCallback(
    async (newCharacterId: string): Promise<void> => {
      // Check if non-customized version already exists
      const exists = favorites.some(
        (f) =>
          f.characterId === newCharacterId && !f.customName && !f.customIcon,
      );

      // Don't add duplicates
      if (exists) {
        return;
      }

      const favoriteData = createFavoriteFromCharacter(newCharacterId);

      await addFavorite({
        characterId: favoriteData.characterId,
        voice: favoriteData.voice,
        modelSettings: favoriteData.modelSettings,
        isActive: false,
      });
    },
    [addFavorite, favorites],
  );

  // Handle customize character - open settings for character WITHOUT adding to favorites
  const handleCustomize = useCallback(
    (newCharacterId: string): void => {
      // Check if non-customized version already exists
      const existingFavorite = favorites.find(
        (f) =>
          f.characterId === newCharacterId && !f.customName && !f.customIcon,
      );

      if (existingFavorite) {
        // Edit existing non-customized favorite
        setEditingFavoriteId(existingFavorite.id);
        setEditingCharacterId(null);
        setView("settings");
      } else {
        // Set character ID for "new character" mode - opens settings without adding yet
        setEditingCharacterId(newCharacterId);
        setEditingFavoriteId(null);
        setView("settings");
      }
    },
    [favorites],
  );

  // Handle custom character created
  const handleCharacterCreated = useCallback(
    async (characterId: string): Promise<void> => {
      // Refetch characters to get the newly created custom character
      if (charactersEndpoint.read?.refetch) {
        await charactersEndpoint.read.refetch();
      }

      // Get character from refreshed characters map
      const character = characters[characterId];

      // Create favorite from character (API response or static config)
      const favoriteData = character
        ? createFavoriteFromCharacterObject(character)
        : createFavoriteFromCharacter(characterId);

      if (!character) {
        logger.error("Character not found after creation, using fallback", {
          characterId,
        });
      }

      await deactivateAllFavorites(favorites, updateFavorite);

      await addFavorite({
        characterId: favoriteData.characterId,
        voice: favoriteData.voice,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      applyFavoriteSelection(favoriteData, onCharacterChange, onModelChange);

      closeModal();
    },
    [
      favorites,
      onCharacterChange,
      onModelChange,
      closeModal,
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

      // Get character data (from API response or built-in)
      const character =
        characters[newCharacterId] ?? getCharacterById(newCharacterId);

      // Prepare update - include voice
      const updates: Partial<FavoriteItem> = {
        characterId: newCharacterId,
        voice: character?.voice,
      };

      if (!keepSettings) {
        // Reset to character defaults
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
        const updatedFavorite: FavoriteItem = {
          ...editingFavorite,
          ...updates,
          modelSettings: updates.modelSettings || editingFavorite.modelSettings,
        };
        applyFavoriteSelection(
          updatedFavorite,
          onCharacterChange,
          onModelChange,
        );
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

  // Handle saving favorite during onboarding (called when clicking Continue on pick screen)
  const handleSaveFavorite = useCallback(
    async (selectedCharacterId: string): Promise<void> => {
      const favoriteData = createFavoriteFromCharacter(selectedCharacterId);

      await deactivateAllFavorites(favorites, updateFavorite);

      await addFavorite({
        characterId: favoriteData.characterId,
        voice: favoriteData.voice,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      applyFavoriteSelection(favoriteData, onCharacterChange, onModelChange);
    },
    [favorites, onCharacterChange, onModelChange, addFavorite, updateFavorite],
  );

  // Handle onboarding completion (Start Chatting clicked)
  const handleOnboardingComplete = useCallback(
    async (selectedCharacterId: string): Promise<void> => {
      // Check if favorite already exists for this character
      const existingFavorite = favorites.find(
        (f) => f.characterId === selectedCharacterId,
      );

      // Only save if no existing favorite (fallback case)
      if (!existingFavorite) {
        const favoriteData = createFavoriteFromCharacter(selectedCharacterId);

        await deactivateAllFavorites(favorites, updateFavorite);

        await addFavorite({
          characterId: favoriteData.characterId,
          voice: favoriteData.voice,
          modelSettings: favoriteData.modelSettings,
          isActive: true,
        });

        applyFavoriteSelection(favoriteData, onCharacterChange, onModelChange);
      }

      // Reset onboarding state and close modal
      setIsOnboardingActive(false);
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

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={triggerSize}
          className={cn(
            "h-auto min-h-9 gap-1.5 px-2 py-1.5 hover:bg-accent text-sm font-normal touch-manipulation",
            modelSupportsTools ? "@md:gap-2 @md:px-3" : "gap-2 px-3",
            buttonClassName,
          )}
          data-tour={TOUR_DATA_ATTRS.MODEL_SELECTOR}
          suppressHydrationWarning
        >
          {/* Character icon */}
          <Span className="flex items-center justify-center w-5 h-5 shrink-0">
            {currentCharacter
              ? renderIcon(currentCharacter.icon, "h-4 w-4")
              : null}
          </Span>

          {/* Character name - hidden when container is narrow, always shown when no tools */}
          <Span
            className={cn(
              "max-w-[80px] @xl:max-w-[100px] truncate",
              modelSupportsTools ? "hidden @md:inline" : "hidden @xs:inline",
            )}
          >
            {currentCharacter ? t(currentCharacter.name) : ""}
          </Span>

          {/* Separator - hidden when container is narrow, always shown when no tools */}
          <Span
            className={cn(
              "text-muted-foreground/50",
              modelSupportsTools ? "hidden @md:inline" : "inline",
            )}
          >
            +
          </Span>

          {/* Model icon */}
          <Span className="flex items-center justify-center w-5 h-5 shrink-0 opacity-70">
            {renderIcon(currentModel.icon, "h-4 w-4")}
          </Span>

          {/* Model name - hidden when container is too narrow, shown earlier when no tools */}
          <Span
            className={cn(
              "max-w-[80px] @2xl:max-w-[100px] truncate text-muted-foreground",
              modelSupportsTools ? "hidden @xl:inline" : "hidden @md:inline",
            )}
          >
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
        <Div
          className={cn(
            "flex flex-col overflow-hidden",
            // Only apply max height when NOT in early onboarding steps
            // (specialists step and non-onboarding views need fixed height)
            actualView !== "onboarding" || onboardingStep === "specialists"
              ? "max-h-[min(600px,calc(100dvh-100px))]"
              : "",
          )}
        >
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
          {!favoritesLoading && actualView === "onboarding" && (
            <SelectorOnboarding
              onSelect={handleOnboardingComplete}
              onSaveFavorite={handleSaveFavorite}
              onCustomize={handleCustomize}
              favorites={favorites}
              locale={locale}
              initialStep={onboardingStep}
              onStepChange={setOnboardingStep}
              initialSelectedId={onboardingSelectedId}
              onSelectedIdChange={setOnboardingSelectedId}
            />
          )}

          {/* Favorites view */}
          {!favoritesLoading && actualView === "favorites" && (
            <Div className="p-4 overflow-y-auto">
              <FavoritesBar
                favorites={favorites}
                onFavoriteSelect={handleFavoriteSelect}
                onSettingsClick={switchToSettings}
                onAddClick={switchToBrowser}
                locale={locale}
              />
            </Div>
          )}

          {/* Settings view */}
          {actualView === "settings" && editingFavorite && (
            <QuickSettingsPanel
              favorite={editingFavorite}
              onSave={handleSettingsSave}
              onCancel={() => {
                setEditingFavoriteId(null);
                setEditingCharacterId(null);
                // Return to onboarding if active, otherwise favorites
                if (isOnboardingActive) {
                  setView("onboarding");
                } else {
                  setView("favorites");
                }
              }}
              onDelete={
                editingCharacterId
                  ? undefined // Can't delete new character (not yet added)
                  : async () => {
                      const deletedId = editingFavorite.id;
                      const wasActive = editingFavorite.isActive;

                      // Calculate what will remain BEFORE deleting
                      const willRemain = favorites.filter(
                        (f) => f.id !== deletedId,
                      );
                      const willBeEmpty = willRemain.length === 0;

                      // Close settings panel
                      setEditingFavoriteId(null);

                      // Delete the favorite
                      await deleteFavorite(deletedId);

                      // If we deleted the active one and there are others, activate the first
                      if (wasActive && willRemain.length > 0) {
                        await setActiveFavorite(willRemain[0].id);
                      }

                      // Navigate based on what will remain
                      if (willBeEmpty) {
                        setIsOnboardingActive(true);
                        setOnboardingStep("story");
                        setView("onboarding");
                      } else {
                        setView("favorites");
                      }
                    }
              }
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
          {actualView === "browser" && (
            <CharacterBrowser
              onAddWithDefaults={handleAddWithDefaults}
              onCustomize={handleCustomize}
              onCreateCustom={() => setView("create")}
              onBack={() => setView("favorites")}
              locale={locale}
              favorites={favorites}
            />
          )}

          {/* Create character view */}
          {actualView === "create" && (
            <CreateCharacterForm
              onBack={() => setView("browser")}
              onSave={handleCharacterCreated}
              isAuthenticated={!!(user && !user.isPublic)}
              locale={locale}
            />
          )}

          {/* Edit character view */}
          {actualView === "edit" && editingCharacterData && (
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
          {actualView === "character-switch" && editingFavorite && (
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
              onCreateCustom={() => setView("create")}
              onBack={() => setView("settings")}
              locale={locale}
              favorites={favorites}
            />
          )}
        </Div>
      </PopoverContent>
    </Popover>
  );
}
