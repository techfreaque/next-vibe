/**
 * Message tree walks must terminate on a corrupt parentId cycle.
 *
 * Prod 2026-11-25: a dequeued message was re-parented under its own
 * descendant (queued Q -> user U replied under Q -> stream under U ->
 * advanceQueuedMessages moved Q under that stream's tool row), leaving
 * U -> Q -> T -> A -> U. Rendering that thread spun the Next.js renderer at
 * 100% CPU forever on both nodes. A synchronous loop cannot be interrupted by
 * the test runner's timeout, so the walk first runs in a child process with
 * a hard timeout: before the fix it hangs and the child is killed.
 */

import { describe, expect, it } from "bun:test";
import type { ChatMessage } from "next-vibe/agent/chat/db";
import { ChatMessageRole } from "next-vibe/agent/chat/enum";
import { deriveBranchIndices } from "next-vibe/agent/chat/threads/[threadId]/messages/hooks/use-branch-management";

import { buildMessagePath } from "./thread-builder";

const THREAD_ID = "00000000-0000-4000-8000-0000000000aa";

const ids = {
  root: "00000000-0000-4000-8000-000000000001",
  firstReply: "00000000-0000-4000-8000-000000000002",
  user: "00000000-0000-4000-8000-000000000003",
  assistant: "00000000-0000-4000-8000-000000000004",
  tool: "00000000-0000-4000-8000-000000000005",
  queued: "00000000-0000-4000-8000-000000000006",
  afterQueued: "00000000-0000-4000-8000-000000000007",
  leaf: "00000000-0000-4000-8000-000000000008",
};

function message(
  id: string,
  parentId: string | null,
  role: ChatMessageRole,
  order: number,
): ChatMessage {
  const at = new Date(1_700_000_000_000 + order * 1000);
  return {
    id,
    threadId: THREAD_ID,
    role,
    content: role === ChatMessageRole.TOOL ? null : `message ${String(order)}`,
    parentId,
    sequenceId: null,
    authorId: null,
    authorName: null,
    isAI: role !== ChatMessageRole.USER,
    model: null,
    skill: null,
    errorType: null,
    errorMessage: null,
    errorCode: null,
    metadata: {},
    upvotes: 0,
    downvotes: 0,
    createdAt: at,
    updatedAt: at,
  };
}

/** Same shape as the corrupt prod thread: user -> queued -> tool -> assistant -> user. */
function cyclicThread(): ChatMessage[] {
  return [
    message(ids.root, null, ChatMessageRole.USER, 1),
    message(ids.firstReply, ids.root, ChatMessageRole.ASSISTANT, 2),
    message(ids.user, ids.queued, ChatMessageRole.USER, 3),
    message(ids.assistant, ids.user, ChatMessageRole.ASSISTANT, 4),
    message(ids.tool, ids.assistant, ChatMessageRole.TOOL, 5),
    message(ids.queued, ids.tool, ChatMessageRole.USER, 6),
    message(ids.afterQueued, ids.queued, ChatMessageRole.ASSISTANT, 7),
    message(ids.leaf, ids.afterQueued, ChatMessageRole.ASSISTANT, 8),
  ];
}

describe("message tree walks on a parentId cycle", () => {
  it("terminate within a hard timeout (child process)", () => {
    const script = `
      const { buildMessagePath } = await import(${JSON.stringify(
        new URL("./thread-builder.ts", import.meta.url).pathname,
      )});
      const { deriveBranchIndices } = await import(${JSON.stringify(
        new URL(
          "../../../../vibe/agent/chat/threads/[threadId]/messages/hooks/use-branch-management.ts",
          import.meta.url,
        ).pathname,
      )});
      const at = (n) => new Date(1700000000000 + n * 1000);
      const m = (id, parentId, role, n) => ({ id, parentId, role, threadId: "t", content: "x", sequenceId: null, metadata: {}, createdAt: at(n), updatedAt: at(n) });
      const messages = ${JSON.stringify(
        cyclicThread().map((m) => [
          m.id,
          m.parentId,
          m.role,
          m.createdAt.getTime(),
        ]),
      )}.map(([id, parentId, role, ts]) => m(id, parentId, role, (ts - 1700000000000) / 1000));
      const withLeaf = buildMessagePath(messages, {}, ${JSON.stringify(ids.leaf)});
      const fallback = buildMessagePath(messages, {}, null);
      const indices = deriveBranchIndices(messages, ${JSON.stringify(ids.leaf)});
      process.stdout.write(JSON.stringify({ withLeaf: withLeaf.path.length, fallback: fallback.path.length, indices: Object.keys(indices).length }));
    `;
    const result = Bun.spawnSync({
      cmd: [process.execPath, "--eval", script],
      cwd: process.cwd(),
      timeout: 20_000,
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(result.signalCode ?? null).toBeNull();
    expect(result.exitCode).toBe(0);
    const out: { withLeaf: number; fallback: number; indices: number } =
      JSON.parse(result.stdout.toString());
    expect(out.withLeaf).toBeGreaterThan(0);
    expect(out.fallback).toBeGreaterThan(0);
  });

  it("buildMessagePath visits each cycle member once (leaf walk)", () => {
    const { path } = buildMessagePath(cyclicThread(), {}, ids.leaf);
    const pathIds = path.map((m) => m.id);
    expect(new Set(pathIds).size).toBe(pathIds.length);
    expect(pathIds.at(-1)).toBe(ids.leaf);
    expect(pathIds).toContain(ids.queued);
  });

  it("buildMessagePath fallback walk from the root terminates", () => {
    const { path } = buildMessagePath(cyclicThread(), {}, null);
    expect(path.map((m) => m.id)).toEqual([ids.root, ids.firstReply]);
  });

  it("deriveBranchIndices terminates on the cycle", () => {
    const indices = deriveBranchIndices(cyclicThread(), ids.leaf);
    expect(typeof indices).toBe("object");
  });

  it("still builds a normal linear thread", () => {
    const linear = [
      message(ids.root, null, ChatMessageRole.USER, 1),
      message(ids.firstReply, ids.root, ChatMessageRole.ASSISTANT, 2),
      message(ids.user, ids.firstReply, ChatMessageRole.USER, 3),
    ];
    expect(
      buildMessagePath(linear, {}, ids.user).path.map((m) => m.id),
    ).toEqual([ids.root, ids.firstReply, ids.user]);
    expect(buildMessagePath(linear, {}, null).path.map((m) => m.id)).toEqual([
      ids.root,
      ids.firstReply,
      ids.user,
    ]);
  });
});
