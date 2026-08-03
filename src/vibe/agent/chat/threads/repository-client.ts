/**
 * Threads Client Repository
 * Client-side operations for threads using localStorage
 * Mirrors server repository structure but runs in browser
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { ThreadStatus, ThreadStreamingState } from "../enum";
import {
  deleteThread,
  getThreadsForFolder,
  updateIncognitoThread,
} from "../incognito/storage";
import type {
  ThreadListRequestOutput,
  ThreadListResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Chat Threads Client Repository
 * Mirrors ChatThreadsRepository but uses localStorage for incognito
 */
export class ChatThreadsRepositoryClient {
  /**
   * Get threads list (mirrors server getThreads)
   */
  static async getThreads(
    data: ThreadListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ThreadListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const allThreads = await getThreadsForFolder(
        data.rootFolderId,
        data.subFolderId ?? null,
      );

      // Apply search filter
      const filtered = data.search
        ? allThreads.filter((thread) =>
            thread.title.toLowerCase().includes(data.search!.toLowerCase()),
          )
        : allThreads;

      // Sort by updatedAt descending
      const sorted = filtered.toSorted(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      // Paginate
      const page = data.page ?? 1;
      const limit = data.limit ?? 20;
      const start = (page - 1) * limit;
      const paged = sorted.slice(start, start + limit);

      logger.debug("Client: incognito threads", {
        total: sorted.length,
        page,
        limit,
      });

      return success({
        threads: paged.map((thread) => ({
          id: thread.id,
          title: thread.title,
          rootFolderId: thread.rootFolderId,
          folderId: thread.folderId ?? null,
          status: thread.status ?? ThreadStatus.ACTIVE,
          description: thread.description ?? null,
          pinned: thread.pinned ?? false,
          archived: thread.archived ?? false,
          rolesView: null,
          rolesEdit: null,
          rolesPost: null,
          rolesModerate: null,
          rolesAdmin: null,
          canEdit: true,
          canPost: true,
          canModerate: false,
          canDelete: true,
          canManagePermissions: false,
          streamingState: ThreadStreamingState.IDLE,
          createdAt: new Date(thread.createdAt),
          updatedAt: new Date(thread.updatedAt),
        })),
        totalCount: sorted.length,
        pageCount: Math.ceil(sorted.length / limit),
        currentPage: page,
        pageSize: limit,
      });
    } catch (error) {
      logger.error("Failed to load incognito threads", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update thread (mirrors server updateThread)
   */
  static async updateThread(
    threadId: string,
    updates: {
      title?: string;
      pinned?: boolean;
      archived?: boolean;
      folderId?: string | null;
    },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: string }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      await updateIncognitoThread(threadId, updates);
      logger.debug("Client: updated incognito thread", { threadId });

      return success({
        success: t("get.success.title"),
      });
    } catch (error) {
      logger.error("Failed to update incognito thread", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete thread (mirrors server deleteThread)
   */
  static async deleteThread(
    threadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<never>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      await deleteThread(threadId);
      logger.debug("Client: deleted incognito thread", { threadId });

      return success();
    } catch (error) {
      logger.error("Failed to delete incognito thread", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
