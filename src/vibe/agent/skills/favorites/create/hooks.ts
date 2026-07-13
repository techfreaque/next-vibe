/**
 * Unified Chat Favorites Hook
 * Handles favorites storage with server-side for authenticated users
 * and localStorage for non-authenticated users only.
 */

"use client";

import { useProviderAvailability } from "next-vibe/agent/env-availability-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/platforms/react/hooks/store";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";
import type { ButtonMouseEvent } from "next-vibe/ui/ui/button";
import type { IconKey } from "next-vibe/unified-ui/form-fields/icon-field/icons";
import { useCallback, useState } from "react";

import type {
  ChatModelId,
  ChatModelSelection,
} from "../../../ai-stream/models";
import { parseSkillId } from "../../../chat/slugify";
import type { VoiceModelSelection } from "../../../text-to-speech/models";
import characterSingleDefinitions from "../../[id]/definition";
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
  voiceModelSelection: VoiceModelSelection | null;
  /** Skill/variant model selection for best-model computation in optimistic update */
  modelSelection: ChatModelSelection | null;
  /** Pre-computed model display fields - when present, used directly in optimistic update */
  preComputedModel?: {
    modelId: ChatModelId | null;
    modelIcon: IconKey;
    modelInfo: string;
    modelProvider: string;
  } | null;
}

export interface UseAddToFavoritesOptions {
  /** Skill ID, optionally merged with variant: "skillSlug" or "skillSlug__variantId" */
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
  const availability = useProviderAvailability();

  const addToFavorites = async (e?: ButtonMouseEvent): Promise<void> => {
    e?.stopPropagation();
    setIsLoading(true);

    try {
      // Parse merged skillId ("skillSlug" or "skillSlug__variantId") to get plain skillId for lookups
      const { skillId: plainSkillId, variantId } = parseSkillId(skillId);

      // Get character data - use provided data, cache, or fetch
      let fullChar: SkillDataForFavorite | undefined = characterData;

      if (!fullChar) {
        // Try cache first
        const cachedData = apiClient.getEndpointData(
          characterSingleDefinitions.GET,
          logger,
          {
            urlPathParams: { id: plainSkillId },
          },
        );

        if (cachedData?.success) {
          const cachedVariants = cachedData.data.variants;
          const cachedVariant =
            (variantId
              ? cachedVariants.find((v) => v.id === variantId)
              : null) ??
            cachedVariants.find((v) => v.isDefault) ??
            cachedVariants[0];
          fullChar = {
            id: plainSkillId,
            icon: cachedData.data.icon,
            name: cachedData.data.name,
            tagline: cachedData.data.tagline,
            description: cachedData.data.description,
            voiceModelSelection: cachedVariant?.voiceModelSelection ?? null,
            modelSelection: null,
          };
        } else {
          // Fetch from API
          const characterResponse = await apiClient.fetch(
            characterSingleDefinitions.GET,
            logger,
            user,
            undefined,
            { id: plainSkillId },
            locale,
            availability,
          );

          if (!characterResponse.success) {
            logger.error("Failed to fetch character data");
            return;
          }

          const responseVariants = characterResponse.data.variants;
          const responseVariant =
            (variantId
              ? responseVariants.find((v) => v.id === variantId)
              : null) ??
            responseVariants.find((v) => v.isDefault) ??
            responseVariants[0];
          fullChar = {
            id: plainSkillId,
            icon: characterResponse.data.icon,
            name: characterResponse.data.name,
            tagline: characterResponse.data.tagline,
            description: characterResponse.data.description,
            voiceModelSelection: responseVariant?.voiceModelSelection ?? null,
            modelSelection: null,
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

      // Create the favorite - pass skillId as-is (merged format handled server-side)
      const createFavoriteDefinition = await import("./definition");
      const createResponse = await apiClient.mutate(
        createFavoriteDefinition.default.POST,
        logger,
        user,
        {
          skillId: skillId,
          icon: charData.icon ?? undefined,
          voiceModelSelection: null,
          modelSelection: null,
        },
        undefined,
        locale,
        availability,
      );

      if (!createResponse.success) {
        logger.error("Failed to add to favorites");
        return;
      }

      // For public users: attribute UUID skillId on their lead + track last in localStorage
      if (
        user.isPublic &&
        /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(
          plainSkillId,
        )
      ) {
        // Track last favorited UUID skill with name (last wins before signup)
        const { ChatFavoritesRepositoryClient: FavClient } =
          await import("../repository-client");
        void FavClient.setLastAttributedSkillId(
          plainSkillId,
          charData.name ?? null,
        );

        void (async (): Promise<void> => {
          const leadSkillDef = await import("@/leads/skill/definition");
          void apiClient.mutate(
            leadSkillDef.default.PATCH,
            logger,
            user,
            { skillId: plainSkillId },
            undefined,
            locale,
            availability,
          );
        })();
      }

      const favoritesListDefinition = await import("../definition");
      apiClient.updateEndpointData(
        favoritesListDefinition.default.GET,
        logger,
        (oldData) => {
          if (!oldData?.success) {
            return oldData;
          }
          const newFavorite =
            ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
              {
                id: createResponse.data.id,
                skillId,
                customIcon: null,
                voiceModelSelection: null,
                modelSelection: null,
                position: 0,
              },
              charData.modelSelection,
              charData.icon,
              charData.name,
              charData.tagline,
              charData.description,
              null,
              null,
              locale,
              user,
              availability,
            );
          const pre = charData.preComputedModel;
          if (pre) {
            newFavorite.modelId = pre.modelId;
            newFavorite.modelIcon = pre.modelIcon;
            newFavorite.modelInfo = pre.modelInfo;
            newFavorite.modelProvider = pre.modelProvider;
          }
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
