/**
 * Shared hook for adding characters to favorites
 * Used by both character view and character list components
 */

"use client";

import type { ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { useState } from "react";

import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { IconKey } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { ModelSelectionSimple } from "../../models/components/types";
import type { TtsVoiceValue } from "../../text-to-speech/enum";
import characterSingleDefinitions from "../characters/[id]/definition";
import { ChatFavoritesRepositoryClient } from "./repository-client";

export interface CharacterDataForFavorite {
  id: string;
  icon: IconKey | null;
  name: string | null;
  tagline: string | null;
  description: string | null;
  voice: typeof TtsVoiceValue | null;
  modelSelection: ModelSelectionSimple | null;
}

export interface UseAddToFavoritesOptions {
  characterId: string;
  logger: EndpointLogger;
  user: JwtPayloadType;
  locale: CountryLanguage;
  /**
   * Optional character data if already available (e.g., from character view)
   * If not provided, will be fetched from cache or API
   */
  characterData?: CharacterDataForFavorite;
  /**
   * Callback when favorite is successfully added
   */
  onSuccess?: () => void;
}

export interface UseAddToFavoritesReturn {
  isLoading: boolean;
  addToFavorites: (e?: ButtonMouseEvent) => Promise<void>;
}

/**
 * Hook for adding a character to favorites
 * Handles fetching character data, creating the favorite, and optimistically updating caches
 */
export function useAddToFavorites({
  characterId,
  logger,
  user,
  locale,
  characterData,
  onSuccess,
}: UseAddToFavoritesOptions): UseAddToFavoritesReturn {
  const [isLoading, setIsLoading] = useState(false);

  const addToFavorites = async (e?: ButtonMouseEvent): Promise<void> => {
    e?.stopPropagation();
    setIsLoading(true);

    try {
      // Get character data - use provided data, cache, or fetch
      let fullChar: CharacterDataForFavorite | undefined = characterData;

      if (!fullChar) {
        // Try cache first
        const cachedData = apiClient.getEndpointData(
          characterSingleDefinitions.GET,
          logger,
          { id: characterId },
        );

        if (cachedData?.success) {
          fullChar = {
            id: characterId,
            icon: cachedData.data.icon,
            name: cachedData.data.name,
            tagline: cachedData.data.tagline,
            description: cachedData.data.description,
            voice: cachedData.data.voice,
            modelSelection: cachedData.data.modelSelection,
          };
        } else {
          // Fetch from API
          const characterResponse = await apiClient.fetch(
            characterSingleDefinitions.GET,
            logger,
            user,
            undefined,
            { id: characterId },
            locale,
          );

          if (!characterResponse.success) {
            logger.error("Failed to fetch character data");
            return;
          }

          fullChar = {
            id: characterId,
            icon: characterResponse.data.icon,
            name: characterResponse.data.name,
            tagline: characterResponse.data.tagline,
            description: characterResponse.data.description,
            voice: characterResponse.data.voice,
            modelSelection: characterResponse.data.modelSelection,
          };
        }
      }

      // At this point fullChar is guaranteed to be defined
      if (!fullChar) {
        logger.error("Character data not available");
        return;
      }

      // Capture for closure
      const charData = fullChar;

      // Create the favorite
      const createFavoriteDefinition = await import("./create/definition");
      const createResponse = await apiClient.mutate(
        createFavoriteDefinition.default.POST,
        logger,
        user,
        {
          characterId: characterId,
          icon: charData.icon ?? undefined,
          name: charData.name,
          tagline: charData.tagline,
          description: charData.description,
          voice: null,
          modelSelection: null,
        },
        undefined,
        locale,
      );

      if (!createResponse.success) {
        logger.error("Failed to add to favorites");
        return;
      }

      // Optimistically update favorites list
      const favoritesDefinition = await import("./definition");
      const newFavoriteConfig = {
        id: createResponse.data.id,
        characterId: characterId,
        customIcon: null,
        voice: null,
        modelSelection: null,
        position: 0,
      };

      apiClient.updateEndpointData(
        favoritesDefinition.default.GET,
        logger,
        (oldData) => {
          if (!oldData?.success) {
            return oldData;
          }

          const newFavorite =
            ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
              newFavoriteConfig,
              charData.modelSelection,
              charData.icon,
              charData.name,
              charData.tagline,
              charData.description,
              null,
            );

          return {
            success: true,
            data: {
              favorites: [...oldData.data.favorites, newFavorite],
            },
          };
        },
        undefined,
      );

      onSuccess?.();
    } catch (error) {
      logger.error("Failed to add to favorites", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    addToFavorites,
  };
}
