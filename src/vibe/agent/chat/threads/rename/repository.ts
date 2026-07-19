/**
 * Thread Rename Repository
 * Updates the title and/or preview of a chat thread.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import { DefaultFolderId } from "next-vibe/agent/chat/config";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";

import { chatFolders, chatThreads } from "../../db";
import { createFolderContentsEmitter } from "../../folder-contents/[rootFolderId]/emitter";
import { canUpdateThread } from "../../permissions/permissions";
import threadsByIdDefinitions from "../[threadId]/definition";
import type {
  ThreadRenameRequestOutput,
  ThreadRenameResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import { recordIncognitoRename } from "./incognito-title-cache";

export class ThreadRenameRepository {
  static async renameThread(
    data: ThreadRenameRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<ThreadRenameResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { title, description } = data;

      // The thread comes from the active conversation's stream context (AI
      // turns) or explicit caller input (CLI/MCP/web — the definition's
      // serverDefault copies toolExecutionContext.threadId into data). Required.
      const threadId = data.threadId ?? toolExecutionContext.threadId;
      if (!threadId) {
        return fail({
          message: t("patch.errors.validation.title"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: { error: "no active thread in stream context" },
        });
      }

      // The FOLDER prefers the stream context. If it's missing we can still
      // recover it for a NON-PUBLIC user by reading the thread's own row (the
      // folder is derivable from the threadId). Public users have no DB thread
      // to fall back to, so a missing folder there is a hard error.
      let rootFolderId = toolExecutionContext.rootFolderId;

      logger.debug("Renaming thread", {
        threadId,
        rootFolderId,
        userId: user.id,
        isPublic: user.isPublic,
      });

      // ── Incognito: storage is FRONTEND-ONLY ──────────────────────────────
      // Incognito threads never touch the server DB (nothing leaves the
      // browser by design), so there is no row to read, permission-check, or
      // write. Rename is purely a client-side title change: skip the DB
      // entirely and emit the same `thread-updated` event so the sidebar's
      // onEvent handler updates its localStorage-backed list optimistically.
      if (rootFolderId === DefaultFolderId.INCOGNITO) {
        const now = new Date();
        // Record in-process so the mid-loop system-prompt refresh sees the
        // new title (there is no DB row it could re-read).
        recordIncognitoRename(threadId, title, description ?? null);
        emitThreadRenamed({
          logger,
          user,
          threadId,
          title,
          description: description ?? null,
          folderId: null,
          status: null,
          rootFolderId: DefaultFolderId.INCOGNITO,
          updatedAt: now,
        });
        return success({
          updatedThreadId: threadId,
          updatedTitle: title,
          updatedPreview: description ?? null,
          updatedAt: now,
        });
      }

      // Fetch thread for permission check (and to recover the folder when the
      // stream context didn't carry one — the thread row owns its rootFolderId).
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

      // Recover the folder from the thread when the context lacked it.
      rootFolderId = rootFolderId ?? existingThread.rootFolderId;
      if (!rootFolderId) {
        return fail({
          message: t("patch.errors.validation.title"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: { error: "could not resolve the thread's folder" },
        });
      }

      // A thread whose folder resolves to incognito must never have a DB row
      // (frontend-only) — if the context lied, honour the DB reality below.
      if (existingThread.rootFolderId === DefaultFolderId.INCOGNITO) {
        const now = new Date();
        recordIncognitoRename(threadId, title, description ?? null);
        emitThreadRenamed({
          logger,
          user,
          threadId,
          title,
          description: description ?? null,
          folderId: null,
          status: null,
          rootFolderId: DefaultFolderId.INCOGNITO,
          updatedAt: now,
        });
        return success({
          updatedThreadId: threadId,
          updatedTitle: title,
          updatedPreview: description ?? null,
          updatedAt: now,
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

      const [updatedThread] = await db
        .update(chatThreads)
        .set({ title, description })
        .where(eq(chatThreads.id, threadId))
        .returning();

      logger.debug("Thread renamed successfully", {
        threadId: updatedThread.id,
      });

      // Emit the thread-update event(s) so the sidebar + folder-contents caches
      // update. Same event the incognito path emits — one code path for both.
      emitThreadRenamed({
        logger,
        user,
        threadId: updatedThread.id,
        title: updatedThread.title,
        description: updatedThread.description,
        folderId: updatedThread.folderId,
        status: updatedThread.status,
        rootFolderId: updatedThread.rootFolderId,
        updatedAt: updatedThread.updatedAt,
      });

      if (!user.isPublic) {
        void import("next-vibe/agent/ai-stream/repository/core/db-writer/embedding-sync")
          .then(({ syncThreadEmbedding }) =>
            syncThreadEmbedding(updatedThread.id, toolExecutionContext),
          )
          .catch(() => undefined);
      }

      return success({
        updatedThreadId: updatedThread.id,
        updatedTitle: updatedThread.title,
        updatedPreview: updatedThread.description,
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

/**
 * Emit the thread rename as a `thread-updated` event on the [threadId] PATCH
 * channel AND (when the thread has a root folder) the folder-contents channel.
 * The client onEvent handlers merge the changed fields into their caches —
 * localStorage-backed for incognito, server-cache for persisted threads — so the
 * sidebar updates optimistically either way. One emit path for both.
 */
function emitThreadRenamed(args: {
  logger: EndpointLogger;
  user: JwtPayloadType;
  threadId: string;
  title: string;
  description: string | null;
  folderId: string | null;
  status: (typeof chatThreads.$inferSelect)["status"] | null;
  rootFolderId: DefaultFolderId;
  updatedAt: Date;
}): void {
  const {
    logger,
    user,
    threadId,
    title,
    description,
    folderId,
    status,
    rootFolderId,
    updatedAt,
  } = args;

  createEndpointEmitter(threadsByIdDefinitions.PATCH, logger, user, {
    urlPathParams: { threadId },
  })("thread-updated", {
    requestData: {
      title,
      description,
      folderId,
      status: status ?? undefined,
      rootFolderId,
    },
    responseData: {
      updatedAt,
    },
  });

  {
    // Target the thread's own folder channel (folderId) so a nested-folder
    // viewer receives the rename — the root view's channel would miss it.
    const emitFolderContents = createFolderContentsEmitter(
      logger,
      user,
      rootFolderId,
      { subFolderId: folderId },
    );
    emitFolderContents("thread-updated", {
      responseData: {
        items: [
          {
            id: threadId,
            title,
            folderId,
            status,
            description,
            rootFolderId,
            updatedAt,
          },
        ],
      },
    });
  }
}
