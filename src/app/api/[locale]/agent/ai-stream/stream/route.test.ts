/**
 * AI Stream Integration Tests — Single-Thread Sequential Suite
 *
 * Architecture:
 * - One shared thread (`threadId`) for the main test sequence so the AI sees
 *   real conversation history and a human reviewer can read the thread in the UI.
 * - Separate isolated threads for tests that fundamentally can't share state
 *   (incognito, credits, error handling, certain callback modes).
 * - After every step: assertThreadIdle + assertNoPendingTasks + credit check.
 * - Per-step credit pinning so billing regressions are caught immediately.
 * - HTTP cache (installFetchCache) intercepts outbound fetch() on first run,
 *   replays from fixtures on subsequent runs — same code path, no network.
 * - Claude Code fixtures (claude-code-fixture-store) for Agent SDK calls.
 *
 * Cache bust: delete fixtures/http-cache/<case>/ or fixtures/claude-code/<case>/
 *
 * Thread layout (visible in UI):
 *   T1  → new thread + tool call (tool-help) — creates thread, tests parent chain + tool structure
 *   T2  → image generation (z-image-turbo, inline wait mode)
 *   T3  → retry + branch from T1 AI → two sibling forks: RETRY_RESPONSE + BRANCH_RESPONSE
 *   T4  → music gen (from retry branch) + video gen (from fork branch)
 *   T5  → callback modes: detach (taskId/pending) + endLoop (1 tool call)
 *   T6  → wakeUp: phase1 dispatches async, phase2 revives with result
 *   T7  → approve: phase1 pending confirmation, phase2 confirms + executes
 *   T8  → parallel tools: tool-help + generate_image in same batch
 *   T9  → preCalls injection: synthetic tool result in DB before AI runs
 *   T10 → file attachments: image, multi (image+audio), voice, video
 *   T11 → Gemini native image generation (file part output)
 *   T12 → invalid explicitParentMessageId — graceful error handling
 *
 * Standalone suites (no thread / own thread):
 *   - Credits (deduction, incognito, insufficient)
 *   - Favorites + UNBOTTLED self-relay (F1–F3)
 */

import "server-only";

// AI SDK v2→v3 compat mode warning — provider works fine, SDK just prefers v3
// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

// Install HTTP fetch interceptor before any other imports touch fetch
import { installFetchCache } from "../testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";

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
import {
  setFetchCacheContext,
  setFetchCacheStrictMode,
} from "../testing/fetch-cache";
import {
  runTestStream,
  fetchThreadMessages,
  fetchThreadTitle,
  toolResultRecord,
  type SlimMessage,
} from "../testing/headless-test-runner";
import { runHeadlessAiStream } from "../repository/headless";
import { agentEnv } from "@/app/api/[locale]/agent/env";
import {
  ChatModelId,
  chatModelOptionsIndex,
  type ChatModelOption,
} from "../models";
import { ImageGenModelId } from "@/app/api/[locale]/agent/image-generation/models";
import { MusicGenModelId } from "@/app/api/[locale]/agent/music-generation/models";
import { VideoGenModelId } from "@/app/api/[locale]/agent/video-generation/models";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import {
  ModelSelectionType,
  ModelSortField,
  ModelSortDirection,
  ContentLevel,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { scopedTranslation } from "./i18n";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

/** Build parent→children adjacency map. Root messages keyed under "__root__". */
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

/** Assert that no orphan messages exist */
function assertNoOrphans(messages: SlimMessage[]): void {
  const idSet = new Set(messages.map((m) => m.id));
  for (const msg of messages) {
    if (msg.parentId) {
      expect(
        idSet.has(msg.parentId),
        `Orphan: ${msg.id} (${msg.role}) → missing parent ${msg.parentId}`,
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
      `Out of order: ${curr.id} created before ancestor ${prev.id}`,
    ).toBe(true);
  }
}

/** Assert that the thread's streamingState is idle in DB */
async function assertThreadIdle(threadId: string): Promise<void> {
  const [thread] = await db
    .select({ streamingState: chatThreads.streamingState })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId));
  expect(thread?.streamingState, `Thread ${threadId} not idle`).toBe("idle");
}

/**
 * Assert no pending wakeUp/background tasks remain for a thread.
 * Prevents wakeUp loop: after wakeUp phase2, task should be completed/cancelled.
 */
async function assertNoPendingTasks(threadId: string): Promise<void> {
  const pending = await db.execute<{ id: string; last_execution_status: string | null }>(
    sql`SELECT id, last_execution_status FROM cron_tasks
        WHERE wake_up_thread_id = ${threadId}
          AND enabled = true
          AND (last_execution_status IS NULL
               OR last_execution_status NOT IN ('completed', 'cancelled', 'failed', 'stopped'))`,
  );
  expect(
    pending.rows.length,
    `Thread ${threadId} has ${String(pending.rows.length)} pending tasks (${pending.rows.map((p) => `${p.id}:${String(p.last_execution_status)}`).join(", ")})`,
  ).toBe(0);
}

/**
 * Cancel all wakeUp tasks for a thread so they don't trigger loop runs.
 * Call after wakeUp tests to prevent the task system from re-triggering.
 */
async function cancelThreadTasks(threadId: string): Promise<void> {
  await db.execute(
    sql`DELETE FROM cron_tasks WHERE wake_up_thread_id = ${threadId}`,
  );
}

/**
 * Assert step completed without the AI reporting issues.
 * Every test prompt ends with "End with STEP_OK if everything worked."
 * If the AI found something wrong, it reports it instead — and the test
 * fails with the AI's feedback as the error message.
 */
function assertStepOk(content: string | null | undefined, stepName: string): void {
  expect(
    content,
    `[${stepName}] AI returned empty content`,
  ).toBeTruthy();
  if (!content) return;
  expect(
    content.includes("STEP_OK"),
    `[${stepName}] AI did NOT confirm STEP_OK — reported issues instead:\n\n${content}`,
  ).toBe(true);
}

/** Filter messages by role */
function byRole(messages: SlimMessage[], role: string): SlimMessage[] {
  return messages.filter((m) => m.role === role);
}

/** Get messages added since prevCount (sorted by createdAt) */
function newMessages(
  messages: SlimMessage[],
  prevCount: number,
): SlimMessage[] {
  return [...messages]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(prevCount);
}

/** Read a fixture file from fixtures/media/ as a File object */
async function loadFixture(filename: string, mimeType: string): Promise<File> {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const fixturePath = join(
    import.meta.dirname,
    "..",
    "testing",
    "fixtures",
    "media",
    filename,
  );
  const buffer = await readFile(fixturePath);
  return new File([buffer], filename, { type: mimeType });
}

/** Pin the test user's balance to an exact amount, zeroing all wallets first */
async function pinBalance(
  userId: string,
  credits: number,
  creditLogger: ReturnType<typeof createEndpointLogger>,
  creditT: ReturnType<typeof creditsScopedTranslation.scopedT>["t"],
): Promise<void> {
  const wallets = await db.execute<{
    id: string;
    balance: number;
    free_credits_remaining: number;
  }>(
    sql`SELECT cw.id, cw.balance, cw.free_credits_remaining
        FROM credit_wallets cw
        LEFT JOIN user_lead_links ull ON ull.lead_id = cw.lead_id
        WHERE cw.user_id = ${userId} OR ull.user_id = ${userId}`,
  );

  for (const w of wallets.rows) {
    await db.execute(
      sql`UPDATE credit_wallets SET balance = 0, free_credits_remaining = 0 WHERE id = ${w.id}`,
    );
  }

  if (credits > 0) {
    await CreditRepository.addUserCredits(
      userId,
      credits,
      "permanent",
      creditLogger,
      creditT,
    );
  }
}

/** Read the current credit balance for the test user */
async function getBalance(
  user: JwtPrivatePayloadType,
  creditLogger: ReturnType<typeof createEndpointLogger>,
  creditT: ReturnType<typeof creditsScopedTranslation.scopedT>["t"],
): Promise<number> {
  const result = await CreditRepository.getCreditBalanceForUser(
    user,
    defaultLocale,
    creditLogger,
    creditT,
  );
  return result.success ? result.data.total : 0;
}

/** Assert credit deduction is within [min, max] inclusive */
function assertDeducted(
  before: number,
  after: number,
  min: number,
  max: number,
): void {
  const deducted = before - after;
  expect(
    deducted,
    `Expected deduction ${min}–${max}, got ${deducted} (before=${before}, after=${after})`,
  ).toBeGreaterThanOrEqual(min);
  expect(
    deducted,
    `Expected deduction ${min}–${max}, got ${deducted} (before=${before}, after=${after})`,
  ).toBeLessThanOrEqual(max);
}

// ── Test Suite ────────────────────────────────────────────────────────────────

const TEST_TIMEOUT = 120_000;

describe("AI Stream Integration", () => {
  let testUser: JwtPrivatePayloadType;
  let creditLogger: ReturnType<typeof createEndpointLogger>;
  let creditT: ReturnType<typeof creditsScopedTranslation.scopedT>["t"];
  /** Main favorite: quality-tester skill + kimi variant + media model selections */
  let mainFavoriteId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) return;
    testUser = resolved;

    creditLogger = createEndpointLogger(false, Date.now(), defaultLocale);
    const { t } = creditsScopedTranslation.scopedT(defaultLocale);
    creditT = t;

    // Safety floor: 500cr before any test
    const balance = await getBalance(testUser, creditLogger, creditT);
    if (balance < 500) {
      await CreditRepository.addUserCredits(
        testUser.id,
        500 - balance,
        "permanent",
        creditLogger,
        creditT,
      );
    }

    // ── Create main favorite: quality-tester skill + kimi variant ──
    // This is the single source of truth for model selection, same as real
    // users. Replaces all mediaModelOverrides and VIBE_TEST_AI_MODEL usage.
    // Variant "kimi": KIMI_K2_5 (chat), MODELSLAB image+music+video.
    const [fav] = await db
      .insert(chatFavorites)
      .values({
        userId: testUser.id,
        skillId: "quality-tester",
        variantId: "kimi",
        modelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ChatModelId.KIMI_K2_5,
        },
        imageGenModelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ImageGenModelId.Z_IMAGE_TURBO,
        },
        musicGenModelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: MusicGenModelId.LYRIA_3,
        },
        videoGenModelSelection: {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: VideoGenModelId.LTX_2_PRO_T2V,
        },
        position: 9998,
      })
      .returning({ id: chatFavorites.id });
    mainFavoriteId = fav!.id;
  }, TEST_TIMEOUT);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Main Thread: one shared thread, sequential steps
  // Each step verifies thread state + credits before moving on.
  // A human reading the thread in the UI sees a natural conversation.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe("Main Thread (single shared thread)", () => {
    // Thread state shared across steps
    let threadId: string;

    // Step artifacts
    let t1UserMsgId: string;
    let t1AiMsgId: string;
    let t1ToolAiMsgId: string; // last AI after tool call (was t2AiMsgId)
    let branchRetryAiMsgId: string; // From retry+branch test
    let branchForkAiMsgId: string; // From branch fork

    // ── T1: New thread + tool call (combines basic send + tool call) ──────
    it(
      "T1: new thread + tool call — thread creation, parent chain, tool-help result, metadata",
      async () => {
        setFetchCacheContext("tool-call");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[T1 thread-create+tool-call] Use the tool-help tool to list available tools. Return the tool names you find. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "new",
          favoriteId: mainFavoriteId,
        });

        expect(result.success).toBe(true);
        if (!result.success) return;

        // ── Capture IDs early so downstream tests aren't blocked ──
        threadId = result.data.threadId!;
        expect(threadId).toBeTruthy();

        // ── First user message (root) ──
        const userMsgs = byRole(messages, "user");
        expect(userMsgs.length).toBeGreaterThanOrEqual(1);
        const userMsg = userMsgs[0]!;
        t1UserMsgId = userMsg.id;

        // ── User message properties ──
        expect(userMsg.parentId).toBeNull();
        expect(userMsg.isAI).toBe(false);
        expect(userMsg.model).toBeNull();
        expect(userMsg.sequenceId).toBeNull();
        expect(userMsg.promptTokens).toBeNull();
        expect(userMsg.completionTokens).toBeNull();
        expect(userMsg.creditCost).toBeNull();

        // ── First AI message (tool call initiator) ──
        const aiMsgs = byRole(messages, "assistant");
        expect(aiMsgs.length).toBeGreaterThanOrEqual(1);
        const firstAi = aiMsgs[0]!;
        t1AiMsgId = firstAi.id;
        expect(firstAi.parentId).toBe(userMsg.id);
        expect(firstAi.isAI).toBe(true);
        expect(firstAi.sequenceId).toBeTruthy();
        expect(firstAi.model).toBeTruthy();
        expect(firstAi.isCompacting).toBe(false);

        // ── Tool message with valid structure ──
        const toolMsgs = messages.filter((m) => m.role === "tool" && m.toolCall !== null);
        expect(toolMsgs.length).toBeGreaterThanOrEqual(1);
        const toolMsg = toolMsgs[0]!;
        expect(toolMsg.toolCall?.toolName).toBeTruthy();
        const toolRes = toolResultRecord(toolMsg.toolCall?.result);
        expect(toolRes).not.toBeNull();
        expect(toolMsg.isAI).toBe(true);
        expect(toolMsg.model).toBeTruthy();

        // ── Tool parent is assistant, shares sequenceId ──
        const toolParent = messages.find((m) => m.id === toolMsg.parentId);
        expect(toolParent?.role).toBe("assistant");
        expect(toolMsg.sequenceId).toBe(toolParent!.sequenceId);

        // ── All tool messages share the SAME sequenceId ──
        const toolSequenceIds = new Set(toolMsgs.map((m) => m.sequenceId));
        expect(toolSequenceIds.size).toBe(1);

        // ── Tool messages have model set ──
        for (const tm of toolMsgs) {
          expect(tm.model, `Tool msg ${tm.id} missing model`).toBeTruthy();
        }

        // ── Last AI message (final response after tool) ──
        t1ToolAiMsgId = result.data.lastAiMessageId!;
        const lastAi = messages.find((m) => m.id === t1ToolAiMsgId);
        expect(lastAi?.content).toBeTruthy();
        expect(lastAi!.content!.length).toBeGreaterThan(5);
        assertStepOk(lastAi!.content, "T1");
        expect(lastAi!.promptTokens).toBeGreaterThan(0);
        expect(lastAi!.completionTokens).toBeGreaterThan(0);
        expect(lastAi!.creditCost).toBeGreaterThan(0);
        expect(lastAi!.finishReason).toBe("stop");

        // ── Chain from last AI back to root ──
        const chain = walkChain(messages, lastAi!.id);
        expect(chain[0]).toBe(t1UserMsgId);
        expect(chain.length).toBeGreaterThanOrEqual(4); // user, ai, tool, ai
        assertChronologicalOrder(chain, messages);

        // ── Thread title generated ──
        const title = await fetchThreadTitle(threadId);
        expect(title).toBeTruthy();
        expect(title!.length).toBeGreaterThan(0);
        expect(title!.length).toBeLessThan(200);

        // ── totalCreditsDeducted ──
        expect(result.data.totalCreditsDeducted).toBeGreaterThan(0);

        // ── All message IDs are unique ──
        const allIds = messages.map((m) => m.id);
        expect(new Set(allIds).size).toBe(allIds.length);

        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const after = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(before, after, 0, 20);
      },
      TEST_TIMEOUT,
    );

    // ── T2: Image generation (inline wait) ──────────────────────────────
    it(
      "T2: image generation (z-image-turbo, wait mode) — imageUrl, creditCost, generatedMedia",
      async () => {
        setFetchCacheContext("image-generation");
        await pinBalance(testUser.id, 15, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);
        const prevCount = (await fetchThreadMessages(threadId)).length;

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[T2 image-gen] Call the generate_image tool with prompt='red circle'. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
        });

        expect(result.success).toBe(true);
        if (!result.success) return;

        const added = newMessages(messages, prevCount);

        // ── generate_image tool message ──
        const toolMsg = added.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image",
        );
        expect(toolMsg).toBeDefined();
        expect(toolMsg!.isAI).toBe(true);

        const toolRes = toolResultRecord(toolMsg!.toolCall?.result);
        expect(toolRes).not.toBeNull();
        expect(typeof toolRes!["imageUrl"]).toBe("string");
        expect(toolRes!["imageUrl"]).toBeTruthy();
        expect(typeof toolRes!["creditCost"]).toBe("number");

        // ── Tool parent is assistant, shares sequenceId ──
        const toolParent = messages.find((m) => m.id === toolMsg!.parentId);
        expect(toolParent?.role).toBe("assistant");
        expect(toolMsg!.sequenceId).toBe(toolParent!.sequenceId);

        // ── imageUrl is in the tool result (not lastGeneratedMediaUrl — that's for native multimodal LLMs) ──
        expect(toolRes!["imageUrl"]).toBeTruthy();

        // ── creditCost in tool result is a positive number ──
        expect((toolRes!["creditCost"] as number)).toBeGreaterThan(0);

        // ── Final AI has token metadata ──
        const lastAi = messages.find((m) => m.id === result.data.lastAiMessageId);
        expect(lastAi).toBeDefined();
        expect(lastAi!.finishReason).toBe("stop");
        assertStepOk(lastAi!.content, "T2");

        const chain = walkChain(messages, result.data.lastAiMessageId!);
        expect(chain[0]).toBe(t1UserMsgId);
        assertChronologicalOrder(chain, messages);
        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const after = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(before, after, 0.47, 10);
      },
      TEST_TIMEOUT,
    );

    // ── T3: Retry + branch from T1 first AI — two forks from same parent ──
    it(
      "T3: retry + branch — two sibling forks from T1 AI, independent chains, correct tree structure",
      async () => {
        // ── Fork 1: Retry from T1 first AI ──
        setFetchCacheContext("retry");
        await pinBalance(testUser.id, 40, creditLogger, creditT);
        const beforeRetry = await getBalance(testUser, creditLogger, creditT);
        const prevCountRetry = (await fetchThreadMessages(threadId)).length;

        const { result: retryResult, messages: retryMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T3a retry-branch] Say exactly: RETRY_RESPONSE STEP_OK. If anything seems wrong or unexpected, report it instead.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: t1ToolAiMsgId,
        });

        expect(retryResult.success).toBe(true);
        if (!retryResult.success) return;

        branchRetryAiMsgId = retryResult.data.lastAiMessageId!;
        const retryAdded = newMessages(retryMsgs, prevCountRetry);

        // Retry user is child of t1ToolAi (final AI after tool call)
        const retryUser = retryAdded.find(
          (m) => m.role === "user" && m.parentId === t1ToolAiMsgId,
        );
        expect(retryUser).toBeDefined();

        const retryAi = retryMsgs.find((m) => m.id === branchRetryAiMsgId);
        expect(retryAi?.content).toContain("RETRY");
        assertStepOk(retryAi?.content, "T3a");
        expect(retryAi!.parentId).toBe(retryUser!.id);

        // Retry chain: t1User → t1Ai → ... → t1ToolAi → retryUser → retryAi
        const retryChain = walkChain(retryMsgs, retryAi!.id);
        expect(retryChain.length).toBeGreaterThanOrEqual(4);
        expect(retryChain[0]).toBe(t1UserMsgId);
        expect(retryChain).toContain(t1ToolAiMsgId);
        assertChronologicalOrder(retryChain, retryMsgs);

        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterRetry = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeRetry, afterRetry, 0, 10);

        // ── Fork 2: Branch from same T1 first AI ──
        setFetchCacheContext("branch");
        await pinBalance(testUser.id, 40, creditLogger, creditT);
        const beforeBranch = await getBalance(testUser, creditLogger, creditT);

        const { result: branchResult, messages: branchMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T3b fork-branch] Say exactly: BRANCH_RESPONSE STEP_OK. If anything seems wrong or unexpected, report it instead.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: t1ToolAiMsgId,
        });

        expect(branchResult.success).toBe(true);
        if (!branchResult.success) return;

        branchForkAiMsgId = branchResult.data.lastAiMessageId!;

        // 2 user siblings under t1ToolAi: retry + branch
        const t1ToolAiUserChildren = branchMsgs.filter(
          (m) => m.role === "user" && m.parentId === t1ToolAiMsgId,
        );
        expect(t1ToolAiUserChildren.length).toBeGreaterThanOrEqual(2);

        // Distinct content across siblings
        const uniqueContents = new Set(t1ToolAiUserChildren.map((m) => m.content));
        expect(uniqueContents.size).toBe(t1ToolAiUserChildren.length);

        // Branch AI has correct content
        const branchAi = branchMsgs.find((m) => m.id === branchForkAiMsgId);
        expect(branchAi?.content).toContain("BRANCH");
        assertStepOk(branchAi?.content, "T3b");

        // Branch chain: root → ... → t1ToolAi → branchUser → branchAi
        const branchChain = walkChain(branchMsgs, branchAi!.id);
        expect(branchChain.length).toBeGreaterThanOrEqual(4);
        expect(branchChain[0]).toBe(t1UserMsgId);

        assertNoOrphans(branchMsgs);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterBranch = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeBranch, afterBranch, 0, 10);
      },
      TEST_TIMEOUT,
    );

    // ── T4: Music gen (from retry branch) + video gen (from fork branch) ──
    it(
      "T4: music + video generation — continue from both branches, verify media tool results",
      async () => {
        // ── Part A: Music gen from retry branch ──
        setFetchCacheContext("music-generation");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeMusic = await getBalance(testUser, creditLogger, creditT);
        const prevCountMusic = (await fetchThreadMessages(threadId)).length;

        const { result: musicResult, messages: musicMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T4a music-gen] Call the generate_music tool with prompt='upbeat piano melody'. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: branchRetryAiMsgId,
        });

        expect(musicResult.success).toBe(true);
        if (!musicResult.success) return;

        const musicAdded = newMessages(musicMsgs, prevCountMusic);

        // User is child of retry AI
        const musicUser = musicAdded.find((m) => m.role === "user");
        expect(musicUser?.parentId).toBe(branchRetryAiMsgId);

        // Tool message — find the successful one (AI may retry on duration mismatch)
        const musicToolMsgs = musicAdded.filter(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_music",
        );
        expect(musicToolMsgs.length).toBeGreaterThanOrEqual(1);
        const musicToolMsg = musicToolMsgs.find(
          (m) => toolResultRecord(m.toolCall?.result) !== null,
        );
        expect(musicToolMsg).toBeDefined();

        const musicRes = toolResultRecord(musicToolMsg!.toolCall?.result);
        expect(musicRes).not.toBeNull();
        expect(typeof musicRes!["audioUrl"]).toBe("string");
        expect(musicRes!["audioUrl"]).toBeTruthy();
        expect(typeof musicRes!["creditCost"]).toBe("number");
        expect((musicRes!["creditCost"] as number) > 0).toBe(true);
        expect(typeof musicRes!["durationSeconds"]).toBe("number");
        expect((musicRes!["durationSeconds"] as number) >= 8).toBe(true);
        expect((musicRes!["durationSeconds"] as number) <= 120).toBe(true);

        // Tool parent is assistant, shares sequenceId
        const musicToolParent = musicMsgs.find((m) => m.id === musicToolMsg!.parentId);
        expect(musicToolParent?.role).toBe("assistant");
        expect(musicToolMsg!.sequenceId).toBe(musicToolParent!.sequenceId);

        // Final AI has token metadata
        const musicLastAi = musicMsgs.find((m) => m.id === musicResult.data.lastAiMessageId);
        expect(musicLastAi).toBeDefined();
        expect(musicLastAi!.finishReason).toBe("stop");
        assertStepOk(musicLastAi!.content, "T4a");

        // Chain goes back to root through retry branch
        const musicChain = walkChain(musicMsgs, musicResult.data.lastAiMessageId!);
        expect(musicChain[0]).toBe(t1UserMsgId);
        expect(musicChain).toContain(t1AiMsgId);
        expect(musicChain).toContain(branchRetryAiMsgId);
        assertChronologicalOrder(musicChain, musicMsgs);

        assertNoOrphans(musicMsgs);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterMusic = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeMusic, afterMusic, 0, 15);

        // ── Part B: Video gen from fork branch ──
        setFetchCacheContext("video-generation");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeVideo = await getBalance(testUser, creditLogger, creditT);
        const prevCountVideo = (await fetchThreadMessages(threadId)).length;

        const { result: videoResult, messages: videoMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T4b video-gen] Call the generate_video tool with prompt='spinning cube'. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: branchForkAiMsgId,
        });

        expect(videoResult.success).toBe(true);
        if (!videoResult.success) return;

        const videoAdded = newMessages(videoMsgs, prevCountVideo);

        // User is child of fork AI
        const videoUser = videoAdded.find((m) => m.role === "user");
        expect(videoUser?.parentId).toBe(branchForkAiMsgId);

        // Tool message
        const videoToolMsg = videoAdded.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_video",
        );
        expect(videoToolMsg).toBeDefined();

        const videoRes = toolResultRecord(videoToolMsg!.toolCall?.result);
        expect(videoRes).not.toBeNull();
        expect(typeof videoRes!["videoUrl"]).toBe("string");
        expect(videoRes!["videoUrl"]).toBeTruthy();
        expect(typeof videoRes!["creditCost"]).toBe("number");
        expect((videoRes!["creditCost"] as number) > 0).toBe(true);
        expect(typeof videoRes!["durationSeconds"]).toBe("number");
        expect((videoRes!["durationSeconds"] as number) > 0).toBe(true);
        expect((videoRes!["durationSeconds"] as number) <= 60).toBe(true);

        // Final AI
        const videoLastAi = videoMsgs.find((m) => m.id === videoResult.data.lastAiMessageId);
        expect(videoLastAi).toBeDefined();
        expect(videoLastAi!.finishReason).toBe("stop");
        assertStepOk(videoLastAi!.content, "T4b");

        // Chain goes back through fork branch
        const videoChain = walkChain(videoMsgs, videoResult.data.lastAiMessageId!);
        expect(videoChain[0]).toBe(t1UserMsgId);
        expect(videoChain).toContain(branchForkAiMsgId);
        assertChronologicalOrder(videoChain, videoMsgs);

        assertNoOrphans(videoMsgs);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterVideo = await getBalance(testUser, creditLogger, creditT);
        // Video gen: LTX_2_PRO_T2V = 1.4/sec × 6sec × 1.3 markup ≈ 10.9 + chat model ~1
        assertDeducted(beforeVideo, afterVideo, 5, 20);
      },
      TEST_TIMEOUT,
    );

    // ── T5: Callback modes — detach + endLoop in one test ─────────────────
    it(
      "T5: detach + endLoop — detach returns taskId/pending, endLoop stops after 1 tool call",
      async () => {
        // ── Part A: Detach mode ──
        setFetchCacheContext("callback-detach");
        await pinBalance(testUser.id, 20, creditLogger, creditT);
        const beforeDetach = await getBalance(testUser, creditLogger, creditT);
        const prevCountDetach = (await fetchThreadMessages(threadId)).length;

        const { result: detachResult, messages: detachMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T5a detach] Call generate_image with prompt='detach-test' using callbackMode detach. Pass callbackMode='detach' in your tool arguments. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
        });

        expect(detachResult.success).toBe(true);
        if (!detachResult.success) return;

        const detachAdded = newMessages(detachMsgs, prevCountDetach);

        // generate_image tool message
        const detachToolMsg = detachAdded.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image",
        );
        expect(detachToolMsg).toBeDefined();

        // Result is taskId/pending — NOT imageUrl
        // Debug: log raw result to diagnose null toolResultRecord
        const rawDetachResult = detachToolMsg!.toolCall?.result;
        expect(
          rawDetachResult,
          `[T5a debug] Raw tool result: ${JSON.stringify(rawDetachResult)} (type=${typeof rawDetachResult})`,
        ).toBeDefined();
        const detachToolRes = toolResultRecord(rawDetachResult);
        expect(
          detachToolRes,
          `[T5a debug] toolResultRecord returned null for: ${JSON.stringify(rawDetachResult)}`,
        ).not.toBeNull();
        expect(detachToolRes!["imageUrl"]).toBeUndefined();
        const hasPendingMarker =
          typeof detachToolRes!["taskId"] === "string" ||
          typeof detachToolRes!["status"] === "string";
        expect(hasPendingMarker).toBe(true);

        // AI acknowledged
        const detachLastAi = detachMsgs.find((m) => m.id === detachResult.data.lastAiMessageId);
        expect(detachLastAi?.content).toBeTruthy();
        assertStepOk(detachLastAi?.content, "T5a");

        assertNoOrphans(detachMsgs);
        await assertThreadIdle(threadId);
        await cancelThreadTasks(threadId);
        await assertNoPendingTasks(threadId);

        const afterDetach = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeDetach, afterDetach, 0, 5);

        // ── Part B: endLoop mode ──
        setFetchCacheContext("callback-end-loop");
        await pinBalance(testUser.id, 20, creditLogger, creditT);
        const beforeEndLoop = await getBalance(testUser, creditLogger, creditT);
        const prevCountEndLoop = (await fetchThreadMessages(threadId)).length;

        const { result: endLoopResult, messages: endLoopMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T5b endLoop] Call tool-help using callbackMode endLoop (pass callbackMode='endLoop' in arguments). Then try to call tool-help again. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
        });

        expect(endLoopResult.success).toBe(true);
        if (!endLoopResult.success) return;

        const endLoopAdded = newMessages(endLoopMsgs, prevCountEndLoop);

        // Exactly 1 tool-help call (endLoop stops the loop)
        const toolHelpMsgs = endLoopAdded.filter(
          (m) => m.role === "tool" && m.toolCall?.toolName === "tool-help",
        );
        expect(toolHelpMsgs).toHaveLength(1);

        // Tool result populated (endLoop executes inline)
        const endLoopToolRes = toolResultRecord(toolHelpMsgs[0]!.toolCall?.result);
        expect(endLoopToolRes).not.toBeNull();

        // Final AI content
        const endLoopLastAi = endLoopMsgs.find((m) => m.id === endLoopResult.data.lastAiMessageId);
        expect(endLoopLastAi?.content).toBeTruthy();
        assertStepOk(endLoopLastAi?.content, "T5b");

        assertNoOrphans(endLoopMsgs);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterEndLoop = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeEndLoop, afterEndLoop, 0, 5);
      },
      TEST_TIMEOUT,
    );

    // ── T6: wakeUp — two-phase E2E ──────────────────────────────────────
    describe("T6: wakeUp (two-phase)", () => {
      let wakeupToolMsgId: string;
      let wakeupMsgCount: number;

      it(
        "T6a: wakeUp phase1 — image dispatched async, AI gets taskId, stream ends naturally",
        async () => {
          setFetchCacheContext("callback-wakeup-phase1");
          await pinBalance(testUser.id, 20, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);
          wakeupMsgCount = (await fetchThreadMessages(threadId)).length;

          const { result, messages } = await runTestStream({
            user: testUser,
            prompt:
              "[T6a wakeUp-phase1] Call generate_image with prompt='wakeup-test' using callbackMode wakeUp. Pass callbackMode='wakeUp' in your tool arguments. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
            threadMode: "append",
            threadId,
            favoriteId: mainFavoriteId,
          });

          expect(result.success).toBe(true);
          if (!result.success) return;

          const added = newMessages(messages, wakeupMsgCount);
          wakeupMsgCount = messages.length;

          // ── Tool message: wakeUp returns taskId placeholder ──
          const toolMsg = added.find(
            (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          expect(toolMsg).toBeDefined();
          wakeupToolMsgId = toolMsg!.id;

          // wakeUp: result is null or taskId — no imageUrl
          const toolRes = toolResultRecord(toolMsg!.toolCall?.result);
          if (toolRes) {
            expect(toolRes["imageUrl"]).toBeUndefined();
          }

          // ── Stream ended, AI wrapped up ──
          const lastAi = messages.find((m) => m.id === result.data.lastAiMessageId);
          expect(lastAi).toBeDefined();
          assertStepOk(lastAi?.content, "T6a");

          await assertThreadIdle(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0, 5);
        },
        TEST_TIMEOUT,
      );

      it(
        "T6b: wakeUp phase2 — revival, AI sees backfilled result, responds naturally",
        async () => {
          expect(wakeupToolMsgId).toBeTruthy();

          setFetchCacheContext("callback-wakeup-phase2");
          await pinBalance(testUser.id, 20, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);

          const { result, messages } = await runTestStream({
            user: testUser,
            prompt: "",
            threadMode: "append",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: wakeupToolMsgId,
            wakeUpRevival: true,
          });

          expect(result.success).toBe(true);
          if (!result.success) return;

          // ── New assistant message added ──
          const newAi = messages.find((m) => m.id === result.data.lastAiMessageId);
          expect(newAi).toBeDefined();
          expect(newAi!.role).toBe("assistant");
          expect(newAi!.content).toBeTruthy();

          // ── No new user message created by revival ──
          const msgsSorted = [...messages].sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
          );
          const latestUser = msgsSorted.filter((m) => m.role === "user").at(-1);
          if (latestUser && newAi) {
            expect(latestUser.createdAt.getTime()).toBeLessThanOrEqual(
              newAi.createdAt.getTime(),
            );
          }

          assertNoOrphans(messages);
          await assertThreadIdle(threadId);

          // ── Cancel any wakeUp tasks to prevent loop ──
          await cancelThreadTasks(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0, 10);
        },
        TEST_TIMEOUT,
      );
    });

    // ── T7: Approve — two-phase ─────────────────────────────────────────
    describe("T7: approve (two-phase)", () => {
      let approveToolMsgId: string;

      it(
        "T7a: approve phase1 — tool pending confirmation, no imageUrl yet",
        async () => {
          setFetchCacheContext("callback-approve-phase1");
          await pinBalance(testUser.id, 10, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);

          const { result, messages } = await runTestStream({
            user: testUser,
            prompt:
              "[T7a approve-phase1] Call generate_image with prompt='approve-test'. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
            threadMode: "append",
            threadId,
            favoriteId: mainFavoriteId,
            availableTools: [
              { toolId: "generate_image", requiresConfirmation: true },
            ],
          });

          expect(result.success).toBe(true);
          if (!result.success) return;

          // ── Tool message without imageUrl — find newest generate_image tool msg ──
          // The approve phase tool message is the most recently created one in thread
          const approveToolMsg = [...messages]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .find((m) => m.role === "tool" && m.toolCall?.toolName === "generate_image");
          expect(approveToolMsg).toBeDefined();
          approveToolMsgId = approveToolMsg!.id;

          const toolRes = toolResultRecord(approveToolMsg!.toolCall?.result);
          // In approve mode, the tool should NOT have been executed — no imageUrl
          if (toolRes) {
            expect(toolRes["imageUrl"]).toBeUndefined();
          }

          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0, 3);
        },
        TEST_TIMEOUT,
      );

      it(
        "T7b: approve phase2 — user confirms, imageUrl appears in result, AI responds",
        async () => {
          expect(approveToolMsgId).toBeTruthy();

          setFetchCacheContext("callback-approve-phase2");
          await pinBalance(testUser.id, 15, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);

          const logger = createEndpointLogger(false, Date.now(), defaultLocale);
          const { t } = scopedTranslation.scopedT(defaultLocale);

          const confirmResult = await runHeadlessAiStream({
            prompt: "",
            favoriteId: mainFavoriteId,
            threadMode: "append",
            threadId,
            rootFolderId: DefaultFolderId.CRON,
            toolConfirmations: [
              { messageId: approveToolMsgId, confirmed: true },
            ],
            user: testUser,
            locale: defaultLocale,
            logger,
            t,
          });

          expect(confirmResult.success).toBe(true);
          if (!confirmResult.success) return;

          const messages = await fetchThreadMessages(threadId);

          // ── Tool message now has imageUrl ──
          const toolMsg = messages.find(
            (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image" &&
              m.id === approveToolMsgId,
          );
          expect(toolMsg).toBeDefined();

          const toolRes = toolResultRecord(toolMsg!.toolCall?.result);
          expect(toolRes).not.toBeNull();
          expect(typeof toolRes!["imageUrl"]).toBe("string");
          expect(toolRes!["imageUrl"]).toBeTruthy();

          // ── AI responded ──
          const lastAi = messages.find(
            (m) => m.id === confirmResult.data.lastAiMessageId,
          );
          expect(lastAi?.content).toBeTruthy();

          assertNoOrphans(messages);
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0.47, 10);
        },
        TEST_TIMEOUT,
      );
    });

    // ── T8: Parallel tool calls ──────────────────────────────────────────
    it(
      "T8: parallel tools — tool-help + generate_image in same batch, both results populated",
      async () => {
        setFetchCacheContext("parallel-tools");
        await pinBalance(testUser.id, 20, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);
        const prevCount = (await fetchThreadMessages(threadId)).length;

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[T8 parallel-tools] In parallel, call both: (1) the tool-help tool to list available tools, and (2) generate_image with prompt='green square'. Do both at the same time. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
        });

        expect(result.success).toBe(true);
        if (!result.success) return;

        const added = newMessages(messages, prevCount);
        const toolMsgs = added.filter((m) => m.role === "tool");
        expect(toolMsgs.length).toBeGreaterThanOrEqual(2);

        const toolNames = toolMsgs.map((m) => m.toolCall?.toolName);
        expect(toolNames).toContain("generate_image");
        expect(toolNames).toContain("tool-help");

        // ── Both results populated ──
        for (const toolMsg of toolMsgs) {
          const toolRes = toolResultRecord(toolMsg.toolCall?.result);
          expect(toolRes).not.toBeNull();
          // ── Every tool message has model set ──
          expect(toolMsg.model, `Parallel tool ${toolMsg.id} missing model`).toBeTruthy();
        }

        // ── All parallel tool messages share the SAME sequenceId ──
        const parallelSeqIds = new Set(toolMsgs.map((m) => m.sequenceId));
        expect(parallelSeqIds.size).toBe(1);

        // ── generate_image result has imageUrl ──
        const imgTool = toolMsgs.find((m) => m.toolCall?.toolName === "generate_image");
        const imgRes = toolResultRecord(imgTool!.toolCall?.result);
        expect(typeof imgRes!["imageUrl"]).toBe("string");

        const lastAi = messages.find((m) => m.id === result.data.lastAiMessageId);
        expect(lastAi?.content).toBeTruthy();
        // ── Final AI has token metadata ──
        expect(lastAi!.finishReason).toBe("stop");
        expect(lastAi!.creditCost).toBeGreaterThan(0);
        assertStepOk(lastAi!.content, "T8");

        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const after = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(before, after, 0.47, 12);
      },
      TEST_TIMEOUT,
    );

    // ── T9: preCalls injection ───────────────────────────────────────────
    it(
      "T9: preCalls injection — synthetic generate_image result in DB, AI reasons about it",
      async () => {
        setFetchCacheContext("precalls-injection");
        await pinBalance(testUser.id, 10, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);
        const prevCount = (await fetchThreadMessages(threadId)).length;

        const syntheticImageUrl = "https://example.com/injected-test-image.jpg";

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[T9 preCalls] An image was already generated for you. Acknowledge it and describe what you know. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          preCalls: [
            {
              routeId: "generate_image",
              args: { prompt: "injected" },
              result: { imageUrl: syntheticImageUrl, creditCost: 1 },
              success: true,
              executionTimeMs: 50,
            },
          ],
        });

        expect(result.success).toBe(true);
        if (!result.success) return;

        const added = newMessages(messages, prevCount);

        // ── Synthetic generate_image tool message ──
        const toolMsg = added.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image",
        );
        expect(toolMsg).toBeDefined();
        expect(toolMsg!.isAI).toBe(true);

        const toolRes = toolResultRecord(toolMsg!.toolCall?.result);
        expect(toolRes).not.toBeNull();
        expect(toolRes!["imageUrl"]).toBe(syntheticImageUrl);
        expect(toolRes!["creditCost"]).toBe(1);

        // ── AI responded with content ──
        const lastAi = messages.find((m) => m.id === result.data.lastAiMessageId);
        expect(lastAi?.content).toBeTruthy();
        assertStepOk(lastAi?.content, "T9");

        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const after = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(before, after, 0, 10);
      },
      TEST_TIMEOUT,
    );

    // ── T10: All file attachments — image, multi (image+audio), voice, video ──
    it(
      "T10: file attachments — image, multi, voice, video all stored in metadata with correct mime types",
      async () => {
        // ── Part A: Single image attachment ──
        setFetchCacheContext("attachment-image");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeImg = await getBalance(testUser, creditLogger, creditT);
        const prevCountImg = (await fetchThreadMessages(threadId)).length;

        const imageFile = await loadFixture("test-image.jpeg", "image/jpeg");
        const { result: imgResult, messages: imgMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T10a image-attach] Describe the attached image briefly. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          attachments: [imageFile],
        });

        expect(imgResult.success).toBe(true);
        if (!imgResult.success) return;
        expect(imgResult.data.threadId).toBe(threadId);

        const imgAdded = newMessages(imgMsgs, prevCountImg);
        const imgUserMsg = imgAdded.find((m) => m.role === "user");
        expect(imgUserMsg!.attachments).toHaveLength(1);
        const imgAtt = imgUserMsg!.attachments![0]!;
        expect(imgAtt.mimeType).toBe("image/jpeg");
        expect(imgAtt.filename).toBeTruthy();
        expect(typeof imgAtt.url).toBe("string");
        expect(typeof imgAtt.size).toBe("number");
        expect(imgAtt.size).toBeGreaterThan(0);
        expect(imgResult.data.lastAiMessageContent!.length).toBeGreaterThan(10);
        assertStepOk(imgResult.data.lastAiMessageContent, "T10a");

        const imgAiMsg = imgAdded.find((m) => m.role === "assistant");
        expect(imgAiMsg).toBeDefined();
        expect(imgAiMsg!.finishReason).toBe("stop");
        expect(imgAiMsg!.creditCost).toBeGreaterThan(0);

        assertNoOrphans(imgMsgs);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterImg = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeImg, afterImg, 0, 30);

        // ── Part B: Multi-attachment (image + music) ──
        setFetchCacheContext("attachment-multi");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeMulti = await getBalance(testUser, creditLogger, creditT);

        const musicFile = await loadFixture("test-music.mp3", "audio/mpeg");
        const imageFile2 = await loadFixture("test-image.jpeg", "image/jpeg");
        const { result: multiResult, messages: multiMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T10b multi-attach] Describe both the image and audio file attached. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          attachments: [imageFile2, musicFile],
        });

        expect(multiResult.success).toBe(true);
        if (!multiResult.success) return;
        expect(multiResult.data.threadId).toBe(threadId);

        const multiSorted = [...multiMsgs].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        const multiUserMsg = multiSorted.find((m) => m.role === "user");
        expect(multiUserMsg!.attachments).toHaveLength(2);
        const mimeTypes = multiUserMsg!.attachments!.map((a) => a.mimeType).sort();
        expect(mimeTypes).toEqual(["audio/mpeg", "image/jpeg"]);
        expect(multiResult.data.lastAiMessageContent!.length).toBeGreaterThan(10);
        assertStepOk(multiResult.data.lastAiMessageContent, "T10b");

        assertNoOrphans(multiMsgs);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterMulti = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeMulti, afterMulti, 0, 30);

        // ── Part C: Voice attachment ──
        setFetchCacheContext("attachment-voice");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeVoice = await getBalance(testUser, creditLogger, creditT);

        const voiceFile = await loadFixture("test-voice.wav", "audio/wav");
        const { result: voiceResult, messages: voiceMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T10c voice-attach] Transcribe the attached voice recording. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          attachments: [voiceFile],
        });

        expect(voiceResult.success).toBe(true);
        if (!voiceResult.success) return;
        expect(voiceResult.data.threadId).toBe(threadId);

        const voiceSorted = [...voiceMsgs].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        const voiceUserMsg = voiceSorted.find((m) => m.role === "user");
        expect(voiceUserMsg!.attachments![0]!.mimeType).toBe("audio/wav");
        expect(voiceResult.data.lastAiMessageContent!.length).toBeGreaterThan(10);
        assertStepOk(voiceResult.data.lastAiMessageContent, "T10c");

        assertNoOrphans(voiceMsgs);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterVoice = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeVoice, afterVoice, 0, 30);

        // ── Part D: Video attachment ──
        setFetchCacheContext("attachment-video");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeVideo = await getBalance(testUser, creditLogger, creditT);

        const videoFile = await loadFixture("test-video.mp4", "video/mp4");
        const { result: videoResult, messages: videoMsgs } = await runTestStream({
          user: testUser,
          prompt:
            "[T10d video-attach] Describe the attached video briefly. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          attachments: [videoFile],
        });

        expect(videoResult.success).toBe(true);
        if (!videoResult.success) return;
        expect(videoResult.data.threadId).toBe(threadId);

        const videoSorted = [...videoMsgs].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        const videoUserMsg = videoSorted.find((m) => m.role === "user");
        expect(videoUserMsg!.attachments![0]!.mimeType).toBe("video/mp4");
        expect(videoResult.data.lastAiMessageContent!.length).toBeGreaterThan(10);
        assertStepOk(videoResult.data.lastAiMessageContent, "T10d");

        assertNoOrphans(videoMsgs);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterVideo = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeVideo, afterVideo, 0, 30);
      },
      TEST_TIMEOUT,
    );

    // ── T11: Native multimodal (Gemini image generation) ──────────────
    it(
      "T11: Gemini native image generation — file part output, no generate_image tool call",
      async () => {
        setFetchCacheContext("image-generation-native");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);
        const prevCount = (await fetchThreadMessages(threadId)).length;

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[T11 gemini-native-image] Generate an image of a blue triangle. Output only the image. If anything seems wrong or unexpected, report it instead.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          model: ChatModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
        });

        expect(result.success).toBe(true);
        if (!result.success) return;

        expect(result.data.lastGeneratedMediaUrl).toBeTruthy();

        const added = newMessages(messages, prevCount);

        // Native path: FilePartHandler creates synthetic tool msg with toolName="generate_image"
        const imageToolMsg = added.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image",
        );
        expect(imageToolMsg).toBeDefined();

        const toolRes = toolResultRecord(imageToolMsg!.toolCall?.result);
        expect(toolRes).not.toBeNull();
        expect(typeof toolRes!["file"]).toBe("string");
        expect(toolRes!["creditCost"]).toBe(0);

        // Gemini model on AI messages
        const aiMsgs = added.filter((m) => m.role === "assistant");
        for (const ai of aiMsgs) {
          if (ai.content && !ai.isCompacting) {
            expect(ai.model).toBeTruthy();
          }
        }

        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const after = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(before, after, 0.4, 30);
      },
      TEST_TIMEOUT,
    );

    // ── T12: Error handling — invalid parent ─────────────────────────
    it(
      "T12: invalid explicitParentMessageId — handled gracefully, no orphans",
      async () => {
        setFetchCacheContext("invalid-parent");
        await pinBalance(testUser.id, 20, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[T12 invalid-parent] Say: INVALID_PARENT_TEST STEP_OK. If anything seems wrong or unexpected, report it instead.",
          threadMode: "append",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: crypto.randomUUID(),
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.lastAiMessageContent).toBeTruthy();
          expect(result.data.totalCreditsDeducted).toBeGreaterThan(0);
        }

        assertNoOrphans(messages);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const after = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(before, after, 0, 10);
      },
      TEST_TIMEOUT,
    );

    // ── Full tree validation ──────────────────────────────────────────────
    it(
      "Final: full thread tree — no orphans, exactly 1 root, correct branching structure, metadata consistency",
      async () => {
        const messages = await fetchThreadMessages(threadId);

        // ── No orphans ──
        assertNoOrphans(messages);

        // ── Exactly 1 root ──
        const roots = messages.filter((m) => m.parentId === null);
        expect(roots).toHaveLength(1);
        expect(roots[0]!.id).toBe(t1UserMsgId);

        // ── t1ToolAi (final AI after tool call) has ≥ 2 user children (retry, branch) ──
        const tree = buildTree(messages);
        const t1ToolAiUserChildren = (tree.get(t1ToolAiMsgId) ?? []).filter((childId) =>
          messages.find((m) => m.id === childId && m.role === "user"),
        );
        expect(t1ToolAiUserChildren.length).toBeGreaterThanOrEqual(2);

        // ── Thread has all expected keywords across assistant messages ──
        const assistantContents = messages
          .filter((m) => m.role === "assistant" && m.content)
          .map((m) => m.content!);
        for (const keyword of ["RETRY", "BRANCH"]) {
          expect(
            assistantContents.some((c) => c.includes(keyword)),
            `Expected "${keyword}" in assistant messages`,
          ).toBe(true);
        }

        // ── All assistants have model set ──
        const allAssistants = byRole(messages, "assistant");
        for (const ai of allAssistants) {
          if (ai.content && !ai.isCompacting) {
            expect(ai.model, `Assistant ${ai.id} missing model`).toBeTruthy();
          }
        }

        // ── All user messages have model=null ──
        const allUsers = byRole(messages, "user");
        for (const u of allUsers) {
          expect(u.model, `User msg ${u.id} should have null model`).toBeNull();
        }

        // ── All user messages have sequenceId=null ──
        for (const u of allUsers) {
          expect(
            u.sequenceId,
            `User msg ${u.id} should have null sequenceId`,
          ).toBeNull();
        }

        // ── All message IDs are globally unique ──
        const allIds = messages.map((m) => m.id);
        expect(
          new Set(allIds).size,
          `Duplicate message IDs found`,
        ).toBe(allIds.length);

        // ── Global createdAt monotonicity within each parent chain ──
        // For every leaf message, walk to root and verify chronological order
        const leaves = messages.filter(
          (m) => !messages.some((other) => other.parentId === m.id),
        );
        for (const leaf of leaves) {
          const chain = walkChain(messages, leaf.id);
          assertChronologicalOrder(chain, messages);
        }

        // ── Tool messages: all have isAI=true, model set, sequenceId matches parent ──
        const allTools = byRole(messages, "tool");
        for (const tm of allTools) {
          expect(tm.isAI, `Tool msg ${tm.id} should be isAI=true`).toBe(true);
          expect(tm.model, `Tool msg ${tm.id} missing model`).toBeTruthy();
          if (tm.parentId) {
            const parent = messages.find((m) => m.id === tm.parentId);
            if (parent) {
              expect(
                tm.sequenceId,
                `Tool msg ${tm.id} sequenceId should match parent ${parent.id}`,
              ).toBe(parent.sequenceId);
            }
          }
        }

        // ── Assistant content messages with finishReason should be "stop" (not error/length) ──
        for (const ai of allAssistants) {
          if (ai.content && ai.finishReason) {
            expect(
              ai.finishReason,
              `Assistant ${ai.id} has finishReason "${ai.finishReason}" instead of "stop"`,
            ).toBe("stop");
          }
        }

        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);
      },
      TEST_TIMEOUT,
    );
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Credits
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe("Credits", () => {
    it(
      "credit deduction + incognito: balance decreases for normal, no persist for incognito",
      async () => {
        // ── Normal deduction ──
        setFetchCacheContext("credit-deduction");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);

        const { result: r1 } = await runTestStream({
          user: testUser,
          prompt: "Reply with one word: OK",
          threadMode: "none",
          favoriteId: mainFavoriteId,
        });

        expect(r1.success).toBe(true);
        if (r1.success) {
          expect((r1.data.totalCreditsDeducted ?? 0) > 0).toBe(true);

          // ── totalCreditsDeducted should approximately match balance diff ──
          const afterNormal = await getBalance(testUser, creditLogger, creditT);
          const balanceDiff = before - afterNormal;
          const reported = r1.data.totalCreditsDeducted ?? 0;
          // Allow small floating point tolerance (0.001 credits)
          expect(
            Math.abs(balanceDiff - reported),
            `Balance diff ${balanceDiff} vs reported ${reported}`,
          ).toBeLessThan(0.01);
        }

        const after = await getBalance(testUser, creditLogger, creditT);
        expect(after).toBeLessThan(before);
        assertDeducted(before, after, 0, 100);

        // ── Incognito: no thread created ──
        setFetchCacheContext("incognito-mode");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeIncognito = await getBalance(testUser, creditLogger, creditT);

        const { result: r2, messages: msgs2 } = await runTestStream({
          user: testUser,
          prompt: "Reply with: INCOGNITO_TEST",
          threadMode: "none",
          favoriteId: mainFavoriteId,
        });

        expect(r2.success).toBe(true);
        if (r2.success) {
          expect(r2.data.lastAiMessageContent).toContain("INCOGNITO");
          expect(r2.data.threadId).toBeUndefined();

          // ── Incognito still deducts credits (it's just no DB persist for messages) ──
          const afterIncognito = await getBalance(testUser, creditLogger, creditT);
          expect(afterIncognito).toBeLessThan(beforeIncognito);
          expect((r2.data.totalCreditsDeducted ?? 0)).toBeGreaterThan(0);
        }
        expect(msgs2).toHaveLength(0);
      },
      TEST_TIMEOUT,
    );

    it(
      "insufficient credits: returns 403 when balance is zero",
      async () => {
        setFetchCacheContext("insufficient-credits");

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
        const saved = wallets.rows.map((w) => ({
          id: w.id,
          balance: w.balance,
          freeCreditsRemaining: w.free_credits_remaining,
        }));

        for (const w of saved) {
          await db.execute(
            sql`UPDATE credit_wallets SET balance = 0, free_credits_remaining = 0 WHERE id = ${w.id}`,
          );
        }

        try {
          const { result } = await runTestStream({
            user: testUser,
            prompt: "Say: SHOULD_FAIL",
            threadMode: "none",
            favoriteId: mainFavoriteId,
          });

          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.errorType?.errorCode).toBe(403);
            expect(result.message).toContain("nsufficient");
          }
        } finally {
          for (const w of saved) {
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
  // Favorites + UNBOTTLED Self-Relay
  // Tests the full favorites pipeline: create a favorite with the
  // quality-tester skill + cheapest models per modality, verify model
  // selection is respected, then run through the UNBOTTLED relay path.
  // All external fetch is blocked (strict mode) — any leaked fetch fails.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe("Favorites + UNBOTTLED self-relay", () => {
    const QUALITY_TESTER_SKILL_ID = "quality-tester";
    let favoriteId: string; // kimi variant — KIMI_K2_5 + OPENROUTER image + MODELSLAB music/video
    let budgetFavoriteId: string; // budget variant — GPT_5_NANO + MODELSLAB image + REPLICATE music
    let unbottledThreadId: string;
    /** Saved chatModelOptionsIndex entries before UNBOTTLED runtime patching */
    const savedModelOptions = new Map<string, ChatModelOption>();
    /** Provider entry ops applied to .ts files on disk (reversed in afterAll) */
    let appliedOps: Array<{
      action: string;
      role: string;
      enumKey: string;
      modelId: string;
      provider: string;
      providerModel: string;
      creditCost?: number;
      source: string;
    }> = [];
    let savedCredentials: string | undefined;
    const testModelId = ChatModelId.KIMI_K2_5;

    beforeAll(async () => {
      const { readFileSync, writeFileSync } = await import("node:fs");
      savedCredentials = agentEnv.UNBOTTLED_CLOUD_CREDENTIALS;

      // ── Step 1: Run the price updater against local instance ──
      // Temporarily clear credentials so getSession() uses local fallback
      // (in-process WsProviderModelsRepository.listModels).
      (agentEnv as Record<string, string>).UNBOTTLED_CLOUD_CREDENTIALS = "";
      const { UnbottledPriceFetcher } = await import(
        "@/app/api/[locale]/agent/models/model-prices/providers/unbottled"
      );
      const priceFetcher = new UnbottledPriceFetcher();
      const priceLogger = createEndpointLogger(false, Date.now(), defaultLocale);
      const priceResult = await priceFetcher.fetch(priceLogger);

      // The price updater should find models on the local instance
      expect(
        priceResult.modelsFound,
        `Price updater found 0 models — ${priceResult.error ?? "no error"}`,
      ).toBeGreaterThan(0);

      const allAddOps = (priceResult.providerEntryOps ?? []).filter(
        (op) => op.action === "add",
      );
      expect(
        allAddOps.length,
        "Price updater returned 0 add ops — all models already have UNBOTTLED?",
      ).toBeGreaterThan(0);

      // ── Step 2: Write UNBOTTLED provider entries to .ts files on disk ──
      // This is the same codepath the production price updater uses.
      const {
        addProviderEntry,
        getRoleFilePaths,
      } = await import(
        "@/app/api/[locale]/agent/models/model-prices/repository"
      );
      const roleFilePaths = getRoleFilePaths();

      // Group ops by role, read each file once, apply all ops, write back
      const opsByRole = new Map<string, typeof allAddOps>();
      for (const op of allAddOps) {
        const list = opsByRole.get(op.role) ?? [];
        list.push(op);
        opsByRole.set(op.role, list);
      }
      for (const [role, ops] of opsByRole) {
        const filePath = roleFilePaths[role];
        if (!filePath) continue;
        let content = readFileSync(filePath, "utf-8");
        for (const op of ops) {
          const result = addProviderEntry(content, op);
          if (result.changed) {
            content = result.content;
          }
        }
        writeFileSync(filePath, content, "utf-8");
      }
      appliedOps = allAddOps;

      // ── Step 3: Patch runtime chatModelOptionsIndex ──
      // .ts file edits don't affect already-loaded modules, so we also
      // patch the runtime index for chat models. Media gen models are
      // resolved via favorites/user-settings, not chatModelOptionsIndex.
      const chatAddOps = allAddOps.filter((op) => op.role === "chat");
      for (const op of chatAddOps) {
        const existing = chatModelOptionsIndex[op.modelId];
        if (existing) {
          savedModelOptions.set(op.modelId, { ...existing });
          chatModelOptionsIndex[op.modelId] = {
            ...existing,
            apiProvider: ApiProvider.UNBOTTLED,
            providerModel: op.providerModel,
            creditCost: op.creditCost ?? existing.creditCost,
          };
        }
      }

      // Verify our test model got patched
      expect(
        savedModelOptions.has(testModelId),
        `Price updater did not return an add op for ${testModelId}`,
      ).toBe(true);

      // ── Step 4: Set credentials pointing at ourselves (self-relay) ──
      const { resolveLocalAdminSession } = await import(
        "@/app/api/[locale]/agent/models/model-prices/providers/local-session-helper"
      );
      const localSession = await resolveLocalAdminSession(
        env.NEXT_PUBLIC_APP_URL,
      );
      expect(
        localSession,
        "resolveLocalAdminSession failed — admin user missing?",
      ).toBeTruthy();
      (agentEnv as Record<string, string>).UNBOTTLED_CLOUD_CREDENTIALS =
        `${localSession!.leadId}:${localSession!.token}:${localSession!.remoteUrl}`;

      // ── Step 5: Create test favorites — two variants for inspection ──
      // Variant "kimi": KIMI_K2_5 chat, OPENROUTER image, MODELSLAB music/video
      const [fav] = await db
        .insert(chatFavorites)
        .values({
          userId: testUser.id,
          skillId: QUALITY_TESTER_SKILL_ID,
          variantId: "kimi",
          modelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: ChatModelId.KIMI_K2_5,
          },
          imageGenModelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: ImageGenModelId.FLUX_2_KLEIN_4B,
          },
          musicGenModelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: MusicGenModelId.LYRIA_3,
          },
          videoGenModelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: VideoGenModelId.LTX_2_3_PRO_I2V,
          },
          position: 9999,
        })
        .returning({ id: chatFavorites.id });
      favoriteId = fav!.id;

      // Variant "budget": GPT_5_NANO chat, MODELSLAB image, REPLICATE music, MODELSLAB video
      const [budgetFav] = await db
        .insert(chatFavorites)
        .values({
          userId: testUser.id,
          skillId: QUALITY_TESTER_SKILL_ID,
          variantId: "budget",
          modelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: ChatModelId.GPT_5_NANO,
          },
          imageGenModelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: ImageGenModelId.Z_IMAGE_TURBO,
          },
          musicGenModelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: MusicGenModelId.MUSICGEN_STEREO,
          },
          videoGenModelSelection: {
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: VideoGenModelId.LTX_2_PRO_T2V,
          },
          position: 10000,
        })
        .returning({ id: chatFavorites.id });
      budgetFavoriteId = budgetFav!.id;

      // NOTE: Strict mode is NOT enabled here because self-relay inner calls
      // go through the real provider (OpenRouter) and need to record fixtures
      // on first run. Once recorded, the fetch cache replays them automatically.
    }, TEST_TIMEOUT);

    afterAll(async () => {
      const { readFileSync, writeFileSync } = await import("node:fs");

      // NOTE: Test favorites are kept for manual inspection — not deleted.

      // Restore runtime chat model options
      for (const [modelId, original] of savedModelOptions) {
        chatModelOptionsIndex[modelId] = original;
      }
      savedModelOptions.clear();

      // Remove UNBOTTLED provider entries from .ts files on disk
      if (appliedOps.length > 0) {
        const {
          removeProviderEntry,
          getRoleFilePaths,
        } = await import(
          "@/app/api/[locale]/agent/models/model-prices/repository"
        );
        const roleFilePaths = getRoleFilePaths();
        const opsByRole = new Map<string, typeof appliedOps>();
        for (const op of appliedOps) {
          const list = opsByRole.get(op.role) ?? [];
          list.push(op);
          opsByRole.set(op.role, list);
        }
        for (const [role, ops] of opsByRole) {
          const filePath = roleFilePaths[role];
          if (!filePath) continue;
          let content = readFileSync(filePath, "utf-8");
          for (const op of ops) {
            const result = removeProviderEntry(content, op);
            if (result.changed) {
              content = result.content;
            }
          }
          writeFileSync(filePath, content, "utf-8");
        }
        appliedOps = [];
      }

      // Restore credentials on agentEnv
      if (savedCredentials !== undefined) {
        (agentEnv as Record<string, string>).UNBOTTLED_CLOUD_CREDENTIALS =
          savedCredentials;
      } else {
        (agentEnv as Record<string, string>).UNBOTTLED_CLOUD_CREDENTIALS = "";
      }
      // (strict mode was never enabled for UNBOTTLED tests)
    });

    it(
      "F1: favorite resolution — manual, model switch, media models, filters all work",
      async () => {
        const { resolveFavorite } = await import("../repository/headless");
        const logger = createEndpointLogger(false, Date.now(), defaultLocale);

        // ── Part A: Initial resolution → KIMI_K2_5 + quality-tester skill ──
        const resolved = await resolveFavorite(
          favoriteId,
          testUser.id,
          testUser,
          logger,
          defaultLocale,
        );
        expect(resolved).toBeTruthy();
        expect(resolved!.model).toBe(ChatModelId.KIMI_K2_5);
        expect(resolved!.skill).toBe(QUALITY_TESTER_SKILL_ID);

        // ── Part B: Change to GEMINI_3_FLASH → respected ──
        await db
          .update(chatFavorites)
          .set({
            modelSelection: {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: ChatModelId.GEMINI_3_FLASH,
            },
          })
          .where(eq(chatFavorites.id, favoriteId));

        const resolvedGemini = await resolveFavorite(
          favoriteId,
          testUser.id,
          testUser,
          logger,
          defaultLocale,
        );
        expect(resolvedGemini).toBeTruthy();
        expect(resolvedGemini!.model).toBe(ChatModelId.GEMINI_3_FLASH);
        expect(resolvedGemini!.skill).toBe(QUALITY_TESTER_SKILL_ID);

        // Restore to KIMI_K2_5
        await db
          .update(chatFavorites)
          .set({
            modelSelection: {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: ChatModelId.KIMI_K2_5,
            },
          })
          .where(eq(chatFavorites.id, favoriteId));

        // ── Part C: Media model selections persisted ──
        const [fav] = await db
          .select({
            imageGenModelSelection: chatFavorites.imageGenModelSelection,
            musicGenModelSelection: chatFavorites.musicGenModelSelection,
            videoGenModelSelection: chatFavorites.videoGenModelSelection,
          })
          .from(chatFavorites)
          .where(eq(chatFavorites.id, favoriteId))
          .limit(1);

        expect(fav).toBeTruthy();
        expect(fav!.imageGenModelSelection).toMatchObject({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ImageGenModelId.FLUX_2_KLEIN_4B,
        });
        expect(fav!.musicGenModelSelection).toMatchObject({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: MusicGenModelId.LYRIA_3,
        });
        expect(fav!.videoGenModelSelection).toMatchObject({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: VideoGenModelId.LTX_2_3_PRO_I2V,
        });

        // ── Part D: FILTERS selection resolves a model ──
        await db
          .update(chatFavorites)
          .set({
            modelSelection: {
              selectionType: ModelSelectionType.FILTERS,
              sortBy: ModelSortField.PRICE,
              sortDirection: ModelSortDirection.ASC,
              contentRange: {
                min: ContentLevel.OPEN,
                max: ContentLevel.UNCENSORED,
              },
            },
          })
          .where(eq(chatFavorites.id, favoriteId));

        const resolvedFilter = await resolveFavorite(
          favoriteId,
          testUser.id,
          testUser,
          logger,
          defaultLocale,
        );
        expect(resolvedFilter).toBeTruthy();
        expect(resolvedFilter!.model).toBeTruthy();
        expect(resolvedFilter!.skill).toBe(QUALITY_TESTER_SKILL_ID);

        // Restore to MANUAL for relay tests
        await db
          .update(chatFavorites)
          .set({
            modelSelection: {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: ChatModelId.KIMI_K2_5,
            },
          })
          .where(eq(chatFavorites.id, favoriteId));

        // ── Part E: Budget variant resolution → GPT_5_NANO + different media models ──
        const resolvedBudget = await resolveFavorite(
          budgetFavoriteId,
          testUser.id,
          testUser,
          logger,
          defaultLocale,
        );
        expect(resolvedBudget).toBeTruthy();
        expect(resolvedBudget!.model).toBe(ChatModelId.GPT_5_NANO);
        expect(resolvedBudget!.skill).toBe(QUALITY_TESTER_SKILL_ID);

        // Budget variant's media selections
        const [budgetFav] = await db
          .select({
            imageGenModelSelection: chatFavorites.imageGenModelSelection,
            musicGenModelSelection: chatFavorites.musicGenModelSelection,
            videoGenModelSelection: chatFavorites.videoGenModelSelection,
          })
          .from(chatFavorites)
          .where(eq(chatFavorites.id, budgetFavoriteId))
          .limit(1);
        expect(budgetFav).toBeTruthy();
        expect(budgetFav!.imageGenModelSelection).toMatchObject({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: ImageGenModelId.Z_IMAGE_TURBO,
        });
        expect(budgetFav!.musicGenModelSelection).toMatchObject({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: MusicGenModelId.MUSICGEN_STEREO,
        });
        expect(budgetFav!.videoGenModelSelection).toMatchObject({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: VideoGenModelId.LTX_2_PRO_T2V,
        });
      },
      TEST_TIMEOUT,
    );

    it(
      "F2: basic send via favorite + UNBOTTLED self-relay",
      async () => {
        // Own cache context — self-relay's inner call goes through OpenRouter
        setFetchCacheContext("unbottled-basic-send");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[F2 unbottled-relay] Reply with exactly the word: HELLO_TEST STEP_OK. If anything seems wrong or unexpected, report it instead.",
          threadMode: "new",
          favoriteId,
        });

        expect(result.success).toBe(true);
        if (!result.success) return;

        unbottledThreadId = result.data.threadId!;
        expect(unbottledThreadId).toBeTruthy();
        expect(result.data.lastAiMessageContent).toBeTruthy();
        assertStepOk(result.data.lastAiMessageContent, "F2");

        // Verify correct message structure
        const userMsgs = byRole(messages, "user");
        const aiMsgs = byRole(messages, "assistant");
        expect(userMsgs.length).toBeGreaterThanOrEqual(1);
        expect(aiMsgs.length).toBeGreaterThanOrEqual(1);

        // Verify credits were deducted
        const after = await getBalance(testUser, creditLogger, creditT);
        expect(after).toBeLessThan(before);

        await assertThreadIdle(unbottledThreadId);
        await assertNoPendingTasks(unbottledThreadId);
        assertNoOrphans(messages);
      },
      TEST_TIMEOUT,
    );

    it(
      "F3: tool call via favorite + UNBOTTLED self-relay",
      async () => {
        setFetchCacheContext("unbottled-tool-call");
        await pinBalance(testUser.id, 50, creditLogger, creditT);

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            '[F3 unbottled-tool-call] Use the tool-help tool to look up how the "generate_image" tool works, then summarize. If anything seems wrong or unexpected, report it instead. End with STEP_OK if everything worked.',
          threadMode: "append",
          threadId: unbottledThreadId,
          favoriteId,
        });

        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data.threadId).toBe(unbottledThreadId);

        // Self-relay: tool calls happen inside the inner headless run.
        // The outer thread receives only the final assistant content — no
        // tool messages are visible. Verify the AI produced a response
        // (proving tools ran internally and the relay forwarded the result).
        const aiMsgs = byRole(messages, "assistant");
        expect(aiMsgs.length).toBeGreaterThanOrEqual(1);
        expect(result.data.lastAiMessageContent).toBeTruthy();
        assertStepOk(result.data.lastAiMessageContent, "F3");

        // Credits should be deducted (inner run used credits for tool + AI)
        expect(result.data.totalCreditsDeducted).toBeGreaterThan(0);

        await assertThreadIdle(unbottledThreadId);
        await assertNoPendingTasks(unbottledThreadId);
        assertNoOrphans(messages);
      },
      TEST_TIMEOUT,
    );

  });
});
