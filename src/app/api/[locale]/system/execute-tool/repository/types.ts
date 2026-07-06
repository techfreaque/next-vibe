/**
 * Shared types for the execute-tool repository modules.
 *
 * Every interface used across the repository helper classes (core, routing,
 * transport, guards, local, remote, completion, pending-calls) lives here —
 * the helper files themselves contain only their class (repository pattern).
 */

import type { Methods } from "next-vibe/core/definition/enums";
import type { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { GenericHandlerBase } from "next-vibe/core/route/handler";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { AiT } from "next-vibe/platforms/ai/i18n";
import type { CronTaskStatusDB } from "next-vibe/tasks/enum";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type {
  remoteConnections,
  TransportMode,
} from "@/app/api/[locale]/remote-connection/db";
import type { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";

import type { CallbackModeValue } from "../constants";
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

/* ── Routing ───────────────────────────────────────────────────────────────── */

export type RemoteConnectionRow = typeof remoteConnections.$inferSelect;

/**
 * Resolved connection info for a remote instance (never null at the transport
 * phase — capability validation already rejected the null case).
 */
export type RemoteConnInfo = NonNullable<
  Awaited<
    ReturnType<typeof RemoteConnectionRepository.getConnectionForInstance>
  >
>;

export interface RemoteTarget {
  /** The name this side uses for the remote (e.g. "hermes" on atlas). */
  instanceId: string;
  remoteUrl: string;
  token: string;
  leadId: string;
  transportMode: TransportMode;
  /**
   * When true, the executor PERSISTS its own copy of the thread (relay mode:
   * REMOTE-folder routing / full inference provider). Tools and system prompt
   * ALWAYS come from the CLIENT (options on the ai-stream) — this flag only
   * controls thread storage + billing side, never prompt/tool origin.
   */
  useRemoteContext: boolean;
  /**
   * True when OUR row for this peer is a reverse entry (the peer connected TO
   * us). Determines the peer's landing root for relay-persisted threads:
   * false → peer is the serving side → REMOTE/<ourId>; true → peer is a
   * client → BACKGROUND/remote/<ourId>.
   */
  isReverseEntry: boolean;
}

export interface ResolveTargetParams {
  userId: string;
  /** Explicit override — skips all routing matching */
  instanceId?: string;
  /**
   * The thread/stream's loop location (a connection's instanceId). Placement
   * is DATA and never routes; this explicit property is the only way a
   * stream's loop moves to another instance (per-stream request field, or the
   * chat_threads.loop_instance_id column persisting it for follow-up turns).
   */
  loopInstanceId?: string;
  /** Model API provider (e.g. "openai", "anthropic") — used for provider-based routing */
  modelProvider?: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export interface ResolveInferenceProviderParams {
  userId: string;
  /** Model API provider (e.g. "openai", "anthropic") — used for inference provider routing */
  modelProvider?: string;
  logger: EndpointLogger;
}

/* ── Transport ─────────────────────────────────────────────────────────────── */

/**
 * Params for RemoteTransport.callRaw — the single sanctioned raw-HTTP call to
 * a remote instance. Used ONLY where the connection cannot be resolved by a
 * `remoteConnections` row yet (connection bootstrap: ping-for-leadId,
 * remote/self login, register) OR where the raw Response headers/status are
 * required. Every other remote call goes through
 * RouteExecuteRepository.runInProcessTyped.
 */
export interface RemoteCallParams {
  /** Base URL of the remote instance (e.g. https://thea.example). */
  remoteUrl: string;
  /**
   * Path AFTER `/api/` including locale, e.g. `en-US/user/public/login`. Omit
   * to hit `remoteUrl` directly (leadId-bootstrap ping against the locale page).
   */
  apiPath?: string;
  method: Methods;
  /** JSON body for POST/DELETE. */
  body?: Record<string, WidgetData>;
  /** Session token, if one exists yet (register / authenticated bootstrap). */
  token?: string;
  /**
   * lead_id to send. For an authenticated call it is combined with the token in
   * the Bearer header; for a pre-login call it is sent as the lead_id Cookie.
   */
  leadId?: string;
  /** Follow redirects (leadId ping) vs surface them (manual). Default "follow". */
  redirect?: "follow" | "manual";
  timeoutMs?: number;
}

/** Result of RemoteTransport.callRaw. */
export interface RemoteCallResult {
  ok: boolean;
  status: number;
  /** Parsed JSON body (null if the response had no JSON body). */
  body: Record<string, WidgetData> | null;
  /** lead_id extracted from the response Set-Cookie header, if present. */
  setCookieLeadId: string | null;
  /** True when the fetch itself threw (network error / timeout). */
  networkError: boolean;
}

/** Discriminated result of a synchronous direct-http tool call. */
export type DirectCallResult =
  | { ok: true; data: Record<string, WidgetData> }
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

/** Revival target attached by await-task after dispatch. */
export interface PendingCallRevival {
  threadId: string;
  toolMessageId: string;
  callbackMode: string;
  leafMessageId: string | null;
  modelId: string | null;
  skillId: string | null;
  favoriteId: string | null;
  subAgentDepth: number;
  /** Owner user id — needed to fire the revival from reconciliation. */
  userId: string;
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
  revival: PendingCallRevival | null;
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
      revival: PendingCallRevival | null;
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

/* ── Revival ───────────────────────────────────────────────────────────────── */

/** Resolved params for TaskCompletion.handle, minus status/output/taskId/ownerUser/logger/locale. */
export interface RevivalTarget {
  toolMessageId: string;
  threadId: string | null;
  callbackMode: CallbackModeValue;
  modelId: string | null;
  skillId: string | null;
  favoriteId: string | null;
  leafMessageId: string | null;
  subAgentDepth: number;
}

/* ── Completion ────────────────────────────────────────────────────────────── */

export type WakeUpConfirmRaceResult =
  | { kind: "case-b"; wakeUpPending: true }
  | { kind: "case-a" };
