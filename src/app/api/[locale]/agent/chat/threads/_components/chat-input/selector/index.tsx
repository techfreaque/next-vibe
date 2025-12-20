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
import {
  getIconComponent,
  type IconKey,
} from "@/app/api/[locale]/agent/chat/model-access/icons";
import {
  type ModelId,
  modelOptions,
} from "@/app/api/[locale]/agent/chat/model-access/models";
import { getPersonaById } from "@/app/api/[locale]/agent/chat/personas/config";
import {
  type ContentLevel,
  type IntelligenceLevel,
  type PriceLevel,
} from "@/app/api/[locale]/agent/chat/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CharacterBrowser } from "./character-browser";
import { CreatePersonaForm } from "./create-persona-form";
import { type FavoriteItem, FavoritesBar } from "./favorites-bar";
import { QuickSettingsPanel } from "./quick-settings-panel";
import { SelectorOnboarding } from "./selector-onboarding";
import { findBestModel } from "./types";
import { useChatFavorites } from "./use-chat-favorites";

interface SelectorProps {
  personaId: string;
  modelId: ModelId;
  onPersonaChange: (personaId: string) => void;
  onModelChange: (modelId: ModelId) => void;
  locale: CountryLanguage;
  user?: JwtPayloadType;
  logger: EndpointLogger;
  className?: string;
  buttonClassName?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
}

type SelectorView = "onboarding" | "favorites" | "settings" | "browser" | "create";


/**
 * Create a new favorite from persona
 */
function createFavoriteFromPersona(
  personaId: string | null,
  intelligence: IntelligenceLevel = "smart",
  maxPrice: PriceLevel = "standard",
  content: ContentLevel = "open",
): FavoriteItem {
  const persona = personaId ? getPersonaById(personaId) : null;

  // Use persona requirements to set defaults
  let defaultContent = content;
  if (persona?.requirements?.minContent) {
    const contentOrder: ContentLevel[] = ["mainstream", "open", "uncensored"];
    const requiredIndex = contentOrder.indexOf(persona.requirements.minContent);
    const currentIndex = contentOrder.indexOf(content);
    if (currentIndex < requiredIndex) {
      defaultContent = persona.requirements.minContent;
    }
  }

  return {
    id: `local-${Date.now()}-${personaId ?? "model"}`,
    personaId,
    modelSettings: {
      mode: "auto",
      filters: {
        intelligence,
        maxPrice,
        content: defaultContent,
      },
    },
    isActive: false,
  };
}

export function Selector({
  personaId,
  modelId,
  onPersonaChange,
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

  // Local state
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [view, setView] = useState<SelectorView>("favorites");

  const [needsOnboarding, setNeedsOnboarding] = useState(true);

  // Show onboarding when there are no favorites
  useEffect(() => {
    if (!favoritesLoading) {
      // Show onboarding if user has no favorites
      setNeedsOnboarding(favorites.length === 0);
    }
  }, [favoritesLoading, favorites.length]);
  const [editingFavoriteId, setEditingFavoriteId] = useState<string | null>(null);

  // Handle tour opening the selector - set correct view only on OPEN
  const prevTourOpen = useRef(tourOpen);
  useEffect(() => {
    // Only run when tourOpen transitions from false to true (opening)
    if (tourIsActive && tourOpen && !prevTourOpen.current) {
      // When tour opens the selector, show onboarding if needed
      if (needsOnboarding) {
        setView("onboarding");
      } else {
        setView("favorites");
      }
    }
    prevTourOpen.current = tourOpen;
  }, [tourIsActive, tourOpen, needsOnboarding]);

  // Get current selections
  const currentPersona = useMemo(() => getPersonaById(personaId), [personaId]);
  const currentModel = useMemo(() => modelOptions[modelId], [modelId]);

  // Get active favorite
  const activeFavorite = useMemo(
    () => favorites.find((f) => f.isActive),
    [favorites],
  );

  // Get the favorite being edited (could be different from active)
  const editingFavorite = useMemo(
    () => editingFavoriteId ? favorites.find((f) => f.id === editingFavoriteId) : activeFavorite,
    [editingFavoriteId, favorites, activeFavorite],
  );

  // Use tour state if active
  const open = tourIsActive ? tourOpen : popoverOpen;

  // Handle open state changes
  const handleOpenChange = useCallback(
    (newOpen: boolean): void => {
      if (tourIsActive) {
        setTourOpen(newOpen);
      } else {
        setPopoverOpen(newOpen);
      }

      if (newOpen) {
        // When opening, check if we need onboarding
        if (needsOnboarding) {
          setView("onboarding");
        } else {
          setView("favorites");
        }
      } else {
        // When closing, reset view
        setView("favorites");
      }
    },
    [tourIsActive, setTourOpen, needsOnboarding],
  );

  // Handle favorite selection
  const handleFavoriteSelect = useCallback(
    async (favoriteId: string): Promise<void> => {
      // Set this favorite as active (persists to server if authenticated)
      await setActiveFavorite(favoriteId);

      const selected = favorites.find((f) => f.id === favoriteId);
      if (selected) {
        // Only change persona if not model-only
        if (selected.personaId) {
          onPersonaChange(selected.personaId);
        }

        // Resolve model
        const allModels = Object.values(modelOptions);
        const persona = selected.personaId
          ? getPersonaById(selected.personaId)
          : null;
        if (
          selected.modelSettings.mode === "manual" &&
          selected.modelSettings.manualModelId
        ) {
          // Manual mode - use selected model
          onModelChange(selected.modelSettings.manualModelId as ModelId);
        } else if (persona) {
          // Auto mode with persona - find best matching model
          const bestModel = findBestModel(allModels, persona, {
            intelligence: selected.modelSettings.filters.intelligence,
            maxPrice: selected.modelSettings.filters.maxPrice,
            minContent: selected.modelSettings.filters.content,
          });
          if (bestModel) {
            onModelChange(bestModel.id);
          }
        } else {
          // Model-only: use first model matching filters
          const matchingModel = allModels.find((m) => {
            const { filters } = selected.modelSettings;
            if (
              filters.intelligence !== "any" &&
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
    [favorites, onPersonaChange, onModelChange, handleOpenChange, setActiveFavorite],
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

      // Helper to apply model changes
      const applyModelChange = (): void => {
        const allModels = Object.values(modelOptions);
        if (settings.mode === "manual" && settings.manualModelId) {
          onModelChange(settings.manualModelId as ModelId);
        } else {
          const persona = editingFavorite.personaId
            ? getPersonaById(editingFavorite.personaId)
            : null;
          if (persona) {
            const bestModel = findBestModel(allModels, persona, {
              intelligence: settings.filters.intelligence,
              maxPrice: settings.filters.maxPrice,
              minContent: settings.filters.content,
            });
            if (bestModel) {
              onModelChange(bestModel.id);
            }
          }
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
          personaId: editingFavorite.personaId,
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
    [editingFavorite, favorites, onModelChange, handleOpenChange, addFavorite, updateFavorite],
  );

  // Handle add character with defaults
  const handleAddWithDefaults = useCallback(
    async (newPersonaId: string): Promise<void> => {
      const favoriteData = createFavoriteFromPersona(newPersonaId);

      // Deactivate existing favorites
      for (const f of favorites) {
        if (f.isActive) {
          await updateFavorite(f.id, { isActive: false });
        }
      }

      // Add new favorite (persists to server if authenticated)
      await addFavorite({
        personaId: favoriteData.personaId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      // Apply selection
      onPersonaChange(newPersonaId);
      const persona = getPersonaById(newPersonaId);
      if (persona) {
        const allModels = Object.values(modelOptions);
        const bestModel = findBestModel(allModels, persona, {
          intelligence: favoriteData.modelSettings.filters.intelligence,
          maxPrice: favoriteData.modelSettings.filters.maxPrice,
          minContent: favoriteData.modelSettings.filters.content,
        });
        if (bestModel) {
          onModelChange(bestModel.id);
        }
      }

      setView("favorites");
      handleOpenChange(false);
    },
    [favorites, onPersonaChange, onModelChange, handleOpenChange, addFavorite, updateFavorite],
  );

  // Handle customize character
  const handleCustomize = useCallback(
    async (newPersonaId: string): Promise<void> => {
      // Create favorite for customization
      const favoriteData = createFavoriteFromPersona(newPersonaId);

      // Deactivate existing favorites
      for (const f of favorites) {
        if (f.isActive) {
          await updateFavorite(f.id, { isActive: false });
        }
      }

      // Add new favorite (persists to server if authenticated)
      const newFavorite = await addFavorite({
        personaId: favoriteData.personaId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      setEditingFavoriteId(newFavorite.id);
      setView("settings");
    },
    [favorites, addFavorite, updateFavorite],
  );

  // Handle create custom persona
  const handleCreateCustom = useCallback((): void => {
    setView("create");
  }, []);

  // Handle custom persona created
  const handlePersonaCreated = useCallback(
    async (personaId: string): Promise<void> => {
      // Create favorite from the new custom persona
      const favoriteData = createFavoriteFromPersona(personaId);

      // Deactivate existing favorites
      for (const f of favorites) {
        if (f.isActive) {
          await updateFavorite(f.id, { isActive: false });
        }
      }

      // Add new favorite (persists to server if authenticated)
      await addFavorite({
        personaId: favoriteData.personaId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      // Apply selection
      onPersonaChange(personaId);

      // Try to get persona and find best model
      const persona = getPersonaById(personaId);
      if (persona) {
        const allModels = Object.values(modelOptions);
        const bestModel = findBestModel(allModels, persona, {
          intelligence: favoriteData.modelSettings.filters.intelligence,
          maxPrice: favoriteData.modelSettings.filters.maxPrice,
          minContent: favoriteData.modelSettings.filters.content,
        });
        if (bestModel) {
          onModelChange(bestModel.id);
        }
      }

      setView("favorites");
      handleOpenChange(false);
    },
    [favorites, onPersonaChange, onModelChange, handleOpenChange, addFavorite, updateFavorite],
  );

  // Track if favorite was already saved during onboarding
  const savedOnboardingPersonaRef = useRef<string | null>(null);

  // Handle saving favorite during onboarding (called when clicking Continue on pick screen)
  const handleSaveFavorite = useCallback(
    async (selectedPersonaId: string): Promise<void> => {
      // Create favorite from selected character
      const favoriteData = createFavoriteFromPersona(selectedPersonaId);

      // Add new favorite (persists to server if authenticated)
      await addFavorite({
        personaId: favoriteData.personaId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      // Track that we saved this persona's favorite
      savedOnboardingPersonaRef.current = selectedPersonaId;

      // Apply selection immediately
      onPersonaChange(selectedPersonaId);
      const persona = getPersonaById(selectedPersonaId);
      if (persona) {
        const allModels = Object.values(modelOptions);
        const bestModel = findBestModel(allModels, persona, {
          intelligence: favoriteData.modelSettings.filters.intelligence,
          maxPrice: favoriteData.modelSettings.filters.maxPrice,
          minContent: favoriteData.modelSettings.filters.content,
        });
        if (bestModel) {
          onModelChange(bestModel.id);
        }
      }
    },
    [onPersonaChange, onModelChange, addFavorite],
  );

  // Handle onboarding completion (Start Chatting clicked)
  const handleOnboardingComplete = useCallback(
    async (selectedPersonaId: string): Promise<void> => {
      // Close the popover FIRST to ensure tour resumes
      // Tour advancement is handled by welcome-tour when modal closes
      handleOpenChange(false);

      // If favorite was already saved in handleSaveFavorite, skip saving again
      if (savedOnboardingPersonaRef.current === selectedPersonaId) {
        savedOnboardingPersonaRef.current = null;
        return;
      }

      // Fallback: save favorite if not already saved (shouldn't happen normally)
      const favoriteData = createFavoriteFromPersona(selectedPersonaId);

      // Add new favorite (persists to server if authenticated)
      await addFavorite({
        personaId: favoriteData.personaId,
        modelSettings: favoriteData.modelSettings,
        isActive: true,
      });

      // Apply selection
      onPersonaChange(selectedPersonaId);
      const persona = getPersonaById(selectedPersonaId);
      if (persona) {
        const allModels = Object.values(modelOptions);
        const bestModel = findBestModel(allModels, persona, {
          intelligence: favoriteData.modelSettings.filters.intelligence,
          maxPrice: favoriteData.modelSettings.filters.maxPrice,
          minContent: favoriteData.modelSettings.filters.content,
        });
        if (bestModel) {
          onModelChange(bestModel.id);
        }
      }
    },
    [onPersonaChange, onModelChange, handleOpenChange, addFavorite],
  );

  // Handle browse all characters from onboarding
  const handleBrowseAll = useCallback((): void => {
    setView("browser");
  }, []);

  // Render icon helper
  const renderIcon = (icon: IconKey, iconClassName = "h-4 w-4"): JSX.Element => {
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
          {/* Persona icon */}
          <Span className="flex items-center justify-center w-5 h-5 shrink-0">
            {renderIcon(currentPersona.icon, "h-4 w-4")}
          </Span>

          {/* Persona name - hidden on mobile */}
          <Span className="hidden sm:inline max-w-[80px] md:max-w-[100px] truncate">
            {t(currentPersona.name)}
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
          "p-0 w-[calc(100vw-16px)] sm:w-[480px] max-w-[520px]",
          // Ensure popover appears above tour overlay (z-index 10000) when tour is active
          tourIsActive && "z-[10001]",
          className,
        )}
        align="start"
        side="top"
        sideOffset={8}
      >
        <Div className="flex flex-col max-h-[min(600px,calc(100dvh-100px))] overflow-hidden">
          {/* Onboarding view - shown on first open */}
          {view === "onboarding" && (
            <SelectorOnboarding
              onSelect={handleOnboardingComplete}
              onSaveFavorite={handleSaveFavorite}
              onBrowseAll={handleBrowseAll}
              locale={locale}
            />
          )}

          {/* Favorites view */}
          {view === "favorites" && (
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
                  const remaining = favorites.filter((f) => f.id !== editingFavorite.id);
                  if (remaining.length > 0) {
                    await setActiveFavorite(remaining[0].id);
                  }
                }

                setEditingFavoriteId(null);
                setView("favorites");
              }}
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

          {/* Create persona view */}
          {view === "create" && (
            <CreatePersonaForm
              onSave={handlePersonaCreated}
              onCancel={() => setView("browser")}
              locale={locale}
            />
          )}
        </Div>
      </PopoverContent>
    </Popover>
  );
}
