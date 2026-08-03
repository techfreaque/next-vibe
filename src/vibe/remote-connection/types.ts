/**
 * Shared types for remote-connection routing and transport.
 */

import type { Methods } from "../core/definition/enums";
import type { CountryLanguage } from "../core/i18n/core/config";
import type { WidgetData } from "../core/utils/json";
import type { EndpointLogger } from "../logger/types";

import type { remoteConnections, TransportMode } from "./db";
import type { RemoteConnectionRepository } from "./repository";

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
  /** How WE reach the peer (our send leg). */
  transportMode: TransportMode;
  /**
   * How the PEER reaches THIS side (mirror of the peer's own transportMode) —
   * `null` when not yet learned. Determines the result back-leg for a dispatch
   * (reverse-ws → peer publishes on its hub / our connector receives;
   * direct-http → peer POSTs our bridge). Carried on the resolved target so the
   * dispatch never re-queries it.
   */
  remoteTransportMode: TransportMode | null;
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
  body: Record<string, WidgetData> | null;
  /** lead_id extracted from Set-Cookie, null if absent. */
  setCookieLeadId: string | null;
  networkError: boolean;
}
