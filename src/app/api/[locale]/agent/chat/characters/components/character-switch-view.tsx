"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useCallback, useMemo } from "react";

import { CharacterBrowser } from "@/app/api/[locale]/agent/chat/characters/components/character-browser";
import type { FavoriteUpdateRequestOutput } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { useFavorite } from "../../favorites/[id]/hooks";

interface CharacterSwitchViewProps {
  editingFavoriteId: string;
  favorites: FavoriteCard[];
  onViewChange: (
    view:
      | "favorites"
      | "onboarding"
      | "edit"
      | "character-switch"
      | "settings"
      | "browser"
      | "create",
  ) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function CharacterSwitchView({
  editingFavoriteId,
  favorites,
  onViewChange,
  locale,
  logger,
  user,
}: CharacterSwitchViewProps): JSX.Element {
  // Fetch full favorite data for character switching
  const editingFavoriteEndpoint = useFavorite(editingFavoriteId, user, logger);

  const editingFavorite = useMemo(
    () => editingFavoriteEndpoint.read?.data ?? null,
    [editingFavoriteEndpoint.read?.data],
  );

  const chat = useChatContext();

  const handleCharacterSwitch = useCallback(
    async (characterId: string, keepSettings: boolean) => {
      if (!editingFavorite) {
        return;
      }

      const updates: FavoriteUpdateRequestOutput = {
        characterId,
        character: {
          info: {
            icon: editingFavorite.character.info.icon,
          },
        },
        voice: keepSettings ? editingFavorite.voice : undefined,
        modelSelection: editingFavorite.modelSelection,
      };

      await editingFavoriteEndpoint.updateFavorite(updates);

      const newCharacter = chat.characters[characterId];
      if (!newCharacter) {
        logger.error("Character not found", { characterId });
        return;
      }

      chat.setActiveFavorite(
        editingFavorite.id,
        characterId,
        newCharacter.modelId,
        chat.ttsVoice,
      );
    },
    [editingFavorite, chat, editingFavoriteEndpoint, logger],
  );

  if (!editingFavorite) {
    return (
      <Div className="flex items-center justify-center p-8">
        <Div className="flex flex-col items-center gap-3">
          <Div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </Div>
      </Div>
    );
  }

  return (
    <CharacterBrowser
      onAddWithDefaults={async (characterId) => {
        await handleCharacterSwitch(characterId, false);
        onViewChange("settings");
      }}
      onCustomize={async (characterId) => {
        await handleCharacterSwitch(characterId, true);
        onViewChange("settings");
      }}
      logger={logger}
      onCreateCustom={() => onViewChange("create")}
      onBack={() => onViewChange("settings")}
      locale={locale}
      favorites={favorites}
      user={user}
    />
  );
}
