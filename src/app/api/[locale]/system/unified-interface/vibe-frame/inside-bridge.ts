/**
 * Vibe Frame - Inside Bridge
 *
 * Runs inside the iframe (loaded by vibe-frame-hydrate.js or similar).
 * Provides globalThis.bridgeCall for widget code to call privileged parent APIs:
 * cookies, storage, URL info, navigation, etc.
 *
 * Mirrors widget-engine inside-bridge-base.ts exactly.
 *
 * Usage (loaded as a script inside the iframe HTML):
 *   <script src="/vibe-frame/vibe-frame-inside-bridge.js"></script>
 *   <script>
 *     // Now available:
 *     globalThis.bridgeCall("getCookie", { name: "session" }).then(console.log);
 *     globalThis.bridgeCall("navigate", { url: "https://example.com" });
 *   </script>
 */

import { addWindowListener, onDOMReady } from "next-vibe-ui/lib/dom";

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

// ─── Global Augmentation ──────────────────────────────────────────────────────

declare global {
  var vfBridgeInitialized: boolean;
  var vfBridgeConnected: boolean;
  var vfFrameId: string;
  var bridgeCall: typeof bridgeCallFn;
  var bridgeLog: typeof bridgeLogFn;
}

globalThis.vfBridgeInitialized = false;
globalThis.vfBridgeConnected = false;
globalThis.vfFrameId = globalThis.vfFrameId ?? "";

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
  if (!globalThis.vfBridgeConnected) {
    globalThis.vfBridgeConnected = true;
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
  if (globalThis.vfBridgeInitialized) {
    return;
  }
  addWindowListener(
    "message",
    handleMessage as (e: WindowEventMap["message"]) => void,
  );
  globalThis.vfBridgeInitialized = true;
}

// ─── bridgeCall ───────────────────────────────────────────────────────────────

async function bridgeCallFn<T extends BridgeAction>(
  action: T,
  payload: PayloadFor<T>,
): Promise<ResponseFor<T>> {
  initBridge();

  return new Promise((resolve, reject) => {
    const requestId = generateRequestId();

    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId);
      globalThis.vfBridgeConnected = false;
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
      frameId: globalThis.vfFrameId,
      payload,
    };

    try {
      parent.postMessage(call, "*");
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

const bridgeLogFn = async <T extends "logMessage" | "trackInteraction">(
  action: T,
  payload: PayloadFor<T>,
): Promise<boolean> => bridgeCallFn(action, payload) as Promise<boolean>;

// ─── First Paint Tracking ────────────────────────────────────────────────────

let firstPaintTracked = false;

function trackFirstPaint(): void {
  if (firstPaintTracked) {
    return;
  }
  firstPaintTracked = true;
  void bridgeLogFn("trackInteraction", { data: { action: "first-paint" } });
}

// ─── Expose on globalThis ────────────────────────────────────────────────────

globalThis.bridgeCall = bridgeCallFn;
globalThis.bridgeLog = bridgeLogFn;

// Track first paint - onDOMReady fires immediately if DOM ready, or on DOMContentLoaded
onDOMReady(trackFirstPaint);
