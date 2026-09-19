/**
 * KeyedRemoteSignal — the ONE primitive for subscribing to a definition-driven
 * event INLINE in server code (outside a route handler), keyed by an id
 * (callId / threadId / …), that works cross-PROCESS and cross-INSTANCE.
 *
 * Transport (the WS hub IS the cross-process KV; redis spans instances):
 *   - SAME PROCESS AS THE HUB (getLocalBroadcast() non-null): subscribe/publish
 *     ride the in-process pub/sub adapter directly — no WS, no round-trip.
 *   - CROSS-PROCESS, SAME MACHINE (a non-hub process — the app worker, the CLI,
 *     a test harness): subscribe opens a WS client to the LOCAL hub and joins the
 *     per-key channel; publish rides the /ws/broadcast loopback POST, which the
 *     hub re-publishes through the adapter (reaching WS clients AND in-hub inline
 *     subscribers alike). The hub process holds the subscription state — the
 *     "in-memory KV that works cross-process".
 *   - CROSS-INSTANCE (a different machine): publish additionally relays through
 *     the remote-event bridge to the target instance's hub (targetInstanceId). In
 *     `WS_PUBSUB_TYPE=redis` the adapter itself spans instances, so the relay is
 *     the only extra hop for local mode.
 *
 * No in-memory-only map at the CALLER, no DB. Channel + envelope are DERIVED from
 * the endpoint definition (its ws channel + the declared event) suffixed by the
 * key, so each in-flight signal has its OWN channel. Typesafe: the caller
 * supplies a `parse` that narrows the wire payload to its action type.
 *
 * ControlSignals (tool actions), StreamControl (stream cancel) and ResultSignals
 * (remote tool result) are all thin wrappers over this.
 */

import "server-only";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { coreClientEnv as envClient } from "../../core/env-client";
import { defaultLocale } from "../../core/i18n/core/config";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { buildUserWsChannel } from "../core/channel";
import { getLocalBroadcast } from "../core/local-broadcast";
import type { AnyEndpointEventEnvelope } from "../core/structured-events";
import { parseWsFrame, type WsWireMessage } from "../core/types";
import { getPubSubAdapter } from "./pubsub/index";

/** A signal's payload as it rides the wire (`payload` on the event envelope). */
export type SignalPayload = Record<string, WidgetData>;

/** Everything needed to address a keyed signal: the endpoint + event + key. */
export interface KeyedSignalRef {
  /** The endpoint whose ws-channel namespaces the signal. */
  endpoint: CreateApiEndpointAny;
  /** The declared event name on that endpoint (single source of the name). */
  eventName: string;
  /** The per-signal key (callId / threadId). One channel per key. */
  key: string;
}

/**
 * Build the per-key channel, USER-SCOPED: `user/<uid>/<endpoint ws-channel>/
 * <eventName>/<key>`. User-scoping is load-bearing: the WS hub's channel auth
 * admits a `user/<uid>/…` channel by identity (the self-token's user) with no
 * descriptor, whereas a bare `ws-<endpoint>/…` endpoint channel is REJECTED
 * without a structured descriptor. Signals are inherently the user's own, so
 * partitioning by uid is also correct — one call's signal never leaks to another
 * account.
 */
function signalChannel(
  ref: KeyedSignalRef,
  userId: string,
  logger: EndpointLogger,
): string {
  const base = buildUserWsChannel(
    ref.endpoint,
    userId,
    {} as never,
    {} as never,
    logger,
  );
  return `${base}/${ref.eventName}/${ref.key}`;
}

/** Build the definition-sourced envelope carrying the signal payload. */
function signalEnvelope(
  ref: KeyedSignalRef,
  payload: SignalPayload,
  channel: string,
): AnyEndpointEventEnvelope {
  return {
    endpointPath: ref.endpoint.path,
    endpointMethod: ref.endpoint.method,
    eventName: ref.eventName,
    responseData: {},
    requestData: {},
    urlPathParams: {},
    payload,
    channel,
  };
}

/**
 * The local hub's WS URL (self) — always 127.0.0.1, never the public
 * NEXT_PUBLIC_APP_URL host. Both the app process and the WS proxy run on the
 * SAME host/container; routing this self-connection out through the public
 * domain (DNS + TLS + reverse proxy) instead of straight to the loopback
 * port is unnecessary and fragile — if that external round-trip fails or
 * hangs for any reason (proxy config, container DNS, network policy), this
 * subscribe() call never resolves and an abort/cancel signal delivered here
 * (e.g. stopping a running AI stream) silently never reaches it. Mirrors
 * localBroadcastUrl() below, which already does this correctly for the HTTP
 * loopback sink used by deliver().
 */
function localHubWsUrl(): string | null {
  const appUrl = envClient.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return null;
  }
  try {
    const parsed = new URL(appUrl);
    const port = parsed.port ? parseInt(parsed.port, 10) : 3000;
    return `ws://127.0.0.1:${String(port)}/ws`;
  } catch {
    return null;
  }
}

/** The loopback /ws/broadcast sink URL (self). */
function localBroadcastUrl(): string {
  const appUrl = envClient.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  try {
    const parsed = new URL(appUrl);
    const port = parsed.port ? parseInt(parsed.port, 10) : 3000;
    return `http://127.0.0.1:${String(port)}/ws/broadcast`;
  } catch {
    return "http://127.0.0.1:3000/ws/broadcast";
  }
}

/**
 * A live keyed-signal subscription: `signal` resolves with the FIRST payload the
 * caller's `parse` accepts; `cancel` tears the subscription down if the caller
 * settles another way. No races — exactly one of {parsed result, cancel} wins.
 */
export interface KeyedSignalSubscription<T> {
  signal: Promise<T>;
  cancel: () => void;
}

export const KeyedRemoteSignal = {
  /**
   * Subscribe to a keyed signal inline. Resolves when a matching event whose
   * `parse` returns non-null arrives — from any process/instance the transport
   * spans. In the hub process this rides the in-process adapter (no WS); in a
   * non-hub process it opens a WS client to the local hub.
   */
  subscribe<T>(params: {
    ref: KeyedSignalRef;
    user: JwtPayloadType;
    /** Narrow the wire payload to the action type; null = not for us, ignore. */
    parse: (payload: WsWireMessage["data"]["payload"]) => T | null;
    logger: EndpointLogger;
  }): KeyedSignalSubscription<T> {
    const { ref, user, parse, logger } = params;
    const userId = user.isPublic ? user.leadId : user.id;
    const channel = signalChannel(ref, userId, logger);
    let settled = false;
    let ws: WebSocket | null = null;
    let unsubAdapter: (() => void) | null = null;

    const cancel = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      unsubAdapter?.();
      unsubAdapter = null;
      if (ws) {
        try {
          ws.close();
        } catch {
          /* already closing */
        }
        ws = null;
      }
    };

    const signal = new Promise<T>((resolve) => {
      const tryResolve = (data: WsWireMessage["data"]): boolean => {
        if (settled) {
          return true;
        }
        const parsed = parse(data.payload);
        if (parsed !== null) {
          cancel();
          resolve(parsed);
          return true;
        }
        return false;
      };

      // In-process fast path: co-located with the hub → adapter handler, no WS.
      if (getLocalBroadcast()) {
        getPubSubAdapter().subscribe<AnyEndpointEventEnvelope>(
          channel,
          (event, data) => {
            if (event === ref.eventName) {
              tryResolve(data);
            }
          },
        );
        unsubAdapter = (): void => getPubSubAdapter().unsubscribe(channel);
        return;
      }

      // Cross-process: WS client to the local hub, join the per-key channel.
      const wsBase = localHubWsUrl();
      logger.warn("[KeyedRemoteSignal] subscribe: cross-process path", {
        channel,
        wsBase,
      });
      if (!wsBase) {
        logger.warn(
          "[KeyedRemoteSignal] subscribe: no wsBase - NEXT_PUBLIC_APP_URL unset, signal will never resolve",
          { channel },
        );
        return;
      }
      void (async (): Promise<void> => {
        let opened: WebSocket | null = null;
        try {
          opened = await openHubWs(user, logger);
        } catch (err) {
          logger.warn("[KeyedRemoteSignal] failed to open hub WS", {
            channel,
            error: err instanceof Error ? err.message : String(err),
          });
          return;
        }
        if (settled || !opened) {
          logger.warn(
            "[KeyedRemoteSignal] subscribe: settled before WS opened or openHubWs returned null",
            { channel, settled, hasOpened: !!opened },
          );
          opened?.close();
          return;
        }
        ws = opened;
        ws.addEventListener("open", () => {
          logger.warn("[KeyedRemoteSignal] hub WS open - sending subscribe", {
            channel,
          });
          ws?.send(
            JSON.stringify({
              type: "subscribe",
              channel,
              locale: defaultLocale,
            }),
          );
        });
        ws.addEventListener("error", (event) => {
          logger.warn("[KeyedRemoteSignal] hub WS error", {
            channel,
            error: String(event),
          });
        });
        ws.addEventListener("close", (event: CloseEvent) => {
          logger.warn("[KeyedRemoteSignal] hub WS closed", {
            channel,
            code: event.code,
            reason: event.reason,
            settled,
          });
        });
        ws.addEventListener("message", (event: MessageEvent) => {
          const raw =
            typeof event.data === "string"
              ? event.data
              : new TextDecoder().decode(event.data as ArrayBuffer);
          const frame = parseWsFrame(raw);
          if (!frame) {
            logger.warn(
              "[KeyedRemoteSignal] hub WS message: unparseable frame",
              {
                channel,
                rawPreview: raw.slice(0, 200),
              },
            );
            return;
          }
          const msgs: ReadonlyArray<WsWireMessage> =
            "type" in frame && frame.type === "batch"
              ? frame.events
              : [frame as WsWireMessage];
          logger.warn("[KeyedRemoteSignal] hub WS message received", {
            channel,
            msgEvents: msgs.map((m) => m.event),
            wantedEvent: ref.eventName,
          });
          for (const msg of msgs) {
            if (msg.event === ref.eventName && tryResolve(msg.data)) {
              logger.warn(
                "[KeyedRemoteSignal] signal resolved from WS message",
                {
                  channel,
                },
              );
              return;
            }
          }
        });
      })();
    });

    return { signal, cancel };
  },

  /**
   * Publish a keyed signal. Reaches every subscriber the transport spans: the
   * in-process adapter (co-located), WS clients (cross-process), and — when
   * `targetInstanceId` is set — the target instance's hub via the remote-event
   * bridge (cross-instance). Fire-and-forget.
   */
  deliver(params: {
    ref: KeyedSignalRef;
    payload: SignalPayload;
    user: JwtPayloadType;
    /** Set to relay the signal to another INSTANCE (cross-machine). */
    targetInstanceId?: string;
    logger: EndpointLogger;
  }): void {
    const { ref, payload, user, targetInstanceId, logger } = params;
    const userId = user.isPublic ? user.leadId : user.id;
    const channel = signalChannel(ref, userId, logger);
    const envelope = signalEnvelope(ref, payload, channel);

    // Publish to the LOCAL hub. In the hub process the adapter fans out directly;
    // in a non-hub process the loopback POST hands it to the hub, which
    // re-publishes through the adapter (reaching WS clients + in-hub inline subs).
    if (getLocalBroadcast()) {
      logger.warn("[KeyedRemoteSignal] deliver: co-located adapter publish", {
        channel,
        event: ref.eventName,
      });
      getPubSubAdapter().publish(channel, ref.eventName, envelope);
    } else {
      const broadcastUrl = localBroadcastUrl();
      logger.warn("[KeyedRemoteSignal] deliver: loopback POST", {
        channel,
        event: ref.eventName,
        broadcastUrl,
      });
      // Internal WS-proxy IPC over loopback — the /ws/broadcast sink is a
      // transport primitive (a separate process), not an endpoint call.
      // oxlint-disable-next-line restricted/no-raw-fetch -- internal WS-proxy IPC (separate process)
      void fetch(broadcastUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ channel, event: ref.eventName, data: envelope }),
      })
        .then((res) => {
          logger.warn("[KeyedRemoteSignal] loopback publish response", {
            channel,
            status: res.status,
          });
          return undefined;
        })
        .catch((err: Error) => {
          logger.warn("[KeyedRemoteSignal] loopback publish failed", {
            channel,
            broadcastUrl,
            error: err.message,
          });
        });
    }

    // Cross-instance relay: carry the same envelope to the target instance's hub
    // over the remote-event bridge, where ITS hub delivers to the subscriber.
    if (targetInstanceId) {
      void import("../remote-event-bridge/repository")
        .then(({ RemoteEventBridgeRepository }) =>
          RemoteEventBridgeRepository.pushRemoteEvent({
            userId: user.isPublic ? user.leadId : user.id,
            logger,
            envelope,
            targetInstanceId,
          }),
        )
        .catch((err: Error) => {
          logger.warn("[KeyedRemoteSignal] cross-instance relay failed", {
            targetInstanceId,
            error: err.message,
          });
        });
    }
  },
};

/**
 * Open an authenticated WS client to the local hub for the given user.
 *
 * Private users: mints a self-JWT (the user's own session identity) so the
 * hub's channel auth admits the per-key channel exactly as it would the
 * user's own socket.
 *
 * Public (incognito/anonymous) users: no session exists to sign a JWT for —
 * connects with `?leadId=` and no `token`, the same token-less path a real
 * public browser session already authenticates through
 * (authenticateWsRequest in ws-channel-auth.ts). The hub then authorizes this
 * exactly as it would the user's own socket: per-key channels are scoped by
 * `user/${leadId}/...`, so this only ever admits the SAME public identity's
 * own channels (e.g. their own thread's stream-control) — never another
 * visitor's. Without this, a public/incognito user's running stream could
 * never receive its own cancel signal in a multi-process deployment (the
 * subscribe side's WS never opens, so it never resolves, so the stream keeps
 * running server-side no matter how many cancel requests arrive).
 */
async function openHubWs(
  user: JwtPayloadType,
  logger: EndpointLogger,
): Promise<WebSocket | null> {
  const wsBase = localHubWsUrl();
  if (!wsBase) {
    return null;
  }
  if (user.isPublic) {
    const url = `${wsBase}?leadId=${encodeURIComponent(user.leadId)}`;
    try {
      return new WebSocket(url);
    } catch (err) {
      logger.warn("[KeyedRemoteSignal] WebSocket construction failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }
  const { AuthRepository } = await import("../../identity/auth/repository");
  const signed = await AuthRepository.signJwt(user, logger, defaultLocale);
  if (!signed.success) {
    logger.warn("[KeyedRemoteSignal] could not sign self-JWT for hub WS");
    return null;
  }
  const leadId = user.leadId;
  const url = `${wsBase}?token=${encodeURIComponent(signed.data)}&leadId=${encodeURIComponent(leadId)}`;
  try {
    return new WebSocket(url);
  } catch (err) {
    logger.warn("[KeyedRemoteSignal] WebSocket construction failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
