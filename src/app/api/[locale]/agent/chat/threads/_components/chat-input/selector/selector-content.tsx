"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useChatFavorites } from "@/app/api/[locale]/agent/chat/favorites/hooks";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { BrowserView } from "../../../../characters/components/browser-view";
import { CharacterSwitchView } from "../../../../characters/components/character-switch-view";
import { CreateCharacterForm } from "../../../../characters/components/create-character-form";
import { EditCharacter } from "../../../../characters/components/edit-character";
import { EditFavorite } from "../../../../favorites/components/favorites-edit/settings-view";
import { FavoritesList } from "../../../../favorites/components/favorites-list";
import { SelectorOnboarding } from "./selector-onboarding";

type SelectorView =
  | "onboarding"
  | "favorites"
  | "settings"
  | "browser"
  | "create"
  | "edit"
  | "character-switch";

interface SelectorContentProps {
  characterId: string;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  onClose: () => void;
  onboardingStep: "story" | "pick" | "specialists";
  onOnboardingStepChange: (step: "story" | "pick" | "specialists") => void;
  isOnboardingActive: boolean;
  onOnboardingActiveChange: (active: boolean) => void;
}

export function SelectorContent({
  characterId,
  locale,
  user,
  logger,
  onClose,
  onboardingStep,
  onOnboardingStepChange,
  isOnboardingActive,
  onOnboardingActiveChange,
}: SelectorContentProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get characters from chat context (already fetched by useChat)
  const chat = useChatContext();
  const characters = chat.characters;

  // Fetch favorites - only when content is rendered (popover open)
  const {
    favorites,
    isLoading: favoritesLoading,
    activeFavoriteId,
    endpoint,
    addFavorite,
  } = useChatFavorites({
    user,
    logger,
    characters,
  });

  // Local state
  const [view, setView] = useState<SelectorView>("favorites");
  const [onboardingSelectedId, setOnboardingSelectedId] = useState<
    string | null
  >(null);

  const needsOnboarding = useMemo(() => {
    return !favoritesLoading && favorites.length === 0;
  }, [favorites, favoritesLoading]);

  const [editingFavoriteId, setEditingFavoriteId] = useState<string | null>(
    null,
  );
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(
    null,
  );

  // Set initial view once after first successful data load
  const hasSetInitialView = useRef(false);
  const hasReceivedData = useRef(false);

  // Track when we've received data at least once
  useEffect(() => {
    if (endpoint.read?.data) {
      hasReceivedData.current = true;
    }
  }, [endpoint.read?.data]);

  useEffect(() => {
    // Only set initial view after we've received data at least once
    if (
      !favoritesLoading &&
      hasReceivedData.current &&
      !hasSetInitialView.current
    ) {
      // Set view based on whether we have favorites
      const targetView = needsOnboarding ? "onboarding" : "favorites";
      setView(targetView);

      // Sync onboarding active state
      onOnboardingActiveChange(needsOnboarding);

      hasSetInitialView.current = true;
    }
  }, [
    favoritesLoading,
    needsOnboarding,
    onOnboardingActiveChange,
    favorites,
    endpoint.read?.data,
  ]);

  // Derive actual view
  // If no favorites exist, force onboarding unless in settings/edit
  // Otherwise, use the view state
  const actualView =
    needsOnboarding && view !== "settings" && view !== "edit"
      ? "onboarding"
      : view;

  // Close modal and reset to favorites view
  const closeModal = useCallback((): void => {
    setView("favorites");
    hasSetInitialView.current = false; // Reset for next open
    hasReceivedData.current = false; // Reset data tracking
    onClose();
  }, [onClose]);

  // Handle customize character for onboarding
  const handleCustomize = useCallback((newCharacterId: string): void => {
    setEditingCharacterId(newCharacterId);
    setEditingFavoriteId(null);
    setView("settings");
  }, []);

  // Handle favorite selection
  const handleFavoriteSelect = useCallback(
    (favoriteId: string): void => {
      const favorite = favorites.find((f) => f.id === favoriteId);
      if (!favorite || !favorite.characterId || !favorite.modelId) {
        return;
      }

      chat.setActiveFavorite(
        favoriteId,
        favorite.characterId,
        favorite.modelId,
        chat.ttsVoice,
      );
      onClose();
    },
    [favorites, chat, onClose],
  );
  return (
    <Div>
      {/* Onboarding view - shown on first open when no favorites exist */}
      {actualView === "onboarding" &&
        (favoritesLoading ? (
          <Div className="flex items-center justify-center p-8">
            <Div className="flex flex-col items-center gap-3">
              <Div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <Span className="text-sm text-muted-foreground">
                {t("app.chat.selector.loading")}
              </Span>
            </Div>
          </Div>
        ) : (
          <SelectorOnboarding
            initialStep={onboardingStep}
            onStepChange={onOnboardingStepChange}
            initialSelectedId={onboardingSelectedId}
            onSelectedIdChange={setOnboardingSelectedId}
            favorites={favorites}
            addFavorite={addFavorite}
            onOnboardingComplete={() => {
              onOnboardingActiveChange(false);
              onClose();
            }}
            onCustomize={handleCustomize}
            locale={locale}
            logger={logger}
          />
        ))}

      {/* Favorites view */}
      {actualView === "favorites" && (
        <FavoritesList
          activeFavoriteId={activeFavoriteId}
          onSettingsClick={(favoriteId) => {
            setEditingFavoriteId(favoriteId);
            setView("settings");
          }}
          onAddClick={() => setView("browser")}
          locale={locale}
          favorites={favorites}
          favoritesLoading={favoritesLoading}
          onFavoriteSelect={handleFavoriteSelect}
        />
      )}

      {/* Settings view */}
      {actualView === "settings" && (
        <EditFavorite
          editingFavoriteId={editingFavoriteId}
          editingCharacterId={editingCharacterId}
          isAuthenticated={!!(user && !user.isPublic)}
          locale={locale}
          characterId={characterId}
          isOnboardingActive={isOnboardingActive}
          favorites={favorites}
          addFavorite={addFavorite}
          onEditingClear={() => {
            setEditingFavoriteId(null);
            setEditingCharacterId(null);
          }}
          onViewChange={setView}
          onOnboardingActiveChange={onOnboardingActiveChange}
          onOnboardingStepChange={onOnboardingStepChange}
          logger={logger}
        />
      )}

      {/* Browser view */}
      {actualView === "browser" && (
        <BrowserView
          onCreateCustom={() => setView("create")}
          onBack={() => setView("favorites")}
          locale={locale}
          logger={logger}
          user={user}
          onEditingCharacterIdChange={setEditingCharacterId}
          onEditingFavoriteIdChange={setEditingFavoriteId}
          onViewChange={(view) =>
            setView(view === "settings" ? "settings" : "favorites")
          }
          addFavorite={addFavorite}
        />
      )}

      {/* Create character view */}
      {actualView === "create" && (
        <CreateCharacterForm
          user={user}
          onBack={() => setView("browser")}
          isAuthenticated={!!(user && !user.isPublic)}
          locale={locale}
          closeModal={closeModal}
          logger={logger}
        />
      )}

      {/* Edit character view */}
      {actualView === "edit" && editingCharacterId && (
        <EditCharacter
          user={user}
          onBack={() => setView("settings")}
          onCharacterEdited={() => {
            setView("favorites");
          }}
          characterId={editingCharacterId}
          editingFavoriteId={editingFavoriteId}
          isAuthenticated={!!(user && !user.isPublic)}
          locale={locale}
          logger={logger}
        />
      )}

      {/* Character switch view - allows changing character without deleting favorite */}
      {actualView === "character-switch" && editingFavoriteId && (
        <CharacterSwitchView
          editingFavoriteId={editingFavoriteId}
          favorites={favorites}
          onViewChange={setView}
          locale={locale}
          logger={logger}
          user={user}
        />
      )}
    </Div>
  );
}
