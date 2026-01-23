"use client";

import type { JSX } from "react";
import { useCallback, useMemo } from "react";

import { DEFAULT_CHARACTERS } from "@/app/api/[locale]/agent/chat/characters/config";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type {
  FavoriteGetResponseOutput,
  FavoriteUpdateRequestOutput,
} from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import { useFavorite } from "@/app/api/[locale]/agent/chat/favorites/[id]/hooks";
import type { FavoriteCreateRequestOutput } from "@/app/api/[locale]/agent/chat/favorites/create/definition";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { QuickSettingsPanel } from ".";

interface SettingsViewProps {
  editingFavoriteId: string | null;
  editingCharacterId: string | null;
  isAuthenticated: boolean;
  locale: CountryLanguage;
  characterId: string;
  isOnboardingActive: boolean;
  favorites: FavoriteCard[];
  logger: EndpointLogger;
  // CRUD operations
  addFavorite: (data: FavoriteCreateRequestOutput) => Promise<string | null>;
  // State callbacks
  onEditingClear: () => void;
  onViewChange: (
    view: "favorites" | "onboarding" | "edit" | "character-switch",
  ) => void;
  onOnboardingActiveChange: (active: boolean) => void;
  onOnboardingStepChange: (step: "story" | "pick" | "specialists") => void;
}

/**
 * Resolve model ID from a model selection
 */
function resolveModelId(
  modelSelection: FavoriteGetResponseOutput["modelSelection"],
  characterId: string,
): ModelId | null {
  if (modelSelection.selectionType === ModelSelectionType.CHARACTER_BASED) {
    const character = DEFAULT_CHARACTERS.find((c) => c.id === characterId);
    if (!character) {
      return null;
    }
    const bestModel = CharactersRepositoryClient.getBestModelForFavorite(
      modelSelection,
      character.modelSelection,
    );
    return bestModel?.id ?? null;
  }
  const bestModel =
    CharactersRepositoryClient.getBestModelForCharacter(modelSelection);
  return bestModel?.id ?? null;
}

export function EditFavorite({
  editingFavoriteId,
  editingCharacterId,
  isAuthenticated,
  locale,
  characterId,
  isOnboardingActive,
  favorites,
  logger,
  addFavorite,
  onEditingClear,
  onViewChange,
  onOnboardingActiveChange,
  onOnboardingStepChange,
}: SettingsViewProps): JSX.Element | null {
  // Get characters from chat context (already fetched by useChat)
  const chat = useChatContext();
  const characters = chat.characters;

  // Use the byId hook for update/delete operations
  const { updateFavorite, deleteFavorite, read } = useFavorite(
    editingFavoriteId,
    chat.user,
    logger,
  );

  const editingFavorite: FavoriteGetResponseOutput | null = useMemo(() => {
    if (editingFavoriteId && read?.data) {
      return read.data;
    }
    if (editingCharacterId) {
      const character = characters[editingCharacterId];
      if (!character) {
        return null;
      }

      return {
        id: `temp-${Date.now()}`,
        characterId: editingCharacterId,
        character: {
          info: {
            icon: character.icon,
            info: {
              titleRow: {
                name: character.content.name,
                tagline: character.content.tagline,
              },
              description: character.content.description,
            },
          },
        },
        modelSelection: {
          selectionType: ModelSelectionType.CHARACTER_BASED,
        } as const,
        position: 0,
        color: null,
        useCount: 0,
        customName: null,
        customIcon: null,
        voice: null,
      } satisfies FavoriteGetResponseOutput;
    }
    return null;
  }, [editingFavoriteId, read, editingCharacterId, characters]);

  const handleSave = useCallback(
    async (
      modelSelection: FavoriteGetResponseOutput["modelSelection"],
      saveMode: "temporary" | "update" | "new",
    ) => {
      if (!editingFavorite) {
        return;
      }

      const updatedFavorite = {
        ...editingFavorite,
        modelSelection,
      };

      const isNewCharacter = !!editingCharacterId;

      if (saveMode === "temporary") {
        if (!updatedFavorite.characterId) {
          return;
        }
        const modelId = resolveModelId(
          updatedFavorite.modelSelection,
          updatedFavorite.characterId,
        );

        if (modelId) {
          chat.setActiveFavorite(
            editingFavorite.id,
            updatedFavorite.characterId,
            modelId,
            chat.ttsVoice,
          );
        }
      } else if (saveMode === "update") {
        if (isNewCharacter) {
          const character = characters[editingFavorite.characterId];
          if (!character) {
            logger.error("Character not found", {
              characterId: editingFavorite.characterId,
            });
            return;
          }
          await addFavorite({
            characterId: editingFavorite.characterId,
            customName: editingFavorite.customName ?? undefined,
            voice: editingFavorite.voice ?? undefined,
            modelSelection,
          });
        } else {
          await updateFavorite({ modelSelection });

          if (
            editingFavorite.characterId === characterId &&
            updatedFavorite.characterId
          ) {
            const modelId = resolveModelId(
              updatedFavorite.modelSelection,
              updatedFavorite.characterId,
            );

            if (modelId) {
              chat.setActiveFavorite(
                editingFavorite.id,
                updatedFavorite.characterId,
                modelId,
                chat.ttsVoice,
              );
            }
          }
        }
      } else {
        const character = characters[editingFavorite.characterId];
        if (!character) {
          logger.error("Character not found", {
            characterId: editingFavorite.characterId,
          });
          return;
        }

        const createdId = await addFavorite({
          characterId: editingFavorite.characterId,
          customName: editingFavorite.customName ?? undefined,
          voice: editingFavorite.voice ?? undefined,
          modelSelection,
        });

        if (createdId && updatedFavorite.characterId) {
          const modelId = resolveModelId(
            updatedFavorite.modelSelection,
            updatedFavorite.characterId,
          );

          if (modelId) {
            chat.setActiveFavorite(
              createdId,
              updatedFavorite.characterId,
              modelId,
              chat.ttsVoice,
            );
          }
        }
      }

      onEditingClear();

      if (isOnboardingActive && saveMode === "update" && isNewCharacter) {
        onViewChange("onboarding");
      } else {
        onViewChange("favorites");
      }
    },
    [
      editingFavorite,
      editingCharacterId,
      characterId,
      isOnboardingActive,
      characters,
      logger,
      chat,
      onEditingClear,
      onViewChange,
      addFavorite,
      updateFavorite,
    ],
  );

  const handleCancel = useCallback(() => {
    onEditingClear();
    if (isOnboardingActive) {
      onViewChange("onboarding");
    } else {
      onViewChange("favorites");
    }
  }, [onEditingClear, isOnboardingActive, onViewChange]);

  const handleDelete = useCallback(async () => {
    if (!editingFavorite || editingCharacterId) {
      return;
    }

    const deletedId = editingFavorite.id;

    const willRemain = favorites.filter((f) => f.id !== deletedId);
    const willBeEmpty = willRemain.length === 0;

    onEditingClear();
    await deleteFavorite();

    if (willBeEmpty) {
      onOnboardingActiveChange(true);
      onOnboardingStepChange("story");
      onViewChange("onboarding");
    } else {
      onViewChange("favorites");
    }
  }, [
    editingFavorite,
    editingCharacterId,
    favorites,
    onEditingClear,
    onOnboardingActiveChange,
    onOnboardingStepChange,
    onViewChange,
    deleteFavorite,
  ]);

  const handleCharacterSwitch = useCallback(
    async (newCharacterId: string, keepSettings: boolean) => {
      if (!editingFavorite) {
        return;
      }

      const updates: FavoriteUpdateRequestOutput = {
        characterId: newCharacterId,
        voice: keepSettings ? editingFavorite.voice : undefined,
        modelSelection: editingFavorite.modelSelection,
      };

      await updateFavorite(updates);

      if (editingFavorite.characterId === characterId) {
        const modelSel =
          updates.modelSelection || editingFavorite.modelSelection;
        const charId = updates.characterId ?? editingFavorite.characterId;

        if (charId) {
          const modelId = resolveModelId(modelSel, charId);

          if (modelId) {
            chat.setActiveFavorite(
              editingFavorite.id,
              charId,
              modelId,
              chat.ttsVoice,
            );
          }
        }
      }
    },
    [editingFavorite, chat, updateFavorite, characterId],
  );

  if (!editingFavorite) {
    return null;
  }

  return (
    <QuickSettingsPanel
      favorite={editingFavorite}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={editingCharacterId ? undefined : handleDelete}
      onEditCharacter={() => {
        onEditingClear();
        onViewChange("edit");
      }}
      onCharacterSwitch={handleCharacterSwitch}
      characters={characters}
      isAuthenticated={isAuthenticated}
      locale={locale}
      logger={logger}
    />
  );
}
