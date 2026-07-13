/**
 * In-process broadcast bridge.
 *
 * The WS proxy (server.ts) owns the live socket registry and exposes
 * broadcastLocalToAll / broadcastLocalBatch. Normally the app process is
 * separate from the proxy, so the emitter POSTs events to the proxy's
 * /ws/broadcast endpoint over loopback HTTP.
 *
 * When the proxy boots IN the same process (tests, single-process mode), that
 * loopback hop is pure overhead — we can deliver the event directly. On boot the
 * server registers its broadcast functions here; the emitter prefers them and
 * only falls back to HTTP when no in-process proxy is registered.
 */

import "server-only";

import type { WsBatchEvent, WsWireMessage } from "./types";

export interface LocalBroadcastTarget {
  broadcastToAll: (
    channel: string,
    event: string,
    data: WsWireMessage["data"],
  ) => void;
  broadcastBatch: (events: WsBatchEvent[]) => void;
  /**
   * Live local subscriber count for a channel. Only meaningful when the proxy
   * runs in THIS process — across the loopback POST the emitter cannot know the
   * count, so presence-gating only applies when this target is registered.
   */
  getChannelSize: (channel: string) => number;
  /**
   * Forcibly close the inbound WS socket for a reverse-ws connector.
   * Called on disconnect so both outbound connector and inbound socket tear
   * down immediately on the same side rather than waiting for the remote to
   * close its end first.
   */
  closeConnectorSocket: (instanceId: string) => void;
}

let registered: LocalBroadcastTarget | null = null;

/**
 * Called by the WS server when it boots in-process. Subsequent emits in this
 * process deliver directly to the socket registry, skipping the loopback POST.
 */
export function registerLocalBroadcast(target: LocalBroadcastTarget): void {
  registered = target;
}

/** Clear the registration (server shutdown). */
export function clearLocalBroadcast(): void {
  registered = null;
}

/** The in-process target, or null when the proxy runs in a separate process. */
export function getLocalBroadcast(): LocalBroadcastTarget | null {
  return registered;
}

/**
 * Close the inbound connector socket for `instanceId` if the WS server is
 * running in-process. No-op when the proxy is in a separate process (the
 * outbound connector's stop() will close the socket from the remote side).
 */
export function closeLocalConnectorSocket(instanceId: string): void {
  registered?.closeConnectorSocket(instanceId);
}
