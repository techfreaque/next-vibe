/**
 * Vibe Frame — React Hook for Frame-Side Bridge
 *
 * Used inside the iframe to communicate with the parent page.
 * Sets up the postMessage bridge and provides send/listen helpers.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  BridgeMessage,
  FrameToParentMessage,
  ParentToFrameMessage,
} from "./types";
import { BRIDGE_PREFIX } from "./types";

interface UseFrameBridgeReturn {
  /** Send a typed message to the parent frame */
  send: (message: FrameToParentMessage) => void;
  /** Whether the bridge has been initialized */
  ready: boolean;
  /** Last received parent message */
  lastMessage: ParentToFrameMessage | null;
}

/**
 * Hook that manages the frame-side bridge for postMessage communication.
 * Listens for parent messages and provides a send function.
 */
export function useFrameBridge(
  frameId: string,
  onMessage?: (message: ParentToFrameMessage) => void,
): UseFrameBridgeReturn {
  const [ready, setReady] = useState(false);
  const [lastMessage, setLastMessage] = useState<ParentToFrameMessage | null>(
    null,
  );
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const send = useCallback((message: FrameToParentMessage): void => {
    window.parent.postMessage(message, "*");
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent): void {
      const data = event.data as BridgeMessage | null;
      if (
        typeof data !== "object" ||
        data === null ||
        typeof data.type !== "string" ||
        !data.type.startsWith(BRIDGE_PREFIX)
      ) {
        return;
      }

      // Only handle parent-to-frame messages (no frameId field)
      if ("frameId" in data) {
        return;
      }

      const msg = data as ParentToFrameMessage;
      setLastMessage(msg);
      onMessageRef.current?.(msg);
    }

    window.addEventListener("message", handleMessage);
    setReady(true);

    // Notify parent that we're ready
    send({ type: "vf:ready", frameId });

    return (): void => {
      window.removeEventListener("message", handleMessage);
    };
  }, [frameId, send]);

  return { send, ready, lastMessage };
}
