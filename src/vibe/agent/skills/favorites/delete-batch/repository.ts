/**
 * Favorites Batch-Delete Repository
 * Removes several favorites in one transaction. Server (DB) deletes never raced,
 * but a single op keeps the server and client (localStorage) paths symmetric and
 * lets the widget fire ONE mutation instead of N.
 */

import "server-only";

import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler-realtime";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/core/emitter";

import { chatFavorites } from "../db";
import { SingleFavoriteRepository } from "../[id]/repository";
import { markCompanionsSubset } from "../variants-mode";
import deleteBatchDefinitions, {
  type FavoritesDeleteBatchRequestOutput,
  type FavoritesDeleteBatchResponseOutput,
} from "./definition";
import type { FavoritesDeleteBatchT } from "./i18n";

/**
 * Favorites Batch-Delete Repository
 */
export class FavoritesDeleteBatchRepository {
  /**
   * Delete every favorite in `ids`, scoped to the user, in one transaction.
   */
  static async deleteFavorites(
    requestData: FavoritesDeleteBatchRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: FavoritesDeleteBatchT,
  ): Promise<ResponseType<FavoritesDeleteBatchResponseOutput>> {
    const userId = user.id;

    if (!userId) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      logger.debug("Batch-deleting favorites", {
        userId,
        count: requestData.ids.length,
      });

      const removedSkillIds: string[] = [];
      await db.transaction(async (tx) => {
        for (const id of requestData.ids) {
          const removed = await tx
            .delete(chatFavorites)
            .where(
              SingleFavoriteRepository.resolveFavoriteCondition(id, userId),
            )
            .returning({ skillId: chatFavorites.skillId });
          removedSkillIds.push(...removed.map((r) => r.skillId));
        }
      });
      // Partial removal = explicit subset; keeps the ALL reconcile from
      // re-adding the variants just removed.
      await markCompanionsSubset({ userId, skillIds: removedSkillIds });

      logger.info("Favorites batch-deleted successfully", {
        userId,
        count: requestData.ids.length,
      });

      // This op owns its `favorites-deleted-batch` event: the client onEvent drops
      // every id from the list cache; remoteEvent relays the ids cross-instance.
      createEndpointEmitter(
        deleteBatchDefinitions.POST,
        logger,
        user,
      )("favorites-deleted-batch", {
        requestData: { ids: requestData.ids },
      });

      return success({ success: true });
    } catch (error) {
      logger.error("Failed to batch-delete favorites", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Cross-instance applier for the `favorites-deleted-batch` remote event. A peer
   * relayed a batch delete (gated by syncScope["favorites"]); remove the same ids
   * here, scoped to the user. Reuses resolveFavoriteCondition for id resolution.
   */
  static async applyRemoteFavoritesDeleteBatch({
    requestData,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof deleteBatchDefinitions.POST,
    "favorites-deleted-batch"
  >): Promise<void> {
    const userId = user.id;
    try {
      const removedSkillIds: string[] = [];
      for (const id of requestData.ids) {
        const removed = await db
          .delete(chatFavorites)
          .where(SingleFavoriteRepository.resolveFavoriteCondition(id, userId))
          .returning({ skillId: chatFavorites.skillId });
        removedSkillIds.push(...removed.map((r) => r.skillId));
      }
      await markCompanionsSubset({ userId, skillIds: removedSkillIds });
      createEndpointEmitter(deleteBatchDefinitions.POST, logger, user, {
        fanOut: false,
      })("favorites-deleted-batch", {
        requestData: { ids: requestData.ids },
      });
    } catch (error) {
      logger.error(
        "Failed to apply remote favorites batch delete",
        parseError(error),
      );
    }
  }
}
