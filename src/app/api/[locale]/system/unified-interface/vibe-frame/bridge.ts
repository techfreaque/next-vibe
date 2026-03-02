/**
 * Vibe Frame — Bridge
 *
 * Type-safe postMessage bridge between parent page and iframe.
 * Adapted from partner-widget-everywhere bridge pattern.
 * Works for both browser iframes and native WebViews.
 */

import {
  BRIDGE_PREFIX,
  type BridgeMessage,
  type FrameToParentMessage,
  type ParentToFrameMessage,
} from "./types";

// ─── Validation ──────────────────────────────────────────────────────────────

/** Check if a MessageEvent contains a valid vibe-frame bridge message */
function isVibeFrameMessage(
  event: MessageEvent,
): event is MessageEvent<BridgeMessage> {
  const data = event.data as BridgeMessage | null;
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    typeof data.type === "string" &&
    data.type.startsWith(BRIDGE_PREFIX)
  );
}

/** Check if a message is from parent (has no frameId = parent-to-frame) */
export function isParentMessage(
  msg: BridgeMessage,
): msg is ParentToFrameMessage {
  return !("frameId" in msg);
}

/** Check if a message is from iframe (has frameId = frame-to-parent) */
export function isFrameMessage(
  msg: BridgeMessage,
): msg is FrameToParentMessage {
  return "frameId" in msg;
}

// ─── Parent-Side Bridge ──────────────────────────────────────────────────────
// Used by the host page to communicate with the iframe

export interface ParentBridge {
  /** Send a message to the iframe */
  send: (message: ParentToFrameMessage) => void;
  /** Destroy the bridge and stop listening */
  destroy: () => void;
}

/**
 * Create a parent-side bridge that listens to messages from a specific iframe.
 * Validates message origin and frameId before dispatching.
 */
export function createParentBridge(options: {
  iframe: HTMLIFrameElement;
  frameId: string;
  allowedOrigin: string;
  onMessage: (message: FrameToParentMessage) => void;
}): ParentBridge {
  const { iframe, frameId, allowedOrigin, onMessage } = options;

  function handleMessage(event: MessageEvent): void {
    // Validate origin (allow same-origin or specific origin)
    if (allowedOrigin !== "*" && event.origin !== allowedOrigin) {
      return;
    }

    if (!isVibeFrameMessage(event)) {
      return;
    }

    const msg = event.data;

    // Only handle frame-to-parent messages with matching frameId
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

// ─── Frame-Side Bridge ───────────────────────────────────────────────────────
// Used inside the iframe to communicate with the parent

export interface FrameBridge {
  /** Send a message to the parent */
  send: (message: FrameToParentMessage) => void;
  /** Destroy the bridge and stop listening */
  destroy: () => void;
}

/**
 * Create a frame-side bridge that listens to messages from the parent.
 * Used inside the iframe's hydration script.
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

    // Only handle parent-to-frame messages
    if (isParentMessage(msg)) {
      onMessage(msg);
    }
  }

  window.addEventListener("message", handleMessage);

  return {
    send(message: FrameToParentMessage): void {
      // Always send to parent, use "*" for origin since we don't know parent's origin
      window.parent.postMessage(message, "*");
    },
    destroy(): void {
      window.removeEventListener("message", handleMessage);
    },
  };
}

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Create a typed frame-to-parent message with frameId pre-filled */
export function frameMessage<T extends FrameToParentMessage["type"]>(
  frameId: string,
  type: T,
  payload: Omit<Extract<FrameToParentMessage, { type: T }>, "type" | "frameId">,
): Extract<FrameToParentMessage, { type: T }> {
  return { type, frameId, ...payload } as Extract<
    FrameToParentMessage,
    { type: T }
  >;
}
