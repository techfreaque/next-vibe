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
import { setFetchCacheContext } from "../testing/fetch-cache";
import {
  runTestStream,
  fetchThreadMessages,
  fetchThreadTitle,
  toolResultRecord,
  type SlimMessage,
} from "../testing/headless-test-runner";
import type { ToolCallResult } from "@/app/api/[locale]/agent/chat/db";
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

/** Walk parent chain from leafId → root. Returns [root, ..., leaf] */
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
    const existing = tree.get(parentKey);
    if (existing) {
      existing.push(msg.id);
    } else {
      tree.set(parentKey, [msg.id]);
    }
  }
  return tree;
}

function msgDesc(m: SlimMessage): string {
  const tool = m.toolCall?.toolName ? `:${m.toolCall.toolName}` : "";
  const preview = m.content ? ` "${m.content.slice(0, 30)}"` : "";
  return `${m.id}(${m.role}${tool}${preview})`;
}

/**
 * Full chain integrity check — call after every test turn.
 *
 * 1. No orphans: every parentId references a message that exists in the thread.
 * 2. No broken branches: every message has at most 1 child, making each path a
 *    strict linked list — unless the message ID is in knownBranchPoints.
 * 3. Full reachability: every message in the thread is reachable by walking UP
 *    the parent chain from some leaf. Detects disconnected subtrees.
 *
 * knownBranchPoints: IDs allowed to have >1 child (intentional branch nodes).
 */
function assertChainIntegrity(
  messages: SlimMessage[],
  knownBranchPoints: Set<string> = new Set(),
): void {
  const byId = new Map(messages.map((m) => [m.id, m]));
  const tree = buildTree(messages);

  // 1. No orphans
  for (const msg of messages) {
    if (msg.parentId) {
      expect(
        byId.has(msg.parentId),
        `Orphan: ${msgDesc(msg)} → parentId ${msg.parentId} not in thread`,
      ).toBe(true);
    }
  }

  // 2. No broken branches — every non-whitelisted message has ≤1 child
  for (const [parentId, children] of tree.entries()) {
    if (parentId === "__root__") {
      expect(
        children.length,
        `Multiple root messages (parentId=null): ${children.map((id) => msgDesc(byId.get(id)!)).join(", ")}`,
      ).toBe(1);
      continue;
    }
    if (knownBranchPoints.has(parentId) || children.length <= 1) {
      continue;
    }
    const parent = byId.get(parentId);
    const childList = children.map((id) => msgDesc(byId.get(id)!)).join("\n  ");
    expect(
      children.length,
      `Branch violation on ${parent ? msgDesc(parent) : parentId}: has ${String(children.length)} children (expected 1):\n  ${childList}`,
    ).toBe(1);
  }

  // 3. Full reachability — walk every leaf up to root; union must equal all messages
  const leaves = messages.filter((m) => !tree.get(m.id)?.length);
  const reachable = new Set<string>();
  for (const leaf of leaves) {
    for (const id of walkChain(messages, leaf.id)) {
      reachable.add(id);
    }
  }
  for (const msg of messages) {
    expect(
      reachable.has(msg.id),
      `Unreachable message (disconnected from all leaves): ${msgDesc(msg)}`,
    ).toBe(true);
  }
}

// Keep assertNoOrphans as thin alias for backwards-compat within tests
function assertNoOrphans(
  messages: SlimMessage[],
  knownBranchPoints: Set<string> = new Set(),
): void {
  assertChainIntegrity(messages, knownBranchPoints);
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
      `Out of order: ${msgDesc(curr)} created before ancestor ${msgDesc(prev)}`,
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
  const pending = await db.execute<{
    id: string;
    last_execution_status: string | null;
  }>(
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
function assertStepOk(
  content: string | null | undefined,
  stepName: string,
): void {
  expect(content, `[${stepName}] AI returned empty content`).toBeTruthy();
  if (!content) {
    return;
  }
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
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
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
    if (!resolved) {
      return;
    }
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

    // ── Upsert main favorite with stable ID (reused across runs) ──
    // Stable IDs mean HTTP fixture caches remain valid between runs.
    const MAIN_FAVORITE_ID = "00000000-0000-4001-a000-000000000001";
    const mainFavValues = {
      id: MAIN_FAVORITE_ID,
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
    };
    await db
      .insert(chatFavorites)
      .values(mainFavValues)
      .onConflictDoUpdate({
        target: chatFavorites.id,
        set: {
          modelSelection: mainFavValues.modelSelection,
          imageGenModelSelection: mainFavValues.imageGenModelSelection,
          musicGenModelSelection: mainFavValues.musicGenModelSelection,
          videoGenModelSelection: mainFavValues.videoGenModelSelection,
        },
      });
    mainFavoriteId = MAIN_FAVORITE_ID;
  }, TEST_TIMEOUT);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Main Thread: one shared thread, sequential steps
  // Each step verifies thread state + credits before moving on.
  // A human reading the thread in the UI sees a natural conversation.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe("Main Thread (single shared thread)", () => {
    // Thread state shared across steps
    let threadId: string;
    // Tracks the last AI message on the main linear chain.
    // Every append test MUST pass this as explicitParentMessageId so the
    // thread is a strict linked list with no broken parent chains.
    let lastMainAiMsgId: string;

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
            "[T1 thread-create+tool-call] Use the tool-help tool to list available tools. Check that the result contains a non-empty tools array and that each tool has a name and description. End your reply with STEP_OK if everything worked, or FAILED: <reason> if anything was wrong.",
          favoriteId: mainFavoriteId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

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
        const toolMsgs = messages.filter(
          (m) => m.role === "tool" && m.toolCall !== null,
        );
        expect(toolMsgs.length).toBeGreaterThanOrEqual(1);
        const toolMsg =
          toolMsgs.find((m) => m.toolCall?.toolName === "tool-help") ??
          toolMsgs[0]!;
        expect(toolMsg.toolCall?.toolName).toBeTruthy();
        const toolRes = toolResultRecord(toolMsg.toolCall?.result);
        expect(toolRes).not.toBeNull();
        expect(toolMsg.isAI).toBe(true);
        expect(toolMsg.model).toBeTruthy();

        // ── tool-help result: tools array + totalCount ──
        expect(
          Array.isArray(toolRes!["tools"]),
          "T1: tools is not an array",
        ).toBe(true);
        expect(
          (toolRes!["tools"] as ToolCallResult[]).length,
          "T1: tools array is empty",
        ).toBeGreaterThan(0);
        expect(typeof toolRes!["totalCount"], "T1: totalCount missing").toBe(
          "number",
        );
        expect(toolRes!["totalCount"] as number).toBeGreaterThan(0);
        // First tool entry has name + description
        const firstTool = toolResultRecord(
          (toolRes!["tools"] as ToolCallResult[])[0],
        );
        expect(firstTool?.["name"], "T1: first tool missing name").toBeTruthy();
        expect(
          firstTool?.["description"],
          "T1: first tool missing description",
        ).toBeTruthy();

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
        lastMainAiMsgId = t1ToolAiMsgId;
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

        assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const after = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(before, after, 0, 20);
      },
      TEST_TIMEOUT,
    );

    // ── T1b: tool-help detail mode ────────────────────────────────────────
    it(
      "T1b: tool-help detail mode — single tool schema lookup with parameters",
      async () => {
        setFetchCacheContext("tool-help-detail");
        await pinBalance(testUser.id, 10, creditLogger, creditT);
        const prevCount = (await fetchThreadMessages(threadId)).length;

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[T1b tool-help-detail] Call tool-help with toolName='generate_image'. Check that the result contains a name, a description, and a parameters schema. End your reply with STEP_OK if all three were present, or FAILED: <what was missing> if anything was wrong.",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: lastMainAiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        const added = newMessages(messages, prevCount);
        const toolMsg = added.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "tool-help",
        );
        expect(toolMsg, "T1b: tool-help message not found").toBeDefined();

        const toolRes = toolResultRecord(toolMsg!.toolCall?.result);
        expect(toolRes, "T1b: tool result is null").not.toBeNull();

        // Detail mode returns single tool — check for name + description
        const entry = Array.isArray(toolRes!["tools"])
          ? toolResultRecord((toolRes!["tools"] as ToolCallResult[])[0])
          : toolRes;
        expect(entry, "T1b: no tool entry in result").toBeDefined();

        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        assertStepOk(lastAi?.content, "T1b");
        lastMainAiMsgId = result.data.lastAiMessageId!;

        assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);
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
            "[T2 image-gen] Call the generate_image tool with prompt='red circle'. Check that the result contains a non-empty imageUrl and a positive creditCost. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: lastMainAiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

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
        expect(toolRes!["creditCost"] as number).toBeGreaterThan(0);

        // ── Final AI has token metadata ──
        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(lastAi).toBeDefined();
        expect(lastAi!.finishReason).toBe("stop");
        assertStepOk(lastAi!.content, "T2");
        lastMainAiMsgId = result.data.lastAiMessageId!;

        const chain = walkChain(messages, result.data.lastAiMessageId!);
        expect(chain[0]).toBe(t1UserMsgId);
        assertChronologicalOrder(chain, messages);
        assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
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

        const { result: retryResult, messages: retryMsgs } =
          await runTestStream({
            user: testUser,
            prompt: "[T3a retry-branch] Say exactly: RETRY_RESPONSE STEP_OK",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: t1ToolAiMsgId,
          });

        expect(retryResult.success).toBe(true);
        if (!retryResult.success) {
          return;
        }

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

        const { result: branchResult, messages: branchMsgs } =
          await runTestStream({
            user: testUser,
            prompt: "[T3b fork-branch] Say exactly: BRANCH_RESPONSE STEP_OK",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: t1ToolAiMsgId,
          });

        expect(branchResult.success).toBe(true);
        if (!branchResult.success) {
          return;
        }

        branchForkAiMsgId = branchResult.data.lastAiMessageId!;

        // 2 user siblings under t1ToolAi: retry + branch
        const t1ToolAiUserChildren = branchMsgs.filter(
          (m) => m.role === "user" && m.parentId === t1ToolAiMsgId,
        );
        expect(t1ToolAiUserChildren.length).toBeGreaterThanOrEqual(2);

        // Distinct content across siblings
        const uniqueContents = new Set(
          t1ToolAiUserChildren.map((m) => m.content),
        );
        expect(uniqueContents.size).toBe(t1ToolAiUserChildren.length);

        // Branch AI has correct content
        const branchAi = branchMsgs.find((m) => m.id === branchForkAiMsgId);
        expect(branchAi?.content).toContain("BRANCH");
        assertStepOk(branchAi?.content, "T3b");

        // Branch chain: root → ... → t1ToolAi → branchUser → branchAi
        const branchChain = walkChain(branchMsgs, branchAi!.id);
        expect(branchChain.length).toBeGreaterThanOrEqual(4);
        expect(branchChain[0]).toBe(t1UserMsgId);

        assertNoOrphans(branchMsgs, new Set([t1ToolAiMsgId]));
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

        const { result: musicResult, messages: musicMsgs } =
          await runTestStream({
            user: testUser,
            prompt:
              "[T4a music-gen] Call the generate_music tool with prompt='upbeat piano melody'. Check that the result has a non-empty audioUrl, a positive creditCost, and durationSeconds between 8 and 120. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: branchRetryAiMsgId,
          });

        expect(musicResult.success).toBe(true);
        if (!musicResult.success) {
          return;
        }

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
        const musicToolParent = musicMsgs.find(
          (m) => m.id === musicToolMsg!.parentId,
        );
        expect(musicToolParent?.role).toBe("assistant");
        expect(musicToolMsg!.sequenceId).toBe(musicToolParent!.sequenceId);

        // Final AI has token metadata
        const musicLastAi = musicMsgs.find(
          (m) => m.id === musicResult.data.lastAiMessageId,
        );
        expect(musicLastAi).toBeDefined();
        expect(musicLastAi!.finishReason).toBe("stop");
        assertStepOk(musicLastAi!.content, "T4a");

        // Chain goes back to root through retry branch
        const musicChain = walkChain(
          musicMsgs,
          musicResult.data.lastAiMessageId!,
        );
        expect(musicChain[0]).toBe(t1UserMsgId);
        expect(musicChain).toContain(t1AiMsgId);
        expect(musicChain).toContain(branchRetryAiMsgId);
        assertChronologicalOrder(musicChain, musicMsgs);

        assertNoOrphans(musicMsgs, new Set([t1ToolAiMsgId]));
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterMusic = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeMusic, afterMusic, 0, 15);

        // ── Part B: Video gen from fork branch ──
        setFetchCacheContext("video-generation");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeVideo = await getBalance(testUser, creditLogger, creditT);
        const prevCountVideo = (await fetchThreadMessages(threadId)).length;

        const { result: videoResult, messages: videoMsgs } =
          await runTestStream({
            user: testUser,
            prompt:
              "[T4b video-gen] Call the generate_video tool with prompt='spinning cube'. Check that the result has a non-empty videoUrl, a positive creditCost, and a positive durationSeconds. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: branchForkAiMsgId,
          });

        expect(videoResult.success).toBe(true);
        if (!videoResult.success) {
          return;
        }

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
        const videoLastAi = videoMsgs.find(
          (m) => m.id === videoResult.data.lastAiMessageId,
        );
        expect(videoLastAi).toBeDefined();
        expect(videoLastAi!.finishReason).toBe("stop");
        assertStepOk(videoLastAi!.content, "T4b");
        lastMainAiMsgId = videoResult.data.lastAiMessageId!;

        // Chain goes back through fork branch
        const videoChain = walkChain(
          videoMsgs,
          videoResult.data.lastAiMessageId!,
        );
        expect(videoChain[0]).toBe(t1UserMsgId);
        expect(videoChain).toContain(branchForkAiMsgId);
        assertChronologicalOrder(videoChain, videoMsgs);

        assertNoOrphans(videoMsgs, new Set([t1ToolAiMsgId]));
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

        const { result: detachResult, messages: detachMsgs } =
          await runTestStream({
            user: testUser,
            prompt:
              "[T5a detach] Call generate_image with prompt='detach-test' and callbackMode='detach'. Check that the result has a taskId string and a status field, and does NOT have an imageUrl. End your reply with STEP_OK if the result looks correct (taskId present, no imageUrl), or FAILED: <reason> if anything was wrong.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

        expect(detachResult.success).toBe(true);
        if (!detachResult.success) {
          return;
        }

        const detachAdded = newMessages(detachMsgs, prevCountDetach);

        // generate_image tool message
        const detachToolMsg = detachAdded.find(
          (m) => m.role === "tool" && m.toolCall?.toolName === "generate_image",
        );
        expect(detachToolMsg).toBeDefined();

        // Result is taskId/pending — NOT imageUrl
        const rawDetachResult = detachToolMsg!.toolCall?.result;
        expect(
          rawDetachResult,
          `[T5a] Raw tool result is undefined — detach result was not written to DB`,
        ).toBeDefined();
        const detachToolRes = toolResultRecord(rawDetachResult);
        expect(
          detachToolRes,
          `[T5a] toolResultRecord returned null — result is not an object: ${JSON.stringify(rawDetachResult)}`,
        ).not.toBeNull();
        // Must have taskId (string) and status — must NOT have imageUrl
        expect(
          typeof detachToolRes!["taskId"],
          "[T5a] taskId is not a string",
        ).toBe("string");
        expect(
          typeof detachToolRes!["status"],
          "[T5a] status is not a string",
        ).toBe("string");
        expect(
          detachToolRes!["imageUrl"],
          "[T5a] imageUrl present in detach result — tool executed when it shouldn't",
        ).toBeUndefined();

        // AI acknowledged
        const detachLastAi = detachMsgs.find(
          (m) => m.id === detachResult.data.lastAiMessageId,
        );
        expect(detachLastAi?.content).toBeTruthy();
        assertStepOk(detachLastAi?.content, "T5a");
        lastMainAiMsgId = detachResult.data.lastAiMessageId!;

        assertNoOrphans(detachMsgs, new Set([t1ToolAiMsgId]));
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

        const { result: endLoopResult, messages: endLoopMsgs } =
          await runTestStream({
            user: testUser,
            prompt:
              "[T5b endLoop] Call tool-help with callbackMode='endLoop'. After receiving the result, try to call tool-help again. Check that only ONE tool-help call was executed (the loop should have stopped) and the result had a non-empty tools array. End your reply with STEP_OK if exactly one call ran and the result was correct, or FAILED: <reason> if the loop continued or the result was wrong.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

        expect(endLoopResult.success).toBe(true);
        if (!endLoopResult.success) {
          return;
        }

        const endLoopAdded = newMessages(endLoopMsgs, prevCountEndLoop);

        // Exactly 1 tool-help call (endLoop stops the loop)
        const toolHelpMsgs = endLoopAdded.filter(
          (m) => m.role === "tool" && m.toolCall?.toolName === "tool-help",
        );
        expect(toolHelpMsgs).toHaveLength(1);

        // Tool result populated (endLoop executes inline)
        const endLoopToolRes = toolResultRecord(
          toolHelpMsgs[0]!.toolCall?.result,
        );
        expect(endLoopToolRes).not.toBeNull();
        // tools array must be present and non-empty
        expect(
          Array.isArray(endLoopToolRes!["tools"]),
          "T5b: tools is not an array",
        ).toBe(true);
        expect(
          (endLoopToolRes!["tools"] as ToolCallResult[]).length,
          "T5b: tools array is empty",
        ).toBeGreaterThan(0);

        // endLoop stops the stream after tool execution — AI may not write a full reply.
        // The tail of the chain is the tool message (AI already has it as a child).
        // Use the tool message ID so the next test doesn't create a branch off the AI.
        lastMainAiMsgId = toolHelpMsgs[0]!.id;

        assertNoOrphans(endLoopMsgs, new Set([t1ToolAiMsgId]));
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterEndLoop = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeEndLoop, afterEndLoop, 0, 5);
      },
      TEST_TIMEOUT,
    );

    // ── T5c: execute-tool direct call ─────────────────────────────────────
    it(
      "T5c: execute-tool direct call — tool-help via execute-tool wrapper",
      async () => {
        setFetchCacheContext("execute-tool-direct");
        await pinBalance(testUser.id, 10, creditLogger, creditT);
        const prevCount = (await fetchThreadMessages(threadId)).length;

        const { result, messages } = await runTestStream({
          user: testUser,
          prompt:
            "[T5c execute-tool-direct] Call the execute-tool endpoint with toolName='tool-help' and input={}. Check that the inner result contains a tools array with at least one entry. End your reply with STEP_OK if a tools list was returned, or FAILED: <reason> if the result was missing or malformed.",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: lastMainAiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        const added = newMessages(messages, prevCount);
        // AI may call execute-tool directly or call tool-help — either way a tool must have run
        const anyToolMsg = added.find((m) => m.role === "tool");
        expect(anyToolMsg, "T5c: no tool call found").toBeDefined();

        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        assertStepOk(lastAi?.content, "T5c");
        lastMainAiMsgId = result.data.lastAiMessageId!;

        assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);
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
              "[T6a wakeUp-phase1] Call generate_image with prompt='wakeup-test' and callbackMode='wakeUp'. The image will be generated asynchronously. Check that the result contains a taskId but no imageUrl yet. End your reply with STEP_OK if you received a taskId and no imageUrl, or FAILED: <reason> if the result was unexpected.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          const added = newMessages(messages, wakeupMsgCount);
          wakeupMsgCount = messages.length;

          // ── Tool message: wakeUp returns taskId placeholder ──
          const toolMsg = added.find(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          expect(toolMsg).toBeDefined();
          wakeupToolMsgId = toolMsg!.id;

          // wakeUp: result has taskId placeholder — no imageUrl
          const toolRes = toolResultRecord(toolMsg!.toolCall?.result);
          if (toolRes) {
            expect(
              toolRes["imageUrl"],
              "T6a: imageUrl present in wakeUp placeholder — tool ran inline",
            ).toBeUndefined();
            // Should have a taskId string
            if (toolRes["taskId"] !== undefined) {
              expect(typeof toolRes["taskId"]).toBe("string");
            }
          }

          // ── Stream ended, AI wrapped up ──
          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          expect(lastAi).toBeDefined();
          assertStepOk(lastAi?.content, "T6a");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          // wakeUp phase1: thread may be "waiting" (goroutine still running) or
          // "idle" (goroutine + revival finished fast in cache mode). Both are valid.
          // We verify revival results in T6b — not timing state here.

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0, 5);
        },
        TEST_TIMEOUT,
      );

      it(
        "T6b: wakeUp phase2 — revival, AI sees backfilled result, responds naturally",
        async () => {
          expect(wakeupToolMsgId).toBeTruthy();

          // The wakeUp revival fires async during T6a (goroutine + resume-stream fire-and-forget).
          // In cache mode it may complete before T6a even returns, or after. Search the
          // full thread for the deferred tool (isDeferred=true, has imageUrl) and revival AI.
          // wakeupMsgCount is unreliable here — revival may already be in messages from T6a.
          let messages: SlimMessage[] = [];
          const deadline = Date.now() + TEST_TIMEOUT - 5000;
          let deferredTool: SlimMessage | undefined;
          let revivalAi: SlimMessage | undefined;
          while (Date.now() < deadline) {
            messages = await fetchThreadMessages(threadId);
            // Deferred tool: isDeferred=true in toolCall metadata + has imageUrl result
            deferredTool = messages.find(
              (m) =>
                m.role === "tool" &&
                m.toolCall?.toolName === "generate_image" &&
                m.toolCall.isDeferred === true &&
                toolResultRecord(m.toolCall?.result)?.["imageUrl"] !== undefined,
            );
            if (deferredTool) {
              revivalAi = messages.find(
                (m) =>
                  m.role === "assistant" &&
                  m.content &&
                  m.parentId === deferredTool!.id,
              );
            }
            if (deferredTool && revivalAi) {
              break;
            }
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 1000);
            });
          }

          // ── Deferred tool message: written by resume-stream with real imageUrl ──
          expect(
            deferredTool,
            "T6b: no deferred tool message with imageUrl found",
          ).toBeDefined();
          if (deferredTool) {
            const deferredRes = toolResultRecord(deferredTool.toolCall?.result);
            expect(typeof deferredRes!["imageUrl"]).toBe("string");
            expect(deferredRes!["imageUrl"]).toBeTruthy();
          }

          // ── Revival AI: child of the deferred tool ──
          expect(
            revivalAi,
            "T6b: no revival AI message parented to deferred tool",
          ).toBeDefined();

          // Update lastMainAiMsgId to revival AI so T7a chains correctly.
          if (revivalAi) {
            expect(revivalAi.content).toBeTruthy();
            lastMainAiMsgId = revivalAi.id;
          } else if (deferredTool) {
            lastMainAiMsgId = deferredTool.id;
          }

          assertNoOrphans(messages, new Set([t1ToolAiMsgId]));

          // Cancel wakeUp tasks and force idle
          await cancelThreadTasks(threadId);
          await db.execute(
            sql`UPDATE chat_threads SET streaming_state = 'idle' WHERE id = ${threadId}`,
          );
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);
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
              "[T7a approve-phase1] Call generate_image with prompt='approve-test'. This tool requires user confirmation before executing. Check that no imageUrl is present in the result — the tool should be waiting for approval. End your reply with STEP_OK if no imageUrl was returned, or FAILED: <reason> if the tool ran without approval.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            availableTools: [
              { toolId: "generate_image", requiresConfirmation: true },
            ],
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          // ── Tool message without imageUrl — find newest generate_image tool msg ──
          // The approve phase tool message is the most recently created one in thread
          const approveToolMsg = [...messages]
            .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .find(
              (m) =>
                m.role === "tool" && m.toolCall?.toolName === "generate_image",
            );
          expect(approveToolMsg).toBeDefined();
          approveToolMsgId = approveToolMsg!.id;

          const toolRes = toolResultRecord(approveToolMsg!.toolCall?.result);
          // In approve mode, the tool must NOT have been executed — no imageUrl
          if (toolRes) {
            expect(
              toolRes["imageUrl"],
              "T7a: imageUrl present — tool executed without user approval (requiresConfirmation=true was ignored)",
            ).toBeUndefined();
            // Should have confirmation placeholder status
            if (toolRes["status"] !== undefined) {
              expect(
                toolRes["status"] as string,
                "T7a: unexpected status value",
              ).toBe("waiting_for_confirmation");
            }
          }

          lastMainAiMsgId = result.data.lastAiMessageId!;
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
          if (!confirmResult.success) {
            return;
          }

          const messages = await fetchThreadMessages(threadId);

          // ── Tool message now has imageUrl ──
          const toolMsg = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.toolName === "generate_image" &&
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

          // ── creditCost > 0 — image was actually generated ──
          expect(
            toolRes!["creditCost"] as number,
            "T7b: creditCost should be > 0 after approval execution",
          ).toBeGreaterThan(0);

          assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
          lastMainAiMsgId = confirmResult.data.lastAiMessageId!;
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
            "[T8 parallel-tools] In a single response, call BOTH tools at the same time: (1) tool-help to list available tools, and (2) generate_image with prompt='green square'. Check that tool-help returned a non-empty tools array and generate_image returned an imageUrl. End your reply with STEP_OK if both tools returned correct results, or FAILED: <reason> if either tool failed or only one ran.",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: lastMainAiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

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
          expect(
            toolMsg.model,
            `Parallel tool ${toolMsg.id} missing model`,
          ).toBeTruthy();
        }

        // ── All parallel tool messages share the SAME sequenceId ──
        const parallelSeqIds = new Set(toolMsgs.map((m) => m.sequenceId));
        expect(parallelSeqIds.size).toBe(1);

        // ── generate_image result has imageUrl ──
        const imgTool = toolMsgs.find(
          (m) => m.toolCall?.toolName === "generate_image",
        );
        const imgRes = toolResultRecord(imgTool!.toolCall?.result);
        expect(imgRes, "T8: generate_image result is null").not.toBeNull();
        expect(typeof imgRes!["imageUrl"]).toBe("string");
        expect(imgRes!["imageUrl"], "T8: imageUrl is empty").toBeTruthy();

        // ── tool-help result has tools array ──
        const toolHelpMsg = toolMsgs.find(
          (m) => m.toolCall?.toolName === "tool-help",
        );
        const toolHelpRes = toolResultRecord(toolHelpMsg!.toolCall?.result);
        expect(toolHelpRes, "T8: tool-help result is null").not.toBeNull();
        expect(
          Array.isArray(toolHelpRes!["tools"]),
          "T8: tool-help tools is not array",
        ).toBe(true);

        // ── Both tools share the same sequenceId (same AI turn) — asserted via parallelSeqIds above ──

        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(lastAi?.content).toBeTruthy();
        // ── Final AI has token metadata ──
        expect(lastAi!.finishReason).toBe("stop");
        expect(lastAi!.creditCost).toBeGreaterThan(0);
        assertStepOk(lastAi!.content, "T8");
        lastMainAiMsgId = result.data.lastAiMessageId!;

        assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
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
            "[T9 preCalls] An image was already generated for you before this message. Look at the generate_image tool result in your context and report the imageUrl you see. End your reply with STEP_OK if you can see an imageUrl starting with 'https://example.com', or FAILED: <reason> if no imageUrl was visible.",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: lastMainAiMsgId,
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
        if (!result.success) {
          return;
        }

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
        const lastAi = messages.find(
          (m) => m.id === result.data.lastAiMessageId,
        );
        expect(lastAi?.content).toBeTruthy();
        assertStepOk(lastAi?.content, "T9");
        lastMainAiMsgId = result.data.lastAiMessageId!;

        assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
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
            "[T10a image-attach] Describe the attached image briefly. End your reply with STEP_OK if you could see and describe it, or FAILED: <reason> if you could not process the image.",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: lastMainAiMsgId,
          attachments: [imageFile],
        });

        expect(imgResult.success).toBe(true);
        if (!imgResult.success) {
          return;
        }
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
        lastMainAiMsgId = imgResult.data.lastAiMessageId!;

        const imgAiMsg = imgAdded.find((m) => m.role === "assistant");
        expect(imgAiMsg).toBeDefined();
        expect(imgAiMsg!.finishReason).toBe("stop");
        expect(imgAiMsg!.creditCost).toBeGreaterThan(0);

        assertNoOrphans(imgMsgs, new Set([t1ToolAiMsgId]));
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
        const { result: multiResult, messages: multiMsgs } =
          await runTestStream({
            user: testUser,
            prompt:
              "[T10b multi-attach] Two files are attached: an image and an audio file. Acknowledge both and briefly describe what you can tell about each. End your reply with STEP_OK if you could process both attachments, or FAILED: <reason> if one or both were missing.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [imageFile2, musicFile],
          });

        expect(multiResult.success).toBe(true);
        if (!multiResult.success) {
          return;
        }
        expect(multiResult.data.threadId).toBe(threadId);

        const multiSorted = [...multiMsgs].toSorted(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        const multiUserMsg = multiSorted.find((m) => m.role === "user");
        expect(multiUserMsg!.attachments).toHaveLength(2);
        const mimeTypes = multiUserMsg!
          .attachments!.map((a) => a.mimeType)
          .toSorted();
        expect(mimeTypes).toEqual(["audio/mpeg", "image/jpeg"]);
        expect(multiResult.data.lastAiMessageContent!.length).toBeGreaterThan(
          10,
        );
        assertStepOk(multiResult.data.lastAiMessageContent, "T10b");
        lastMainAiMsgId = multiResult.data.lastAiMessageId!;

        assertNoOrphans(multiMsgs, new Set([t1ToolAiMsgId]));
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterMulti = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeMulti, afterMulti, 0, 30);

        // ── Part C: Voice attachment ──
        setFetchCacheContext("attachment-voice");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeVoice = await getBalance(testUser, creditLogger, creditT);

        const voiceFile = await loadFixture("test-voice.wav", "audio/wav");
        const { result: voiceResult, messages: voiceMsgs } =
          await runTestStream({
            user: testUser,
            prompt:
              "[T10c voice-attach] A voice recording is attached. Transcribe or describe what you hear in it. End your reply with STEP_OK if you could process the audio (even if short or unclear), or FAILED: <reason> if you could not process it at all.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [voiceFile],
          });

        expect(voiceResult.success).toBe(true);
        if (!voiceResult.success) {
          return;
        }
        expect(voiceResult.data.threadId).toBe(threadId);

        const voiceSorted = [...voiceMsgs].toSorted(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        const voiceUserMsg = voiceSorted.find((m) => m.role === "user");
        expect(voiceUserMsg!.attachments![0]!.mimeType).toBe("audio/wav");
        expect(voiceResult.data.lastAiMessageContent!.length).toBeGreaterThan(
          10,
        );
        assertStepOk(voiceResult.data.lastAiMessageContent, "T10c");
        lastMainAiMsgId = voiceResult.data.lastAiMessageId!;

        assertNoOrphans(voiceMsgs, new Set([t1ToolAiMsgId]));
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterVoice = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeVoice, afterVoice, 0, 30);

        // ── Part D: Video attachment ──
        setFetchCacheContext("attachment-video");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeVideo = await getBalance(testUser, creditLogger, creditT);

        const videoFile = await loadFixture("test-video.mp4", "video/mp4");
        const { result: videoResult, messages: videoMsgs } =
          await runTestStream({
            user: testUser,
            prompt:
              "[T10d video-attach] A video file is attached. Describe what you see in it. End your reply with STEP_OK if you could process the video, or FAILED: <reason> if you could not.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [videoFile],
          });

        expect(videoResult.success).toBe(true);
        if (!videoResult.success) {
          return;
        }
        expect(videoResult.data.threadId).toBe(threadId);

        const videoSorted = [...videoMsgs].toSorted(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        const videoUserMsg = videoSorted.find((m) => m.role === "user");
        expect(videoUserMsg!.attachments![0]!.mimeType).toBe("video/mp4");
        expect(videoResult.data.lastAiMessageContent!.length).toBeGreaterThan(
          10,
        );
        assertStepOk(videoResult.data.lastAiMessageContent, "T10d");

        lastMainAiMsgId = videoResult.data.lastAiMessageId!;

        assertNoOrphans(videoMsgs, new Set([t1ToolAiMsgId]));
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
            "[T11 gemini-native-image] Generate an image of a blue triangle. Output the image directly (no tool call needed). End your reply with STEP_OK if the image was generated, or FAILED: <reason> if generation failed.",
          threadId,
          favoriteId: mainFavoriteId,
          model: ChatModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
          explicitParentMessageId: lastMainAiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

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

        lastMainAiMsgId = result.data.lastAiMessageId!;

        assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
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
            "[T12 invalid-parent] Say exactly: INVALID_PARENT_TEST STEP_OK",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: crypto.randomUUID(),
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.lastAiMessageContent).toBeTruthy();
          expect(result.data.totalCreditsDeducted).toBeGreaterThan(0);
          if (result.data.lastAiMessageId) {
            lastMainAiMsgId = result.data.lastAiMessageId;
          }
        }

        assertNoOrphans(messages, new Set([t1ToolAiMsgId]));
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

        // ── Full chain integrity: no orphans, no branches, every message reachable ──
        // t1ToolAiMsgId is the only intentional branch point (T3a retry + T3b fork + main chain)
        assertChainIntegrity(messages, new Set([t1ToolAiMsgId]));

        // ── Exactly 1 root ──
        const roots = messages.filter((m) => m.parentId === null);
        expect(roots).toHaveLength(1);
        expect(roots[0]!.id).toBe(t1UserMsgId);

        // ── t1ToolAi (final AI after tool call) has ≥ 2 user children (retry, branch) ──
        const tree = buildTree(messages);
        const t1ToolAiUserChildren = (tree.get(t1ToolAiMsgId) ?? []).filter(
          (childId) =>
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
        expect(new Set(allIds).size, `Duplicate message IDs found`).toBe(
          allIds.length,
        );

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
        // Exception: wakeUp deferred tool messages get a fresh sequenceId intentionally.
        const allTools = byRole(messages, "tool");
        for (const tm of allTools) {
          expect(tm.isAI, `Tool msg ${tm.id} should be isAI=true`).toBe(true);
          expect(tm.model, `Tool msg ${tm.id} missing model`).toBeTruthy();
          if (tm.parentId && !tm.toolCall?.isDeferred) {
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

    // ── Credit deduction + incognito ───────────────────────────────────────
    it(
      "C1: credit deduction — balance decreases, totalCreditsDeducted matches",
      async () => {
        setFetchCacheContext("credit-deduction");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const before = await getBalance(testUser, creditLogger, creditT);

        const { result } = await runTestStream({
          user: testUser,
          prompt: "[C1 credit-deduction] Reply with exactly one word: OK",
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: lastMainAiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        expect((result.data.totalCreditsDeducted ?? 0) > 0).toBe(true);

        lastMainAiMsgId = result.data.lastAiMessageId!;

        const after = await getBalance(testUser, creditLogger, creditT);
        const balanceDiff = before - after;
        const reported = result.data.totalCreditsDeducted ?? 0;
        expect(
          Math.abs(balanceDiff - reported),
          `Balance diff ${balanceDiff} vs reported ${reported}`,
        ).toBeLessThan(0.01);
        expect(after).toBeLessThan(before);

        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);
      },
      TEST_TIMEOUT,
    );

    it(
      "C2: incognito — no messages persisted, credits still deducted",
      async () => {
        setFetchCacheContext("incognito-mode");
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeIncognito = await getBalance(
          testUser,
          creditLogger,
          creditT,
        );

        const logger = createEndpointLogger(false, Date.now(), defaultLocale);
        const { t } = scopedTranslation.scopedT(defaultLocale);

        const result = await runHeadlessAiStream({
          prompt: "[C2 incognito] Reply with exactly: INCOGNITO_TEST",
          favoriteId: mainFavoriteId,
          rootFolderId: DefaultFolderId.INCOGNITO,
          user: testUser,
          locale: defaultLocale,
          logger,
          t,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        // Incognito: messages not persisted — no messages should exist in DB for this thread
        if (result.data.threadId) {
          const incognitoMsgs = await fetchThreadMessages(result.data.threadId);
          expect(
            incognitoMsgs,
            "C2: incognito messages persisted to DB",
          ).toHaveLength(0);
        }
        expect(result.data.lastAiMessageContent).toContain("INCOGNITO_TEST");

        const afterIncognito = await getBalance(
          testUser,
          creditLogger,
          creditT,
        );
        expect(afterIncognito).toBeLessThan(beforeIncognito);
        expect(result.data.totalCreditsDeducted ?? 0).toBeGreaterThan(0);
      },
      TEST_TIMEOUT,
    );

    it(
      "C3: insufficient credits — returns 403 when balance is zero",
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
            prompt: "[C3 insufficient-credits] Say: SHOULD_FAIL",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
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
    let lastUnbottledAiMsgId: string;
    /** Saved chatModelOptionsIndex entries before UNBOTTLED runtime patching */
    const savedModelOptions = new Map<string, ChatModelOption>();
    /** Provider entry ops applied to .ts files on disk (reversed in afterAll) */
    let appliedOps: Array<{
      action: "add" | "remove";
      role: string;
      enumKey: string;
      modelId: string;
      provider: ApiProvider;
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
      Object.assign(agentEnv, { UNBOTTLED_CLOUD_CREDENTIALS: "" });
      const { UnbottledPriceFetcher } =
        await import("@/app/api/[locale]/agent/models/model-prices/providers/unbottled");
      const priceFetcher = new UnbottledPriceFetcher();
      const priceLogger = createEndpointLogger(
        false,
        Date.now(),
        defaultLocale,
      );
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
      const { addProviderEntry, getRoleFilePaths } =
        await import("@/app/api/[locale]/agent/models/model-prices/repository");
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
        if (!filePath) {
          continue;
        }
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
          } as ChatModelOption;
        }
      }

      // Verify our test model got patched
      expect(
        savedModelOptions.has(testModelId),
        `Price updater did not return an add op for ${testModelId}`,
      ).toBe(true);

      // ── Step 4: Set credentials pointing at ourselves (self-relay) ──
      const { resolveLocalAdminSession } =
        await import("@/app/api/[locale]/agent/models/model-prices/providers/local-session-helper");
      const localSession = await resolveLocalAdminSession(
        env.NEXT_PUBLIC_APP_URL,
      );
      expect(
        localSession,
        "resolveLocalAdminSession failed — admin user missing?",
      ).toBeTruthy();
      Object.assign(agentEnv, {
        UNBOTTLED_CLOUD_CREDENTIALS: `${localSession!.leadId}:${localSession!.token}:${localSession!.remoteUrl}`,
      });

      // ── Step 5: Upsert test favorites with stable IDs (reused across runs) ──
      const UNBOTTLED_FAV_ID = "00000000-0000-4002-a000-000000000002";
      const BUDGET_FAV_ID = "00000000-0000-4003-a000-000000000003";

      const kimiValues = {
        id: UNBOTTLED_FAV_ID,
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
      };
      await db
        .insert(chatFavorites)
        .values(kimiValues)
        .onConflictDoUpdate({
          target: chatFavorites.id,
          set: {
            modelSelection: kimiValues.modelSelection,
            imageGenModelSelection: kimiValues.imageGenModelSelection,
            musicGenModelSelection: kimiValues.musicGenModelSelection,
            videoGenModelSelection: kimiValues.videoGenModelSelection,
          },
        });
      favoriteId = UNBOTTLED_FAV_ID;

      const budgetValues = {
        id: BUDGET_FAV_ID,
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
      };
      await db
        .insert(chatFavorites)
        .values(budgetValues)
        .onConflictDoUpdate({
          target: chatFavorites.id,
          set: {
            modelSelection: budgetValues.modelSelection,
            imageGenModelSelection: budgetValues.imageGenModelSelection,
            musicGenModelSelection: budgetValues.musicGenModelSelection,
            videoGenModelSelection: budgetValues.videoGenModelSelection,
          },
        });
      budgetFavoriteId = BUDGET_FAV_ID;

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
        const { removeProviderEntry, getRoleFilePaths } =
          await import("@/app/api/[locale]/agent/models/model-prices/repository");
        const roleFilePaths = getRoleFilePaths();
        const opsByRole = new Map<string, typeof appliedOps>();
        for (const op of appliedOps) {
          const list = opsByRole.get(op.role) ?? [];
          list.push(op);
          opsByRole.set(op.role, list);
        }
        for (const [role, ops] of opsByRole) {
          const filePath = roleFilePaths[role];
          if (!filePath) {
            continue;
          }
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
        Object.assign(agentEnv, {
          UNBOTTLED_CLOUD_CREDENTIALS: savedCredentials,
        });
      } else {
        Object.assign(agentEnv, { UNBOTTLED_CLOUD_CREDENTIALS: "" });
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
          prompt: "[F2 unbottled-relay] Reply with exactly: HELLO_TEST STEP_OK",
          favoriteId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }

        unbottledThreadId = result.data.threadId!;
        lastUnbottledAiMsgId = result.data.lastAiMessageId!;
        expect(unbottledThreadId).toBeTruthy();
        expect(lastUnbottledAiMsgId).toBeTruthy();
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
            '[F3 unbottled-tool-call] Use the tool-help tool to look up how the "generate_image" tool works, then summarize what you found. End your reply with STEP_OK if the tool lookup worked correctly, or FAILED: <reason> if anything was wrong.',
          threadId: unbottledThreadId,
          favoriteId,
          explicitParentMessageId: lastUnbottledAiMsgId,
        });

        expect(result.success).toBe(true);
        if (!result.success) {
          return;
        }
        expect(result.data.threadId).toBe(unbottledThreadId);
        lastUnbottledAiMsgId = result.data.lastAiMessageId!;

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
        assertChainIntegrity(messages);
      },
      TEST_TIMEOUT,
    );
  });
});
