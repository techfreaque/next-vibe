"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Popover, PopoverContent, PopoverTrigger } from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TOUR_DATA_ATTRS } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-config";
import { useTourState } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-state-context";
import { CharacterBrowser } from "@/app/api/[locale]/agent/chat/characters/components/character-browser";
import { CreateCharacterForm } from "@/app/api/[locale]/agent/chat/characters/components/create-character-form";
import { EditCharacterModal } from "@/app/api/[locale]/agent/chat/characters/components/edit-character-modal";
import charactersDefinition, {
  type CharacterListResponseOutput,
} from "@/app/api/[locale]/agent/chat/characters/definition";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type { FavoriteUpdateRequestOutput } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import {
  type FavoriteItem,
  FavoritesBar,
} from "@/app/api/[locale]/agent/chat/favorites/components/favorites-bar";
import { useChatFavorites } from "@/app/api/[locale]/agent/chat/favorites/hooks";
import { type ModelId, modelOptions } from "@/app/api/[locale]/agent/models/models";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { Icon } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { QuickSettingsPanel } from "./quick-settings-panel";
import { SelectorOnboarding } from "./selector-onboarding";

interface SelectorProps {
  characterId: string;
  modelId: ModelId;
  activeFavoriteId?: string | null;
  onCharacterChange: (characterId: string) => void;
  onModelChange: (modelId: ModelId) => void;
  onActiveFavoriteChange?: (favoriteId: string | null) => void;
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
    activeFavoriteId,
  } = useChatFavorites({
    user,
    logger,
  });

  // Fetch characters list (for edit character feature)
  const charactersEndpoint = useEndpoint(charactersDefinition, {}, logger);
  const characters = useMemo(() => {
    return CharactersRepositoryClient.buildCharacterMapFromResponse(
      charactersEndpoint.read?.response,
    );
  }, [charactersEndpoint.read?.response]);

  // Local state
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [view, setView] = useState<SelectorView>("favorites");
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<"story" | "pick" | "specialists">("story");
  const [onboardingSelectedId, setOnboardingSelectedId] = useState<string | null>(null);

  const needsOnboarding = useMemo(() => {
    return !favoritesLoading && favorites.length === 0;
  }, [favorites, favoritesLoading]);

  // Use tour state if active
  const open = tourIsActive ? tourOpen : popoverOpen;

  const [editingFavoriteId, setEditingFavoriteId] = useState<string | null>(null);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
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
  }, [tourIsActive, tourOpen, needsOnboarding, favoritesLoading, isOnboardingActive]);

  // Derive actual view - allow switching to settings even during onboarding
  const actualView =
    isOnboardingActive && view !== "settings" && view !== "edit" ? "onboarding" : view;

  // Get current selections
  const currentCharacter = useMemo(
    () => characters[characterId] ?? null,
    [characters, characterId],
  );
  const currentModel = useMemo(() => modelOptions[modelId], [modelId]);
  const modelSupportsTools = currentModel?.supportsTools ?? false;

  // Get active favorite
  const activeFavorite = useMemo(() => favorites.find((f) => f.isActive), [favorites]);

  // Get the favorite being edited (could be different from active)
  const editingFavorite = useMemo(() => {
    if (editingFavoriteId) {
      return favorites.find((f) => f.id === editingFavoriteId);
    }
    if (editingCharacterId) {
      // Create temporary favorite for new character (not yet persisted)
      return createFavoriteFromCharacter(editingCharacterId, characters);
    }
    return activeFavorite;
  }, [editingFavoriteId, editingCharacterId, favorites, activeFavorite, characters]);

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
    [tourIsActive, setTourOpen, needsOnboarding, favoritesLoading, isOnboardingActive],
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
        applyFavoriteSelection(selected, characters, onCharacterChange, onModelChange);
      }

      closeModal();
    },
    [favorites, onCharacterChange, onModelChange, closeModal, setActiveFavorite, characters],
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
      modelSelection: FavoriteItem["modelSelection"],
      saveMode: "temporary" | "update" | "new",
    ): Promise<void> => {
      if (!editingFavorite) {
        return;
      }

      const updatedFavorite: FavoriteItem = {
        ...editingFavorite,
        modelSelection,
      };

      // Check if this is a new character (not yet added to favorites)
      const isNewCharacter = !!editingCharacterId;

      if (saveMode === "temporary") {
        // Just apply to current chat without saving
        applyFavoriteSelection(updatedFavorite, characters, onCharacterChange, onModelChange);
      } else if (saveMode === "update") {
        if (isNewCharacter) {
          // Creating new favorite from character browser
          await addFavorite({
            characterId: editingFavorite.characterId,
            customName: editingFavorite.customName,
            customIcon: editingFavorite.customIcon,
            voice: editingFavorite.voice,
            modelSelection,
            position: editingFavorite.position,
            color: editingFavorite.color,
            isActive: false,
            useCount: editingFavorite.useCount,
          });
        } else {
          // Update existing favorite (persists to server if authenticated)
          await updateFavorite(editingFavorite.id, { modelSelection });

          // Apply changes if this is the active favorite
          if (editingFavorite.isActive) {
            applyFavoriteSelection(updatedFavorite, characters, onCharacterChange, onModelChange);
          }
        }
      } else {
        // Deactivate existing favorites before creating new one
        await deactivateAllFavorites(favorites, updateFavorite);

        // Create new favorite (persists to server if authenticated)
        await addFavorite({
          characterId: editingFavorite.characterId,
          customName: editingFavorite.customName,
          customIcon: editingFavorite.customIcon,
          voice: editingFavorite.voice,
          modelSelection,
          position: editingFavorite.position,
          color: editingFavorite.color,
          isActive: true,
          useCount: editingFavorite.useCount,
        });

        // Apply changes (new favorite is always active)
        applyFavoriteSelection(updatedFavorite, characters, onCharacterChange, onModelChange);
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
      characters,
    ],
  );

  // Handle add character with defaults - just add to favorites, don't activate
  const handleAddWithDefaults = useCallback(
    async (newCharacterId: string): Promise<void> => {
      // Check if non-customized version already exists
      const exists = favorites.some(
        (f) => f.characterId === newCharacterId && !f.customName && !f.customIcon,
      );

      // Don't add duplicates
      if (exists) {
        return;
      }

      const favoriteData = createFavoriteFromCharacter(newCharacterId, characters);

      await addFavorite({
        characterId: favoriteData.characterId,
        customName: favoriteData.customName,
        customIcon: favoriteData.customIcon,
        voice: favoriteData.voice,
        modelSelection: favoriteData.modelSelection,
        position: favoriteData.position,
        color: favoriteData.color,
        isActive: false,
        useCount: favoriteData.useCount,
      });
    },
    [addFavorite, favorites, characters],
  );

  // Handle customize character - open settings for character WITHOUT adding to favorites
  const handleCustomize = useCallback(
    (newCharacterId: string): void => {
      // Check if non-customized version already exists
      const existingFavorite = favorites.find(
        (f) => f.characterId === newCharacterId && !f.customName && !f.customIcon,
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
        : createFavoriteFromCharacter(characterId, characters);

      if (!character) {
        logger.error("Character not found after creation, using fallback", {
          characterId,
        });
      }

      await deactivateAllFavorites(favorites, updateFavorite);

      await addFavorite({
        characterId: favoriteData.characterId,
        customName: favoriteData.customName,
        customIcon: favoriteData.customIcon,
        voice: favoriteData.voice,
        modelSelection: favoriteData.modelSelection,
        position: favoriteData.position,
        color: favoriteData.color,
        isActive: true,
        useCount: favoriteData.useCount,
      });

      applyFavoriteSelection(favoriteData, characters, onCharacterChange, onModelChange);

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

      // Get character data from API response
      const character = characters[newCharacterId];

      // Prepare update - include voice
      const updates: Partial<FavoriteItem> = {
        characterId: newCharacterId,
        voice: character?.voice,
      };

      if (!keepSettings && character) {
        // Reset to character defaults using the helper function
        updates.modelSelection = extractModelSelectionFromCharacter(character);
      }

      // Update the favorite (persists to server if authenticated)
      await updateFavorite(editingFavorite.id, updates);

      // If this is the active favorite, apply the character change
      if (editingFavorite.isActive) {
        const updatedFavorite: FavoriteItem = {
          ...editingFavorite,
          ...updates,
          modelSelection: updates.modelSelection || editingFavorite.modelSelection,
        };
        applyFavoriteSelection(updatedFavorite, characters, onCharacterChange, onModelChange);
      }
    },
    [editingFavorite, updateFavorite, onCharacterChange, onModelChange, characters],
  );

  // Handle saving favorite during onboarding (called when clicking Continue on pick screen)
  const handleSaveFavorite = useCallback(
    async (selectedCharacterId: string): Promise<void> => {
      const favoriteData = createFavoriteFromCharacter(selectedCharacterId, characters);

      await deactivateAllFavorites(favorites, updateFavorite);

      await addFavorite({
        characterId: favoriteData.characterId,
        customName: favoriteData.customName,
        customIcon: favoriteData.customIcon,
        voice: favoriteData.voice,
        modelSelection: favoriteData.modelSelection,
        position: favoriteData.position,
        color: favoriteData.color,
        isActive: true,
        useCount: favoriteData.useCount,
      });

      applyFavoriteSelection(favoriteData, characters, onCharacterChange, onModelChange);
    },
    [favorites, onCharacterChange, onModelChange, addFavorite, updateFavorite, characters],
  );

  // Handle onboarding completion (Start Chatting clicked)
  const handleOnboardingComplete = useCallback(
    async (selectedCharacterId: string): Promise<void> => {
      // Check if favorite already exists for this character
      const existingFavorite = favorites.find((f) => f.characterId === selectedCharacterId);

      // Only save if no existing favorite (fallback case)
      if (!existingFavorite) {
        const favoriteData = createFavoriteFromCharacter(selectedCharacterId, characters);

        await deactivateAllFavorites(favorites, updateFavorite);

        await addFavorite({
          characterId: favoriteData.characterId,
          customName: favoriteData.customName,
          customIcon: favoriteData.customIcon,
          voice: favoriteData.voice,
          modelSelection: favoriteData.modelSelection,
          position: favoriteData.position,
          color: favoriteData.color,
          isActive: true,
          useCount: favoriteData.useCount,
        });

        applyFavoriteSelection(favoriteData, characters, onCharacterChange, onModelChange);
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
      characters,
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
            {currentCharacter ? renderIcon(currentCharacter.icon, "h-4 w-4") : null}
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
            {currentModel?.icon ? renderIcon(currentModel.icon, "h-4 w-4") : null}
          </Span>

          {/* Model name - hidden when container is too narrow, shown earlier when no tools */}
          <Span
            className={cn(
              "max-w-[80px] @2xl:max-w-[100px] truncate text-muted-foreground",
              modelSupportsTools ? "hidden @xl:inline" : "hidden @md:inline",
            )}
          >
            {currentModel?.name}
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
              characters={characters}
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
                characters={characters}
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
                      const willRemain = favorites.filter((f) => f.id !== deletedId);
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
