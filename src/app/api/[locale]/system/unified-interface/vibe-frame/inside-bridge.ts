/**
 * Vibe Frame - Inside Bridge
 *
 * Runs inside the iframe (loaded by vibe-frame-hydrate.js or similar).
 * Provides window.bridgeCall for widget code to call privileged parent APIs:
 * cookies, storage, URL info, navigation, etc.
 *
 * Mirrors widget-engine inside-bridge-base.ts exactly.
 *
 * Usage (loaded as a script inside the iframe HTML):
 *   <script src="/vibe-frame/vibe-frame-inside-bridge.js"></script>
 *   <script>
 *     // Now available:
 *     window.bridgeCall("getCookie", { name: "session" }).then(console.log);
 *     window.bridgeCall("navigate", { url: "https://example.com" });
 *   </script>
 */

import type {
  BridgeAction,
  PayloadFor,
  ResponseFor,
  TypedBridgeCall,
  TypedBridgeResponse,
} from "./types";
import { generateRequestId, isBridgeResponse } from "./types";

// ─── Pending Request Registry ────────────────────────────────────────────────

interface PendingRequest {
  resolve: (value: ResponseFor<BridgeAction>) => void;
  reject: (reason: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
}

const pendingRequests = new Map<string, PendingRequest>();

// ─── Window Augmentation ──────────────────────────────────────────────────────

declare global {
  interface Window {
    /** Whether the inside bridge has been initialized */
    vfBridgeInitialized: boolean;
    /** Whether a successful BRIDGE_RESPONSE has been received from parent */
    vfBridgeConnected: boolean;
    /** The frame ID assigned by the parent (set by hydration script) */
    vfFrameId: string;
    /** Call a privileged parent API via postMessage request-response */
    bridgeCall: typeof bridgeCall;
    /** Shorthand for trackInteraction / logMessage actions */
    bridgeLog: typeof bridgeLog;
  }
}

window.vfBridgeInitialized = false;
window.vfBridgeConnected = false;
window.vfFrameId = window.vfFrameId || "";

// ─── Message Handler ──────────────────────────────────────────────────────────

function handleMessage(event: MessageEvent): void {
  if (!isBridgeResponse(event.data)) {
    return;
  }

  const response = event.data as TypedBridgeResponse<BridgeAction>;
  const pending = pendingRequests.get(response.requestId);

  if (!pending) {
    return;
  }

  // Mark as connected on first successful response
  if (!window.vfBridgeConnected) {
    window.vfBridgeConnected = true;
  }

  clearTimeout(pending.timeout);
  pendingRequests.delete(response.requestId);

  if (response.success && response.data !== undefined) {
    pending.resolve(response.data);
  } else {
    pending.reject(new Error(response.error || "Bridge call failed"));
  }
}

function initBridge(): void {
  if (window.vfBridgeInitialized) {
    return;
  }
  window.addEventListener("message", handleMessage);
  window.vfBridgeInitialized = true;
}

// ─── bridgeCall ───────────────────────────────────────────────────────────────

async function bridgeCall<T extends BridgeAction>(
  action: T,
  payload: PayloadFor<T>,
): Promise<ResponseFor<T>> {
  initBridge();

  return new Promise((resolve, reject) => {
    const requestId = generateRequestId();

    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId);
      window.vfBridgeConnected = false;
      reject(new Error(`Bridge timeout: ${action}`));
    }, 3000);

    pendingRequests.set(requestId, {
      resolve: resolve as (value: ResponseFor<BridgeAction>) => void,
      reject,
      timeout,
    });

    const call: TypedBridgeCall<T> = {
      type: "BRIDGE_CALL",
      action,
      requestId,
      frameId: window.vfFrameId,
      payload,
    };

    try {
      window.parent.postMessage(call, "*");
    } catch (error) {
      clearTimeout(timeout);
      pendingRequests.delete(requestId);
      reject(
        new Error(
          `Failed to send bridge call: ${error instanceof Error ? error.message : "Unknown error"}`,
        ),
      );
    }
  });
}

// ─── bridgeLog ────────────────────────────────────────────────────────────────

const bridgeLog = async <T extends "logMessage" | "trackInteraction">(
  action: T,
  payload: PayloadFor<T>,
): Promise<boolean> => bridgeCall(action, payload) as Promise<boolean>;

// ─── First Paint Tracking ────────────────────────────────────────────────────

let firstPaintTracked = false;

function trackFirstPaint(): void {
  if (firstPaintTracked) {
    return;
  }
  firstPaintTracked = true;
  void bridgeLog("trackInteraction", { data: { action: "first-paint" } });
}

// ─── Expose on Window ────────────────────────────────────────────────────────

window.bridgeCall = bridgeCall;
window.bridgeLog = bridgeLog;

// Track first paint immediately
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", trackFirstPaint);
} else {
  trackFirstPaint();
}
