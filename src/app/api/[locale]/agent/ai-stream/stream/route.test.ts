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
 * Cache bust: delete fixtures/http-cache/ (or specific {hash}-*.json pairs).
 *
 * All test threads land in the CRON folder (isolated from personal chats).
 * Requires dev DB with admin + demo users seeded (run: vibe dev or vibe seed).
 */

import "server-only";

// Install HTTP fetch interceptor before any other imports touch fetch
import { installFetchCache } from "../testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { eq } from "drizzle-orm";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import { setFetchCacheContext } from "../testing/fetch-cache";
import {
  runTestStream,
  toolResultRecord,
  type SlimMessage,
} from "../testing/headless-test-runner";
import {
  AI_LOW_CREDITS_USER_EMAIL,
  AI_TEST_USER_EMAIL,
} from "../testing/test-constants";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function resolveUser(email: string): Promise<JwtPrivatePayloadType | null> {
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

// ── Test Suite ────────────────────────────────────────────────────────────────

const TEST_TIMEOUT = 120_000;

describe("AI Stream Integration", () => {
  let testUser: JwtPrivatePayloadType;
  let lowCreditsUser: JwtPrivatePayloadType;
  /** Amount drained from lowCreditsUser during the insufficient-credits test — restored in afterAll */
  let drainedCredits = 0;

  beforeAll(async () => {
    const resolved = await resolveUser(AI_TEST_USER_EMAIL);
    expect(resolved, `${AI_TEST_USER_EMAIL} not found — run: vibe dev`).toBeTruthy();
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

    const resolvedLow = await resolveUser(AI_LOW_CREDITS_USER_EMAIL);
    expect(resolvedLow, `${AI_LOW_CREDITS_USER_EMAIL} not found — run: vibe dev`).toBeTruthy();
    if (!resolvedLow) {
      return;
    }
    lowCreditsUser = resolvedLow;
  }, TEST_TIMEOUT);

  afterAll(async () => {
    // Restore credits drained for the insufficient-credits test
    if (drainedCredits > 0 && lowCreditsUser) {
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);
      const { t } = creditsScopedTranslation.scopedT(defaultLocale);
      await CreditRepository.addUserCredits(
        lowCreditsUser.id,
        drainedCredits,
        "permanent",
        logger,
        t,
      );
    }
  }, TEST_TIMEOUT);

  // ── Basic send ──────────────────────────────────────────────────────────────
  it("basic send: returns success with content", async () => {
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

    expect(data.lastAiMessageId).toBeTruthy();
    expect(data.lastAiMessageContent).toBeTruthy();
    expect(data.lastAiMessageContent).toContain("HELLO_TEST");
    expect(data.threadId).toBeTruthy();

    // lastAiMessageId must exist in DB messages
    const ids = new Set(messages.map((m) => m.id));
    expect(ids.has(data.lastAiMessageId)).toBe(true);

    // DB content matches returned content
    const lastMsg = messages.find((m) => m.id === data.lastAiMessageId);
    expect(lastMsg?.role).toBe("assistant");
    expect(lastMsg?.content).toContain("HELLO_TEST");

    // At minimum: 1 user + 1 assistant
    expect(messages.filter((m) => m.role === "user").length).toBeGreaterThanOrEqual(1);
    expect(messages.filter((m) => m.role === "assistant").length).toBeGreaterThanOrEqual(1);
  }, TEST_TIMEOUT);

  // ── Credit deduction ────────────────────────────────────────────────────────
  it("credit deduction: balance decreases after a stream", async () => {
    setFetchCacheContext("credit-deduction");
    const logger = createEndpointLogger(false, Date.now(), defaultLocale);
    const { t } = creditsScopedTranslation.scopedT(defaultLocale);

    const before = await CreditRepository.getCreditBalanceForUser(testUser, defaultLocale, logger, t);
    expect(before.success).toBe(true);
    if (!before.success) { return; }

    await runTestStream({
      user: testUser,
      prompt: "Reply with one word: OK",
      threadMode: "none",
    });

    const after = await CreditRepository.getCreditBalanceForUser(testUser, defaultLocale, logger, t);
    expect(after.success).toBe(true);
    if (!after.success) { return; }

    expect(after.data.total).toBeLessThan(before.data.total);
  }, TEST_TIMEOUT);

  // ── Parent-child chain ──────────────────────────────────────────────────────
  it("parent-child chain: messages form unbroken root→leaf across turns", async () => {
    setFetchCacheContext("parent-child-chain");
    const turn1 = await runTestStream({
      user: testUser,
      prompt: "Say: TURN1",
      threadMode: "new",
    });
    expect(turn1.result.success).toBe(true);
    if (!turn1.result.success) { return; }
    const threadId = turn1.result.data.threadId;

    const turn2 = await runTestStream({
      user: testUser,
      prompt: "Say: TURN2",
      threadMode: "append",
      threadId,
    });
    expect(turn2.result.success).toBe(true);

    const turn3 = await runTestStream({
      user: testUser,
      prompt: "Say: TURN3",
      threadMode: "append",
      threadId,
    });
    expect(turn3.result.success).toBe(true);
    if (!turn2.result.success || !turn3.result.success) { return; }

    // All turns share same threadId
    expect(turn2.result.data.threadId).toBe(threadId);
    expect(turn3.result.data.threadId).toBe(threadId);

    const allMessages = turn3.messages;
    const leafId = turn3.result.data.lastAiMessageId;
    const chain = walkChain(allMessages, leafId);
    expect(chain.length).toBeGreaterThanOrEqual(3);

    // Root has no parent
    const root = allMessages.find((m) => m.id === chain[0]);
    expect(root?.parentId).toBeNull();

    // Every parentId references a real message
    const ids = new Set(allMessages.map((m) => m.id));
    for (const msg of allMessages) {
      if (msg.parentId) {
        expect(ids.has(msg.parentId)).toBe(true);
      }
    }

    // All three lastAiMessageIds are in the final message set
    expect(ids.has(turn1.result.data.lastAiMessageId)).toBe(true);
    expect(ids.has(turn2.result.data.lastAiMessageId)).toBe(true);
    expect(ids.has(turn3.result.data.lastAiMessageId)).toBe(true);

    // Turn 3 assistant message has a sequenceId
    const turn3AiMsg = allMessages.find((m) => m.id === turn3.result.data.lastAiMessageId);
    expect(turn3AiMsg?.sequenceId).toBeTruthy();
  }, TEST_TIMEOUT);

  // ── Retry branching ─────────────────────────────────────────────────────────
  it("retry: thread accumulates multiple AI responses", async () => {
    setFetchCacheContext("retry");
    const original = await runTestStream({
      user: testUser,
      prompt: "Say: ORIGINAL",
      threadMode: "new",
    });
    expect(original.result.success).toBe(true);
    if (!original.result.success) { return; }

    const retry = await runTestStream({
      user: testUser,
      prompt: "Say: RETRY",
      threadMode: "append",
      threadId: original.result.data.threadId,
    });
    expect(retry.result.success).toBe(true);

    const allMessages = retry.messages;
    const aiMessages = allMessages.filter((m) => m.role === "assistant");
    expect(aiMessages.length).toBeGreaterThanOrEqual(2);

    // Different IDs and different sequenceIds per turn
    const aiIds = new Set(aiMessages.map((m) => m.id));
    expect(aiIds.size).toBeGreaterThanOrEqual(2);

    const aiSeqIds = new Set(aiMessages.map((m) => m.sequenceId).filter(Boolean));
    expect(aiSeqIds.size).toBeGreaterThanOrEqual(2);

    // At least 2 user messages (one per turn)
    expect(allMessages.filter((m) => m.role === "user").length).toBeGreaterThanOrEqual(2);
  }, TEST_TIMEOUT);

  // ── Tool call ───────────────────────────────────────────────────────────────
  it("tool call: TOOL messages present with toolName and non-error result", async () => {
    setFetchCacheContext("tool-call");
    const { result, messages } = await runTestStream({
      user: testUser,
      prompt: "Use the tool-help tool to list available tools. Return the tool names you find.",
      threadMode: "new",
    });

    expect(result.success).toBe(true);

    const toolMessages = messages.filter((m) => m.role === "tool" && m.toolCall !== null);
    expect(toolMessages.length).toBeGreaterThanOrEqual(1);

    const toolMsg = toolMessages[0];
    expect(toolMsg?.toolCall?.toolName).toBeTruthy();
    expect(toolMsg?.toolCall?.result).toBeDefined();

    // Result must be a non-null record (not a primitive, array, or error string)
    const toolRes = toolResultRecord(toolMsg?.toolCall?.result);
    expect(toolRes).not.toBeNull();
    expect("error" in (toolRes ?? {})).toBe(false);

    // Tool message parent must be an assistant message
    const toolParent = messages.find((m) => m.id === toolMsg?.parentId);
    expect(toolParent?.role).toBe("assistant");

    // There must be an assistant response after the tool call
    const toolIndex = messages.findIndex((m) => m.id === toolMsg?.id);
    const responseAfterTool = messages.slice(toolIndex + 1).find((m) => m.role === "assistant");
    expect(responseAfterTool).toBeDefined();
  }, TEST_TIMEOUT);

  // ── Image generation ────────────────────────────────────────────────────────
  it("image generation: generate_image tool returns imageUrl", async () => {
    setFetchCacheContext("image-generation");
    const { result, messages } = await runTestStream({
      user: testUser,
      // flux-schnell is cheapest image model (fal.ai)
      prompt: "Call the generate_image tool with prompt='red circle' and model='flux-schnell'. Do not add any other commentary.",
      threadMode: "new",
    });

    expect(result.success).toBe(true);

    const toolMsg = messages.find(
      (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image",
    );
    expect(toolMsg).toBeDefined();

    const toolRes = toolResultRecord(toolMsg?.toolCall?.result);
    expect(toolRes).not.toBeNull();
    expect(toolRes?.["imageUrl"]).toBeTruthy();
    expect(typeof toolRes?.["creditCost"]).toBe("number");
    expect((toolRes?.["creditCost"] as number) >= 0).toBe(true);
  }, TEST_TIMEOUT);

  // ── Music generation ────────────────────────────────────────────────────────
  it("music generation: generate_music tool returns audioUrl", async () => {
    setFetchCacheContext("music-generation");
    const { result, messages } = await runTestStream({
      user: testUser,
      prompt: "Call the generate_music tool with prompt='upbeat piano melody'. Do not add commentary.",
      threadMode: "new",
      mediaModelOverrides: { musicGenModelId: ModelId.MODELSLAB_MUSIC_GEN },
    });

    expect(result.success).toBe(true);

    const toolMsg = messages.find(
      (m) => m.role === "tool" && m.toolCall?.toolName === "generate_music",
    );
    expect(toolMsg).toBeDefined();

    const toolRes = toolResultRecord(toolMsg?.toolCall?.result);
    expect(toolRes).not.toBeNull();
    expect(toolRes?.["audioUrl"]).toBeTruthy();
    expect(typeof toolRes?.["creditCost"]).toBe("number");
    expect(typeof toolRes?.["durationSeconds"]).toBe("number");
    expect((toolRes?.["durationSeconds"] as number) > 0).toBe(true);
  }, TEST_TIMEOUT);

  // ── Video generation ────────────────────────────────────────────────────────
  it("video generation: generate_video tool returns videoUrl", async () => {
    setFetchCacheContext("video-generation");
    const { result, messages } = await runTestStream({
      user: testUser,
      prompt: "Call the generate_video tool with prompt='spinning cube'. Do not add any other commentary.",
      threadMode: "new",
      mediaModelOverrides: { videoGenModelId: ModelId.MODELSLAB_WAN_2_5_T2V },
    });

    expect(result.success).toBe(true);

    const toolMsg = messages.find(
      (m) => m.role === "tool" && m.toolCall?.toolName === "generate_video",
    );
    expect(toolMsg).toBeDefined();

    const toolRes = toolResultRecord(toolMsg?.toolCall?.result);
    expect(toolRes).not.toBeNull();
    expect(toolRes?.["videoUrl"]).toBeTruthy();
    expect(typeof toolRes?.["creditCost"]).toBe("number");
    expect(typeof toolRes?.["durationSeconds"]).toBe("number");
    expect((toolRes?.["durationSeconds"] as number) > 0).toBe(true);
  }, TEST_TIMEOUT);

  // ── Insufficient credits ─────────────────────────────────────────────────────
  it("insufficient credits: returns error for low-credit user", async () => {
    setFetchCacheContext("insufficient-credits");
    const logger = createEndpointLogger(false, Date.now(), defaultLocale);
    const { t } = creditsScopedTranslation.scopedT(defaultLocale);

    // Drain to ~0.5 credits
    const balanceResult = await CreditRepository.getCreditBalanceForUser(
      lowCreditsUser,
      defaultLocale,
      logger,
      t,
    );
    const currentBalance = balanceResult.success ? balanceResult.data.total : 0;
    const TARGET_BALANCE = 0.5;
    const toDrain = currentBalance - TARGET_BALANCE;
    if (toDrain > 0) {
      await CreditRepository.deductCreditsForFeature(
        lowCreditsUser,
        toDrain,
        "test_drain",
        logger,
        t,
        defaultLocale,
      );
      drainedCredits = toDrain;
    }

    const { result } = await runTestStream({
      user: lowCreditsUser,
      prompt: "Say: SHOULD_FAIL",
      threadMode: "none",
    });

    expect(result.success).toBe(false);
    if (result.success) { return; }
    expect(result.errorType?.errorCode).toBeTruthy();
  }, TEST_TIMEOUT);

  // ── Multi-turn (slow — only runs when RUN_SLOW_TESTS=1) ─────────────────────
  it.skipIf(!process.env["RUN_SLOW_TESTS"])(
    "multi-turn: thread accumulates messages across turns",
    async () => {
      setFetchCacheContext("multi-turn");
      const turns = [];
      let threadId: string | undefined;

      for (let i = 1; i <= 4; i++) {
        const turn = await runTestStream({
          user: testUser,
          prompt: `Say: TURN_${i}`,
          threadMode: threadId ? "append" : "new",
          threadId,
        });
        if (turn.result.success) {
          threadId = turn.result.data.threadId;
        }
        turns.push(turn);
      }

      expect(turns).toHaveLength(4);
      for (const turn of turns) {
        expect(turn.result.success).toBe(true);
      }

      const lastMessages = turns.at(-1)?.messages ?? [];
      expect(lastMessages.length).toBeGreaterThanOrEqual(8);

      const firstThreadId = turns[0]?.result.success ? turns[0].result.data.threadId : undefined;
      for (const turn of turns) {
        if (turn.result.success) {
          expect(turn.result.data.threadId).toBe(firstThreadId);
        }
      }
    },
    TEST_TIMEOUT,
  );
});
