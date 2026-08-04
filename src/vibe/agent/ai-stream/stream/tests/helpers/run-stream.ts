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

import type { ToolExecutionContext } from "../../../../../core/execution-context";
import {
  DefaultFolderId,
  rootlessToolExecutionContext,
} from "../../../../../core/execution-context";
import { chatThreads } from "../../../../chat/db";
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
      and(
        sql`${cronTasks.taskInput}->>'threadId' = ${threadId}`,
        eq(cronTasks.enabled, true),
      ),
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
  /**
   * Per-case fixture context, set by each test case before its first stream
   * (suite-closure state, same pattern as getTestSubFolderId). runStream
   * passes it EXPLICITLY into runTestStream → toolExecutionContext → the whole
   * chain; the thread anchors it for later turns and revivals.
   */
  getCaseFixture: () => ToolExecutionContext | undefined;
  /**
   * The case's fixture-seeded threadId (minted by setCaseFixture, its fixtures
   * row already written on every relevant instance). runStream uses it as the
   * stream threadId whenever the case doesn't pass an explicit one, so every
   * turn / revival / remote copy shares one id and one cache folder.
   */
  getCaseThreadId: () => string | undefined;
  /** Thread messages, testUser-bound. */
  getMessages: (tid: string) => Promise<SlimMessage[]>;
  /** Current streamingState for a thread via the messages endpoint. */
  getStreamingState: (tid: string) => Promise<string | undefined>;
  /** Per-suite folder (<suiteRoot> → tests → <testCaseName>) — set in beforeAll. */
  getTestSubFolderId: () => string | undefined;
  /** REMOTE-folder modes: per-suite folder nested inside the instance folder. */
  getOverrideSubFolderId: () => string | undefined;
  /** The user's IANA timezone — sent on every stream POST body. */
  timezone: string;
}

export type RunStreamParams = Omit<
  Parameters<typeof runTestStream>[0],
  "toolExecutionContext"
> & {
  /** Set ONLY for tests that exercise tool error paths. */
  allowToolErrors?: boolean;
  /**
   * Optional here (and ONLY here): makeRunStream explicitly injects
   * deps.getCaseFixture() — that injection IS the conscious explicit pass
   * required by runTestStream's own signature. Set to override per call.
   */
  toolExecutionContext?: ToolExecutionContext;
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
    // The stream's threadId: an explicit per-call id wins; otherwise the case's
    // fixture-seeded id (setCaseFixture already wrote its fixtures row on every
    // relevant instance). This id rides the whole case — turns, revivals, and
    // remote copies all share it, so one cache folder serves the run everywhere.
    const effectiveThreadId = params.threadId ?? deps.getCaseThreadId();
    // Snapshot the thread BEFORE the stream so post-stream checks can
    // distinguish this stream's tool messages from earlier ones.
    const preStreamMessageIds = new Set<string>(
      effectiveThreadId
        ? (await getMessages(effectiveThreadId)).map((m) => m.id)
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
    // Settle BEFORE sending on an existing thread. Two hazards from the
    // previous case, both real product timing, both fatal to a linear chain:
    //   1. 'streaming' still held (late wakeUp revival) → this send would be
    //      AUTO-QUEUED and the case would read messages before its turn ran.
    //   2. idle but with a PENDING wakeUp task → the deferred result inserts
    //      under the same parent this send resolves → branch violation.
    // So: drain pending wakeUp tasks first (their revival flips the thread
    // through streaming and back), then require idle. Generous window —
    // revivals take a full model turn.
    // Settle only when CONTINUING an existing thread (prior messages present) —
    // a brand-new case thread has nothing to drain. Keyed on the snapshot, not
    // on threadId presence (every stream now carries the case's seeded id).
    if (effectiveThreadId && preStreamMessageIds.size > 0) {
      const settleDeadline = Date.now() + 120_000;
      // Did this thread EVER carry an in-flight task while we drained? The
      // stability window below only matters for a wakeUp/detach task that goes
      // terminal mid-drain and fires its revival a beat later. When no task was
      // ever pending (the common case — plain text/tool turns), that race is
      // impossible, so skip the 1.5s stability sleep + redundant second idle
      // read entirely. This is the per-turn fixed cost that dominated replay
      // wall-clock (~1.5s × every continuing turn) with no correctness role.
      let sawPendingTask = false;
      for (;;) {
        const pending = await db
          .select({ id: cronTasks.id, status: cronTasks.lastExecutionStatus })
          .from(cronTasks)
          .where(
            and(
              sql`${cronTasks.taskInput}->>'threadId' = ${effectiveThreadId}`,
              eq(cronTasks.enabled, true),
            ),
          );
        const active = pending.filter(
          (p) =>
            !["completed", "cancelled", "failed", "stopped"].includes(
              p.status ?? "",
            ),
        );
        if (active.length > 0) {
          sawPendingTask = true;
        }
        if (active.length === 0 || Date.now() > settleDeadline) {
          break;
        }
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 100);
        });
      }
      await waitForThreadIdle(
        effectiveThreadId,
        params.user,
        60_000,
        effectiveRootFolderId,
      );
      // Idle must be STABLE only when a task was in flight: a just-terminal
      // wakeUp task fires its revival stream a beat later (terminal → revival →
      // streaming → idle). Two consecutive idle reads with a gap close that
      // window. No task ⇒ no late revival ⇒ no stability wait needed.
      if (sawPendingTask) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1_500);
        });
        await waitForThreadIdle(
          effectiveThreadId,
          params.user,
          60_000,
          effectiveRootFolderId,
        );
      }
    }
    // The case's fixture context (thread-anchored, carries the threadId). A
    // per-call override wins; otherwise the suite-closure case fixture; a case
    // that set neither runs with an explicit thread-less root (live external).
    const casetoolExecutionContext =
      params.toolExecutionContext ??
      deps.getCaseFixture() ??
      rootlessToolExecutionContext();
    const firstResult = await runTestStream({
      timezone: deps.timezone,
      ...params,
      // The seeded case threadId (or an explicit per-call one) — its fixtures
      // row is already written, so the AI loop replays from ordinal 0.
      threadId: effectiveThreadId,
      toolExecutionContext: casetoolExecutionContext,
      rootFolderId: effectiveRootFolderId,
      subFolderId: effectiveSubFolderId,
      // Remote-folder loop-local topology is a CONNECTION setting
      // (remoteConnections.loopLocation = 'caller'), configured by the suite
      // setup — nothing rides the stream request.
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
        // Media turns replay long recorded poll chains (a 300-poll video
        // replay alone runs tens of seconds) — honor the caller's settle
        // budget instead of racing it with a flat cap.
        const MIRROR_WAIT_MS = params.settleTimeoutMs ?? 30_000;
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
          // Async originals are settled by their DEFERRED counterpart, not
          // in place: a wakeUp ORIGINAL row stays resultless BY DESIGN (the
          // deferred row carries the backfill) and detach NEVER backfills
          // (result only via await-task). Treating those as pending made
          // every turn after the first wakeUp burn the full mirror-wait
          // timeout. Only a wakeUp original with NO deferred counterpart is
          // genuinely still in flight.
          const deferredFor = new Set(
            snapshot
              .filter((m) => m.toolCall?.isDeferred === true)
              .map((m) => m.toolCall?.originalToolCallId)
              .filter((id): id is string => typeof id === "string"),
          );
          const pendingAsync = snapshot.filter((m) => {
            if (
              m.role !== "tool" ||
              preStreamMessageIds.has(m.id) ||
              m.toolCall?.callbackMode !== "wakeUp" ||
              m.toolCall?.isDeferred === true
            ) {
              return false;
            }
            const callId = m.toolCall?.toolCallId;
            if (typeof callId === "string" && deferredFor.has(callId)) {
              return false;
            }
            return (
              m.toolCall?.status === "pending" || resolveToolResult(m) === null
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
          // This turn's assistant reply must have mirrored back. The relay
          // response names the AUTHORITATIVE final assistant — anything less
          // (an interim think-message) converges mid-turn and the assertions
          // read a half-mirrored thread.
          const finalAiId = firstResult.result.success
            ? firstResult.result.data.lastAiMessageId
            : null;
          const hasNewAssistantReply = finalAiId
            ? snapshot.some(
                (m) => m.id === finalAiId && (m.content ?? "").trim() !== "",
              )
            : snapshot.some(
                (m) =>
                  m.role === "assistant" &&
                  !preStreamMessageIds.has(m.id) &&
                  (m.content ?? "").trim() !== "",
              );
          // Chain chronology must hold: a lost live message-created leaves a
          // delta-built stub with arrival-time createdAt (child older than its
          // parent). The driven pull below heals it — wait for that.
          const byId = new Map(snapshot.map((m) => [m.id, m]));
          // A lost message-created leaves a PARENTLESS stub — a phantom
          // second root chainTimeSane cannot see (no parent to compare).
          // Only the turn's user message may be a root.
          const noPhantomRoots = snapshot.every(
            (m) =>
              preStreamMessageIds.has(m.id) ||
              m.parentId !== null ||
              m.role === "user",
          );
          const chainTimeSane = snapshot.every((m) => {
            if (!m.parentId || preStreamMessageIds.has(m.id)) {
              return true;
            }
            const parent = byId.get(m.parentId);
            if (!parent || parent.isCompacting) {
              return true;
            }
            return parent.createdAt.getTime() <= m.createdAt.getTime();
          });
          if (
            (pendingAsync.length === 0 &&
              danglingCompacting.length === 0 &&
              unresolvedWaitTools.length === 0 &&
              chainTimeSane &&
              noPhantomRoots &&
              hasNewAssistantReply) ||
            Date.now() - mirrorStart > MIRROR_WAIT_MS
          ) {
            break;
          }
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 100);
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
            setTimeout(resolve, 100);
          });
        }
      }

      let threadStreamingState = await getStreamingState(tid);
      let revivalPending = false;

      // Pending work = a running task targeting the thread, a scheduled or
      // PARKED resume-stream revival row, or an in-flight remote call. Any of
      // them means a revival is still coming — the thread may read 'idle' while
      // a background goroutine + its parked revival are pending, so callers
      // must treat "idle + pending work" as NOT settled. Hoisted here so both
      // the pre-'waiting' poll AND the revival wait below can use it.
      const { PendingCalls } =
        await import("next-vibe/execute-tool/repository/pending-calls");
      const hasPendingWork = async (): Promise<boolean> => {
        const [runningTask] = await db
          .select({ id: cronTasks.id })
          .from(cronTasks)
          .where(
            and(
              sql`${cronTasks.taskInput}->>'threadId' = ${tid}`,
              eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
            ),
          )
          .limit(1);
        if (runningTask) {
          return true;
        }
        // A resume-stream row for this thread — ENABLED (revival scheduled) OR
        // PARKED/disabled (await-task registered a WAIT waiter; it flips
        // enabled=true + fires the revival when the underlying task completes).
        // Both mean a revival is pending. A long-running local detach (real
        // image gen, >15s inline window) takes exactly this parked path.
        // ONLY count NON-TERMINAL rows: a resume-stream task whose
        // lastExecutionStatus is terminal (completed/failed/cancelled/stopped)
        // has already run — treating it as pending would make the settle wait
        // loop never converge (T6a wakeUp leaves a terminal parked row behind).
        // Actionable = enabled (scheduled/running) OR parked with a null/pending
        // status (waiting for its underlying task to complete + fire it).
        const [resumeRow] = await db
          .select({ id: cronTasks.id })
          .from(cronTasks)
          .where(
            and(
              like(cronTasks.routeId, "resume-stream%"),
              sql`${cronTasks.taskInput}->>'threadId' = ${tid}`,
              sql`(${cronTasks.lastExecutionStatus} IS NULL
                   OR ${cronTasks.lastExecutionStatus} NOT IN ('completed','failed','cancelled','stopped'))`,
            ),
          )
          .limit(1);
        if (resumeRow) {
          return true;
        }
        return PendingCalls.hasForThread(tid);
      };

      // The aborting stream writes 'waiting' asynchronously AFTER the
      // result is returned (clearStreamingState reconciles against the DB
      // first). When a remote call is genuinely in flight, poll briefly so
      // the transition isn't missed — otherwise assertions run against a
      // thread that is about to enter 'waiting'.
      if (threadStreamingState !== "waiting") {
        // The caller's stream has returned — a 'streaming' state on the
        // thread now belongs to a revival claim and counts as pending work.
        revivalPending =
          threadStreamingState === "streaming" ? true : await hasPendingWork();
        if (revivalPending) {
          for (let i = 0; i < 20 && threadStreamingState !== "waiting"; i++) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 100);
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
              sql`(${cronTasks.taskInput}->>'threadId' IS NULL OR ${cronTasks.taskInput}->>'threadId' != ${tid})`,
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
        // Media detach/wait: a real background gen (image ~40s) can exceed the
        // 2-min budget — honor the caller's media settle budget when larger.
        const REVIVAL_TIMEOUT_MS = cfg.pulse
          ? 30_000
          : Math.max(120_000, params.settleTimeoutMs ?? 0);
        const REVIVAL_POLL_INTERVAL_MS = 25;
        const MAX_PULSE_RETRIES = 3;
        let pulseRetries = 0;
        let lastPulsedAt = Date.now();
        const revivalStart = Date.now();
        let revivalState: string | undefined = "streaming";
        // Wait for the thread to return to 'idle'. NOTE: 'idle' alone is the
        // terminal for a phase-1 dispatch (wakeUp phase1 ends idle and its
        // revival is a SEPARATE later turn) — do NOT additionally require
        // no-pending-work here, or a phase-1 dispatch (which intentionally
        // leaves a pending revival) would never settle.
        // CHECK-FIRST: read the state before sleeping. A fixture-replay revival
        // usually settles to 'idle' within a few ms of the dispatch turn ending,
        // so the leading sleep guaranteed ~100ms of dead wait on EVERY revival
        // (measured). Check up-front, then only sleep between subsequent polls.
        revivalState = await getStreamingState(tid);
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
            const { PendingCalls: reconcileRegistry } =
              await import("next-vibe/execute-tool/repository/pending-calls");
            await reconcileRegistry.hasForThread(tid);
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
        // Sum credits for THIS turn only — the messages created since the send
        // (initial stream tool credits + revival AI credits). `revivedMessages`
        // is the WHOLE thread; without the preStreamMessageIds filter this summed
        // every prior turn's cost too (e.g. a 30-turn shared thread reported the
        // cumulative ~7.7 instead of the turn's ~0.7), which the C1 truthful-
        // accounting assert then compared against a single-turn ledger window and
        // failed. Matches the settledTurnCredits / headless-runner semantics.
        const totalCredits = revivedMessages.reduce(
          (sum, m) =>
            preStreamMessageIds.has(m.id) ? sum : sum + (m.creditCost ?? 0),
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
 * Placement discipline — asserted after EVERY successful stream (100% or fail):
 *   same-instance suites → local PRIVATE/tests/<case>, nothing anywhere else;
 *   REMOTE-folder suites → caller REMOTE/<remoteId>/tests/<case> AND executor
 *   REMOTE/<callerId>/tests/<case> on the hermes DB (ONE foreign-copy rule).
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
  // Thread folder name is decoupled from the fixture cache (threadCasePrefix) —
  // a suite sharing another's fixtures still lands its threads in its OWN folder.
  const threadCasePrefix = cfg.threadCasePrefix ?? cfg.cachePrefix;
  const testCaseName =
    threadCasePrefix.replaceAll(/[^a-z0-9-]/gi, "").replace(/-+$/, "") ||
    "regular";
  const { assertThreadPlacement, HERMES_INSTANCE_ID, SELF_INSTANCE_ID } =
    await import("../../../testing/remote-setup");
  // The ORIGIN's title is the parity anchor: a new thread starts as the
  // localized "New Chat" default and the MODEL renames it via the rename-thread
  // fragment (never the raw user message). Every mirror must carry that same
  // title verbatim. We read the origin's live title as the anchor and require it
  // to be a real model rename (not the "New Chat" default) below.
  const [localThreadRow] = await db
    .select({ title: chatThreads.title })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);
  const localTitle = localThreadRow?.title ?? "";
  if (cfg.rootFolderIdOverride === DefaultFolderId.REMOTE) {
    if (effectiveRootFolderId !== DefaultFolderId.REMOTE) {
      return; // explicit non-default root (e.g. incognito case) — exempt
    }
    // FOLDER-driven remote suites: the thread is CREATED inside
    // REMOTE/<instance>/private/tests/<case> — the folder's instance id stamps
    // loop_instance_id at creation and routes the loop. `private` is the
    // mirror-subtree segment (own/private threads live under it). The executor's
    // foreign copy nests the origin root: REMOTE/<caller>/private/<chain>.
    await assertThreadPlacement({
      db: "local",
      threadId,
      rootFolderId: DefaultFolderId.REMOTE,
      nameChain: [HERMES_INSTANCE_ID, "private", "tests", testCaseName],
    });
    if (cfg.forceLocalLoop) {
      // Loop-LOCAL topology: the "self" sentinel keeps the loop here — no
      // relay ever lands on hermes, so no executor copy exists there. Tools
      // still execute remotely, but execute-tool creates no threads.
      return;
    }
    // Title parity CONVERGES: the loop runs on hermes, so a model rename lands
    // there first and propagates to the origin (atlas) async via thread-updated.
    // Re-read the origin's live title each tick and require the hermes mirror to
    // match it — settle on the LAST failure rather than racing the propagation.
    {
      const deadline = Date.now() + 30_000;
      for (;;) {
        const [liveRow] = await db
          .select({ title: chatThreads.title })
          .from(chatThreads)
          .where(eq(chatThreads.id, threadId))
          .limit(1);
        const liveTitle = liveRow?.title ?? localTitle;
        try {
          // The EXECUTOR ran the loop → this is hermes's OWN thread, physically
          // in its real PRIVATE/tests/<case> (root=PRIVATE, origin NULL), NOT a
          // REMOTE/<caller>/… mirror. The caller (atlas) holds the REMOTE mirror.
          await assertThreadPlacement({
            db: "hermes",
            threadId,
            rootFolderId: DefaultFolderId.PRIVATE,
            nameChain: ["tests", testCaseName],
            expectedTitle: liveTitle,
          });
          break;
        } catch (err) {
          if (Date.now() > deadline) {
            // oxlint-disable-next-line restricted-syntax -- rethrow last assertion failure in test helper
            throw err;
          }
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 250);
          });
        }
      }
    }
    return;
  }
  if (cfg.rootFolderIdOverride) {
    return; // other explicit suite roots manage their own placement
  }
  if (effectiveRootFolderId !== suiteRootFolderId) {
    return; // per-call override (incognito etc.) — exempt
  }
  // No title assertion: threadId pins identity, and the AI may legitimately
  // rename the thread mid-suite (the rename system-prompt fragment instructs
  // exactly that) — the placement under test is the FOLDER chain.
  await assertThreadPlacement({
    db: "local",
    threadId,
    rootFolderId: suiteRootFolderId,
    nameChain: ["tests", testCaseName],
  });
  if (cfg.assertMirrorOnHermes) {
    // The mirror lands via the thread-updated push at stream completion — an
    // async relay hop behind the local idle signal. Converge on it instead of
    // racing it; the LAST failure is authoritative.
    const deadline = Date.now() + 30_000;
    const { assertMirrorMessageParity } =
      await import("../../../testing/remote-setup");
    for (;;) {
      try {
        await assertThreadPlacement({
          db: "hermes",
          threadId,
          rootFolderId: DefaultFolderId.REMOTE,
          nameChain: [SELF_INSTANCE_ID, "private", "tests", testCaseName],
          expectedTitle: localTitle,
        });
        // Placement alone is not the contract: every local message must have
        // mirrored with the same role + parent (the user message included).
        await assertMirrorMessageParity(threadId);
        return;
      } catch (err) {
        if (Date.now() > deadline) {
          // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
          throw err;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
      }
    }
  }
}
