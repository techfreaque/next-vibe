/* eslint-disable i18next/no-literal-string */
import "server-only";

import type { SystemPromptFragment } from "../../ai-stream/system-prompt/types";
import {
  formatEmptyFavoritesGuidance,
  formatFavoritesSummary,
} from "./favorites-formatter";

// ─── Fragment ──────────────────────────────────────────────────────────────────

export const favoritesFragment: SystemPromptFragment = {
  id: "favorites",
  placement: "trailing",
  priority: 300,
  build: async (params) => {
    const { user, logger, locale, isIncognito, isExposedFolder } = params;
    const userId = user.isPublic ? undefined : user.id;

    if (isIncognito || isExposedFolder || !userId) {
      return null;
    }

    try {
      const { ChatFavoritesRepository } = await import("./repository");
      const favorites = await ChatFavoritesRepository.loadFavoritesItems({
        userId,
        locale,
        logger,
      });

      if (favorites.length === 0) {
        return formatEmptyFavoritesGuidance();
      }
      return formatFavoritesSummary(favorites);
    } catch (error) {
      logger.error("Failed to load favorites for system prompt", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  },
};
