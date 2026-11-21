"use client";

/**
 * WebSocket Client — single shared browser connection + imperative subscribe API.
 *
 * One WebSocket per browser tab. All channel subscriptions are virtual: the
 * client sends `{type:"subscribe", channel, locale, descriptor?}` /
 * `{type:"unsubscribe", channel}`; the server filters broadcasts accordingly. For
 * endpoint (ws-*) channels the structured `descriptor` lets the server rebuild
 * and authorize the canonical channel (it never trusts the raw channel string).
 *
 * Auth is handled via httpOnly cookies (sent automatically on same-origin).
 *
 * Consumers use `useEndpointSubscription`, which derives the channel + descriptor
 * from the endpoint definition and applies events to the React Query cache. This
 * module is the transport beneath it: `subscribeToChannel` registers a handler,
 * `preWarmChannel` opens the socket early (e.g. just before a stream POST).
 *
 * Catch-up after reconnect: every event carries a per-channel replay `seq`.
 * The client remembers the last one per channel and, when the socket comes
 * back (network blip, deploy drain 1012, the other HA node), resubscribes with
 * `since`; the server replays what was published in the gap. When the gap is
 * older than the server's buffer it answers `complete: false` and the
 * channel's resync handlers refetch instead (`onChannelResync`).
 */

import {
  addDocumentListener,
  addWindowListener,
  getVisibilityState,
} from "next-vibe/ui/lib/dom";
import { getCurrentHost, getCurrentProtocol } from "next-vibe/ui/lib/location";
import { isOnline } from "next-vibe/ui/lib/media";

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { EndpointLogger } from "../../logger/types";
import { mintRequestId } from "../../logger/with-log-context";
import type {
  EventHandler,
  WsChannelDescriptor,
  WsClientMessage,
  WsSubscribedFrame,
  WsWireMessage,
} from "../core/types";
import { parseWsClientFrame } from "../core/types";

/**
 * Internal wire handler — accepts wire-protocol data (WsWireMessage["data"]).
 * This is the widest Zod output type; consumers narrow it via generics.
 */
type WireHandler = EventHandler<WsWireMessage["data"]>;

/**
 * Per-channel subscription state. The physical WS connection is shared; this
 * tracks the virtual subscriptions multiplexed over it.
 */
interface ChannelState {
  /** Handlers per event name (always "__event__" for endpoint channels). */
  listeners: Map<string, Set<WireHandler>>;
  /** Locale used when subscribing — sent to the server for authorization. */
  locale: CountryLanguage;
  /**
   * Structured descriptor for endpoint (ws-*) channels. The server rebuilds and
   * authorizes the channel from this; absent for user-scoped (user/{uid}/…)
   * channels, which are authorized by identity prefix alone.
   * Stored so reconnect re-sends it with the subscription.
   */
  descriptor?: WsChannelDescriptor;
  /**
   * Last replay seq delivered on this channel (from any socket). Sent as
   * `since` on resubscribe so the server replays the gap. null = nothing seen
   * yet (first subscribe).
   */
  lastSeq: number | null;
  /**
   * The server acked this channel's subscribe on the CURRENT socket. Only then
   * is `seq <= lastSeq` a duplicate: an older server build without replay
   * numbers its frames differently, so dedupe stays off until it acks.
   */
  acked: boolean;
  /**
   * Subscribed before an identity change. The new socket defers it: the
   * owning widgets re-subscribe for the new identity themselves (their user
   * changed), and resending the old identity's channels would only be denied.
   * Whatever is still mounted after the grace period is resubscribed.
   */
  identityStale: boolean;
  refreshGuestIdentity: boolean;
}

/** RFC 6455 close code the server sends on a restart or deploy drain. */
const WS_SERVICE_RESTART_CODE = 1012;
/** Our own close code: the tab's identity changed, reconnect with new cookies. */
const WS_IDENTITY_CHANGED_CODE = 4001;
/** How long the new socket waits before resubscribing pre-switch channels. */
const IDENTITY_RESUBSCRIBE_GRACE_MS = 3_000;
/** Report an ongoing drop after this much wall-clock time. */
const DROP_REPORT_AFTER_MS = 20_000;
/** How often to check whether an open outage is due to be reported. */
const DROP_CHECK_INTERVAL_MS = 5_000;
/** Retry an exhausted connection slowly while the tab is visible and online. */
const RECONNECT_COOLDOWN_MS = 60_000;
const MAX_FAST_RECONNECT_ATTEMPTS = 6;

// Shared connection state
let sharedWs: WebSocket | null = null;
let reconnectAttempts = 0;
// Once fast retries run out, an active tab retries at a slower rate.
let reconnectPaused = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

// Virtual channel subscriptions: channel → ChannelState
const channels = new Map<string, ChannelState>();

// Gap-too-old handlers per channel (refetch the channel's data). Kept apart
// from ChannelState so a handler can register before/after the subscription.
const resyncHandlers = new Map<string, Set<() => void>>();
const guestIdentityChangeHandlers = new Set<() => void>();

// Last real logger handed to connect(): the visibility-restore reconnect has
// no caller of its own, and a no-op logger there hid every failure after it.
let lastLogger: EndpointLogger | null = null;
// When the socket last went down - reported with the recovery so a flaky
// connection shows how long live updates were missing.
let disconnectedAt: number | null = null;
// Navigation/close tears the socket down on purpose - not a reportable drop.
let pageUnloading = false;
// When the current socket opened / last delivered a frame. A drop report with
// these tells a handshake failure (never opened), an idle cut by a proxy or
// carrier (long silence before the close) and a server kill mid-traffic apart;
// the close code alone is 1006 for all of them.
let openedAt: number | null = null;
let lastFrameAt: number | null = null;
let lastVisibilityChangeAt: number | null = null;
let lastNetworkChangeAt: number | null = null;

/** Close details of the socket that started the current outage. */
interface DropInfo {
  requestId: string;
  code: number;
  reason: string;
  wasClean: boolean;
  online: boolean;
  /** Tab was hidden when the socket closed (mobile background, frozen tab). */
  hiddenAtClose: boolean;
  channelCount: number;
  /** null = the socket never opened (handshake/upgrade failed) */
  connectedForMs: number | null;
  handshakeMs: number;
  acknowledgedChannels: number;
  sinceLastFrameMs: number | null;
  msSinceVisibilityChange: number | null;
  msSinceNetworkChange: number | null;
}
// The current outage: its first close, whether it was reported, and how long
// it lasted while the user could notice it (tab visible + browser online).
let pendingDrop: DropInfo | null = null;
let dropReported = false;
let reconnectExhaustionReported = false;
let dropReconnectCount = 0;
let failedHandshakesDuringDrop = 0;
let lastFailedHandshakeRequestId: string | null = null;
let lastFailedHandshakeMs: number | null = null;
let maxReconnectTimerOverrunMs = 0;
let noticeableDownMs = 0;
let noticeableSince: number | null = null;
let dropCheckTimer: ReturnType<typeof setInterval> | null = null;

function isTabVisible(): boolean {
  return typeof window === "undefined" || getVisibilityState() === "visible";
}

function currentNoticeableDownMs(): number {
  return (
    noticeableDownMs +
    (noticeableSince === null ? 0 : Date.now() - noticeableSince)
  );
}

function updateDropVisibility(): void {
  if (disconnectedAt !== null) {
    noticeableDownMs = currentNoticeableDownMs();
    noticeableSince = isTabVisible() && isOnline() ? Date.now() : null;
  }
}

function stopDropCheck(): void {
  if (dropCheckTimer !== null) {
    clearInterval(dropCheckTimer);
    dropCheckTimer = null;
  }
}

function reportDrop(logger: EndpointLogger, recovered: boolean): void {
  if (disconnectedAt === null || dropReported) {
    return;
  }
  dropReported = true;
  stopDropCheck();
  logger.error("[WS Client] Connection lost", {
    ...pendingDrop,
    offlineMs: Date.now() - disconnectedAt,
    noticeableDownMs: currentNoticeableDownMs(),
    attempts: dropReconnectCount,
    failedHandshakesDuringDrop,
    lastFailedHandshakeRequestId,
    lastFailedHandshakeMs,
    maxReconnectTimerOverrunMs,
    reconnectPaused,
    recovered,
  });
}

function startDropCheck(logger: EndpointLogger): void {
  dropCheckTimer = setInterval(() => {
    if (disconnectedAt === null || dropReported) {
      stopDropCheck();
      return;
    }
    if (Date.now() - disconnectedAt >= DROP_REPORT_AFTER_MS) {
      reportDrop(logger, false);
    }
  }, DROP_CHECK_INTERVAL_MS);
}

function sendToServer(msg: WsClientMessage): void {
  if (sharedWs?.readyState === WebSocket.OPEN) {
    sharedWs.send(JSON.stringify(msg));
  }
}

function sendSubscribe(channel: string, state: ChannelState): void {
  sendToServer({
    type: "subscribe",
    channel,
    locale: state.locale,
    descriptor: state.descriptor,
    replay: true,
    since: state.lastSeq ?? undefined,
    refreshGuestIdentity: state.refreshGuestIdentity ? true : undefined,
  });
}

function handleOpen(logger: EndpointLogger): void {
  openedAt = Date.now();
  lastFrameAt = null;
  if (disconnectedAt !== null) {
    if (dropReported) {
      logger.warn("[WS Client] Reconnected after disconnect", {
        ...pendingDrop,
        attempts: dropReconnectCount,
        failedHandshakesDuringDrop,
        lastFailedHandshakeRequestId,
        lastFailedHandshakeMs,
        maxReconnectTimerOverrunMs,
        offlineMs: Date.now() - disconnectedAt,
        noticeableDownMs: currentNoticeableDownMs(),
        channelCount: channels.size,
        recovered: true,
      });
    } else {
      reportDrop(logger, true);
    }
  }
  disconnectedAt = null;
  pendingDrop = null;
  dropReported = false;
  reconnectExhaustionReported = false;
  dropReconnectCount = 0;
  failedHandshakesDuringDrop = 0;
  lastFailedHandshakeRequestId = null;
  lastFailedHandshakeMs = null;
  maxReconnectTimerOverrunMs = 0;
  noticeableDownMs = 0;
  noticeableSince = null;
  stopDropCheck();
  reconnectAttempts = 0;
  reconnectPaused = false;
  // Re-subscribe to all active channels after reconnect, each with the last
  // seq it saw so the server replays the gap.
  let deferred = false;
  for (const [channel, state] of channels.entries()) {
    state.acked = false;
    if (state.identityStale) {
      deferred = true;
      continue;
    }
    sendSubscribe(channel, state);
  }
  if (deferred) {
    setTimeout(() => {
      for (const [channel, state] of channels.entries()) {
        if (state.identityStale) {
          state.identityStale = false;
          sendSubscribe(channel, state);
        }
      }
    }, IDENTITY_RESUBSCRIBE_GRACE_MS);
  }
}

function handleSubscribed(
  frame: WsSubscribedFrame,
  logger: EndpointLogger,
): void {
  const state = channels.get(frame.channel);
  if (!state) {
    return;
  }
  const since = state.lastSeq;
  state.acked = true;
  state.lastSeq = Math.max(state.lastSeq ?? 0, frame.cursor);
  if (frame.complete) {
    return;
  }
  // The gap is older than the server's replay buffer: events are missing for
  // good, so the channel's data has to be refetched.
  const handlers = resyncHandlers.get(frame.channel);
  logger.info("[WS Client] Replay gap too old - refetching channel", {
    channel: frame.channel,
    since,
    cursor: frame.cursor,
    handlerCount: handlers?.size ?? 0,
  });
  if (!handlers) {
    return;
  }
  for (const handler of handlers) {
    try {
      handler();
    } catch (error) {
      logger.error(
        "[WS Client] Resync handler threw",
        error instanceof Error ? error : String(error),
        { channel: frame.channel },
      );
    }
  }
}

function dispatch(msg: WsWireMessage, logger: EndpointLogger): void {
  const state = channels.get(msg.channel);
  if (state && typeof msg.seq === "number" && msg.seq > 0) {
    if (state.acked && state.lastSeq !== null && msg.seq <= state.lastSeq) {
      return; // already delivered (replay overlap)
    }
    state.lastSeq = Math.max(state.lastSeq ?? 0, msg.seq);
  }
  const handlers = state?.listeners.get(msg.event);
  if (handlers) {
    for (const handler of handlers) {
      try {
        handler(msg.data);
      } catch (error) {
        // One broken applier used to abort the loop, so the remaining
        // handlers (other widgets on the same channel) silently missed the
        // event too. Report it and keep delivering.
        logger.error(
          "[WS Client] Event handler threw",
          error instanceof Error ? error : String(error),
          { channel: msg.channel, event: msg.event },
        );
      }
    }
  }
}

function clearReconnectTimer(): void {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect(logger: EndpointLogger, delay: number): void {
  clearReconnectTimer();
  const scheduledDrop = pendingDrop;
  const reconnectDueAt = Date.now() + delay;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (
      channels.size === 0 ||
      pageUnloading ||
      (reconnectPaused && (!isTabVisible() || !isOnline()))
    ) {
      return;
    }
    if (scheduledDrop && pendingDrop === scheduledDrop) {
      maxReconnectTimerOverrunMs = Math.max(
        maxReconnectTimerOverrunMs,
        Date.now() - reconnectDueAt,
      );
    }
    connect(logger);
  }, delay);
}

// The connection is shared across channels, but a logger is REQUIRED to open it.
// It is threaded from the subscribe/preWarm caller's EndpointLogger and captured
// in the socket's handlers (and the reconnect closure) so connection-level events
// like frame-parse failures always have a logger — never optional, never global.
function connect(logger: EndpointLogger): void {
  if (
    sharedWs?.readyState === WebSocket.OPEN ||
    sharedWs?.readyState === WebSocket.CONNECTING
  ) {
    return;
  }

  if (typeof WebSocket === "undefined") {
    return;
  }
  clearReconnectTimer();

  const protocol = getCurrentProtocol() === "https:" ? "wss:" : "ws:";
  const requestId = mintRequestId();
  const url = `${protocol}//${getCurrentHost()}/ws?requestId=${requestId}`;

  lastLogger = logger;
  const connectStartedAt = Date.now();
  const ws = new WebSocket(url);
  sharedWs = ws;
  if (pendingDrop !== null) {
    dropReconnectCount++;
  }

  const handleMessage = (event: MessageEvent): void => {
    if (sharedWs !== ws) {
      return; // a replaced socket (identity change) - its frames are stale
    }
    lastFrameAt = Date.now();
    if (typeof event.data !== "string") {
      logger.error("[WS Client] Ignored non-string frame");
      return;
    }
    const frame = parseWsClientFrame(event.data);
    if (!frame) {
      logger.error("[WS Client] Failed to parse message", {
        dataPreview: event.data.slice(0, 500),
      });
      return;
    }
    if (!("type" in frame)) {
      dispatch(frame, logger);
    } else if (frame.type === "batch") {
      for (const msg of frame.events) {
        dispatch(msg, logger);
      }
    } else if (frame.type === "guest-identity-changed") {
      for (const handler of guestIdentityChangeHandlers) {
        handler();
      }
    } else {
      handleSubscribed(frame, logger);
    }
  };

  const handleClose = (event: CloseEvent): void => {
    if (sharedWs !== ws) {
      return; // replaced on purpose (identity change); the new socket owns state
    }
    sharedWs = null;
    const closedAt = Date.now();
    const socketOpenedAt = openedAt;
    const socketLastFrameAt = lastFrameAt;
    openedAt = null;
    lastFrameAt = null;
    if (channels.size === 0) {
      return;
    }
    if (disconnectedAt !== null && socketOpenedAt === null) {
      failedHandshakesDuringDrop++;
      lastFailedHandshakeRequestId = requestId;
      lastFailedHandshakeMs = closedAt - connectStartedAt;
    }
    // Keep the first close of the episode. Recovery, the report timer, or
    // pagehide reports it once, even when several reconnects fail.
    if (disconnectedAt === null && !pageUnloading) {
      disconnectedAt = closedAt;
      dropReported = false;
      dropReconnectCount = 0;
      noticeableDownMs = 0;
      updateDropVisibility();
      pendingDrop = {
        requestId,
        code: event.code,
        reason: event.reason.slice(0, 200),
        wasClean: event.wasClean,
        online: isOnline(),
        hiddenAtClose: !isTabVisible(),
        channelCount: channels.size,
        connectedForMs:
          socketOpenedAt === null ? null : closedAt - socketOpenedAt,
        handshakeMs: (socketOpenedAt ?? closedAt) - connectStartedAt,
        acknowledgedChannels:
          socketOpenedAt === null
            ? 0
            : [...channels.values()].filter((state) => state.acked).length,
        sinceLastFrameMs:
          socketLastFrameAt === null ? null : closedAt - socketLastFrameAt,
        msSinceVisibilityChange:
          lastVisibilityChangeAt === null
            ? null
            : closedAt - lastVisibilityChangeAt,
        msSinceNetworkChange:
          lastNetworkChangeAt === null ? null : closedAt - lastNetworkChangeAt,
      };
      startDropCheck(logger);
    }
    // Report the end of the fast retries once. A foreground tab can still
    // recover after a longer outage without waiting for another user action.
    if (reconnectAttempts >= MAX_FAST_RECONNECT_ATTEMPTS) {
      reconnectPaused = true;
      const retryWhileActive = isTabVisible() && isOnline();
      if (!reconnectExhaustionReported) {
        reconnectExhaustionReported = true;
        logger.error("[WS Client] Fast reconnect attempts exhausted", {
          requestId,
          attempts: reconnectAttempts,
          lastCode: event.code,
          lastReason: event.reason.slice(0, 200),
          offlineMs:
            disconnectedAt === null ? null : Date.now() - disconnectedAt,
          noticeableDownMs: currentNoticeableDownMs(),
          firstDropCode: pendingDrop?.code ?? null,
          failedHandshakesDuringDrop,
          lastFailedHandshakeRequestId,
          lastFailedHandshakeMs,
          maxReconnectTimerOverrunMs,
          hiddenAtClose: pendingDrop?.hiddenAtClose ?? null,
          channelCount: channels.size,
          online: isOnline(),
          visible: isTabVisible(),
          nextRetryMs: retryWhileActive ? RECONNECT_COOLDOWN_MS : null,
        });
      }
      if (retryWhileActive) {
        scheduleReconnect(logger, RECONNECT_COOLDOWN_MS);
      }
      return;
    }
    // 1012 "Service Restart" on the first drop = a deploy moved this node out
    // of rotation (or restarted it): the peer is already serving, so come
    // back fast, with jitter so every tab does not reconnect in the same tick.
    // Events emitted during the gap are replayed on resubscribe (bounded
    // buffer); an older gap makes the channel refetch.
    // Otherwise exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s.
    const delay =
      event.code === WS_SERVICE_RESTART_CODE && reconnectAttempts === 0
        ? 100 + Math.floor(Math.random() * 400)
        : Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    reconnectAttempts++;
    scheduleReconnect(logger, delay);
  };

  ws.addEventListener("open", () => {
    if (sharedWs === ws) {
      handleOpen(logger);
    }
  });
  ws.addEventListener("message", handleMessage);
  ws.addEventListener("close", handleClose);
  // onerror is followed by onclose, which triggers reconnect.
}

function resumeReconnect(): void {
  if (
    lastLogger &&
    channels.size > 0 &&
    !sharedWs &&
    !pageUnloading &&
    isTabVisible() &&
    isOnline()
  ) {
    ensureConnected(lastLogger);
  }
}

// Guard: this module is also loaded during SSR (TanStack/Vite), where `document`
// doesn't exist. Only register the listener in a real browser context.
if (typeof document !== "undefined") {
  addWindowListener("pagehide", () => {
    pageUnloading = true;
    clearReconnectTimer();
    noticeableDownMs = currentNoticeableDownMs();
    noticeableSince = null;
    if (lastLogger) {
      reportDrop(lastLogger, false);
    }
  });
  addWindowListener("pageshow", () => {
    pageUnloading = false;
    updateDropVisibility();
    resumeReconnect();
  });
  addDocumentListener("visibilitychange", () => {
    lastVisibilityChangeAt = Date.now();
    updateDropVisibility();
    if (reconnectPaused) {
      resumeReconnect();
    }
  });
  addWindowListener("online", () => {
    lastNetworkChangeAt = Date.now();
    updateDropVisibility();
    if (reconnectPaused) {
      resumeReconnect();
    }
  });
  addWindowListener("offline", () => {
    lastNetworkChangeAt = Date.now();
    updateDropVisibility();
  });
}

function ensureConnected(logger: EndpointLogger): void {
  // A new subscription resets the pause (e.g. user navigated to a new view)
  // so a fresh connect attempt is made with potentially refreshed cookies.
  if (reconnectPaused) {
    reconnectPaused = false;
    reconnectAttempts = 0;
  }
  if (
    !sharedWs ||
    sharedWs.readyState === WebSocket.CLOSED ||
    sharedWs.readyState === WebSocket.CLOSING
  ) {
    connect(logger);
  }
}

function getOrCreateChannel(
  channel: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
  descriptor?: WsChannelDescriptor,
  refreshGuestIdentity = false,
): ChannelState {
  const existing = channels.get(channel);
  if (existing) {
    // Backfill the descriptor if a later subscriber supplies one (e.g. a
    // preWarm without descriptor followed by the real endpoint subscription).
    if (descriptor && !existing.descriptor) {
      existing.descriptor = descriptor;
    }
    const addedGuestRefresh =
      refreshGuestIdentity && !existing.refreshGuestIdentity;
    existing.refreshGuestIdentity ||= refreshGuestIdentity;
    if (existing.identityStale || addedGuestRefresh) {
      // A widget re-subscribed after the identity change: it is live again.
      existing.identityStale = false;
      sendSubscribe(channel, existing);
    }
    return existing;
  }

  const state: ChannelState = {
    listeners: new Map(),
    locale,
    descriptor,
    lastSeq: null,
    acked: false,
    identityStale: false,
    refreshGuestIdentity,
  };
  channels.set(channel, state);

  ensureConnected(logger);
  sendSubscribe(channel, state);
  return state;
}

function addListener(
  state: ChannelState,
  event: string,
  handler: WireHandler,
  channel: string,
): () => void {
  let handlers = state.listeners.get(event);
  if (!handlers) {
    handlers = new Set();
    state.listeners.set(event, handlers);
  }
  handlers.add(handler);

  return (): void => {
    handlers.delete(handler);
    if (handlers.size === 0) {
      state.listeners.delete(event);
    }
    if (state.listeners.size === 0) {
      channels.delete(channel);
      sendToServer({ type: "unsubscribe", channel });
    }
  };
}

/**
 * Subscribe to a WS channel. Returns an unsubscribe function that removes the
 * handler and, when the channel has no handlers left, unsubscribes server-side.
 * The caller's generic `T` is the inferred event payload from the endpoint
 * definition; it threads through unconstrained so the handler is fully typed.
 */
export function subscribeToChannel<T = WsWireMessage["data"]>(
  channel: string,
  event: string,
  handler: EventHandler<T>,
  locale: CountryLanguage,
  logger: EndpointLogger,
  descriptor?: WsChannelDescriptor,
  refreshGuestIdentity = false,
): () => void {
  const state = getOrCreateChannel(
    channel,
    locale,
    logger,
    descriptor,
    refreshGuestIdentity,
  );
  return addListener(state, event, handler as WireHandler, channel);
}

/** The socket used a newer guest cookie than the page's rendered identity. */
export function onGuestSocketIdentityChange(handler: () => void): () => void {
  guestIdentityChangeHandlers.add(handler);
  return (): void => {
    guestIdentityChangeHandlers.delete(handler);
  };
}

/**
 * Pre-warm a WS channel so the socket is established (and the subscription sent)
 * before handlers are added — e.g. just before a stream POST so the first events
 * are not delayed by connection setup. Idempotent.
 */
export function preWarmChannel(
  channel: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
  descriptor?: WsChannelDescriptor,
): void {
  getOrCreateChannel(channel, locale, logger, descriptor);
}

/**
 * Register a handler for "the replay gap on this channel was too old": the
 * events missed while the socket was down are gone, so the owner of the
 * channel's data refetches it. Returns the unregister function.
 */
export function onChannelResync(
  channel: string,
  handler: () => void,
): () => void {
  let handlers = resyncHandlers.get(channel);
  if (!handlers) {
    handlers = new Set();
    resyncHandlers.set(channel, handlers);
  }
  handlers.add(handler);
  return (): void => {
    handlers.delete(handler);
    if (handlers.size === 0 && resyncHandlers.get(channel) === handlers) {
      resyncHandlers.delete(channel);
    }
  };
}

/**
 * The tab's identity changed (login, signup or logout in another tab). The
 * socket's identity is fixed at upgrade from the cookies of that moment, so
 * user-scoped channels of the new identity would be denied on it: replace the
 * socket. The widgets re-subscribe for the new identity as their user prop
 * changes; channels from before the switch that are still mounted after a
 * short grace period resubscribe too (with `since`, so shared channels keep a
 * gap-free stream). No-op without a socket.
 */
export function reconnectForIdentityChange(logger: EndpointLogger): void {
  const old = sharedWs;
  if (!old) {
    return;
  }
  sharedWs = null;
  openedAt = null;
  lastFrameAt = null;
  reconnectAttempts = 0;
  reconnectPaused = false;
  try {
    old.close(WS_IDENTITY_CHANGED_CODE, "identity-changed");
  } catch {
    /* already closing */
  }
  for (const state of channels.values()) {
    state.identityStale = true;
  }
  if (channels.size > 0) {
    connect(logger);
  }
}
