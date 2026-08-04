/**
 * Shared types for the DISPATCH execute-tool paths — calls that run somewhere
 * else (remote instances) or at some other time (the task system).
 *
 * Split out of ./types so a deployment that only ever runs tools here, now,
 * inline declines this module wholesale. Nothing on the local path may import
 * from here: every type below has a producer or consumer in ./orchestration,
 * ./remote, ./local-async, ./completion, ./pending-calls or ./result-signals —
 * all of which are the non-local half of the seam.
 *
 * This is also why the remote-connection call/target types are NOT re-exported
 * here: their consumers import them from ../../remote-connection/types
 * directly, which is the module that owns them.
 */

import type { ChatModelId } from "../../agent/ai-stream/models";
import type { ResponseType } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { CronTaskStatusDB } from "../../tasks/enum";
import type { RouteExecuteResponseOutput } from "../definition";
import type { RouteExecuteContext } from "./types";

/* ── Dispatch context ──────────────────────────────────────────────────────── */

/**
 * The phase-handler context PLUS the model cascade result, which only the
 * remote and WAKE_UP branches read (and revival stores).
 *
 * Modelled as an intersection rather than a field on RouteExecuteContext so the
 * local path never depends on the agent model union: index.ts builds one of
 * these and passes it to orchestrateNonLocal, and it still satisfies the plain
 * RouteExecuteContext that LocalExecution asks for.
 */
export type RouteExecuteDispatchContext = RouteExecuteContext & {
  resolvedModelId: ChatModelId | null;
};

/**
 * Phase handler outcome. "return" means the orchestrator returns the wrapped
 * value immediately; "fallthrough" means continue to the next phase.
 */
export type PhaseResult =
  | { kind: "return"; value: ResponseType<RouteExecuteResponseOutput> }
  | { kind: "fallthrough" };

/* ── Pending calls ─────────────────────────────────────────────────────────── */

export interface PendingCallResult {
  status: "completed" | "failed";
  output: Record<string, WidgetData> | null;
}

export interface PendingCallEntry {
  callId: string;
  instanceId: string;
  toolName: string;
  /** The tool's input args — so await-task can render the awaited tool's inputs. */
  input: Record<string, WidgetData> | null;
  threadId: string | null;
  toolMessageId: string | null;
  userId: string | null;
  createdAt: number;
  deadlineTimer: ReturnType<typeof setTimeout> | null;
  result: PendingCallResult | null;
  waiters: Array<(result: PendingCallResult) => void>;
  tombstoneTimer: ReturnType<typeof setTimeout> | null;
  /** Fired exactly once when the call settles (result, discard, or deadline).
   *  Carries transport-lifecycle cleanup — e.g. releasing the connector ref
   *  held open so the reverse-ws result event has a live subscriber. */
  onSettled: (() => void) | null;
}

export interface PendingCallInfo {
  callId: string;
  instanceId: string;
  toolName: string;
  input: Record<string, WidgetData> | null;
  threadId: string | null;
  toolMessageId: string | null;
  userId: string | null;
  result: PendingCallResult | null;
}

export type CompletePendingCallOutcome =
  | {
      kind: "completed";
      threadId: string | null;
      toolMessageId: string | null;
    }
  | { kind: "duplicate" }
  | { kind: "unknown" };

export interface TaskCompletionSignal {
  status: string;
}

/* ── Local async execution ─────────────────────────────────────────────────── */

export interface GoroutineResult {
  finalStatus: (typeof CronTaskStatusDB)[number];
  finalResult: Record<string, WidgetData> | null;
  /** The target's fail() message when execution failed — preserved so wire
   *  relays (receiver → requester result events) keep the real error text. */
  errorMessage: string | null;
  completedAt: Date;
}

/* ── Completion ────────────────────────────────────────────────────────────── */

export type WakeUpConfirmRaceResult =
  | { kind: "case-b"; wakeUpPending: true }
  | { kind: "case-a" };
