/**
 * Vibe Frame — Type Definitions
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
  /** Theme: "light" | "dark" | "system" */
  theme?: FrameTheme;
  /** CSS custom properties to inject for theming */
  cssVars?: Record<string, string>;
  /** Max height in px (default: unlimited, uses auto-resize) */
  maxHeight?: number;
  /** Trigger config — when/how the frame appears */
  trigger?: FrameTriggerConfig;
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

export type FrameTheme = "light" | "dark" | "system";

export interface FrameError {
  message: string;
  errorType: string;
}

// ─── Bridge Protocol ─────────────────────────────────────────────────────────
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
      level: "info" | "warn" | "error";
      message: string;
    };

/** Union of all bridge messages */
export type BridgeMessage = ParentToFrameMessage | FrameToParentMessage;

// ─── Trigger Config ──────────────────────────────────────────────────────────
// Adapted from widget-engine behavior system

export type FrameTriggerType =
  | "immediate"
  | "scroll"
  | "time"
  | "exitIntent"
  | "click";

export type FrameDisplayMode = "inline" | "modal" | "slideIn" | "bottomSheet";

export interface FrameTriggerConfig {
  /** Trigger type */
  type: FrameTriggerType;
  /** For "scroll": percentage of page scrolled (0-100) */
  scrollPercent?: number;
  /** For "time": milliseconds to wait before showing */
  delayMs?: number;
  /** For "click": CSS selector of the trigger element */
  clickSelector?: string;
  /** Show only once per session? (uses sessionStorage) */
  once?: boolean;
  /** Presentation style when triggered */
  display?: FrameDisplayMode;
}

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

// ─── Constants ───────────────────────────────────────────────────────────────

/** Default iframe sandbox permissions */
export const DEFAULT_SANDBOX =
  "allow-scripts allow-same-origin allow-forms allow-popups";

/** Bridge message prefix for validation */
export const BRIDGE_PREFIX = "vf:" as const;

/** Generate a unique frame ID */
export function generateFrameId(): string {
  return `vf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
