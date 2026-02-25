"use client";

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { formatFavoritesSummary } from "./favorites-formatter";
import { useChatFavorites } from "./hooks";

/**
 * Hook to fetch user favorites ONLY when needed (conditional)
 * Used in debug view to show favorites in system prompt
 *
 * IMPORTANT: This hook only fetches when enabled=true
 * This prevents unnecessary API calls when debug view is not active
 */
export function useFavoritesSummary(params: {
  enabled: boolean;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): {
  favoritesSummary: string;
  isLoading: boolean;
  error: string | null;
} {
  const { enabled, user, logger } = params;

  const shouldFetch = enabled && !user.isPublic;
  const favoritesHook = useChatFavorites(logger);

  const favoritesSummary = useMemo(() => {
    if (!shouldFetch) {
      return "";
    }

    const response = favoritesHook.endpoint.read?.response;
    if (!response?.success) {
      return "";
    }

    const favorites = response.data?.favorites ?? [];

    return formatFavoritesSummary(
      favorites.map((fav) => ({
        id: fav.id,
        name: fav.name,
        characterId: fav.characterId,
        characterName: fav.name ?? null,
        modelId: fav.modelId,
        modelInfo: fav.modelInfo,
        isActive: fav.activeBadge !== null,
        position: fav.position,
        useCount: 0,
        lastUsedAt: null,
      })),
    );
  }, [shouldFetch, favoritesHook.endpoint.read?.response]);

  return {
    favoritesSummary,
    isLoading: favoritesHook.isInitialLoading,
    error: null,
  };
}
