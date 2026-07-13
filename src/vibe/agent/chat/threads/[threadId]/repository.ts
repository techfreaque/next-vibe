/**
 * Chat Thread by ID Repository
 * Business logic for individual thread operations
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler";
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

import { DefaultFolderId } from "../../config";
import { chatFolders, chatThreads } from "../../db";
import { ThreadStatus, ThreadStreamingState } from "../../enum";
import { createFolderContentsEmitter } from "../../folder-contents/[rootFolderId]/emitter";
import {
  canDeleteThread,
  canUpdateThread,
  canViewThread,
} from "../../permissions/permissions";
import threadsByIdDefinitions, {
  type ThreadDeleteResponseOutput,
  type ThreadGetResponseOutput,
  type ThreadPatchRequestOutput,
  type ThreadPatchResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Thread by ID Repository - Static class pattern
 */
export class ThreadByIdRepository {
  /**
   * Get thread by ID
   */
  static async getThreadById(
    threadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Getting thread by ID", {
        threadId,
        userId: user.id,
        isPublic: user.isPublic,
      });

      // Get thread without user filter to allow permission check
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      // Check if thread exists
      if (!thread) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Get folder for permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      // Use permission system to check read access
      if (!(await canViewThread(user, thread, folder, logger, locale))) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      logger.debug("Thread found successfully", { threadId: thread.id });

      return success({
        userId: thread.userId,
        title: thread.title,
        folderId: thread.folderId,
        status: thread.status,
        defaultModel: thread.defaultModel,
        defaultSkill: thread.defaultSkill,
        systemPrompt: thread.systemPrompt,
        pinned: thread.pinned,
        archived: thread.archived,
        tags: thread.tags ?? [],
        description: thread.description,
        // No durable per-thread stream state to expose here.
        metadata: {},
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
        leadId: thread.leadId,
        rootFolderId: thread.rootFolderId,
        rolesView: thread.rolesView,
        rolesEdit: thread.rolesEdit,
        rolesPost: thread.rolesPost,
        rolesModerate: thread.rolesModerate,
        rolesAdmin: thread.rolesAdmin,
        published: thread.published,
        streamingState: thread.streamingState ?? null,
      });
    } catch (error) {
      logger.error("Error getting thread by ID", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Update thread
   */
  static async updateThread(
    data: ThreadPatchRequestOutput,
    threadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    relayed: boolean,
  ): Promise<ResponseType<ThreadPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Updating thread", {
        threadId,
        userId: user.id,
        isPublic: user.isPublic,
        updates: data,
      });

      // Get thread without user filter to allow permission check
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

      // Get folder if thread is in a folder (needed for permission check)
      let folder: typeof chatFolders.$inferSelect | null = null;
      if (existingThread.folderId) {
        const [folderResult] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, existingThread.folderId))
          .limit(1);
        folder = folderResult ?? null;
      }

      // Check if user can update this thread (moderators can rename)
      if (
        !(await canUpdateThread(user, existingThread, folder, logger, locale))
      ) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Guard against empty updates (Drizzle throws "No values to set" if data is empty)
      if (Object.keys(data).length === 0) {
        logger.warn("Empty update request", {
          threadId,
          userId: user.id,
          leadId: user.leadId,
          isPublic: user.isPublic,
          rootFolderId: existingThread.rootFolderId,
        });
        return success({ updatedAt: existingThread.updatedAt });
      }

      // Update the thread (user ownership already verified)
      const [updatedThread] = await db
        .update(chatThreads)
        .set(data)
        .where(eq(chatThreads.id, threadId))
        .returning();

      logger.debug("Thread updated successfully", {
        threadId: updatedThread.id,
      });

      // This op owns its `thread-updated` event: the edits the user submitted
      // (requestFields) + updatedAt. The client onEvent merges them into the
      // sidebar list cache; cross-instance (remoteEvent) the peer re-applies the
      // update. Suppressed when applying a relayed edit (avoids re-relay ping-pong).
      if (!relayed) {
        createEndpointEmitter(threadsByIdDefinitions.PATCH, logger, user, {
          urlPathParams: { threadId: updatedThread.id },
        })("thread-updated", {
          requestData: {
            title: updatedThread.title,
            folderId: updatedThread.folderId,
            status: updatedThread.status,
            rootFolderId: updatedThread.rootFolderId,
          },
          responseData: {
            updatedAt: updatedThread.updatedAt,
          },
        });
      }
      if (updatedThread.rootFolderId) {
        const threadUpdatedItem = {
          id: updatedThread.id,
          title: updatedThread.title,
          folderId: updatedThread.folderId,
          status: updatedThread.status,
          description: updatedThread.description,
          rootFolderId: updatedThread.rootFolderId,
          updatedAt: updatedThread.updatedAt,
        };
        // Target the channel of the folder the thread NOW lives in so a viewer
        // of that (possibly nested) level receives the update live.
        createFolderContentsEmitter(logger, user, updatedThread.rootFolderId, {
          subFolderId: updatedThread.folderId,
        })("thread-updated", {
          responseData: { items: [threadUpdatedItem] },
        });
        // A MOVE also notifies the folder the thread LEFT — its viewers' caches
        // still hold the item; the client onEvent drops it there (folderId no
        // longer matches that level).
        if (existingThread.folderId !== updatedThread.folderId) {
          createFolderContentsEmitter(
            logger,
            user,
            existingThread.rootFolderId,
            { subFolderId: existingThread.folderId },
          )("thread-updated", {
            responseData: { items: [threadUpdatedItem] },
          });
        }
      }

      return success({
        updatedAt: updatedThread.updatedAt,
      });
    } catch (error) {
      logger.error("Error updating thread", parseError(error), { threadId });
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Delete thread
   */
  static async deleteThread(
    threadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    relayed: boolean,
  ): Promise<ResponseType<ThreadDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Deleting thread", {
        threadId,
        userId: user.id,
        isPublic: user.isPublic,
      });

      // Public users cannot delete threads
      if (user.isPublic) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Get thread without user filter to allow permission check
      const [existingThread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!existingThread) {
        return fail({
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { threadId },
        });
      }

      // Get folder for permission check (needed for moderator checks)
      let folder = null;
      if (existingThread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, existingThread.folderId))
          .limit(1);
      }

      // Get all folders for recursive moderator check
      const allFoldersArray = await db.select().from(chatFolders);
      const allFolders = Object.fromEntries(
        allFoldersArray.map((f) => [f.id, f]),
      );

      // Use permission system to check delete access
      const canDelete = await canDeleteThread(
        user,
        existingThread,
        logger,
        locale,
        folder,
        allFolders,
      );

      if (!canDelete) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Collect message ids BEFORE the cascade delete — materialized cortex
      // index rows for /searches and /gens embed the messageId (not threadId),
      // so we need them to clean up those mounts after the thread is gone.
      const { chatMessages } = await import("../../db");
      const threadMessageIds = (
        await db
          .select({ id: chatMessages.id })
          .from(chatMessages)
          .where(eq(chatMessages.threadId, threadId))
      ).map((m) => m.id);

      // Delete the thread (cascade will handle messages)
      const [deletedThread] = await db
        .delete(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .returning();

      logger.debug("Thread deleted successfully", { threadId });

      // Clean up materialized cortex index rows for this thread so search never
      // surfaces orphaned embeddings. /threads and /uploads paths embed the
      // threadId; /searches and /gens embed the per-message id.
      const ownerId = deletedThread.userId;
      void (async (): Promise<void> => {
        if (!ownerId) {
          return; // cortex is user-scoped; lead-owned threads have no nodes
        }
        try {
          const { removeVirtualNodesByEntityId } =
            await import("next-vibe/agent/cortex/embeddings/sync-virtual");
          await removeVirtualNodesByEntityId(ownerId, "/threads", threadId);
          await removeVirtualNodesByEntityId(ownerId, "/uploads", threadId);
          for (const messageId of threadMessageIds) {
            await removeVirtualNodesByEntityId(ownerId, "/searches", messageId);
            await removeVirtualNodesByEntityId(ownerId, "/gens", messageId);
          }
        } catch (cleanupError) {
          logger.warn("[thread-delete] cortex cleanup failed", {
            threadId,
            error:
              cleanupError instanceof Error
                ? cleanupError.message
                : String(cleanupError),
          });
        }
      })();

      // Emit WS events so all open tabs remove the thread from their lists immediately
      // This op owns its `thread-deleted` event: the rootFolderId bucket
      // (requestFields); the thread id rides on urlPathParams. The client onEvent
      // removes it from the sidebar list cache; cross-instance (remoteEvent) the
      // peer re-applies the delete. Suppressed when applying a relayed delete.
      if (!relayed && deletedThread.rootFolderId) {
        createEndpointEmitter(threadsByIdDefinitions.DELETE, logger, user, {
          urlPathParams: { threadId },
        })("thread-deleted", {
          requestData: { rootFolderId: deletedThread.rootFolderId },
        });
      }
      if (deletedThread.rootFolderId) {
        const emitFolderContents = createFolderContentsEmitter(
          logger,
          user,
          deletedThread.rootFolderId,
        );
        emitFolderContents("thread-deleted", {
          responseData: { items: [{ id: threadId }] },
        });
      }

      return success({
        userId: deletedThread.userId,
        title: deletedThread.title,
        rootFolderId: deletedThread.rootFolderId,
        folderId: deletedThread.folderId,
        status: deletedThread.status,
        description: deletedThread.description,
        createdAt: deletedThread.createdAt,
        updatedAt: deletedThread.updatedAt,
      });
    } catch (error) {
      logger.error("Error deleting thread", parseError(error));
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Cross-instance applier for `thread-updated`: re-run the update on this
   * instance with the relayed edits. Reuses updateThread with relayed: true so the
   * event is not relayed back. The thread id rides on the event's urlPathParams.
   *
   * Note: requestData is typed via the endpoint's EventRequestPayloads which resolves
   * from threadsByIdPatchEvents requestFields: title?, folderId?, status?, rootFolderId.
   * We parse it through the PATCH request schema to produce a properly typed payload.
   */
  static async applyRemoteThreadUpdate(
    props: RemoteEventHandlerProps<
      typeof threadsByIdDefinitions.PATCH,
      "thread-updated"
    >,
  ): Promise<void> {
    const { urlPathParams, user, logger } = props;
    // Parse the relayed request data through the PATCH schema so we get a
    // ThreadPatchRequestOutput with all optional fields correctly typed.
    const parsed = threadsByIdDefinitions.PATCH.requestSchema.safeParse(
      props.requestData,
    );
    if (!parsed.success) {
      logger.error("Failed to parse relayed thread-updated request data", {
        error: parsed.error.message,
      });
      return;
    }
    // NO payload: everything comes from regular fields + columns.
    //  - Ownership: the receiver's OWN origin_instance_id column (NULL = ours)
    //    + the bridge wire's sender label for brand-new mirrors.
    //  - Placement: folderId is the SAME id on every instance (folders sync
    //    by id) — apply it on foreign mirrors when the folder exists locally;
    //    own threads never take placement from the wire.
    const userId = "id" in user ? user.id : null;
    const [existingThread] = await db
      .select({
        id: chatThreads.id,
        rootFolderId: chatThreads.rootFolderId,
        originInstanceId: chatThreads.originInstanceId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, urlPathParams.threadId))
      .limit(1);
    let data: typeof parsed.data = {
      ...parsed.data,
      folderId: undefined,
      rootFolderId: existingThread?.rootFolderId ?? parsed.data.rootFolderId,
    };
    const wireFolderExists = async (): Promise<boolean> => {
      if (!parsed.data.folderId) {
        return false;
      }
      // PUSH-ONLY convergence: no waiting. The sender ships folder-created
      // before thread-updated on the same socket (ordered on the WS leg);
      // when a leg reorders them, the NEXT push re-attempts placement — the
      // sender re-sends chain + thread-updated at every turn end.
      const [folderRow] = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(eq(chatFolders.id, parsed.data.folderId))
        .limit(1);
      return Boolean(folderRow);
    };
    if (userId && existingThread) {
      // Ownership is the COLUMN, nothing else. A REMOTE-rooted thread with
      // origin NULL is OUR OWN Remote-tab thread — a mirror-back from its
      // executor must never stamp it foreign or re-place it.
      const isForeignMirror = existingThread.originInstanceId !== null;
      if (isForeignMirror && (await wireFolderExists())) {
        data = { ...data, folderId: parsed.data.folderId };
      }
    } else if (userId && !existingThread) {
      // Brand-new mirror: the sender IS the origin for a first-contact
      // thread-updated. Place by the wire folderId when the (same-id) folder
      // already synced; fall back to the scaffold (REMOTE/<origin>/private|
      // background) so the thread always lands in the correct instance subtree
      // rather than at the REMOTE root — folder events / pull heal the precise
      // sub-folder placement on the next exchange.
      const placeable = await wireFolderExists();
      let mirrorFolderId: string | null = placeable
        ? (parsed.data.folderId ?? null)
        : null;
      if (mirrorFolderId === null && props.originInstanceId) {
        const { resolveScaffoldFolderId } =
          await import("next-vibe/agent/chat/threads/sync-provider");
        const senderRootFolderId =
          parsed.data.rootFolderId ?? DefaultFolderId.PRIVATE;
        mirrorFolderId = await resolveScaffoldFolderId(
          userId,
          props.originInstanceId,
          senderRootFolderId,
        );
      }
      const [createdMirror] = await db
        .insert(chatThreads)
        .values({
          id: urlPathParams.threadId,
          userId,
          rootFolderId: DefaultFolderId.REMOTE,
          folderId: mirrorFolderId,
          title: parsed.data.title ?? "",
          status: parsed.data.status ?? undefined,
          originInstanceId: props.originInstanceId,
        })
        .onConflictDoNothing()
        .returning({ id: chatThreads.id });
      data = {
        ...data,
        rootFolderId: DefaultFolderId.REMOTE,
        ...(mirrorFolderId !== null && { folderId: mirrorFolderId }),
      };
      if (createdMirror) {
        // Live sidebar add: the mirror thread must appear in open UIs the
        // moment it materializes — not only after a refresh.
        const now = new Date();
        createFolderContentsEmitter(
          logger,
          user,
          DefaultFolderId.REMOTE,
        )("thread-created", {
          responseData: {
            items: [
              {
                id: urlPathParams.threadId,
                type: "thread" as const,
                title: parsed.data.title ?? "",
                rootFolderId: DefaultFolderId.REMOTE,
                folderId: mirrorFolderId,
                status: parsed.data.status ?? ThreadStatus.ACTIVE,
                streamingState: ThreadStreamingState.IDLE,
                createdAt: now,
                updatedAt: now,
              },
            ],
          },
        });
      }
    }
    const result = await this.updateThread(
      data,
      urlPathParams.threadId,
      user,
      defaultLocale,
      logger,
      true,
    );
    if (!result.success) {
      logger.error("Failed to apply remote thread update", {
        message: result.message,
      });
      return;
    }
    // Re-emit on the PATCH channel (fanOut: false) so local WS subscribers on
    // this instance fire their onEvent and update the threads list cache.
    createEndpointEmitter(threadsByIdDefinitions.PATCH, logger, user, {
      urlPathParams: { threadId: urlPathParams.threadId },
      fanOut: false,
    })("thread-updated", {
      requestData: props.requestData,
      responseData: result.data,
    });
  }

  /**
   * Cross-instance applier for `thread-deleted`: re-run the delete on this
   * instance. Reuses deleteThread with relayed: true. The id rides on urlPathParams.
   */
  static async applyRemoteThreadDelete({
    urlPathParams,
    user,
    logger,
    requestData,
  }: RemoteEventHandlerProps<
    typeof threadsByIdDefinitions.DELETE,
    "thread-deleted"
  >): Promise<void> {
    const result = await this.deleteThread(
      urlPathParams.threadId,
      user,
      defaultLocale,
      logger,
      true,
    );
    if (!result.success) {
      logger.error("Failed to apply remote thread delete", {
        message: result.message,
      });
      return;
    }
    // Re-emit on the DELETE channel (fanOut: false) so local WS subscribers on
    // this instance fire their onEvent and remove the thread from the list cache.
    createEndpointEmitter(threadsByIdDefinitions.DELETE, logger, user, {
      urlPathParams: { threadId: urlPathParams.threadId },
      fanOut: false,
    })("thread-deleted", {
      requestData,
    });
  }
}

// Type for native repository type checking
export type ThreadByIdRepositoryType = Pick<
  typeof ThreadByIdRepository,
  keyof typeof ThreadByIdRepository
>;
