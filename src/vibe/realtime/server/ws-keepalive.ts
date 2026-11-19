/**
 * WebSocket keepalive settings + close diagnostics for the /ws server.
 *
 * Why the keepalive is short: Bun pings an idle socket 16 s before
 * `idleTimeout` expires and closes it if no pong arrives in those 16 s. With
 * Bun's default (120 s) an idle socket carried NO bytes for ~104 s. Proxies,
 * VPNs, corporate filters and NAT boxes on the client's network commonly cut
 * TCP streams that are silent for 60 s, so idle tabs (typically hidden ones,
 * with no chat traffic) dropped with 1006 every minute and reconnected in a
 * loop (prod 2026-11-16: "[WS Client] Connection lost" 1006, connectedForMs
 * ~59.5 s, sinceLastFrameMs null). Measured identical on Bun 1.3.3 and
 * 1.3.14, so not a runtime regression.
 *
 * 40 s puts a ping on the wire after 24 s of silence, well inside any 60 s
 * (and most 30 s) middlebox idle limit. Browsers answer pings in the network
 * stack, so hidden or throttled tabs still pong; a client that stops answering
 * is closed 16 s after the ping (40 s silence in total).
 */

import type { WsConnectionData } from "../core/types";

/** Bun `websocket.idleTimeout` (seconds). Ping goes out 16 s before it. */
export const WS_IDLE_TIMEOUT_SECONDS = 40;

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
    idleEvidence: "bun-close-reason" | "silent-window" | null;
    connectedForMs: number;
    sinceLastInboundMs: number;
    pongCount: number;
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
    reason === BUN_IDLE_CLOSE_REASON
      ? "bun-close-reason"
      : code === 1006 &&
          reason.length === 0 &&
          sinceLastInboundMs >= (WS_IDLE_TIMEOUT_SECONDS - 1) * 1000
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
