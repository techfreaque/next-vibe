/**
 * Vibe Frame — Embed Script
 *
 * Standalone browser script that mounts next-vibe endpoints inside iframes
 * on any website. Zero React dependency.
 *
 * Architecture mirrors widget-engine-browser.ts + OutsideBridge:
 *  - Config signal as source of truth: mutating window.vibeFrameConfig re-syncs frames
 *  - Reactive config: updating serverUrl, theme, data re-sends to iframe
 *  - Federated: each integration can point to a different serverUrl
 *  - Full trigger system (immediate, scroll, time, exit-intent, click, hover, viewport)
 *  - Display frequency enforcement (always, session, day, week, user)
 *  - Full BRIDGE_CALL action support (cookie, storage, URL, navigation)
 *  - requestIdleCallback scheduling for iframe creation
 *  - Exponential backoff for inline container waiting
 *  - Error resilience: never throws, always degrades gracefully
 *
 * Declarative usage (script-tag):
 *   <script>
 *     window.vibeFrameConfig = {
 *       serverUrl: "https://unbottled.ai",
 *       integrations: [{ endpoint: "contact_POST", target: "#form" }],
 *     };
 *   </script>
 *   <script src="https://unbottled.ai/vibe-frame/vibe-frame.js"></script>
 *
 * Reactive update (after init):
 *   window.vibeFrameConfig.serverUrl = "https://other.com"; // re-syncs frames
 *
 * Imperative usage (still available):
 *   VibeFrame.mount({ serverUrl, endpoint, target });
 */

import type { ParentBridge } from "./bridge";
import {
  checkDisplayFrequency,
  createParentBridge,
  recordDisplay,
} from "./bridge";
import { setupTrigger } from "./triggers";
import {
  DEFAULT_SANDBOX,
  type FrameDisplayMode,
  type FrameMountConfig,
  type FrameToParentMessage,
  generateFrameId,
  type VibeFrameBatchConfig,
  type VibeFrameGlobalConfig,
  type VibeFrameInstance,
  type VibeFramePublicAPI,
  type VibeFrameSharedOptions,
} from "./types";

// ─── Frame Registry ──────────────────────────────────────────────────────────

interface ManagedFrame {
  instance: VibeFrameInstance;
  bridge: ParentBridge | null;
  container: HTMLElement;
  triggerCleanup: (() => void) | null;
  config: FrameMountConfig;
  /** Resolved display mode (may differ from config when trigger overrides) */
  display: FrameDisplayMode;
}

const frames = new Map<string, ManagedFrame>();

// ─── Config Signal ────────────────────────────────────────────────────────────
// Single source of truth. window.vibeFrameConfig is replaced with a
// getter/setter proxy backed by this value after init — mirrors widget-engine
// WidgetEnginePostInitContext.pweConfigSignal pattern.

let configSignal: VibeFrameGlobalConfig | undefined;
let configSubscribers: Array<(cfg: VibeFrameGlobalConfig) => void> = [];

function getConfig(): VibeFrameGlobalConfig | undefined {
  return configSignal;
}

function setConfig(next: VibeFrameGlobalConfig): void {
  configSignal = next;
  const subs = configSubscribers;
  for (const sub of subs) {
    sub(next);
  }
}

function subscribeConfig(fn: (cfg: VibeFrameGlobalConfig) => void): () => void {
  configSubscribers.push(fn);
  return () => {
    configSubscribers = configSubscribers.filter((s) => s !== fn);
  };
}

// ─── Global Context ───────────────────────────────────────────────────────────
// Initialization gate — prevents double-init (mirrors setGlobalContext pattern).

let initialized = false;

function initContext(cfg: VibeFrameGlobalConfig): boolean {
  if (initialized) {
    return false;
  }
  initialized = true;
  setConfig(cfg);

  // Replace window.vibeFrameConfig with a getter/setter proxy so that any
  // mutation on the host page (e.g. window.vibeFrameConfig.serverUrl = "...")
  // flows through setConfig and triggers subscribers.
  Object.defineProperty(window, "vibeFrameConfig", {
    get(): VibeFrameGlobalConfig | undefined {
      return configSignal;
    },
    set(next: VibeFrameGlobalConfig): void {
      setConfig(next);
    },
    enumerable: true,
    configurable: true,
  });

  return true;
}

// ─── Scheduling ───────────────────────────────────────────────────────────────

type IdleCb = () => void;

function scheduleIdle(fn: IdleCb): void {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(fn);
  } else {
    requestAnimationFrame(fn);
  }
}

// ─── Inline Container Wait ────────────────────────────────────────────────────

const ELEMENT_WAIT_TIMEOUT = 10_000;

async function waitForElement(selector: string): Promise<Element | null> {
  const start = Date.now();
  let delay = 50;

  while (Date.now() - start < ELEMENT_WAIT_TIMEOUT) {
    const el = document.querySelector(selector);
    if (el) {
      return el;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    });
    delay = Math.min(delay * 1.5, 500);
  }

  return null;
}

// ─── Mount ────────────────────────────────────────────────────────────────────

function mount(config: FrameMountConfig): VibeFrameInstance {
  const frameId = generateFrameId();
  const display = config.trigger?.display ?? "inline";

  // Check display frequency before doing anything
  if (!checkDisplayFrequency(frameId, config.displayFrequency)) {
    return createStubInstance(frameId);
  }

  // If trigger is set and not immediate, defer iframe creation
  if (config.trigger && config.trigger.type !== "immediate") {
    return mountWithTrigger(frameId, config, display);
  }

  return mountImmediate(frameId, config, display);
}

function mountWithTrigger(
  frameId: string,
  config: FrameMountConfig,
  display: FrameDisplayMode,
): VibeFrameInstance {
  let realInstance: VibeFrameInstance | null = null;

  const triggerCleanup = setupTrigger(config.trigger!, () => {
    if (realInstance) {
      return;
    } // Already mounted

    // Re-check frequency at trigger time
    if (!checkDisplayFrequency(frameId, config.displayFrequency)) {
      return;
    }

    scheduleIdle(() => {
      realInstance = mountImmediate(frameId, config, display);
      recordDisplay(frameId, config.displayFrequency);

      const managed = frames.get(frameId);
      if (managed) {
        managed.instance = realInstance!;
      }
    });
  });

  // Stub instance — held by host while waiting for trigger
  const iframe = document.createElement("iframe");
  const stub = createStubInstance(frameId, iframe, () => {
    triggerCleanup();
    realInstance?.destroy();
    frames.delete(frameId);
  });

  frames.set(frameId, {
    instance: stub,
    bridge: null,
    container: document.createElement("div"),
    triggerCleanup,
    config,
    display,
  });

  return stub;
}

function mountImmediate(
  frameId: string,
  config: FrameMountConfig,
  displayMode?: FrameDisplayMode,
): VibeFrameInstance {
  const display = displayMode ?? config.trigger?.display ?? "inline";
  const locale = config.locale ?? detectLocale();

  // Build iframe (src set async after config API call)
  const iframe = document.createElement("iframe");
  iframe.id = frameId;
  iframe.title = config.endpoint;
  iframe.setAttribute("sandbox", config.sandbox ?? DEFAULT_SANDBOX);
  iframe.style.cssText =
    "border:none;width:100%;height:0;overflow:hidden;transition:height 0.2s ease;";
  if (config.maxHeight) {
    iframe.style.maxHeight = `${config.maxHeight}px`;
  }

  // Container + DOM insertion (async for inline to wait for target element)
  let container: HTMLElement = document.createElement("div");
  const serverOrigin = new URL(config.serverUrl).origin;

  // Bridge — listens to vf: and BRIDGE_CALL messages from this iframe
  const bridge = createParentBridge({
    iframe,
    frameId,
    allowedOrigin: serverOrigin,
    onMessage: (msg) => handleFrameMessage(frameId, msg, config),
  });

  // Send init once loaded
  iframe.addEventListener("load", () => {
    bridge.send({
      type: "vf:init",
      frameId,
      origin: window.location.origin,
      theme: config.theme ?? "system",
      locale,
      cssVars: config.cssVars ?? {},
    });

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
    display,
  });

  // Fetch iframe URL from config API then insert into DOM.
  // The config API call uses credentials: "include" so the server reads real
  // cookies, mints an exchange token, and returns the ready-to-use URL.
  void (async (): Promise<void> => {
    const widgets = await fetchFrameConfig(
      config.serverUrl,
      locale,
      [
        {
          id: frameId,
          endpoint: config.endpoint,
          theme: config.theme,
          urlPathParams: config.urlPathParams,
          data: config.data,
          frameId,
        },
      ],
      config.leadId,
      config.authToken,
    );

    const widget = widgets[0];
    if (!widget || !frames.has(frameId)) {
      // Frame was destroyed before config returned, or API failed
      return;
    }

    iframe.src = widget.widgetUrl;

    const resolvedContainer = await insertIntoDOM(iframe, config, display);
    const managed = frames.get(frameId);
    if (managed) {
      managed.container = resolvedContainer;
    }
    container = resolvedContainer;
  })();

  return instance;
}

// ─── DOM Insertion ────────────────────────────────────────────────────────────

async function insertIntoDOM(
  iframe: HTMLIFrameElement,
  config: FrameMountConfig,
  display: FrameDisplayMode,
): Promise<HTMLElement> {
  if (display === "inline") {
    return insertInline(iframe, config);
  }
  return insertOverlay(iframe, config, display);
}

async function insertInline(
  iframe: HTMLIFrameElement,
  config: FrameMountConfig,
): Promise<HTMLElement> {
  const targetSpec = config.target;

  if (typeof targetSpec === "string") {
    const el = await waitForElement(targetSpec);
    if (!el) {
      // Fallback: attach to body so frame still mounts
      const fallback = document.createElement("div");
      document.body.appendChild(fallback);
      scheduleIdle(() => fallback.appendChild(iframe));
      return fallback;
    }
    scheduleIdle(() => el.appendChild(iframe));
    return el as HTMLElement;
  }

  scheduleIdle(() => targetSpec.appendChild(iframe));
  return targetSpec;
}

function insertOverlay(
  iframe: HTMLIFrameElement,
  config: FrameMountConfig,
  display: FrameDisplayMode,
): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className = `vf-overlay vf-overlay--${display}`;
  overlay.style.cssText =
    "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;";

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
      // Internal events — no host callback
      break;
  }
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

function destroyFrame(frameId: string): void {
  const managed = frames.get(frameId);
  if (!managed) {
    return;
  }

  managed.bridge?.destroy();
  managed.triggerCleanup?.();
  managed.instance.iframe.remove();

  if (managed.container.classList.contains("vf-overlay")) {
    managed.container.remove();
  }

  frames.delete(frameId);
}

function destroyAll(): void {
  const keys = frames.keys();
  const ids = [...keys];
  for (const frameId of ids) {
    destroyFrame(frameId);
  }
}

// ─── Config API ───────────────────────────────────────────────────────────────
// Call server's config endpoint (credentials: "include" sends real cookies).
// Server reads lead_id + auth token, mints exchange tokens, returns iframe URLs.
// No secrets ever constructed or visible client-side.

interface ConfigIntegrationRequest {
  id: string;
  endpoint?: string;
  hasRendered?: boolean;
  theme?: string;
  urlPathParams?: Record<string, string>;
  data?: Record<string, string>;
  frameId?: string;
}

interface ConfigWidgetResponse {
  frameId: string;
  widgetUrl: string;
}

interface ConfigResponse {
  widgets?: ConfigWidgetResponse[];
}

interface ConfigBody {
  integrations: ConfigIntegrationRequest[];
  leadId?: string;
  authToken?: string;
}

async function fetchFrameConfig(
  serverUrl: string,
  locale: string,
  integrations: ConfigIntegrationRequest[],
  leadId?: string,
  authToken?: string,
): Promise<ConfigWidgetResponse[]> {
  const base = serverUrl.replace(/\/$/, "");
  const url = `${base}/api/${locale}/system/unified-interface/vibe-frame/mount`;

  const body: ConfigBody = { integrations };
  if (leadId) {
    body.leadId = leadId;
  }
  if (authToken) {
    body.authToken = authToken;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // No credentials: "include" — identity comes from the body, not cookies.
      // The embed script is always cross-origin; it cannot read our domain cookies.
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as { data?: ConfigResponse };
    return json.data?.widgets ?? [];
  } catch {
    return [];
  }
}

function detectLocale(): string {
  const lang = navigator.language;
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

// ─── Stub Instance ────────────────────────────────────────────────────────────
// Returned when frame is deferred (trigger not yet fired) or frequency blocked.

function createStubInstance(
  frameId: string,
  iframe?: HTMLIFrameElement,
  onDestroy?: () => void,
): VibeFrameInstance {
  const el = iframe ?? document.createElement("iframe");
  return {
    id: frameId,
    iframe: el,
    setData: () => undefined,
    setTheme: () => undefined,
    authenticate: () => undefined,
    back: () => undefined,
    close: () => undefined,
    destroy: onDestroy ?? (() => undefined),
  };
}

// ─── Batch Mount ──────────────────────────────────────────────────────────────

function mountBatch(
  configs: VibeFrameBatchConfig[],
  shared: VibeFrameSharedOptions,
): VibeFrameInstance[] {
  return configs.map((cfg) => {
    const full: FrameMountConfig = {
      ...cfg,
      target: cfg.target ?? "body",
      serverUrl: cfg.serverUrl ?? shared.serverUrl,
      locale: cfg.locale ?? shared.locale,
      authToken: cfg.authToken ?? shared.authToken,
      leadId: cfg.leadId ?? shared.leadId,
    };
    return mount(full);
  });
}

// ─── Auto-Init from Global Config ────────────────────────────────────────────
// Reads window.vibeFrameConfig, mounts all integrations, then installs the
// getter/setter proxy so future mutations stay reactive.

function mountFromConfig(cfg: VibeFrameGlobalConfig): void {
  for (const integration of cfg.integrations ?? []) {
    const full: FrameMountConfig = {
      ...integration,
      target: integration.target ?? "body",
      serverUrl: integration.serverUrl ?? cfg.serverUrl,
      locale: integration.locale ?? cfg.locale,
      authToken: integration.authToken ?? cfg.authToken,
      leadId: integration.leadId ?? cfg.leadId,
    };
    mount(full);
  }
}

function autoInit(): void {
  const raw = window.vibeFrameConfig;
  if (!raw) {
    return;
  }

  const isFirst = initContext(raw);
  if (!isFirst) {
    return;
  }

  mountFromConfig(raw);

  // Subscribe to future config replacements (window.vibeFrameConfig = newObj)
  subscribeConfig((next) => {
    // Destroy all existing frames and re-mount from the new config
    destroyAll();
    mountFromConfig(next);
  });
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const VibeFrame: VibeFramePublicAPI = {
  /**
   * Mount frame(s).
   *
   * Single:  VibeFrame.mount({ serverUrl, endpoint, target })
   * Batch:   VibeFrame.mount([...configs], { serverUrl })
   */
  mount(
    configOrConfigs: VibeFrameBatchConfig[] | FrameMountConfig,
    shared?: VibeFrameSharedOptions,
  ): VibeFrameInstance | VibeFrameInstance[] {
    if (Array.isArray(configOrConfigs)) {
      if (!shared) {
        return [];
      }
      return mountBatch(configOrConfigs, shared);
    }
    return mount(configOrConfigs);
  },

  /** Destroy a specific frame by ID */
  destroy: destroyFrame,

  /** Destroy all mounted frames */
  destroyAll,

  /** Get a frame instance by ID */
  get(frameId: string): VibeFrameInstance | undefined {
    return frames.get(frameId)?.instance;
  },

  /** List all active frame IDs */
  list(): string[] {
    const keys = frames.keys();
    return [...keys];
  },

  version: "1.0.0",
};

// ─── Window Exposure ─────────────────────────────────────────────────────────
// Typed via `declare global { interface Window }` in types.ts — no cast needed.

if (typeof window !== "undefined") {
  window.VibeFrame = VibeFrame;

  // Auto-init: read window.vibeFrameConfig that host page set before this script.
  // If readyState is still "loading", wait for DOMContentLoaded so that target
  // elements exist in the DOM when inline frames try to mount.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    // Async/deferred script — DOM already ready
    scheduleIdle(autoInit);
  }
}

// ─── Exported for ESM package use (embed-package.ts re-exports) ──────────────
export { getConfig, subscribeConfig };
