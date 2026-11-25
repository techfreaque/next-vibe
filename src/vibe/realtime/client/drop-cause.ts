/**
 * One-word cause for a WebSocket outage, attached to every client drop
 * report. Each error-log pass used to re-derive it by hand from a dozen
 * fields (hiddenAtClose, timer overrun, visibility and network timing);
 * the classification makes each occurrence explain itself.
 */

/** Close code our server sends when it drains for a deploy or restart. */
export const WS_SERVICE_RESTART_CODE = 1012;

/** A reconnect timer firing this late means the tab or device was suspended. */
const SUSPENDED_TIMER_OVERRUN_MS = 10_000;
/** A close this soon after a network change is attributed to the change. */
const NETWORK_CHANGE_WINDOW_MS = 15_000;
/** A close this soon after the tab became visible was detected on resume. */
const RESUME_WINDOW_MS = 3_000;

export type WsDropCause =
  | "server-restart"
  | "handshake-failed"
  | "browser-offline"
  | "network-change"
  | "background-suspended"
  | "background-tab"
  | "detected-on-resume"
  | "going-away"
  | "server-close"
  | "silent-drop";

export interface WsDropEvidence {
  code: number;
  wasClean: boolean;
  online: boolean;
  hiddenAtClose: boolean;
  /** null = the socket never opened */
  connectedForMs: number | null;
  msSinceVisibilityChange: number | null;
  msSinceNetworkChange: number | null;
  maxReconnectTimerOverrunMs: number;
}

export function classifyWsDrop(drop: WsDropEvidence): WsDropCause {
  if (drop.code === WS_SERVICE_RESTART_CODE) {
    return "server-restart";
  }
  if (drop.connectedForMs === null) {
    return "handshake-failed";
  }
  if (!drop.online) {
    return "browser-offline";
  }
  if (
    drop.msSinceNetworkChange !== null &&
    drop.msSinceNetworkChange < NETWORK_CHANGE_WINDOW_MS
  ) {
    return "network-change";
  }
  if (drop.hiddenAtClose) {
    // Hidden tabs get throttled or frozen (mobile background, laptop lid):
    // the browser stops answering pings and the server closes the socket.
    return drop.maxReconnectTimerOverrunMs >= SUSPENDED_TIMER_OVERRUN_MS
      ? "background-suspended"
      : "background-tab";
  }
  if (
    drop.msSinceVisibilityChange !== null &&
    drop.msSinceVisibilityChange < RESUME_WINDOW_MS
  ) {
    // The socket died while the tab was hidden; the browser only surfaced
    // the close once the tab came back.
    return "detected-on-resume";
  }
  if (drop.wasClean && drop.code === 1001) {
    return "going-away";
  }
  if (drop.wasClean) {
    return "server-close";
  }
  // Visible, online, no recent network or visibility change: a real
  // mid-session cut (edge, proxy, NAT timeout or server stall).
  return "silent-drop";
}
