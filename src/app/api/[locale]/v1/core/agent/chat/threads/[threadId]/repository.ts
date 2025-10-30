/**
 * Chat Thread by ID Repository
 * Business logic for individual thread operations
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatFolders, chatThreads } from "../../db";
import {
  canDeleteThread,
  canReadThread,
} from "../../permissions/permissions";
import type { PersonaId } from "../../personas/config";
import type {
  ThreadDeleteResponseOutput,
  ThreadGetResponseOutput,
  ThreadPatchRequestOutput,
  ThreadPatchResponseOutput,
} from "./definition";

/**
 * Thread by ID Repository Interface
 */
export interface ThreadByIdRepositoryInterface {
  getThreadById(
    threadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadGetResponseOutput>>;

  updateThread(
    data: ThreadPatchRequestOutput,
    threadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadPatchResponseOutput>>;

  deleteThread(
    threadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadDeleteResponseOutput>>;
}

/**
 * Thread by ID Repository Implementation
 */
export class ThreadByIdRepositoryImpl implements ThreadByIdRepositoryInterface {
  /**
   * Get thread by ID
   */
  async getThreadById(
    threadId: string,
    user: JwtPayloadType,
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

      if (!thread) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { threadId },
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
      if (!canReadThread(user, thread, folder)) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.get.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      logger.debug("Thread found successfully", { threadId: thread.id });

      // Map database fields to response fields
      // Exclude: rootFolderId (not in response), moderatorIds, searchVector
      // Map: defaultModel (ModelId -> string), defaultPersona -> persona (PersonaId -> string)
      const response: ThreadGetResponseOutput = {
        thread: {
          id: thread.id,
          userId: thread.userId,
          title: thread.title,
          folderId: thread.folderId,
          status: thread.status,
          defaultModel: thread.defaultModel ?? null,
          persona: thread.defaultPersona ?? null,
          systemPrompt: thread.systemPrompt,
          pinned: thread.pinned,
          archived: thread.archived,
          tags: thread.tags ?? [],
          preview: thread.preview,
          metadata: (thread.metadata ?? {}) as Record<
            string,
            string | number | boolean
          >,
          createdAt: thread.createdAt.toISOString(),
          updatedAt: thread.updatedAt.toISOString(),
        },
      };
      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Error getting thread by ID", parseError(error));
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Update thread
   */
  async updateThread(
    data: ThreadPatchRequestOutput,
    threadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadPatchResponseOutput>> {
    try {
      logger.debug("Updating thread", {
        threadId,
        userId: user.id,
        isPublic: user.isPublic,
        updates: data.updates,
      });

      // Public users cannot update threads
      if (user.isPublic) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.patch.errors.forbidden.title",
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
          message:
            "app.api.v1.core.agent.chat.threads.threadId.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { threadId },
        });
      }

      // Only owner can update their thread (no moderator update permissions)
      if (user.id !== existingThread.userId) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.patch.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Folder validation: folderId is optional and validated by schema

      // Build update object with only provided fields
      type UpdateData = Partial<typeof chatThreads.$inferInsert> & {
        updatedAt: Date;
      };
      const updateData: UpdateData = {
        updatedAt: new Date(),
      };

      if (data.updates?.title !== undefined) {
        updateData.title = data.updates.title;
      }
      if (data.updates?.folderId !== undefined) {
        updateData.folderId = data.updates.folderId;
      }
      if (data.updates?.status !== undefined) {
        updateData.status = data.updates.status;
      }
      if (data.updates?.defaultModel !== undefined) {
        updateData.defaultModel = data.updates.defaultModel;
      }
      if (data.updates?.persona !== undefined) {
        updateData.defaultPersona =
          (data.updates.persona as PersonaId | null) ?? null;
      }
      if (data.updates?.systemPrompt !== undefined) {
        updateData.systemPrompt = data.updates.systemPrompt;
      }
      if (data.updates?.pinned !== undefined) {
        updateData.pinned = data.updates.pinned;
      }
      if (data.updates?.archived !== undefined) {
        updateData.archived = data.updates.archived;
      }
      if (data.updates?.tags !== undefined) {
        updateData.tags = data.updates.tags;
      }

      // Update the thread (user ownership already verified)
      const [updatedThread] = await db
        .update(chatThreads)
        .set(updateData)
        .where(eq(chatThreads.id, threadId))
        .returning();

      logger.debug("Thread updated successfully", {
        threadId: updatedThread.id,
      });

      // Map database fields to response fields
      // Exclude: rootFolderId (not in response), moderatorIds, searchVector
      // Map: defaultModel (ModelId -> string), defaultPersona -> persona (PersonaId -> string)
      const response: ThreadPatchResponseOutput = {
        thread: {
          id: updatedThread.id,
          userId: updatedThread.userId,
          title: updatedThread.title,
          folderId: updatedThread.folderId,
          status: updatedThread.status,
          defaultModel: updatedThread.defaultModel ?? null,
          persona: updatedThread.defaultPersona ?? null,
          systemPrompt: updatedThread.systemPrompt,
          pinned: updatedThread.pinned,
          archived: updatedThread.archived,
          tags: updatedThread.tags ?? [],
          preview: updatedThread.preview,
          metadata: (updatedThread.metadata ?? {}) as Record<
            string,
            string | number | boolean
          >,
          createdAt: updatedThread.createdAt.toISOString(),
          updatedAt: updatedThread.updatedAt.toISOString(),
        },
      };
      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Error updating thread", parseError(error));
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.patch.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Delete thread
   */
  async deleteThread(
    threadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
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
          message:
            "app.api.v1.core.agent.chat.threads.threadId.delete.errors.forbidden.title",
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
          message:
            "app.api.v1.core.agent.chat.threads.threadId.delete.errors.notFound.title",
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
        folder,
        allFolders,
      );

      if (!canDelete) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.delete.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Delete the thread (cascade will handle messages)
      await db.delete(chatThreads).where(eq(chatThreads.id, threadId));

      logger.debug("Thread deleted successfully", { threadId });

      return createSuccessResponse({
        success: true,
        deletedId: threadId,
      });
    } catch (error) {
      logger.error("Error deleting thread", parseError(error));
      return fail({
        message:
          "app.api.v1.core.agent.chat.threads.threadId.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

/**
 * Default repository instance
 */
export const threadByIdRepository = new ThreadByIdRepositoryImpl();
