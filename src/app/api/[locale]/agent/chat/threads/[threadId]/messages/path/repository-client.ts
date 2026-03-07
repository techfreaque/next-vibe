/**
 * Message Path Client Repository
 * Client-side implementation of conversation path retrieval for incognito mode.
 * Mirrors server logic but uses localStorage instead of DB.
 *
 * Loads all messages from the compaction boundary to the leaf, including siblings,
 * so the client can derive branchIndices locally from the leafMessageId.
 * No DB round-trips — incognito threads are fully in memory/localStorage.
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
 * Loads all messages within the branch window (compaction boundary → leaf + siblings)
 * for incognito threads stored in localStorage.
 */
export class MessagePathRepositoryClient {
  /**
   * Get the branch window for an incognito thread.
   * Returns all messages from the last compaction point to the leaf, including siblings.
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
          hasOlderHistory: false,
          hasNewerMessages: false,
          resolvedLeafMessageId: null,
          oldestLoadedMessageId: null,
          compactionBoundaryId: null,
          newerChunkAnchorId: null,
        });
      }

      // Build lookup map by ID
      const byId = new Map<string, ChatMessage>();
      const childrenByParentId = new Map<string | null, ChatMessage[]>();
      for (const msg of allMessages) {
        byId.set(msg.id, msg);
        const key = msg.parentId ?? null;
        const arr = childrenByParentId.get(key) ?? [];
        arr.push(msg);
        childrenByParentId.set(key, arr);
      }

      // Find leaf: given leafMessageId, or "load older" parent, or latest by createdAt
      let leafId: string | null = null;

      if (data.before) {
        const beforeMsg = byId.get(data.before);
        leafId = beforeMsg?.parentId ?? null;
      } else if (data.leafMessageId) {
        // Walk DOWN from the given ID to find the actual latest leaf of that branch
        const startMsg = byId.get(data.leafMessageId);
        if (startMsg) {
          let currentId: string = data.leafMessageId;
          while (true) {
            const kids = childrenByParentId.get(currentId);
            if (!kids || kids.length === 0) {
              break;
            }
            const latestKid = kids.reduce((a, b) =>
              new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
                ? a
                : b,
            );
            currentId = latestKid.id;
          }
          leafId = currentId;
        }
      } else {
        // Latest message
        const latest = allMessages.reduce(
          (acc, m) =>
            new Date(m.createdAt).getTime() > new Date(acc.createdAt).getTime()
              ? m
              : acc,
          allMessages[0],
        );
        leafId = latest?.id ?? null;
      }

      if (!leafId) {
        return success({
          messages: [],
          hasOlderHistory: false,
          hasNewerMessages: false,
          resolvedLeafMessageId: null,
          oldestLoadedMessageId: null,
          compactionBoundaryId: null,
          newerChunkAnchorId: null,
        });
      }

      // Walk UP from leaf collecting ancestor chain (incognito has no compaction,
      // so we walk all the way to root)
      const ancestorChain: ChatMessage[] = [];
      let currentId: string | null = leafId;

      while (currentId) {
        const msg = byId.get(currentId);
        if (!msg) {
          break;
        }
        ancestorChain.push(msg);
        if (msg.metadata?.isCompacting) {
          break;
        } // stop at compaction boundary
        currentId = msg.parentId;
      }

      // ancestorChain is [leaf, ..., root] — reverse to [root, ..., leaf]
      ancestorChain.reverse();

      if (ancestorChain.length === 0) {
        return success({
          messages: [],
          hasOlderHistory: false,
          hasNewerMessages: false,
          resolvedLeafMessageId: null,
          oldestLoadedMessageId: null,
          compactionBoundaryId: null,
          newerChunkAnchorId: null,
        });
      }

      const oldestAncestor = ancestorChain[0];
      const hasOlderHistory =
        !!oldestAncestor?.parentId && !oldestAncestor?.metadata?.isCompacting;
      const compactionBoundaryId = oldestAncestor?.metadata?.isCompacting
        ? (oldestAncestor.id ?? null)
        : null;
      const oldestLoadedMessageId = oldestAncestor?.id ?? null;

      // Collect all messages in the window: for each ancestor, include all its siblings
      // (children of the ancestor's parent) + all children of the ancestor
      const windowIds = new Set<string>();

      // Root-level messages (parentId = null)
      for (const rootMsg of childrenByParentId.get(null) ?? []) {
        windowIds.add(rootMsg.id);
      }

      for (const ancestor of ancestorChain) {
        // All children of this ancestor (= path node's children = siblings at next level)
        for (const child of childrenByParentId.get(ancestor.id) ?? []) {
          windowIds.add(child.id);
        }
        // The ancestor itself
        windowIds.add(ancestor.id);
      }

      const windowMessages = allMessages
        .filter((m) => windowIds.has(m.id))
        .toSorted(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

      logger.debug("Client: incognito branch window", {
        threadId,
        windowSize: windowMessages.length,
        ancestorChainLength: ancestorChain.length,
      });

      // hasNewerMessages: true when the resolved leaf is not the globally latest message
      const latestMessage = allMessages.reduce(
        (acc, m) =>
          new Date(m.createdAt).getTime() > new Date(acc.createdAt).getTime()
            ? m
            : acc,
        allMessages[0],
      );
      const hasNewerMessages =
        !!data.leafMessageId && !!latestMessage && latestMessage.id !== leafId;

      return success({
        messages: windowMessages.map((msg) => ({
          id: msg.id,
          threadId: msg.threadId,
          role: msg.role,
          content: msg.content,
          parentId: msg.parentId,
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
        hasOlderHistory,
        hasNewerMessages,
        resolvedLeafMessageId: leafId,
        oldestLoadedMessageId,
        compactionBoundaryId,
        newerChunkAnchorId: null, // incognito has no compaction boundaries
      });
    } catch (error) {
      logger.error("Failed to get incognito branch window", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
