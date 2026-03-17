"use client";

import { useMemo } from "react";

import { useChatFavorites } from "@/app/api/[locale]/agent/chat/favorites/hooks/hooks";
import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import type { FavoritesData, FavoriteSummaryItem } from "./prompt";

export function useFavoritesData(
  params: SystemPromptClientParams,
): FavoritesData {
  const { enabledPrivate, user, logger } = params;

  const shouldFetch = enabledPrivate && !user.isPublic;
  const favoritesHook = useChatFavorites(logger, {
    activeFavoriteId: null,
  });

  const favorites = useMemo((): FavoriteSummaryItem[] | null => {
    if (!shouldFetch) {
      return null;
    }

    const response = favoritesHook.endpoint.read?.response;
    if (!response?.success) {
      return null;
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

  return { favorites };
}
