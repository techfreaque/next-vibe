"use client";

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { formatFavoritesSummary } from "../favorites-formatter";
import type { FavoriteSummaryItem } from "../system-prompt/prompt";
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
  favorites: FavoriteSummaryItem[];
  favoritesSummary: string;
  isLoading: boolean;
  error: string | null;
} {
  const { enabled, user, logger } = params;

  const shouldFetch = enabled && !user.isPublic;
  const favoritesHook = useChatFavorites(logger, {
    activeFavoriteId: null,
  });

  const favorites = useMemo((): FavoriteSummaryItem[] => {
    if (!shouldFetch) {
      return [];
    }

    const response = favoritesHook.endpoint.read?.response;
    if (!response?.success) {
      return [];
    }

    return (response.data?.favorites ?? []).map((fav) => ({
      id: fav.id,
      name: fav.name,
      skillId: fav.skillId,
      characterName: fav.name ?? null,
      modelId: fav.modelId,
      modelInfo: fav.modelInfo,
      isActive: fav.activeBadge !== null,
      position: fav.position,
      useCount: 0,
      lastUsedAt: null,
    }));
  }, [shouldFetch, favoritesHook.endpoint.read?.response]);

  const favoritesSummary = useMemo(
    () =>
      favorites.length > 0 || shouldFetch
        ? formatFavoritesSummary(favorites)
        : "",
    [favorites, shouldFetch],
  );

  return {
    favorites,
    favoritesSummary,
    isLoading: favoritesHook.isInitialLoading,
    error: null,
  };
}
