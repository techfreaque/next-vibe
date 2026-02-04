"use client";

import type { JSX } from "react";
import { useCallback } from "react";

import { CharacterBrowser } from "@/app/api/[locale]/agent/chat/characters/components/character-browser";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import type { FavoriteCreateRequestOutput } from "@/app/api/[locale]/agent/chat/favorites/create/definition";
import { useChatFavorites } from "@/app/api/[locale]/agent/chat/favorites/hooks";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

interface BrowserViewProps {
  onCreateCustom: () => void;
  onBack: () => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  onEditingCharacterIdChange: (characterId: string | null) => void;
  onEditingFavoriteIdChange: (favoriteId: string | null) => void;
  onViewChange: (view: "settings" | "favorites") => void;
  addFavorite: (data: FavoriteCreateRequestOutput) => Promise<string | null>;
}

export function BrowserView({
  onCreateCustom,
  onBack,
  locale,
  logger,
  onEditingCharacterIdChange,
  onEditingFavoriteIdChange,
  onViewChange,
  addFavorite,
}: BrowserViewProps): JSX.Element {
  // Get characters from chat context (already fetched by useChat)
  const { characters, user } = useChatContext();

  // Fetch favorites for display
  const { favorites } = useChatFavorites({
    logger,
    characters,
  });

  // Handle add character with defaults - just add to favorites, don't activate
  const handleAddWithDefaults = useCallback(
    async (newCharacterId: string): Promise<void> => {
      const character = characters[newCharacterId];
      if (!character) {
        logger.error("Character not found", { characterId: newCharacterId });
        return;
      }

      // Server will populate characterModelSelection from the character
      const favoriteData: FavoriteCreateRequestOutput = {
        characterId: newCharacterId,
        modelSelection: {
          currentSelection: {
            selectionType: ModelSelectionType.CHARACTER_BASED,
          },
        },
      };

      await addFavorite(favoriteData);
    },
    [addFavorite, characters, logger],
  );

  // Handle customize character - open settings for character WITHOUT adding to favorites
  const handleCustomize = useCallback(
    (newCharacterId: string): void => {
      onEditingCharacterIdChange(newCharacterId);
      onEditingFavoriteIdChange(null);
      onViewChange("settings");
    },
    [onEditingCharacterIdChange, onEditingFavoriteIdChange, onViewChange],
  );

  return (
    <CharacterBrowser
      onAddWithDefaults={handleAddWithDefaults}
      onCustomize={handleCustomize}
      onCreateCustom={onCreateCustom}
      onBack={onBack}
      locale={locale}
      favorites={favorites}
      logger={logger}
      user={user}
    />
  );
}
