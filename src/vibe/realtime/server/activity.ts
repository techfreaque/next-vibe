/**
 * WS hub activity counters for the event-loop lag probe.
 *
 * In prod the hub process serves only WebSockets (Next.js listens on its own
 * port), so the proxied-request ring is always empty there and lag rows with
 * no cron run named nothing at all. These counters say what the hub did in
 * the probe window: fan-out volume, the biggest payload, the slowest
 * serialise+send, new sockets and subscribes. A stall next to a multi-MB
 * broadcast or a reconnect storm is then visible in the row.
 */

import "server-only";

interface WsActivityWindow {
  broadcasts: number;
  payloadBytes: number;
  maxPayloadBytes: number;
  maxPayloadChannel: string;
  slowestSendMs: number;
  slowestSendChannel: string;
  opens: number;
  subscribes: number;
  broadcastPosts: number;
}

function emptyWindow(): WsActivityWindow {
  return {
    broadcasts: 0,
    payloadBytes: 0,
    maxPayloadBytes: 0,
    maxPayloadChannel: "",
    slowestSendMs: 0,
    slowestSendChannel: "",
    opens: 0,
    subscribes: 0,
    broadcastPosts: 0,
  };
}

declare global {
  var __vibeWsActivity: WsActivityWindow | undefined;
}

function current(): WsActivityWindow {
  globalThis.__vibeWsActivity ??= emptyWindow();
  return globalThis.__vibeWsActivity;
}

function kb(bytes: number): string {
  return `${String(Math.round(bytes / 1024))}KB`;
}

/**
 * Channel names carry user ids (`user/{uid}/ws-...`): drop them so one
 * channel kind groups across users, and cap the length for the log row.
 */
function shortChannel(channel: string): string {
  const generic = channel.replace(/^(batch:)?user\/[^/]+\//, "$1user/*/");
  return generic.length > 80 ? `${generic.slice(0, 77)}...` : generic;
}

/** One serialise + fan-out of a payload (single event or batch frame). */
export function recordWsBroadcast(
  channel: string,
  payloadBytes: number,
  sendMs: number,
): void {
  const w = current();
  w.broadcasts++;
  w.payloadBytes += payloadBytes;
  if (payloadBytes > w.maxPayloadBytes) {
    w.maxPayloadBytes = payloadBytes;
    w.maxPayloadChannel = shortChannel(channel);
  }
  if (sendMs > w.slowestSendMs) {
    w.slowestSendMs = sendMs;
    w.slowestSendChannel = shortChannel(channel);
  }
}

export function recordWsOpen(): void {
  current().opens++;
}

export function recordWsSubscribe(): void {
  current().subscribes++;
}

/** A loopback /ws/broadcast POST from the Next.js process. */
export function recordWsBroadcastPost(): void {
  current().broadcastPosts++;
}

/**
 * Compact summary of the window, then reset it. Undefined when the hub was
 * idle, so idle rows stay short.
 */
export function takeWsActivitySummary(): string | undefined {
  const w = current();
  globalThis.__vibeWsActivity = emptyWindow();
  if (
    w.broadcasts === 0 &&
    w.opens === 0 &&
    w.subscribes === 0 &&
    w.broadcastPosts === 0
  ) {
    return undefined;
  }
  const parts = [
    `${String(w.broadcasts)} sends ${kb(w.payloadBytes)}`,
    w.broadcasts > 0
      ? `max ${kb(w.maxPayloadBytes)} on ${w.maxPayloadChannel}`
      : "",
    w.slowestSendMs >= 5
      ? `slowest ${String(Math.round(w.slowestSendMs))}ms on ${w.slowestSendChannel}`
      : "",
    w.broadcastPosts > 0 ? `${String(w.broadcastPosts)} posts` : "",
    w.opens > 0 ? `${String(w.opens)} opens` : "",
    w.subscribes > 0 ? `${String(w.subscribes)} subscribes` : "",
  ];
  return parts.filter(Boolean).join(", ");
}
