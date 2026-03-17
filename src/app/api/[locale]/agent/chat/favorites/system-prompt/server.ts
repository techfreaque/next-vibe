import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import type { FavoritesData, FavoriteSummaryItem } from "./prompt";

export async function loadFavoritesData(
  params: SystemPromptServerParams,
): Promise<FavoritesData> {
  const { user, logger, locale, isIncognito, isExposedFolder } = params;
  const userId = user.isPublic ? undefined : user.id;

  if (isIncognito || isExposedFolder || !userId) {
    return { favorites: null };
  }

  try {
    const { loadFavoritesItems } =
      await import("@/app/api/[locale]/agent/chat/favorites/repository");
    const favorites: FavoriteSummaryItem[] = await loadFavoritesItems({
      userId,
      locale,
      logger,
    });
    return { favorites };
  } catch (error) {
    logger.error("Failed to load favorites for system prompt", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return { favorites: null };
  }
}
