/**
 * Vibe Frame - Type Definitions
 *
 * Shared types for the vibe-frame system. Zero server dependencies.
 * Used by both the standalone embed script and the Next.js server.
 */

// ─── Mount Config ────────────────────────────────────────────────────────────
// What the host page passes to mount an endpoint

export interface FrameMountConfig {
  /** Base URL of the vibe-frame server (e.g. "https://unbottled.ai") */
  serverUrl: string;
  /** Endpoint identifier (e.g. "contact_POST", "agent_chat_threads_GET") */
  endpoint: string;
  /** Target DOM element or CSS selector for inline mounting */
  target: string | HTMLElement;
  /** Locale override (default: auto-detect from browser) */
  locale?: string;
  /** URL path params for parameterized endpoints */
  urlPathParams?: Record<string, string>;
  /** Pre-fill form data */
  data?: Record<string, string>;
  /** Auth token for authenticated endpoints (cross-origin) */
  authToken?: string;
  /**
   * Lead ID for visitor tracking (cross-origin).
   * Provided by the host page - embed script cannot read our domain cookies.
   */
  leadId?: string;
  /** Theme: "light" | "dark" | "system" */
  theme?: FrameTheme;
  /** CSS custom properties to inject for theming */
  cssVars?: Record<string, string>;
  /** Max height in px (default: unlimited, uses auto-resize) */
  maxHeight?: number;
  /** Trigger config - when/how the frame appears */
  trigger?: FrameTriggerConfig;
  /** Display frequency - how often the frame can appear */
  displayFrequency?: FrameDisplayFrequency;
  /** Iframe sandbox permissions override */
  sandbox?: string;
  /** Callback when frame is ready (hydrated and interactive) */
  onReady?: () => void;
  /** Callback when frame requests close */
  onClose?: () => void;
  /** Callback when form submission succeeds */
  onSuccess?: (data: Record<string, string>) => void;
  /** Callback when form submission fails */
  onError?: (error: FrameError) => void;
  /** Callback for navigation events inside the frame */
  onNavigate?: (path: string) => void;
  /** Callback when frame needs authentication */
  onAuthRequired?: () => void;
}

export type FrameTheme = "dark" | "light" | "system";

export type FrameDisplayFrequency =
  | "always"
  | "once-per-day"
  | "once-per-session"
  | "once-per-user"
  | "once-per-week";

export interface FrameError {
  message: string;
  errorType: string;
}

// ─── Trigger Config ──────────────────────────────────────────────────────────
// Adapted from widget-engine behavior system

export type FrameTriggerType =
  | "click"
  | "exit-intent"
  | "hover"
  | "immediate"
  | "scroll"
  | "time"
  | "viewport";

export type FrameDisplayMode = "bottomSheet" | "inline" | "modal" | "slideIn";

export interface FrameTriggerConfig {
  /** Trigger type */
  type: FrameTriggerType;
  /** For "scroll": percentage of page scrolled (0-100) */
  scrollPercent?: number;
  /** For "time": milliseconds to wait before showing */
  delayMs?: number;
  /** For "click" or "hover": CSS selector of the trigger element */
  selector?: string;
  /** For "viewport": min/max viewport width [min, max] */
  viewportWidth?: [number, number];
  /** For "viewport": min/max viewport height [min, max] */
  viewportHeight?: [number, number];
  /** For "viewport": device type filter */
  deviceType?: "desktop" | "mobile";
  /** Presentation style when triggered */
  display?: FrameDisplayMode;
}

// ─── Bridge Protocol (vf: prefix messages) ───────────────────────────────────
// Type-safe postMessage protocol between parent and iframe.
// All messages are prefixed with "vf:" to namespace.

/** Messages from parent frame to iframe */
export type ParentToFrameMessage =
  | {
      type: "vf:init";
      frameId: string;
      origin: string;
      theme: FrameTheme;
      locale: string;
      cssVars: Record<string, string>;
    }
  | { type: "vf:auth"; token: string }
  | { type: "vf:theme"; theme: FrameTheme }
  | { type: "vf:data"; data: Record<string, string> }
  | { type: "vf:navigate"; action: "back" | "close" };

/** Messages from iframe to parent frame */
export type FrameToParentMessage =
  | { type: "vf:ready"; frameId: string }
  | { type: "vf:resize"; frameId: string; height: number }
  | { type: "vf:close"; frameId: string }
  | { type: "vf:success"; frameId: string; data: Record<string, string> }
  | { type: "vf:error"; frameId: string; error: FrameError }
  | { type: "vf:navigate"; frameId: string; path: string }
  | { type: "vf:formState"; frameId: string; isSubmitting: boolean }
  | { type: "vf:authRequired"; frameId: string }
  | {
      type: "vf:log";
      frameId: string;
      level: "error" | "info" | "warn";
      message: string;
    };

/** Union of all vf: bridge messages */
export type BridgeMessage = FrameToParentMessage | ParentToFrameMessage;

// ─── Bridge Action Protocol (BRIDGE_CALL/BRIDGE_RESPONSE) ────────────────────
// Widget-engine-style request-response protocol. iFrame calls parent for
// privileged operations (cookies, storage, navigation, etc.).

export interface BridgeCall<TAction extends string, TPayload> {
  readonly type: "BRIDGE_CALL";
  readonly action: TAction;
  readonly requestId: string;
  readonly frameId: string;
  readonly payload: TPayload;
}

export interface BridgeResponse<TData> {
  readonly type: "BRIDGE_RESPONSE";
  readonly requestId: string;
  readonly success: boolean;
  readonly data?: TData;
  readonly error?: string;
}

// ─── Bridge Action Payloads ───────────────────────────────────────────────────

export interface CookieData {
  readonly name: string;
  readonly value: string;
}

export interface CookieOptions {
  readonly domain?: string;
  readonly expires?: Date;
  readonly httpOnly?: boolean;
  readonly maxAge?: number;
  readonly path?: string;
  readonly sameSite?: "lax" | "none" | "strict";
  readonly secure?: boolean;
}

export interface GetCookiePayload {
  readonly name: string;
}

export interface SetCookiePayload {
  readonly name: string;
  readonly value: string;
  readonly options?: CookieOptions;
}

export interface DeleteCookiePayload {
  readonly name: string;
  readonly options?: Pick<CookieOptions, "domain" | "path">;
}

export interface StoragePayload {
  readonly key: string;
  readonly type?: "local" | "session";
}

export interface SetStoragePayload extends StoragePayload {
  readonly value: string;
}

export interface SetUrlParamsPayload {
  readonly params: Record<string, string>;
}

export interface NavigatePayload {
  readonly url: string;
  readonly target?: string;
  readonly replace?: boolean;
}

export interface SetScrollPositionPayload {
  readonly behavior?: ScrollBehavior;
  readonly x: number;
  readonly y: number;
}

export interface TrackInteractionPayload {
  readonly data: {
    action:
      | "external-link-clicked"
      | "first-interactive"
      | "first-paint"
      | "interacted"
      | "toast-dismissed"
      | "widget-collapsed"
      | "widget-dismissed"
      | "widget-expanded";
    [key: string]: boolean | number | string;
  };
}

export interface LogMessagePayload {
  readonly data?: Record<string, boolean | number | string>;
  readonly message: string;
}

/**
 * Complete action map for type-safe bridge communication.
 * Matches widget-engine BridgeActionMap exactly.
 */
export interface BridgeActionMap {
  clearStorage: {
    payload: Pick<StoragePayload, "type">;
    response: boolean;
  };
  deleteCookie: {
    payload: DeleteCookiePayload;
    response: boolean;
  };
  getAllCookies: {
    payload: Record<string, never>;
    response: CookieData[];
  };
  getCookie: {
    payload: GetCookiePayload;
    response: string | null;
  };
  getScrollPosition: {
    payload: Record<string, never>;
    response: { x: number; y: number };
  };
  getStorage: {
    payload: StoragePayload;
    response: string | null;
  };
  getStorageKeys: {
    payload: Pick<StoragePayload, "type">;
    response: string[];
  };
  getUrl: {
    payload: Record<string, never>;
    response: string;
  };
  getUrlParams: {
    payload: Record<string, never>;
    response: Record<string, string>;
  };
  getViewportInfo: {
    payload: Record<string, never>;
    response: {
      deviceType: "desktop" | "mobile" | "tablet";
      height: number;
      scrollX: number;
      scrollY: number;
      width: number;
    };
  };
  getWindowSize: {
    payload: Record<string, never>;
    response: { height: number; width: number };
  };
  logMessage: {
    payload: LogMessagePayload;
    response: boolean;
  };
  navigate: {
    payload: NavigatePayload;
    response: boolean;
  };
  removeStorage: {
    payload: StoragePayload;
    response: boolean;
  };
  setScrollPosition: {
    payload: SetScrollPositionPayload;
    response: boolean;
  };
  setCookie: {
    payload: SetCookiePayload;
    response: boolean;
  };
  setStorage: {
    payload: SetStoragePayload;
    response: boolean;
  };
  setUrlParams: {
    payload: SetUrlParamsPayload;
    response: boolean;
  };
  trackInteraction: {
    payload: TrackInteractionPayload;
    response: boolean;
  };
}

export type BridgeAction = keyof BridgeActionMap;
export type PayloadFor<T extends BridgeAction> = BridgeActionMap[T]["payload"];
export type ResponseFor<T extends BridgeAction> =
  BridgeActionMap[T]["response"];
export type TypedBridgeCall<T extends BridgeAction> = BridgeCall<
  T,
  PayloadFor<T>
>;
export type TypedBridgeResponse<T extends BridgeAction> = BridgeResponse<
  ResponseFor<T>
>;

// ─── Frame Instance ──────────────────────────────────────────────────────────
// Returned to the host page for controlling the mounted frame

export interface VibeFrameInstance {
  /** Unique frame ID */
  readonly id: string;
  /** The iframe element */
  readonly iframe: HTMLIFrameElement;
  /** Send data to the frame (updates form fields) */
  setData: (data: Record<string, string>) => void;
  /** Update theme */
  setTheme: (theme: FrameTheme) => void;
  /** Send auth token to the frame */
  authenticate: (token: string) => void;
  /** Navigate back inside the frame */
  back: () => void;
  /** Request the frame to close */
  close: () => void;
  /** Destroy the frame and clean up all resources */
  destroy: () => void;
}

// ─── Hydration Data ──────────────────────────────────────────────────────────
// Serialized into the iframe HTML for client-side hydration

export interface FrameHydrationData {
  /** Endpoint identifier */
  endpoint: string;
  /** Resolved locale */
  locale: string;
  /** URL path params */
  urlPathParams: Record<string, string>;
  /** Pre-fill data */
  data: Record<string, string>;
  /** Theme */
  theme: FrameTheme;
  /** Server URL for API calls */
  serverUrl: string;
  /** Whether endpoint requires authentication */
  requiresAuth: boolean;
  /** Frame ID for bridge communication */
  frameId: string;
}

// ─── Global Config ────────────────────────────────────────────────────────────
// Declarative pattern - host page sets window.vibeFrameConfig BEFORE the script.
// The script auto-mounts all integrations on DOMContentLoaded.
// After init, window.vibeFrameConfig is backed by a signal; mutating it triggers
// reactive re-sync of the running frames.
//
// Usage (script-tag, declarative):
//   <script>
//     window.vibeFrameConfig = {
//       serverUrl: "https://unbottled.ai",
//       locale:    "en-US",
//       integrations: [
//         { endpoint: "contact_POST", target: "#form" },
//       ],
//     };
//   </script>
//   <script src="/vibe-frame/vibe-frame.js"></script>
//
// Reactive update (after init):
//   window.vibeFrameConfig.serverUrl = "https://other.com";  // re-syncs frames
//
// Usage (ESM package, imperative):
//   import { VibeFrame } from "next-vibe/vibe-frame";
//   VibeFrame.mount({ serverUrl, endpoint, target });

/** Per-integration config - shared fields come from VibeFrameGlobalConfig */
export interface VibeFrameIntegrationConfig extends Omit<
  FrameMountConfig,
  "authToken" | "locale" | "serverUrl"
> {
  /** Override serverUrl for this integration only (federation) */
  serverUrl?: string;
  /** Override locale for this integration only */
  locale?: string;
  /** Override authToken for this integration only */
  authToken?: string;
  /** Override leadId for this integration only */
  leadId?: string;
}

/** Global config - the single source of truth, backed by a signal after init */
export interface VibeFrameGlobalConfig {
  /** Base URL of the vibe-frame server */
  serverUrl: string;
  /** Locale override (default: auto-detect from browser) */
  locale?: string;
  /** Auth token applied to all integrations unless overridden per-integration */
  authToken?: string;
  /**
   * Lead ID for visitor tracking - applied to all integrations unless overridden.
   * The host page is responsible for providing this (e.g. from their own session).
   * The embed script is always cross-origin and cannot read our domain cookies.
   */
  leadId?: string;
  /** Integrations to mount automatically on DOMContentLoaded */
  integrations: VibeFrameIntegrationConfig[];
}

// ─── Window Augmentation ─────────────────────────────────────────────────────
// Typed window properties - no casts needed anywhere in embed.ts.
// Mirrors widget-engine WidgetEngineContext pattern exactly.

declare global {
  interface Window {
    /**
     * Declarative config set by the host page before loading the script.
     * After init the property is replaced by a getter/setter backed by
     * the internal config signal, so mutations stay reactive.
     */
    vibeFrameConfig?: VibeFrameGlobalConfig;
    /**
     * The public VibeFrame API exposed for imperative use after the script loads.
     * Also available as `import { VibeFrame } from "next-vibe/vibe-frame"`.
     */
    VibeFrame?: VibeFramePublicAPI;
  }
}

/** Shape of the public VibeFrame API exposed on window */
export interface VibeFramePublicAPI {
  /** Mount a single frame or a batch of frames */
  mount(
    configOrConfigs: VibeFrameBatchConfig[] | FrameMountConfig,
    shared?: VibeFrameSharedOptions,
  ): VibeFrameInstance | VibeFrameInstance[];
  /** Destroy a specific frame by ID */
  destroy(frameId: string): void;
  /** Destroy all mounted frames */
  destroyAll(): void;
  /** Get a frame instance by ID */
  get(frameId: string): VibeFrameInstance | undefined;
  /** List all active frame IDs */
  list(): string[];
  /** Library version */
  readonly version: string;
}

// ─── Batch Mount API Types ────────────────────────────────────────────────────

/** Shared options applied to every config in a batch mount call */
export interface VibeFrameSharedOptions {
  /** Base URL of the vibe-frame server */
  serverUrl: string;
  /** Locale override (default: auto-detect) */
  locale?: string;
  /** Auth token for authenticated endpoints */
  authToken?: string;
  /** Lead ID for visitor tracking */
  leadId?: string;
}

/** Per-config overrides for batch mount - shared options fill the rest */
export type VibeFrameBatchConfig = Omit<
  FrameMountConfig,
  "authToken" | "locale" | "serverUrl"
> &
  Partial<Pick<FrameMountConfig, "authToken" | "locale" | "serverUrl">>;

// ─── Constants ───────────────────────────────────────────────────────────────

/** Default iframe sandbox permissions */
export const DEFAULT_SANDBOX =
  "allow-scripts allow-same-origin allow-forms allow-popups";

/** Bridge message prefix for validation */
export const BRIDGE_PREFIX = "vf:" as const;

/** Storage key prefix for frequency tracking */
export const FREQUENCY_KEY_PREFIX = "vf-freq-";

/** Generate a unique frame ID */
export function generateFrameId(): string {
  return `vf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Generate a unique bridge request ID */
export function generateRequestId(): string {
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Type Guards ─────────────────────────────────────────────────────────────

/** Type guard for bridge calls from iframe */
export function isBridgeCall(
  event: MessageEvent,
): event is MessageEvent<TypedBridgeCall<BridgeAction>> {
  return (
    typeof event.data === "object" &&
    event.data !== null &&
    "type" in event.data &&
    (event.data as Record<string, string>).type === "BRIDGE_CALL" &&
    "action" in event.data &&
    typeof (event.data as Record<string, string>).action === "string" &&
    "requestId" in event.data &&
    typeof (event.data as Record<string, string>).requestId === "string"
  );
}

/** Type guard for bridge responses from parent */
export function isBridgeResponse(
  data: MessageEvent["data"],
): data is BridgeResponse<Record<string, never>> {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as Record<string, boolean | string>).type === "BRIDGE_RESPONSE" &&
    "requestId" in data &&
    typeof (data as Record<string, boolean | string>).requestId === "string" &&
    "success" in data &&
    typeof (data as Record<string, boolean | string>).success === "boolean"
  );
}

/** Check if a MessageEvent contains a valid vibe-frame vf: message */
export function isVibeFrameMessage(
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

/** Check if a message is parent-to-frame (no frameId in the type union sense) */
export function isParentMessage(
  msg: BridgeMessage,
): msg is ParentToFrameMessage {
  return !("frameId" in msg);
}

/** Check if a message is frame-to-parent */
export function isFrameMessage(
  msg: BridgeMessage,
): msg is FrameToParentMessage {
  return "frameId" in msg;
}
