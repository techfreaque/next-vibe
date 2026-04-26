import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { BRANCH_INDEX_KEY } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/hooks/use-branch-management";

/**
 * Returns true if the given siblings represent actual user-facing branches.
 *
 * Parallel tool calls from a single AI step all share the same non-null sequenceId —
 * they should NOT trigger the branch navigator.
 * User messages always have sequenceId=null, so multiple user-message siblings are
 * always real branches (retry/edit creates a new sibling user message).
 */
function isRealBranch(siblings: ChatMessage[]): boolean {
  if (siblings.length <= 1) {
    return false;
  }
  const seqs = new Set(siblings.map((s) => s.sequenceId));
  // If all siblings share the same non-null sequenceId → parallel tool calls, not a real branch
  if (seqs.size === 1) {
    const [onlySeq] = seqs;
    if (onlySeq !== null) {
      return false;
    }
  }
  return true;
}

/**
 * Get direct replies for a specific message
 */
export function getDirectReplies(
  messages: ChatMessage[],
  messageId: string,
): ChatMessage[] {
  return messages.filter((msg) => msg.parentId === messageId);
}

/**
 * Get root messages (messages with no parent or parent is root)
 */
export function getRootMessages(
  messages: ChatMessage[],
  rootMessageId: string | null,
): ChatMessage[] {
  return messages.filter((msg) => msg.parentId === rootMessageId);
}

/**
 * Build a linear path through the message tree
 * Follows parent-child relationships, selecting branches based on branchIndices
 * Returns the path and information about available branches at each level
 *
 * Special handling for root-level branches:
 * When there are multiple root messages (parentId === null), they are treated as
 * siblings at the root level. Use branchIndices[BRANCH_INDEX_KEY] to select which root to follow.
 */
export function buildMessagePath(
  messages: ChatMessage[],
  branchIndices: Record<string, number> = {},
  leafMessageId?: string | null,
): {
  path: ChatMessage[];
  branchInfo: Record<string, { siblings: ChatMessage[]; currentIndex: number }>;
} {
  const messageIds = new Set(messages.map((m) => m.id));
  const byId = new Map<string, ChatMessage>(messages.map((m) => [m.id, m]));

  // Build a map of children for each message (sorted by timestamp).
  // Exclude optimistic placeholders — they are ephemeral and must not create
  // false branches while the real server message arrives with the same parentId.
  const childrenMap = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    if (msg.parentId && !msg.metadata?.isOptimistic) {
      const siblings = childrenMap.get(msg.parentId) ?? [];
      siblings.push(msg);
      childrenMap.set(msg.parentId, siblings);
    }
  }
  for (const [parentId, siblings] of childrenMap.entries()) {
    childrenMap.set(
      parentId,
      siblings.toSorted(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      ),
    );
  }

  // When leafMessageId is known and present in the window, build the path by walking
  // UP from the leaf to the oldest loaded ancestor, then reversing.
  // This correctly handles partially-loaded branch windows (e.g. after compaction) where
  // the ancestry chain has gaps - it doesn't require a fully-connected tree from root to leaf.
  if (leafMessageId && messageIds.has(leafMessageId)) {
    const reversePath: ChatMessage[] = [];
    let cur: string | null = leafMessageId;
    while (cur && messageIds.has(cur)) {
      const msg = byId.get(cur);
      if (!msg) {
        break;
      }
      reversePath.push(msg);
      cur = msg.parentId;
    }
    reversePath.reverse();

    // Build branchInfo so the branch navigator renders correctly.
    // Only record real branches - parallel tool calls in a single AI step share
    // the same sequenceId and must NOT trigger the branch navigator.
    const branchInfo: Record<
      string,
      { siblings: ChatMessage[]; currentIndex: number }
    > = {};
    for (const msg of reversePath) {
      const siblings = childrenMap.get(msg.parentId ?? "") ?? [];
      if (msg.parentId && siblings.length > 1 && isRealBranch(siblings)) {
        const idx = siblings.findIndex((s) => s.id === msg.id);
        branchInfo[msg.parentId] = {
          siblings,
          currentIndex: idx >= 0 ? idx : 0,
        };
      }
    }
    // Root-level: if the oldest ancestor has siblings (other orphan roots), expose them
    const oldest = reversePath[0];
    if (oldest) {
      const rootMessages = messages
        .filter(
          (msg) =>
            !msg.metadata?.isOptimistic &&
            (!msg.parentId || !messageIds.has(msg.parentId)),
        )
        .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      if (rootMessages.length > 1 && isRealBranch(rootMessages)) {
        const rootIdx = rootMessages.findIndex((r) => r.id === oldest.id);
        branchInfo[BRANCH_INDEX_KEY] = {
          siblings: rootMessages,
          currentIndex: rootIdx >= 0 ? rootIdx : 0,
        };
      }
    }

    return { path: reversePath, branchInfo };
  }

  // Fallback: no leafMessageId - traverse DOWN from roots using branchIndices.
  // Find ALL root messages: messages with no parent OR whose parent is not in the current window.
  // Exclude optimistic placeholders from root detection too.
  const rootMessages = messages
    .filter(
      (msg) =>
        !msg.metadata?.isOptimistic &&
        (!msg.parentId || !messageIds.has(msg.parentId)),
    )
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  if (rootMessages.length === 0) {
    return { path: [], branchInfo: {} };
  }

  const path: ChatMessage[] = [];
  const branchInfo: Record<
    string,
    { siblings: ChatMessage[]; currentIndex: number }
  > = {};

  let currentMessage: ChatMessage | undefined;
  if (rootMessages.length > 1 && isRealBranch(rootMessages)) {
    // Default to last (most recent) branch when no explicit index is stored
    const rootBranchIndex =
      branchIndices[BRANCH_INDEX_KEY] ?? rootMessages.length - 1;
    const validRootIndex = Math.min(
      Math.max(0, rootBranchIndex),
      rootMessages.length - 1,
    );
    branchInfo[BRANCH_INDEX_KEY] = {
      siblings: rootMessages,
      currentIndex: validRootIndex,
    };
    currentMessage = rootMessages[validRootIndex];
  } else {
    currentMessage = rootMessages[0];
  }

  while (currentMessage) {
    path.push(currentMessage);

    const children = childrenMap.get(currentMessage.id);
    if (!children || children.length === 0) {
      break;
    }

    if (children.length > 1 && isRealBranch(children)) {
      // Default to last (most recent) branch when no explicit index is stored
      const branchIndex =
        branchIndices[currentMessage.id] ?? children.length - 1;
      const validIndex = Math.min(
        Math.max(0, branchIndex),
        children.length - 1,
      );
      branchInfo[currentMessage.id] = {
        siblings: children,
        currentIndex: validIndex,
      };
      currentMessage = children[validIndex];
    } else if (children.length > 1) {
      // Same-sequence siblings (parallel tool calls) - pick latest by createdAt
      currentMessage = children[children.length - 1];
    } else {
      currentMessage = children[0];
    }
  }

  return { path, branchInfo };
}

/**
 * Get the last message in the currently selected branch path
 * This is the message that should be used as the parent for new messages
 *
 * @param messages - All messages in the thread
 * @param branchIndices - Current branch selection state
 * @returns The last message in the selected path, or null if no messages
 */
export function getLastMessageInBranch(
  messages: ChatMessage[],
  branchIndices: Record<string, number> = {},
): ChatMessage | null {
  const { path } = buildMessagePath(messages, branchIndices);
  return path.length > 0 ? path[path.length - 1] : null;
}
