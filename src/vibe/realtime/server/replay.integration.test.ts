/**
 * Reconnect catch-up, end to end: the real browser WS client
 * (realtime/client/client.ts) against the real Bun WS server, local pub/sub.
 *
 * A token stream is published the way the emitter does it (presence gate,
 * then publish). Mid-stream the socket is cut (deploy drain 1012, and a hard
 * socket replacement); tokens keep flowing while the client is offline. The
 * client must end up with every token exactly once, in order.
 */

import { createServer } from "node:net";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { getLocalBroadcast } from "../core/local-broadcast";
import type { AnyEndpointEventEnvelope } from "../core/structured-events";
import { DEFAULT_REPLAY_LIMITS } from "./replay-buffer";
import type { WebSocketServerHandle } from "./server";

const location = { host: "127.0.0.1:0" };
vi.mock("next-vibe/ui/lib/location", () => ({
  getCurrentHost: (): string => location.host,
  getCurrentProtocol: (): string => "http:",
  getCurrentOrigin: (): string => `http://${location.host}`,
}));

const LEAD_ID = "6c4d6f2e-1b7a-4c1e-9a55-2d1f6f0b9a11";
const STREAM_CHANNEL = `user/${LEAD_ID}/ws-replay-test-stream`;

// The DOM constructor type cannot supply cookies. Bun's test runtime accepts
// headers so the fixture can send the current HttpOnly lead cookie at upgrade.
const LeadWebSocket = new Proxy(WebSocket, {
  construct(target, [url]: [string | URL], newTarget): WebSocket {
    const options: Bun.WebSocketOptions = {
      headers: { Cookie: `${LEAD_ID_COOKIE_NAME}=${LEAD_ID}` },
    };
    return Reflect.construct(target, [url, options], newTarget);
  },
});

async function freePort(): Promise<number> {
  const probe = createServer();
  await new Promise<void>((resolve) => {
    probe.listen(0, "127.0.0.1", resolve);
  });
  const address = probe.address();
  const port = address && typeof address === "object" ? address.port : 0;
  await new Promise<void>((resolve) => {
    probe.close(() => resolve());
  });
  return port;
}

function tokenEnvelope(token: number): AnyEndpointEventEnvelope {
  return {
    endpointPath: ["replay-test"],
    endpointMethod: "GET",
    eventName: "content-delta",
    responseData: undefined,
    requestData: undefined,
    urlPathParams: {},
    payload: { token },
    channel: STREAM_CHANNEL,
  };
}

function tokenOf(data: AnyEndpointEventEnvelope): number {
  const payload = data.payload;
  return typeof payload === "object" &&
    payload !== null &&
    "token" in payload &&
    typeof payload.token === "number"
    ? payload.token
    : -1;
}

/** What the emitter does per event: presence gate, then publish. */
function emitToken(token: number): boolean {
  const local = getLocalBroadcast();
  if (!local || !local.isChannelLive(STREAM_CHANNEL)) {
    return false;
  }
  local.broadcastToAll(STREAM_CHANNEL, "__event__", tokenEnvelope(token));
  return true;
}

async function waitFor(condition: () => boolean, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (!condition()) {
    if (Date.now() - start > timeoutMs) {
      return;
    }
    await delay(10);
  }
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe("WS reconnect catch-up (real client + real server)", () => {
  const logger = createEndpointLogger(false, defaultLocale);
  let server: WebSocketServerHandle | null = null;
  const originalWebSocket = globalThis.WebSocket;

  beforeAll(async () => {
    const port = await freePort();
    location.host = `127.0.0.1:${port}`;
    globalThis.WebSocket = LeadWebSocket;
    const { startWebSocketServer } = await import("./server");
    server = startWebSocketServer({ port, logger, hostname: "127.0.0.1" });
  });

  afterAll(() => {
    server?.stop();
    globalThis.WebSocket = originalWebSocket;
  });

  it("WS-REPLAY-1: no token lost or duplicated across a drain (1012) and a hard socket swap", async () => {
    const client = await import("../client/client");
    const received: number[] = [];
    const resyncs: number[] = [];
    const unsubscribe = client.subscribeToChannel<AnyEndpointEventEnvelope>(
      STREAM_CHANNEL,
      "__event__",
      (data) => {
        received.push(tokenOf(data));
      },
      defaultLocale,
      logger,
    );
    const unResync = client.onChannelResync(STREAM_CHANNEL, () => {
      resyncs.push(received.length);
    });

    // Socket open + subscribe acked (the ack creates the replay state).
    await waitFor(
      () =>
        (server?.clientCount().clients ?? 0) === 1 &&
        getLocalBroadcast()?.isChannelLive(STREAM_CHANNEL) === true,
      5_000,
    );
    await delay(100);
    expect(server?.clientCount().clients).toBe(1);

    const TOTAL = 300;
    let next = 0;
    const emitBurst = async (count: number): Promise<void> => {
      for (let i = 0; i < count; i++) {
        // Nothing may be dropped by the presence gate while offline: the
        // channel's replay state keeps it live.
        expect(emitToken(next)).toBe(true);
        next++;
        await delay(2);
      }
    };

    await emitBurst(80);
    await waitFor(() => received.length >= 40, 5_000);

    // Deploy drain: the server closes every socket with 1012 mid-stream and
    // keeps running; tokens keep flowing while the client is away.
    expect(server?.closeClients()).toBe(1);
    let emittedOffline = 0;
    while ((server?.clientCount().clients ?? 0) === 0 && emittedOffline < 150) {
      await emitBurst(1);
      emittedOffline++;
    }
    // Tokens really were published into the gap (100-500 ms reconnect).
    expect(emittedOffline).toBeGreaterThan(5);

    // The client is back; keep streaming.
    await emitBurst(40);

    // Hard swap mid-stream (what an identity change does): old socket closed,
    // new one opened at once, events in between must still arrive.
    client.reconnectForIdentityChange(logger);
    await emitBurst(TOTAL - next);

    await waitFor(() => received.length >= TOTAL, 10_000);
    await delay(100);

    expect(received.length).toBe(TOTAL);
    expect(received).toEqual([...Array.from({ length: TOTAL }).keys()]);
    // Every gap was inside the buffer: no refetch was needed.
    expect(resyncs).toEqual([]);

    unResync();
    unsubscribe();
  }, 30_000);

  it("WS-REPLAY-2: a gap older than the buffer answers complete:false (client refetches)", async () => {
    const channel = `user/${LEAD_ID}/ws-replay-test-gap`;
    // 1. A client subscribes (creating the channel's replay state), then drops.
    const first = await openRawSocket();
    first.send(subscribeFrame(channel, undefined));
    const firstAck = await first.nextAck(channel);
    first.ws.close();
    await delay(50);

    // 2. While it is away, more events happen than the buffer keeps.
    const local = getLocalBroadcast();
    for (let i = 0; i < DEFAULT_REPLAY_LIMITS.maxEvents + 100; i++) {
      expect(local?.isChannelLive(channel)).toBe(true);
      local?.broadcastToAll(channel, "__event__", tokenEnvelope(i));
    }

    // 3. It resumes from its cursor: part of the gap is gone for good.
    const second = await openRawSocket();
    second.send(subscribeFrame(channel, firstAck.cursor));
    const ack = await second.nextAck(channel);
    second.ws.close();
    expect(ack.complete).toBe(false);
    expect(ack.cursor).toBeGreaterThan(firstAck.cursor);
    // The buffered history is not replayed on an incomplete answer (the
    // client refetches). Only events still in flight while it resubscribed
    // may arrive live (Redis: the publishes are still being processed).
    let delivered = 0;
    for (const frame of second.frames) {
      if (frame.startsWith('{"type":"batch"')) {
        const batch: { events: AnyEndpointEventEnvelope[] } = JSON.parse(frame);
        delivered += batch.events.length;
      } else if (!frame.startsWith('{"type":"subscribed"')) {
        delivered++;
      }
    }
    expect(delivered).toBeLessThan(DEFAULT_REPLAY_LIMITS.maxEvents);
  });

  it("WS-REPLAY-3: another user's channel is never replayed (auth runs first)", async () => {
    const foreign = "user/11111111-2222-3333-4444-555555555555/ws-replay-test-stream";
    // The foreign channel has replay state and history...
    const { getPubSubAdapter } = await import("./pubsub/index");
    const { cursor } = await getPubSubAdapter().prepareReplay(foreign, undefined);
    getLocalBroadcast()?.broadcastToAll(foreign, "__event__", tokenEnvelope(1));
    // ...but this socket is a different identity: no replay, no ack.
    const raw = await openRawSocket();
    raw.send(subscribeFrame(foreign, cursor));
    await delay(300);
    raw.ws.close();
    expect(raw.frames).toEqual([]);
  });

  it("refreshes stale guest subscriptions once and binds the new lead on the same socket", async () => {
    const client = await import("../client/client");
    const staleLead = "2a694531-5f2a-41bc-b5e1-7acb04e05486";
    const staleCredits = `user/${staleLead}/ws-replay-test-credits`;
    const staleChat = `user/${staleLead}/ws-replay-test-chat`;
    const current = `user/${LEAD_ID}/ws-replay-test-credits`;
    const hooks: Array<() => void> = [];
    const subscribe = (
      channel: string,
      handle: (data: AnyEndpointEventEnvelope) => void,
    ): (() => void) =>
      client.subscribeToChannel(
        channel,
        "__event__",
        handle,
        defaultLocale,
        logger,
        undefined,
        true,
      );
    const received: number[] = [];
    let refreshes = 0;
    const stopRefresh = client.onGuestSocketIdentityChange(() => {
      refreshes++;
      // Commit of the reloaded page: the old effects clean up and the new
      // guest lead, resolved from the cookie by the page loader, subscribes.
      for (const stop of hooks.splice(0)) {
        stop();
      }
      hooks.push(subscribe(current, (data) => received.push(tokenOf(data))));
    });
    try {
      hooks.push(subscribe(staleCredits, () => received.push(-1)));
      hooks.push(subscribe(staleChat, () => received.push(-1)));
      const connected = (): boolean => getLocalBroadcast()?.isChannelLive(current) === true;
      await waitFor(connected, 1_000);
      expect(connected()).toBe(true);
      expect(getLocalBroadcast()?.isChannelLive(staleCredits)).toBe(false);
      expect(getLocalBroadcast()?.isChannelLive(staleChat)).toBe(false);
      expect(server?.clientCount().clients).toBe(1);
      getLocalBroadcast()?.broadcastToAll(current, "__event__", tokenEnvelope(73));
      await waitFor(() => received.length > 0, 1_000);
      expect(received).toEqual([73]);
      expect(refreshes).toBe(1);
    } finally {
      stopRefresh();
      for (const stop of hooks) {
        stop();
      }
    }
  });
});

interface SubscribedAck {
  readonly channel: string;
  readonly cursor: number;
  readonly complete: boolean;
}

function subscribeFrame(channel: string, since: number | undefined): string {
  return JSON.stringify({
    type: "subscribe",
    channel,
    locale: defaultLocale,
    replay: true,
    since,
  });
}

async function openRawSocket(): Promise<{
  ws: WebSocket;
  frames: string[];
  send: (frame: string) => void;
  nextAck: (channel: string) => Promise<SubscribedAck>;
}> {
  const ws = new LeadWebSocket(`ws://${location.host}/ws`);
  const frames: string[] = [];
  ws.addEventListener("message", (event) => {
    if (typeof event.data === "string") {
      frames.push(event.data);
    }
  });
  await new Promise<void>((resolve) => {
    ws.addEventListener("open", () => resolve());
  });
  return {
    ws,
    frames,
    send: (frame): void => ws.send(frame),
    nextAck: async (channel): Promise<SubscribedAck> => {
      const isAck = (f: string): boolean =>
        f.startsWith('{"type":"subscribed"') && f.includes(channel);
      await waitFor(() => frames.some(isAck), 5_000);
      const ack: SubscribedAck = JSON.parse(frames.find(isAck) ?? "{}");
      return ack;
    },
  };
}
