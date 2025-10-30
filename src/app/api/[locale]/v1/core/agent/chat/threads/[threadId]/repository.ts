/**
 * Chat Thread by ID Repository
 * Business logic for individual thread operations
 */

import "server-only";

import { and, eq } from "drizzle-orm";
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

import { chatThreads } from "../../db";
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
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadGetResponseOutput>>;

  updateThread(
    data: ThreadPatchRequestOutput & { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadPatchResponseOutput>>;

  deleteThread(
    data: { id: string },
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
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadGetResponseOutput>> {
    try {
      logger.debug("Getting thread by ID", {
        threadId: data.id,
        userId: user.id,
      });

      // Type guard to ensure user has id
      if (!user.id) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.get.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(eq(chatThreads.id, data.id), eq(chatThreads.userId, user.id)),
        )
        .limit(1);

      if (!thread) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { threadId: data.id },
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
    data: ThreadPatchRequestOutput & { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadPatchResponseOutput>> {
    try {
      logger.debug("Updating thread", {
        threadId: data.id,
        userId: user.id,
        updates: data.updates,
      });

      // Type guard to ensure user has id
      if (!user.id) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.patch.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // First verify the thread exists and belongs to the user
      const [existingThread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(eq(chatThreads.id, data.id), eq(chatThreads.userId, user.id)),
        )
        .limit(1);

      if (!existingThread) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { threadId: data.id },
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

      // Update the thread
      const [updatedThread] = await db
        .update(chatThreads)
        .set(updateData)
        .where(
          and(eq(chatThreads.id, data.id), eq(chatThreads.userId, user.id)),
        )
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
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ThreadDeleteResponseOutput>> {
    try {
      logger.debug("Deleting thread", {
        threadId: data.id,
        userId: user.id,
      });

      // Type guard to ensure user has id
      if (!user.id) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.delete.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // First verify the thread exists and belongs to the user
      const [existingThread] = await db
        .select()
        .from(chatThreads)
        .where(
          and(eq(chatThreads.id, data.id), eq(chatThreads.userId, user.id)),
        )
        .limit(1);

      if (!existingThread) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.threads.threadId.delete.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { threadId: data.id },
        });
      }

      // Delete the thread (cascade will handle messages)
      await db
        .delete(chatThreads)
        .where(
          and(eq(chatThreads.id, data.id), eq(chatThreads.userId, user.id)),
        );

      logger.debug("Thread deleted successfully", { threadId: data.id });

      return createSuccessResponse({
        success: true,
        deletedId: data.id,
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
