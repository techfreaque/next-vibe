/**
 * Inbound tool-execute-result handler and revival logic. Extracted from
 * RouteExecuteRepository to isolate DB/drizzle/cron imports from index.ts.
 */

import "server-only";

import { desc, lt, sql as sqlFn } from "drizzle-orm";

import { chatMessages } from "../../agent/chat/db";
import { defaultLocale } from "../../core/i18n/core/config";
import type { RemoteEventHandlerProps } from "../../core/route/handler-realtime";
import type { WidgetData } from "../../core/utils/json";
import { db } from "../../database";
import type { EndpointLogger } from "../../logger/types";
import { dbUserIdToOwner } from "../../tasks/cron/db";
import { resolveTaskOwnerUser } from "../../tasks/cron/resolve-task-user";
import { CallbackMode } from "../constants";
import { pendingCallResults } from "../db";
import type executeDefinition from "../definition";
import { TaskCompletion } from "./completion";
import { PendingCalls } from "./pending-calls";
import { ResultSignals } from "./result-signals";

/**
 * Restart-safe revival fallback: when no in-memory pending call exists (the
 * requester process restarted), find the parked tool message that stored this
 * callId and revive from its persisted metadata. resume-stream reconstructs the
 * remaining context (skill/favorite/leaf) from the thread itself.
 *
 * WAKE_UP is correct by construction here: revival only targets PARKED
 * messages — wakeUp dispatches (./remote.ts), the WAIT auto-upgrade, and
 * await-task parks (await-task/repository.ts) all want exactly this
 * deferred-insert + revival-ack treatment. Detach never stores a callId —
 * its no-revival contract survives requester restarts. An inline WAIT stores
 * its anchor with pendingCallInline=true (the stream is live and blocked in
 * PendingCalls.awaitResult): those are skipped — the durable handoff row
 * written by handleToolResult delivers the result to the live waiter, and
 * reviving would double-deliver.
 */
export async function reviveFromToolMessage(
  callId: string,
  status: "completed" | "failed",
  output: Record<string, WidgetData> | null,
  logger: EndpointLogger,
): Promise<void> {
  // Deterministic callIds (fixture mode strips the random tail) recur across
  // streams, so several historical tool messages can carry this pendingCallId.
  // Newest-first + skip already-settled messages targets the CURRENTLY parked
  // dispatch instead of no-op-reviving a stale thread from an earlier run.
  const candidates = await db
    .select()
    .from(chatMessages)
    .where(
      sqlFn`${chatMessages.metadata}->'toolCall'->>'pendingCallId' = ${callId}`,
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(5);
  const msg =
    candidates.find((m) => {
      const s = m.metadata?.toolCall?.status;
      return s !== "completed" && s !== "failed";
    }) ?? candidates[0];
  if (msg?.metadata?.toolCall?.pendingCallInline === true) {
    logger.debug(
      "[RouteExecute] tool-execute-result: anchor belongs to a LIVE inline WAIT — handoff row delivers, skipping revival",
      { callId, toolMessageId: msg.id },
    );
    return;
  }
  if (!msg?.authorId || msg.authorId === "local") {
    logger.debug(
      "[RouteExecute] tool-execute-result: no pending call and no revivable tool message — dropped",
      { callId },
    );
    return;
  }

  const ownerCtx = await resolveTaskOwnerUser(
    dbUserIdToOwner(msg.authorId),
    defaultLocale,
    logger,
  );
  if (!ownerCtx) {
    return;
  }

  await TaskCompletion.handle({
    toolMessageId: msg.id,
    threadId: msg.threadId,
    callbackMode: CallbackMode.WAKE_UP,
    status,
    output,
    taskId: callId,
    modelId: msg.model,
    ownerUser: ownerCtx.user,
    logger,
    directResumeLocale: defaultLocale,
    abortSignal: new AbortController().signal,
    subAgentDepth: 0,
  });
}

/**
 * Validate and apply an inbound tool-execute-result wire payload.
 * Completes the pending-call registry entry so the blocked
 * PendingCalls.awaitResult() call resumes.
 */
export async function handleToolResult(
  props: RemoteEventHandlerProps<
    typeof executeDefinition.POST,
    "tool-execute-result"
  >,
): Promise<void> {
  const { responseData, logger } = props;
  const { taskId, result, hint } = responseData;
  if (!taskId) {
    logger.warn("[RouteExecute] tool-execute-result: missing taskId — dropped");
    return;
  }
  // `result` arrives as untyped wire JSON — narrow to the output-object contract.
  let output = PendingCalls.toOutputObject(result);
  // Explicit wire status; hint-presence fallback only for peers on the old
  // wire shape (a success carrying a hint is misread as failed there).
  const status: "completed" | "failed" =
    responseData.status ?? (hint ? "failed" : "completed");
  // Failure fidelity: emitToolResult carries the peer's fail() message in
  // `hint` (result is null on failure). Surface it as output.message so the
  // requester's WAIT/inline mapping shows the REAL remote error instead of
  // an opaque "Tool Not Found".
  if (status === "failed" && hint && output?.["message"] === undefined) {
    output = { ...(output ?? {}), message: hint };
  }

  // Publish the result to the dispatching call's pub/sub channel FIRST. The
  // dispatcher subscribed INLINE when it sent the request (ResultSignals) — the
  // bus crosses PROCESSES (proxy ↔ app; a test harness running the loop out of
  // the server process), so this resolves the waiter wherever it lives, without
  // relying on the in-memory PendingCalls being in THIS process.
  ResultSignals.deliver(taskId, { status, output, hint }, props.user, logger);

  const outcome = PendingCalls.complete(taskId, { status, output });

  if (outcome.kind === "completed") {
    // WAIT/END_LOOP callers are already unblocked by PendingCalls.complete's
    // waiters. A wakeUp (or auto-upgraded WAIT) has a parked resume-stream
    // task — enable+fire it now. Detach has no parked task so this is a no-op.
    await TaskCompletion.enableAndFireParkedResumeTask({
      taskId,
      status,
      output,
      locale: props.locale,
      logger,
      abortSignal: new AbortController().signal,
    });
    return;
  }

  if (outcome.kind === "unknown") {
    // No in-memory pending call in THIS process. The cross-process WAIT waiter
    // was ALREADY resolved above by ResultSignals.deliver (KeyedRemoteSignal
    // over the WS hub / bridge) — the transient signal fires only if a waiter is
    // subscribed RIGHT NOW. A DETACHED result has no live waiter: await-task
    // retrieves it minutes later, so it needs a DURABLE store. Persist it for
    // PendingCalls.getReconciled (await-task's cross-process read). WAIT never
    // depends on this row — it is resolved live by the signal.
    await db
      .insert(pendingCallResults)
      .values({ callId: taskId, status, output })
      .onConflictDoNothing()
      .catch((err: Error) => {
        logger.warn("[RouteExecute] failed to persist detached tool result", {
          callId: taskId,
          error: err.message,
        });
      });
    // Opportunistic purge of unconsumed stale rows (no await-task ever came).
    void db
      .delete(pendingCallResults)
      .where(lt(pendingCallResults.createdAt, new Date(Date.now() - 3_600_000)))
      .catch(() => undefined);

    // Parked-thread wakeUp: revive the thread from its tool message.
    await reviveFromToolMessage(taskId, status, output, logger);
  }
}
