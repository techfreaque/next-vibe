/**
 * Branch Management Hook
 * Derives branchIndices from leafMessageId and the loaded message set.
 * Branch switching updates the URL ?message= param (persistent, linkable).
 *
 * The leaf message ID is the single source of truth for which branch is shown.
 * Every ancestor is uniquely determined by walking up the parentId chain.
 */

"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ChatMessage } from "../../../../db";
import { useChatNavigationStore } from "../../../../hooks/use-chat-navigation-store";

export const BRANCH_INDEX_KEY = "__root__";

interface UseBranchManagementProps {
  /** All messages loaded in the current branch window */
  activeThreadMessages: ChatMessage[];
  /** The current leaf message ID (from URL ?message= param) */
  leafMessageId: string | null;
  /** The active thread ID */
  threadId: string;
  logger: EndpointLogger;
}

interface UseBranchManagementReturn {
  /** Map of parentId → selected child index, derived from leafMessageId */
  branchIndices: Record<string, number>;
  /** Switch branch: find the index-th sibling of children of parentId, update URL */
  handleSwitchBranch: (parentMessageId: string, branchIndex: number) => void;
}

const EMPTY_BRANCH_INDICES: Record<string, number> = {};

/**
 * Derive branchIndices by walking UP from leafMessageId through loaded messages.
 * For each node, find its index among its siblings (sorted by createdAt).
 */
function deriveBranchIndices(
  messages: ChatMessage[],
  leafMessageId: string | null,
): Record<string, number> {
  if (!leafMessageId || messages.length === 0) {
    return EMPTY_BRANCH_INDICES;
  }

  const byId = new Map<string, ChatMessage>();
  for (const msg of messages) {
    byId.set(msg.id, msg);
  }

  // Build parentId → children (sorted by createdAt)
  const childrenByParent = new Map<string | null, ChatMessage[]>();
  for (const msg of messages) {
    const key = msg.parentId ?? null;
    const arr = childrenByParent.get(key) ?? [];
    arr.push(msg);
    childrenByParent.set(key, arr);
  }
  for (const [key, arr] of childrenByParent.entries()) {
    childrenByParent.set(
      key,
      arr.toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    );
  }

  const indices: Record<string, number> = {};

  // Walk up from leaf
  let currentId: string | null = leafMessageId;
  while (currentId) {
    const msg = byId.get(currentId);
    if (!msg) {
      break;
    }

    const siblings = childrenByParent.get(msg.parentId ?? null) ?? [];
    if (siblings.length > 1) {
      const idx = siblings.findIndex((s) => s.id === currentId);
      const key = msg.parentId ?? BRANCH_INDEX_KEY;
      if (idx >= 0) {
        indices[key] = idx;
      }
    }

    currentId = msg.parentId;
  }

  return Object.keys(indices).length > 0 ? indices : EMPTY_BRANCH_INDICES;
}

// setLeafMessage is now just calling the navigation store's setLeafMessageId,
// which handles the URL update internally.

export function useBranchManagement({
  activeThreadMessages,
  leafMessageId,
  threadId,
  logger,
}: UseBranchManagementProps): UseBranchManagementReturn {
  const setLeafMessageId = useChatNavigationStore((s) => s.setLeafMessageId);

  // Derive branchIndices from the leaf + loaded messages (local — for branch navigator rendering)
  const branchIndices = useMemo(
    () => deriveBranchIndices(activeThreadMessages, leafMessageId),
    [activeThreadMessages, leafMessageId],
  );

  // Track message IDs to detect new messages for auto-switch
  const prevMessageIdsRef = useRef<Set<string>>(new Set());
  const leafMessageIdRef = useRef(leafMessageId);
  leafMessageIdRef.current = leafMessageId;

  /**
   * Auto-switch to new leaf when a new message arrives.
   * If the new message is a child of the current leaf (or current path's leaf),
   * update URL to the new message ID.
   */
  useEffect(() => {
    if (!threadId) {
      return;
    }

    const currentIds = new Set(activeThreadMessages.map((m) => m.id));
    const prevIds = prevMessageIdsRef.current;
    prevMessageIdsRef.current = currentIds;

    if (prevIds.size === 0) {
      // Initial load — don't auto-switch, URL already has the right leaf
      return;
    }

    const newMessages = activeThreadMessages
      .filter((m) => !prevIds.has(m.id))
      .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (newMessages.length === 0) {
      return;
    }

    // Auto-switch to the newest new message
    const newest = newMessages[0];
    if (!newest) {
      return;
    }

    const currentLeaf = leafMessageIdRef.current;

    // Only auto-switch when the new message is a direct child of the current leaf.
    // This handles streaming (new AI response) and retries.
    // Do NOT auto-switch when:
    //   - currentLeaf is null (no branch selected — avoid corrupting URL with old messages)
    //   - loading older history (new messages are not children of the current leaf)
    if (currentLeaf && newest.parentId === currentLeaf) {
      logger.debug("[BranchManagement] Auto-switching to new leaf", {
        newLeaf: newest.id,
        threadId,
      });
      setLeafMessageId(newest.id);
    }
  }, [activeThreadMessages, threadId, logger, setLeafMessageId]);

  /**
   * Switch branch: find the index-th sibling of children of parentMessageId,
   * then walk DOWN locally to find the true leaf of that branch.
   * Update URL to that leaf.
   *
   * Walking down locally is correct because the server returns ALL branch paths
   * in the chunk — every sibling and all their descendants are in the loaded set.
   */
  const handleSwitchBranch = useCallback(
    (parentMessageId: string, branchIndex: number): void => {
      // Build children map (sorted by createdAt ascending)
      const childrenByParent = new Map<string | null, ChatMessage[]>();
      for (const msg of activeThreadMessages) {
        const key = msg.parentId ?? null;
        const arr = childrenByParent.get(key) ?? [];
        arr.push(msg);
        childrenByParent.set(key, arr);
      }
      for (const [key, arr] of childrenByParent.entries()) {
        childrenByParent.set(
          key,
          arr.toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
        );
      }

      // Get the children of the fork point
      const parentKey =
        parentMessageId === BRANCH_INDEX_KEY ? null : parentMessageId;
      const children = childrenByParent.get(parentKey) ?? [];
      const clamped = Math.min(Math.max(0, branchIndex), children.length - 1);
      const targetSibling = children[clamped];

      if (!targetSibling) {
        return;
      }

      // Walk DOWN from the target sibling to find the true leaf.
      // Always follow the latest child (by createdAt) at each level.
      // The chunk contains ALL branch paths so this walk is complete.
      let trueLeafId = targetSibling.id;
      let currentId = targetSibling.id;
      while (true) {
        const kids = childrenByParent.get(currentId);
        if (!kids || kids.length === 0) {
          break;
        }
        // kids is sorted ascending — take the last one (latest)
        const latestKid = kids[kids.length - 1];
        if (!latestKid) {
          break;
        }
        trueLeafId = latestKid.id;
        currentId = latestKid.id;
      }

      logger.debug("[BranchManagement] Switching branch", {
        parentMessageId,
        branchIndex,
        sibling: targetSibling.id,
        trueLeaf: trueLeafId,
        threadId,
      });

      setLeafMessageId(trueLeafId);
    },
    [activeThreadMessages, threadId, logger, setLeafMessageId], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { branchIndices, handleSwitchBranch };
}
