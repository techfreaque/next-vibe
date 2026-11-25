/**
 * WebSocket keepalive settings + close diagnostics for the /ws server.
 *
 * Start pings well inside the shortest observed network idle window. Keep
 * the disconnect deadline independent so a single missed pong can recover.
 * Browsers answer protocol pings in the network stack, including hidden tabs.
 */

import type { WsConnectionData } from "../core/types";

export const WS_PING_INTERVAL_MS = 20_000;
export const WS_IDLE_TIMEOUT_SECONDS = 75;
export const WS_HEARTBEAT_TIMEOUT_CODE = 4002;
export const WS_HEARTBEAT_TIMEOUT_REASON = "heartbeat-timeout";

/** Reason Bun passes to `close()` when it closes a socket for inactivity. */
const BUN_IDLE_CLOSE_REASON = "WebSocket timed out from inactivity";

/** Normal or self-initiated close codes that need no diagnostics. */
const QUIET_CLOSE_CODES: ReadonlySet<number> = new Set([
  1000, // normal
  1001, // going away (tab closed, navigation)
  1005, // no status (clean close without a code)
  1012, // our own deploy drain / restart
]);

export interface WsCloseDiagnosis {
  /**
   * "idle-timeout": Bun reported inactivity, or a reasonless close arrived
   * after a full idle window without an inbound message or pong.
   * "dropped": the connection ended without a close frame from the client
   * (network cut, middlebox, crash, sleep); the server saw no reason.
   * "normal": an expected close, nothing to report.
   */
  kind: "idle-timeout" | "dropped" | "normal";
  meta: {
    requestId?: string;
    code: number;
    reason: string;
    idleEvidence:
      | "heartbeat-timeout"
      | "bun-close-reason"
      | "silent-window"
      | null;
    connectedForMs: number;
    sinceLastInboundMs: number;
    pongCount: number;
    pingCount: number;
    lastPingAgeMs: number | null;
    lastPingBackpressured: boolean | null;
    lastPongAgeMs: number | null;
    idleTimeoutMs: number;
    lastInboundFrame: NonNullable<WsConnectionData["lastInboundFrame"]> | null;
    inboundActivity: "answered-ping" | "application-traffic" | "silent";
    channelCount: number;
    isPublic: boolean;
    connector: boolean;
  };
}

/** Classify a /ws close so the server log names the cause next time. */
export function diagnoseWsClose(
  data: WsConnectionData,
  code: number,
  reason: string,
  now: number,
): WsCloseDiagnosis {
  const sinceLastInboundMs = now - data.lastInboundAt;
  const idleEvidence =
    reason === WS_HEARTBEAT_TIMEOUT_REASON
      ? "heartbeat-timeout"
      : reason === BUN_IDLE_CLOSE_REASON
        ? "bun-close-reason"
        : code === 1006 &&
            reason.length === 0 &&
            sinceLastInboundMs >= WS_IDLE_TIMEOUT_SECONDS * 1000
          ? "silent-window"
          : null;
  const kind = idleEvidence
    ? "idle-timeout"
    : QUIET_CLOSE_CODES.has(code)
      ? "normal"
      : "dropped";
  return {
    kind,
    meta: {
      requestId: data.requestId,
      code,
      reason: reason.slice(0, 200),
      idleEvidence,
      connectedForMs: now - data.connectedAt,
      sinceLastInboundMs,
      pongCount: data.pongCount,
      pingCount: data.pingCount ?? 0,
      lastPingAgeMs:
        data.lastPingAt === undefined ? null : now - data.lastPingAt,
      lastPingBackpressured: data.lastPingBackpressured ?? null,
      lastPongAgeMs:
        data.lastPongAt === undefined ? null : now - data.lastPongAt,
      idleTimeoutMs: WS_IDLE_TIMEOUT_SECONDS * 1000,
      lastInboundFrame: data.lastInboundFrame ?? null,
      inboundActivity:
        data.pongCount > 0
          ? "answered-ping"
          : data.lastInboundAt > data.connectedAt
            ? "application-traffic"
            : "silent",
      channelCount: data.channels.size,
      isPublic: data.user.isPublic,
      connector: data.connectorInstanceId !== undefined,
    },
  };
}
