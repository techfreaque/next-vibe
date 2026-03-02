/**
 * Message Path Client Repository
 * Client-side implementation of conversation path retrieval for incognito mode
 * Mirrors server path repository but uses localStorage instead of DB
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

import { parseError } from "../../../../../../shared/utils";
import type { ChatMessage } from "../../../../db";
import { getMessagesForThread } from "../../../../incognito/storage";
import type { PathGetRequestOutput, PathGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Message Path Client Repository
 * Simplified path traversal for incognito messages (no compaction, no DB)
 */
export class MessagePathRepositoryClient {
  /**
   * Get conversation path for incognito thread
   * Simplified version: returns all messages in thread following active branches
   */
  static async getPath(
    threadId: string,
    data: PathGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PathGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const allMessages = await getMessagesForThread(threadId);

      if (allMessages.length === 0) {
        return success({
          messages: [],
          branchMeta: [],
          hasOlderHistory: false,
          oldestLoadedMessageId: null,
        });
      }

      const branchIndices = data.branchIndices ?? {};

      // Build parent → children map
      const childrenMap = new Map<string | null, ChatMessage[]>();
      for (const msg of allMessages) {
        const parentKey = msg.parentId ?? null;
        if (!childrenMap.has(parentKey)) {
          childrenMap.set(parentKey, []);
        }
        childrenMap.get(parentKey)!.push(msg);
      }

      // Traverse path from root following branch indices
      const path: ChatMessage[] = [];
      const branchMeta: PathGetResponseOutput["branchMeta"] = [];
      let currentParentId: string | null = null;

      let currentChildren: ChatMessage[] =
        childrenMap.get(currentParentId) ?? [];
      while (currentChildren.length > 0) {
        const children: ChatMessage[] = currentChildren;

        // Sort children by creation time
        children.sort(
          (a: ChatMessage, b: ChatMessage) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        // Determine which branch to follow
        const parentKey = currentParentId ?? "root";
        const branchIndex = branchIndices[parentKey] ?? children.length - 1;
        const clampedIndex = Math.min(
          Math.max(0, branchIndex),
          children.length - 1,
        );

        // Record branch meta if there are multiple children
        if (children.length > 1) {
          branchMeta.push({
            parentId: currentParentId ?? "root",
            siblingCount: children.length,
            currentIndex: clampedIndex,
          });
        }

        const selected: ChatMessage | undefined = children[clampedIndex];
        if (!selected) {
          break;
        }

        path.push(selected);
        currentParentId = selected.id;
        currentChildren = childrenMap.get(selected.id) ?? [];
      }

      logger.debug("Client: incognito message path", {
        threadId,
        pathLength: path.length,
      });

      return success({
        messages: path.map((msg) => ({
          id: msg.id,
          threadId: msg.threadId,
          role: msg.role,
          content: msg.content,
          parentId: msg.parentId,
          depth: msg.depth,
          sequenceId: msg.sequenceId,
          authorId: msg.authorId,
          authorName: msg.authorName,
          isAI: msg.isAI,
          model: msg.model,
          character: msg.character,
          errorType: msg.errorType,
          errorMessage: msg.errorMessage,
          errorCode: msg.errorCode,
          metadata: msg.metadata,
          upvotes: msg.upvotes,
          downvotes: msg.downvotes,
          searchVector: msg.searchVector,
          createdAt: new Date(msg.createdAt),
          updatedAt: new Date(msg.updatedAt),
        })),
        branchMeta,
        hasOlderHistory: false,
        oldestLoadedMessageId: path.length > 0 ? (path[0]?.id ?? null) : null,
      });
    } catch (error) {
      logger.error("Failed to get incognito message path", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
