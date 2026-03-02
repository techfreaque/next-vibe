/**
 * Vibe Frame — Embed Script
 *
 * Standalone browser script (~15KB) that mounts next-vibe endpoints
 * inside iframes on any website. Zero React dependency.
 *
 * Usage on host page:
 *   <script src="https://unbottled.ai/vibe-frame.js"></script>
 *   <script>
 *     const frame = VibeFrame.mount({
 *       serverUrl: "https://unbottled.ai",
 *       endpoint: "contact_POST",
 *       target: "#my-widget",
 *     });
 *   </script>
 *
 * Adapted from partner-widget-everywhere widget-engine-browser.ts + widget-renderer.tsx.
 */

import { createParentBridge, type ParentBridge } from "./bridge";
import { setupTrigger } from "./triggers";
import {
  DEFAULT_SANDBOX,
  type FrameDisplayMode,
  type FrameMountConfig,
  type FrameToParentMessage,
  generateFrameId,
  type VibeFrameInstance,
} from "./types";

// ─── Frame Registry ──────────────────────────────────────────────────────────

const frames = new Map<string, ManagedFrame>();

interface ManagedFrame {
  instance: VibeFrameInstance;
  bridge: ParentBridge;
  container: HTMLElement;
  triggerCleanup: (() => void) | null;
  config: FrameMountConfig;
}

// ─── Mount ───────────────────────────────────────────────────────────────────

function mount(config: FrameMountConfig): VibeFrameInstance {
  const frameId = generateFrameId();

  // If trigger is set and not immediate, defer iframe creation
  if (config.trigger && config.trigger.type !== "immediate") {
    return mountWithTrigger(frameId, config);
  }

  return mountImmediate(frameId, config);
}

function mountWithTrigger(
  frameId: string,
  config: FrameMountConfig,
): VibeFrameInstance {
  // Create a placeholder instance that lazily creates the real iframe
  let realInstance: VibeFrameInstance | null = null;
  const display = config.trigger?.display ?? "inline";

  const triggerCleanup = setupTrigger(config.trigger!, () => {
    if (realInstance) {
      return;
    } // Already mounted
    realInstance = mountImmediate(frameId, config, display);
    // Update the managed frame with the real instance
    const managed = frames.get(frameId);
    if (managed) {
      managed.instance = realInstance;
    }
  });

  // Create a stub instance for the host to hold
  const iframe = document.createElement("iframe");
  const stub: VibeFrameInstance = {
    id: frameId,
    iframe,
    setData: (data) => realInstance?.setData(data),
    setTheme: (theme) => realInstance?.setTheme(theme),
    authenticate: (token) => realInstance?.authenticate(token),
    back: () => realInstance?.back(),
    close: () => realInstance?.close(),
    destroy: () => {
      triggerCleanup();
      realInstance?.destroy();
      frames.delete(frameId);
    },
  };

  frames.set(frameId, {
    instance: stub,
    bridge: { send: (): void => undefined, destroy: (): void => undefined },
    container: document.createElement("div"),
    triggerCleanup,
    config,
  });

  return stub;
}

function mountImmediate(
  frameId: string,
  config: FrameMountConfig,
  displayMode?: FrameDisplayMode,
): VibeFrameInstance {
  const display = displayMode ?? config.trigger?.display ?? "inline";

  // Build the mount URL
  const locale = config.locale ?? detectLocale();
  const mountUrl = buildMountUrl(config, frameId, locale);

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = mountUrl;
  iframe.id = frameId;
  iframe.title = "Vibe Frame";
  iframe.sandbox.value = config.sandbox ?? DEFAULT_SANDBOX;
  iframe.style.border = "none";
  iframe.style.width = "100%";
  iframe.style.height = "0";
  iframe.style.overflow = "hidden";
  iframe.style.transition = "height 0.2s ease";
  if (config.maxHeight) {
    iframe.style.maxHeight = `${config.maxHeight}px`;
  }

  // Create container + insert into DOM
  const container = createContainer(iframe, config, display);

  // Set up bridge
  const serverOrigin = new URL(config.serverUrl).origin;
  const bridge = createParentBridge({
    iframe,
    frameId,
    allowedOrigin: serverOrigin,
    onMessage: (msg) => handleFrameMessage(frameId, msg, config),
  });

  // Send init message once iframe loads
  iframe.addEventListener("load", () => {
    bridge.send({
      type: "vf:init",
      frameId,
      origin: window.location.origin,
      theme: config.theme ?? "system",
      locale,
      cssVars: config.cssVars ?? {},
    });

    // Send auth token if provided
    if (config.authToken) {
      bridge.send({ type: "vf:auth", token: config.authToken });
    }
  });

  // Build instance
  const instance: VibeFrameInstance = {
    id: frameId,
    iframe,
    setData: (data) => bridge.send({ type: "vf:data", data }),
    setTheme: (theme) => bridge.send({ type: "vf:theme", theme }),
    authenticate: (token) => bridge.send({ type: "vf:auth", token }),
    back: () => bridge.send({ type: "vf:navigate", action: "back" }),
    close: () => bridge.send({ type: "vf:navigate", action: "close" }),
    destroy: () => destroyFrame(frameId),
  };

  frames.set(frameId, {
    instance,
    bridge,
    container,
    triggerCleanup: null,
    config,
  });

  return instance;
}

// ─── Container Creation ──────────────────────────────────────────────────────

function createContainer(
  iframe: HTMLIFrameElement,
  config: FrameMountConfig,
  display: FrameDisplayMode,
): HTMLElement {
  const target = resolveTarget(config.target);

  if (display === "inline") {
    // Insert directly into target
    target.appendChild(iframe);
    return target;
  }

  // For modal/slideIn/bottomSheet — create overlay
  const overlay = document.createElement("div");
  overlay.className = `vf-overlay vf-overlay--${display}`;
  overlay.style.cssText = getOverlayStyles();

  const dialog = document.createElement("div");
  dialog.className = `vf-dialog vf-dialog--${display}`;
  dialog.style.cssText = getDialogStyles(display);

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "vf-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.style.cssText =
    "position:absolute;top:8px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:#666;z-index:1;";
  closeBtn.addEventListener("click", () => {
    overlay.remove();
    config.onClose?.();
  });

  // Backdrop click closes
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
      config.onClose?.();
    }
  });

  dialog.appendChild(closeBtn);
  dialog.appendChild(iframe);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  return overlay;
}

function resolveTarget(target: string | HTMLElement): HTMLElement {
  if (typeof target === "string") {
    const el = document.querySelector(target);
    if (!el) {
      // Return a detached div so the frame still mounts (just invisibly)
      const fallback = document.createElement("div");
      document.body.appendChild(fallback);
      return fallback;
    }
    return el as HTMLElement;
  }
  return target;
}

function getOverlayStyles(): string {
  return "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;";
}

function getDialogStyles(display: FrameDisplayMode): string {
  const base =
    "position:relative;background:white;border-radius:8px;overflow:hidden;";
  switch (display) {
    case "modal":
      return `${base}width:90%;max-width:600px;max-height:90vh;`;
    case "slideIn":
      return `${base}position:fixed;right:0;top:0;bottom:0;width:400px;max-width:90vw;border-radius:0;`;
    case "bottomSheet":
      return `${base}position:fixed;left:0;right:0;bottom:0;max-height:80vh;border-radius:12px 12px 0 0;`;
    default:
      return base;
  }
}

// ─── URL Building ────────────────────────────────────────────────────────────

function buildMountUrl(
  config: FrameMountConfig,
  frameId: string,
  locale: string,
): string {
  const base = config.serverUrl.replace(/\/$/, "");
  const url = new URL(
    `${base}/api/${locale}/system/unified-interface/vibe-frame/mount`,
  );

  url.searchParams.set("endpoint", config.endpoint);
  url.searchParams.set("frameId", frameId);

  if (config.urlPathParams) {
    url.searchParams.set("urlPathParams", JSON.stringify(config.urlPathParams));
  }
  if (config.data) {
    url.searchParams.set("data", JSON.stringify(config.data));
  }
  if (config.theme) {
    url.searchParams.set("theme", config.theme);
  }
  if (config.authToken) {
    url.searchParams.set("authToken", config.authToken);
  }

  return url.toString();
}

function detectLocale(): string {
  const lang = navigator.language;
  // Map browser locale to supported format (e.g. "en-US" -> "en-US", "de" -> "de-DE")
  if (lang.includes("-")) {
    return lang;
  }
  const regionMap: Record<string, string> = {
    en: "en-US",
    de: "de-DE",
    pl: "pl-PL",
  };
  return regionMap[lang] ?? "en-US";
}

// ─── Message Handling ────────────────────────────────────────────────────────

function handleFrameMessage(
  frameId: string,
  msg: FrameToParentMessage,
  config: FrameMountConfig,
): void {
  const managed = frames.get(frameId);

  switch (msg.type) {
    case "vf:ready":
      config.onReady?.();
      break;

    case "vf:resize":
      if (managed) {
        managed.instance.iframe.style.height = `${msg.height}px`;
      }
      break;

    case "vf:close":
      config.onClose?.();
      if (managed?.container.classList.contains("vf-overlay")) {
        managed.container.remove();
      }
      break;

    case "vf:success":
      config.onSuccess?.(msg.data);
      break;

    case "vf:error":
      config.onError?.(msg.error);
      break;

    case "vf:navigate":
      config.onNavigate?.(msg.path);
      break;

    case "vf:authRequired":
      config.onAuthRequired?.();
      break;

    case "vf:formState":
    case "vf:log":
      // Internal events, no host callback needed
      break;
  }
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

function destroyFrame(frameId: string): void {
  const managed = frames.get(frameId);
  if (!managed) {
    return;
  }

  managed.bridge.destroy();
  managed.triggerCleanup?.();
  managed.instance.iframe.remove();

  // Remove overlay container if it exists
  if (managed.container.classList.contains("vf-overlay")) {
    managed.container.remove();
  }

  frames.delete(frameId);
}

function destroyAll(): void {
  for (const frameId of frames.keys()) {
    destroyFrame(frameId);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const VibeFrame = {
  mount,
  destroy: destroyFrame,
  destroyAll,
  version: "1.0.0",
} as const;

// Auto-expose on window for script tag usage
if (typeof window !== "undefined") {
  Object.assign(window, { VibeFrame });
}
