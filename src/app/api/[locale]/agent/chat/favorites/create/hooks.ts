/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import type { ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { useCallback, useState } from "react";

import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { IconKey } from "../../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { ModelSelectionSimple } from "../../../models/types";
import type { TtsVoiceValue } from "../../../text-to-speech/enum";
import characterSingleDefinitions from "../../skills/[id]/definition";
import { ChatFavoritesRepositoryClient } from "../repository-client";
import favoritesDefinition, {
  type FavoriteCreateRequestOutput,
} from "./definition";

export interface UseFavoriteCreateReturn {
  isLoading: boolean;
  addFavorite: (data: FavoriteCreateRequestOutput) => Promise<string | null>;
}

/**
 * Hook for creating favorites
 * - Authenticated users: server storage via API
 * - Non-authenticated users: localStorage via callbacks
 */
export function useFavoriteCreate(
  user: JwtPayloadType,
  logger: EndpointLogger,
): UseFavoriteCreateReturn {
  const endpoint = useEndpoint(favoritesDefinition, undefined, logger, user);

  // Create operation
  const addFavorite = useCallback(
    async (data: FavoriteCreateRequestOutput): Promise<string | null> => {
      endpoint.create.form.reset(data);
      return new Promise<string | null>((resolve, reject) => {
        endpoint.create.submitForm({
          onSuccess: ({ responseData }) => {
            resolve(responseData.id);
          },
          onError: ({ error }) => reject(error),
        });
      });
    },
    [endpoint.create],
  );

  return {
    isLoading: endpoint.create.isSubmitting,
    addFavorite,
  };
}

export interface SkillDataForFavorite {
  id: string;
  icon: IconKey | null;
  name: string | null;
  tagline: string | null;
  description: string | null;
  voice: typeof TtsVoiceValue | null;
  modelSelection: ModelSelectionSimple | null;
}

export interface UseAddToFavoritesOptions {
  skillId: string;
  logger: EndpointLogger;
  user: JwtPayloadType;
  locale: CountryLanguage;
  /**
   * Optional character data if already available (e.g., from character view)
   * If not provided, will be fetched from cache or API
   */
  characterData?: SkillDataForFavorite;
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
  skillId,
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
      let fullChar: SkillDataForFavorite | undefined = characterData;

      if (!fullChar) {
        // Try cache first
        const cachedData = apiClient.getEndpointData(
          characterSingleDefinitions.GET,
          logger,
          {
            urlPathParams: { id: skillId },
          },
        );

        if (cachedData?.success) {
          fullChar = {
            id: skillId,
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
            { id: skillId },
            locale,
          );

          if (!characterResponse.success) {
            logger.error("Failed to fetch character data");
            return;
          }

          fullChar = {
            id: skillId,
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
        logger.error("Skill data not available");
        return;
      }

      // Capture for closure
      const charData = fullChar;

      // Create the favorite
      const createFavoriteDefinition = await import("./definition");
      const createResponse = await apiClient.mutate(
        createFavoriteDefinition.default.POST,
        logger,
        user,
        {
          skillId: skillId,
          icon: charData.icon ?? undefined,
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
      const favoritesListDefinition = await import("../definition");
      const newFavoriteConfig = {
        id: createResponse.data.id,
        skillId: skillId,
        customIcon: null,
        voice: null,
        modelSelection: null,
        position: 0,
      };

      apiClient.updateEndpointData(
        favoritesListDefinition.default.GET,
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
              null,
              locale,
              user,
            );

          return {
            success: true,
            data: {
              ...oldData.data,
              favorites: [...oldData.data.favorites, newFavorite],
            },
          };
        },
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
