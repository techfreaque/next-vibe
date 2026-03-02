/**
 * Thread by ID Client Repository
 * Client-side operations for individual threads using localStorage (incognito mode)
 * Mirrors server repository structure but runs in browser
 */

"use client";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { parseError } from "../../../../shared/utils";
import { DefaultFolderId } from "../../config";
import { ThreadStatus } from "../../enum";
import {
  deleteThread,
  loadIncognitoState,
  updateIncognitoThread,
} from "../../incognito/storage";
import type {
  ThreadDeleteResponseOutput,
  ThreadGetResponseOutput,
  ThreadPatchResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Chat Thread by ID Client Repository
 * Mirrors individual thread operations from server, uses localStorage for incognito mode
 */
export class ChatThreadByIdRepositoryClient {
  /**
   * Get a single thread by ID
   */
  static async getThread(
    threadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ThreadGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const state = await loadIncognitoState();
      const thread = state.threads[threadId];

      if (!thread) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        userId: null as string | null,
        title: thread.title,
        folderId: thread.folderId ?? null,
        status: thread.status ?? ThreadStatus.ACTIVE,
        defaultModel:
          (thread.defaultModel as string | null | undefined) ?? null,
        defaultCharacter:
          (thread.defaultCharacter as string | null | undefined) ?? null,
        systemPrompt:
          (thread.systemPrompt as string | null | undefined) ?? null,
        pinned: thread.pinned ?? false,
        archived: thread.archived ?? false,
        tags: thread.tags ?? [],
        preview: (thread.preview as string | null | undefined) ?? null,
        metadata: thread.metadata ?? {},
        createdAt: new Date(thread.createdAt),
        updatedAt: new Date(thread.updatedAt),
        leadId: null as string | null,
        rootFolderId:
          (thread.rootFolderId as DefaultFolderId) ?? DefaultFolderId.INCOGNITO,
        rolesView: null,
        rolesEdit: null,
        rolesPost: null,
        rolesModerate: null,
        rolesAdmin: null,
        published: false as boolean,
      });
    } catch (error) {
      logger.error("Failed to get incognito thread", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a thread
   */
  static async updateThread(
    threadId: string,
    data: {
      title?: string;
      folderId?: string | null;
      status?: string;
      defaultModel?: string | null;
      defaultCharacter?: string | null;
      systemPrompt?: string;
      pinned?: boolean;
      archived?: boolean;
      tags?: string[];
      published?: boolean;
    },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ThreadPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const state = await loadIncognitoState();
      if (!state.threads[threadId]) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const updates: Parameters<typeof updateIncognitoThread>[1] = {};
      if (data.title !== undefined) {
        updates.title = data.title;
      }
      if (data.folderId !== undefined) {
        updates.folderId = data.folderId;
      }
      if (data.pinned !== undefined) {
        updates.pinned = data.pinned;
      }
      if (data.archived !== undefined) {
        updates.archived = data.archived;
      }
      if (data.tags !== undefined) {
        updates.tags = data.tags;
      }

      await updateIncognitoThread(threadId, updates);
      logger.debug("Client: updated incognito thread", { threadId });

      return success({ updatedAt: new Date() });
    } catch (error) {
      logger.error("Failed to update incognito thread", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a thread
   */
  static async deleteThread(
    threadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ThreadDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const state = await loadIncognitoState();
      const thread = state.threads[threadId];

      if (!thread) {
        return fail({
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      await deleteThread(threadId);
      logger.debug("Client: deleted incognito thread", { threadId });

      return success({
        userId: null,
        title: thread.title,
        rootFolderId:
          (thread.rootFolderId as DefaultFolderId) ?? DefaultFolderId.INCOGNITO,
        folderId: thread.folderId ?? null,
        status: thread.status ?? ThreadStatus.ACTIVE,
        preview: thread.preview ?? null,
        createdAt: new Date(thread.createdAt),
        updatedAt: new Date(thread.updatedAt),
      });
    } catch (error) {
      logger.error("Failed to delete incognito thread", parseError(error));
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
