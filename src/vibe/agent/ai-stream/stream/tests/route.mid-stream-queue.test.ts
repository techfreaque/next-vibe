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
 * Cache bust: delete src/generated/ai-fixtures/http-cache/mq1-* and src/generated/ai-fixtures/http-cache/mq2-*
 */

import "server-only";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { beforeAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "next-vibe/agent/chat/config";
import { ChatMessageRole } from "next-vibe/agent/chat/enum";
import { NO_SKILL_ID } from "next-vibe/agent/skills/constants";
import { env } from "@/env/env";

import { DEFAULT_CHAT_MODEL_ID } from "../../constants";
import { AiStreamRepository } from "../../repository";
import type { AiStreamPostRequestOutput } from "../../stream/definition";
import { scopedTranslation } from "../../stream/i18n";
import { seedFixtureThread } from "../../testing/fixture-seed";
import {
  fetchThreadMessages,
  fetchThreadStreamingState,
  getOrCreateFolder,
  resolveUser,
  type SlimMessage,
} from "../../testing/headless-test-runner";

// ── Test timeouts ─────────────────────────────────────────────────────────────

/** Two full streams back-to-back — allow ample time */
const TEST_TIMEOUT = 120_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

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
 * Wait until:
 *   1. The queued message is no longer isQueued=true in DB.
 *   2. An assistant message with parentId = queuedMessageId exists in DB.
 *   3. The thread is idle.
 *
 * All three conditions must hold simultaneously to avoid the race where:
 *   - prepareStep dequeues the message (isQueued→false) while stream 1 is still running
 *   - thread goes idle momentarily between stream 1 ending and stream 2 starting
 *   - ai2 hasn't been written yet when we sample
 */
async function waitForQueueProcessed(
  threadId: string,
  queuedMessageId: string,
  user: JwtPrivatePayloadType,
  maxWaitMs = 90_000,
): Promise<SlimMessage[]> {
  const pollIntervalMs = 400;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const messages = await fetchThreadMessages(threadId, user);
    const streamingState = await fetchThreadStreamingState(threadId, user);

    const isIdle = streamingState === "idle";
    const queuedMsg = messages.find((m) => m.id === queuedMessageId);
    const isStillQueued = queuedMsg?.isQueued === true;
    const ai2Exists = messages.some((m) => m.parentId === queuedMessageId);

    if (isIdle && !isStillQueued && ai2Exists) {
      return messages;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, pollIntervalMs);
    });
  }
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `waitForQueueProcessed: thread ${threadId} timed out — ` +
      `check if ai2 (parentId=${queuedMessageId}) was ever written to DB`,
  );
}

/** Assert the queued message is no longer marked isQueued via messages endpoint. */
async function assertNotQueued(
  threadId: string,
  messageId: string,
  user: JwtPrivatePayloadType,
  label: string,
): Promise<void> {
  const messages = await fetchThreadMessages(threadId, user);
  const row = messages.find((m) => m.id === messageId);
  expect(row, `[${label}] Queued message ${messageId} not found`).toBeDefined();
  expect(
    row?.isQueued,
    `[${label}] Message ${messageId} still has isQueued=true after processing`,
  ).not.toBe(true);
}

/** Assert the thread is idle via the messages endpoint. */
async function assertThreadIdle(
  threadId: string,
  user: JwtPrivatePayloadType,
  label: string,
): Promise<void> {
  const streamingState = await fetchThreadStreamingState(threadId, user);
  expect(
    streamingState,
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
  subFolderId: string,
): Promise<void> {
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  const data: AiStreamPostRequestOutput = {
    operation: "send",
    rootFolderId: DefaultFolderId.PRIVATE,
    subFolderId,
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
    voiceMode: { enabled: false },
    audioInput: { file: null },
    resumeToken: null,
    timezone: "UTC",
    attachments: null,
    executionContext: { mode: "local" as const },
  };

  const result = await AiStreamRepository.createAiStream({
    data,
    locale: defaultLocale,
    logger,
    user,
    request: undefined,
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
  subFolderId: string,
): Promise<void> {
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  const data: AiStreamPostRequestOutput = {
    operation: "send",
    rootFolderId: DefaultFolderId.PRIVATE,
    subFolderId,
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
    voiceMode: { enabled: false },
    audioInput: { file: null },
    resumeToken: null,
    timezone: "UTC",
    attachments: null,
    executionContext: { mode: "local" as const },
  };

  const result = await AiStreamRepository.createAiStream({
    data,
    locale: defaultLocale,
    logger,
    user,
    request: undefined,
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
  let midStreamQueueFolderId: string;
  let suiteFailed = false;

  function fit(name: string, fn: () => Promise<void>, timeout?: number): void {
    it(
      name,
      async () => {
        if (suiteFailed) {
          // oxlint-disable-next-line restricted-syntax -- intentional throw to fail fast after suite-level error
          throw new Error(
            "Skipped: a previous test in this suite already failed. Fix that test first.",
          );
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
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;

    // Create PRIVATE/tests/mid-stream-queue subfolder for this suite.
    const testsParentId = await getOrCreateFolder(
      testUser,
      DefaultFolderId.PRIVATE,
      "tests",
    );
    midStreamQueueFolderId = await getOrCreateFolder(
      testUser,
      DefaultFolderId.PRIVATE,
      "mid-stream-queue",
      testsParentId,
    );
  }, TEST_TIMEOUT);

  // ── MQ1: Plain echo — queue via finally-block processor ───────────────────
  // Stream 1: pure text, no tools. Ends naturally. Queue processor fires in finally.
  // Chain must be linear: user1 → ai1 → queuedUser → ai2
  fit(
    "MQ1: plain echo — queued message processed after stream ends, strict linear chain",
    async () => {
      const thread1Id = crypto.randomUUID();
      await seedFixtureThread(thread1Id, "mq1-plain-echo", false);
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

      await fireInteractiveStream(
        testUser,
        stream1Prompt,
        thread1Id,
        user1MsgId,
        midStreamQueueFolderId,
      );

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

      await enqueueSecondMessage(
        testUser,
        thread1Id,
        stream2Prompt,
        queued2MsgId,
        midStreamQueueFolderId,
      );

      // Wait until the queued message is processed AND ai2 exists.
      // waitForThreadIdle is not sufficient here — it may return during the brief
      // idle window between stream 1 ending and stream 2 starting.
      const messages = await waitForQueueProcessed(
        thread1Id,
        queued2MsgId,
        testUser,
      );

      // ── MQ1 assertions ────────────────────────────────────────────────────

      await assertThreadIdle(thread1Id, testUser, "MQ1");
      await assertNotQueued(thread1Id, queued2MsgId, testUser, "MQ1");

      // 1. assistant ai1 has parentId = user1MsgId
      const ai1Row = messages.find((m) => m.parentId === user1MsgId);
      expect(ai1Row, "MQ1: no assistant after user1").toBeDefined();
      expect(ai1Row!.role, "MQ1: child of user1 must be assistant").toBe(
        "assistant",
      );
      expect(ai1Row!.content, "MQ1: ai1 must contain ECHO_DONE").toContain(
        "ECHO_DONE",
      );

      // 2. queued user message exists
      const queuedRow = messages.find((m) => m.id === queued2MsgId);
      expect(
        queuedRow,
        "MQ1: queued user message not in messages",
      ).toBeDefined();
      expect(queuedRow!.role, "MQ1: queued message must be user").toBe("user");

      // 3. assistant ai2 has parentId = queued2MsgId — the critical assertion
      const ai2Row = messages.find((m) => m.parentId === queued2MsgId);
      expect(
        ai2Row,
        "MQ1: no assistant after queued user message",
      ).toBeDefined();
      expect(ai2Row!.role, "MQ1: child of queued user must be assistant").toBe(
        "assistant",
      );
      expect(ai2Row!.content, "MQ1: ai2 must contain QUEUED_DONE").toContain(
        "QUEUED_DONE",
      );

      // 4. no branches — strict linear chain
      assertStrictLinearChain(messages, "MQ1");

      // 5. exact chain order: user1 → assistant(ai1) → queuedUser → assistant(ai2)
      // AND createdAt order must match parentId chain order (UI sorts by createdAt)
      {
        const roots = messages.filter((m) => m.parentId === null);
        expect(roots.length, "MQ1: must have exactly 1 root").toBe(1);
        const orderedChain: SlimMessage[] = [];
        let cur: SlimMessage | undefined = roots[0];
        while (cur) {
          orderedChain.push(cur);
          const next = messages.find((m) => m.parentId === cur!.id);
          cur = next;
        }
        const chainDesc = orderedChain.map((m) => m.role).join(" → ");
        expect(
          orderedChain.length,
          `MQ1: expected exactly 4 messages, got ${String(orderedChain.length)}: ${chainDesc}`,
        ).toBe(4);
        expect(orderedChain[0]!.id, "MQ1: chain[0] must be user1").toBe(
          user1MsgId,
        );
        expect(orderedChain[0]!.role, "MQ1: chain[0] must be user").toBe(
          "user",
        );
        expect(
          orderedChain[1]!.role,
          "MQ1: chain[1] must be assistant (ai1)",
        ).toBe("assistant");
        expect(orderedChain[2]!.id, "MQ1: chain[2] must be queuedUser").toBe(
          queued2MsgId,
        );
        expect(orderedChain[2]!.role, "MQ1: chain[2] must be user").toBe(
          "user",
        );
        expect(
          orderedChain[3]!.role,
          "MQ1: chain[3] must be assistant (ai2)",
        ).toBe("assistant");
        expect(
          orderedChain[3]!.content,
          "MQ1: ai2 must contain QUEUED_DONE",
        ).toContain("QUEUED_DONE");
        // createdAt order must match parentId chain order
        for (let i = 1; i < orderedChain.length; i++) {
          expect(
            orderedChain[i]!.createdAt.getTime(),
            `MQ1: chain[${String(i)}] createdAt must be >= chain[${String(i - 1)}] createdAt (UI order broken)`,
          ).toBeGreaterThanOrEqual(orderedChain[i - 1]!.createdAt.getTime());
        }
      }
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
      const thread2Id = crypto.randomUUID();
      await seedFixtureThread(thread2Id, "mq2-tool-call", false);
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

      await fireInteractiveStream(
        testUser,
        stream1Prompt,
        thread2Id,
        user1MsgId,
        midStreamQueueFolderId,
      );

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

      await enqueueSecondMessage(
        testUser,
        thread2Id,
        stream2Prompt,
        queued2MsgId,
        midStreamQueueFolderId,
      );

      // Wait until the queued message is processed AND ai2 exists.
      const messages = await waitForQueueProcessed(
        thread2Id,
        queued2MsgId,
        testUser,
      );

      // ── MQ2 assertions ────────────────────────────────────────────────────

      await assertThreadIdle(thread2Id, testUser, "MQ2");
      await assertNotQueued(thread2Id, queued2MsgId, testUser, "MQ2");

      // 1. user1 exists with no parent (root)
      const user1Row = messages.find((m) => m.id === user1MsgId);
      expect(user1Row, "MQ2: user1 not in messages").toBeDefined();

      // 2. assistant ai1 has parentId = user1MsgId
      const ai1Row = messages.find((m) => m.parentId === user1MsgId);
      expect(ai1Row, "MQ2: no assistant after user1").toBeDefined();
      expect(ai1Row!.role, "MQ2: child of user1 must be assistant").toBe(
        "assistant",
      );

      // 3. queued user message exists
      const queuedRow = messages.find((m) => m.id === queued2MsgId);
      expect(
        queuedRow,
        "MQ2: queued user message not in messages",
      ).toBeDefined();
      expect(queuedRow!.role, "MQ2: queued message must be user").toBe("user");

      // 4. assistant ai2 has parentId = queued2MsgId — the critical assertion
      const ai2Row = messages.find((m) => m.parentId === queued2MsgId);
      expect(
        ai2Row,
        "MQ2: no assistant after queued user message",
      ).toBeDefined();
      expect(ai2Row!.role, "MQ2: child of queued user must be assistant").toBe(
        "assistant",
      );
      expect(
        ai2Row!.content,
        "MQ2: ai2 must contain QUEUED_TOOL_DONE",
      ).toContain("QUEUED_TOOL_DONE");

      // 5. no branches — strict linear chain
      assertStrictLinearChain(messages, "MQ2");

      // 6. exact chain order: user1 → assistant(ai1) → tool → queuedUser → assistant(ai2)
      // The queued message is injected after the tool result so the AI responds to it directly.
      {
        const roots = messages.filter((m) => m.parentId === null);
        expect(roots.length, "MQ2: must have exactly 1 root").toBe(1);

        // Walk root→leaf
        const orderedChain: SlimMessage[] = [];
        let cur: SlimMessage | undefined = roots[0];
        while (cur) {
          orderedChain.push(cur);
          const next = messages.find((m) => m.parentId === cur!.id);
          cur = next;
        }

        const chainDesc = orderedChain
          .map(
            (m) =>
              `${m.role}${m.toolCall?.toolName ? `:${m.toolCall.toolName}` : ""}`,
          )
          .join(" → ");

        // Exact 5-message chain
        expect(
          orderedChain.length,
          `MQ2: expected exactly 5 messages in chain, got ${String(orderedChain.length)}: ${chainDesc}`,
        ).toBe(5);

        // [0] user1
        expect(orderedChain[0]!.id, "MQ2: chain[0] must be user1").toBe(
          user1MsgId,
        );
        expect(orderedChain[0]!.role, "MQ2: chain[0] must be user").toBe(
          "user",
        );

        // [1] assistant (ai1, made the tool call)
        expect(
          orderedChain[1]!.role,
          "MQ2: chain[1] must be assistant (ai1)",
        ).toBe("assistant");

        // [2] tool result
        expect(orderedChain[2]!.role, "MQ2: chain[2] must be tool").toBe(
          "tool",
        );

        // [3] queued user message
        expect(orderedChain[3]!.id, "MQ2: chain[3] must be queuedUser").toBe(
          queued2MsgId,
        );
        expect(orderedChain[3]!.role, "MQ2: chain[3] must be user").toBe(
          "user",
        );

        // [4] assistant response to queued user (ai2)
        expect(
          orderedChain[4]!.role,
          "MQ2: chain[4] must be assistant (ai2)",
        ).toBe("assistant");
        expect(
          orderedChain[4]!.content,
          "MQ2: ai2 must contain QUEUED_TOOL_DONE",
        ).toContain("QUEUED_TOOL_DONE");

        // createdAt order must match parentId chain order — the UI sorts by createdAt
        // so a wrong createdAt causes messages to appear out of order in the UI.
        for (let i = 1; i < orderedChain.length; i++) {
          expect(
            orderedChain[i]!.createdAt.getTime(),
            `MQ2: chain[${String(i)}] createdAt must be >= chain[${String(i - 1)}] createdAt (UI sort order broken)`,
          ).toBeGreaterThanOrEqual(orderedChain[i - 1]!.createdAt.getTime());
        }
      }
    },
    TEST_TIMEOUT,
  );
});
