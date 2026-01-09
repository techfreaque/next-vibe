/**
 * Chat Thread by ID Repository
 * Business logic for individual thread operations
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatFolders, chatThreads } from "../../db";
import { canDeleteThread, canUpdateThread, canViewThread } from "../../permissions/permissions";
import type {
  ThreadDeleteResponseOutput,
  ThreadGetResponseOutput,
  ThreadPatchRequestOutput,
  ThreadPatchResponseOutput,
} from "./definition";

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
    // oxlint-disable-next-line no-unused-vars - locale is unused on server, but required on native
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadGetResponseOutput>> {
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
          message: "app.api.agent.chat.threads.threadId.get.errors.notFound.title",
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
      if (!(await canViewThread(user, thread, folder, logger))) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.get.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      logger.debug("Thread found successfully", { threadId: thread.id });

      return success({
        thread: {
          id: thread.id,
          userId: thread.userId,
          title: thread.title,
          folderId: thread.folderId,
          status: thread.status,
          defaultModel: thread.defaultModel,
          defaultCharacter: thread.defaultCharacter,
          systemPrompt: thread.systemPrompt,
          pinned: thread.pinned,
          archived: thread.archived,
          tags: thread.tags ?? [],
          preview: thread.preview,
          metadata: thread.metadata ?? {},
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
          searchVector: thread.searchVector,
        },
      });
    } catch (error) {
      logger.error("Error getting thread by ID", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.threadId.get.errors.server.title",
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
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadPatchResponseOutput>> {
    try {
      logger.debug("Updating thread", {
        threadId,
        userId: user.id,
        isPublic: user.isPublic,
        updates: data.updates,
      });

      // Get thread without user filter to allow permission check
      const [existingThread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!existingThread) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.patch.errors.notFound.title",
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
      if (!(await canUpdateThread(user, existingThread, folder, logger))) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.patch.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Update the thread (user ownership already verified)
      const [updatedThread] = await db
        .update(chatThreads)
        .set(data.updates)
        .where(eq(chatThreads.id, threadId))
        .returning();

      logger.debug("Thread updated successfully", {
        threadId: updatedThread.id,
      });

      return success({
        thread: {
          id: updatedThread.id,
          userId: updatedThread.userId,
          title: updatedThread.title,
          folderId: updatedThread.folderId,
          status: updatedThread.status,
          defaultModel: updatedThread.defaultModel,
          defaultCharacter: updatedThread.defaultCharacter,
          systemPrompt: updatedThread.systemPrompt,
          pinned: updatedThread.pinned,
          archived: updatedThread.archived,
          tags: updatedThread.tags ?? [],
          preview: updatedThread.preview,
          metadata: updatedThread.metadata ?? {},
          createdAt: updatedThread.createdAt,
          updatedAt: updatedThread.updatedAt,
          leadId: updatedThread.leadId,
          rootFolderId: updatedThread.rootFolderId,
          rolesView: updatedThread.rolesView,
          rolesEdit: updatedThread.rolesEdit,
          rolesPost: updatedThread.rolesPost,
          rolesModerate: updatedThread.rolesModerate,
          rolesAdmin: updatedThread.rolesAdmin,
          published: updatedThread.published,
          searchVector: updatedThread.searchVector,
        },
      });
    } catch (error) {
      logger.error("Error updating thread", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.threadId.patch.errors.server.title",
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
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadDeleteResponseOutput>> {
    try {
      logger.debug("Deleting thread", {
        threadId,
        userId: user.id,
        isPublic: user.isPublic,
      });

      // Public users cannot delete threads
      if (user.isPublic) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.delete.errors.forbidden.title",
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
          message: "app.api.agent.chat.threads.threadId.delete.errors.notFound.title",
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
      const allFolders = Object.fromEntries(allFoldersArray.map((f) => [f.id, f]));

      // Use permission system to check delete access
      const canDelete = await canDeleteThread(user, existingThread, logger, folder, allFolders);

      if (!canDelete) {
        return fail({
          message: "app.api.agent.chat.threads.threadId.delete.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Delete the thread (cascade will handle messages)
      await db.delete(chatThreads).where(eq(chatThreads.id, threadId));

      logger.debug("Thread deleted successfully", { threadId });

      return success({
        success: true,
        deletedId: threadId,
      });
    } catch (error) {
      logger.error("Error deleting thread", parseError(error));
      return fail({
        message: "app.api.agent.chat.threads.threadId.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

// Type for native repository type checking
export type ThreadByIdRepositoryType = Pick<
  typeof ThreadByIdRepository,
  keyof typeof ThreadByIdRepository
>;
