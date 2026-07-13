/**
 * Shared types for the execute-tool repository modules.
 *
 * Every interface used across the repository helper classes (core, routing,
 * transport, guards, local, remote, completion, pending-calls) lives here —
 * the helper files themselves contain only their class (repository pattern).
 */

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { GenericHandlerBase } from "next-vibe/core/route/handler";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { AiT } from "next-vibe/platforms/ai/i18n";
import type {
  RemoteCallParams,
  RemoteCallResult,
  RemoteConnectionRow,
  RemoteConnInfo,
  RemoteTarget,
  ResolveInferenceProviderParams,
  ResolveTargetParams,
} from "next-vibe/remote-connection/types";
import type { CronTaskStatusDB } from "next-vibe/tasks/enum";

export type {
  RemoteCallParams,
  RemoteCallResult,
  RemoteConnectionRow,
  RemoteConnInfo,
  RemoteTarget,
  ResolveInferenceProviderParams,
  ResolveTargetParams,
};

import type { RouteExecuteResponseOutput } from "../definition";

/* ── Execution context ─────────────────────────────────────────────────────── */

/** Base execution context shared by platform executors (MCP registry etc.). */
export interface BaseExecutionContext<TData> {
  toolName: string;
  data: TData;
  user: JwtPayloadType;
  platform: Platform;
  locale: CountryLanguage;
  logger: EndpointLogger;
  timestamp: number;
}

/**
 * Immutable snapshot shared by every execute-tool phase handler.
 *
 * Built once in RouteExecuteRepository.execute() after the prefix parse, model
 * resolution, and the revival circuit-breaker have run. toolName here is
 * already the post-prefix (and, on the remote path, preferred) name.
 * resolvedModelId is the cascade result stored for revival.
 */
export interface RouteExecuteContext {
  toolName: string;
  resolvedModelId: ChatModelId | null;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: AiT;
  streamContext: ToolExecutionContext;
  platform: Platform;
  /**
   * Pre-loaded route handler for the local WAIT path. When a caller (MCP
   * hot-loader, CLI) has already imported the target handler it passes it here
   * so executeGenericHandler skips the second dynamic import. Undefined means
   * "load it yourself" (the normal AI / endpoint-to-endpoint path).
   */
  preloadedHandler?: GenericHandlerBase | null;
  /**
   * Pre-split URL path params for the local WAIT path. CLI parses args into
   * data + urlPathParams itself; passing them pre-split makes
   * executeGenericHandler skip its arg-splitting step. Undefined → the
   * executor auto-splits from input (AI / MCP flat-args convention).
   */
  urlPathParams?: Record<string, WidgetData>;
}

/**
 * Phase handler outcome. "return" means the orchestrator returns the wrapped
 * value immediately; "fallthrough" means continue to the next phase.
 */
export type PhaseResult =
  | { kind: "return"; value: ResponseType<RouteExecuteResponseOutput> }
  | { kind: "fallthrough" };

/** Discriminated result of a synchronous direct-http tool call. */
export type DirectCallResult =
  | { ok: true; data: RouteExecuteResponseOutput }
  | {
      ok: false;
      /** The peer's error message, when its response body carried one. */
      remoteMessage?: string;
    };

/* ── Guards ────────────────────────────────────────────────────────────────── */

/** Structurally identical to chat/settings' ToolConfigItem — kept local so the
 * execute-tool type graph never pulls a full endpoint-definition module. */
export interface ToolConfigItem {
  toolId: string;
  requiresConfirmation: boolean;
}

export interface ResolvedToolPermissions {
  /** Whitelist: null = all tools allowed; array = only these may execute */
  availableTools: ToolConfigItem[] | null;
  /** Union of skill + favorite + folder hard-blocked tool IDs */
  deniedToolIds: Set<string>;
}

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
