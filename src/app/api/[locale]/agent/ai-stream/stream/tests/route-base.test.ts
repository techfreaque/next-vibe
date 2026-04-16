/**
 * AI Stream Integration Tests - Single-Thread Sequential Suite
 *
 * Architecture:
 * - One shared thread (`threadId`) for the main test sequence so the AI sees
 *   real conversation history and a human reviewer can read the thread in the UI.
 * - Separate isolated threads for tests that fundamentally can't share state
 *   (incognito, credits, error handling, certain callback modes).
 * - After every step: assertThreadIdle + assertNoPendingTasks + credit check.
 * - Per-step credit pinning so billing regressions are caught immediately.
 * - HTTP cache (installFetchCache) intercepts outbound fetch() on first run,
 *   replays from fixtures on subsequent runs - same code path, no network.
 * - Claude Code fixtures (claude-code-fixture-store) for Agent SDK calls.
 *
 * Cache bust: delete fixtures/http-cache/<case>/ or fixtures/claude-code/<case>/
 *
 * Thread layout (visible in UI):
 *   T1  → new thread + tool call (tool-help) - creates thread, tests parent chain + tool structure
 *   T2  → image generation (z-image-turbo, inline wait mode)
 *   T3  → retry + branch from T1 AI → two sibling forks: RETRY_RESPONSE + BRANCH_RESPONSE
 *   T4  → music gen (from retry branch) + video gen (from fork branch)
 *   T5  → detach dispatch: AI calls generate_image(detach), gets taskId
 *   T5b → wait-for-task: AI calls wait-for-task with T5 taskId, gets imageUrl
 *   T5a → endLoop: tool-help(endLoop) executes inline, stream stops after 1 call
 *   T6  → wakeUp: phase1 dispatches async, phase2 revives with result
 *   T7  → approve: phase1 pending confirmation, phase2 confirms + executes
 *   T8  → parallel tools: tool-help + generate_image in same batch
 *   T9  → preCalls injection: synthetic tool result in DB before AI runs
 *   T10 → file attachments: image, multi (image+audio), voice (attach+STT), video
 *   T11 → Gemini native image generation (file part output, empty args.prompt)
 *   T11b→ gap-fill Pass 2: non-image model sees vision-bridge description of T11 image
 *   T12 → invalid explicitParentMessageId - graceful error handling
 *
 * Standalone suites (no thread / own thread):
 *   - Credits (deduction, incognito, insufficient)
 *   - Favorites + UNBOTTLED self-relay (F1–F3)
 */

import "server-only";

// AI SDK v2→v3 compat mode warning - provider works fine, SDK just prefers v3
// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

// Install HTTP fetch interceptor before any other imports touch fetch
import { installFetchCache } from "../../testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { and, eq, like, sql } from "drizzle-orm";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import {
  ContentLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { agentEnv } from "@/app/api/[locale]/agent/env";
import { ImageGenModelId } from "@/app/api/[locale]/agent/image-generation/models";
import { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import { MusicGenModelId } from "@/app/api/[locale]/agent/music-generation/models";
import { VideoGenModelId } from "@/app/api/[locale]/agent/video-generation/models";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { env } from "@/config/env";
import {
  ChatModelId,
  chatModelOptionsIndex,
  type ChatModelOption,
} from "../../models";
import { runHeadlessAiStream } from "../../repository/headless";
import {
  patchFetchCacheFixtures,
  setFetchCacheContext,
} from "../../testing/fetch-cache";
import {
  fetchThreadMessages,
  fetchThreadTitle,
  runTestStream,
  toolResultRecord,
  type SlimMessage,
} from "../../testing/headless-test-runner";
import { scopedTranslation } from "../i18n";

// ── Mode configuration ────────────────────────────────────────────────────────

export interface ModeConfig {
  /** Human-readable label used in describe() title */
  label: string;
  /** Prefix for setFetchCacheContext - e.g. "regular-", "direct-", "queue-", "unbottled-" */
  cachePrefix: string;
  /**
   * When set, the AI calls remote tools via two patterns depending on tool type:
   *
   * **Meta-tools** (`tool-help`, `execute-tool`): always bare name + `instanceId` param.
   *   e.g. `execute-tool(toolName='tool-help', instanceId='hermes')`
   *   The `instanceId__tool-help` prefix form is NOT the expected pattern for meta-tools.
   *
   * **Pinned tools** (everything else): appear as `instanceId__toolName` in the tool list.
   *   The AI calls them via `execute-tool(toolName='generate_image', instanceId='hermes')`
   *   in test context (where no pinned tools are registered).
   *
   * Assertions verify execute-tool calls with correct instanceId in args.
   * When not set, the AI calls tools directly by plain name (no prefix ever).
   */
  remoteInstanceId?: string;
  /**
   * Per-mode setup called after the shared beforeAll (user resolution + credits).
   * Use this for remote connection setup, credential patching, etc.
   */
  setup?: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /**
   * Per-mode teardown called in afterAll.
   */
  teardown?: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /**
   * For queue mode: a real pulse function that executes pending tasks.
   *
   * Queue WAIT flow (per spec):
   *   1. runTestStream → AI calls execute-tool(wait) → stream aborts → thread 'waiting'
   *   2. Assert thread is 'waiting' + tool message is 'pending'
   *   3. await cfg.pulse(threadId) → polls for remote task completion → fires revival
   *      directly in-process (bypassing server cron race) → thread → 'idle'
   *   4. Re-fetch messages → assert backfilled result + AI final response
   *
   * @param threadId - the thread ID for which to run revival
   */
  pulse?: (threadId: string) => Promise<void>;
  /**
   * Force all model resolution (chat + image/music/video gen) to a specific API provider.
   * Used by UNBOTTLED self-relay: routes all inference through UNBOTTLED provider,
   * preserving the same test flow and fixtures as direct mode.
   */
  providerOverride?: ApiProvider;
}

// ── Remote-mode helpers ────────────────────────────────────────────────────────

/**
 * Returns the prompt instruction for calling a tool by plain name.
 * Local: "the tool-help tool"
 * Remote via execute-tool: "execute-tool with toolName='tool-help' and instanceId='hermes-dev'"
 */
function toolInstr(cfg: ModeConfig, toolName: string): string {
  if (cfg.remoteInstanceId) {
    return `execute-tool with toolName='${toolName}' and instanceId='${cfg.remoteInstanceId}'`;
  }
  return `the ${toolName} tool`;
}

/**
 * Returns the prompt instruction for calling a tool with extra named parameters.
 * e.g. toolInstrWithArgs(cfg, "generate_image", "prompt='x' and callbackMode='detach'")
 * Local: "the generate_image tool with prompt='x' and callbackMode='detach'"
 * Remote: "execute-tool with toolName='generate_image', instanceId='hermes-dev', prompt='x', and callbackMode='detach'"
 */
function toolInstrWithArgs(
  cfg: ModeConfig,
  toolName: string,
  argsStr: string,
): string {
  if (cfg.remoteInstanceId) {
    return `execute-tool with toolName='${toolName}', instanceId='${cfg.remoteInstanceId}', ${argsStr}`;
  }
  return `the ${toolName} tool with ${argsStr}`;
}

/**
 * Find a tool message by its logical tool name, handling execute-tool wrapping.
 * Local: finds message where toolCall.toolName === toolName.
 * Remote (execute-tool): finds execute-tool message where args.toolName === toolName.
 * Falls back to execute-tool wrapping even without remoteInstanceId (e.g. UNBOTTLED
 * mode where hermes wraps non-native tools through execute-tool without instanceId).
 */
function findToolMsg(
  messages: SlimMessage[],
  toolName: string,
  cfg: ModeConfig,
): SlimMessage | undefined {
  if (cfg.remoteInstanceId) {
    return messages.find(
      (m) =>
        m.role === "tool" &&
        m.toolCall?.toolName === "execute-tool" &&
        toolResultRecord(m.toolCall.args)?.["toolName"] === toolName,
    );
  }
  // Direct match first
  const direct = messages.find(
    (m) => m.role === "tool" && m.toolCall?.toolName === toolName,
  );
  if (direct) {
    return direct;
  }
  // Fallback: execute-tool wrapping without instanceId (e.g. UNBOTTLED/hermes)
  return messages.find(
    (m) =>
      m.role === "tool" &&
      m.toolCall?.toolName === "execute-tool" &&
      toolResultRecord(m.toolCall.args)?.["toolName"] === toolName,
  );
}

/**
 * Extract the effective tool result from a tool message, unwrapping execute-tool
 * when the model used it as an intermediary (e.g. UNBOTTLED/hermes mode).
 * For direct tool calls: returns toolResultRecord(msg.toolCall?.result).
 * For execute-tool wrappers: unwraps the inner { result: ... } and returns it.
 */
function resolveToolResult(
  msg: SlimMessage | undefined,
): Record<string, WidgetData> | null {
  if (!msg) {
    return null;
  }
  const raw = toolResultRecord(msg.toolCall?.result);
  if (!raw) {
    return null;
  }
  // If this was an execute-tool call, the inner result is nested under "result"
  if (
    msg.toolCall?.toolName === "execute-tool" &&
    "result" in raw &&
    raw["result"] !== null &&
    typeof raw["result"] === "object" &&
    !Array.isArray(raw["result"])
  ) {
    return raw["result"] as Record<string, WidgetData>;
  }
  return raw;
}

/**
 * Assert that a tool message is a valid remote call via execute-tool.
 * Verifies instanceId in args matches cfg.remoteInstanceId.
 * No-op when cfg.remoteInstanceId is not set.
 */
function assertRemoteToolCall(
  msg: SlimMessage,
  expectedToolName: string,
  cfg: ModeConfig,
): void {
  if (!cfg.remoteInstanceId) {
    return;
  }
  expect(
    msg.toolCall?.toolName,
    `Expected execute-tool wrapper for remote call to ${expectedToolName}`,
  ).toBe("execute-tool");
  const args = toolResultRecord(msg.toolCall?.args);
  expect(args, "execute-tool args must be an object").not.toBeNull();
  expect(
    args!["toolName"],
    `execute-tool args.toolName must be '${expectedToolName}'`,
  ).toBe(expectedToolName);
  expect(
    args!["instanceId"],
    `execute-tool args.instanceId must be '${cfg.remoteInstanceId}'`,
  ).toBe(cfg.remoteInstanceId);
}

/**
 * Assert that no tool message uses the `instanceId__toolName` prefix form for
 * meta-tools (tool-help, execute-tool). Meta-tools must always be called by
 * bare name with an instanceId param - never as `hermes__tool-help` etc.
 * No-op when cfg.remoteInstanceId is not set.
 */
function assertNoMetaToolPrefix(
  messages: SlimMessage[],
  cfg: ModeConfig,
): void {
  if (!cfg.remoteInstanceId) {
    return;
  }
  const metaTools = ["tool-help", "execute-tool"];
  for (const meta of metaTools) {
    const prefixed = `${cfg.remoteInstanceId}__${meta}`;
    const bad = messages.filter(
      (m) => m.role === "tool" && m.toolCall?.toolName === prefixed,
    );
    expect(
      bad,
      `Meta-tool '${meta}' must not be called as '${prefixed}' - use bare name with instanceId param`,
    ).toHaveLength(0);
  }
}

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

interface ChainIntegrityOptions {
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
function assertChainIntegrity(
  messages: SlimMessage[],
  knownBranchPoints: Set<string> = new Set(),
  options: ChainIntegrityOptions = {},
): void {
  const byId = new Map(messages.map((m) => [m.id, m]));
  const tree = buildTree(messages);

  // 1. No orphans - every parentId must reference an existing message
  for (const msg of messages) {
    if (msg.parentId && !byId.has(msg.parentId)) {
      // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
      throw new Error(
        `Orphan: ${msgDesc(msg)} → parentId ${msg.parentId} not in thread`,
      );
    }
  }

  // 2. Exactly one root
  const roots = tree.get("__root__") ?? [];
  if (roots.length !== 1) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
    throw new Error(
      roots.length === 0
        ? "No root message (all messages have a parentId)"
        : `Multiple root messages (parentId=null): ${roots.map((id) => msgDesc(byId.get(id)!)).join(", ")}`,
    );
  }

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
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
    throw new Error(
      `Branch violation on ${parent ? msgDesc(parent) : parentId}: has ${String(children.length)} children (expected 1):\n  ${childList}`,
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

// Keep assertNoOrphans as thin alias for backwards-compat within tests
function assertNoOrphans(
  messages: SlimMessage[],
  knownBranchPoints: Set<string> = new Set(),
  options: ChainIntegrityOptions = {},
): void {
  assertChainIntegrity(messages, knownBranchPoints, options);
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
 * Wait for a detach/background task to reach a terminal status (completed/failed).
 * Required after detach tests to ensure the goroutine finishes its HTTP calls
 * (modelslab poll, CDN download) within the current fixture context before the
 * next test switches the cache context.
 */
// oxlint-disable-next-line no-unused-vars -- kept for future detach-polling tests
async function waitForTaskCompletion(
  taskId: string,
  maxWaitMs = 30_000,
): Promise<void> {
  const pollIntervalMs = 200;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const [task] = await db
      .select({ lastExecutionStatus: cronTasks.lastExecutionStatus })
      .from(cronTasks)
      .where(eq(cronTasks.id, taskId));
    const status = task?.lastExecutionStatus;
    if (
      status === "status.completed" ||
      status === "status.failed" ||
      status === "status.stopped" ||
      !task
    ) {
      // Task completed, failed, or was already deleted
      return;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, pollIntervalMs);
    });
  }
  // Timeout - proceed anyway (detach result not critical for test correctness)
}

/**
 * Assert step completed without the AI reporting issues.
 * Every test prompt ends with "End with STEP_OK if everything worked."
 * If the AI found something wrong, it reports it instead - and the test
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
    `[${stepName}] AI did NOT confirm STEP_OK - reported issues instead:\n\n${content}`,
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
// Queue tests need extra time: triggerHermesPulse + background cron cycle for resume-stream (up to 60s each)
const QUEUE_TEST_TIMEOUT = 300_000;

export function describeStreamSuite(cfg: ModeConfig): void {
  // For queue tests (cfg.pulse set), individual tests need more time for cron cycles
  const effectiveTestTimeout = cfg.pulse ? QUEUE_TEST_TIMEOUT : TEST_TIMEOUT;
  describe(cfg.label, () => {
    let testUser: JwtPrivatePayloadType;
    let creditLogger: ReturnType<typeof createEndpointLogger>;
    let creditT: ReturnType<typeof creditsScopedTranslation.scopedT>["t"];
    /** Main favorite: quality-tester skill + kimi variant + media model selections */
    let mainFavoriteId: string;

    beforeAll(async () => {
      const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(
        resolved,
        `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
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

      // ── Resolve quality-tester favorite ──
      // Use admin's existing quality-tester favorite if present (respects UI overrides).
      // If none exists, create a stable minimal one - model IDs come from skill defaults.
      // Stable ID ensures HTTP fixture caches remain valid between runs.
      const MAIN_FAVORITE_ID = "00000000-0000-4001-a000-000000000001";
      const [existingFav] = await db
        .select({ id: chatFavorites.id })
        .from(chatFavorites)
        .where(
          and(
            eq(chatFavorites.userId, testUser.id),
            eq(chatFavorites.skillId, "quality-tester"),
          ),
        )
        .orderBy(chatFavorites.position)
        .limit(1);

      if (existingFav) {
        mainFavoriteId = existingFav.id;
      } else {
        // No admin favorite - create minimal one (skill provides media model defaults)
        await db
          .insert(chatFavorites)
          .values({
            id: MAIN_FAVORITE_ID,
            userId: testUser.id,
            skillId: "quality-tester",
            variantId: "kimi",
            position: 9998,
          })
          .onConflictDoNothing();
        mainFavoriteId = MAIN_FAVORITE_ID;
      }

      // Per-mode setup (remote connections, credential patching, etc.)
      if (cfg.setup) {
        await cfg.setup(testUser);
      }
    }, effectiveTestTimeout);

    afterAll(async () => {
      if (cfg.teardown && testUser) {
        await cfg.teardown(testUser);
      }
    });

    /**
     * Drop-in for runTestStream that handles queue-mode revival transparently.
     *
     * Queue WAIT flow (per spec):
     *   1. runTestStream → AI calls execute-tool(wait) → stream aborts → thread 'waiting'
     *   2. Assert thread is 'waiting' (the tool message is pending)
     *   3. await cfg.pulse() → pulse executes task → handleTaskCompletion (awaited) →
     *      ResumeStreamRepository.resume (awaited) → revival stream completes → thread 'idle'
     *   4. Re-fetch messages - tool backfilled in place, AI final response present
     *
     * For non-queue modes (cfg.pulse not set): pass-through, no-op.
     */
    async function runStream(
      params: Parameters<typeof runTestStream>[0],
    ): Promise<ReturnType<typeof runTestStream>> {
      const firstResult = await runTestStream({
        ...params,
        providerOverride: params.providerOverride ?? cfg.providerOverride,
      });

      // Queue mode: if thread ended in 'waiting' state, run pulse → revival → re-fetch
      if (
        cfg.pulse &&
        firstResult.result.success &&
        firstResult.result.data.threadId
      ) {
        const tid = firstResult.result.data.threadId;
        const [threadRow] = await db
          .select({ streamingState: chatThreads.streamingState })
          .from(chatThreads)
          .where(eq(chatThreads.id, tid));

        if (threadRow?.streamingState === "waiting") {
          // Assert waiting state (spec requirement: stream must die into 'waiting', not error)
          expect(
            threadRow.streamingState,
            "Queue WAIT: thread must be in 'waiting' state after stream aborts",
          ).toBe("waiting");

          // Delete stale cron tasks from previous test runs that are NOT for this thread.
          // Without this, executePulse picks up leftover resume-stream/remote tasks which
          // consume fetch-cache counter indices before the real revival, misaligning fixtures.
          await db
            .delete(cronTasks)
            .where(
              and(
                like(cronTasks.routeId, "resume-stream%"),
                sql`(${cronTasks.wakeUpThreadId} IS NULL OR ${cronTasks.wakeUpThreadId} != ${tid})`,
              ),
            );

          // Run pulse: polls for remote task completion → fires revival in-process
          await cfg.pulse(tid);

          // Revival runs as fire-and-forget inside resume-stream. Wait for thread → 'idle'.
          // Timeout: 180s (budget for slow media gen + two full pulse cycles).
          const REVIVAL_TIMEOUT_MS = 180_000;
          const REVIVAL_POLL_INTERVAL_MS = 500;
          const revivalStart = Date.now();
          let revivalState: string | undefined = "streaming";
          while (
            revivalState !== "idle" &&
            Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
          ) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, REVIVAL_POLL_INTERVAL_MS);
            });
            const [revivalRow] = await db
              .select({ streamingState: chatThreads.streamingState })
              .from(chatThreads)
              .where(eq(chatThreads.id, tid));
            revivalState = revivalRow?.streamingState;
          }
          expect(
            revivalState,
            "Queue WAIT: thread must return to 'idle' after revival",
          ).toBe("idle");

          // Re-fetch messages with post-revival state
          const revivedMessages = await fetchThreadMessages(tid);
          // The revival creates a new AI message. Update lastAiMessageId to the revival's
          // AI message so assertions like assertStepOk(lastAi) check the correct message.
          const lastRevivalAi = [...revivedMessages]
            .toReversed()
            .find((m) => m.role === "assistant");
          // Sum credits from all messages (initial stream charges tool credits; revival charges AI credits).
          const totalCredits = revivedMessages.reduce(
            (sum, m) => sum + (m.creditCost ?? 0),
            0,
          );
          const revivedResult =
            lastRevivalAi && firstResult.result.success
              ? {
                  ...firstResult.result,
                  data: {
                    ...firstResult.result.data,
                    lastAiMessageId: lastRevivalAi.id,
                    totalCreditsDeducted:
                      totalCredits > 0
                        ? totalCredits
                        : firstResult.result.data.totalCreditsDeducted,
                  },
                }
              : firstResult.result;
          return {
            result: revivedResult,
            messages: revivedMessages,
            pinnedToolCount: firstResult.pinnedToolCount,
          };
        }
      }

      return firstResult;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Main Thread: one shared thread, sequential steps
    // Each step verifies thread state + credits before moving on.
    // A human reading the thread in the UI sees a natural conversation.
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    describe("Main Thread (single shared thread)", () => {
      // If any test in this suite fails, all subsequent tests skip immediately.
      // Prevents downstream tests from passing with stale/undefined shared state.
      // suiteFailed is set to true by any test that catches an error.
      // Subsequent tests skip immediately to avoid false positives from stale state.
      let suiteFailed = false;
      /** Drop-in for `it` that marks the suite failed on any thrown error and
       *  skips immediately if a previous test already failed. */
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

      // Thread state shared across steps
      let threadId: string;
      // Tracks the last AI message on the main linear chain.
      // Every append test MUST pass this as explicitParentMessageId so the
      // thread is a strict linked list with no broken parent chains.
      let lastMainAiMsgId: string;
      // Accumulates known dead-end leaf IDs as branches are created and
      // abandoned. Passed to assertChainIntegrity as knownDeadEndLeaves so
      // check #5 only fires on genuinely unexpected leaves.
      const deadEndLeaves = new Set<string>();

      // Step artifacts
      let t1UserMsgId: string;
      let t1AiMsgId: string;
      let t1ToolAiMsgId: string; // last AI after tool call (was t2AiMsgId)
      // The explicit parent passed to T2's runStream = lastMainAiMsgId before T2 ran.
      // UI retry/branch on T2's user message uses userMsg.parentId = this value.
      // So retry/branch user messages are SIBLINGS of T2's user message under t2BranchParentId.
      let t2BranchParentId: string;
      // T2's user message ID - a sibling of the retry/branch user messages under t2BranchParentId.
      let t2UserMsgId: string;
      let branchRetryAiMsgId: string; // From retry+branch test
      let branchForkAiMsgId: string; // From branch fork
      let t5DetachTaskId: string; // taskId from T5 detach step, used by T5b wait-for-task step

      // ── T1: New thread + tool call (combines basic send + tool call) ──────
      fit(
        "T1: new thread + tool call - thread creation, parent chain, tool-help result, metadata",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}tool-call`);
          await pinBalance(testUser.id, 50, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T1 thread-create+tool-call] Use ${toolInstr(cfg, "tool-help")} to list available tools. Check that the result contains a non-empty tools array and that each tool has a name and description. End your reply with STEP_OK if everything worked, or FAILED: <reason> if anything was wrong.`,
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
            findToolMsg(messages, "tool-help", cfg) ?? toolMsgs[0]!;
          expect(toolMsg.toolCall?.toolName).toBeTruthy();
          assertRemoteToolCall(toolMsg, "tool-help", cfg);
          assertNoMetaToolPrefix(messages, cfg);
          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes).not.toBeNull();
          expect(toolMsg.isAI).toBe(true);
          expect(toolMsg.model).toBeTruthy();

          // ── tool-help result: tools array + totalCount ──
          expect(
            Array.isArray(toolRes!["tools"]),
            "T1: tools is not an array",
          ).toBe(true);
          expect(
            (toolRes!["tools"] as WidgetData[]).length,
            "T1: tools array is empty",
          ).toBeGreaterThan(0);
          expect(typeof toolRes!["totalCount"], "T1: totalCount missing").toBe(
            "number",
          );
          expect(toolRes!["totalCount"] as number).toBeGreaterThan(0);
          // First tool entry has name + description
          const firstTool = toolResultRecord(
            (toolRes!["tools"] as WidgetData[])[0],
          );
          expect(
            firstTool?.["name"],
            "T1: first tool missing name",
          ).toBeTruthy();
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
          // Capture the tool message (parent of t1ToolAiMsgId).
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

          assertNoOrphans(messages, new Set([t1ToolAiMsgId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0, 20);
        },
        effectiveTestTimeout,
      );

      // ── T1b: tool-help detail mode ────────────────────────────────────────
      fit(
        "T1b: tool-help detail mode - single tool schema lookup with parameters",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}tool-help-detail`);
          await pinBalance(testUser.id, 10, creditLogger, creditT);
          const prevCount = (await fetchThreadMessages(threadId)).length;

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T1b tool-help-detail] Call ${toolInstr(cfg, "tool-help")} with toolName='generate_image'. Check that the result contains a name, a description, and a parameters schema. End your reply with STEP_OK if all three were present, or FAILED: <what was missing> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          const added = newMessages(messages, prevCount);
          const toolMsg = findToolMsg(added, "tool-help", cfg);
          expect(toolMsg, "T1b: tool-help message not found").toBeDefined();
          if (toolMsg) {
            assertRemoteToolCall(toolMsg, "tool-help", cfg);
          }
          assertNoMetaToolPrefix(added, cfg);

          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes, "T1b: tool result is null").not.toBeNull();

          // Detail mode returns single tool - check for name + description
          const entry = Array.isArray(toolRes!["tools"])
            ? toolResultRecord((toolRes!["tools"] as WidgetData[])[0])
            : toolRes;
          expect(entry, "T1b: no tool entry in result").toBeDefined();

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          assertStepOk(lastAi?.content, "T1b");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t1ToolAiMsgId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T2: Image generation (inline wait) ──────────────────────────────
      fit(
        "T2: image generation (z-image-turbo, wait mode) - imageUrl, creditCost, generatedMedia",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}image-generation`);
          await pinBalance(testUser.id, 15, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);
          const prevCount = (await fetchThreadMessages(threadId)).length;

          // Capture the parent of T2's user message BEFORE T2 updates lastMainAiMsgId.
          // UI retry/branch on T2's user message uses userMsg.parentId = this value.
          t2BranchParentId = lastMainAiMsgId;

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T2 image-gen] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='red circle'")}. Check that the result contains a non-empty imageUrl and a positive creditCost. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: t2BranchParentId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          const added = newMessages(messages, prevCount);

          // Capture T2's user message ID - it's a sibling of the retry/branch user messages.
          // T2 user message has parentId = t2BranchParentId (the value of lastMainAiMsgId before T2).
          const t2AddedUser = added.find((m) => m.role === "user");
          t2UserMsgId = t2AddedUser?.id ?? "";

          // ── generate_image tool message ──
          const toolMsg = findToolMsg(added, "generate_image", cfg);
          expect(toolMsg).toBeDefined();
          if (toolMsg) {
            assertRemoteToolCall(toolMsg, "generate_image", cfg);
          }
          expect(toolMsg!.isAI).toBe(true);

          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes).not.toBeNull();
          expect(typeof toolRes!["imageUrl"]).toBe("string");
          expect(toolRes!["imageUrl"]).toBeTruthy();
          expect(typeof toolRes!["creditCost"]).toBe("number");

          // ── Tool parent is assistant, shares sequenceId ──
          const toolParent = messages.find((m) => m.id === toolMsg!.parentId);
          expect(toolParent?.role).toBe("assistant");
          expect(toolMsg!.sequenceId).toBe(toolParent!.sequenceId);

          // ── imageUrl is in the tool result (not lastGeneratedMediaUrl - that's for native multimodal LLMs) ──
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
          assertNoOrphans(messages, new Set([t1ToolAiMsgId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0.47, 10);
        },
        effectiveTestTimeout,
      );

      // ── T3: Retry + branch from T2's user message - two forks from same parent ──
      fit(
        "T3: retry + branch - two sibling forks from T2 user msg parent, same parentId as T2 user, correct tree structure",
        async () => {
          // UI retry/branch is called on the T2 USER MESSAGE (not the AI).
          // retryMessage(t2UserMsg) → parentMessageId = t2UserMsg.parentId = t2BranchParentId
          // branchMessage(t2UserMsg) → parentMessageId = t2UserMsg.parentId = t2BranchParentId
          // So retry/branch user messages are SIBLINGS of t2UserMsgId under t2BranchParentId.
          // This is the correct branch point: the branch navigator in the UI shows
          // all children of t2BranchParentId (including the original T2 user message).
          const branchParentId = t2BranchParentId;

          // The entire T2 subtree (t2UserMsgId + its descendants) is a dead-end now.
          // Mark lastMainAiMsgId as dead-end since we branch at t2BranchParentId level.
          deadEndLeaves.add(lastMainAiMsgId);
          // t2UserMsgId is also a dead-end leaf's ancestor, but its branch completes normally.
          // We add t2UserMsgId as well since it's on the abandoned branch.

          // ── Fork 1: Retry (UI flow: operation="retry", parentMessageId=t2BranchParentId) ──
          setFetchCacheContext(`${cfg.cachePrefix}retry`);
          await pinBalance(testUser.id, 40, creditLogger, creditT);
          const beforeRetry = await getBalance(testUser, creditLogger, creditT);
          const prevCountRetry = (await fetchThreadMessages(threadId)).length;

          const { result: retryResult, messages: retryMsgs } = await runStream({
            user: testUser,
            prompt: "[T3a retry-branch] Say exactly: RETRY_RESPONSE STEP_OK",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: branchParentId,
            operationOverride: "retry",
          });

          expect(retryResult.success).toBe(true);
          if (!retryResult.success) {
            return;
          }

          branchRetryAiMsgId = retryResult.data.lastAiMessageId!;
          const retryAdded = newMessages(retryMsgs, prevCountRetry);

          // ── T3a: retryUser.parentId === branchParentId === t2UserMsg.parentId ──
          // The KEY assertion: the user message we retry from has the SAME parentId
          // as the branch siblings (t2UserMsgId). All are children of t2BranchParentId.
          const retryUser = retryAdded.find(
            (m) => m.role === "user" && m.parentId === branchParentId,
          );
          expect(
            retryUser,
            `T3a: retry user message must have parentId=${branchParentId} (= t2BranchParentId, same as t2UserMsg.parentId). ` +
              `UI retryMessage(t2UserMsg) uses t2UserMsg.parentId as parentMessageId. ` +
              `Added messages: ${JSON.stringify(retryAdded.map((m) => ({ id: m.id, role: m.role, parentId: m.parentId })))}`,
          ).toBeDefined();

          const retryAi = retryMsgs.find((m) => m.id === branchRetryAiMsgId);
          expect(retryAi?.content).toContain("RETRY");
          assertStepOk(retryAi?.content, "T3a");
          // retryAi must point directly at retryUser
          expect(
            retryAi!.parentId,
            `T3a: retryAi.parentId must be retryUser.id=${retryUser!.id}`,
          ).toBe(retryUser!.id);

          // Exact chain: [t1UserMsgId, ..., branchParentId, retryUser.id, retryAi.id]
          const retryChain = walkChain(retryMsgs, retryAi!.id);
          expect(retryChain.length).toBeGreaterThanOrEqual(4);
          expect(retryChain[0]).toBe(t1UserMsgId);
          expect(retryChain[retryChain.length - 1]).toBe(branchRetryAiMsgId);
          expect(retryChain[retryChain.length - 2]).toBe(retryUser!.id);
          expect(
            retryChain[retryChain.length - 3],
            `T3a: the message immediately before retryUser must be branchParentId=${branchParentId}. ` +
              `This is t2BranchParentId = the AI message before T2, same parent as T2's user message.`,
          ).toBe(branchParentId);
          assertChronologicalOrder(retryChain, retryMsgs);

          // branchParentId has both t2UserMsgId (original T2 user) and retryUser as children.
          const branchParentChildren = retryMsgs.filter(
            (m) => m.parentId === branchParentId,
          );
          expect(
            branchParentChildren.some((m) => m.id === t2UserMsgId),
            `T3a: t2UserMsgId (${t2UserMsgId}) must be a child of branchParentId=${branchParentId}`,
          ).toBe(true);
          expect(
            branchParentChildren.some((m) => m.id === retryUser!.id),
            `T3a: retryUser must be a child of branchParentId (sibling of t2UserMsgId)`,
          ).toBe(true);

          // T3a: expectedLeaf = branchRetryAiMsgId; T2 subtree + lastMainAiMsgId are dead-ends
          assertNoOrphans(retryMsgs, new Set([branchParentId]), {
            expectedLeafId: branchRetryAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const afterRetry = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(beforeRetry, afterRetry, 0, 10);

          // ── Fork 2: Branch from same parent (UI flow: operation="edit", parent=t2BranchParentId) ──
          // The UI's branchMessage hook uses: parentMessageId = userMsg.parentId, operation = "edit"
          // So we pass branchParentId (= t2BranchParentId = t2UserMsg.parentId) with operation="edit".
          // This creates branchUser as a SIBLING of t2UserMsgId under branchParentId (same as retryUser).
          setFetchCacheContext(`${cfg.cachePrefix}branch`);
          await pinBalance(testUser.id, 40, creditLogger, creditT);
          const beforeBranch = await getBalance(
            testUser,
            creditLogger,
            creditT,
          );

          const { result: branchResult, messages: branchMsgs } =
            await runStream({
              user: testUser,
              prompt: "[T3b fork-branch] Say exactly: BRANCH_RESPONSE STEP_OK",
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: branchParentId,
              operationOverride: "edit",
            });

          expect(branchResult.success).toBe(true);
          if (!branchResult.success) {
            return;
          }

          branchForkAiMsgId = branchResult.data.lastAiMessageId!;

          // ── T3b exact parentId chain (UI-matching): branchParent → branchUser → branchAi ──
          // branchUser must be a SIBLING of both t2UserMsgId and retryUser under branchParentId.
          // All three (t2UserMsgId, retryUser, branchUser) are children of branchParentId.
          const branchParentAllChildren = branchMsgs.filter(
            (m) => m.parentId === branchParentId,
          );
          // Must have at least 3 children at branchParentId:
          // - t2UserMsgId (original T2 user message)
          // - retryUser (T3a retry user message)
          // - branchUser (T3b fork user message)
          expect(
            branchParentAllChildren.length,
            `T3b: branchParentId must have at least 3 children (t2UserMsg + retryUser + branchUser). ` +
              `Got ${String(branchParentAllChildren.length)}: ${JSON.stringify(branchParentAllChildren.map((m) => ({ id: m.id, role: m.role, content: m.content?.slice(0, 40) })))}`,
          ).toBeGreaterThanOrEqual(3);

          // Identify branchUser by content
          const branchUser = branchParentAllChildren.find(
            (m) => m.role === "user" && m.content?.includes("T3b fork-branch"),
          );
          expect(
            branchUser,
            `T3b: could not find branch user message with content 'T3b fork-branch' as child of branchParentId. ` +
              `Children: ${JSON.stringify(branchParentAllChildren.map((m) => ({ id: m.id, role: m.role, content: m.content?.slice(0, 60) })))}`,
          ).toBeDefined();

          // retryUser and branchUser are distinct siblings
          expect(
            branchUser!.id,
            "T3b: branchUser must be a different message from retryUser",
          ).not.toBe(retryUser!.id);

          // Branch AI has correct content
          const branchAi = branchMsgs.find((m) => m.id === branchForkAiMsgId);
          expect(branchAi?.content).toContain("BRANCH");
          assertStepOk(branchAi?.content, "T3b");

          // branchAi must point directly at branchUser
          expect(
            branchAi!.parentId,
            `T3b: branchAi.parentId must be branchUser.id=${branchUser!.id}`,
          ).toBe(branchUser!.id);

          // Exact branch chain: [t1UserMsgId, ..., branchParentId, branchUser.id, branchAi.id]
          // branchParentId must be immediately before branchUser
          const branchChain = walkChain(branchMsgs, branchAi!.id);
          expect(branchChain.length).toBeGreaterThanOrEqual(4);
          expect(branchChain[0]).toBe(t1UserMsgId);
          expect(branchChain[branchChain.length - 1]).toBe(branchForkAiMsgId);
          expect(branchChain[branchChain.length - 2]).toBe(branchUser!.id);
          expect(
            branchChain[branchChain.length - 3],
            `T3b: the message immediately before branchUser must be branchParentId=${branchParentId}. ` +
              `Both retry and fork branches must share the same branch point. ` +
              `If wrong, the branch won't appear in the UI.`,
          ).toBe(branchParentId);

          // Verify both retry and fork chains share identical prefix up to branchParentId,
          // then diverge to different siblings.
          const retryForkPoint = retryChain.indexOf(branchParentId);
          const branchForkPoint = branchChain.indexOf(branchParentId);
          expect(
            retryForkPoint,
            `T3b: branchParentId must be in retryChain`,
          ).toBeGreaterThanOrEqual(0);
          expect(
            branchForkPoint,
            `T3b: branchParentId must be in branchChain`,
          ).toBeGreaterThanOrEqual(0);
          // Shared prefix up to and including branchParentId must be identical
          expect(retryChain.slice(0, retryForkPoint + 1)).toEqual(
            branchChain.slice(0, branchForkPoint + 1),
          );
          // After branchParentId: the very next node must be DIFFERENT (different user msgs)
          expect(retryChain[retryForkPoint + 1]).not.toBe(
            branchChain[branchForkPoint + 1],
          );

          // T3b: expectedLeaf = branchForkAiMsgId; lastMainAiMsgId + T3a retry end are allowed leaves
          assertNoOrphans(branchMsgs, new Set([branchParentId]), {
            expectedLeafId: branchForkAiMsgId,
            knownDeadEndLeaves: new Set([...deadEndLeaves, branchRetryAiMsgId]),
          });
          // Both branch tips are dead-ends: T4 may continue from them, but if skipped
          // (e.g. queue mode) they remain leaves. Register them so subsequent tests pass.
          deadEndLeaves.add(branchRetryAiMsgId);
          deadEndLeaves.add(branchForkAiMsgId);
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const afterBranch = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(beforeBranch, afterBranch, 0, 10);
        },
        effectiveTestTimeout,
      );

      // ── T4: Music gen (from retry branch) + video gen (from fork branch) ──
      fit("T4: music + video generation - continue from both branches, verify media tool results", async () => {
        // music (~60s) + video (~120s) + revival polling (180s budget) → 6 min
        // ── Part A: Music gen from retry branch ──
        setFetchCacheContext(`${cfg.cachePrefix}music-generation`);
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeMusic = await getBalance(testUser, creditLogger, creditT);
        const prevCountMusic = (await fetchThreadMessages(threadId)).length;

        const { result: musicResult, messages: musicMsgs } = await runStream({
          user: testUser,
          prompt: `[T4a music-gen] Call ${toolInstrWithArgs(cfg, "generate_music", "prompt='upbeat piano melody'")}. Check that the result has a non-empty audioUrl, a positive creditCost, and durationSeconds between 8 and 120. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`,
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: branchRetryAiMsgId,
        });

        expect(musicResult.success).toBe(true);
        if (!musicResult.success) {
          return;
        }

        const musicAdded = newMessages(musicMsgs, prevCountMusic);

        // T4a: music user must be direct child of branchRetryAiMsgId (not some other node)
        const musicUser = musicAdded.find((m) => m.role === "user");
        expect(
          musicUser?.parentId,
          `T4a: music user parentId must be branchRetryAiMsgId=${branchRetryAiMsgId}`,
        ).toBe(branchRetryAiMsgId);

        // Tool message - find the successful one (AI may retry on duration mismatch)
        const musicToolMsgs = musicAdded.filter(
          (m) =>
            m.role === "tool" &&
            (m.toolCall?.toolName === "generate_music" ||
              (m.toolCall?.toolName === "execute-tool" &&
                toolResultRecord(m.toolCall.args)?.["toolName"] ===
                  "generate_music")),
        );
        expect(musicToolMsgs.length).toBeGreaterThanOrEqual(1);
        const musicToolMsg = musicToolMsgs.find(
          (m) => resolveToolResult(m) !== null,
        );
        expect(musicToolMsg).toBeDefined();
        if (musicToolMsg) {
          assertRemoteToolCall(musicToolMsg, "generate_music", cfg);
        }

        // Args: prompt must be the meaningful string passed in the test - not a parse artifact like "}"
        // In queue mode (execute-tool wrapper), prompt is nested inside input.prompt.
        // In direct mode, prompt is at the top level of args.
        const musicArgs = toolResultRecord(musicToolMsg!.toolCall?.args);
        const musicPrompt =
          (musicArgs?.["prompt"] as string | undefined) ??
          (toolResultRecord(musicArgs?.["input"] as WidgetData)?.["prompt"] as
            | string
            | undefined);
        expect(
          typeof musicPrompt === "string" && musicPrompt.length > 3,
          `[T4a] generate_music args.prompt must be a meaningful string - got: ${JSON.stringify(musicPrompt)}`,
        ).toBe(true);

        const musicRes = resolveToolResult(musicToolMsg);
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

        // Exact chain: [t1UserMsgId, ..., t1ToolAiMsgId, retryUser, branchRetryAiMsgId, musicUser, ..., musicLastAi]
        // branchRetryAiMsgId must appear BEFORE musicUser in the chain.
        const musicChain = walkChain(
          musicMsgs,
          musicResult.data.lastAiMessageId!,
        );
        expect(musicChain[0]).toBe(t1UserMsgId);
        expect(musicChain).toContain(t1AiMsgId);
        const musicBranchIdx = musicChain.indexOf(branchRetryAiMsgId);
        expect(
          musicBranchIdx,
          `T4a: branchRetryAiMsgId must be in the music chain (it's the branch point this T4a hangs off)`,
        ).toBeGreaterThanOrEqual(0);
        // musicUser must be immediately after branchRetryAiMsgId in the chain
        expect(
          musicChain[musicBranchIdx + 1],
          `T4a: musicUser must be immediately after branchRetryAiMsgId in the chain`,
        ).toBe(musicUser!.id);
        assertChronologicalOrder(musicChain, musicMsgs);

        // T4a: expectedLeaf = T4a music end; T2 end is dead-end; branchForkAiMsgId is the other active tip
        assertNoOrphans(musicMsgs, new Set([t2BranchParentId]), {
          expectedLeafId: musicResult.data.lastAiMessageId!,
          knownDeadEndLeaves: new Set([...deadEndLeaves, branchForkAiMsgId]),
        });
        // T4a music branch is now a dead-end (T4b video is the main continuation)
        deadEndLeaves.add(musicResult.data.lastAiMessageId!);
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterMusic = await getBalance(testUser, creditLogger, creditT);
        assertDeducted(beforeMusic, afterMusic, 0, 15);

        // ── Part B: Video gen from fork branch ──
        setFetchCacheContext(`${cfg.cachePrefix}video-generation`);
        await pinBalance(testUser.id, 50, creditLogger, creditT);
        const beforeVideo = await getBalance(testUser, creditLogger, creditT);
        const prevCountVideo = (await fetchThreadMessages(threadId)).length;

        const { result: videoResult, messages: videoMsgs } = await runStream({
          user: testUser,
          prompt: `[T4b video-gen] Call ${toolInstrWithArgs(cfg, "generate_video", "prompt='spinning cube'")}. Check that the result has a non-empty videoUrl, a positive creditCost, and a positive durationSeconds. End your reply with STEP_OK if everything was correct, or FAILED: <reason> if anything was wrong.`,
          threadId,
          favoriteId: mainFavoriteId,
          explicitParentMessageId: branchForkAiMsgId,
        });

        expect(videoResult.success).toBe(true);
        if (!videoResult.success) {
          return;
        }

        const videoAdded = newMessages(videoMsgs, prevCountVideo);

        // T4b: video user must be direct child of branchForkAiMsgId (not branchRetryAiMsgId or t1ToolAi)
        const videoUser = videoAdded.find((m) => m.role === "user");
        expect(
          videoUser?.parentId,
          `T4b: video user parentId must be branchForkAiMsgId=${branchForkAiMsgId} (not branchRetryAiMsgId=${branchRetryAiMsgId})`,
        ).toBe(branchForkAiMsgId);

        // Tool message
        const videoToolMsg = findToolMsg(videoAdded, "generate_video", cfg);
        expect(videoToolMsg).toBeDefined();
        if (videoToolMsg) {
          assertRemoteToolCall(videoToolMsg, "generate_video", cfg);
        }

        const videoRes = resolveToolResult(videoToolMsg);
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

        // Exact chain: [t1UserMsgId, ..., t1ToolAiMsgId, branchUser, branchForkAiMsgId, videoUser, ..., videoLastAi]
        // branchForkAiMsgId must appear in chain AND videoUser must be immediately after it.
        const videoChain = walkChain(
          videoMsgs,
          videoResult.data.lastAiMessageId!,
        );
        expect(videoChain[0]).toBe(t1UserMsgId);
        const videoForkIdx = videoChain.indexOf(branchForkAiMsgId);
        expect(
          videoForkIdx,
          `T4b: branchForkAiMsgId must be in the video chain (it's the fork branch this T4b hangs off)`,
        ).toBeGreaterThanOrEqual(0);
        // videoUser must be immediately after branchForkAiMsgId in the chain
        expect(
          videoChain[videoForkIdx + 1],
          `T4b: videoUser must be immediately after branchForkAiMsgId in the chain`,
        ).toBe(videoUser!.id);
        // music chain must NOT appear in the video chain (they are independent branches)
        expect(
          videoChain,
          `T4b: video chain must not contain branchRetryAiMsgId - these are independent branches`,
        ).not.toContain(branchRetryAiMsgId);
        assertChronologicalOrder(videoChain, videoMsgs);

        // T4b: lastMainAiMsgId is now the sole active tip; deadEndLeaves has T2 end + T4a music end
        assertNoOrphans(videoMsgs, new Set([t2BranchParentId]), {
          expectedLeafId: lastMainAiMsgId,
          knownDeadEndLeaves: deadEndLeaves,
        });
        await assertThreadIdle(threadId);
        await assertNoPendingTasks(threadId);

        const afterVideo = await getBalance(testUser, creditLogger, creditT);
        // Video gen: LTX_2_PRO_T2V = 1.4/sec × 6sec × 1.3 markup ≈ 10.9 + chat model ~1
        assertDeducted(beforeVideo, afterVideo, 5, 20);
      }, 360_000); // 6 min: music (~60s) + video (~120s) + two revival polls (180s each)

      // ── T5: detach dispatch - AI calls generate_image(detach), gets taskId ──
      fit(
        "T5: detach dispatch - AI calls generate_image with detach, gets taskId back",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}callback-wait-step1`);
          await pinBalance(testUser.id, 20, creditLogger, creditT);
          const prevCount = (await fetchThreadMessages(threadId)).length;

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T5 detach-dispatch] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='wait-for-task-test' and callbackMode='detach'")}. Check that the result has a taskId string and status field, and does NOT have an imageUrl. End your reply with STEP_OK and the exact taskId value like: STEP_OK taskId=<value>. Or FAILED: <reason> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          const added = newMessages(messages, prevCount);

          const genImgMsg = findToolMsg(added, "generate_image", cfg);
          expect(
            genImgMsg,
            "[T5] generate_image tool message not found",
          ).toBeDefined();
          if (genImgMsg) {
            assertRemoteToolCall(genImgMsg, "generate_image", cfg);
          }

          const genImgRes = resolveToolResult(genImgMsg);
          expect(
            genImgRes,
            "[T5] generate_image result is null",
          ).not.toBeNull();
          expect(
            typeof genImgRes!["taskId"],
            `[T5] taskId missing in detach result: ${JSON.stringify(genImgRes)}`,
          ).toBe("string");
          expect(
            genImgRes!["imageUrl"],
            "[T5] imageUrl must not be present in detach result",
          ).toBeUndefined();

          // Save for T5b - also patch T5b fixtures so replay uses the real taskId
          t5DetachTaskId = genImgRes!["taskId"] as string;
          patchFetchCacheFixtures(
            `${cfg.cachePrefix}callback-wait-step2`,
            "T5B_TASK_ID_PLACEHOLDER",
            t5DetachTaskId,
          );

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          assertStepOk(lastAi?.content, "T5");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T5b: wait-for-task - AI calls wait-for-task with taskId from T5 ──
      fit(
        "T5b: wait-for-task - AI calls wait-for-task with detach taskId, gets imageUrl",
        async () => {
          // T5 already patched step2 fixtures: sentinel → t5DetachTaskId.
          // On first run the dir doesn't exist yet; step2 runs live and records real taskId.
          // After step2, fixtures are normalized back to sentinel for the next run.
          setFetchCacheContext(`${cfg.cachePrefix}callback-wait-step2`);
          await pinBalance(testUser.id, 20, creditLogger, creditT);
          const beforeWait = await getBalance(testUser, creditLogger, creditT);
          const prevCount = (await fetchThreadMessages(threadId)).length;

          let { result: waitResult, messages: waitMsgs } = await runStream({
            user: testUser,
            prompt: `[T5b wait-for-task] Call ${toolInstr(cfg, "wait-for-task")} with taskId='${t5DetachTaskId}'. Check that the result contains an imageUrl string (either directly or nested in a result field). End your reply with STEP_OK if imageUrl is present, or FAILED: <reason> if anything was wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(waitResult.success).toBe(true);
          if (!waitResult.success) {
            return;
          }

          // WAIT path: if wait-for-task registered as waiter (task was pending),
          // stream aborts with thread in 'waiting' state. Revival fires async when
          // the goroutine (from T5) calls handleTaskCompletion. Poll for idle, then
          // re-fetch messages so the backfilled tool result + revival AI response
          // are visible to assertions below.
          if (waitResult.success && waitResult.data.threadId) {
            const tid = waitResult.data.threadId;
            const [threadRow] = await db
              .select({ streamingState: chatThreads.streamingState })
              .from(chatThreads)
              .where(eq(chatThreads.id, tid));

            if (threadRow?.streamingState === "waiting") {
              const REVIVAL_TIMEOUT_MS = 90_000;
              const REVIVAL_POLL_INTERVAL_MS = 500;
              const revivalStart = Date.now();
              let revivalState: string | undefined = "waiting";
              while (
                revivalState !== "idle" &&
                Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
              ) {
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, REVIVAL_POLL_INTERVAL_MS);
                });
                const [revivalRow] = await db
                  .select({ streamingState: chatThreads.streamingState })
                  .from(chatThreads)
                  .where(eq(chatThreads.id, tid));
                revivalState = revivalRow?.streamingState;
              }
              expect(
                revivalState,
                "[T5b] Thread must return to 'idle' after revival",
              ).toBe("idle");

              // Re-fetch messages with post-revival state (backfilled tool result + AI response)
              waitMsgs = await fetchThreadMessages(tid);
              const lastRevivalAi = [...waitMsgs]
                .toReversed()
                .find((m) => m.role === "assistant");
              if (lastRevivalAi && waitResult.success) {
                waitResult = {
                  ...waitResult,
                  data: {
                    ...waitResult.data,
                    lastAiMessageId: lastRevivalAi.id,
                  },
                };
              }
            }
          }

          const waitAdded = newMessages(waitMsgs, prevCount);

          // Per spec (wait, same-sequence path): if no user message arrived while waiting,
          // the original wait-for-task tool message is backfilled in-place with the real result.
          // No deferred message is created. Only 1 wait-for-task tool message must exist.
          const allWftMsgs = waitAdded.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "wait-for-task" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "wait-for-task")),
          );
          expect(
            allWftMsgs.length,
            "[T5b] expected exactly 1 wait-for-task tool message (same-sequence: backfill in-place, no deferred)",
          ).toBe(1);

          const waitForTaskMsg = allWftMsgs[0]!;
          expect(
            waitForTaskMsg,
            "[T5b] wait-for-task tool message not found",
          ).toBeDefined();

          // Same-sequence: original message must NOT be marked as deferred.
          expect(
            waitForTaskMsg.toolCall?.isDeferred,
            "[T5b] wait same-sequence: original tool message must NOT be deferred (backfill in-place)",
          ).toBeFalsy();

          const wftRes = resolveToolResult(waitForTaskMsg);
          expect(wftRes, "[T5b] wait-for-task result is null").not.toBeNull();
          // Two paths depending on race:
          // (A) task pending when called → backfilled with raw image result: { imageUrl, ... }
          // (B) task already done → returns { status, result: { imageUrl }, waiting }
          const imageUrlDirect =
            typeof wftRes!["imageUrl"] === "string"
              ? wftRes!["imageUrl"]
              : undefined;
          const innerResult = imageUrlDirect
            ? wftRes
            : toolResultRecord(wftRes!["result"]);
          expect(
            innerResult,
            `[T5b] Cannot find imageUrl: ${JSON.stringify(wftRes)}`,
          ).not.toBeNull();
          expect(
            typeof innerResult!["imageUrl"],
            `[T5b] imageUrl not a string, got: ${JSON.stringify(innerResult)}`,
          ).toBe("string");

          const waitLastAi = waitMsgs.find(
            (m) => m.id === waitResult.data.lastAiMessageId,
          );
          expect(waitLastAi?.content).toBeTruthy();
          assertStepOk(waitLastAi?.content, "T5b");
          lastMainAiMsgId = waitResult.data.lastAiMessageId!;

          assertNoOrphans(waitMsgs, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const afterWait = await getBalance(testUser, creditLogger, creditT);
          // T5b only: wait-for-task + AI response (~0.3cr). Image gen was charged in T5.
          assertDeducted(beforeWait, afterWait, 0.1, 10);

          // Normalize fixtures: replace the real taskId with sentinel so the next
          // run can patch sentinel → its own taskId before replaying.
          patchFetchCacheFixtures(
            `${cfg.cachePrefix}callback-wait-step2`,
            t5DetachTaskId,
            "T5B_TASK_ID_PLACEHOLDER",
          );
        },
        effectiveTestTimeout,
      );

      // ── T5a: endLoop - tool executes, stream stops after first tool call ────
      fit(
        "T5a: endLoop - tool-help(endLoop) executes inline, stream stops after 1 call",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}callback-end-loop`);
          await pinBalance(testUser.id, 20, creditLogger, creditT);
          const beforeEndLoop = await getBalance(
            testUser,
            creditLogger,
            creditT,
          );
          const prevCountEndLoop = (await fetchThreadMessages(threadId)).length;

          const { result: endLoopResult, messages: endLoopMsgs } =
            await runStream({
              user: testUser,
              prompt: `[T5a endLoop] Call ${toolInstrWithArgs(cfg, "tool-help", "callbackMode='endLoop'")}. After receiving the result, try to call ${toolInstr(cfg, "tool-help")} again. Check that only ONE tool-help call was executed (the loop should have stopped) and the result had a non-empty tools array. End your reply with STEP_OK if exactly one call ran and the result was correct, or FAILED: <reason> if the loop continued or the result was wrong.`,
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
            });

          expect(endLoopResult.success).toBe(true);
          if (!endLoopResult.success) {
            return;
          }

          const endLoopAdded = newMessages(endLoopMsgs, prevCountEndLoop);

          // Exactly 1 tool-help call (endLoop stops the loop).
          // Per spec: endLoop ALWAYS backfills in-place regardless of transport.
          // No deferred message is ever created for endLoop - the original message
          // is updated with status="completed" and the real result directly.
          const toolHelpMsgs = endLoopAdded.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "tool-help" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "tool-help")),
          );
          expect(
            toolHelpMsgs.length,
            "T5a: expected exactly 1 tool-help message (endLoop always backfills in-place, never creates deferred)",
          ).toBe(1);

          const resultMsg = toolHelpMsgs[0]!;
          assertRemoteToolCall(resultMsg, "tool-help", cfg);

          // endLoop: original message MUST NOT be deferred - it's the backfilled in-place result.
          expect(
            resultMsg.toolCall?.isDeferred,
            "T5a: endLoop must NOT produce a deferred tool message - must backfill original in-place",
          ).toBeFalsy();

          // Result must be present directly on the original (backfilled in-place).
          const endLoopToolRes = resolveToolResult(resultMsg);
          expect(
            endLoopToolRes,
            "T5a: backfilled result must not be null",
          ).not.toBeNull();
          // tools array must be present and non-empty
          expect(
            Array.isArray(endLoopToolRes!["tools"]),
            "T5a: tools is not an array",
          ).toBe(true);
          expect(
            (endLoopToolRes!["tools"] as WidgetData[]).length,
            "T5a: tools array is empty",
          ).toBeGreaterThan(0);

          // endLoop stops the stream after tool execution - leaf is the original tool message.
          // No revival fires - thread goes idle after backfill.
          lastMainAiMsgId = resultMsg.id;

          assertNoOrphans(endLoopMsgs, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const afterEndLoop = await getBalance(
            testUser,
            creditLogger,
            creditT,
          );
          assertDeducted(beforeEndLoop, afterEndLoop, 0, 5);
        },
        effectiveTestTimeout,
      );

      // ── T5d: wait callback mode - same-sequence backfill ──────────────────
      // Per spec: when callbackMode='wait' and no user message arrives during waiting,
      // the original tool message is backfilled IN-PLACE with the real result.
      // No deferred message is created. AI sees result in the same turn.
      fit(
        "T5d: wait callback mode - original tool message backfilled in-place, no deferred created, AI gets result",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}callback-wait-inline`);
          await pinBalance(testUser.id, 20, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);
          const prevToolMsgCountBefore = (
            await fetchThreadMessages(threadId)
          ).filter((m) => m.role === "tool").length;
          const prevCount = (await fetchThreadMessages(threadId)).length;

          const { result } = await runStream({
            user: testUser,
            prompt: `[T5d wait-inline] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='wait-inline-test' and callbackMode='wait'")}. Check that the result has an imageUrl (not a taskId). End your reply with STEP_OK if imageUrl is present and non-empty, or FAILED: <reason> if anything is wrong.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          // Queue mode (cfg.pulse): revival fires async. Poll for idle, then re-fetch.
          if (result.success && result.data.threadId) {
            const tid = result.data.threadId;
            const [threadRow] = await db
              .select({ streamingState: chatThreads.streamingState })
              .from(chatThreads)
              .where(eq(chatThreads.id, tid));
            if (threadRow?.streamingState === "waiting") {
              const REVIVAL_TIMEOUT_MS = 180_000;
              const REVIVAL_POLL_INTERVAL_MS = 500;
              const revivalStart = Date.now();
              let revivalState: string | undefined = "waiting";
              while (
                revivalState !== "idle" &&
                Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
              ) {
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, REVIVAL_POLL_INTERVAL_MS);
                });
                const [revivalRow] = await db
                  .select({ streamingState: chatThreads.streamingState })
                  .from(chatThreads)
                  .where(eq(chatThreads.id, tid));
                revivalState = revivalRow?.streamingState;
              }
              expect(
                revivalState,
                "[T5d] Thread must return to 'idle' after wait revival",
              ).toBe("idle");
            }
          }

          const allMessages = await fetchThreadMessages(threadId);
          const added = newMessages(allMessages, prevCount);

          // ── Exactly 1 generate_image tool message (same-sequence: backfill in-place) ──
          const imgToolMsgs = added.filter(
            (m) =>
              m.role === "tool" &&
              (m.toolCall?.toolName === "generate_image" ||
                (m.toolCall?.toolName === "execute-tool" &&
                  toolResultRecord(m.toolCall.args)?.["toolName"] ===
                    "generate_image")),
          );
          expect(
            imgToolMsgs.length,
            "T5d: expected exactly 1 generate_image tool message (wait same-sequence: backfill in-place, no deferred)",
          ).toBe(1);

          const imgToolMsg = imgToolMsgs[0]!;

          // Original message must NOT be marked as deferred (backfill in-place = not deferred).
          expect(
            imgToolMsg.toolCall?.isDeferred,
            "T5d: wait same-sequence must NOT produce a deferred tool message",
          ).toBeFalsy();

          // Result must be present on the original (backfilled in-place).
          const imgRes = resolveToolResult(imgToolMsg);
          expect(
            imgRes,
            "T5d: backfilled result must not be null",
          ).not.toBeNull();
          expect(
            typeof imgRes!["imageUrl"],
            `T5d: imageUrl not a string. Result: ${JSON.stringify(imgRes)}`,
          ).toBe("string");
          expect(
            imgRes!["imageUrl"],
            "T5d: imageUrl must be non-empty",
          ).toBeTruthy();

          // ── Total tool count must not have grown beyond +1 ──
          const afterToolMsgCount = allMessages.filter(
            (m) => m.role === "tool",
          ).length;
          expect(
            afterToolMsgCount,
            `T5d: extra tool message(s) created (was ${String(prevToolMsgCountBefore)}, now ${String(afterToolMsgCount)}) - wait backfill must not create extra messages`,
          ).toBe(prevToolMsgCountBefore + 1);

          const lastAi = allMessages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          expect(lastAi?.content).toBeTruthy();
          assertStepOk(lastAi?.content, "T5d");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(allMessages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0.4, 15);
        },
        effectiveTestTimeout,
      );

      // ── T5c: execute-tool direct call ─────────────────────────────────────
      fit(
        "T5c: execute-tool direct call - tool-help via execute-tool wrapper",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}execute-tool-direct`);
          await pinBalance(testUser.id, 10, creditLogger, creditT);
          const prevCount = (await fetchThreadMessages(threadId)).length;

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T5c execute-tool-direct] Call the execute-tool endpoint with toolName='tool-help' and input={}${cfg.remoteInstanceId ? ` and instanceId='${cfg.remoteInstanceId}'` : ""}. Check that the inner result contains a tools array with at least one entry. End your reply with STEP_OK if a tools list was returned, or FAILED: <reason> if the result was missing or malformed.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          const added = newMessages(messages, prevCount);
          // AI may call execute-tool directly or call tool-help - either way a tool must have run
          const anyToolMsg = added.find((m) => m.role === "tool");
          expect(anyToolMsg, "T5c: no tool call found").toBeDefined();

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          assertStepOk(lastAi?.content, "T5c");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);
        },
        effectiveTestTimeout,
      );

      // ── T6: wakeUp - two-phase E2E ──────────────────────────────────────
      describe("T6: wakeUp (two-phase)", () => {
        let wakeupToolMsgId: string;
        let wakeupMsgCount: number;

        fit(
          "T6a: wakeUp phase1 - image dispatched async, AI gets taskId, stream ends naturally",
          async () => {
            setFetchCacheContext(`${cfg.cachePrefix}callback-wakeup-phase1`);
            await pinBalance(testUser.id, 20, creditLogger, creditT);
            const before = await getBalance(testUser, creditLogger, creditT);
            wakeupMsgCount = (await fetchThreadMessages(threadId)).length;

            const { result, messages } = await runStream({
              user: testUser,
              prompt: `[T6a wakeUp-phase1] Call ${toolInstrWithArgs(cfg, "generate_image", "prompt='wakeup-test' and callbackMode='wakeUp'")}. The image will be generated asynchronously. IMPORTANT: In this first phase you should receive a taskId with no imageUrl yet - end your reply with STEP_OK if you see taskId and no imageUrl, or FAILED: <reason> otherwise. ALSO IMPORTANT: You will be automatically revived when the image is ready. When revived (you will see the generate_image tool result containing an imageUrl), confirm the imageUrl is present and non-empty, then end with WAKEUP_OK. If revived but imageUrl is missing or empty, end with WAKEUP_FAILED: <reason>.`,
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
            const toolMsg = findToolMsg(added, "generate_image", cfg);
            expect(toolMsg).toBeDefined();
            if (toolMsg) {
              assertRemoteToolCall(toolMsg, "generate_image", cfg);
            }
            wakeupToolMsgId = toolMsg!.id;

            // wakeUp phase1: imageUrl must NOT be present - the image is being generated async.
            // If imageUrl is here it means wakeUp ran synchronously, which violates semantics.
            // result may be null (local wakeUp - backfilled on revival) or { taskId, status }
            // (remote wakeUp via execute-tool). Both are valid; what matters is no imageUrl yet.
            const phase1Res = resolveToolResult(toolMsg);
            if (phase1Res) {
              expect(
                phase1Res["imageUrl"],
                `T6a: wakeUp must NOT have imageUrl in phase1 - image arrived synchronously, violating wakeUp semantics. Got: ${JSON.stringify(phase1Res)}`,
              ).toBeUndefined();
            }

            // ── Stream ended, AI wrapped up ──
            const lastAi = messages.find(
              (m) => m.id === result.data.lastAiMessageId,
            );
            expect(lastAi).toBeDefined();
            assertStepOk(lastAi?.content, "T6a");
            lastMainAiMsgId = result.data.lastAiMessageId!;

            // Queue mode: wakeUp task is in the cron queue (not directly accessible).
            // The stream ends normally (thread → idle), then we explicitly fire the pulse
            // to execute the background task and trigger the revival BEFORE T6b polls.
            // For direct mode, the goroutine already fired the image gen in the background.
            if (cfg.pulse) {
              await cfg.pulse(threadId);
              // Wait for thread to return to idle (revival completes inside cfg.pulse).
              const REVIVAL_TIMEOUT_MS = 180_000;
              const REVIVAL_POLL_INTERVAL_MS = 500;
              const revivalStart = Date.now();
              let revivalState: string | undefined = "waiting";
              while (
                revivalState !== "idle" &&
                Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
              ) {
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, REVIVAL_POLL_INTERVAL_MS);
                });
                const [revivalRow] = await db
                  .select({ streamingState: chatThreads.streamingState })
                  .from(chatThreads)
                  .where(eq(chatThreads.id, threadId));
                revivalState = revivalRow?.streamingState;
              }
            }

            // wakeUp phase1: thread may be "waiting" (goroutine still running) or
            // "idle" (goroutine + revival finished fast in cache mode). Both are valid.
            // We verify revival results in T6b - not timing state here.
            // Chain integrity: revival may or may not have landed yet - skip expectedLeafId check here.
            assertNoOrphans(messages, new Set([t2BranchParentId]), {
              knownDeadEndLeaves: deadEndLeaves,
            });

            const after = await getBalance(testUser, creditLogger, creditT);
            assertDeducted(before, after, 0, 5);
          },
          effectiveTestTimeout,
        );

        fit(
          "T6b: wakeUp phase2 - revival, AI sees backfilled result, responds naturally",
          async () => {
            expect(wakeupToolMsgId).toBeTruthy();

            // The wakeUp revival fires async during T6a (goroutine + resume-stream fire-and-forget).
            // In cache mode it may complete before T6a even returns, or after. Search the
            // full thread for the deferred tool (isDeferred=true, has imageUrl) and revival AI.
            // wakeupMsgCount is unreliable here - revival may already be in messages from T6a.
            let messages: SlimMessage[] = [];
            const deadline = Date.now() + effectiveTestTimeout - 5000;
            let deferredTool: SlimMessage | undefined;
            let revivalAi: SlimMessage | undefined;
            while (Date.now() < deadline) {
              messages = await fetchThreadMessages(threadId);
              // Deferred tool: isDeferred=true in toolCall metadata + has imageUrl result
              deferredTool = messages.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.isDeferred === true &&
                  resolveToolResult(m)?.["imageUrl"] !== undefined &&
                  (cfg.remoteInstanceId
                    ? m.toolCall.toolName === "execute-tool" &&
                      toolResultRecord(m.toolCall.args)?.["toolName"] ===
                        "generate_image"
                    : m.toolCall.toolName === "generate_image" ||
                      (m.toolCall.toolName === "execute-tool" &&
                        toolResultRecord(m.toolCall.args)?.["toolName"] ===
                          "generate_image")),
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
                // Wait for thread to go idle so the revival stream fully completes
                // (including flushing the fetch-cache res fixture) before we cancel tasks.
                const [tRow] = await db
                  .select({ streamingState: chatThreads.streamingState })
                  .from(chatThreads)
                  .where(eq(chatThreads.id, threadId));
                if (tRow?.streamingState === "idle") {
                  break;
                }
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
              const deferredRes = toolResultRecord(
                deferredTool.toolCall?.result,
              );
              expect(typeof deferredRes!["imageUrl"]).toBe("string");
              expect(deferredRes!["imageUrl"]).toBeTruthy();

              // Deferred message must be marked isDeferred=true.
              expect(
                deferredTool.toolCall?.isDeferred,
                "T6b: deferred tool message must have isDeferred=true",
              ).toBe(true);

              // Deferred message must link back to the original via originalToolCallId.
              expect(
                deferredTool.toolCall?.originalToolCallId,
                "T6b: deferred tool message must have originalToolCallId linking to original",
              ).toBeTruthy();
            }

            // ── Original tool message from phase1 must NOT be modified ──
            // Per spec: wakeUp original message is never updated after creation.
            // The result lives in the deferred message only.
            const originalToolInDb = messages.find(
              (m) => m.id === wakeupToolMsgId,
            );
            expect(
              originalToolInDb,
              "T6b: original wakeUp tool message must still exist in DB",
            ).toBeDefined();
            if (originalToolInDb) {
              const origRes = resolveToolResult(originalToolInDb);
              // Original should NOT have imageUrl - that's in the deferred message.
              expect(
                origRes?.["imageUrl"],
                "T6b: wakeUp original tool message must NOT have imageUrl - result goes to deferred",
              ).toBeUndefined();
            }

            // ── Revival AI: child of the deferred tool ──
            expect(
              revivalAi,
              "T6b: no revival AI message parented to deferred tool - revival never fired or AI didn't respond",
            ).toBeDefined();

            // Update lastMainAiMsgId to revival AI so T7a chains correctly.
            if (revivalAi) {
              expect(revivalAi.content).toBeTruthy();
              // Revival AI must acknowledge the imageUrl - it sees the deferred result
              // with the real imageUrl and was instructed to end with WAKEUP_OK.
              // This confirms the revival AI received the same result as a regular tool call.
              // Strip <think>...</think> blocks (reasoning models) before asserting —
              // the model may reason about WAKEUP_FAILED internally before concluding WAKEUP_OK.
              const revivalVisible = (revivalAi.content ?? "").replace(
                /<think>[\s\S]*?<\/think>/g,
                "",
              );
              expect(
                revivalVisible,
                `T6b: revival AI content must contain WAKEUP_OK - got: ${revivalAi.content?.slice(0, 300)}`,
              ).toContain("WAKEUP_OK");
              expect(
                revivalVisible,
                `T6b: revival AI must NOT contain WAKEUP_FAILED - got: ${revivalAi.content?.slice(0, 300)}`,
              ).not.toContain("WAKEUP_FAILED");
              lastMainAiMsgId = revivalAi.id;
            } else if (deferredTool) {
              lastMainAiMsgId = deferredTool.id;
            }

            // Cancel wakeUp tasks and force idle.
            // USER_CANCELLED abort does not emit an error message (isSilentStop=true),
            // so this is safe - no orphan error messages will be left in the thread.
            await cancelThreadTasks(threadId);
            await db.execute(
              sql`UPDATE chat_threads SET streaming_state = 'idle' WHERE id = ${threadId}`,
            );

            // Re-fetch after goroutine settles, then verify chain integrity.
            messages = await fetchThreadMessages(threadId);
            assertNoOrphans(messages, new Set([t2BranchParentId]), {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            });
            await assertThreadIdle(threadId);
            await assertNoPendingTasks(threadId);
          },
          effectiveTestTimeout,
        );
      });

      // ── T7: Approve - two-phase (parallel tools + correct UI confirm flow) ─
      describe("T7: approve (two-phase)", () => {
        // Saved across T7a → T7b
        let approveToolMsgId: string;
        let approveToolParentId: string | null;

        fit(
          "T7a: approve phase1 - parallel tools: tool-help runs, generate_image awaits confirmation, no assistant message after",
          async () => {
            setFetchCacheContext(`${cfg.cachePrefix}callback-approve-phase1`);
            await pinBalance(testUser.id, 10, creditLogger, creditT);
            const before = await getBalance(testUser, creditLogger, creditT);
            const prevCount = (await fetchThreadMessages(threadId)).length;

            // Prompt: call BOTH tool-help AND generate_image in same parallel step.
            // generate_image requires confirmation → placeholder only, stream aborts before AI response.
            const { result, messages } = await runStream({
              user: testUser,
              prompt: `[T7a approve-phase1] In a single response, call BOTH at the same time: (1) ${toolInstr(cfg, "tool-help")} to list available tools, and (2) ${toolInstrWithArgs(cfg, "generate_image", "prompt='approve-test'")}. The generate_image tool requires user confirmation - it should NOT execute yet. End your reply with STEP_OK after the tool calls.`,
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
              availableTools: [
                {
                  // execute-tool wrapping: remoteInstanceId mode or unbottled/hermes mode
                  toolId:
                    (cfg.remoteInstanceId ?? cfg.providerOverride)
                      ? "execute-tool"
                      : "generate_image",
                  requiresConfirmation: true,
                },
              ],
            });

            expect(result.success).toBe(true);
            if (!result.success) {
              return;
            }

            const added = newMessages(messages, prevCount);

            // ── generate_image tool message - has waiting_for_confirmation placeholder ──
            const approveToolMsg =
              findToolMsg(added, "generate_image", cfg) ??
              added.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.toolName === "generate_image",
              );
            expect(
              approveToolMsg,
              "T7a: generate_image tool message not found",
            ).toBeDefined();
            if (approveToolMsg) {
              assertRemoteToolCall(approveToolMsg, "generate_image", cfg);
            }
            approveToolMsgId = approveToolMsg!.id;
            approveToolParentId = approveToolMsg!.parentId;

            const toolRes = resolveToolResult(approveToolMsg);
            // Must NOT have executed - no imageUrl, must have waiting_for_confirmation
            expect(
              toolRes?.["imageUrl"],
              "T7a: imageUrl present - tool executed without approval (requiresConfirmation=true was ignored)",
            ).toBeUndefined();
            expect(
              toolRes?.["status"],
              "T7a: expected waiting_for_confirmation status",
            ).toBe("waiting_for_confirmation");

            // ── tool-help ran (parallel to generate_image) - has real result ──
            const toolHelpMsg = findToolMsg(added, "tool-help", cfg);
            expect(
              toolHelpMsg,
              "T7a: tool-help message not found in parallel step",
            ).toBeDefined();
            const toolHelpRes = resolveToolResult(toolHelpMsg);
            expect(
              toolHelpRes,
              "T7a: tool-help should have returned a result",
            ).not.toBeNull();

            // ── Both parallel tool messages share the same sequenceId ──
            if (approveToolMsg && toolHelpMsg) {
              expect(
                approveToolMsg.sequenceId,
                "T7a: parallel tools must share same sequenceId",
              ).toBe(toolHelpMsg.sequenceId);
            }

            // ── NO assistant message after the parallel tool calls ──
            // Stream aborts at finish-step before AI response (TOOL_CONFIRMATION abort reason).
            const assistantAfterTools = added.filter(
              (m) =>
                m.role === "assistant" &&
                m.createdAt.getTime() >
                  (approveToolMsg?.createdAt.getTime() ?? 0),
            );
            expect(
              assistantAfterTools.length,
              "T7a: assistant message present after parallel tool calls - stream should have aborted before AI response",
            ).toBe(0);

            // ── Thread must be idle (stream aborted cleanly) ──
            // T7a: lastMainAiMsgId is NOT a leaf - tool messages hang as pending leaves.
            // Skip expectedLeafId; T7b will update lastMainAiMsgId after confirmation.
            assertNoOrphans(messages, new Set([t2BranchParentId]), {
              knownDeadEndLeaves: deadEndLeaves,
            });
            await assertThreadIdle(threadId);
            await assertNoPendingTasks(threadId);

            // lastMainAiMsgId is NOT updated here - T7b confirmation chains from the same
            // parent as the approve tool message (approveToolParentId = assistant placeholder).
            const after = await getBalance(testUser, creditLogger, creditT);
            assertDeducted(before, after, 0, 3);
          },
          effectiveTestTimeout,
        );

        fit(
          "T7b: approve phase2 - confirm via UI-style parentId flow, original message backfilled in-place, no extra tool message, AI responds",
          async () => {
            expect(
              approveToolMsgId,
              "T7b needs T7a approveToolMsgId",
            ).toBeTruthy();
            expect(
              approveToolParentId,
              "T7b needs T7a approveToolParentId",
            ).toBeTruthy();

            setFetchCacheContext(`${cfg.cachePrefix}callback-approve-phase2`);
            await pinBalance(testUser.id, 15, creditLogger, creditT);
            const before = await getBalance(testUser, creditLogger, creditT);

            const prevMessages = await fetchThreadMessages(threadId);
            const prevToolMsgCount = prevMessages.filter(
              (m) => m.role === "tool",
            ).length;

            const logger = createEndpointLogger(
              false,
              Date.now(),
              defaultLocale,
            );
            const { t } = scopedTranslation.scopedT(defaultLocale);

            // Mirror the UI flow exactly: parentId = approveToolMsg.parentId (assistant placeholder that
            // issued the tool calls), matching grouped-assistant-message.tsx lines ~593-599.
            // Note: answer-as-ai operation is chosen when explicitParentMessageId is set (no new user msg),
            // and toolConfirmations skips user message creation - no branch violation.
            const confirmResult = await runHeadlessAiStream({
              prompt: "",
              favoriteId: mainFavoriteId,
              threadId,
              rootFolderId: DefaultFolderId.CRON,
              subAgentDepth: 0,
              toolConfirmations: [
                { messageId: approveToolMsgId, confirmed: true },
              ],
              user: testUser,
              locale: defaultLocale,
              logger,
              t,
              abortSignal: new AbortController().signal,
            });

            expect(confirmResult.success).toBe(true);
            if (!confirmResult.success) {
              return;
            }

            // Queue mode: confirmation executed execute-tool with callbackMode='wait' override,
            // which created a queue task (isDirectlyAccessible=false). The AI responded to the
            // pending {status: pending} result. Now call pulse to execute the generate_image task
            // and fire the WAIT revival stream so the tool message gets the real imageUrl.
            if (cfg.pulse) {
              await cfg.pulse(threadId);
              // Wait for thread to return to idle (revival completes inside cfg.pulse).
              const REVIVAL_TIMEOUT_MS = 180_000;
              const REVIVAL_POLL_INTERVAL_MS = 500;
              const revivalStart = Date.now();
              let revivalState: string | undefined = "waiting";
              while (
                revivalState !== "idle" &&
                Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
              ) {
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, REVIVAL_POLL_INTERVAL_MS);
                });
                const [revivalRow] = await db
                  .select({ streamingState: chatThreads.streamingState })
                  .from(chatThreads)
                  .where(eq(chatThreads.id, threadId));
                revivalState = revivalRow?.streamingState;
              }
              expect(
                revivalState,
                "T7b queue: thread must return to 'idle' after approval revival",
              ).toBe("idle");
            }

            const messages = await fetchThreadMessages(threadId);

            // ── Dump ALL tool messages for diagnosis ──
            const allToolMsgs = messages.filter((m) => m.role === "tool");
            const allToolMsgIds = allToolMsgs.map((m) => m.id);
            const approveToolMsgInList = messages.find(
              (m) => m.id === approveToolMsgId,
            );

            // ── Original tool message backfilled IN-PLACE (same ID) - no extra tool message ──
            const toolMsg = messages.find(
              (m) => m.role === "tool" && m.id === approveToolMsgId,
            );
            expect(
              toolMsg,
              `T7b: generate_image tool message not found by approveToolMsgId=${approveToolMsgId}. All msg IDs: [${allToolMsgIds.join(", ")}]. approveToolMsgInList role=${approveToolMsgInList?.role}`,
            ).toBeDefined();

            const toolRes = resolveToolResult(toolMsg);
            const rawResult = toolMsg!.toolCall?.result;
            expect(
              toolRes,
              `T7b: tool result is null. toolCall=${JSON.stringify(toolMsg?.toolCall).slice(0, 200)}`,
            ).not.toBeNull();
            expect(
              typeof toolRes!["imageUrl"],
              `T7b: imageUrl not a string. Full toolRes=${JSON.stringify(rawResult).slice(0, 300)}`,
            ).toBe("string");
            expect(
              toolRes!["imageUrl"],
              "T7b: imageUrl should be truthy",
            ).toBeTruthy();

            // ── Same-sequence: original backfilled in-place (no deferred) ──
            // Different-sequence: user sent a follow-up before confirming → deferred message
            // created instead, count +1. T7b runs with no interleaved user messages, so
            // same-sequence path applies: count unchanged, original must NOT be deferred.
            expect(
              toolMsg?.toolCall?.isDeferred,
              "T7b: approve same-sequence backfill must NOT mark original as deferred",
            ).toBeFalsy();

            // ── No extra tool message was created (same-sequence: in-place backfill only) ──
            const afterToolMsgCount = messages.filter(
              (m) => m.role === "tool",
            ).length;
            expect(
              afterToolMsgCount,
              `T7b: extra tool message created (was ${String(prevToolMsgCount)}, now ${String(afterToolMsgCount)}) - same-sequence approve must backfill in-place, not create deferred`,
            ).toBe(prevToolMsgCount);

            // ── AI responded with the confirmed result ──
            // Queue mode: revival creates a NEW AI message after backfilling the tool result.
            // Use the last assistant message in the thread (which is the revival's AI message).
            // Non-queue: confirmResult.data.lastAiMessageId is the AI's response.
            const effectiveLastAiMsgId = cfg.pulse
              ? ([...messages].toReversed().find((m) => m.role === "assistant")
                  ?.id ?? confirmResult.data.lastAiMessageId!)
              : confirmResult.data.lastAiMessageId!;
            const lastAi = messages.find((m) => m.id === effectiveLastAiMsgId);
            expect(
              lastAi?.content,
              "T7b: AI should have responded after confirmation",
            ).toBeTruthy();

            // ── creditCost > 0 - image was actually generated ──
            expect(
              toolRes!["creditCost"] as number,
              "T7b: creditCost should be > 0 after approval execution",
            ).toBeGreaterThan(0);

            lastMainAiMsgId = effectiveLastAiMsgId;
            assertNoOrphans(messages, new Set([t2BranchParentId]), {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            });
            await assertThreadIdle(threadId);
            await assertNoPendingTasks(threadId);

            const after = await getBalance(testUser, creditLogger, creditT);
            assertDeducted(before, after, 0.47, 10);
          },
          effectiveTestTimeout,
        );
      });

      // ── T8: Parallel tool calls ──────────────────────────────────────────
      fit(
        "T8: parallel tools - tool-help + generate_image in same batch, both results populated",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}parallel-tools`);
          await pinBalance(testUser.id, 20, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);
          const prevCount = (await fetchThreadMessages(threadId)).length;

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T8 parallel-tools] In a single response, call BOTH at the same time: (1) ${cfg.remoteInstanceId ? toolInstrWithArgs(cfg, "tool-help", "callbackMode='wait'") : toolInstr(cfg, "tool-help")} to list available tools, and (2) ${toolInstrWithArgs(cfg, "generate_image", `prompt='green square'${cfg.remoteInstanceId ? " and callbackMode='wait'" : ""}`)}. IMPORTANT: You MUST use callbackMode='wait' for both tools - do NOT use wakeUp or detach. Check that tool-help returned a non-empty tools array and generate_image returned an imageUrl (not a taskId). End your reply with STEP_OK if both tools returned correct results, or FAILED: <reason> if either tool failed or only one ran.`,
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

          // ── Both results populated ──
          // For queue mode (wakeUp): original tool message may have {taskId, status} (pending),
          // result backfilled by revival into either the original (WAIT) or a deferred
          // message (wakeUp). Check that each original tool call has a completed result
          // somewhere in the thread (either directly or via deferred).
          for (const toolMsg of toolMsgs) {
            const toolRes = resolveToolResult(toolMsg);
            // Either result is populated directly, OR this is a deferred message (isDeferred=true)
            // which always has a result, OR the result was populated in a wakeUp deferred sibling.
            // At minimum, result must not be null - skip deferred messages from the check below
            // since they are not the original parallel tool calls.
            if (toolMsg.toolCall?.isDeferred) {
              continue;
            }
            const originalCallId = toolMsg.toolCall?.toolCallId;
            // Find the effective result: either the original message or a deferred sibling
            const effectiveResult =
              toolRes ??
              toolResultRecord(
                added.find(
                  (m) =>
                    m.role === "tool" &&
                    m.toolCall?.originalToolCallId === originalCallId,
                )?.toolCall?.result,
              );
            expect(
              effectiveResult,
              `Parallel tool ${toolMsg.id} has no result (original or deferred)`,
            ).not.toBeNull();
          }

          // ── Original parallel tool messages share the SAME sequenceId ──
          const originalToolMsgs = toolMsgs.filter(
            (m) => !m.toolCall?.isDeferred,
          );
          const parallelSeqIds = new Set(
            originalToolMsgs.map((m) => m.sequenceId),
          );
          expect(parallelSeqIds.size).toBe(1);

          // ── generate_image: find the message that actually has imageUrl ──
          // For WAIT mode: original execute-tool message has imageUrl directly.
          // For wakeUp mode: a deferred tool message has imageUrl.
          const imgTool = findToolMsg(added, "generate_image", cfg);
          expect(
            imgTool,
            "T8: generate_image tool msg not found",
          ).toBeDefined();
          if (imgTool) {
            assertRemoteToolCall(imgTool, "generate_image", cfg);
          }
          // Resolve the effective result: original (WAIT) or deferred sibling (wakeUp)
          const imgOriginalRes = resolveToolResult(imgTool);
          const imgDeferredMsg = imgTool
            ? added.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.originalToolCallId ===
                    imgTool.toolCall?.toolCallId,
              )
            : undefined;
          const imgRes =
            imgOriginalRes?.["imageUrl"] !== undefined
              ? imgOriginalRes
              : resolveToolResult(imgDeferredMsg);
          expect(imgRes, "T8: generate_image result is null").not.toBeNull();
          expect(typeof imgRes!["imageUrl"]).toBe("string");
          expect(imgRes!["imageUrl"], "T8: imageUrl is empty").toBeTruthy();

          // ── tool-help result has tools array ──
          const toolHelpMsg = findToolMsg(added, "tool-help", cfg);
          expect(toolHelpMsg, "T8: tool-help msg not found").toBeDefined();
          if (toolHelpMsg) {
            assertRemoteToolCall(toolHelpMsg, "tool-help", cfg);
          }
          // Resolve effective tool-help result
          const toolHelpOrigRes = resolveToolResult(toolHelpMsg);
          const toolHelpDeferredMsg = toolHelpMsg
            ? added.find(
                (m) =>
                  m.role === "tool" &&
                  m.toolCall?.originalToolCallId ===
                    toolHelpMsg.toolCall?.toolCallId,
              )
            : undefined;
          const toolHelpRes =
            toolHelpOrigRes?.["tools"] !== undefined
              ? toolHelpOrigRes
              : resolveToolResult(toolHelpDeferredMsg);
          expect(toolHelpRes, "T8: tool-help result is null").not.toBeNull();
          expect(
            Array.isArray(toolHelpRes!["tools"]),
            "T8: tool-help tools is not array",
          ).toBe(true);

          // ── Both tools share the same sequenceId (same AI turn) - asserted via parallelSeqIds above ──

          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          expect(lastAi?.content).toBeTruthy();
          // ── Final AI has token metadata ──
          expect(lastAi!.finishReason).toBe("stop");
          expect(lastAi!.creditCost).toBeGreaterThan(0);
          assertStepOk(lastAi!.content, "T8");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0.47, 12);
        },
        effectiveTestTimeout,
      );

      // ── T9: preCalls injection ───────────────────────────────────────────
      fit(
        "T9: preCalls injection - synthetic generate_image result in DB, AI reasons about it",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}precalls-injection`);
          await pinBalance(testUser.id, 10, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);
          const prevCount = (await fetchThreadMessages(threadId)).length;

          // A real publicly accessible image so the UI widget can render it.
          const syntheticImageUrl =
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";

          const { result, messages } = await runStream({
            user: testUser,
            prompt: `[T9 preCalls] An image was already generated for you before this message. Look at the ${(cfg.remoteInstanceId ?? cfg.providerOverride) ? "execute-tool" : "generate_image"} tool result in your context and report the imageUrl you see. End your reply with STEP_OK if you can see an imageUrl starting with 'https://images.unsplash.com', or FAILED: <reason> if no imageUrl was visible in the tool result.`,
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            preCalls: [
              {
                routeId:
                  (cfg.remoteInstanceId ?? cfg.providerOverride)
                    ? "execute-tool"
                    : "generate_image",
                args:
                  (cfg.remoteInstanceId ?? cfg.providerOverride)
                    ? {
                        toolName: "generate_image",
                        ...(cfg.remoteInstanceId
                          ? { instanceId: cfg.remoteInstanceId }
                          : {}),
                        prompt: "mountain landscape at golden hour",
                      }
                    : { prompt: "mountain landscape at golden hour" },
                // Match the real generate_image return format: { imageUrl, creditCost }
                // This is what the route actually returns and what the UI widget renders.
                result: {
                  imageUrl: syntheticImageUrl,
                  creditCost: 1,
                },
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
          const toolMsg = findToolMsg(added, "generate_image", cfg);
          expect(toolMsg).toBeDefined();
          if (toolMsg) {
            assertRemoteToolCall(toolMsg, "generate_image", cfg);
          }
          expect(toolMsg!.isAI).toBe(true);

          const toolRes = resolveToolResult(toolMsg);
          expect(toolRes).not.toBeNull();
          // result must use imageUrl (matching generate_image's actual return format),
          // so the UI widget can render the image thumbnail.
          expect(toolRes!["imageUrl"]).toBe(syntheticImageUrl);
          expect(toolRes!["creditCost"]).toBe(1);

          // ── AI responded with content ──
          const lastAi = messages.find(
            (m) => m.id === result.data.lastAiMessageId,
          );
          expect(lastAi?.content).toBeTruthy();
          assertStepOk(lastAi?.content, "T9");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0, 10);
        },
        effectiveTestTimeout,
      );

      // ── T10: All file attachments - image, multi (image+audio), voice, video ──
      fit(
        "T10: file attachments - image, multi, voice, video all stored in metadata with correct mime types",
        async () => {
          // ── Part A: Single image attachment ──
          setFetchCacheContext(`${cfg.cachePrefix}attachment-image`);
          await pinBalance(testUser.id, 50, creditLogger, creditT);
          const beforeImg = await getBalance(testUser, creditLogger, creditT);
          const prevCountImg = (await fetchThreadMessages(threadId)).length;

          const imageFile = await loadFixture("test-image.jpeg", "image/jpeg");
          const { result: imgResult, messages: imgMsgs } = await runStream({
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
          expect(imgResult.data.lastAiMessageContent!.length).toBeGreaterThan(
            10,
          );
          assertStepOk(imgResult.data.lastAiMessageContent, "T10a");
          lastMainAiMsgId = imgResult.data.lastAiMessageId!;

          const imgAiMsg = imgAdded.find((m) => m.role === "assistant");
          expect(imgAiMsg).toBeDefined();
          expect(imgAiMsg!.finishReason).toBe("stop");
          expect(imgAiMsg!.creditCost).toBeGreaterThan(0);

          assertNoOrphans(imgMsgs, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const afterImg = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(beforeImg, afterImg, 0, 30);

          // ── Part B: Multi-attachment (image + music) ──
          setFetchCacheContext(`${cfg.cachePrefix}attachment-multi`);
          await pinBalance(testUser.id, 50, creditLogger, creditT);
          const beforeMulti = await getBalance(testUser, creditLogger, creditT);

          const musicFile = await loadFixture("test-music.mp3", "audio/mpeg");
          const imageFile2 = await loadFixture("test-image.jpeg", "image/jpeg");
          const { result: multiResult, messages: multiMsgs } = await runStream({
            user: testUser,
            prompt:
              "[T10b multi-attach] Two files are attached: an image and an audio file. Describe the image. For the audio, any description including '[Music]' or similar counts as successfully processed. End your reply with STEP_OK if the image attachment was visible and the audio produced any response at all (even just '[Music]'), or FAILED: <reason> only if the image was completely missing.",
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
          // Audio gap-fill: a variant (stt or audio-vision bridge) must have been written
          // AND the variant content must be a meaningful description (not a 1-word stub like "Okay")
          const multiVariants = multiUserMsg!.variants ?? [];
          expect(
            multiVariants.length > 0,
            "[T10b] Expected at least one gap-fill variant (stt/vision bridge) on user message",
          ).toBe(true);
          const audioVariant = multiVariants[0];
          expect(
            typeof audioVariant?.content === "string" &&
              audioVariant.content.length >= 5,
            `[T10b] Gap-fill variant content is too short to be a real audio description - got: ${JSON.stringify(audioVariant?.content)}`,
          ).toBe(true);
          expect(multiResult.data.lastAiMessageContent!.length).toBeGreaterThan(
            10,
          );
          assertStepOk(multiResult.data.lastAiMessageContent, "T10b");
          lastMainAiMsgId = multiResult.data.lastAiMessageId!;

          assertNoOrphans(multiMsgs, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const afterMulti = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(beforeMulti, afterMulti, 0, 30);

          // ── Part C: Audio attachment (attachment path → audioVisionModel gap-fill) ──
          // Music file passed as attachment → gap-fill.bridgeStt() → audioVisionModel (Gemini Flash)
          // Verifies audio vision bridge, NOT STT. STT is only for the voice widget (audioInput).
          // Result: user message has attachments + gap-fill variant (text description of music)
          setFetchCacheContext(`${cfg.cachePrefix}attachment-voice`);
          await pinBalance(testUser.id, 50, creditLogger, creditT);
          const beforeVoice = await getBalance(testUser, creditLogger, creditT);

          const musicAttachFile = await loadFixture(
            "test-music.mp3",
            "audio/mpeg",
          );
          const { result: voiceResult, messages: voiceMsgs } = await runStream({
            user: testUser,
            prompt:
              "[T10c_attach audio-attach] An audio file is attached. Describe or transcribe what you hear in it. End your reply with STEP_OK if you could process the audio, or FAILED: <reason> if you could not process it at all.",
            threadId,
            favoriteId: mainFavoriteId,
            explicitParentMessageId: lastMainAiMsgId,
            attachments: [musicAttachFile],
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
          expect(voiceUserMsg!.attachments![0]!.mimeType).toBe("audio/mpeg");

          // Attachment path: gap-fill MUST write an audioVisionModel variant with a real description.
          // This is audio VISION (Gemini), NOT STT (Whisper/Deepgram).
          // STT is only used when the user submits audio via the voice widget (audioInput field).
          const voiceVariants = voiceUserMsg!.variants ?? [];
          expect(
            voiceVariants.length > 0,
            "[T10c_attach] No audioVisionModel variant found on audio user message - gap-fill did not run. The audio was not bridged via the audioVisionModel before being sent to the AI.",
          ).toBe(true);
          const voiceVariant = voiceVariants[0];
          expect(
            typeof voiceVariant?.content === "string" &&
              voiceVariant.content.length > 10,
            `[T10c_attach] Gap-fill variant content is too short - audioVisionModel did not produce a real description: ${JSON.stringify(voiceVariant?.content)}`,
          ).toBe(true);

          expect(voiceResult.data.lastAiMessageContent!.length).toBeGreaterThan(
            10,
          );
          assertStepOk(voiceResult.data.lastAiMessageContent, "T10c_attach");
          lastMainAiMsgId = voiceResult.data.lastAiMessageId!;

          assertNoOrphans(voiceMsgs, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const afterVoice = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(beforeVoice, afterVoice, 0, 30);

          // ── Part C2: Voice STT path (audioInput → SpeechToTextRepository) ──
          // Audio passed via audioInput field (voice UI flow) → operation-handler.ts →
          // SpeechToTextRepository.transcribeAudio() → dedicated STT model (Whisper/Deepgram)
          // Result: user message has NO attachments, NO variants - content IS the transcribed text
          // Requires OPENAI_API_KEY (Whisper). Skip gracefully if not configured.
          if (agentEnv.OPENAI_API_KEY) {
            setFetchCacheContext(`${cfg.cachePrefix}attachment-voice-stt`);
            await pinBalance(testUser.id, 50, creditLogger, creditT);
            const beforeStt = await getBalance(testUser, creditLogger, creditT);

            const sttAudioFile = await loadFixture(
              "test-music.mp3",
              "audio/mpeg",
            );
            const { result: sttResult, messages: sttMsgs } = await runStream({
              user: testUser,
              prompt:
                "[T10c_stt voice-stt] Describe what this voice message says. End your reply with STEP_OK if you could understand the audio content, or FAILED: <reason> if the transcription was empty or unclear.",
              threadId,
              favoriteId: mainFavoriteId,
              explicitParentMessageId: lastMainAiMsgId,
              audioInput: sttAudioFile,
            });

            expect(sttResult.success).toBe(true);
            if (!sttResult.success) {
              return;
            }
            expect(sttResult.data.threadId).toBe(threadId);

            const sttSorted = [...sttMsgs].toSorted(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            );
            const sttUserMsg = sttSorted.find((m) => m.role === "user");

            // STT path: the audio was transcribed BEFORE the stream started.
            // The user message must have NO file attachments - the voice is the message text.
            expect(
              (sttUserMsg!.attachments ?? []).length,
              "[T10c_stt] User message must have NO attachments - STT path turns audio into text content, not a file attachment.",
            ).toBe(0);

            // STT path: NO gap-fill variants - the STT gives clean text, no bridge needed.
            expect(
              (sttUserMsg!.variants ?? []).length,
              "[T10c_stt] User message must have NO gap-fill variants - STT transcription replaces the audio, no audioVisionModel bridge needed.",
            ).toBe(0);

            // The message content must be a non-empty transcription (not the original prompt text).
            expect(
              sttUserMsg!.content,
              "[T10c_stt] User message content must be the STT transcription - non-null and non-empty.",
            ).toBeTruthy();
            expect(
              sttUserMsg!.content,
              "[T10c_stt] Content must differ from the original prompt - STT replaced it with the transcription.",
            ).not.toBe(
              "[T10c_stt voice-stt] Describe what this voice message says. End your reply with STEP_OK if you could understand the audio content, or FAILED: <reason> if the transcription was empty or unclear.",
            );

            expect(sttResult.data.lastAiMessageContent!.length).toBeGreaterThan(
              10,
            );
            assertStepOk(sttResult.data.lastAiMessageContent, "T10c_stt");
            lastMainAiMsgId = sttResult.data.lastAiMessageId!;

            assertNoOrphans(sttMsgs, new Set([t2BranchParentId]), {
              expectedLeafId: lastMainAiMsgId,
              knownDeadEndLeaves: deadEndLeaves,
            });
            await assertThreadIdle(threadId);
            await assertNoPendingTasks(threadId);

            const afterStt = await getBalance(testUser, creditLogger, creditT);
            assertDeducted(beforeStt, afterStt, 0, 30);
          } else {
            process.stdout.write(
              "[T10c_stt] Skipping - OPENAI_API_KEY not configured in this environment\n",
            );
          }

          // ── Part D: Video attachment ──
          setFetchCacheContext(`${cfg.cachePrefix}attachment-video`);
          await pinBalance(testUser.id, 50, creditLogger, creditT);
          const beforeVideo = await getBalance(testUser, creditLogger, creditT);

          const videoFile = await loadFixture("test-video.mp4", "video/mp4");
          const { result: videoResult, messages: videoMsgs } = await runStream({
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

          assertNoOrphans(videoMsgs, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const afterVideo = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(beforeVideo, afterVideo, 0, 30);
        },
        effectiveTestTimeout,
      );

      // ── T11: Native multimodal (Gemini image generation) ──────────────
      fit(
        "T11: Gemini native image generation - file part output, no generate_image tool call",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}image-generation-native`);
          await pinBalance(testUser.id, 50, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);
          const prevCount = (await fetchThreadMessages(threadId)).length;

          const { result, messages } = await runStream({
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
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          expect(imageToolMsg).toBeDefined();

          const toolRes = resolveToolResult(imageToolMsg);
          expect(toolRes).not.toBeNull();
          expect(typeof toolRes!["file"]).toBe("string");
          expect(toolRes!["creditCost"]).toBe(0);

          // Native image gen: args.prompt must be empty string (not the user message text).
          // An empty prompt tells gap-fill to fire the vision bridge on the next turn with a
          // non-image model - so the AI always gets a text description of the image.
          const toolArgs = toolResultRecord(imageToolMsg!.toolCall?.args);
          expect(
            toolArgs!["prompt"],
            "[T11] Synthetic tool message args.prompt must be empty for native Gemini gen - gap-fill needs an empty prompt to know it must vision-bridge on next non-image turn.",
          ).toBe("");

          // Gemini model on AI messages
          const aiMsgs = added.filter((m) => m.role === "assistant");
          for (const ai of aiMsgs) {
            if (ai.content && !ai.isCompacting) {
              expect(ai.model).toBeTruthy();
            }
          }

          // Native image gen: FilePartHandler creates a synthetic generate_image tool
          // message as a child of the AI message. The tool message is the actual leaf.
          // Use it as lastMainAiMsgId so subsequent tests chain from the correct tip.
          const nativeImgToolMsg = added.find(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "generate_image",
          );
          lastMainAiMsgId = nativeImgToolMsg
            ? nativeImgToolMsg.id
            : result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0.4, 30);
        },
        effectiveTestTimeout,
      );

      // ── T11b: Gap-fill Pass 2 - non-image model sees text description of native image ──
      // After T11 (Gemini native gen), the thread has a synthetic generate_image tool message
      // with empty text. When the next turn uses a non-image model, gap-fill Pass 2 fires:
      // the vision bridge runs on the tool result's file URL and writes a text description
      // so the model can reason about the previously generated image.
      fit(
        "T11b: gap-fill Pass 2 - non-image model turn after native Gemini gen, vision bridge populates tool result text",
        async () => {
          setFetchCacheContext(
            `${cfg.cachePrefix}image-generation-native-gap-fill`,
          );
          await pinBalance(testUser.id, 30, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);

          // Use text-only model (KIMI_K2 - no image input): it cannot see image modality →
          // gap-fill Pass 2 must fire to describe the image from T11 before the AI runs.
          // Note: mainFavoriteId uses KIMI_K2_5 which supports images - override with K2 (text-only).
          const { result, messages } = await runStream({
            user: testUser,
            prompt:
              "[T11b gap-fill-pass2] In the previous turn you generated an image. Describe what was generated. End your reply with STEP_OK if you can describe it, or FAILED: <reason> if you have no information about the image.",
            threadId,
            favoriteId: mainFavoriteId,
            model: ChatModelId.KIMI_K2,
            explicitParentMessageId: lastMainAiMsgId,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          // The synthetic generate_image tool message from T11 should exist with a file URL.
          // Gap-fill Pass 2 fires the vision bridge - if the URL is on a public CDN, a variant
          // is written; in local dev the URL is localhost and Gemini rejects it (400), so no variant.
          // We assert the tool message exists with the correct format; variant presence is
          // conditional on the URL being publicly accessible (production only).
          const allMsgs = await fetchThreadMessages(threadId);
          const nativeImgToolMsg = allMsgs.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.toolName === "generate_image" &&
              // The tool message that has a file URL (from T11, not from tool-call T2 etc.)
              typeof (toolResultRecord(m.toolCall?.result) ?? {})["file"] ===
                "string",
          );
          expect(
            nativeImgToolMsg,
            "[T11b] Could not find the T11 native-gen tool message in thread history.",
          ).toBeDefined();
          const nativeFileUrl = (toolResultRecord(
            nativeImgToolMsg!.toolCall?.result,
          ) ?? {})["file"] as string;
          const isPublicUrl = !nativeFileUrl.startsWith("http://localhost");
          if (isPublicUrl) {
            // On production (public CDN), gap-fill Pass 2 must have written a variant
            expect(
              (nativeImgToolMsg!.variants ?? []).length > 0,
              "[T11b] Gap-fill Pass 2 did NOT run on public URL - no variant on the T11 native-gen tool message.",
            ).toBe(true);
          } else {
            // In local dev, Gemini rejects localhost URLs - gap-fill was attempted but couldn't write variant
            process.stdout.write(
              "[T11b] Skipping variant assertion - image URL is localhost (gap-fill attempted but Gemini rejects localhost URLs)\n",
            );
          }

          assertStepOk(result.data.lastAiMessageContent, "T11b");
          lastMainAiMsgId = result.data.lastAiMessageId!;

          assertNoOrphans(messages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0, 20);
        },
        effectiveTestTimeout,
      );

      // ── T12: Error handling - invalid parent ─────────────────────────
      fit(
        "T12: invalid explicitParentMessageId - handled gracefully, no orphans",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}invalid-parent`);
          await pinBalance(testUser.id, 20, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);

          const { result, messages } = await runStream({
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

          assertNoOrphans(messages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });
          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const after = await getBalance(testUser, creditLogger, creditT);
          assertDeducted(before, after, 0, 10);
        },
        effectiveTestTimeout,
      );

      // ── Full tree validation ──────────────────────────────────────────────
      fit(
        "Final: full thread tree - no orphans, exactly 1 root, correct branching structure, metadata consistency",
        async () => {
          const messages = await fetchThreadMessages(threadId);

          // ── Full chain integrity: no orphans, no branches, every message reachable ──
          // t2BranchParentId is the ONLY intentional branch point (T3a retry + T3b fork + main chain).
          // T1's tool message is NOT a branch point - T1's final AI is the direct child on the main chain.
          assertChainIntegrity(messages, new Set([t2BranchParentId]), {
            expectedLeafId: lastMainAiMsgId,
            knownDeadEndLeaves: deadEndLeaves,
          });

          // ── Exactly 1 root ──
          const roots = messages.filter((m) => m.parentId === null);
          expect(roots).toHaveLength(1);
          expect(roots[0]!.id).toBe(t1UserMsgId);

          // ── t2BranchParentId is THE ONLY branch node in the entire thread ──
          // Every other parent must have exactly 1 child (no accidental branching).
          const tree = buildTree(messages);
          const byId = new Map(messages.map((m) => [m.id, m]));
          for (const [parentId, children] of tree.entries()) {
            if (parentId === "__root__") {
              continue;
            }
            if (children.length > 1 && parentId !== t2BranchParentId) {
              const parent = byId.get(parentId);
              // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
              throw new Error(
                `Unexpected branch: ${parent ? msgDesc(parent) : parentId} has ${String(children.length)} children. ` +
                  `Only t2BranchParentId=${t2BranchParentId} is allowed to branch. ` +
                  `Children: ${children.map((id) => msgDesc(byId.get(id)!)).join(", ")}`,
              );
            }
          }

          // ── t2BranchParentId has exactly the expected children ──
          // t2UserMsgId (original T2 user msg) + T3a retryUser + T3b branchUser = at least 3 children
          const branchNodeChildren = (tree.get(t2BranchParentId) ?? []).filter(
            (childId) => messages.find((m) => m.id === childId),
          );
          // Must have at least 3: original T2 user + retryUser + branchUser
          expect(
            branchNodeChildren.length,
            `t2BranchParentId must have at least 3 children (t2UserMsg + retryUser + branchUser). ` +
              `Got ${String(branchNodeChildren.length)}: ${JSON.stringify(branchNodeChildren)}`,
          ).toBeGreaterThanOrEqual(3);

          // ── t2UserMsgId, retryUser, and branchUser are all children of t2BranchParentId ──
          // This verifies the branch point is correct at the DB level.
          // The t2UserMsgId and the retry/branch user messages must share the same parentId.
          expect(
            branchNodeChildren,
            `t2UserMsgId must be a direct child of t2BranchParentId (original T2 user message)`,
          ).toContain(t2UserMsgId);
          expect(
            branchNodeChildren,
            `T3a retryUser must be a direct child of t2BranchParentId`,
          ).toContain(
            messages.find(
              (m) =>
                m.role === "user" &&
                m.parentId === t2BranchParentId &&
                m.content?.includes("T3a retry-branch"),
            )?.id,
          );
          expect(
            branchNodeChildren,
            `T3b branchUser must be a direct child of t2BranchParentId`,
          ).toContain(
            messages.find(
              (m) =>
                m.role === "user" &&
                m.parentId === t2BranchParentId &&
                m.content?.includes("T3b fork-branch"),
            )?.id,
          );

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
            expect(
              u.model,
              `User msg ${u.id} should have null model`,
            ).toBeNull();
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
          // Exception: task-completion-handler deferred results use model=null (no model context).
          const allTools = byRole(messages, "tool");
          for (const tm of allTools) {
            expect(tm.isAI, `Tool msg ${tm.id} should be isAI=true`).toBe(true);
            if (!tm.toolCall?.isDeferred) {
              expect(tm.model, `Tool msg ${tm.id} missing model`).toBeTruthy();
            }
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
        effectiveTestTimeout,
      );

      // ── Credit deduction + incognito ───────────────────────────────────────
      fit(
        "C1: credit deduction - balance decreases, totalCreditsDeducted matches",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}credit-deduction`);
          await pinBalance(testUser.id, 50, creditLogger, creditT);
          const before = await getBalance(testUser, creditLogger, creditT);

          const { result } = await runStream({
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
        effectiveTestTimeout,
      );

      fit(
        "C2: incognito - no messages persisted, credits still deducted",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}incognito-mode`);
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
            subAgentDepth: 0,
            user: testUser,
            locale: defaultLocale,
            logger,
            t,
            abortSignal: new AbortController().signal,
          });

          expect(result.success).toBe(true);
          if (!result.success) {
            return;
          }

          // Incognito: messages not persisted - no messages should exist in DB for this thread
          if (result.data.threadId) {
            const incognitoMsgs = await fetchThreadMessages(
              result.data.threadId,
            );
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
        effectiveTestTimeout,
      );

      fit(
        "C3: insufficient credits - returns 403 when balance is zero",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}insufficient-credits`);

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
            const { result } = await runStream({
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
        effectiveTestTimeout,
      );
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Favorites + UNBOTTLED Self-Relay
    // Tests the full favorites pipeline: create a favorite with the
    // quality-tester skill + cheapest models per modality, verify model
    // selection is respected, then run through the UNBOTTLED relay path.
    // All external fetch is blocked (strict mode) - any leaked fetch fails.
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    describe("Favorites + UNBOTTLED self-relay", () => {
      const QUALITY_TESTER_SKILL_ID = "quality-tester";
      let favoriteId: string; // kimi variant - KIMI_K2_5 + OPENROUTER image + MODELSLAB music/video
      let budgetFavoriteId: string; // budget variant - GPT_5_NANO + MODELSLAB image + REPLICATE music
      /** Saved chatModelOptionsIndex entries before UNBOTTLED runtime patching */
      const savedModelOptions = new Map<string, ChatModelOption>();
      /** Provider entry ops applied to .ts files on disk (reversed in afterAll) */
      let appliedOps: Array<{
        action: "add" | "remove" | "update";
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
          `Price updater found 0 models - ${priceResult.error ?? "no error"}`,
        ).toBeGreaterThan(0);

        const allAddOps = (priceResult.providerEntryOps ?? []).filter(
          (op) => op.action === "add" || op.action === "update",
        );
        expect(
          allAddOps.length,
          "Price updater returned 0 ops - no UNBOTTLED models found?",
        ).toBeGreaterThan(0);

        // ── Step 2: Write UNBOTTLED provider entries to .ts files on disk ──
        // This is the same codepath the production price updater uses.
        const { addProviderEntry, getRoleFilePaths } =
          await import("@/app/api/[locale]/agent/models/model-prices/repository");
        const roleFilePaths = getRoleFilePaths();

        // Group ops by role, read each file once, apply all ops, write back
        // Track only ops that were actually written (result.changed) so afterAll
        // doesn't delete pre-existing UNBOTTLED entries that weren't added by this test.
        const opsByRole = new Map<string, typeof allAddOps>();
        for (const op of allAddOps) {
          const list = opsByRole.get(op.role) ?? [];
          list.push(op);
          opsByRole.set(op.role, list);
        }
        // actuallyWrittenOps tracks only "add"-action ops that were newly inserted
        // (not "update" ops) so afterAll only removes entries that didn't exist before.
        const actuallyWrittenOps: typeof allAddOps = [];
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
              if (op.action === "add") {
                actuallyWrittenOps.push(op);
              }
            }
          }
          writeFileSync(filePath, content, "utf-8");
        }
        appliedOps = actuallyWrittenOps;

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
          "resolveLocalAdminSession failed - admin user missing?",
        ).toBeTruthy();
        Object.assign(agentEnv, {
          UNBOTTLED_CLOUD_CREDENTIALS: `${localSession!.leadId}:${localSession!.token}:${localSession!.remoteUrl}`,
        });

        // ── Step 5: Upsert test favorites with stable IDs (reused across runs) ──
        const UNBOTTLED_FAV_ID = "00000000-0000-4002-a000-000000000002";
        const BUDGET_FAV_ID = "00000000-0000-4003-a000-000000000003";

        const kimiValues = {
          id: UNBOTTLED_FAV_ID,
          slug: "test-unbottled-kimi",
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
              slug: kimiValues.slug,
              modelSelection: kimiValues.modelSelection,
              imageGenModelSelection: kimiValues.imageGenModelSelection,
              musicGenModelSelection: kimiValues.musicGenModelSelection,
              videoGenModelSelection: kimiValues.videoGenModelSelection,
            },
          });
        favoriteId = UNBOTTLED_FAV_ID;

        const budgetValues = {
          id: BUDGET_FAV_ID,
          slug: "test-unbottled-budget",
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
              slug: budgetValues.slug,
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
      }, effectiveTestTimeout);

      afterAll(async () => {
        const { readFileSync, writeFileSync } = await import("node:fs");

        // NOTE: Test favorites are kept for manual inspection - not deleted.

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
        "F1: favorite resolution - manual, model switch, media models, filters all work",
        async () => {
          const { resolveFavorite } = await import("../../repository/headless");
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
        effectiveTestTimeout,
      );
    });
  });
}
