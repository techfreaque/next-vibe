/**
 * Conversation Path Repository
 * Retrieves messages following a specific conversation path with branch metadata
 * Supports compaction-aware pagination via `before` cursor
 */

import "server-only";

import { eq, inArray, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatFolders, chatMessages, chatThreads } from "../../../../db";
import { canViewThread } from "../../../../permissions/permissions";
import type {
  PathGetRequestOutput,
  PathGetResponseOutput,
  PathGetUrlVariablesOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type PathT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Find the compaction boundary on the path — the last compacting message.
 * Returns the index to slice from and whether there's older history.
 * If `beforeId` is provided, finds the chunk before that message.
 */
function findCompactionBoundary(
  pathIds: string[],
  compactingIds: Set<string>,
  beforeId?: string,
): { loadFromIndex: number; loadToIndex: number; hasOlderHistory: boolean } {
  if (beforeId) {
    const beforeIndex = pathIds.indexOf(beforeId);
    if (beforeIndex <= 0) {
      return { loadFromIndex: 0, loadToIndex: 0, hasOlderHistory: false };
    }

    for (let i = beforeIndex - 1; i >= 0; i--) {
      if (compactingIds.has(pathIds[i])) {
        return {
          loadFromIndex: i,
          loadToIndex: beforeIndex,
          hasOlderHistory: i > 0,
        };
      }
    }

    return {
      loadFromIndex: 0,
      loadToIndex: beforeIndex,
      hasOlderHistory: false,
    };
  }

  for (let i = pathIds.length - 1; i >= 0; i--) {
    if (compactingIds.has(pathIds[i])) {
      return {
        loadFromIndex: i,
        loadToIndex: pathIds.length,
        hasOlderHistory: i > 0,
      };
    }
  }

  return {
    loadFromIndex: 0,
    loadToIndex: pathIds.length,
    hasOlderHistory: false,
  };
}

/**
 * Traverse tree data to find the active branch path IDs
 * Mirror of client-side buildMessagePath logic
 */
function traverseForPathIds(
  treeData: Array<{ id: string; parentId: string | null; createdAt: Date }>,
  branchIndices: Record<string, number>,
): string[] {
  const rootMessages = treeData
    .filter((row) => !row.parentId)
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  if (rootMessages.length === 0) {
    return [];
  }

  const childrenMap = new Map<string, Array<{ id: string; createdAt: Date }>>();
  for (const row of treeData) {
    if (row.parentId) {
      const children = childrenMap.get(row.parentId) ?? [];
      children.push({ id: row.id, createdAt: row.createdAt });
      childrenMap.set(row.parentId, children);
    }
  }
  for (const [parentId, children] of childrenMap.entries()) {
    childrenMap.set(
      parentId,
      children.toSorted(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      ),
    );
  }

  let currentId: string | undefined;
  if (rootMessages.length > 1) {
    const rootIndex = Math.min(
      Math.max(0, branchIndices["__root__"] ?? 0),
      rootMessages.length - 1,
    );
    currentId = rootMessages[rootIndex].id;
  } else {
    currentId = rootMessages[0].id;
  }

  const pathIds: string[] = [];
  while (currentId) {
    pathIds.push(currentId);
    const children = childrenMap.get(currentId);
    if (!children || children.length === 0) {
      break;
    }
    if (children.length > 1) {
      const branchIndex = Math.min(
        Math.max(0, branchIndices[currentId] ?? 0),
        children.length - 1,
      );
      currentId = children[branchIndex].id;
    } else {
      currentId = children[0].id;
    }
  }

  return pathIds;
}

/**
 * Build branch metadata for fork points along the path
 */
function buildBranchMeta(
  treeData: Array<{ id: string; parentId: string | null; createdAt: Date }>,
  pathIdSet: Set<string>,
  branchIndices: Record<string, number>,
): Array<{ parentId: string; siblingCount: number; currentIndex: number }> {
  const childrenMap = new Map<string, string[]>();
  const rootIds: string[] = [];

  for (const row of treeData) {
    if (row.parentId) {
      const children = childrenMap.get(row.parentId) ?? [];
      children.push(row.id);
      childrenMap.set(row.parentId, children);
    } else {
      rootIds.push(row.id);
    }
  }

  const result: Array<{
    parentId: string;
    siblingCount: number;
    currentIndex: number;
  }> = [];

  if (rootIds.length > 1) {
    const rawIndex = branchIndices["__root__"] ?? 0;
    result.push({
      parentId: "__root__",
      siblingCount: rootIds.length,
      currentIndex: Math.min(Math.max(0, rawIndex), rootIds.length - 1),
    });
  }

  for (const id of pathIdSet) {
    const children = childrenMap.get(id);
    if (children && children.length > 1) {
      const rawIndex = branchIndices[id] ?? 0;
      result.push({
        parentId: id,
        siblingCount: children.length,
        currentIndex: Math.min(Math.max(0, rawIndex), children.length - 1),
      });
    }
  }

  return result;
}

/**
 * Conversation Path Repository
 */
export const pathRepository = {
  /**
   * Get the active branch path messages with branch metadata
   * Optimized: fetches lightweight tree structure first, then only path messages
   */
  async getPath(
    urlPathParams: PathGetUrlVariablesOutput,
    data: PathGetRequestOutput,
    user: JwtPayloadType,
    t: PathT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PathGetResponseOutput>> {
    try {
      logger.debug("Listing branch path messages", {
        threadId: urlPathParams.threadId,
        userId: user.id,
        before: data.before,
      });

      // Get thread
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, urlPathParams.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (thread.rootFolderId === "incognito") {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      if (!(await canViewThread(user, thread, folder, logger, locale))) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const branchIndices = data.branchIndices ?? {};

      // Step 1: Fetch lightweight tree structure with isCompacting flag
      const treeData = await db
        .select({
          id: chatMessages.id,
          parentId: chatMessages.parentId,
          createdAt: chatMessages.createdAt,
          isCompacting:
            sql<boolean>`COALESCE((${chatMessages.metadata}->>'isCompacting')::boolean, false)`.as(
              "is_compacting",
            ),
        })
        .from(chatMessages)
        .where(eq(chatMessages.threadId, urlPathParams.threadId))
        .orderBy(chatMessages.createdAt);

      // Step 2: Traverse to find full path IDs
      const pathIds = traverseForPathIds(treeData, branchIndices);

      if (pathIds.length === 0) {
        return success({
          messages: [],
          branchMeta: [],
          hasOlderHistory: false,
          oldestLoadedMessageId: null,
          compactionBoundaryId: null,
        });
      }

      // Step 3: Build branch metadata from full tree
      const pathIdSet = new Set(pathIds);
      const branchMeta = data.before
        ? [] // Skip branchMeta for "load older" requests (client already has it)
        : buildBranchMeta(treeData, pathIdSet, branchIndices);

      // Step 4: Find compaction boundary to determine which slice to load
      const compactingIds = new Set(
        treeData
          .filter((row) => row.isCompacting && pathIdSet.has(row.id))
          .map((row) => row.id),
      );

      const { loadFromIndex, loadToIndex, hasOlderHistory } =
        findCompactionBoundary(pathIds, compactingIds, data.before);

      // Step 5: Slice path to the relevant chunk
      const slicedPathIds = pathIds.slice(loadFromIndex, loadToIndex);
      const oldestLoadedMessageId =
        slicedPathIds.length > 0 ? slicedPathIds[0] : null;
      // compactionBoundaryId: the ID of the compacting message that starts the loaded chunk.
      // Non-null when loadFromIndex > 0, meaning older history exists before this point.
      const compactionBoundaryId =
        loadFromIndex > 0 && slicedPathIds.length > 0 ? slicedPathIds[0] : null;

      if (slicedPathIds.length === 0) {
        return success({
          messages: [],
          branchMeta,
          hasOlderHistory: false,
          oldestLoadedMessageId: null,
          compactionBoundaryId: null,
        });
      }

      // Step 6: Fetch only the sliced path messages with full columns
      const pathMessages = await db
        .select()
        .from(chatMessages)
        .where(inArray(chatMessages.id, slicedPathIds));

      // Sort by path order (preserve traversal order)
      const idOrderMap = new Map(slicedPathIds.map((id, index) => [id, index]));
      const sortedMessages = pathMessages.toSorted(
        (a, b) => (idOrderMap.get(a.id) ?? 0) - (idOrderMap.get(b.id) ?? 0),
      );

      logger.debug("Branch path messages retrieved", {
        threadId: urlPathParams.threadId,
        totalInTree: treeData.length,
        fullPathLength: pathIds.length,
        loadedChunk: sortedMessages.length,
        hasOlderHistory,
        isLoadOlder: !!data.before,
      });

      return success({
        messages: sortedMessages,
        branchMeta,
        hasOlderHistory,
        oldestLoadedMessageId,
        compactionBoundaryId,
      });
    } catch (error) {
      logger.error("Error listing branch path messages", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
