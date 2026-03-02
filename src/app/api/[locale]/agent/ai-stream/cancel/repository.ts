/**
 * AI Stream Cancel Repository
 * Handles cancellation of active AI streams with ownership verification.
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  clearStreamingState,
  StreamRegistry,
} from "../repository/core/stream-registry";
import type {
  AiStreamCancelPostRequestOutput,
  AiStreamCancelPostResponseOutput,
} from "./definition";
import type { AiStreamCancelT } from "./i18n";

/**
 * Check if the user is the owner of the thread.
 * Supports both authenticated users (userId match) and public users (leadId match).
 */
function isThreadOwner(
  user: JwtPayloadType,
  thread: { userId: string | null; leadId: string | null },
): boolean {
  // Authenticated user: match userId
  if (!user.isPublic && "id" in user && user.id && thread.userId) {
    return user.id === thread.userId;
  }
  // Public user: match leadId
  if (user.isPublic && user.leadId && thread.leadId) {
    return user.leadId === thread.leadId;
  }
  return false;
}

export const cancelRepository = {
  async cancelStream(
    data: AiStreamCancelPostRequestOutput,
    user: JwtPayloadType,
    t: AiStreamCancelT,
    logger: EndpointLogger,
  ): Promise<ResponseType<AiStreamCancelPostResponseOutput>> {
    try {
      const { threadId } = data;

      // Look up the thread to verify ownership
      const [thread] = await db
        .select({
          id: chatThreads.id,
          userId: chatThreads.userId,
          leadId: chatThreads.leadId,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check ownership: only the thread owner (or admin) can cancel
      const isAdmin =
        !user.isPublic &&
        "roles" in user &&
        Array.isArray(user.roles) &&
        user.roles.includes(UserPermissionRole.ADMIN);

      if (!isAdmin && !isThreadOwner(user, thread)) {
        logger.warn("[Cancel] User is not the thread owner", {
          threadId,
          isPublic: user.isPublic,
        });
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Cancel the stream via the registry
      const wasActive = StreamRegistry.cancel(threadId);

      if (wasActive) {
        logger.info("[Cancel] Stream cancelled via registry", { threadId });
        // The abort triggers AbortErrorHandler which handles:
        // - Credit deduction for partial results
        // - DB content save
        // - isStreaming = false (via clearStreamingState in abort handler)
        // - WS error/interruption event
      } else {
        // No active stream in registry — clear DB flag as safety net
        // (stream may have finished between client check and cancel request,
        //  or server restarted and registry was lost)
        await clearStreamingState(threadId);
        logger.info("[Cancel] No active stream found, cleared DB flag", {
          threadId,
        });
      }

      return success({ cancelled: wasActive });
    } catch (error) {
      logger.error("Failed to cancel stream", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
