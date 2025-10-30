import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { chatThreads } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { canManageThread } from "@/app/api/[locale]/v1/core/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";

import type {
  ThreadPermissionsGetResponseOutput,
  ThreadPermissionsUpdateRequestOutput,
  ThreadPermissionsUpdateResponseOutput,
} from "./definition";

/**
 * Get thread permissions (moderator IDs)
 */
export async function getThreadPermissions(
  user: JwtPayloadType,
  data: { threadId: string },
  logger: EndpointLogger,
): Promise<ResponseType<ThreadPermissionsGetResponseOutput>> {
  if (user.isPublic) {
    return fail({
      message:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.unauthorized.title",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  try {
    const [thread] = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.id, data.threadId))
      .limit(1);

    if (!thread) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Check if user can manage this thread's permissions
    const canManage = await canManageThread(user, thread, logger);
    if (!canManage) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const moderatorIds = Array.isArray(thread.moderatorIds)
      ? thread.moderatorIds
      : [];

    return createSuccessResponse({
      response: {
        moderatorIds,
      },
    });
  } catch {
    return fail({
      message:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.get.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Update thread permissions (moderator IDs)
 */
export async function updateThreadPermissions(
  user: JwtPayloadType,
  data: ThreadPermissionsUpdateRequestOutput & { threadId: string },
  logger: EndpointLogger,
): Promise<ResponseType<ThreadPermissionsUpdateResponseOutput>> {
  if (user.isPublic) {
    return fail({
      message:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.unauthorized.title",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  try {
    const { threadId, moderatorIds } = data;

    // Verify thread exists
    const [existingThread] = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (!existingThread) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Check if user can manage this thread's permissions
    const canManage = await canManageThread(user, existingThread, logger);
    if (!canManage) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Update the moderator IDs
    await db
      .update(chatThreads)
      .set({
        moderatorIds,
        updatedAt: new Date(),
      })
      .where(eq(chatThreads.id, threadId));

    logger.info("Thread permissions updated", {
      threadId,
      moderatorCount: moderatorIds.length,
    });

    return createSuccessResponse({
      response: {
        moderatorIds,
      },
    });
  } catch {
    return fail({
      message:
        "app.api.v1.core.agent.chat.threads.threadId.permissions.patch.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
