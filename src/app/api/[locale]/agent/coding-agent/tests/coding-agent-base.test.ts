/**
 * Coding Agent Integration Tests - Two-Thread Suite
 *
 * Covers coding-agent called via execute-tool across all callbackModes,
 * in both batch (interactiveMode=false) and interactive (interactiveMode=true).
 *
 * Two separate threads, each running identical assertions:
 *   Non-interactive thread (CA1-CA4): batch mode, interactiveMode=false
 *   Interactive thread     (CA5-CA8): interactive mode, interactiveMode=true
 *
 * Cross-mode invariant: both threads must produce identical request/response shapes.
 * CA1 result shape === CA5 result shape, CA3 result shape === CA7 result shape, etc.
 * The request args (toolName, instanceId, callbackMode) must match across modes.
 * The response must have the same keys (output, taskId, status, etc.) across modes.
 *
 * Two transport modes exercised by separate test entry points:
 *   - Direct (isDirectlyAccessible=true): WAIT/END_LOOP return inline, no queue.
 *   - Queue (isDirectlyAccessible=false): WAIT/END_LOOP → stream waits → pulse → revival.
 */

import "server-only";

// eslint-disable-next-line i18next/no-literal-string
globalThis.AI_SDK_LOG_WARNINGS = false;

import { installFetchCache } from "../../ai-stream/testing/fetch-cache";
installFetchCache();

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { chatFavorites } from "@/app/api/[locale]/agent/chat/favorites/db";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { and, eq, like, sql } from "drizzle-orm";

import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { env } from "@/config/env";
import {
  patchFetchCacheFixtures,
  setFetchCacheContext,
} from "../../ai-stream/testing/fetch-cache";
import {
  fetchThreadMessages,
  runTestStream,
  toolResultRecord,
  type SlimMessage,
} from "../../ai-stream/testing/headless-test-runner";

// ── Mode configuration ────────────────────────────────────────────────────────

export interface CodingAgentModeConfig {
  /** Human-readable label for describe() title */
  label: string;
  /** Prefix for setFetchCacheContext - e.g. "ca-direct-", "ca-queue-" */
  cachePrefix: string;
  /** Remote instanceId (always "hermes" for both direct and queue) */
  remoteInstanceId: string;
  /** Per-mode setup (connection + capability sync) */
  setup?: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /** Per-mode teardown (disconnect) */
  teardown?: (testUser: JwtPrivatePayloadType) => Promise<void>;
  /**
   * Queue mode only: execute pending remote tasks → fire revival in-process.
   * Not set for direct mode (tools return synchronously via HTTP).
   */
  pulse?: (threadId: string) => Promise<void>;
  /**
   * True when isDirectlyAccessible=true (direct HTTP transport).
   * Affects assertions: WAIT/END_LOOP result arrives inline; no 'waiting' state.
   */
  isDirect: boolean;
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

  return { isPublic: false, id: user.id, leadId: link.leadId, roles };
}

/** Build the prompt text to call coding-agent via execute-tool with a callbackMode */
function agentInstr(
  cfg: CodingAgentModeConfig,
  prompt: string,
  interactiveMode: boolean,
  callbackMode: string,
): string {
  return `execute-tool with toolName='coding-agent', instanceId='${cfg.remoteInstanceId}', prompt='${prompt}', interactiveMode=${String(interactiveMode)}, callbackMode='${callbackMode}'`;
}

/**
 * Find the execute-tool message wrapping coding-agent.
 * In remote mode (always here), the AI calls execute-tool whose args include toolName='coding-agent'.
 */
function findCodingAgentMsg(messages: SlimMessage[]): SlimMessage | undefined {
  return messages.findLast(
    (m) =>
      m.role === "tool" &&
      m.toolCall?.toolName === "execute-tool" &&
      m.toolCall?.isDeferred !== true &&
      toolResultRecord(m.toolCall.args)?.["toolName"] === "coding-agent",
  );
}

/** Assert thread streamingState is idle */
async function assertThreadIdle(threadId: string): Promise<void> {
  const [thread] = await db
    .select({ streamingState: chatThreads.streamingState })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId));
  expect(thread?.streamingState, `Thread ${threadId} must be idle`).toBe(
    "idle",
  );
}

/** Assert no pending enabled tasks remain for a thread */
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
    `Thread ${threadId} has ${String(pending.rows.length)} pending tasks: ${pending.rows.map((p) => `${p.id}:${String(p.last_execution_status)}`).join(", ")}`,
  ).toBe(0);
}

/** Last AI assistant message from a message list */
function lastAi(messages: SlimMessage[]): SlimMessage | undefined {
  return [...messages].toReversed().find((m) => m.role === "assistant");
}

/** Assert AI message ends with STEP_OK */
function assertStepOk(msg: SlimMessage | undefined, step: string): void {
  expect(msg?.content, `[${step}] AI returned empty content`).toBeTruthy();
  expect(
    msg?.content?.includes("STEP_OK"),
    `[${step}] AI did not confirm STEP_OK:\n\n${msg?.content ?? ""}`,
  ).toBe(true);
}

/**
 * Snapshot of a coding-agent tool call: the request shape and response shape.
 * Used to cross-assert that batch and interactive modes produce identical structures.
 */
interface CaSnapshot {
  /** args.toolName - must be "coding-agent" */
  reqToolName: string;
  /** args.instanceId - must be the configured remote instance */
  reqInstanceId: string;
  /** args.callbackMode - "wait", "endLoop", "detach", or "wakeUp" */
  reqCallbackMode: string;
  /** args.input.interactiveMode - true or false */
  reqInteractiveMode: boolean;
  /** Top-level keys present in the result object */
  resKeys: string[];
  /** result.output string (only for WAIT/END_LOOP where output is expected) */
  resOutput?: string;
  /** result.taskId string (only for DETACH/WAKE_UP where taskId is expected) */
  resTaskId?: string;
  /** result.status string (only for DETACH where status=pending expected) */
  resStatus?: string;
}

function snapshotToolMsg(
  toolMsg: SlimMessage | undefined,
  step: string,
): CaSnapshot {
  const args = toolResultRecord(toolMsg?.toolCall?.args);
  expect(args, `${step}: execute-tool args must be an object`).not.toBeNull();

  const input = toolResultRecord(args?.["input"] as typeof args);
  const res = toolResultRecord(toolMsg?.toolCall?.result);
  expect(res, `${step}: execute-tool result must be an object`).not.toBeNull();

  return {
    reqToolName: String(args?.["toolName"] ?? ""),
    reqInstanceId: String(args?.["instanceId"] ?? ""),
    reqCallbackMode: String(args?.["callbackMode"] ?? ""),
    reqInteractiveMode: Boolean(input?.["interactiveMode"]),
    resKeys: res ? Object.keys(res).toSorted() : [],
    resOutput:
      res?.["output"] !== undefined ? String(res["output"]) : undefined,
    resTaskId:
      res?.["taskId"] !== undefined ? String(res["taskId"]) : undefined,
    resStatus:
      res?.["status"] !== undefined ? String(res["status"]) : undefined,
  };
}

/**
 * Assert two snapshots are structurally equivalent across batch/interactive modes.
 * Same response keys, both outputs real (no stubs), both taskIds present if applicable.
 * Request fields (toolName/instanceId/callbackMode) are only compared when both snapshots
 * come from execute-tool messages (reqToolName non-empty).
 */
function assertSnapshotsEquivalent(
  batch: CaSnapshot,
  interactive: CaSnapshot,
  step: string,
): void {
  // Compare request args only when both snapshots are from execute-tool calls
  if (batch.reqToolName && interactive.reqToolName) {
    expect(batch.reqToolName, `${step}: toolName must match across modes`).toBe(
      interactive.reqToolName,
    );
    expect(
      batch.reqInstanceId,
      `${step}: instanceId must match across modes`,
    ).toBe(interactive.reqInstanceId);
    expect(
      batch.reqCallbackMode,
      `${step}: callbackMode must match across modes`,
    ).toBe(interactive.reqCallbackMode);
  }
  // interactiveMode differs by design - don't compare it
  expect(
    batch.resKeys,
    `${step}: response keys must match across modes`,
  ).toEqual(interactive.resKeys);
  // If both have output: both must be non-empty strings (not sentinel)
  if (batch.resOutput !== undefined && interactive.resOutput !== undefined) {
    expect(
      batch.resOutput.length,
      `${step}: batch output must be non-empty`,
    ).toBeGreaterThan(0);
    expect(
      interactive.resOutput.length,
      `${step}: interactive output must be non-empty`,
    ).toBeGreaterThan(0);
    expect(
      batch.resOutput.includes("[test]"),
      `${step}: batch output must not be a test stub`,
    ).toBe(false);
    expect(
      interactive.resOutput.includes("[test]"),
      `${step}: interactive output must not be a test stub`,
    ).toBe(false);
  }
  // taskId: both must be present if either has one
  if (batch.resTaskId !== undefined || interactive.resTaskId !== undefined) {
    expect(batch.resTaskId, `${step}: batch must have taskId`).toBeTruthy();
    expect(
      interactive.resTaskId,
      `${step}: interactive must have taskId`,
    ).toBeTruthy();
  }
}

const TEST_TIMEOUT = 120_000;
const QUEUE_TEST_TIMEOUT = 300_000;

/**
 * Poll thread streamingState until it reaches 'idle' or the timeout elapses.
 * Used after wakeUp pulse to wait for revival to complete.
 */
async function waitForThreadIdle(
  threadId: string,
  timeoutMs: number,
): Promise<void> {
  const POLL = 500;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, POLL);
    });
    const [row] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    if (row?.streamingState === "idle") {
      return;
    }
  }
}

/**
 * Patch wakeUp fixtures: the AI's LLM response hardcodes the task ID from the
 * recording run. On each replay, a new task ID is created by execute-tool.
 * This reads the dispatch message to get the current live task ID, then
 * replaces any old `remote-hermes-*` ID in the fixture directory so
 * wait-for-task can find the real task on subsequent replays.
 *
 * Must be called immediately after runStream() returns (before pulse),
 * when the dispatch message is already in the DB but the task is still pending.
 */
async function patchWakeUpFixture(
  contextName: string,
  threadId: string,
): Promise<void> {
  const msgs = await fetchThreadMessages(threadId);
  const dispatchMsg = msgs.findLast(
    (m) =>
      m.role === "tool" &&
      m.toolCall?.toolName === "execute-tool" &&
      m.toolCall?.isDeferred !== true &&
      toolResultRecord(m.toolCall.args)?.["toolName"] === "coding-agent",
  );
  const liveTaskId = toolResultRecord(dispatchMsg?.toolCall?.result)?.[
    "taskId"
  ];
  if (typeof liveTaskId !== "string" || !liveTaskId.startsWith("remote-")) {
    return;
  }

  // Read fixture files to find the previously-recorded wakeUp task ID.
  // The task ID lives in the LLM request file (call 2) as part of the conversation
  // history - specifically as the execute-tool result the AI received. We want the
  // LAST remote-hermes-* ID in that file, which is the wakeUp task's taskId
  // (earlier IDs belong to prior CA steps like DETACH).
  const { existsSync, readdirSync, readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { HTTP_CACHE_DIR } =
    await import("../../ai-stream/testing/fetch-cache");
  // patchFetchCacheFixtures slugifies the context name the same way: lowercase, non-alnum → "-"
  const slug = contextName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const dir = join(HTTP_CACHE_DIR, slug);
  if (!existsSync(dir)) {
    return;
  }

  // The wakeUp task ID is the LAST remote-hermes-* occurrence in the req-2 file
  // (the second LLM call request includes the full conversation up to that point).
  const req2 = join(dir, "moonshotai-kimi-k2-5-2-req.json");
  const targetFile = existsSync(req2)
    ? req2
    : readdirSync(dir).find((f: string) => f.endsWith("-req.json"))
      ? join(
          dir,
          readdirSync(dir)
            .filter((f: string) => f.endsWith("-req.json"))
            .at(-1)!,
        )
      : null;

  if (!targetFile) {
    return;
  }

  // Parse the request JSON and find the task ID from the last execute-tool result
  // in the conversation messages. That's the wakeUp task ID the AI will use.
  // Fixture format: { url, method, headers, body: { messages: [...] } }
  let oldId: string | undefined;
  try {
    const fixture = JSON.parse(readFileSync(targetFile, "utf-8")) as {
      body?: {
        messages?: {
          role: string;
          name?: string;
          content?: string | { type?: string; text?: string }[];
        }[];
      };
    };
    const messages = [...(fixture.body?.messages ?? [])].toReversed();
    for (const msg of messages) {
      // Tool results come as role="tool" with content being a JSON string
      const contentStr =
        typeof msg.content === "string"
          ? msg.content
          : Array.isArray(msg.content)
            ? msg.content
                .map((c) => (typeof c === "object" && c.text ? c.text : ""))
                .join("")
            : "";
      if (msg.role === "tool" && contentStr.includes("taskId")) {
        const m = contentStr.match(/remote-hermes-[\w-]+/);
        if (m) {
          oldId = m[0];
          break;
        }
      }
    }
  } catch {
    // Fallback: find the last remote-hermes-* ID in the raw file text
    const content = readFileSync(targetFile, "utf-8");
    const allIds = [...content.matchAll(/remote-hermes-[\w-]+/g)].map(
      (m) => m[0],
    );
    oldId = allIds.findLast((id) => id !== liveTaskId);
  }

  if (oldId && oldId !== liveTaskId) {
    patchFetchCacheFixtures(contextName, oldId, liveTaskId);
  }
}

// ── Suite ─────────────────────────────────────────────────────────────────────

export function describeCodingAgentSuite(cfg: CodingAgentModeConfig): void {
  const effectiveTimeout = cfg.pulse ? QUEUE_TEST_TIMEOUT : TEST_TIMEOUT;

  describe(cfg.label, () => {
    let testUser: JwtPrivatePayloadType;
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

      // Resolve or create a stable favorite for model resolution (same pattern as route-base)
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

      if (cfg.setup) {
        await cfg.setup(testUser);
      }
    }, effectiveTimeout);

    afterAll(async () => {
      if (cfg.teardown && testUser) {
        await cfg.teardown(testUser);
      }
    });

    /**
     * Wrapper around runTestStream that handles queue revival transparently.
     * When cfg.pulse is set and thread enters 'waiting', runs pulse → polls → idle.
     */
    async function runStream(
      params: Parameters<typeof runTestStream>[0],
    ): ReturnType<typeof runTestStream> {
      const first = await runTestStream(params);

      if (cfg.pulse && first.result.success && first.result.data.threadId) {
        const tid = first.result.data.threadId;
        const [row] = await db
          .select({ streamingState: chatThreads.streamingState })
          .from(chatThreads)
          .where(eq(chatThreads.id, tid));

        if (row?.streamingState === "waiting") {
          expect(
            row.streamingState,
            "Queue WAIT: must be 'waiting' before pulse",
          ).toBe("waiting");

          // Flush stale resume-stream tasks from other threads before pulsing
          await db
            .delete(cronTasks)
            .where(
              and(
                like(cronTasks.routeId, "resume-stream%"),
                sql`(${cronTasks.wakeUpThreadId} IS NULL OR ${cronTasks.wakeUpThreadId} != ${tid})`,
              ),
            );

          await cfg.pulse(tid);

          const REVIVAL_TIMEOUT = 180_000;
          const POLL_INTERVAL = 500;
          const start = Date.now();
          let state: string | undefined = "streaming";
          while (state !== "idle" && Date.now() - start < REVIVAL_TIMEOUT) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, POLL_INTERVAL);
            });
            const [sr] = await db
              .select({ streamingState: chatThreads.streamingState })
              .from(chatThreads)
              .where(eq(chatThreads.id, tid));
            state = sr?.streamingState;
          }
          expect(state, "Queue WAIT: must return to 'idle' after revival").toBe(
            "idle",
          );

          const msgs = await fetchThreadMessages(tid);
          const revivalAi = [...msgs]
            .toReversed()
            .find((m) => m.role === "assistant");
          return {
            result:
              revivalAi && first.result.success
                ? {
                    ...first.result,
                    data: {
                      ...first.result.data,
                      lastAiMessageId: revivalAi.id,
                    },
                  }
                : first.result,
            messages: msgs,
            pinnedToolCount: first.pinnedToolCount,
          };
        }
      }

      return first;
    }

    // Shared snapshots: batch thread stores results, interactive thread compares against them
    const batchSnapshots: Record<string, CaSnapshot> = {};

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Thread 1: Non-interactive (batch mode, interactiveMode=false)
    // CA1=WAIT  CA2=END_LOOP  CA3=DETACH  CA4=WAKE_UP
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    describe("Non-interactive thread: batch callback modes", () => {
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
              // oxlint-disable-next-line restricted-syntax
              throw err;
            }
          },
          timeout,
        );
      }

      let threadId: string;

      // ── CA1: Batch WAIT ─────────────────────────────────────────────────
      fit(
        "CA1: batch WAIT - coding-agent output backfilled in original tool message",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}ca1-batch-wait`);

          const { result, messages } = await runStream({
            user: testUser,
            favoriteId: mainFavoriteId,
            prompt: `[CA1] Call ${agentInstr(cfg, "echo hello-ca1", false, "wait")}. After the tool returns, verify the result has an 'output' string containing "hello-ca1". Reply with STEP_OK and quote the exact output value.`,
          });

          expect(result.success, "CA1 must succeed").toBe(true);
          if (!result.success) {
            return;
          }

          threadId = result.data.threadId!;
          expect(threadId, "CA1 must create thread").toBeTruthy();

          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const toolMsg = findCodingAgentMsg(messages);
          expect(
            toolMsg,
            "CA1: execute-tool(coding-agent) message must exist",
          ).toBeDefined();
          expect(
            toolMsg?.toolCall?.isDeferred,
            "CA1: original must not be deferred",
          ).toBeFalsy();

          // Validate execute-tool args shape
          const args = toolResultRecord(toolMsg?.toolCall?.args);
          expect(
            args,
            "CA1: execute-tool args must be an object",
          ).not.toBeNull();
          expect(
            args?.["toolName"],
            "CA1: args.toolName must be coding-agent",
          ).toBe("coding-agent");
          expect(
            args?.["instanceId"],
            "CA1: args.instanceId must be the remote instance",
          ).toBe(cfg.remoteInstanceId);
          expect(
            args?.["callbackMode"],
            "CA1: args.callbackMode must be wait",
          ).toBe("wait");
          const inputArgs = toolResultRecord(args?.["input"] as typeof args);
          expect(
            inputArgs?.["interactiveMode"],
            "CA1: input.interactiveMode must be false",
          ).toBe(false);
          expect(
            typeof inputArgs?.["prompt"],
            "CA1: input.prompt must be a string",
          ).toBe("string");

          const res = toolResultRecord(toolMsg?.toolCall?.result);
          expect(res, "CA1: result must be an object").not.toBeNull();

          // WAIT: result must have exactly {output, durationMs} - no extra keys
          const resKeys = Object.keys(res ?? {}).toSorted();
          expect(
            resKeys,
            "CA1: result must have exactly {durationMs, output}",
          ).toEqual(["durationMs", "output"]);

          // Validate output value
          expect(res?.["output"], "CA1: output must be present").toBeTruthy();
          const output = String(res?.["output"] ?? "");
          expect(output, "CA1: output must not be a test stub").not.toContain(
            "[test]",
          );
          expect(output, "CA1: output must contain echo result").toContain(
            "hello-ca1",
          );

          // Validate durationMs is a positive number
          expect(
            typeof res?.["durationMs"],
            "CA1: durationMs must be a number",
          ).toBe("number");
          expect(
            Number(res?.["durationMs"]) > 0,
            "CA1: durationMs must be positive",
          ).toBe(true);

          // No deferred child
          const deferred = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.isDeferred === true &&
              m.toolCall.originalToolCallId === toolMsg?.toolCall?.toolCallId,
          );
          expect(
            deferred,
            "CA1: WAIT must not insert deferred child",
          ).toBeUndefined();

          assertStepOk(lastAi(messages), "CA1");

          batchSnapshots["wait"] = snapshotToolMsg(toolMsg, "CA1");
        },
        effectiveTimeout,
      );

      // ── CA2: Batch END_LOOP ──────────────────────────────────────────────
      fit(
        "CA2: batch END_LOOP - result backfilled, no deferred child, no revival",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}ca2-batch-endloop`);

          const { result, messages } = await runStream({
            user: testUser,
            threadId,
            favoriteId: mainFavoriteId,
            prompt: `[CA2] Call ${agentInstr(cfg, "echo hello-ca2-endloop", false, "endLoop")}. Stream stops after the tool call. Confirm you received output containing "hello-ca2-endloop". Reply with STEP_OK.`,
          });

          expect(result.success, "CA2 must succeed").toBe(true);
          if (!result.success) {
            return;
          }

          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const toolMsg = findCodingAgentMsg(messages);
          expect(
            toolMsg,
            "CA2: execute-tool(coding-agent) message must exist",
          ).toBeDefined();

          const res = toolResultRecord(toolMsg?.toolCall?.result);
          expect(res, "CA2: result must be an object").not.toBeNull();

          // END_LOOP: result must have exactly {output, durationMs} - no extra keys
          const resKeys = Object.keys(res ?? {}).toSorted();
          expect(
            resKeys,
            "CA2: result must have exactly {durationMs, output}",
          ).toEqual(["durationMs", "output"]);

          expect(res?.["output"], "CA2: output must be present").toBeTruthy();
          const output = String(res?.["output"] ?? "");
          expect(output, "CA2: output must not be a test stub").not.toContain(
            "[test]",
          );
          expect(output, "CA2: output must contain echo result").toContain(
            "hello-ca2-endloop",
          );
          expect(
            typeof res?.["durationMs"],
            "CA2: durationMs must be a number",
          ).toBe("number");
          expect(
            Number(res?.["durationMs"]) > 0,
            "CA2: durationMs must be positive",
          ).toBe(true);

          // No deferred child
          const deferredMsg = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.isDeferred === true &&
              m.toolCall.originalToolCallId === toolMsg?.toolCall?.toolCallId,
          );
          expect(
            deferredMsg,
            "CA2: END_LOOP must NOT insert deferred child",
          ).toBeUndefined();

          // endLoop: stream aborts after tool call - no revival, no STEP_OK

          batchSnapshots["endLoop"] = snapshotToolMsg(toolMsg, "CA2");
        },
        effectiveTimeout,
      );

      // ── CA3: Batch DETACH ────────────────────────────────────────────────
      fit(
        "CA3: batch DETACH - taskId returned immediately, result NOT injected into thread",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}ca3-batch-detach`);

          const { result, messages } = await runStream({
            user: testUser,
            threadId,
            favoriteId: mainFavoriteId,
            prompt: `[CA3] Call ${agentInstr(cfg, "echo hello-ca3-detach", false, "detach")}. The tool must return a taskId immediately without waiting. Confirm you received a taskId string. Reply with STEP_OK and include the taskId value.`,
          });

          expect(result.success, "CA3 must succeed").toBe(true);
          if (!result.success) {
            return;
          }

          await assertThreadIdle(threadId);

          const toolMsg = findCodingAgentMsg(messages);
          expect(
            toolMsg,
            "CA3: execute-tool(coding-agent) message must exist",
          ).toBeDefined();

          const res = toolResultRecord(toolMsg?.toolCall?.result);
          expect(res, "CA3: result must be an object").not.toBeNull();

          // DETACH: result must have exactly {hint, status, taskId} - no output
          const resKeys = Object.keys(res ?? {}).toSorted();
          expect(
            resKeys,
            "CA3: result must have exactly {hint, status, taskId}",
          ).toEqual(["hint", "status", "taskId"]);

          const taskId = res?.["taskId"];
          expect(taskId, "CA3: taskId must be present").toBeTruthy();
          expect(typeof taskId, "CA3: taskId must be a string").toBe("string");
          expect(
            String(taskId).length,
            "CA3: taskId must be non-empty",
          ).toBeGreaterThan(0);

          const status = res?.["status"];
          expect(
            String(status ?? "").includes("pending"),
            `CA3: status must include "pending", got: ${String(status)}`,
          ).toBe(true);

          const hint = res?.["hint"];
          expect(hint, "CA3: hint must be present").toBeTruthy();
          expect(typeof hint, "CA3: hint must be a string").toBe("string");

          // DETACH result must NOT have an output field (background task, no inline result)
          expect(
            res?.["output"],
            "CA3: DETACH result must not have output field",
          ).toBeUndefined();

          // No deferred injection
          const deferred = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.isDeferred === true &&
              m.toolCall.originalToolCallId === toolMsg?.toolCall?.toolCallId,
          );
          expect(
            deferred,
            "CA3: DETACH must not insert deferred message",
          ).toBeUndefined();

          assertStepOk(lastAi(messages), "CA3");

          batchSnapshots["detach"] = snapshotToolMsg(toolMsg, "CA3");
        },
        effectiveTimeout,
      );

      // ── CA4: Batch WAKE_UP ───────────────────────────────────────────────
      // Flow: execute-tool(wakeUp) → AI gets taskId → AI calls wait-for-task →
      // stream pauses (REMOTE_TOOL_WAIT) → pulse runs coding-agent batch →
      // handleTaskCompletion(WAIT) backfills wait-for-task → revival fires.
      // Thread outcome is identical to WAIT from the user's perspective.
      fit(
        "CA4: batch WAKE_UP - AI dispatches task, calls wait-for-task, result backfilled on revival",
        async () => {
          const wakeUpContext = `${cfg.cachePrefix}ca4-batch-wakeup`;
          setFetchCacheContext(wakeUpContext);

          const { result } = await runStream({
            user: testUser,
            threadId,
            favoriteId: mainFavoriteId,
            prompt: `[CA4] Call ${agentInstr(cfg, "echo hello-ca4-wakeup", false, "wakeUp")} ONCE. After the tool returns a taskId, call wait-for-task ONCE with that taskId. Do NOT call execute-tool again under any circumstances. When wait-for-task returns with output, verify it contains "hello-ca4-wakeup" then reply STEP_OK quoting the exact output value.`,
          });

          expect(result.success, "CA4 must succeed").toBe(true);
          if (!result.success) {
            return;
          }

          // Patch fixture: the AI's LLM response (fixture) hardcodes the task ID
          // from the recording run. On replay, a new task ID is created. Patching
          // the fixture with the current run's ID keeps it valid for subsequent replays.
          await patchWakeUpFixture(wakeUpContext, threadId);

          // pulse: execute the pending wakeUp task + wait-for-task dependency
          if (cfg.pulse) {
            await cfg.pulse(threadId);
          }

          // Wait for thread to return to idle after revival
          await waitForThreadIdle(threadId, 120_000);

          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const finalMsgs = await fetchThreadMessages(threadId);

          // execute-tool(wakeUp) message must exist - it dispatched the task
          const dispatchMsg = findCodingAgentMsg(finalMsgs);
          expect(
            dispatchMsg,
            "CA4: execute-tool(coding-agent) dispatch message must exist",
          ).toBeDefined();

          // wait-for-task message must exist and have real output backfilled
          const waitForTaskMsg = finalMsgs.findLast(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "wait-for-task",
          );
          expect(
            waitForTaskMsg,
            "CA4: wait-for-task message must exist",
          ).toBeDefined();

          const waitRes = toolResultRecord(waitForTaskMsg?.toolCall?.result);
          expect(
            waitRes,
            "CA4: wait-for-task result must be an object",
          ).not.toBeNull();

          // wait-for-task backfilled result must have exactly {durationMs, output}
          const waitResKeys = Object.keys(waitRes ?? {}).toSorted();
          expect(
            waitResKeys,
            "CA4: wait-for-task result must have exactly {durationMs, output}",
          ).toEqual(["durationMs", "output"]);

          expect(
            waitRes?.["output"],
            "CA4: wait-for-task output must be present",
          ).toBeTruthy();
          const waitOutput = String(waitRes?.["output"] ?? "");
          expect(
            waitOutput,
            "CA4: output must not be a test stub",
          ).not.toContain("[test]");
          expect(waitOutput, "CA4: output must contain echo result").toContain(
            "hello-ca4-wakeup",
          );
          expect(
            typeof waitRes?.["durationMs"],
            "CA4: durationMs must be a number",
          ).toBe("number");
          expect(
            Number(waitRes?.["durationMs"]) > 0,
            "CA4: durationMs must be positive",
          ).toBe(true);

          // No deferred child on the dispatch message - result came via wait-for-task
          const deferred = finalMsgs.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.isDeferred === true &&
              m.toolCall.originalToolCallId ===
                dispatchMsg?.toolCall?.toolCallId,
          );
          expect(
            deferred,
            "CA4: wakeUp+wait-for-task must not insert deferred child",
          ).toBeUndefined();

          assertStepOk(lastAi(finalMsgs), "CA4");

          batchSnapshots["wakeUp"] = snapshotToolMsg(waitForTaskMsg, "CA4");
        },
        effectiveTimeout,
      );
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Thread 2: Interactive (interactiveMode=true)
    // CA5=WAIT  CA6=END_LOOP  CA7=DETACH  CA8=WAKE_UP
    //
    // Exact mirror of CA1-CA4:
    //   - Same callbackMode per step
    //   - Same thread-state expectations (idle after each, no pending tasks)
    //   - Same result shape: batch output === interactive output (both real, no stubs)
    //   - Cross-mode snapshot comparison: CA5 shape === CA1 shape, etc.
    //
    // Interactive mode flow: escalateToTask sets waitingForRemoteResult=true,
    // stream pauses, triggerLocalPulse re-runs as batch to get real output,
    // handleTaskCompletion backfills → revival. Visually identical to batch WAIT.
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    describe("Interactive thread: same callback modes, interactiveMode=true", () => {
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
              // oxlint-disable-next-line restricted-syntax
              throw err;
            }
          },
          timeout,
        );
      }

      let threadId: string;

      // ── CA5: Interactive WAIT ────────────────────────────────────────────
      fit(
        "CA5: interactive WAIT - escalates, stream waits, complete-task → backfill + revival",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}ca5-interactive-wait`);

          const { result } = await runStream({
            user: testUser,
            favoriteId: mainFavoriteId,
            prompt: `[CA5] Call ${agentInstr(cfg, "echo hello-ca5-wait", true, "wait")}. The tool escalates to a background task. After revival verify the result output contains "hello-ca5-wait". Reply with STEP_OK and quote the exact output.`,
          });

          expect(result.success, "CA5 must succeed").toBe(true);
          if (!result.success) {
            return;
          }

          threadId = result.data.threadId!;
          expect(threadId, "CA5 must create thread").toBeTruthy();

          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const finalMsgs = await fetchThreadMessages(threadId);
          const toolMsg = findCodingAgentMsg(finalMsgs);
          expect(
            toolMsg,
            "CA5: execute-tool(coding-agent) message must exist",
          ).toBeDefined();
          expect(
            toolMsg?.toolCall?.isDeferred,
            "CA5: original must not be deferred",
          ).toBeFalsy();

          const res = toolResultRecord(toolMsg?.toolCall?.result);
          expect(res, "CA5: result must be an object").not.toBeNull();

          // Interactive WAIT: result must have exactly {output, durationMs}
          const resKeys = Object.keys(res ?? {}).toSorted();
          expect(
            resKeys,
            "CA5: result must have exactly {durationMs, output}",
          ).toEqual(["durationMs", "output"]);

          expect(res?.["output"], "CA5: output must be present").toBeTruthy();
          const output = String(res?.["output"] ?? "");
          expect(output, "CA5: output must not be a test stub").not.toContain(
            "[test]",
          );
          expect(output, "CA5: output must contain echo result").toContain(
            "hello-ca5-wait",
          );
          expect(
            typeof res?.["durationMs"],
            "CA5: durationMs must be a number",
          ).toBe("number");
          expect(
            Number(res?.["durationMs"]) > 0,
            "CA5: durationMs must be positive",
          ).toBe(true);

          // No deferred child - WAIT backfills in-place
          const deferred = finalMsgs.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.isDeferred === true &&
              m.toolCall.originalToolCallId === toolMsg?.toolCall?.toolCallId,
          );
          expect(
            deferred,
            "CA5: interactive WAIT must not insert deferred child",
          ).toBeUndefined();

          assertStepOk(lastAi(finalMsgs), "CA5");

          const snap = snapshotToolMsg(toolMsg, "CA5");
          // Cross-mode: request shape and response key structure must match CA1
          if (batchSnapshots["wait"]) {
            assertSnapshotsEquivalent(
              batchSnapshots["wait"],
              snap,
              "CA1 vs CA5",
            );
          }
        },
        effectiveTimeout,
      );

      // ── CA6: Interactive END_LOOP ────────────────────────────────────────
      fit(
        "CA6: interactive END_LOOP - escalates, stream stops, result backfilled, no deferred",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}ca6-interactive-endloop`);

          const { result, messages } = await runStream({
            user: testUser,
            threadId,
            favoriteId: mainFavoriteId,
            prompt: `[CA6] Call ${agentInstr(cfg, "echo hello-ca6-endloop", true, "endLoop")}. Stream stops after execution. Confirm output contains "hello-ca6-endloop". Reply with STEP_OK.`,
          });

          expect(result.success, "CA6 must succeed").toBe(true);
          if (!result.success) {
            return;
          }

          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const toolMsg = findCodingAgentMsg(messages);
          expect(
            toolMsg,
            "CA6: execute-tool(coding-agent) message must exist",
          ).toBeDefined();

          const res = toolResultRecord(toolMsg?.toolCall?.result);
          expect(res, "CA6: result must be an object").not.toBeNull();

          // Interactive END_LOOP: result must have exactly {output, durationMs}
          const resKeys = Object.keys(res ?? {}).toSorted();
          expect(
            resKeys,
            "CA6: result must have exactly {durationMs, output}",
          ).toEqual(["durationMs", "output"]);

          expect(res?.["output"], "CA6: output must be present").toBeTruthy();
          const output = String(res?.["output"] ?? "");
          expect(output, "CA6: output must not be a test stub").not.toContain(
            "[test]",
          );
          expect(output, "CA6: output must contain echo result").toContain(
            "hello-ca6-endloop",
          );
          expect(
            typeof res?.["durationMs"],
            "CA6: durationMs must be a number",
          ).toBe("number");
          expect(
            Number(res?.["durationMs"]) > 0,
            "CA6: durationMs must be positive",
          ).toBe(true);

          // No deferred child
          const deferredMsg = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.isDeferred === true &&
              m.toolCall.originalToolCallId === toolMsg?.toolCall?.toolCallId,
          );
          expect(
            deferredMsg,
            "CA6: END_LOOP must NOT insert deferred child",
          ).toBeUndefined();

          // endLoop: no revival, no STEP_OK

          const snap = snapshotToolMsg(toolMsg, "CA6");
          if (batchSnapshots["endLoop"]) {
            assertSnapshotsEquivalent(
              batchSnapshots["endLoop"],
              snap,
              "CA2 vs CA6",
            );
          }
        },
        effectiveTimeout,
      );

      // ── CA7: Interactive DETACH ──────────────────────────────────────────
      fit(
        "CA7: interactive DETACH - taskId returned immediately, no result injection",
        async () => {
          setFetchCacheContext(`${cfg.cachePrefix}ca7-interactive-detach`);

          const { result, messages } = await runStream({
            user: testUser,
            threadId,
            favoriteId: mainFavoriteId,
            prompt: `[CA7] Call ${agentInstr(cfg, "echo hello-ca7-detach", true, "detach")}. Must return taskId immediately. Confirm you got a taskId string. Reply with STEP_OK including the taskId.`,
          });

          expect(result.success, "CA7 must succeed").toBe(true);
          if (!result.success) {
            return;
          }

          await assertThreadIdle(threadId);

          const toolMsg = findCodingAgentMsg(messages);
          expect(
            toolMsg,
            "CA7: execute-tool(coding-agent) message must exist",
          ).toBeDefined();

          const res = toolResultRecord(toolMsg?.toolCall?.result);
          expect(res, "CA7: result must be an object").not.toBeNull();

          // DETACH: result must have exactly {hint, status, taskId}
          const resKeys = Object.keys(res ?? {}).toSorted();
          expect(
            resKeys,
            "CA7: result must have exactly {hint, status, taskId}",
          ).toEqual(["hint", "status", "taskId"]);

          const taskId = res?.["taskId"];
          expect(taskId, "CA7: taskId must be present").toBeTruthy();
          expect(typeof taskId, "CA7: taskId must be a string").toBe("string");
          expect(
            String(taskId).length,
            "CA7: taskId must be non-empty",
          ).toBeGreaterThan(0);

          const status = res?.["status"];
          expect(
            String(status ?? "").includes("pending"),
            `CA7: status must include "pending", got: ${String(status)}`,
          ).toBe(true);

          const hint = res?.["hint"];
          expect(hint, "CA7: hint must be present").toBeTruthy();
          expect(typeof hint, "CA7: hint must be a string").toBe("string");

          expect(
            res?.["output"],
            "CA7: DETACH result must not have output field",
          ).toBeUndefined();

          // No deferred injection
          const deferred = messages.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.isDeferred === true &&
              m.toolCall.originalToolCallId === toolMsg?.toolCall?.toolCallId,
          );
          expect(
            deferred,
            "CA7: interactive DETACH must not insert deferred",
          ).toBeUndefined();

          assertStepOk(lastAi(messages), "CA7");

          const snap = snapshotToolMsg(toolMsg, "CA7");
          if (batchSnapshots["detach"]) {
            assertSnapshotsEquivalent(
              batchSnapshots["detach"],
              snap,
              "CA3 vs CA7",
            );
          }
        },
        effectiveTimeout,
      );

      // ── CA8: Interactive WAKE_UP ─────────────────────────────────────────
      // Mirror of CA4: execute-tool(wakeUp) → AI calls wait-for-task → stream
      // pauses (REMOTE_TOOL_WAIT) → pulse runs coding-agent batch →
      // handleTaskCompletion(WAIT) backfills wait-for-task → revival fires.
      // Identical thread outcome to CA4: wait-for-task backfilled, STEP_OK.
      fit(
        "CA8: interactive WAKE_UP - AI dispatches task, calls wait-for-task, result backfilled on revival",
        async () => {
          const wakeUpContext = `${cfg.cachePrefix}ca8-interactive-wakeup`;
          setFetchCacheContext(wakeUpContext);

          const { result } = await runStream({
            user: testUser,
            threadId,
            favoriteId: mainFavoriteId,
            prompt: `[CA8] Call ${agentInstr(cfg, "echo hello-ca8-wakeup", true, "wakeUp")} ONCE. After the tool returns a taskId, call wait-for-task ONCE with that taskId. Do NOT call execute-tool again under any circumstances. When wait-for-task returns with output, verify it contains "hello-ca8-wakeup" then reply STEP_OK quoting the exact output value.`,
          });

          expect(result.success, "CA8 must succeed").toBe(true);
          if (!result.success) {
            return;
          }

          // Patch fixture: same wakeUp task ID instability as CA4
          await patchWakeUpFixture(wakeUpContext, threadId);

          if (cfg.pulse) {
            await cfg.pulse(threadId);
          }

          // Wait for thread to return to idle after revival
          await waitForThreadIdle(threadId, 120_000);

          await assertThreadIdle(threadId);
          await assertNoPendingTasks(threadId);

          const finalMsgs = await fetchThreadMessages(threadId);

          // execute-tool(wakeUp) dispatch message must exist
          const dispatchMsg = findCodingAgentMsg(finalMsgs);
          expect(
            dispatchMsg,
            "CA8: execute-tool(coding-agent) dispatch message must exist",
          ).toBeDefined();

          // wait-for-task message must have real output backfilled
          const waitForTaskMsg = finalMsgs.findLast(
            (m) =>
              m.role === "tool" && m.toolCall?.toolName === "wait-for-task",
          );
          expect(
            waitForTaskMsg,
            "CA8: wait-for-task message must exist",
          ).toBeDefined();

          const waitRes = toolResultRecord(waitForTaskMsg?.toolCall?.result);
          expect(
            waitRes,
            "CA8: wait-for-task result must be an object",
          ).not.toBeNull();

          // wait-for-task backfilled result must have exactly {durationMs, output}
          const waitResKeys = Object.keys(waitRes ?? {}).toSorted();
          expect(
            waitResKeys,
            "CA8: wait-for-task result must have exactly {durationMs, output}",
          ).toEqual(["durationMs", "output"]);

          expect(
            waitRes?.["output"],
            "CA8: wait-for-task output must be present",
          ).toBeTruthy();
          const waitOutput = String(waitRes?.["output"] ?? "");
          expect(
            waitOutput,
            "CA8: output must not be a test stub",
          ).not.toContain("[test]");
          expect(waitOutput, "CA8: output must contain echo result").toContain(
            "hello-ca8-wakeup",
          );
          expect(
            typeof waitRes?.["durationMs"],
            "CA8: durationMs must be a number",
          ).toBe("number");
          expect(
            Number(waitRes?.["durationMs"]) > 0,
            "CA8: durationMs must be positive",
          ).toBe(true);

          // No deferred child on dispatch message
          const deferred = finalMsgs.find(
            (m) =>
              m.role === "tool" &&
              m.toolCall?.isDeferred === true &&
              m.toolCall.originalToolCallId ===
                dispatchMsg?.toolCall?.toolCallId,
          );
          expect(
            deferred,
            "CA8: wakeUp+wait-for-task must not insert deferred child",
          ).toBeUndefined();

          // Verify all interactive tests stayed in same thread
          expect(result.data.threadId, "CA8: must be same thread as CA5").toBe(
            threadId,
          );

          assertStepOk(lastAi(finalMsgs), "CA8");

          const snap = snapshotToolMsg(waitForTaskMsg, "CA8");
          if (batchSnapshots["wakeUp"]) {
            assertSnapshotsEquivalent(
              batchSnapshots["wakeUp"],
              snap,
              "CA4 vs CA8",
            );
          }
        },
        effectiveTimeout,
      );
    });
  });
}
