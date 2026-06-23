/**
 * Thread Rename Repository
 * Updates the title and/or preview of a chat thread.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatFolders, chatThreads } from "../../db";
import { canUpdateThread } from "../../permissions/permissions";
import threadsByIdDefinitions from "../[threadId]/definition";
import type {
  ThreadRenameRequestOutput,
  ThreadRenameResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class ThreadRenameRepository {
  static async renameThread(
    data: ThreadRenameRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadRenameResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { threadId, title, preview } = data;

      if (!threadId) {
        return fail({
          message: t("patch.errors.validation.title"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: { error: "threadId is required" },
        });
      }

      logger.debug("Renaming thread", {
        threadId,
        userId: user.id,
        isPublic: user.isPublic,
        hasTitle: title !== undefined,
        hasPreview: preview !== undefined,
      });

      if (title === undefined && preview === undefined) {
        return fail({
          message: t("patch.errors.validation.title"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: {
            error: "At least one of title or preview must be provided",
          },
        });
      }

      // Fetch thread for permission check
      const [existingThread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!existingThread) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { threadId },
        });
      }

      // Fetch folder if thread is in one (needed for permission check)
      let folder: typeof chatFolders.$inferSelect | null = null;
      if (existingThread.folderId) {
        const [folderResult] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, existingThread.folderId))
          .limit(1);
        folder = folderResult ?? null;
      }

      if (
        !(await canUpdateThread(user, existingThread, folder, logger, locale))
      ) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const updateData: Partial<{ title: string; preview: string | null }> = {};
      if (title !== undefined) {
        updateData.title = title;
      }
      if (preview !== undefined) {
        updateData.preview = preview;
      }

      const [updatedThread] = await db
        .update(chatThreads)
        .set(updateData)
        .where(eq(chatThreads.id, threadId))
        .returning();

      logger.debug("Thread renamed successfully", {
        threadId: updatedThread.id,
      });

      // Rename is a thread update — emit the [threadId] PATCH `thread-updated`
      // event (the changed fields the user submitted + updatedAt). The client
      // onEvent merges them into the sidebar list cache; cross-instance the peer
      // re-applies the update.
      createEndpointEmitter(threadsByIdDefinitions.PATCH, logger, user, {
        threadId: updatedThread.id,
      })("thread-updated", {
        title: updatedThread.title,
        folderId: updatedThread.folderId,
        status: updatedThread.status,
        rootFolderId: updatedThread.rootFolderId,
        updatedAt: updatedThread.updatedAt,
      });

      if (updatedThread.rootFolderId) {
        const { default: folderContentsDefinitions } =
          await import("../../folder-contents/[rootFolderId]/definition");
        const emitFolderContents = createEndpointEmitter(
          folderContentsDefinitions.GET,
          logger,
          user,
          { rootFolderId: updatedThread.rootFolderId },
        );
        emitFolderContents("thread-updated", {
          items: [
            {
              id: updatedThread.id,
              title: updatedThread.title,
              folderId: updatedThread.folderId,
              status: updatedThread.status,
              preview: updatedThread.preview,
              rootFolderId: updatedThread.rootFolderId,
              updatedAt: updatedThread.updatedAt,
            },
          ],
        });
      }

      return success({
        updatedThreadId: updatedThread.id,
        updatedTitle: updatedThread.title,
        updatedPreview: updatedThread.preview,
        updatedAt: updatedThread.updatedAt,
      });
    } catch (error) {
      logger.error("Error renaming thread", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
