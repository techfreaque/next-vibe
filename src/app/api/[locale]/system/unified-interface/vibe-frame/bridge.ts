/**
 * Vibe Frame — Bridge
 *
 * Type-safe postMessage communication between parent page and iframe.
 * Two protocols:
 *
 *  1. vf: messages — high-level lifecycle events (ready, resize, success, etc.)
 *     Parent → iframe: init, auth, theme, data, navigate
 *     iframe → parent: ready, resize, close, success, error, navigate, etc.
 *
 *  2. BRIDGE_CALL / BRIDGE_RESPONSE — privileged API calls from iframe to parent
 *     iframe requests cookies, storage, URL info, navigation, etc.
 *     Parent executes and sends response back to iframe.
 *
 * Mirrors the widget-engine OutsideBridge / InsideBridge architecture exactly.
 */

import type {
  BridgeAction,
  BridgeResponse,
  CookieData,
  FrameToParentMessage,
  ParentToFrameMessage,
  PayloadFor,
  ResponseFor,
  TypedBridgeCall,
  TypedBridgeResponse,
} from "./types";
import {
  FREQUENCY_KEY_PREFIX,
  isBridgeCall,
  isFrameMessage,
  isVibeFrameMessage,
} from "./types";

// ─── Action Implementations ───────────────────────────────────────────────────

function getCookieAction(payload: PayloadFor<"getCookie">): string | null {
  try {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${payload.name}=`));
    return value ? decodeURIComponent(value.split("=")[1] || "") : null;
  } catch {
    return null;
  }
}

function setCookieAction(payload: PayloadFor<"setCookie">): boolean {
  try {
    let cookieString = `${encodeURIComponent(payload.name)}=${encodeURIComponent(payload.value)}`;
    if (payload.options?.expires) {
      cookieString += `; expires=${payload.options.expires.toUTCString()}`;
    }
    if (payload.options?.maxAge) {
      cookieString += `; max-age=${payload.options.maxAge}`;
    }
    if (payload.options?.domain) {
      cookieString += `; domain=${payload.options.domain}`;
    }
    if (payload.options?.path) {
      cookieString += `; path=${payload.options.path}`;
    }
    if (payload.options?.secure) {
      cookieString += "; Secure";
    }
    if (payload.options?.httpOnly) {
      cookieString += "; HttpOnly";
    }
    if (payload.options?.sameSite) {
      cookieString += `; SameSite=${payload.options.sameSite}`;
    }
    document.cookie = cookieString;
    return true;
  } catch {
    return false;
  }
}

function deleteCookieAction(payload: PayloadFor<"deleteCookie">): boolean {
  try {
    let cookieString = `${payload.name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    if (payload.options?.domain) {
      cookieString += `; domain=${payload.options.domain}`;
    }
    if (payload.options?.path) {
      cookieString += `; path=${payload.options.path}`;
    }
    document.cookie = cookieString;
    return true;
  } catch {
    return false;
  }
}

function getAllCookiesAction(): CookieData[] {
  try {
    if (!document.cookie) {
      return [];
    }
    return document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
      .map((c) => {
        const [encodedName, ...valueParts] = c.split("=");
        return {
          name: decodeURIComponent(encodedName?.trim() || ""),
          value: decodeURIComponent(valueParts.join("=").trim()),
        };
      })
      .filter((c) => c.name.length > 0);
  } catch {
    return [];
  }
}

function getStorageAction(payload: PayloadFor<"getStorage">): string | null {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    return store.getItem(payload.key);
  } catch {
    return null;
  }
}

function setStorageAction(payload: PayloadFor<"setStorage">): boolean {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    store.setItem(payload.key, payload.value);
    return true;
  } catch {
    return false;
  }
}

function removeStorageAction(payload: PayloadFor<"removeStorage">): boolean {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    store.removeItem(payload.key);
    return true;
  } catch {
    return false;
  }
}

function clearStorageAction(payload: PayloadFor<"clearStorage">): boolean {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    store.clear();
    return true;
  } catch {
    return false;
  }
}

function getStorageKeysAction(payload: PayloadFor<"getStorageKeys">): string[] {
  try {
    const store = payload.type === "session" ? sessionStorage : localStorage;
    const keys: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k) {
        keys.push(k);
      }
    }
    return keys;
  } catch {
    return [];
  }
}

function getUrlParamsAction(): Record<string, string> {
  try {
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  } catch {
    return {};
  }
}

function setUrlParamsAction(payload: PayloadFor<"setUrlParams">): boolean {
  try {
    const url = new URL(window.location.href);
    Object.entries(payload.params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url.toString());
    return true;
  } catch {
    return false;
  }
}

function getUrlAction(): string {
  return window.location.href;
}

function navigateAction(payload: PayloadFor<"navigate">): boolean {
  try {
    if (payload.target) {
      window.open(payload.url, payload.target);
    } else if (payload.replace) {
      window.location.replace(payload.url);
    } else {
      window.location.href = payload.url;
    }
    return true;
  } catch {
    return false;
  }
}

function getWindowSizeAction(): { width: number; height: number } {
  return { width: window.innerWidth, height: window.innerHeight };
}

function getScrollPositionAction(): { x: number; y: number } {
  return { x: window.scrollX, y: window.scrollY };
}

function setScrollPositionAction(
  payload: PayloadFor<"setScrollPosition">,
): boolean {
  try {
    window.scrollTo({
      left: payload.x,
      top: payload.y,
      behavior: payload.behavior ?? "auto",
    });
    return true;
  } catch {
    return false;
  }
}

function getViewportInfoAction(): ResponseFor<"getViewportInfo"> {
  const w = window.innerWidth;
  const deviceType: "desktop" | "mobile" | "tablet" =
    w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  return {
    width: w,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    deviceType,
  };
}

function trackInteractionAction(
  payload: PayloadFor<"trackInteraction">,
): boolean {
  // Frequency key updates for first-paint / first-interactive tracking
  if (
    payload.data.action === "first-paint" ||
    payload.data.action === "first-interactive"
  ) {
    // No-op in embed context (no central widget state), iframe handles its own rendering
  }
  return true;
}

function logMessageAction(): boolean {
  // No-op: iframes send logs through this channel but embed.ts has no logger
  return true;
}

// ─── Action Dispatch Map ──────────────────────────────────────────────────────

type ActionHandler<T extends BridgeAction> = (
  payload: PayloadFor<T>,
) => ResponseFor<T>;

const actionMap: {
  [K in BridgeAction]: ActionHandler<K>;
} = {
  getCookie: getCookieAction,
  setCookie: setCookieAction,
  deleteCookie: deleteCookieAction,
  getAllCookies: getAllCookiesAction,
  getStorage: getStorageAction,
  setStorage: setStorageAction,
  removeStorage: removeStorageAction,
  clearStorage: clearStorageAction,
  getStorageKeys: getStorageKeysAction,
  getUrlParams: getUrlParamsAction,
  setUrlParams: setUrlParamsAction,
  getUrl: getUrlAction,
  navigate: navigateAction,
  getWindowSize: getWindowSizeAction,
  getScrollPosition: getScrollPositionAction,
  setScrollPosition: setScrollPositionAction,
  getViewportInfo: getViewportInfoAction,
  trackInteraction: trackInteractionAction,
  logMessage: logMessageAction as ActionHandler<"logMessage">,
};

// ─── Outside Bridge (Parent-Side) ────────────────────────────────────────────

export interface ParentBridge {
  /** Send a vf: lifecycle message to the iframe */
  send: (message: ParentToFrameMessage) => void;
  /** Destroy the bridge and stop listening */
  destroy: () => void;
}

/**
 * Create a parent-side bridge that:
 * - Listens for vf: lifecycle messages from the specific iframe
 * - Handles BRIDGE_CALL requests (cookie, storage, URL, navigation)
 * - Sends BRIDGE_RESPONSE back to the iframe's contentWindow
 *
 * Mirrors widget-engine OutsideBridge pattern.
 */
export function createParentBridge(options: {
  iframe: HTMLIFrameElement;
  frameId: string;
  allowedOrigin: string;
  onMessage: (message: FrameToParentMessage) => void;
}): ParentBridge {
  const { iframe, frameId, allowedOrigin, onMessage } = options;

  function handleMessage(event: MessageEvent): void {
    // Origin check (allow same-origin or specified origin)
    if (allowedOrigin !== "*" && event.origin !== allowedOrigin) {
      return;
    }

    // Handle BRIDGE_CALL (privileged API requests from iframe)
    if (isBridgeCall(event)) {
      handleBridgeCall(event.data, event.source);
      return;
    }

    // Handle vf: lifecycle messages
    if (!isVibeFrameMessage(event)) {
      return;
    }

    const msg = event.data;
    if (isFrameMessage(msg) && msg.frameId === frameId) {
      onMessage(msg);
    }
  }

  window.addEventListener("message", handleMessage);

  return {
    send(message: ParentToFrameMessage): void {
      const targetOrigin = allowedOrigin === "*" ? "*" : allowedOrigin;
      iframe.contentWindow?.postMessage(message, targetOrigin);
    },
    destroy(): void {
      window.removeEventListener("message", handleMessage);
    },
  };
}

/**
 * Execute a BRIDGE_CALL from an iframe and send a BRIDGE_RESPONSE back.
 */
function handleBridgeCall<T extends BridgeAction>(
  call: TypedBridgeCall<T>,
  source: MessageEventSource | null,
): void {
  const { action, requestId, payload } = call;

  let response: TypedBridgeResponse<T>;

  try {
    const handler = actionMap[action] as ActionHandler<T> | undefined;
    if (!handler) {
      response = {
        type: "BRIDGE_RESPONSE",
        requestId,
        success: false,
        error: `Unknown action: ${action}`,
      } as TypedBridgeResponse<T>;
    } else {
      const data = handler(payload);
      response = {
        type: "BRIDGE_RESPONSE",
        requestId,
        success: true,
        data,
      } as TypedBridgeResponse<T>;
    }
  } catch (error) {
    response = {
      type: "BRIDGE_RESPONSE",
      requestId,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    } as TypedBridgeResponse<T>;
  }

  sendBridgeResponse(response, source);
}

function sendBridgeResponse<T extends BridgeAction>(
  response: BridgeResponse<ResponseFor<T>>,
  target: MessageEventSource | null,
): void {
  if (target && "postMessage" in target) {
    (target as Window).postMessage(response, "*");
  }
}

// ─── Frame-Side Bridge ───────────────────────────────────────────────────────
// Used inside the iframe to communicate with the parent

export interface FrameBridge {
  /** Send a vf: lifecycle message to the parent */
  send: (message: FrameToParentMessage) => void;
  /** Destroy the bridge and stop listening */
  destroy: () => void;
}

/**
 * Create a frame-side bridge used inside the iframe's hydration script.
 */
export function createFrameBridge(options: {
  onMessage: (message: ParentToFrameMessage) => void;
}): FrameBridge {
  const { onMessage } = options;

  function handleMessage(event: MessageEvent): void {
    if (!isVibeFrameMessage(event)) {
      return;
    }

    const msg = event.data;
    // Only handle parent-to-frame messages (no frameId on parent messages)
    if (!isFrameMessage(msg)) {
      onMessage(msg as ParentToFrameMessage);
    }
  }

  window.addEventListener("message", handleMessage);

  return {
    send(message: FrameToParentMessage): void {
      window.parent.postMessage(message, "*");
    },
    destroy(): void {
      window.removeEventListener("message", handleMessage);
    },
  };
}

// ─── Display Frequency ───────────────────────────────────────────────────────

import type { FrameDisplayFrequency } from "./types";

/**
 * Check if a frame with the given ID is allowed to display based on frequency rules.
 */
export function checkDisplayFrequency(
  frameId: string,
  frequency: FrameDisplayFrequency | undefined,
): boolean {
  if (!frequency || frequency === "always") {
    return true;
  }

  const key = FREQUENCY_KEY_PREFIX + frameId;

  switch (frequency) {
    case "once-per-session": {
      try {
        return !sessionStorage.getItem(key);
      } catch {
        return true;
      }
    }
    case "once-per-user": {
      try {
        return !localStorage.getItem(key);
      } catch {
        return true;
      }
    }
    case "once-per-day": {
      try {
        const lastShown = localStorage.getItem(key);
        if (!lastShown) {
          return true;
        }
        return Date.now() - parseInt(lastShown) >= 24 * 60 * 60 * 1000;
      } catch {
        return true;
      }
    }
    case "once-per-week": {
      try {
        const lastShown = localStorage.getItem(key);
        if (!lastShown) {
          return true;
        }
        return Date.now() - parseInt(lastShown) >= 7 * 24 * 60 * 60 * 1000;
      } catch {
        return true;
      }
    }
    default:
      return true;
  }
}

/**
 * Record that a frame was displayed for frequency tracking.
 */
export function recordDisplay(
  frameId: string,
  frequency: FrameDisplayFrequency | undefined,
): void {
  if (!frequency || frequency === "always") {
    return;
  }

  const key = FREQUENCY_KEY_PREFIX + frameId;
  const now = String(Date.now());

  switch (frequency) {
    case "once-per-session":
      try {
        sessionStorage.setItem(key, now);
      } catch {
        /* ignore */
      }
      break;
    case "once-per-user":
    case "once-per-day":
    case "once-per-week":
      try {
        localStorage.setItem(key, now);
      } catch {
        /* ignore */
      }
      break;
    default:
      break;
  }
}

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Create a typed frame-to-parent message with frameId pre-filled */
export function frameMessage<T extends FrameToParentMessage["type"]>(
  frameId: string,
  type: T,
  payload: Omit<Extract<FrameToParentMessage, { type: T }>, "frameId" | "type">,
): Extract<FrameToParentMessage, { type: T }> {
  return { type, frameId, ...payload } as Extract<
    FrameToParentMessage,
    { type: T }
  >;
}
