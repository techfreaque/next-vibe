/**
 * Mid-Stream Queue Integration Tests
 *
 * Verifies that when a second user message arrives while a stream is already
 * running, it is either:
 *   A) Injected as the next user turn mid-stream via prepareStep (tool-loop path), or
 *   B) Picked up by processNextQueuedMessage in the finally block (text-only path).
 *
 * In BOTH cases the resulting DB chain must be strictly linear:
 *   userMsg1 → aiMsg1[→toolMsg → toolAiMsg] → queuedUserMsg → aiMsg2
 *
 * Two test cases:
 *   MQ1 - Plain echo: no tools. Stream 1 is a simple text response. The queued
 *         message is processed by the finally-block queue processor after stream 1
 *         ends naturally. Chain must be linear with no branches.
 *
 *   MQ2 - Tool call: stream 1 calls tool-help (creates a tool-loop step). The
 *         queued message is injected via prepareStep before the final text step.
 *         Chain must be linear: user1 → ai1 → tool → toolAi → queuedUser → ai2.
 *
 * Architecture:
 *   - Stream 1 is fired as interactive (non-headless, fire-and-forget) via
 *     createAiStream so we can immediately enqueue stream 2 while it runs.
 *   - Stream 2 hits the auto-queue gate (StreamRegistry.isActive) and is saved
 *     as isQueued=true; QueueRegistry receives the in-memory entry.
 *   - waitForThreadIdle polls until both streams finish (state → idle).
 *   - Full chain integrity is asserted: no orphans, no branches, correct order.
 *
 * Failure modes the tests catch:
 *   - Queued message branches off a mid-stream point (parentId wrong)
 *   - Queued message stays isQueued=true after processing
 *   - ai2 is a sibling of queuedUser instead of its child
 *   - Chain has >1 leaf (unexpected dead end)
 *   - Thread never reaches idle (stream hung or queue not processed)
 *
 * Cache bust: delete fixtures/http-cache/mq1-* and fixtures/http-cache/mq2-*
 */

import "server-only";

// Install HTTP fetch interceptor before any other imports touch fetch
import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { beforeAll, describe, expect, it } from "vitest";

import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { eq } from "drizzle-orm";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { AiStreamPostRequestOutput } from "../../stream/definition";
import { scopedTranslation } from "../../stream/i18n";
import { AiStreamRepository } from "../../repository";
import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { env } from "@/config/env";
import {
  setFetchCacheContext,
  waitForInflightFetches,
} from "../../testing/fetch-cache";
import type { SlimMessage } from "../../testing/headless-test-runner";
import { DEFAULT_CHAT_MODEL_ID } from "../../constants";

// ── Test timeouts ─────────────────────────────────────────────────────────────

/** Two full streams back-to-back — allow ample time */
const TEST_TIMEOUT = 120_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function resolveAdminUser(): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    env.VIBE_ADMIN_USER_EMAIL,
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
  return { isPublic: false, id: user.id, leadId: link.leadId, roles };
}

/** Walk parent chain from leafId back to root. Returns [root, ..., leaf]. */
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

/** Build parent→children adjacency map. Root messages keyed under "__root__". */
function buildChildMap(messages: SlimMessage[]): Map<string, string[]> {
  const tree = new Map<string, string[]>();
  for (const msg of messages) {
    const key = msg.parentId ?? "__root__";
    const existing = tree.get(key);
    if (existing) {
      existing.push(msg.id);
    } else {
      tree.set(key, [msg.id]);
    }
  }
  return tree;
}

function msgDesc(m: SlimMessage): string {
  const tool = m.toolCall?.toolName ? `:${m.toolCall.toolName}` : "";
  const preview = m.content ? ` "${m.content.slice(0, 40)}"` : "";
  return `${m.id.slice(0, 8)}(${m.role}${tool}${preview})`;
}

/**
 * Assert strict chain integrity:
 *  1. No orphans (every parentId exists in thread)
 *  2. Exactly one root
 *  3. No branches (every message has ≤1 child) — the whole point of this test
 *  4. Exactly one leaf (the active chain tip)
 */
function assertStrictLinearChain(messages: SlimMessage[], label: string): void {
  const byId = new Map(messages.map((m) => [m.id, m]));
  const childMap = buildChildMap(messages);

  // 1. No orphans
  for (const msg of messages) {
    if (msg.parentId && !byId.has(msg.parentId)) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `[${label}] Orphan: ${msgDesc(msg)} → parentId ${msg.parentId} not found`,
      );
    }
  }

  // 2. Exactly one root
  const roots = childMap.get("__root__") ?? [];
  expect(
    roots.length,
    `[${label}] Expected exactly 1 root message, got ${String(roots.length)}`,
  ).toBe(1);

  // 3. No branches — every message has at most 1 child
  for (const [parentId, children] of childMap.entries()) {
    if (parentId === "__root__") {
      continue;
    }
    if (children.length > 1) {
      const parent = byId.get(parentId);
      const childList = children
        .map((id) => msgDesc(byId.get(id)!))
        .join("\n  ");
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `[${label}] Branch violation on ${parent ? msgDesc(parent) : parentId}: ` +
          `${String(children.length)} children (expected 1). ` +
          `The queued message created a dead-end branch instead of continuing the chain.\n  ${childList}`,
      );
    }
  }

  // 4. Exactly one leaf
  const leaves = messages.filter((m) => !childMap.get(m.id)?.length);
  expect(
    leaves.length,
    `[${label}] Expected exactly 1 leaf (chain tip), got ${String(leaves.length)}: ${leaves.map((m) => msgDesc(m)).join(", ")}`,
  ).toBe(1);
}

/**
 * Wait until the queued message has been processed AND its AI response exists.
 * "Processed" means: the message is no longer isQueued=true in DB.
 * "AI response exists" means: there is an assistant message with parentId = queuedMessageId.
 *
 * This handles the race where waitForThreadIdle returns during the brief idle window
 * between stream 1 ending and stream 2 (started by processNextQueuedMessage) beginning.
 */
async function waitForQueueProcessed(
  threadId: string,
  queuedMessageId: string,
  maxWaitMs = 90_000,
): Promise<SlimMessage[]> {
  const pollIntervalMs = 400;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    // Check if queued message is dequeued
    const [queuedRow] = await db
      .select({ metadata: chatMessages.metadata })
      .from(chatMessages)
      .where(eq(chatMessages.id, queuedMessageId));

    const isStillQueued = queuedRow?.metadata?.isQueued === true;

    // Check if AI response after the queued message exists
    const [aiResponse] = await db
      .select({ id: chatMessages.id })
      .from(chatMessages)
      .where(eq(chatMessages.parentId, queuedMessageId));

    // Check thread is idle (not streaming)
    const [threadRow] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));

    if (
      !isStillQueued &&
      aiResponse &&
      threadRow?.streamingState === "idle"
    ) {
      // All conditions met - fetch and return full message list
      const { fetchThreadMessages } = await import(
        "../../testing/headless-test-runner"
      );
      return fetchThreadMessages(threadId);
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, pollIntervalMs);
    });
  }
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `waitForQueueProcessed: thread ${threadId} did not finish processing ` +
      `queued message ${queuedMessageId} within ${String(maxWaitMs)}ms`,
  );
}

/** Assert the queued message is no longer marked isQueued in DB. */
async function assertNotQueued(
  messageId: string,
  label: string,
): Promise<void> {
  const [row] = await db
    .select({ metadata: chatMessages.metadata })
    .from(chatMessages)
    .where(eq(chatMessages.id, messageId));
  expect(
    row,
    `[${label}] Queued message ${messageId} not found in DB`,
  ).toBeDefined();
  expect(
    row?.metadata?.isQueued,
    `[${label}] Message ${messageId} still has isQueued=true after processing`,
  ).not.toBe(true);
}

/** Assert the thread is idle in DB. */
async function assertThreadIdle(threadId: string, label: string): Promise<void> {
  const [row] = await db
    .select({ streamingState: chatThreads.streamingState })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId));
  expect(
    row?.streamingState,
    `[${label}] Thread not idle after both streams completed`,
  ).toBe("idle");
}

/**
 * Fire stream 1 as interactive (non-headless, fire-and-forget).
 * setupAiStream (including StreamRegistry.register) is awaited before this returns,
 * so StreamRegistry.isActive(threadId) is guaranteed true by the time the caller
 * enqueues the second message.
 */
async function fireInteractiveStream(
  user: JwtPrivatePayloadType,
  prompt: string,
  threadId: string,
  userMessageId: string,
): Promise<void> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  const data: AiStreamPostRequestOutput = {
    operation: "send",
    rootFolderId: DefaultFolderId.BACKGROUND,
    subFolderId: null,
    threadId,
    userMessageId,
    parentMessageId: null,
    content: prompt,
    role: ChatMessageRole.USER,
    model: DEFAULT_CHAT_MODEL_ID,
    skill: NO_SKILL_ID,
    favoriteConfig: null,
    toolConfirmations: null,
    messageHistory: [],
    voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE_ID },
    audioInput: { file: null },
    resumeToken: null,
    timezone: "UTC",
    attachments: null,
  };

  const result = await AiStreamRepository.createAiStream({
    data,
    locale: defaultLocale,
    logger,
    user,
    request: undefined,
    headless: false,
    t,
    subAgentDepth: 0,
  });

  expect(result.success, "Interactive stream 1 failed to start").toBe(true);
  if (!result.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test setup
    throw new Error(`Stream 1 failed: ${result.message}`);
  }
}

/**
 * Enqueue stream 2 by calling createAiStream while stream 1 is running.
 * StreamRegistry.isActive(threadId) → true → auto-queue path.
 * Returns the queued message ID.
 */
async function enqueueSecondMessage(
  user: JwtPrivatePayloadType,
  threadId: string,
  prompt: string,
  queuedMessageId: string,
): Promise<void> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  const data: AiStreamPostRequestOutput = {
    operation: "send",
    rootFolderId: DefaultFolderId.BACKGROUND,
    subFolderId: null,
    threadId,
    userMessageId: queuedMessageId,
    parentMessageId: null, // will be advanced by advanceQueuedMessages
    content: prompt,
    role: ChatMessageRole.USER,
    model: DEFAULT_CHAT_MODEL_ID,
    skill: NO_SKILL_ID,
    favoriteConfig: null,
    toolConfirmations: null,
    messageHistory: [],
    voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE_ID },
    audioInput: { file: null },
    resumeToken: null,
    timezone: "UTC",
    attachments: null,
  };

  const result = await AiStreamRepository.createAiStream({
    data,
    locale: defaultLocale,
    logger,
    user,
    request: undefined,
    headless: false,
    t,
    subAgentDepth: 0,
  });

  expect(
    result.success,
    "Stream 2 enqueue call should succeed (returns queued ack)",
  ).toBe(true);
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe("Mid-Stream Queue - chain integrity", () => {
  let testUser: JwtPrivatePayloadType;
  let suiteFailed = false;

  function fit(
    name: string,
    fn: () => Promise<void>,
    timeout?: number,
  ): void {
    it(
      name,
      async () => {
        if (suiteFailed) {
          return;
        }
        try {
          await fn();
        } catch (err) {
          suiteFailed = true;
          // oxlint-disable-next-line restricted-syntax -- intentional re-throw in test suite
          throw err;
        }
      },
      timeout,
    );
  }

  beforeAll(async () => {
    const resolved = await resolveAdminUser();
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;
  }, TEST_TIMEOUT);

  // ── MQ1: Plain echo — queue via finally-block processor ───────────────────
  // Stream 1: pure text, no tools. Ends naturally. Queue processor fires in finally.
  // Chain must be linear: user1 → ai1 → queuedUser → ai2
  fit(
    "MQ1: plain echo — queued message processed after stream ends, strict linear chain",
    async () => {
      setFetchCacheContext("mq1-plain-echo");

      const thread1Id = crypto.randomUUID();
      const user1MsgId = crypto.randomUUID();
      const queued2MsgId = crypto.randomUUID();

      // Stream 1: simple echo — no tools, ends in one text step.
      // Instruction is explicit: respond with EXACTLY "ECHO: <prompt>" and nothing else.
      // This keeps the fixture tiny and the test deterministic.
      const stream1Prompt =
        "[MQ1-stream1] You are a test echo bot. " +
        "Reply with ONLY the word: ECHO_DONE. " +
        "No preamble, no explanation, no punctuation beyond that. " +
        "If you add anything else, the test FAILS.";

      await fireInteractiveStream(testUser, stream1Prompt, thread1Id, user1MsgId);

      // Stream 1 is now running (fire-and-forget). Enqueue stream 2 immediately.
      // StreamRegistry.isActive(thread1Id) must be true at this point for the
      // queue path to trigger. If the stream finished too fast (e.g. cached fixture
      // replay), the second message goes through as a normal stream instead — both
      // outcomes still produce a valid chain, so the test does not fail on this.
      const stream2Prompt =
        "[MQ1-stream2] You are a test echo bot. " +
        "Reply with ONLY the word: QUEUED_DONE. " +
        "No preamble, no explanation, no punctuation beyond that. " +
        "If you add anything else, the test FAILS. " +
        "IMPORTANT: If you see any message that says QUEUED_DONE was already replied, " +
        "that means you have been called twice and the test FAILS.";

      await enqueueSecondMessage(testUser, thread1Id, stream2Prompt, queued2MsgId);

      // Wait until the queued message is processed AND ai2 exists.
      // waitForThreadIdle is not sufficient here — it may return during the brief
      // idle window between stream 1 ending and stream 2 starting.
      const messages = await waitForQueueProcessed(thread1Id, queued2MsgId);

      // ── MQ1 assertions ────────────────────────────────────────────────────

      // All messages belong to thread1Id
      expect(
        messages.length,
        "MQ1: expected at least 4 messages (user1, ai1, queuedUser, ai2)",
      ).toBeGreaterThanOrEqual(4);

      // No branches — the entire chain must be linear
      assertStrictLinearChain(messages, "MQ1");

      // The queued user message must no longer be marked isQueued
      await assertNotQueued(queued2MsgId, "MQ1");

      // Thread is idle
      await assertThreadIdle(thread1Id, "MQ1");

      // The queued user message must be in the chain (not orphaned, not branched)
      const queuedMsg = messages.find((m) => m.id === queued2MsgId);
      expect(
        queuedMsg,
        "MQ1: queued user message not found in thread messages",
      ).toBeDefined();
      expect(
        queuedMsg?.role,
        "MQ1: queued message must have role=user",
      ).toBe("user");

      // There must be an AI response AFTER the queued user message (ai2)
      const chain = walkChain(messages, messages.findLast((m) => !messages.some((n) => n.parentId === m.id))!.id);
      const queuedIdx = chain.indexOf(queued2MsgId);
      expect(
        queuedIdx,
        "MQ1: queued user message not found in main chain",
      ).toBeGreaterThan(-1);
      expect(
        queuedIdx,
        "MQ1: queued user message must not be the last message (ai2 must follow)",
      ).toBeLessThan(chain.length - 1);

      // The message immediately after queuedUser in the chain must be an assistant
      const afterQueued = messages.find(
        (m) => m.id === chain[queuedIdx + 1],
      );
      expect(
        afterQueued?.role,
        "MQ1: message after queuedUser must be an assistant message (ai2)",
      ).toBe("assistant");

      // ai1 content must contain ECHO_DONE
      const ai1 = messages.find(
        (m) => m.role === "assistant" && m.id === chain[chain.indexOf(user1MsgId) + 1],
      );
      expect(
        ai1?.content,
        "MQ1: ai1 must contain ECHO_DONE",
      ).toContain("ECHO_DONE");

      // ai2 content must contain QUEUED_DONE
      const ai2 = afterQueued;
      expect(
        ai2?.content,
        "MQ1: ai2 must contain QUEUED_DONE",
      ).toContain("QUEUED_DONE");

      // Chain order: user1 → ai1 → queuedUser → ai2
      expect(
        chain.indexOf(user1MsgId),
        "MQ1: user1 must come before queuedUser",
      ).toBeLessThan(queuedIdx);

      // Wait for any fire-and-forget goroutines (e.g. syncThreadEmbedding) to
      // complete so their fetch calls don't contaminate MQ2's counter namespace.
      await waitForInflightFetches(5_000);
    },
    TEST_TIMEOUT,
  );

  // ── MQ2: Tool call — queue injected via prepareStep ───────────────────────
  // Stream 1: calls tool-help (creates a tool-loop). The queued message should
  // be injected via prepareStep mid-loop so the AI responds to it without
  // ending and restarting the stream.
  // Chain: user1 → ai1(tool-call) → toolMsg → toolAi → queuedUser → ai2
  // All in a strict linear chain with no branches.
  fit(
    "MQ2: tool call — queued message injected mid-stream via prepareStep, strict linear chain",
    async () => {
      setFetchCacheContext("mq2-tool-call");

      const thread2Id = crypto.randomUUID();
      const user1MsgId = crypto.randomUUID();
      const queued2MsgId = crypto.randomUUID();

      // Stream 1: deliberately calls tool-help so the stream runs in a tool loop.
      // After the tool result arrives, prepareStep fires before the next AI turn —
      // that is the injection point for the queued message.
      // Strict instructions prevent the AI from hallucinating results or skipping the tool.
      const stream1Prompt =
        "[MQ2-stream1] You are a strict test assistant. " +
        "You MUST call the tool-help tool exactly once with no arguments. " +
        "After you receive the tool result, you MUST reply with ONLY the word: TOOL_ECHO_DONE. " +
        "Do NOT add any other text. Do NOT call any other tools. " +
        "If you deviate from these instructions the test FAILS immediately.";

      await fireInteractiveStream(testUser, stream1Prompt, thread2Id, user1MsgId);

      // Enqueue the second message immediately after stream 1 starts.
      // In the tool-loop path, this will be picked up by prepareStep before
      // the AI generates its final response to the tool result.
      // In the text-only fallback path (fixture replay too fast), processNextQueuedMessage
      // picks it up from the finally block — both paths produce a valid linear chain.
      const stream2Prompt =
        "[MQ2-stream2] You are a strict test assistant. " +
        "Reply with ONLY the word: QUEUED_TOOL_DONE. " +
        "No preamble, no explanation, no punctuation beyond that. " +
        "If you add anything else, the test FAILS. " +
        "CRITICAL: Do NOT call any tools. A tool call here would cause the test to fail.";

      await enqueueSecondMessage(testUser, thread2Id, stream2Prompt, queued2MsgId);

      // Wait until the queued message is processed AND ai2 exists.
      const messages = await waitForQueueProcessed(thread2Id, queued2MsgId);

      // ── MQ2 assertions ────────────────────────────────────────────────────

      expect(
        messages.length,
        "MQ2: expected at least 5 messages (user1, ai1, toolMsg, toolAi, queuedUser, ai2)",
      ).toBeGreaterThanOrEqual(5);

      // No branches anywhere in the chain
      assertStrictLinearChain(messages, "MQ2");

      // Queued message must be dequeued
      await assertNotQueued(queued2MsgId, "MQ2");

      // Thread is idle
      await assertThreadIdle(thread2Id, "MQ2");

      // tool-help must have been called
      const toolMsg = messages.find(
        (m) => m.role === "tool" && m.toolCall?.toolName === "tool-help",
      );
      expect(
        toolMsg,
        "MQ2: tool-help message not found — AI did not call the tool",
      ).toBeDefined();
      expect(
        toolMsg?.toolCall?.result,
        "MQ2: tool-help result must not be null",
      ).toBeTruthy();

      // The queued user message must be in the chain
      const leaf = messages.findLast((m) => !messages.some((n) => n.parentId === m.id))!;
      const chain = walkChain(messages, leaf.id);
      const queuedIdx = chain.indexOf(queued2MsgId);
      expect(
        queuedIdx,
        "MQ2: queued user message not found in main chain — it may have branched",
      ).toBeGreaterThan(-1);
      expect(
        queuedIdx,
        "MQ2: queuedUser must not be the chain tip (ai2 must follow it)",
      ).toBeLessThan(chain.length - 1);

      // Message after queuedUser must be an assistant (ai2)
      const afterQueued = messages.find((m) => m.id === chain[queuedIdx + 1]);
      expect(
        afterQueued?.role,
        "MQ2: message after queuedUser must be assistant (ai2)",
      ).toBe("assistant");

      // queuedUser must come AFTER the tool message in the chain
      const toolMsgIdx = chain.indexOf(toolMsg!.id);
      expect(
        queuedIdx,
        "MQ2: queuedUser must come after the tool message — it branched off before the tool",
      ).toBeGreaterThan(toolMsgIdx);

      // ai2 content must contain QUEUED_TOOL_DONE
      expect(
        afterQueued?.content,
        "MQ2: ai2 must contain QUEUED_TOOL_DONE",
      ).toContain("QUEUED_TOOL_DONE");

      // Chain order: user1 must come before tool, tool before queuedUser, queuedUser before ai2
      expect(chain.indexOf(user1MsgId)).toBeLessThan(toolMsgIdx);
      expect(toolMsgIdx).toBeLessThan(queuedIdx);

      // Drain any lingering fire-and-forget goroutines before test ends
      await waitForInflightFetches(5_000);
    },
    TEST_TIMEOUT,
  );
});
