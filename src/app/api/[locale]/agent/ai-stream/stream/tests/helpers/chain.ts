/**
 * Parent-chain integrity helpers for the AI-stream suites.
 *
 * A thread is a strict tree: one root (parentId=null), every parentId
 * resolves, and creation order matches the chain (a child is never older than
 * its parent — except across compacting nodes, which are inserted after their
 * child and re-parent it).
 */

import "server-only";

import type { SlimMessage } from "../../../testing/headless-test-runner";

/** Walk parent chain from leafId → root. Returns [root, ..., leaf] */
export function walkChain(messages: SlimMessage[], leafId: string): string[] {
  const byId = new Map(messages.map((m) => [m.id, m]));
  const chain: string[] = [];
  let current: SlimMessage | undefined = byId.get(leafId);
  while (current) {
    chain.unshift(current.id);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return chain;
}

/** Build parent→children adjacency map. Root messages keyed under "__root__". */
export function buildTree(messages: SlimMessage[]): Map<string, string[]> {
  const tree = new Map<string, string[]>();
  for (const msg of messages) {
    const parentKey = msg.parentId ?? "__root__";
    const existing = tree.get(parentKey);
    if (existing) {
      existing.push(msg.id);
    } else {
      tree.set(parentKey, [msg.id]);
    }
  }
  return tree;
}

export function msgDesc(m: SlimMessage): string {
  const tool = m.toolCall?.toolName ? `:${m.toolCall.toolName}` : "";
  const preview = m.content ? ` "${m.content.slice(0, 40)}"` : "";
  const ts = m.createdAt.toISOString().slice(11, 23);
  const parent = m.parentId ? ` parent=${m.parentId.slice(0, 8)}` : "";
  return `${m.id.slice(0, 8)}(${m.role}${tool}${preview} @${ts}${parent})`;
}

/**
 * Shared core of assertChainIntegrity (checks 1-2) and assertParentTimeOrder:
 *
 * 1. No orphans - every parentId must reference an existing message.
 *    And the chain must match creation order: a child can never be older
 *    than its parent. This applies to EVERY message in the thread - any
 *    violation means a write used a stale parent (e.g. continuing from a
 *    pre-compacting tip after a compacting message was inserted).
 *    EXCEPTION: a compacting node is intentionally inserted between an
 *    existing leaf and the current turn AFTER that turn's user message was
 *    created, then the user message is re-parented under it — so a compacting
 *    PARENT legitimately has a later createdAt than its child. Skip the time
 *    check only when the parent is a compacting node.
 * 2. Exactly one root (parentId=null).
 */
function assertChainCore(
  messages: SlimMessage[],
  byId: Map<string, SlimMessage>,
): void {
  const roots: SlimMessage[] = [];
  for (const msg of messages) {
    if (!msg.parentId) {
      roots.push(msg);
      continue;
    }
    const parent = byId.get(msg.parentId);
    if (!parent) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `Orphan: ${msgDesc(msg)} → parentId ${msg.parentId} not in thread`,
      );
    }
    if (
      !parent.isCompacting &&
      parent.createdAt.getTime() > msg.createdAt.getTime()
    ) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `Chain/time mismatch: ${msgDesc(msg)} (created ${msg.createdAt.toISOString()}) ` +
          `is a child of ${msgDesc(parent)} created LATER (${parent.createdAt.toISOString()}) - ` +
          `the parentId chain does not match creation order`,
      );
    }
  }
  if (roots.length !== 1) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
    throw new Error(
      roots.length === 0
        ? "No root message (all messages have a parentId)"
        : `Multiple root messages (parentId=null): ${roots.map((m) => msgDesc(m)).join(", ")}`,
    );
  }
}

export interface ChainIntegrityOptions {
  /**
   * The ID of the expected active leaf - the "current tip" of the main chain.
   * When provided, every leaf that is NOT this ID must be in knownDeadEndLeaves.
   * This catches silent dead-end branches that assertNoOrphans would miss.
   */
  expectedLeafId?: string;
  /**
   * Set of leaf IDs that are known dead-ends (explicitly branched away from,
   * never to be continued). These are allowed to exist alongside expectedLeafId.
   * Accumulate this set as the test sequence progresses.
   */
  knownDeadEndLeaves?: Set<string>;
}

/**
 * Full chain integrity check - call after every test turn.
 *
 * 1. No orphans: every parentId references a message that exists in the thread.
 * 2. Exactly one root (parentId=null).
 * 3. No unexpected branches: every message has ≤1 child unless in knownBranchPoints.
 * 4. Full reachability: every message is reachable from some leaf.
 * 5. Leaf whitelist (when expectedLeafId set): every leaf must be either
 *    expectedLeafId or in knownDeadEndLeaves - catches silent dead-end branches.
 *
 * knownBranchPoints: IDs allowed to have >1 child (intentional branch nodes).
 */
export function assertChainIntegrity(
  messages: SlimMessage[],
  knownBranchPoints: Set<string> = new Set(),
  options: ChainIntegrityOptions = {},
): void {
  const byId = new Map(messages.map((m) => [m.id, m]));
  const tree = buildTree(messages);

  // 1. + 2. Orphans, creation-order and single-root (shared core)
  assertChainCore(messages, byId);

  // 3. No unexpected branches - every message has ≤1 child unless whitelisted
  for (const [parentId, children] of tree.entries()) {
    if (parentId === "__root__") {
      continue;
    }
    if (knownBranchPoints.has(parentId) || children.length <= 1) {
      continue;
    }
    const parent = byId.get(parentId);
    const childList = children.map((id) => msgDesc(byId.get(id)!)).join("\n  ");
    // Walk up from parent to root to show the full ancestor chain
    const ancestors: string[] = [];
    let ancestorCursor = parent;
    const seen = new Set<string>();
    while (ancestorCursor && !seen.has(ancestorCursor.id)) {
      seen.add(ancestorCursor.id);
      ancestors.unshift(msgDesc(ancestorCursor));
      ancestorCursor = ancestorCursor.parentId
        ? byId.get(ancestorCursor.parentId)
        : undefined;
    }
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
    throw new Error(
      `Branch violation on ${parent ? msgDesc(parent) : parentId}: has ${String(children.length)} children (expected 1):\n  ${childList}\nAncestor chain:\n  ${ancestors.join("\n  ")}`,
    );
  }

  // 4. Full reachability - every message must be reachable from some leaf
  const leaves = messages.filter((m) => !tree.get(m.id)?.length);
  const reachable = new Set<string>();
  for (const leaf of leaves) {
    for (const id of walkChain(messages, leaf.id)) {
      reachable.add(id);
    }
  }
  for (const msg of messages) {
    if (!reachable.has(msg.id)) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `Unreachable message (disconnected from all leaves): ${msgDesc(msg)}`,
      );
    }
  }

  // 5. Leaf whitelist - every leaf must be expectedLeafId or a known dead-end
  const { expectedLeafId, knownDeadEndLeaves } = options;
  if (expectedLeafId) {
    const unexpectedLeaves = leaves.filter(
      (m) => m.id !== expectedLeafId && !knownDeadEndLeaves?.has(m.id),
    );
    if (unexpectedLeaves.length > 0) {
      const leafList = unexpectedLeaves
        .map((m) => `  ${msgDesc(m)}`)
        .join("\n");
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `Unexpected dead-end leaf(s) - expected active tip to be ${expectedLeafId} but found unwhitelisted leaves:\n${leafList}\n` +
          `Add these to knownDeadEndLeaves if they are intentional branch dead-ends.`,
      );
    }
    if (!byId.has(expectedLeafId)) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(`expectedLeafId ${expectedLeafId} not found in messages`);
    }
    if (!leaves.some((m) => m.id === expectedLeafId)) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `expectedLeafId ${expectedLeafId} is not a leaf - it has children`,
      );
    }
  }
}

/**
 * Universal per-step invariant, enforced on EVERY runStream snapshot:
 * every parentId resolves, exactly one root, and no message is older than
 * its parent - the chain must match creation order across the whole thread.
 * Branch/leaf whitelist checks stay at the per-step assertChainIntegrity
 * call sites, which know the suite's intentional branch state.
 */
export function assertParentTimeOrder(messages: SlimMessage[]): void {
  if (messages.length === 0) {
    return;
  }
  const byId = new Map(messages.map((m) => [m.id, m]));
  assertChainCore(messages, byId);
}

// Keep assertNoOrphans as thin alias for backwards-compat within tests
export function assertNoOrphans(
  messages: SlimMessage[],
  knownBranchPoints: Set<string> = new Set(),
  options: ChainIntegrityOptions = {},
): void {
  assertChainIntegrity(messages, knownBranchPoints, options);
}
