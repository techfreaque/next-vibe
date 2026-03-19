/**
 * Favorites Reorder Repository
 * Handles batch position updates for favorites
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { chatFavorites } from "../db";
import type {
  FavoritesReorderRequestOutput,
  FavoritesReorderResponseOutput,
} from "./definition";
import type { FavoritesReorderT } from "./i18n";

/**
 * Favorites Reorder Repository
 */
export class FavoritesReorderRepository {
  /**
   * Reorder favorites - batch update positions
   */
  static async reorderFavorites(
    requestData: FavoritesReorderRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: FavoritesReorderT,
  ): Promise<ResponseType<FavoritesReorderResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Reordering favorites", {
        userId,
        positionCount: requestData.positions.length,
      });

      await db.transaction(async (tx) => {
        for (const { id, position } of requestData.positions) {
          await tx
            .update(chatFavorites)
            .set({ position, updatedAt: new Date() })
            .where(
              and(eq(chatFavorites.id, id), eq(chatFavorites.userId, userId)),
            );
        }
      });

      logger.info("Favorites reordered successfully", { userId });
      return success({ success: true });
    } catch (error) {
      logger.error("Failed to reorder favorites", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
