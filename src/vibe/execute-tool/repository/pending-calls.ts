/**
 * PendingCalls — in-process registries for in-flight async work.
 *
 * 1. Pending REMOTE calls: implements the "No Remote Tasks" rule
 *    (remote-call/spec.md) — a remote call never creates a task row on the
 *    caller. This registry plus the tool message (running → completed/failed)
 *    is the caller's complete state:
 *
 *    - execute-tool registers a call here when dispatching any remote work
 *    - the `tool-execute-result` event (or /report) completes it when the result lands
 *    - await-task awaits it and can attach a revival target
 *    - clearStreamingState asks hasForThread() to decide waiting/idle
 *    - every call has a deadline — on expiry the onDeadline callback runs
 *      (fails the tool message + revives the thread with the error)
 *
 *    Completed entries are kept as tombstones for a short TTL so late duplicate
 *    reports and late await-task calls resolve correctly. After a process
 *    restart the registry is empty — a late result then falls back to the
 *    parked tool message's stored revival metadata (handleToolResult), which
 *    is restart-safe.
 *
 * 2. LOCAL task completion waiters: await-task registers a waiter and is WOKEN
 *    by the detach/wakeUp goroutine's completion — no DB polling. Cross-PROCESS
 *    completions are covered by the caller's single post-wake DB read (the task
 *    row is flipped terminal before notify fires), so a lost in-process signal
 *    degrades to one extra read after the timeout, never to a poll loop.
 *
 * Both registries are globalThis-shared, NOT module-local: the dev server
 * evaluates TWO module graphs (SSR routes + CLI startup), each with its own
 * copy of this module. A dispatcher registering a waiter in one graph and a
 * result event arriving via a route in the other graph must resolve against
 * the SAME registry — a module-local Map made every cross-graph result look
 * like "no pending call" (same trap fetch-cache's sharedState solves the same
 * way).
 */

import "server-only";

import type { WidgetData } from "../../core/utils/json";

import type {
  CompletePendingCallOutcome,
  PendingCallEntry,
  PendingCallInfo,
  PendingCallResult,
  TaskCompletionSignal,
} from "./types-dispatch";

export class PendingCalls {
  /** How long completed entries stay queryable for late waiters/duplicates. */
  private static readonly TOMBSTONE_TTL_MS = 10 * 60 * 1000;

  private static get registry(): Map<string, PendingCallEntry> {
    const g = globalThis as {
      __vibePendingCalls?: Map<string, PendingCallEntry>;
    };
    g.__vibePendingCalls ??= new Map<string, PendingCallEntry>();
    return g.__vibePendingCalls;
  }

  private static get taskWaiters(): Map<
    string,
    Array<(signal: TaskCompletionSignal) => void>
  > {
    const g = globalThis as {
      __vibeTaskCompletionWaiters?: Map<
        string,
        Array<(signal: TaskCompletionSignal) => void>
      >;
    };
    g.__vibeTaskCompletionWaiters ??= new Map();
    return g.__vibeTaskCompletionWaiters;
  }

  static register(params: {
    callId: string;
    instanceId: string;
    toolName: string;
    input?: Record<string, WidgetData> | null;
    threadId: string | null;
    toolMessageId: string | null;
    userId: string | null;
    deadlineMs: number;
    onDeadline: () => Promise<void>;
    onSettled?: () => void;
  }): void {
    const {
      callId,
      instanceId,
      toolName,
      input,
      threadId,
      toolMessageId,
      userId,
      deadlineMs,
      onDeadline,
      onSettled,
    } = params;

    const entry: PendingCallEntry = {
      callId,
      instanceId,
      toolName,
      input: input ?? null,
      threadId,
      toolMessageId,
      userId,
      createdAt: Date.now(),
      deadlineTimer: null,
      result: null,
      waiters: [],
      tombstoneTimer: null,
      onSettled: onSettled ?? null,
    };
    entry.deadlineTimer = setTimeout((): void => {
      entry.deadlineTimer = null;
      // Deadline only acts if the call is still unresolved — and only after
      // checking the DB: another process may have completed it (cross-process
      // /report) without this registry ever hearing about it.
      if (entry.result === null) {
        void PendingCalls.reconcileWithDb(entry).then((completedElsewhere) => {
          if (!completedElsewhere && entry.result === null) {
            return onDeadline();
          }
          return undefined;
        });
      }
    }, deadlineMs);
    PendingCalls.registry.set(callId, entry);
  }

  /**
   * Mark a call as completed and wake all waiters.
   * "duplicate" — the call already has a result (late duplicate report; skip revival).
   * "unknown"   — never registered here (other process / restart; the caller
   *               should fall back to the wire context for revival).
   */
  static complete(
    callId: string,
    result: PendingCallResult,
  ): CompletePendingCallOutcome {
    const entry = PendingCalls.registry.get(callId);
    if (!entry) {
      return { kind: "unknown" };
    }
    if (entry.result !== null) {
      return { kind: "duplicate" };
    }
    if (entry.deadlineTimer !== null) {
      clearTimeout(entry.deadlineTimer);
      entry.deadlineTimer = null;
    }
    entry.result = result;
    PendingCalls.fireOnSettled(entry);
    const waiters = entry.waiters;
    entry.waiters = [];
    for (const waiter of waiters) {
      waiter(result);
    }
    // Tombstone: keep the result queryable briefly, then GC.
    entry.tombstoneTimer = setTimeout((): void => {
      PendingCalls.registry.delete(callId);
    }, PendingCalls.TOMBSTONE_TTL_MS);
    return {
      kind: "completed",
      threadId: entry.threadId,
      toolMessageId: entry.toolMessageId,
    };
  }

  /** Look up a call (pending or tombstoned). Null if unknown. */
  static get(callId: string): PendingCallInfo | null {
    const entry = PendingCalls.registry.get(callId);
    if (!entry) {
      return null;
    }
    return {
      callId: entry.callId,
      instanceId: entry.instanceId,
      toolName: entry.toolName,
      input: entry.input,
      threadId: entry.threadId,
      toolMessageId: entry.toolMessageId,
      userId: entry.userId,
      result: entry.result,
    };
  }

  /**
   * Like get(), but reconciles an unresolved entry against the DB first
   * (another process may have completed it). Use from await-task.
   */
  static async getReconciled(callId: string): Promise<PendingCallInfo | null> {
    const entry = PendingCalls.registry.get(callId);
    if (!entry) {
      return null;
    }
    if (entry.result === null) {
      await PendingCalls.reconcileWithDb(entry);
    }
    return PendingCalls.get(callId);
  }

  /** Remove a tombstoned (or stale) entry immediately after inline delivery. */
  static discard(callId: string): void {
    const entry = PendingCalls.registry.get(callId);
    if (!entry) {
      return;
    }
    PendingCalls.fireOnSettled(entry);
    if (entry.deadlineTimer !== null) {
      clearTimeout(entry.deadlineTimer);
    }
    if (entry.tombstoneTimer !== null) {
      clearTimeout(entry.tombstoneTimer);
    }
    PendingCalls.registry.delete(callId);
  }

  /**
   * Used by clearStreamingState: any unresolved remote call for this thread?
   * Matches both the dispatch thread (wakeUp mode) and a await-task revival
   * target (detach entries register with threadId=null but become
   * thread-coupled once a waiter attaches).
   */
  static async hasForThread(threadId: string): Promise<boolean> {
    for (const entry of PendingCalls.registry.values()) {
      const matchesThread = entry.threadId === threadId;
      if (matchesThread && entry.result === null) {
        const completedElsewhere = await PendingCalls.reconcileWithDb(entry);
        if (!completedElsewhere) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Cancel all unresolved pending calls for a thread by completing them with
   * `failed` status. Called when the stream is user-cancelled so that
   * clearStreamingState sees no pending work and sets the thread to IDLE
   * instead of WAITING.
   */
  static cancelAllForThread(threadId: string): void {
    for (const entry of PendingCalls.registry.values()) {
      if (entry.threadId === threadId && entry.result === null) {
        PendingCalls.complete(entry.callId, {
          status: "failed",
          output: { message: "Stream cancelled by user" },
        });
      }
    }
  }

  /**
   * Narrow an arbitrary WidgetData value to a plain output object, or null.
   * Shared by every consumer of a wire/DB tool result (results are either a
   * plain object or absent — arrays/scalars/Dates are not valid tool outputs).
   */
  static toOutputObject(
    value: WidgetData | null | undefined,
  ): Record<string, WidgetData> | null {
    return value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
      ? (value as Record<string, WidgetData>)
      : null;
  }

  /* ── Local task completion waiters ──────────────────────────────────────── */

  /**
   * Wake every waiter registered for this task. Called by the detach/wakeUp
   * goroutine right after the task row flips terminal (result rows are already
   * persisted at that point). Idempotent — a second notify finds no waiters.
   */
  static notifyTaskCompletion(taskId: string, status: string): void {
    const list = PendingCalls.taskWaiters.get(taskId);
    if (!list) {
      return;
    }
    PendingCalls.taskWaiters.delete(taskId);
    for (const resolve of list) {
      resolve({ status });
    }
  }

  /**
   * Block until notifyTaskCompletion fires for this task or timeoutMs elapses.
   * Resolves null on timeout — the caller then does ONE DB read to cover
   * completions that happened in another process (or before registration).
   */
  static waitForTaskCompletion(
    taskId: string,
    timeoutMs: number,
  ): Promise<TaskCompletionSignal | null> {
    const signalPromise = new Promise<TaskCompletionSignal>((resolve) => {
      const list = PendingCalls.taskWaiters.get(taskId) ?? [];
      PendingCalls.taskWaiters.set(taskId, list);
      list.push(resolve);
    });
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, timeoutMs);
    });
    return Promise.race([signalPromise, timeoutPromise]);
  }

  /* ── Internals ──────────────────────────────────────────────────────────── */

  /** Fire the entry's settle hook exactly once (result, discard, or deadline). */
  private static fireOnSettled(entry: PendingCallEntry): void {
    if (entry.onSettled) {
      const settled = entry.onSettled;
      entry.onSettled = null;
      try {
        settled();
      } catch {
        /* release must never break completion/discard */
      }
    }
  }

  /**
   * Cross-process reconciliation: an instance runs multiple processes sharing
   * one DB (dev server, CLI, tests). /report may land in ANOTHER process and
   * backfill the tool message there — this process's registry entry would stay
   * unresolved forever. The tool message in the DB is the source of truth: if
   * it is no longer running, complete the local entry silently.
   * Returns true if the entry was completed by reconciliation.
   */
  private static async reconcileWithDb(
    entry: PendingCallEntry,
  ): Promise<boolean> {
    if (entry.result !== null) {
      return true;
    }
    try {
      const { chatMessages } = await import("../../agent/chat/db");
      const { db } = await import("../../database");
      const { eq } = await import("drizzle-orm");

      // Persisted-result handoff FIRST: a detach dispatch never backfills its
      // tool message, so when the result event lands in a sibling process before
      // anyone waits, the ONLY evidence is the pending_call_results row that
      // process wrote. Consume it exactly like awaitResult's poll — without
      // this, await-task on a fast detach parks forever (the event already
      // fired; nothing will ever revive the waiter).
      {
        const { pendingCallResults } = await import("../db");
        const [row] = await db
          .select({
            status: pendingCallResults.status,
            output: pendingCallResults.output,
          })
          .from(pendingCallResults)
          .where(eq(pendingCallResults.callId, entry.callId))
          .limit(1);
        if (row) {
          await db
            .delete(pendingCallResults)
            .where(eq(pendingCallResults.callId, entry.callId))
            .catch(() => undefined);
          PendingCalls.complete(entry.callId, {
            status: row.status,
            output: row.output ?? null,
          });
          return true;
        }
      }

      if (!entry.toolMessageId) {
        return false;
      }
      const [msg] = await db
        .select({
          metadata: chatMessages.metadata,
          threadId: chatMessages.threadId,
        })
        .from(chatMessages)
        .where(eq(chatMessages.id, entry.toolMessageId))
        .limit(1);
      const status = msg?.metadata?.toolCall?.status;
      if (status === "completed" || status === "failed") {
        // Carry the backfilled result — completing with null would lose the
        // actual output (await-task delivers it inline to the AI).
        PendingCalls.complete(entry.callId, {
          status,
          output: PendingCalls.toOutputObject(msg?.metadata?.toolCall?.result),
        });
        return true;
      }
      // wakeUp dispatches: the ORIGINAL tool message is never modified (its
      // status stays pending by design) — the completion evidence is the
      // DEFERRED message another process inserted when it consumed the result.
      const originalToolCallId = msg?.metadata?.toolCall?.toolCallId;
      if (originalToolCallId && msg?.threadId) {
        const { and: andOp, sql: sqlFn } = await import("drizzle-orm");
        // Scoped to the dispatch message's THREAD — deterministic toolCallIds
        // (fixture mode) repeat across threads, so an unscoped match would
        // deliver another thread's result.
        const [deferred] = await db
          .select({ metadata: chatMessages.metadata })
          .from(chatMessages)
          .where(
            andOp(
              eq(chatMessages.threadId, msg.threadId),
              sqlFn`${chatMessages.metadata}->'toolCall'->>'originalToolCallId' = ${originalToolCallId}
                AND (${chatMessages.metadata}->'toolCall'->>'isDeferred')::boolean = true`,
            ),
          )
          .limit(1);
        if (deferred) {
          PendingCalls.complete(entry.callId, {
            status:
              deferred.metadata?.toolCall?.status === "failed"
                ? "failed"
                : "completed",
            output: PendingCalls.toOutputObject(
              deferred.metadata?.toolCall?.result,
            ),
          });
          return true;
        }
      }
    } catch {
      // DB unavailable — keep the entry pending; the deadline still backstops.
    }
    return false;
  }
}
