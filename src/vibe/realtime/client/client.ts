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

import { getRawCookieString } from "next-vibe/ui/lib/cookies";
import {
  addDocumentListener,
  addWindowListener,
  getVisibilityState,
} from "next-vibe/ui/lib/dom";
import { getCurrentHost, getCurrentProtocol } from "next-vibe/ui/lib/location";
import { isOnline } from "next-vibe/ui/lib/media";

import { CSRF_TOKEN_COOKIE_NAME } from "@/env/constants";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { navigationTimingEvidence } from "../../logger/resource-diagnostics";
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
import {
  classifyWsDrop,
  DEVICE_SUSPEND_MIN_MS,
  WS_SERVICE_RESTART_CODE,
} from "./drop-cause";

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
/** Our own close code: the tab's identity changed, reconnect with new cookies. */
const WS_IDENTITY_CHANGED_CODE = 4001;
/** How long the new socket waits before resubscribing pre-switch channels. */
const IDENTITY_RESUBSCRIBE_GRACE_MS = 3_000;
/** Report an ongoing drop after this much wall-clock time. */
const DROP_REPORT_AFTER_MS = 20_000;
/** How often to check whether an open outage is due to be reported. */
const DROP_CHECK_INTERVAL_MS = 5_000;
/** Bound a foreground browser upgrade, including the first connection. */
const HANDSHAKE_TIMEOUT_MS = 15_000;
/** A drained node has a serving peer. Retry one slow foreground upgrade early. */
const FIRST_RESTART_HANDSHAKE_MS = 5_000;
/** Retry an exhausted connection slowly while the tab is visible and online. */
const RECONNECT_COOLDOWN_MS = 60_000;
const MAX_FAST_RECONNECT_ATTEMPTS = 6;
/**
 * RFC 6455 readyState values, read from the spec instead of the WebSocket
 * global. A page script or extension that swaps window.WebSocket for a
 * wrapper class can drop the static constants: with `WebSocket.OPEN`
 * undefined, `null?.readyState === WebSocket.OPEN` was true, connect() never
 * opened a socket and the first subscribe threw "Cannot read properties of
 * null (reading 'send')" into the layout ErrorBoundary (2026-11-20/27).
 */
const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;
/**
 * Background park: a hidden tab's socket is closed by us (1000) once it has
 * been quiet this long, and reopened with replay when the tab is visible
 * again. Browsers and mobile OSes otherwise kill or freeze a hidden tab's
 * socket on their own schedule (iOS suspends right after hiding, Chrome
 * stops answering pings in long-hidden tabs). Each of those kills used to
 * surface as a client "Connection lost" plus a server "Closed idle socket"
 * row, and a hidden tab reconnected and died again every few minutes. The
 * user saw nothing while hidden; after resume they got a half-dead socket.
 */
const BACKGROUND_PARK_QUIET_MS = 5_000;
/**
 * Right after a stream request (preWarmChannel) the channel can go quiet
 * between steps (tool calls, media generation) while the answer is still
 * running. Wait longer before parking so a hidden tab keeps receiving it.
 */
const STREAM_PARK_QUIET_MS = 30_000;
const STREAM_ACTIVITY_WINDOW_MS = 10 * 60_000;
/**
 * Liveness tick of a visible page. A gap in it means the device slept or
 * froze the page (laptop lid, screen lock, occluded window) while the page
 * still counted as visible: the browser stops answering pings, the server
 * closes the socket, and the close only surfaces on wake. Without this such
 * drops were indistinguishable from a real mid-session cut ("silent-drop").
 */
const LIVENESS_TICK_MS = 5_000;
const BACKGROUND_PARK_CLOSE_CODE = 1000;
const BACKGROUND_PARK_CLOSE_REASON = "background-park";

// Shared connection state
let sharedWs: WebSocket | null = null;
let pendingHandshake: {
  requestId: string;
  startedAt: number;
  timedOut: boolean;
} | null = null;
let handshakeTimer: ReturnType<typeof setTimeout> | null = null;
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
// Background park state: when the last stream request pre-warmed a channel,
// the pending quiet check, and whether the current outage waits for the tab
// to become visible again instead of retrying in the background.
let lastPreWarmAt: number | null = null;
let parkTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectHeldForVisibility = false;
let livenessTimer: ReturnType<typeof setInterval> | null = null;
let lastLivenessTickAt: number | null = null;
let lastDeviceResumeAt: number | null = null;

/** Close details of the socket that started the current outage. */
interface DropInfo {
  requestId: string;
  closedAtMs: number;
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
  handshakeTimedOut: boolean;
  handshakeContext: ReturnType<typeof readHandshakeContext>;
  acknowledgedChannels: number;
  sinceLastFrameMs: number | null;
  msSinceVisibilityChange: number | null;
  msSinceNetworkChange: number | null;
  /** Liveness-timer gap right before the close (null = tab hidden). */
  deviceSuspendedMs: number | null;
  /** Time since the last device suspend of a visible page ended. */
  msSinceDeviceResume: number | null;
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
let lastFailedHandshakeCode: number | null = null;
let lastFailedHandshakeContext:
  | (ReturnType<typeof readHandshakeContext> & {
      timedOut: boolean;
    })
  | null = null;
let maxReconnectTimerOverrunMs = 0;
let noticeableDownMs = 0;
let noticeableSince: number | null = null;
let dropCheckTimer: ReturnType<typeof setInterval> | null = null;

function isTabVisible(): boolean {
  return typeof window === "undefined" || getVisibilityState() === "visible";
}

function readHandshakeContext(): ReturnType<typeof navigationTimingEvidence> & {
  csrfCookieReadable: boolean | null;
} {
  let csrfCookieReadable: boolean | null = null;
  try {
    csrfCookieReadable = getRawCookieString()
      .split(";")
      .some((cookie) =>
        cookie.trimStart().startsWith(`${CSRF_TOKEN_COOKIE_NAME}=`),
      );
  } catch {
    // A browser can prohibit document.cookie access for this frame.
  }
  return {
    ...navigationTimingEvidence(),
    csrfCookieReadable,
  };
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

function reportDrop(
  logger: EndpointLogger,
  dropReportTrigger: "reconnected" | "deadline" | "pagehide",
  recovery?: { reconnectRequestId: string; reconnectHandshakeMs: number },
): void {
  if (disconnectedAt === null || dropReported) {
    return;
  }
  dropReported = true;
  stopDropCheck();
  const plannedRestart = pendingDrop?.code === WS_SERVICE_RESTART_CODE;
  const seamless =
    plannedRestart &&
    dropReportTrigger === "reconnected" &&
    currentNoticeableDownMs() < FIRST_RESTART_HANDSHAKE_MS &&
    failedHandshakesDuringDrop === 0;
  const log = seamless ? logger.info : logger.error;
  log(
    seamless
      ? "[WS Client] Planned reconnect after server restart"
      : "[WS Client] Connection lost",
    {
      ...pendingDrop,
      ...recovery,
      plannedRestart,
      dropCause: pendingDrop
        ? classifyWsDrop({ ...pendingDrop, maxReconnectTimerOverrunMs })
        : null,
      offlineMs: Date.now() - disconnectedAt,
      noticeableDownMs: currentNoticeableDownMs(),
      attempts: dropReconnectCount,
      failedHandshakesDuringDrop,
      lastFailedHandshakeRequestId,
      lastFailedHandshakeMs,
      lastFailedHandshakeCode,
      lastFailedHandshakeContext,
      maxReconnectTimerOverrunMs,
      reconnectPaused,
      pendingHandshakeRequestId: pendingHandshake?.requestId ?? null,
      pendingHandshakeMs: pendingHandshake
        ? Date.now() - pendingHandshake.startedAt
        : null,
      retryScheduled: reconnectTimer !== null,
      recovered: dropReportTrigger === "reconnected",
      dropReportTrigger,
    },
  );
}

function startDropCheck(logger: EndpointLogger): void {
  dropCheckTimer = setInterval(() => {
    if (disconnectedAt === null || dropReported) {
      stopDropCheck();
      return;
    }
    // A drop that waits for the tab to come back is only an outage once the
    // user can see it: count visible + online time, not wall-clock time.
    const downMs = reconnectHeldForVisibility
      ? currentNoticeableDownMs()
      : Date.now() - disconnectedAt;
    if (downMs >= DROP_REPORT_AFTER_MS) {
      reportDrop(logger, "deadline");
    }
  }, DROP_CHECK_INTERVAL_MS);
}

function sendToServer(msg: WsClientMessage): void {
  const ws = sharedWs;
  if (ws !== null && ws.readyState === WS_OPEN) {
    ws.send(JSON.stringify(msg));
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

function handleOpen(
  logger: EndpointLogger,
  requestId: string,
  connectStartedAt: number,
): void {
  openedAt = Date.now();
  lastFrameAt = null;
  if (disconnectedAt !== null) {
    // Correlate the successful retry with its own edge and server records.
    const recovery = {
      reconnectRequestId: requestId,
      reconnectHandshakeMs: openedAt - connectStartedAt,
    };
    if (dropReported) {
      const plannedRestart = pendingDrop?.code === WS_SERVICE_RESTART_CODE;
      logger.warn(
        plannedRestart
          ? "[WS Client] Reconnected after server restart"
          : "[WS Client] Reconnected after disconnect",
        {
          ...pendingDrop,
          ...recovery,
          plannedRestart,
          dropCause: pendingDrop
            ? classifyWsDrop({ ...pendingDrop, maxReconnectTimerOverrunMs })
            : null,
          attempts: dropReconnectCount,
          failedHandshakesDuringDrop,
          lastFailedHandshakeRequestId,
          lastFailedHandshakeMs,
          lastFailedHandshakeCode,
          lastFailedHandshakeContext,
          maxReconnectTimerOverrunMs,
          offlineMs: Date.now() - disconnectedAt,
          noticeableDownMs: currentNoticeableDownMs(),
          channelCount: channels.size,
          recovered: true,
        },
      );
    } else {
      reportDrop(logger, "reconnected", recovery);
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
  lastFailedHandshakeCode = null;
  lastFailedHandshakeContext = null;
  maxReconnectTimerOverrunMs = 0;
  noticeableDownMs = 0;
  noticeableSince = null;
  reconnectHeldForVisibility = false;
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
  // Opened while hidden (a new subscription or an active-stream retry): park
  // it again once it goes quiet.
  scheduleBackgroundPark();
}

function livenessTick(): void {
  const now = Date.now();
  if (
    lastLivenessTickAt !== null &&
    isTabVisible() &&
    now - lastLivenessTickAt - LIVENESS_TICK_MS >= DEVICE_SUSPEND_MIN_MS
  ) {
    lastDeviceResumeAt = now;
  }
  lastLivenessTickAt = now;
}

function ensureLivenessTimer(): void {
  if (livenessTimer !== null) {
    return;
  }
  lastLivenessTickAt = Date.now();
  livenessTimer = setInterval(livenessTick, LIVENESS_TICK_MS);
}

function clearParkTimer(): void {
  if (parkTimer !== null) {
    clearTimeout(parkTimer);
    parkTimer = null;
  }
}

/** How long a hidden socket must be quiet before it is parked. */
function backgroundParkQuietMs(now: number): number {
  return lastPreWarmAt !== null &&
    now - lastPreWarmAt < STREAM_ACTIVITY_WINDOW_MS
    ? STREAM_PARK_QUIET_MS
    : BACKGROUND_PARK_QUIET_MS;
}

/**
 * Hidden tab: close the shared socket ourselves once it is quiet, before the
 * browser or OS kills it. Re-checks while traffic keeps flowing. The channel
 * cursors stay, so the visible tab resubscribes with `since` and the server
 * replays the gap (or the channel refetches when the gap is too old).
 */
function scheduleBackgroundPark(): void {
  clearParkTimer();
  const ws = sharedWs;
  if (
    !ws ||
    ws.readyState !== WS_OPEN ||
    isTabVisible() ||
    pageUnloading ||
    channels.size === 0
  ) {
    return;
  }
  const now = Date.now();
  const quietMs = now - (lastFrameAt ?? openedAt ?? now);
  const neededMs = backgroundParkQuietMs(now);
  if (quietMs < neededMs) {
    parkTimer = setTimeout(scheduleBackgroundPark, neededMs - quietMs);
    return;
  }
  sharedWs = null;
  pendingHandshake = null;
  refreshHandshakeDeadline();
  openedAt = null;
  lastFrameAt = null;
  reconnectAttempts = 0;
  reconnectPaused = false;
  try {
    ws.close(BACKGROUND_PARK_CLOSE_CODE, BACKGROUND_PARK_CLOSE_REASON);
  } catch {
    /* already closing */
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
    pageUnloading ||
    typeof WebSocket === "undefined" ||
    sharedWs?.readyState === WS_OPEN ||
    sharedWs?.readyState === WS_CONNECTING
  ) {
    return;
  }

  clearReconnectTimer();

  const protocol = getCurrentProtocol() === "https:" ? "wss:" : "ws:";
  const requestId = mintRequestId();
  const retry = pendingDrop === null ? "" : "&retry=1";
  const restart =
    pendingDrop?.code === WS_SERVICE_RESTART_CODE ? "&restart=1" : "";
  const url = `${protocol}//${getCurrentHost()}/ws?requestId=${requestId}${retry}${restart}`;

  lastLogger = logger;
  ensureLivenessTimer();
  const connectStartedAt = Date.now();
  const handshakeContext = readHandshakeContext();
  const ws = new WebSocket(url);
  sharedWs = ws;
  pendingHandshake = {
    requestId,
    startedAt: connectStartedAt,
    timedOut: false,
  };
  refreshHandshakeDeadline();
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
    const timedOut = pendingHandshake?.timedOut ?? false;
    sharedWs = null;
    pendingHandshake = null;
    refreshHandshakeDeadline();
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
      lastFailedHandshakeCode = event.code;
      lastFailedHandshakeContext = { ...handshakeContext, timedOut };
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
        closedAtMs: closedAt,
        code: event.code,
        reason: event.reason.slice(0, 200),
        wasClean: event.wasClean,
        online: isOnline(),
        hiddenAtClose: !isTabVisible(),
        channelCount: channels.size,
        connectedForMs:
          socketOpenedAt === null ? null : closedAt - socketOpenedAt,
        handshakeMs: (socketOpenedAt ?? closedAt) - connectStartedAt,
        handshakeTimedOut: timedOut,
        handshakeContext,
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
        deviceSuspendedMs:
          isTabVisible() && lastLivenessTickAt !== null
            ? Math.max(0, closedAt - lastLivenessTickAt - LIVENESS_TICK_MS)
            : null,
        msSinceDeviceResume:
          lastDeviceResumeAt === null ? null : closedAt - lastDeviceResumeAt,
      };
      startDropCheck(logger);
    }
    // Hidden tab and the socket carried no live traffic (or never opened):
    // nothing in the background needs it. Wait for the tab to come back
    // instead of retrying where the browser throttles timers and the OS
    // suspends the network; the visibility handler reconnects right away and
    // the drop is reported then, with its visible downtime. An active stream
    // (recent frames) keeps retrying so a hidden tab still receives it.
    const socketActiveSince = socketLastFrameAt ?? socketOpenedAt;
    if (
      !isTabVisible() &&
      (socketActiveSince === null ||
        closedAt - socketActiveSince >= backgroundParkQuietMs(closedAt))
    ) {
      reconnectHeldForVisibility = true;
      clearReconnectTimer();
      return;
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
          lastFailedHandshakeCode,
          lastFailedHandshakeContext,
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
    // Otherwise exponential backoff: 2s, 4s, 8s, 16s, 30s after the first try.
    // Any close of a visible, online tab is retried at once too: the user is
    // looking at the page, and a cut connection (1006 from a carrier, NAT or
    // proxy) usually reconnects on the first try. pagehide cancels the retry
    // on an actual navigation.
    const fastClose =
      event.code === WS_SERVICE_RESTART_CODE || (isTabVisible() && isOnline());
    const delay =
      fastClose && reconnectAttempts === 0
        ? 100 + Math.floor(Math.random() * 400)
        : Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    reconnectAttempts++;
    scheduleReconnect(logger, delay);
  };

  ws.addEventListener("open", () => {
    if (sharedWs === ws) {
      pendingHandshake = null;
      refreshHandshakeDeadline();
      handleOpen(logger, requestId, connectStartedAt);
    }
  });
  ws.addEventListener("message", handleMessage);
  ws.addEventListener("close", handleClose);
  // onerror is followed by onclose, which triggers reconnect.
}

function refreshHandshakeDeadline(): void {
  if (handshakeTimer !== null) {
    clearTimeout(handshakeTimer);
    handshakeTimer = null;
  }
  const ws = sharedWs;
  const handshake = pendingHandshake;
  if (
    !ws ||
    !handshake ||
    handshake.timedOut ||
    !isTabVisible() ||
    !isOnline() ||
    pageUnloading
  ) {
    return;
  }
  const timeout =
    pendingDrop?.code === WS_SERVICE_RESTART_CODE &&
    failedHandshakesDuringDrop === 0
      ? FIRST_RESTART_HANDSHAKE_MS
      : HANDSHAKE_TIMEOUT_MS;
  const remaining = handshake.startedAt + timeout - Date.now();
  handshakeTimer = setTimeout(
    () => {
      handshakeTimer = null;
      if (
        sharedWs === ws &&
        ws.readyState === WS_CONNECTING &&
        isTabVisible() &&
        isOnline()
      ) {
        handshake.timedOut = true;
        ws.close(4003, "reconnect-handshake-timeout");
      }
    },
    Math.max(0, remaining),
  );
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
    clearParkTimer();
    noticeableDownMs = currentNoticeableDownMs();
    noticeableSince = null;
    if (lastLogger) {
      reportDrop(lastLogger, "pagehide");
    }
    // Close before the document is frozen or discarded. The next pageshow
    // opens a fresh socket and replays gaps from the existing channel cursors.
    const socket = sharedWs;
    sharedWs = null;
    pendingHandshake = null;
    refreshHandshakeDeadline();
    openedAt = null;
    lastFrameAt = null;
    socket?.close(1000, "pagehide");
  });
  addWindowListener("pageshow", () => {
    pageUnloading = false;
    updateDropVisibility();
    refreshHandshakeDeadline();
    resumeReconnect();
  });
  addDocumentListener("visibilitychange", () => {
    lastVisibilityChangeAt = Date.now();
    // Hidden tabs throttle timers on purpose; only a gap while visible is a
    // device suspend.
    if (lastLivenessTickAt !== null) {
      lastLivenessTickAt = lastVisibilityChangeAt;
    }
    updateDropVisibility();
    refreshHandshakeDeadline();
    if (isTabVisible()) {
      clearParkTimer();
      resumeReconnect();
    } else {
      scheduleBackgroundPark();
    }
  });
  addWindowListener("online", () => {
    lastNetworkChangeAt = Date.now();
    updateDropVisibility();
    refreshHandshakeDeadline();
    resumeReconnect();
  });
  addWindowListener("offline", () => {
    lastNetworkChangeAt = Date.now();
    updateDropVisibility();
    refreshHandshakeDeadline();
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
    sharedWs.readyState === WS_CLOSED ||
    sharedWs.readyState === WS_CLOSING
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
  lastPreWarmAt = Date.now();
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
 * gap-free stream). Without a socket (parked in the background, or between
 * retries) the next socket already carries the new cookies: only mark the
 * channels so it defers the pre-switch ones the same way.
 */
export function reconnectForIdentityChange(logger: EndpointLogger): void {
  const old = sharedWs;
  if (!old) {
    for (const state of channels.values()) {
      state.identityStale = true;
    }
    return;
  }
  sharedWs = null;
  pendingHandshake = null;
  refreshHandshakeDeadline();
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
