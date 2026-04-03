/**
 * AI Stream Integration Tests
 *
 * Fully end-to-end: every test runs the complete stack (AI SDK, tool execution,
 * DB writes, credit deduction) on every run.
 *
 * HTTP caching layer (installFetchCache) intercepts outbound fetch() calls and
 * stores real wire-level responses in fixtures/http-cache/ on first run.
 * Subsequent runs replay from cache — same code path, no network required.
 *
 * Cache bust: delete fixtures/http-cache/ (or specific subdirectories).
 *
 * All test threads land in the CRON folder (isolated from personal chats).
 * Requires dev DB with admin user seeded (run: vibe dev or vibe seed).
 *
 * Test structure:
 *   - "Conversation Thread": T1–T6 share a single thread to test multi-turn,
 *     tool calls, retry/branch, and full tree validation.
 *   - "Media Generation": image/music/video gen in standalone threads with
 *     full parent chain + metadata validation.
 *   - "Credits": credit deduction, insufficient credits, incognito (no persistence).
 *   - "Error Handling": empty content, invalid thread, invalid parent.
 */

import "server-only";

// Install HTTP fetch interceptor before any other imports touch fetch
import { installFetchCache } from "../testing/fetch-cache";
installFetchCache();

import { beforeAll, describe, expect, it } from "vitest";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { eq, sql } from "drizzle-orm";

import { env } from "@/config/env";
import { setFetchCacheContext } from "../testing/fetch-cache";
import {
  runTestStream,
  toolResultRecord,
  type SlimMessage,
} from "../testing/headless-test-runner";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    return null;
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  return {
    isPublic: false,
    id: user.id,
    leadId: link.leadId,
    roles,
  };
}

/** Walk parent chain from leafId and return ordered ids root → leaf */
function walkChain(messages: SlimMessage[], leafId: string): string[] {
  const byId = new Map(messages.map((m) => [m.id, m]));
  const chain: string[] = [];
  let current: SlimMessage | undefined = byId.get(leafId);
  while (current) {
    chain.unshift(current.id);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return chain;
}

/**
 * Build a parent→children adjacency map from a flat message list.
 * Root messages (parentId === null) are keyed under "__root__".
 */
function buildTree(messages: SlimMessage[]): Map<string, string[]> {
  const tree = new Map<string, string[]>();
  for (const msg of messages) {
    const parentKey = msg.parentId ?? "__root__";
    const children = tree.get(parentKey);
    if (children) {
      children.push(msg.id);
    } else {
      tree.set(parentKey, [msg.id]);
    }
  }
  return tree;
}

/** Assert that no orphan messages exist (every parentId references a real message) */
function assertNoOrphans(messages: SlimMessage[]): void {
  const idSet = new Set(messages.map((m) => m.id));
  for (const msg of messages) {
    if (msg.parentId) {
      expect(
        idSet.has(msg.parentId),
        `Orphan: message ${msg.id} (${msg.role}) references non-existent parent ${msg.parentId}`,
      ).toBe(true);
    }
  }
}

/** Assert messages are in strictly ascending chronological order */
function assertChronologicalOrder(
  chain: string[],
  messages: SlimMessage[],
): void {
  const byId = new Map(messages.map((m) => [m.id, m]));
  for (let i = 1; i < chain.length; i++) {
    const prev = byId.get(chain[i - 1]!)!;
    const curr = byId.get(chain[i]!)!;
    expect(
      curr.createdAt.getTime() >= prev.createdAt.getTime(),
      `Message ${curr.id} (${curr.role}) created before its ancestor ${prev.id} (${prev.role})`,
    ).toBe(true);
  }
}

/** Assert that the thread's streamingState is idle in DB */
async function assertThreadIdle(threadId: string): Promise<void> {
  const [thread] = await db
    .select({ streamingState: chatThreads.streamingState })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId));
  expect(thread?.streamingState).toBe("idle");
}

/** Filter messages by role */
function byRole(messages: SlimMessage[], role: string): SlimMessage[] {
  return messages.filter((m) => m.role === role);
}

/** Get the N newest messages added since a previous snapshot count */
function newMessages(
  messages: SlimMessage[],
  prevCount: number,
): SlimMessage[] {
  const sorted = [...messages].toSorted(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
  return sorted.slice(prevCount);
}

// ── Test Suite ────────────────────────────────────────────────────────────────

const TEST_TIMEOUT = 120_000;

describe("AI Stream Integration", () => {
  let testUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;

    // Ensure test user has enough credits for all tests including media gen (video ~325 credits)
    const logger = createEndpointLogger(false, Date.now(), defaultLocale);
    const { t } = creditsScopedTranslation.scopedT(defaultLocale);
    const balanceResult = await CreditRepository.getCreditBalanceForUser(
      testUser,
      defaultLocale,
      logger,
      t,
    );
    const balance = balanceResult.success ? balanceResult.data.total : 0;
    const MIN_BALANCE = 1000;
    if (balance < MIN_BALANCE) {
      await CreditRepository.addUserCredits(
        testUser.id,
        MIN_BALANCE - balance,
        "permanent",
        logger,
        t,
      );
    }
  }, TEST_TIMEOUT);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Conversation Thread: multi-turn with branching (shared thread)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe("Conversation Thread", () => {
    let threadId: string;

    // Turn 1 artifacts
    let t1UserMsgId: string;
    let t1AiMsgId: string;

    // Turn 2 artifacts
    let t2UserMsgId: string;
    let t2AiMsgId: string;

    // ── T1: Basic send (new thread) ──────────────────────────────────────
    it(
      "T1: basic send creates user + assistant with correct parent chain",
      async () => {
        setFetchCacheContext("basic-send");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt: "Reply with exactly the word: HELLO_TEST",
          threadMode: "new",
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }
        const { data } = result;

        // ── Response shape ──
        expect(data.lastAiMessageId).toBeTruthy();
        expect(data.lastAiMessageContent).toBeTruthy();
        expect(data.lastAiMessageContent).toContain("HELLO_TEST");
        expect(data.threadId).toBeTruthy();
        threadId = data.threadId!;

        // ── Exactly 1 user + 1 assistant (no tool calls, no compacting) ──
        const userMsgs = byRole(messages, "user");
        const aiMsgs = byRole(messages, "assistant");
        const toolMsgs = byRole(messages, "tool");
        expect(userMsgs).toHaveLength(1);
        expect(aiMsgs).toHaveLength(1);
        expect(toolMsgs).toHaveLength(0);
        expect(messages).toHaveLength(2);

        // ── Parent chain: user → assistant ──
        const userMsg = userMsgs[0]!;
        const aiMsg = aiMsgs[0]!;
        expect(userMsg.parentId).toBeNull();
        expect(aiMsg.parentId).toBe(userMsg.id);
        expect(aiMsg.id).toBe(data.lastAiMessageId);
        expect(aiMsg.content).toContain("HELLO_TEST");

        // ── Message metadata ──
        expect(userMsg.isAI).toBe(false);
        expect(aiMsg.isAI).toBe(true);
        expect(aiMsg.sequenceId).toBeTruthy();
        expect(aiMsg.model).toBeTruthy(); // Model recorded on AI message

        // ── User message has no model/sequenceId ──
        expect(userMsg.sequenceId).toBeNull();

        // ── No compacting or generated media ──
        expect(aiMsg.isCompacting).toBe(false);
        expect(aiMsg.generatedMedia).toBeNull();
        expect(aiMsg.toolCall).toBeNull();

        // ── Chronological order ──
        assertChronologicalOrder([userMsg.id, aiMsg.id], messages);

        // ── Thread streaming state is idle ──
        await assertThreadIdle(threadId);

        // ── No orphans ──
        assertNoOrphans(messages);

        t1UserMsgId = userMsg.id;
        t1AiMsgId = aiMsg.id;
      },
      TEST_TIMEOUT,
    );

    // ── T2: Multi-turn append ────────────────────────────────────────────
    it(
      "T2: append links user→assistant to previous turn's assistant",
      async () => {
        setFetchCacheContext("parent-child-chain");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt: "Say: TURN2_RESPONSE",
          threadMode: "append",
          threadId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }
        expect(result.data.threadId).toBe(threadId);

        // ── Total message count: 2 from T1 + 2 from T2 = 4 ──
        expect(messages).toHaveLength(4);

        // ── Find turn 2's user message (child of t1's assistant) ──
        const t2User = messages.find(
          (m) => m.role === "user" && m.parentId === t1AiMsgId,
        );
        expect(t2User).toBeDefined();
        expect(t2User!.isAI).toBe(false);
        t2UserMsgId = t2User!.id;

        // ── Turn 2's assistant is child of turn 2's user ──
        const t2Ai = messages.find((m) => m.id === result.data.lastAiMessageId);
        expect(t2Ai).toBeDefined();
        expect(t2Ai!.role).toBe("assistant");
        expect(t2Ai!.parentId).toBe(t2UserMsgId);
        expect(t2Ai!.content).toContain("TURN2");
        expect(t2Ai!.isAI).toBe(true);
        expect(t2Ai!.model).toBeTruthy();
        expect(t2Ai!.sequenceId).toBeTruthy();
        t2AiMsgId = t2Ai!.id;

        // ── Full chain: t1User → t1Ai → t2User → t2Ai ──
        const chain = walkChain(messages, t2AiMsgId);
        expect(chain).toEqual([t1UserMsgId, t1AiMsgId, t2UserMsgId, t2AiMsgId]);

        // ── Chronological order along the chain ──
        assertChronologicalOrder(chain, messages);

        // ── T1 messages still intact ──
        const t1User = messages.find((m) => m.id === t1UserMsgId);
        const t1Ai = messages.find((m) => m.id === t1AiMsgId);
        expect(t1User?.content).toContain("HELLO_TEST");
        expect(t1Ai?.content).toContain("HELLO_TEST");

        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
      },
      TEST_TIMEOUT,
    );

    // ── T3: Tool call ────────────────────────────────────────────────────
    it(
      "T3: tool call produces tool message with toolName, result, and correct parent chain",
      async () => {
        setFetchCacheContext("tool-call");
        const prevCount = 4; // T1 (2) + T2 (2)
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "Use the tool-help tool to list available tools. Return the tool names you find.",
          threadMode: "append",
          threadId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // ── At least 3 new messages: user, assistant (tool call), tool, assistant (response) ──
        const added = newMessages(messages, prevCount);
        expect(added.length).toBeGreaterThanOrEqual(3);

        // ── T3 user message is child of T2's assistant ──
        const t3User = added.find((m) => m.role === "user");
        expect(t3User).toBeDefined();
        expect(t3User!.parentId).toBe(t2AiMsgId);
        expect(t3User!.isAI).toBe(false);

        // ── Tool messages exist with valid structure ──
        const toolMessages = added.filter(
          (m) => m.role === "tool" && m.toolCall !== null,
        );
        expect(toolMessages.length).toBeGreaterThanOrEqual(1);

        const toolMsg = toolMessages[0]!;
        expect(toolMsg.toolCall?.toolName).toBeTruthy();
        expect(toolMsg.toolCall?.result).toBeDefined();
        expect(toolMsg.isAI).toBe(true);
        expect(toolMsg.model).toBeTruthy();

        // ── Tool result is a non-error record ──
        const toolRes = toolResultRecord(toolMsg.toolCall?.result);
        expect(toolRes).not.toBeNull();

        // ── Tool message parent is an assistant message ──
        const toolParent = messages.find((m) => m.id === toolMsg.parentId);
        expect(toolParent).toBeDefined();
        expect(toolParent!.role).toBe("assistant");

        // ── Assistant + tool share sequenceId (same turn) ──
        expect(toolMsg.sequenceId).toBeTruthy();
        expect(toolMsg.sequenceId).toBe(toolParent!.sequenceId);

        // ── Final assistant response exists after tool execution ──
        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(lastAi).toBeDefined();
        expect(lastAi!.role).toBe("assistant");
        expect(lastAi!.content).toBeTruthy();

        // ── Chain from last AI back to root ──
        const chain = walkChain(messages, lastAi!.id);
        expect(chain[0]).toBe(t1UserMsgId); // root
        expect(chain.length).toBeGreaterThanOrEqual(6); // t1u, t1a, t2u, t2a, t3u, ...tool chain..., t3a
        assertChronologicalOrder(chain, messages);

        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
      },
      TEST_TIMEOUT,
    );

    // ── T4: Retry — sibling at same branch point as T2 ───────────────────
    it(
      "T4: retry creates sibling user message at same branch point with full chain validation",
      async () => {
        setFetchCacheContext("retry");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt: "Say: RETRY_RESPONSE",
          threadMode: "append",
          threadId,
          explicitParentMessageId: t1AiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // ── The retry's user message is a sibling of T2's user message ──
        // (both have parentId === t1AiMsgId)
        const retryUserMsg = messages.find(
          (m) =>
            m.role === "user" &&
            m.parentId === t1AiMsgId &&
            m.id !== t2UserMsgId,
        );
        expect(retryUserMsg).toBeDefined();
        expect(retryUserMsg!.parentId).toBe(t1AiMsgId);
        expect(retryUserMsg!.isAI).toBe(false);

        // ── T2's user message still has same parent (sibling verification) ──
        const t2User = messages.find((m) => m.id === t2UserMsgId);
        expect(t2User?.parentId).toBe(t1AiMsgId);

        // ── Retry produced an assistant response ──
        const retryAiMsg = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(retryAiMsg).toBeDefined();
        expect(retryAiMsg!.role).toBe("assistant");
        expect(retryAiMsg!.parentId).toBe(retryUserMsg!.id);
        expect(retryAiMsg!.content).toContain("RETRY");
        expect(retryAiMsg!.isAI).toBe(true);
        expect(retryAiMsg!.sequenceId).toBeTruthy();

        // ── Retry chain is independent from T2 chain ──
        const retryChain = walkChain(messages, retryAiMsg!.id);
        expect(retryChain).toEqual([
          t1UserMsgId,
          t1AiMsgId,
          retryUserMsg!.id,
          retryAiMsg!.id,
        ]);
        // T2 chain is still t1User → t1Ai → t2User → t2Ai
        const t2Chain = walkChain(messages, t2AiMsgId);
        expect(t2Chain).toEqual([
          t1UserMsgId,
          t1AiMsgId,
          t2UserMsgId,
          t2AiMsgId,
        ]);

        assertChronologicalOrder(retryChain, messages);
        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
      },
      TEST_TIMEOUT,
    );

    // ── T5: Branch — different content from same branch point ────────────
    it(
      "T5: branch creates another sibling with different content and independent chain",
      async () => {
        setFetchCacheContext("branch");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt: "Say: BRANCH_RESPONSE",
          threadMode: "append",
          threadId,
          explicitParentMessageId: t1AiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // ── Find all user messages that are children of t1AiMsgId ──
        const siblings = messages.filter(
          (m) => m.role === "user" && m.parentId === t1AiMsgId,
        );
        // Should be 3: T2's user, T4's retry user, T5's branch user
        expect(siblings).toHaveLength(3);

        // ── Each sibling has distinct content ──
        const siblingContents = siblings.map((s) => s.content);
        const uniqueContents = new Set(siblingContents);
        expect(uniqueContents.size).toBe(3);

        // ── Branch's assistant response ──
        const branchAiMsg = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(branchAiMsg).toBeDefined();
        expect(branchAiMsg!.role).toBe("assistant");
        expect(branchAiMsg!.content).toContain("BRANCH");
        expect(branchAiMsg!.isAI).toBe(true);

        // ── Branch user is a new sibling, not the same as T2 or T4 ──
        const branchUser = messages.find((m) => m.id === branchAiMsg!.parentId);
        expect(branchUser).toBeDefined();
        expect(branchUser!.parentId).toBe(t1AiMsgId);
        expect(branchUser!.id).not.toBe(t2UserMsgId);

        // ── Branch chain: root → t1Ai → branchUser → branchAi ──
        const branchChain = walkChain(messages, branchAiMsg!.id);
        expect(branchChain).toHaveLength(4);
        expect(branchChain[0]).toBe(t1UserMsgId);
        expect(branchChain[1]).toBe(t1AiMsgId);
        assertChronologicalOrder(branchChain, messages);

        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
      },
      TEST_TIMEOUT,
    );

    // ── T6: Full tree validation ─────────────────────────────────────────
    it(
      "T6: full tree has expected structure — no orphans, correct branching, all content present",
      async () => {
        // Run one more turn to get fresh full message list
        setFetchCacheContext("tree-validation");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt: "Say: FINAL_CHECK",
          threadMode: "append",
          threadId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // ── No orphans ──
        assertNoOrphans(messages);

        // ── Exactly 1 root (parentId === null) ──
        const roots = messages.filter((m) => m.parentId === null);
        expect(roots).toHaveLength(1);
        expect(roots[0]!.role).toBe("user");
        expect(roots[0]!.id).toBe(t1UserMsgId);

        // ── Build tree and validate branching ──
        const tree = buildTree(messages);

        // t1AiMsgId should have exactly 3 user children (T2, T4 retry, T5 branch)
        const t1AiChildren = tree.get(t1AiMsgId) ?? [];
        const t1AiUserChildren = t1AiChildren.filter((childId) => {
          const msg = messages.find((m) => m.id === childId);
          return msg?.role === "user";
        });
        expect(t1AiUserChildren).toHaveLength(3);

        // ── Root has exactly 1 child (T1 root → t1User has no siblings) ──
        const rootChildren = tree.get("__root__") ?? [];
        expect(rootChildren).toHaveLength(1);
        expect(rootChildren[0]).toBe(t1UserMsgId);

        // ── t1UserMsgId has exactly 1 child (t1AiMsg) ──
        const t1UserChildren = tree.get(t1UserMsgId) ?? [];
        expect(t1UserChildren).toHaveLength(1);
        expect(t1UserChildren[0]).toBe(t1AiMsgId);

        // ── Every message has correct role-based metadata ──
        for (const msg of messages) {
          if (msg.role === "user") {
            expect(msg.isAI).toBe(false);
          }
          if (msg.role === "assistant" || msg.role === "tool") {
            expect(msg.isAI).toBe(true);
          }
        }

        // ── Verify distinct content across all turns ──
        const assistantContents = messages
          .filter((m) => m.role === "assistant" && m.content)
          .map((m) => m.content!);
        for (const keyword of [
          "HELLO_TEST",
          "TURN2",
          "RETRY",
          "BRANCH",
          "FINAL",
        ]) {
          expect(
            assistantContents.some((c) => c.includes(keyword)),
            `Expected to find "${keyword}" in assistant messages`,
          ).toBe(true);
        }

        // ── All assistant messages have model set ──
        const allAssistants = byRole(messages, "assistant");
        for (const ai of allAssistants) {
          if (ai.content) {
            // Content-bearing assistants should have model
            expect(ai.model).toBeTruthy();
          }
        }

        await assertThreadIdle(threadId);
      },
      TEST_TIMEOUT,
    );
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Media Generation (standalone threads — each uses cached provider responses)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe("Media Generation", () => {
    it(
      "image generation: generate_image tool returns imageUrl, creditCost, and correct parent chain",
      async () => {
        setFetchCacheContext("image-generation");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "Call the generate_image tool with prompt='red circle'. Do not add any other commentary.",
          threadMode: "new",
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // ── Exactly 1 root user message ──
        const roots = messages.filter((m) => m.parentId === null);
        expect(roots).toHaveLength(1);
        expect(roots[0]!.role).toBe("user");

        // ── Tool message with generate_image ──
        const toolMsg = messages.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image",
        );
        expect(toolMsg).toBeDefined();
        expect(toolMsg!.isAI).toBe(true);
        expect(toolMsg!.sequenceId).toBeTruthy();

        // ── Tool result has required fields ──
        const toolRes = toolResultRecord(toolMsg?.toolCall?.result);
        expect(toolRes).not.toBeNull();
        expect(typeof toolRes!["imageUrl"]).toBe("string");
        expect(toolRes!["imageUrl"]).toBeTruthy();
        expect(typeof toolRes!["creditCost"]).toBe("number");
        expect((toolRes!["creditCost"] as number) >= 0).toBe(true);

        // ── Tool parent is an assistant message ──
        const toolParent = messages.find((m) => m.id === toolMsg!.parentId);
        expect(toolParent).toBeDefined();
        expect(toolParent!.role).toBe("assistant");
        expect(toolParent!.sequenceId).toBe(toolMsg!.sequenceId);

        // ── Final assistant message references the image ──
        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(lastAi).toBeDefined();
        expect(lastAi!.role).toBe("assistant");

        // ── Full chain is rooted and orphan-free ──
        const chain = walkChain(messages, lastAi!.id);
        expect(chain[0]).toBe(roots[0]!.id);
        assertChronologicalOrder(chain, messages);
        assertNoOrphans(messages);

        await assertThreadIdle(result.data.threadId!);
      },
      TEST_TIMEOUT,
    );

    it(
      "music generation: generate_music tool returns audioUrl, durationSeconds, and correct parent chain",
      async () => {
        setFetchCacheContext("music-generation");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "Call the generate_music tool with prompt='upbeat piano melody'. Do not add commentary.",
          threadMode: "new",
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // ── Single root ──
        const roots = messages.filter((m) => m.parentId === null);
        expect(roots).toHaveLength(1);

        // ── Tool message ──
        const toolMsg = messages.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_music",
        );
        expect(toolMsg).toBeDefined();

        // ── Tool result ──
        const toolRes = toolResultRecord(toolMsg?.toolCall?.result);
        expect(toolRes).not.toBeNull();
        expect(typeof toolRes!["audioUrl"]).toBe("string");
        expect(toolRes!["audioUrl"]).toBeTruthy();
        expect(typeof toolRes!["creditCost"]).toBe("number");
        expect((toolRes!["creditCost"] as number) > 0).toBe(true);
        expect(typeof toolRes!["durationSeconds"]).toBe("number");
        expect((toolRes!["durationSeconds"] as number) > 0).toBe(true);

        // ── Tool parent is assistant, shares sequenceId ──
        const toolParent = messages.find((m) => m.id === toolMsg!.parentId);
        expect(toolParent).toBeDefined();
        expect(toolParent!.role).toBe("assistant");
        expect(toolParent!.sequenceId).toBe(toolMsg!.sequenceId);

        // ── Chain integrity ──
        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(lastAi).toBeDefined();
        const chain = walkChain(messages, lastAi!.id);
        expect(chain[0]).toBe(roots[0]!.id);
        assertChronologicalOrder(chain, messages);
        assertNoOrphans(messages);

        await assertThreadIdle(result.data.threadId!);
      },
      TEST_TIMEOUT,
    );

    it(
      "video generation: generate_video tool returns videoUrl, durationSeconds, and correct parent chain",
      async () => {
        setFetchCacheContext("video-generation");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "Call the generate_video tool with prompt='spinning cube'. Do not add any other commentary.",
          threadMode: "new",
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // ── Single root ──
        const roots = messages.filter((m) => m.parentId === null);
        expect(roots).toHaveLength(1);

        // ── Tool message ──
        const toolMsg = messages.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_video",
        );
        expect(toolMsg).toBeDefined();

        // ── Tool result ──
        const toolRes = toolResultRecord(toolMsg?.toolCall?.result);
        expect(toolRes).not.toBeNull();
        expect(typeof toolRes!["videoUrl"]).toBe("string");
        expect(toolRes!["videoUrl"]).toBeTruthy();
        expect(typeof toolRes!["creditCost"]).toBe("number");
        expect((toolRes!["creditCost"] as number) > 0).toBe(true);
        expect(typeof toolRes!["durationSeconds"]).toBe("number");
        expect((toolRes!["durationSeconds"] as number) > 0).toBe(true);

        // ── Tool parent is assistant, shares sequenceId ──
        const toolParent = messages.find((m) => m.id === toolMsg!.parentId);
        expect(toolParent).toBeDefined();
        expect(toolParent!.role).toBe("assistant");
        expect(toolParent!.sequenceId).toBe(toolMsg!.sequenceId);

        // ── Chain integrity ──
        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(lastAi).toBeDefined();
        const chain = walkChain(messages, lastAi!.id);
        expect(chain[0]).toBe(roots[0]!.id);
        assertChronologicalOrder(chain, messages);
        assertNoOrphans(messages);

        await assertThreadIdle(result.data.threadId!);
      },
      TEST_TIMEOUT,
    );
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Credits
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe("Credits", () => {
    it(
      "credit deduction: balance strictly decreases after a stream",
      async () => {
        setFetchCacheContext("credit-deduction");
        const logger = createEndpointLogger(false, Date.now(), defaultLocale);
        const { t } = creditsScopedTranslation.scopedT(defaultLocale);

        const before = await CreditRepository.getCreditBalanceForUser(
          testUser,
          defaultLocale,
          logger,
          t,
        );
        expect(before.success).toBe(true);
        if (!before.success) {
          return;
        }

        const { result } = await runTestStream({
          user: testUser,
          prompt: "Reply with one word: OK",
          threadMode: "none",
        });

        expect(result.success).toBe(true);

        const after = await CreditRepository.getCreditBalanceForUser(
          testUser,
          defaultLocale,
          logger,
          t,
        );
        expect(after.success).toBe(true);
        if (!after.success) {
          return;
        }

        // ── Balance strictly decreased ──
        expect(after.data.total).toBeLessThan(before.data.total);

        // ── Deduction is positive and reasonable (not negative, not absurdly large) ──
        const deducted = before.data.total - after.data.total;
        expect(deducted).toBeGreaterThan(0);
        expect(deducted).toBeLessThan(100); // simple text response should be < 100 credits
      },
      TEST_TIMEOUT,
    );

    it(
      "incognito mode: threadMode=none does not persist any messages",
      async () => {
        setFetchCacheContext("incognito-mode");
        const { result, messages } = await runTestStream({
          user: testUser,
          prompt: "Reply with: INCOGNITO_TEST",
          threadMode: "none",
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // ── Response has content but no threadId ──
        expect(result.data.lastAiMessageContent).toContain("INCOGNITO");
        expect(result.data.threadId).toBeUndefined();

        // ── No messages in DB (messages array is empty for threadMode=none) ──
        expect(messages).toHaveLength(0);
      },
      TEST_TIMEOUT,
    );

    it(
      "insufficient credits: returns error with 403 when balance is zero",
      async () => {
        setFetchCacheContext("insufficient-credits");

        // Zero out all wallet balances and free credits for the admin user,
        // then restore after the assertion. Uses raw SQL to bypass the complex
        // pool-based credit system — we only need the validator to see balance=0.
        const wallets = await db.execute<{
          id: string;
          balance: number;
          free_credits_remaining: number;
        }>(
          sql`SELECT cw.id, cw.balance, cw.free_credits_remaining
              FROM credit_wallets cw
              LEFT JOIN user_lead_links ull ON ull.lead_id = cw.lead_id
              WHERE cw.user_id = ${testUser.id} OR ull.user_id = ${testUser.id}`,
        );
        const savedBalances = wallets.rows.map((w) => ({
          id: w.id,
          balance: w.balance,
          freeCreditsRemaining: w.free_credits_remaining,
        }));

        // Zero out balances
        for (const w of savedBalances) {
          await db.execute(
            sql`UPDATE credit_wallets SET balance = 0, free_credits_remaining = 0 WHERE id = ${w.id}`,
          );
        }

        try {
          const { result, messages } = await runTestStream({
            user: testUser,
            prompt: "Say: SHOULD_FAIL",
            threadMode: "none",
          });

          // ── Must fail ──
          expect(result.success).toBe(false);
          if (result.success) {
            return;
          }

          // ── Error response has correct structure ──
          expect(result.errorType).toBeDefined();
          expect(result.errorType?.errorCode).toBe(403);
          expect(result.message).toBeTruthy();
          expect(result.message).toContain("nsufficient"); // "Insufficient credits"

          // ── No messages persisted (threadMode=none + failure) ──
          expect(messages).toHaveLength(0);
        } finally {
          // Restore original balances
          for (const w of savedBalances) {
            await db.execute(
              sql`UPDATE credit_wallets SET balance = ${w.balance}, free_credits_remaining = ${w.freeCreditsRemaining} WHERE id = ${w.id}`,
            );
          }
        }
      },
      TEST_TIMEOUT,
    );
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Error Handling
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe("Error Handling", () => {
    it(
      "append to non-existent thread: still succeeds (creates new thread context)",
      async () => {
        setFetchCacheContext("nonexistent-thread");
        const fakeThreadId = crypto.randomUUID();
        const { result } = await runTestStream({
          user: testUser,
          prompt: "Say: ORPHAN_TEST",
          threadMode: "append",
          threadId: fakeThreadId,
        });

        // The headless runner should still succeed — it creates the thread if needed
        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }
        expect(result.data.lastAiMessageContent).toBeTruthy();
      },
      TEST_TIMEOUT,
    );

    it(
      "explicitParentMessageId with invalid ID: stream still succeeds with fresh context",
      async () => {
        setFetchCacheContext("invalid-parent");
        const { result } = await runTestStream({
          user: testUser,
          prompt: "Say: INVALID_PARENT_TEST",
          threadMode: "new",
          explicitParentMessageId: crypto.randomUUID(),
        });

        // Should succeed — invalid parent just means no history loaded
        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }
        expect(result.data.lastAiMessageContent).toBeTruthy();
      },
      TEST_TIMEOUT,
    );
  });
});
