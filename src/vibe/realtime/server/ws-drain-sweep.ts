/**
 * Deploy-drain sweep of the /ws hub: close every client with 1012, give
 * well-behaved clients a grace period to finish the close handshake, then
 * terminate the rest. A client that ignores close frames (frozen tab, dead
 * middlebox, buggy connector) must never keep a deploy from finishing.
 */

import type { WsConnectionData } from "../core/types";

/** The socket surface the sweep needs (Bun's ServerWebSocket satisfies it). */
export interface SweepSocket {
  data: Pick<
    WsConnectionData,
    "connectedAt" | "connectorInstanceId" | "selfHub" | "userAgent"
  >;
  close: (code?: number, reason?: string) => void;
  terminate: () => void;
}

export type WsClientClass =
  | "browser"
  | "connector"
  | "bot"
  | "other"
  | "unknown";

/** Coarse client class from the upgrade User-Agent (never logs the raw string). */
export function classifyWsClient(
  data: Pick<WsConnectionData, "connectorInstanceId" | "userAgent">,
): WsClientClass {
  if (data.connectorInstanceId) {
    return "connector";
  }
  const ua = data.userAgent;
  if (!ua) {
    return "unknown";
  }
  if (/bot|crawl|spider|curl|python|node|bun|go-http|java/i.test(ua)) {
    return "bot";
  }
  if (/mozilla|chrome|safari|firefox|webkit/i.test(ua)) {
    return "browser";
  }
  return "other";
}

export interface WsSweepForceResult {
  /** Sockets still open after the grace period that were terminated. */
  forced: number;
  byClass: Record<string, number>;
  oldestAgeMs: number;
}

/** Send 1012 to every socket (except kept self-hub sockets); returns the count. */
export function closeSockets<T extends SweepSocket>(
  sockets: Iterable<T>,
  code: number,
  reason: string,
  keepSelfHub: boolean,
): T[] {
  const targets = [...sockets].filter(
    (ws) => !keepSelfHub || ws.data.selfHub !== true,
  );
  for (const ws of targets) {
    try {
      ws.close(code, reason);
    } catch {
      /* already closing */
    }
  }
  return targets;
}

/**
 * Terminate the swept sockets that are still in `open` (the hub's live set).
 * `onTerminated` removes each from the hub so the count reaches 0 even if the
 * runtime's close callback is slow.
 */
export function terminateStragglers<T extends SweepSocket>(
  swept: readonly T[],
  open: ReadonlySet<T>,
  now: number,
  onTerminated: (ws: T) => void,
): WsSweepForceResult {
  const result: WsSweepForceResult = { forced: 0, byClass: {}, oldestAgeMs: 0 };
  for (const ws of swept) {
    if (!open.has(ws)) {
      continue;
    }
    const cls = classifyWsClient(ws.data);
    result.byClass[cls] = (result.byClass[cls] ?? 0) + 1;
    result.oldestAgeMs = Math.max(
      result.oldestAgeMs,
      now - ws.data.connectedAt,
    );
    try {
      ws.terminate();
    } catch {
      /* already gone */
    }
    onTerminated(ws);
    result.forced += 1;
  }
  return result;
}
