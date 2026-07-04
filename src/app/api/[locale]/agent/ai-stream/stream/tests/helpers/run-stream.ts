/**
 * runStream machinery for the AI-stream suites: a drop-in wrapper around
 * runTestStream that handles folder routing, queue-mode revival, remote-mirror
 * convergence and post-stream settling identically in every mode — plus the
 * thread-idle / no-pending-tasks glue asserted after every step.
 */

import "server-only";

import { and, eq, like, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskStatus } from "next-vibe/tasks/enum";
import { expect } from "vitest";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

import type { HeadlessAiStreamResult } from "../../../repository/headless";
import type { SlimMessage } from "../../../testing/headless-test-runner";
import {
  runTestStream,
  toolResultRecord,
  waitForThreadIdle,
} from "../../../testing/headless-test-runner";
import { assertParentTimeOrder } from "./chain";
import type { ModeConfig } from "./config";
import { resolveToolResult } from "./messages";

/**
 * Assert that the thread's streamingState is idle.
 * Uses waitForThreadIdle — thread should already be idle so this returns immediately.
 */
export async function assertThreadIdle(
  threadId: string,
  user: JwtPrivatePayloadType,
): Promise<void> {
  await waitForThreadIdle(threadId, user, 5_000);
}

/**
 * Assert no pending wakeUp/background tasks remain for a thread.
 * Uses ORM query against cronTasks (no raw SQL).
 */
export async function assertNoPendingTasks(threadId: string): Promise<void> {
  const terminalStatuses = ["completed", "cancelled", "failed", "stopped"];
  const pending = await db
    .select({ id: cronTasks.id, status: cronTasks.lastExecutionStatus })
    .from(cronTasks)
    .where(
      and(eq(cronTasks.wakeUpThreadId, threadId), eq(cronTasks.enabled, true)),
    );
  const active = pending.filter(
    (p) => !terminalStatuses.includes(p.status ?? ""),
  );
  expect(
    active.length,
    `Thread ${threadId} has ${String(active.length)} active tasks: ${active.map((p) => `${p.id}:${String(p.status)}`).join(", ")}`,
  ).toBe(0);
}

/** Per-suite state runStream needs from the enclosing describeStreamSuite closure. */
export interface RunStreamDeps {
  cfg: ModeConfig;
  /** Suite root: BACKGROUND unless the mode overrides with an instance folder root. */
  suiteRootFolderId: DefaultFolderId;
  /** Thread messages, testUser-bound. */
  getMessages: (tid: string) => Promise<SlimMessage[]>;
  /** Current streamingState for a thread via the messages endpoint. */
  getStreamingState: (tid: string) => Promise<string | undefined>;
  /** Per-suite folder (<suiteRoot> → tests → <testCaseName>) — set in beforeAll. */
  getTestSubFolderId: () => string | undefined;
  /** REMOTE-folder modes: per-suite folder nested inside the instance folder. */
  getOverrideSubFolderId: () => string | undefined;
  /** Loop-local topology: the hermes-side REMOTE/<client>/tests/<case> folder. */
  getHermesCaseFolderId?: () => string | undefined;
}

export type RunStreamParams = Parameters<typeof runTestStream>[0] & {
  /** Set ONLY for tests that exercise tool error paths. */
  allowToolErrors?: boolean;
};

export type RunStreamFn = (
  params: RunStreamParams,
) => Promise<ReturnType<typeof runTestStream>>;

/**
 * Build the suite's runStream: a drop-in for runTestStream that handles
 * queue-mode revival transparently.
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
export function makeRunStream(deps: RunStreamDeps): RunStreamFn {
  const { cfg, suiteRootFolderId, getMessages, getStreamingState } = deps;
  return async function runStream(
    params: RunStreamParams,
  ): Promise<ReturnType<typeof runTestStream>> {
    // Snapshot the thread BEFORE the stream so post-stream checks can
    // distinguish this stream's tool messages from earlier ones.
    const preStreamMessageIds = new Set<string>(
      params.threadId
        ? (await getMessages(params.threadId)).map((m) => m.id)
        : [],
    );
    // Every stream lands in <suiteRoot> → tests → <testCaseName> unless the
    // call explicitly targets another root (e.g. INCOGNITO — an incognito
    // stream must stay incognito in EVERY context, relay included). The suite
    // override redirects only the default case into the nested
    // instance-folder chain.
    const effectiveRootFolderId =
      params.rootFolderId ?? cfg.rootFolderIdOverride ?? suiteRootFolderId;
    const effectiveSubFolderId =
      cfg.subFolderIdOverride !== undefined
        ? (deps.getOverrideSubFolderId() ?? cfg.subFolderIdOverride)
        : params.subFolderId !== undefined
          ? params.subFolderId
          : effectiveRootFolderId === suiteRootFolderId
            ? deps.getTestSubFolderId()
            : undefined;
    // Loop-local origination applies only to the SHARED-thread relay cases.
    // Cases with an explicit rootFolderId (C2 incognito) are locality-pinned
    // by definition — incognito never rides the REMOTE-folder relay; run them
    // as a normal local stream.
    if (cfg.originateOnRemote && params.rootFolderId === undefined) {
      return runLoopLocalStream(deps, params, preStreamMessageIds);
    }
    const firstResult = await runTestStream({
      ...params,
      rootFolderId: effectiveRootFolderId,
      subFolderId: effectiveSubFolderId,
    });

    // Waiting-state handling — two flavors:
    //   Queue mode (cfg.pulse): run pulse → revival → re-fetch.
    //   Remote dispatch (cfg.remoteInstanceId): the executor instance POSTs
    //   /report which fires the revival directly — just wait for idle.
    // EVERY mode handles the waiting state the same way: when a stream
    // pauses on a pending task or remote call, await the revival before
    // returning — await-task delivery is inline OR revival in any mode.
    if (firstResult.result.success && firstResult.result.data.threadId) {
      const tid = firstResult.result.data.threadId;

      // REMOTE-folder mirror wait: the loop ran on the remote instance, so
      // a detach/wakeUp task completes THERE after the live relay stream
      // closed. The backfilled result reaches this (caller) DB by sync —
      // live WS push when a persistent channel exists (reverse-ws), or
      // pull-on-demand when not (direct-http has no channel). Drive a pull
      // each tick and poll the local mirror until the pending async tool
      // message resolves, so assertions see the final state in both modes.
      if (cfg.rootFolderIdOverride === DefaultFolderId.REMOTE) {
        const MIRROR_WAIT_MS = 60_000;
        const mirrorStart = Date.now();
        for (;;) {
          const snapshot = await getMessages(tid);
          // Three convergence conditions, all must clear:
          //  1. No pending async tool (detach/wakeUp result not yet mirrored).
          //  2. No dead-end compacting message — a compacting node with no
          //     child means the owner's re-parent of the following turn has
          //     not synced yet (the turn still points at the pre-compacting
          //     leaf locally). Both resolve once sync applies the
          //     owner-authoritative state.
          //  3. This turn's assistant reply has mirrored back. The relayed
          //     loop runs on the remote and the final assistant message arrives
          //     via the sync/WS mirror AFTER the relay HTTP response returns —
          //     so without this, a no-tool turn (e.g. T-SYS "reply RELAY_OK")
          //     breaks before the reply lands and `messages` has no assistant.
          const childIds = new Set(
            snapshot.map((m) => m.parentId).filter((id): id is string => !!id),
          );
          const pendingAsync = snapshot.filter((m) => {
            if (
              m.role !== "tool" ||
              preStreamMessageIds.has(m.id) ||
              (m.toolCall?.callbackMode !== "detach" &&
                m.toolCall?.callbackMode !== "wakeUp")
            ) {
              return false;
            }
            if (
              m.toolCall?.status === "pending" ||
              resolveToolResult(m) === null
            ) {
              return true;
            }
            // Detach hint: execute-tool returned {hint, taskId} but the
            // background task hasn't backfilled a terminal result yet.
            const res = resolveToolResult(m);
            return (
              typeof res?.["hint"] === "string" &&
              res["imageUrl"] === undefined &&
              res["audioUrl"] === undefined &&
              res["videoUrl"] === undefined
            );
          });
          const danglingCompacting = snapshot.filter(
            (m) =>
              m.isCompacting &&
              !preStreamMessageIds.has(m.id) &&
              !childIds.has(m.id),
          );
          // WAIT-mode tool results mirror as separate events — a snapshot
          // taken between the final assistant and a still-in-flight
          // tool-result reads a resultless tool row. Wait for every new tool
          // message to carry its result.
          const unresolvedWaitTools = snapshot.filter(
            (m) =>
              m.role === "tool" &&
              !preStreamMessageIds.has(m.id) &&
              m.toolCall?.callbackMode !== "detach" &&
              m.toolCall?.callbackMode !== "wakeUp" &&
              (m.toolCall?.status === "pending" ||
                resolveToolResult(m) === null),
          );
          // This turn's assistant reply must have mirrored back: at least one
          // new (post-pre-stream) assistant message with non-empty content.
          const hasNewAssistantReply = snapshot.some(
            (m) =>
              m.role === "assistant" &&
              !preStreamMessageIds.has(m.id) &&
              (m.content ?? "").trim() !== "",
          );
          if (
            (pendingAsync.length === 0 &&
              danglingCompacting.length === 0 &&
              unresolvedWaitTools.length === 0 &&
              hasNewAssistantReply) ||
            Date.now() - mirrorStart > MIRROR_WAIT_MS
          ) {
            break;
          }
          // Drive an explicit pull each tick — broadcastSyncNotify from the
          // remote may have been lost if the WS dropped (e.g. HMR). Pulling
          // guarantees the mirror converges even without a live WS push.
          {
            const { getWsConnection } =
              await import("next-vibe/realtime/connector");
            const conn = cfg.systemPromptInstanceId
              ? getWsConnection(cfg.systemPromptInstanceId)
              : null;
            conn?.doPullNow();
          }
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 500);
          });
        }
      }

      // Relay (inference-provider / ws-provider) convergence wait: the caller
      // flips the thread idle when the relay HTTP call returns, but the
      // assistant reply arrives separately as relayed message events
      // (message-created/content-done posted from the provider). Reading the
      // thread immediately can catch an idle thread whose reply is still in
      // flight — poll until this turn's assistant reply (non-empty content)
      // has been applied locally, bounded.
      if (
        cfg.assertRelayRan &&
        cfg.rootFolderIdOverride !== DefaultFolderId.REMOTE
      ) {
        const RELAY_EVENT_WAIT_MS = 45_000;
        const relayWaitStart = Date.now();
        let lastFingerprint = "";
        let stablePolls = 0;
        for (;;) {
          const snapshot = await getMessages(tid);
          const hasNewAssistantReply = snapshot.some(
            (m) =>
              m.role === "assistant" &&
              !preStreamMessageIds.has(m.id) &&
              (m.content ?? "").trim() !== "",
          );
          // Events land independently: a content-done stub can exist before
          // message-created backfills its parent pointer, and a multi-turn
          // tool flow delivers each turn's messages separately. Converge only
          // when every new non-user message is structurally complete AND the
          // snapshot has been quiescent (identical) across consecutive polls
          // — a first-turn reply alone is NOT the final state.
          const hasDanglingStub = snapshot.some(
            (m) =>
              !preStreamMessageIds.has(m.id) &&
              m.role !== "user" &&
              !m.parentId,
          );
          const fingerprint = snapshot
            .map(
              (m) => `${m.id}:${(m.content ?? "").length}:${m.parentId ?? ""}`,
            )
            .join("|");
          stablePolls = fingerprint === lastFingerprint ? stablePolls + 1 : 0;
          lastFingerprint = fingerprint;
          if (
            (hasNewAssistantReply && !hasDanglingStub && stablePolls >= 3) ||
            Date.now() - relayWaitStart > RELAY_EVENT_WAIT_MS
          ) {
            break;
          }
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 500);
          });
        }
      }

      let threadStreamingState = await getStreamingState(tid);
      let revivalPending = false;

      // The aborting stream writes 'waiting' asynchronously AFTER the
      // result is returned (clearStreamingState reconciles against the DB
      // first). When a remote call is genuinely in flight, poll briefly so
      // the transition isn't missed — otherwise assertions run against a
      // thread that is about to enter 'waiting'.
      if (threadStreamingState !== "waiting") {
        // Pending work = a running task targeting the thread, a scheduled
        // revival row, or an in-flight remote call. Any of them means the
        // thread is about to enter 'waiting' (or jump straight to a
        // revival) — poll the transition instead of racing it.
        const { hasPendingCallForThread } =
          await import("next-vibe/execute-tool/pending-calls");
        const hasPendingWork = async (): Promise<boolean> => {
          const [runningTask] = await db
            .select({ id: cronTasks.id })
            .from(cronTasks)
            .where(
              and(
                eq(cronTasks.wakeUpThreadId, tid),
                eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
              ),
            )
            .limit(1);
          if (runningTask) {
            return true;
          }
          const [resumeRow] = await db
            .select({ id: cronTasks.id })
            .from(cronTasks)
            .where(
              and(
                eq(cronTasks.enabled, true),
                like(cronTasks.routeId, "resume-stream%"),
                sql`${cronTasks.taskInput}->>'threadId' = ${tid}`,
              ),
            )
            .limit(1);
          if (resumeRow) {
            return true;
          }
          return hasPendingCallForThread(tid);
        };
        // The caller's stream has returned — a 'streaming' state on the
        // thread now belongs to a revival claim and counts as pending work.
        revivalPending =
          threadStreamingState === "streaming" ? true : await hasPendingWork();
        if (revivalPending) {
          for (let i = 0; i < 20 && threadStreamingState !== "waiting"; i++) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 300);
            });
            threadStreamingState = await getStreamingState(tid);
            if (threadStreamingState === "idle" && !(await hasPendingWork())) {
              break;
            }
          }
        }
      } else {
        revivalPending = true;
      }

      if (threadStreamingState === "waiting" || revivalPending) {
        // Queue mode pauses via an explicit 'waiting' state before the
        // pulse fires the revival (spec requirement).
        if (cfg.pulse) {
          expect(
            threadStreamingState,
            "Queue WAIT: thread must be in 'waiting' state after stream aborts",
          ).toBe("waiting");
        }

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

        // Queue mode: run pulse (polls remote task completion → fires
        // revival in-process). Remote dispatch: /report fires the revival —
        // nothing to trigger here, just wait.
        if (cfg.pulse) {
          await cfg.pulse(tid);
        }

        // Revival runs as fire-and-forget inside resume-stream. Wait for thread → 'idle'.
        // Remote dispatch gets a longer budget: executor round trip + /report
        // + revival turn can take a while on cold instances.
        // If the AI retries a failed tool call, the thread may go back to 'waiting'
        // mid-revival. In that case, call pulse again (up to MAX_PULSE_RETRIES).
        const REVIVAL_TIMEOUT_MS = cfg.pulse ? 30_000 : 120_000;
        const REVIVAL_POLL_INTERVAL_MS = 500;
        const MAX_PULSE_RETRIES = 3;
        let pulseRetries = 0;
        let lastPulsedAt = Date.now();
        const revivalStart = Date.now();
        let revivalState: string | undefined = "streaming";
        while (
          revivalState !== "idle" &&
          Date.now() - revivalStart < REVIVAL_TIMEOUT_MS
        ) {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, REVIVAL_POLL_INTERVAL_MS);
          });
          revivalState = await getStreamingState(tid);
          // Active reconcile tick: the /report may have landed in ANOTHER
          // process (dev server) — reconciliation completes this process's
          // pending-call entries against the backfilled tool message and
          // fires any attached await-task revival.
          if (cfg.remoteInstanceId && revivalState === "waiting") {
            const { hasPendingCallForThread: reconcileTick } =
              await import("next-vibe/execute-tool/pending-calls");
            await reconcileTick(tid);
          }
          // If thread went back to 'waiting' (AI retried after failure), pulse again.
          if (
            cfg.pulse &&
            revivalState === "waiting" &&
            pulseRetries < MAX_PULSE_RETRIES &&
            Date.now() - lastPulsedAt > 1000
          ) {
            pulseRetries++;
            lastPulsedAt = Date.now();
            // eslint-disable-next-line no-console
            console.log(
              `[runStream] Thread went back to 'waiting' mid-revival - pulsing again (retry ${String(pulseRetries)}/${String(MAX_PULSE_RETRIES)})`,
              { threadId: tid },
            );
            await cfg.pulse(tid);
          }
        }
        expect(
          revivalState,
          "Queue WAIT: thread must return to 'idle' after revival",
        ).toBe("idle");

        // Re-fetch messages with post-revival state
        const revivedMessages = await getMessages(tid);
        // Chain-walk from the stream's own last message to find the true leaf
        // in the post-revival state. The stream may have ended on a non-leaf
        // node (e.g. the phase1 assistant), and the revival adds deferred +
        // revival-ai below it. Always walk to the deepest descendant so that
        // the next turn's parent pointer lands on the actual leaf, not a node
        // that already has children.
        const firstStreamResult = firstResult.result;
        const revivedById = new Map(revivedMessages.map((m) => [m.id, m]));
        const revivedChildrenOf = new Map<string, SlimMessage[]>();
        for (const m of revivedMessages) {
          if (m.parentId) {
            const list = revivedChildrenOf.get(m.parentId) ?? [];
            list.push(m);
            revivedChildrenOf.set(m.parentId, list);
          }
        }
        // Walk from the stream's leaf to the deepest descendant.
        const streamLeafId = firstStreamResult.success
          ? firstStreamResult.data.lastAiMessageId
          : undefined;
        let revivalLeaf = streamLeafId
          ? revivedById.get(streamLeafId)
          : undefined;
        if (revivalLeaf) {
          const visited = new Set<string>();
          while (revivalLeaf) {
            visited.add(revivalLeaf.id);
            const kids: SlimMessage[] = (
              revivedChildrenOf.get(revivalLeaf.id) ?? []
            ).filter((k) => !visited.has(k.id));
            if (kids.length === 0) {
              break;
            }
            revivalLeaf = kids[0];
          }
        }
        // Walk back up from the leaf to find the nearest assistant with content.
        // That is the AI's final answer for this turn.
        let lastRevivalAi: SlimMessage | undefined;
        {
          let cursor = revivalLeaf;
          while (cursor) {
            if (
              cursor.role === "assistant" &&
              (cursor.content ?? "").trim() !== ""
            ) {
              lastRevivalAi = cursor;
              break;
            }
            cursor = cursor.parentId
              ? revivedById.get(cursor.parentId)
              : undefined;
          }
        }
        // Sum credits from all messages (initial stream charges tool credits; revival charges AI credits).
        const totalCredits = revivedMessages.reduce(
          (sum, m) => sum + (m.creditCost ?? 0),
          0,
        );
        // Use the leaf id as the anchor for the next turn (headless runner
        // semantics: lastAiMessageId = leaf of the walked chain). Fall back to
        // lastRevivalAi.id if the leaf walk failed (e.g. no messages at all).
        const revivedLeafId = revivalLeaf?.id ?? lastRevivalAi?.id;
        const revivedResult =
          revivedLeafId && firstResult.result.success
            ? {
                ...firstResult.result,
                data: {
                  ...firstResult.result.data,
                  lastAiMessageId: revivedLeafId,
                  totalCreditsDeducted:
                    totalCredits > 0
                      ? totalCredits
                      : firstResult.result.data.totalCreditsDeducted,
                },
              }
            : firstResult.result;
        assertParentTimeOrder(revivedMessages);
        return {
          result: revivedResult,
          messages: revivedMessages,
          pinnedToolCount: firstResult.pinnedToolCount,
        };
      }

      // Uniform post-stream snapshot: a fast revival can complete entirely
      // between the stream's return and the checks above (fixture-speed
      // tasks). The caller always receives the thread's CURRENT state, and
      // lastAiMessageId points at the newest assistant when a revival
      // appended one.
      const finalMessages = await getMessages(tid);

      // A tool error during the stream is a test failure unless the test
      // explicitly exercises an error path.
      if (!params.allowToolErrors) {
        const erroredTools = finalMessages.filter((m) => {
          if (m.role !== "tool" || preStreamMessageIds.has(m.id)) {
            return false;
          }
          const res = toolResultRecord(m.toolCall?.result);
          return typeof res?.["error"] === "string" && res["error"] !== "";
        });
        expect(
          erroredTools.map((m) => ({
            toolName: m.toolCall?.toolName,
            error: toolResultRecord(m.toolCall?.result)?.["error"],
          })),
          `Stream produced ${String(erroredTools.length)} unexpected tool error(s) — pass allowToolErrors only for tests that exercise error paths`,
        ).toEqual([]);
      }
      const newestAi = [...finalMessages]
        .toReversed()
        .find((m) => m.role === "assistant");
      // This turn's credits, recomputed from the SETTLED snapshot: in relay
      // modes the creditCost-carrying message events land after the stream
      // call returned, so the in-call sum can be 0/partial.
      const settledTurnCredits = finalMessages.reduce(
        (sum, m) =>
          preStreamMessageIds.has(m.id) ? sum : sum + (m.creditCost ?? 0),
        0,
      );
      const finalResult = firstResult.result.success
        ? {
            ...firstResult.result,
            data: {
              ...firstResult.result.data,
              lastAiMessageId:
                newestAi &&
                newestAi.id !== firstResult.result.data.lastAiMessageId
                  ? newestAi.id
                  : firstResult.result.data.lastAiMessageId,
              totalCreditsDeducted: Math.max(
                firstResult.result.data.totalCreditsDeducted ?? 0,
                settledTurnCredits,
              ),
            },
          }
        : firstResult.result;
      assertParentTimeOrder(finalMessages);
      await assertCasePlacement(
        cfg,
        effectiveRootFolderId,
        suiteRootFolderId,
        finalResult.success ? finalResult.data.threadId : undefined,
      );
      return {
        result: finalResult,
        messages: finalMessages,
        pinnedToolCount: firstResult.pinnedToolCount,
      };
    }

    assertParentTimeOrder(firstResult.messages);
    await assertCasePlacement(
      cfg,
      effectiveRootFolderId,
      suiteRootFolderId,
      firstResult.result.success ? firstResult.result.data.threadId : undefined,
    );
    return firstResult;
  };
}

/**
 * Loop-LOCAL stream: originate on hermes (REMOTE/<client>/tests/<case> there),
 * the relay executes the loop HERE. Wait for the LOCAL executor copy
 * (BACKGROUND/remote/<hermes>/tests/<case>) to converge, then return the
 * standard runStream shape read from the LOCAL thread.
 */
async function runLoopLocalStream(
  deps: RunStreamDeps,
  params: RunStreamParams,
  preStreamMessageIds: Set<string>,
): Promise<ReturnType<typeof runTestStream>> {
  const { cfg, getMessages } = deps;
  const { originateStreamOnHermes } = await import("./remote");
  const hermesFolder = deps.getHermesCaseFolderId?.();
  if (!hermesFolder) {
    // oxlint-disable-next-line restricted-syntax -- test wiring error
    throw new Error("loop-local: hermesCaseFolderId not prepared in beforeAll");
  }
  if (params.user.isPublic) {
    // oxlint-disable-next-line restricted-syntax -- test wiring error
    throw new Error("loop-local: requires an authenticated test user");
  }
  const threadId = params.threadId ?? crypto.randomUUID();
  const origin = await originateStreamOnHermes({
    testUser: params.user,
    prompt: params.prompt,
    threadId,
    hermesCaseFolderId: hermesFolder,
    parentMessageId: params.explicitParentMessageId ?? null,
    toolConfirmations: params.toolConfirmations ?? null,
    attachments: params.attachments,
    favoriteId: params.favoriteId,
    // Reverse-ws fans the relayed stream to every local connector holder —
    // this process must pre-claim to win. Direct-http is a single POST to the
    // dev server; pre-claiming would starve its only recipient.
    preClaim: cfg.expectRelayTransport !== "direct-http",
  });
  if (!origin.success) {
    // Return the REAL failure response — cases like C3 (insufficient credits)
    // assert on result.errorType, exactly like a locally-failed stream.
    return {
      result: origin.failure,
      messages: [],
      pinnedToolCount: 0,
    };
  }
  // Local executor convergence: the loop runs HERE — the local thread row
  // carries its real streaming state. Wait until the stream has finished
  // (state back to idle/null) AND a new assistant message exists; a
  // fingerprint heuristic converges too early during model-latency gaps
  // (stable throttled writes mid-turn look "settled").
  const WAIT_MS = 180_000;
  const start = Date.now();
  let messages: SlimMessage[] = [];
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const { eq: eqOp } = await import("drizzle-orm");
  for (;;) {
    const [threadRow] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eqOp(chatThreads.id, threadId))
      .limit(1);
    const idle =
      threadRow !== undefined &&
      (threadRow.streamingState === null ||
        threadRow.streamingState === "idle");
    if (idle) {
      messages = await getMessages(threadId);
      const hasNewAssistant = messages.some(
        (m) =>
          m.role === "assistant" &&
          !preStreamMessageIds.has(m.id) &&
          (m.content ?? "").trim() !== "",
      );
      if (hasNewAssistant) {
        break;
      }
    }
    if (Date.now() - start > WAIT_MS) {
      messages = await getMessages(threadId);
      break;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
  }
  const newestAi = messages.findLast((m) => m.role === "assistant");
  assertParentTimeOrder(messages);
  await assertLoopLocalPlacement(cfg, threadId);
  const { success: successResponse } =
    await import("next-vibe/core/route/response.schema");
  // The loop ran HERE as the relay executor — its assistant messages carry the
  // per-turn creditCost in metadata. Sum the NEW ones so callers can assert
  // real billing (the deduction happened on this instance).
  const newAssistantIds = messages
    .filter((m) => m.role === "assistant" && !preStreamMessageIds.has(m.id))
    .map((m) => m.id);
  let totalCreditsDeducted = 0;
  if (newAssistantIds.length > 0) {
    const { chatMessages } = await import("@/app/api/[locale]/agent/chat/db");
    const { inArray } = await import("drizzle-orm");
    const rows = await db
      .select({ metadata: chatMessages.metadata })
      .from(chatMessages)
      .where(inArray(chatMessages.id, newAssistantIds));
    for (const row of rows) {
      const cost = row.metadata?.creditCost;
      if (typeof cost === "number") {
        totalCreditsDeducted += cost;
      }
    }
  }
  // Native media file parts surface as a synthetic tool message
  // (FilePartHandler: toolName=generate_image/... with the media URL in the
  // result) — mirror what the in-process stream reports as
  // lastGeneratedMediaUrl.
  let lastGeneratedMediaUrl: string | null = null;
  for (const m of messages) {
    if (m.role !== "tool" || preStreamMessageIds.has(m.id)) {
      continue;
    }
    const toolResult = resolveToolResult(m);
    const mediaUrl =
      toolResult?.["imageUrl"] ??
      toolResult?.["videoUrl"] ??
      toolResult?.["audioUrl"] ??
      toolResult?.["musicUrl"] ??
      // Native file parts: FilePartHandler's synthetic tool message stores
      // the stored-media URL under `file`.
      toolResult?.["file"];
    if (typeof mediaUrl === "string" && mediaUrl.length > 0) {
      lastGeneratedMediaUrl = mediaUrl;
    }
  }
  const data: HeadlessAiStreamResult = {
    threadId,
    lastAiMessageId: newestAi?.id ?? "",
    lastAiMessageContent: newestAi?.content ?? null,
    totalCreditsDeducted,
    lastGeneratedMediaUrl,
    // The loop ran via the hermes-originated relay; the local observer never
    // sees the receiver's tool-schema count.
    pinnedToolCount: 0,
  };
  return {
    result: successResponse(data),
    messages,
    pinnedToolCount: 0,
  };
}

/** Loop-local placement: local=BACKGROUND/remote/<hermes>/tests/<case>, hermes=REMOTE/<client>/tests/<case>. */
async function assertLoopLocalPlacement(
  cfg: ModeConfig,
  threadId: string,
): Promise<void> {
  const testCaseName =
    cfg.cachePrefix.replace(/[^a-z0-9-]/gi, "").replace(/-+$/, "") || "regular";
  const { assertThreadPlacement, HERMES_INSTANCE_ID, SELF_INSTANCE_ID } =
    await import("../../../testing/remote-setup");
  await assertThreadPlacement({
    db: "local",
    threadId,
    rootFolderId: DefaultFolderId.BACKGROUND,
    nameChain: ["remote", HERMES_INSTANCE_ID, "tests", testCaseName],
  });
  await assertThreadPlacement({
    db: "hermes",
    threadId,
    rootFolderId: DefaultFolderId.REMOTE,
    nameChain: [SELF_INSTANCE_ID, "tests", testCaseName],
  });
}

/**
 * Placement discipline — asserted after EVERY successful stream (100% or fail):
 *   same-instance suites → local PRIVATE/tests/<case>, nothing anywhere else;
 *   REMOTE-folder suites → caller REMOTE/<remoteId>/tests/<case> AND executor
 *   BACKGROUND/remote/<callerId>/tests/<case> on the hermes DB.
 * Streams explicitly targeting another root (e.g. INCOGNITO cases) are exempt —
 * the effectiveRootFolderId reflects the caller's explicit override.
 */
async function assertCasePlacement(
  cfg: ModeConfig,
  effectiveRootFolderId: DefaultFolderId,
  suiteRootFolderId: DefaultFolderId,
  threadId: string | undefined,
): Promise<void> {
  if (!threadId) {
    return;
  }
  const testCaseName =
    cfg.cachePrefix.replace(/[^a-z0-9-]/gi, "").replace(/-+$/, "") || "regular";
  const { assertThreadPlacement, HERMES_INSTANCE_ID, SELF_INSTANCE_ID } =
    await import("../../../testing/remote-setup");
  if (cfg.rootFolderIdOverride === DefaultFolderId.REMOTE) {
    if (effectiveRootFolderId !== DefaultFolderId.REMOTE) {
      return; // explicit non-default root (e.g. incognito case) — exempt
    }
    await assertThreadPlacement({
      db: "local",
      threadId,
      rootFolderId: DefaultFolderId.REMOTE,
      nameChain: [HERMES_INSTANCE_ID, "tests", testCaseName],
    });
    await assertThreadPlacement({
      db: "hermes",
      threadId,
      rootFolderId: DefaultFolderId.BACKGROUND,
      nameChain: ["remote", SELF_INSTANCE_ID, "tests", testCaseName],
    });
    return;
  }
  if (cfg.rootFolderIdOverride) {
    return; // other explicit suite roots manage their own placement
  }
  if (effectiveRootFolderId !== suiteRootFolderId) {
    return; // per-call override (incognito etc.) — exempt
  }
  await assertThreadPlacement({
    db: "local",
    threadId,
    rootFolderId: suiteRootFolderId,
    nameChain: ["tests", testCaseName],
  });
}
