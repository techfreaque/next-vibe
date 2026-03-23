/**
 * Vibe Frame - Trigger System
 *
 * Data-driven trigger evaluation. Detects scroll, time, exit-intent, click,
 * hover, and viewport conditions. Mirrors widget-engine widget-triggers.ts.
 * Framework-agnostic - no React or Preact dependency.
 */

import type { FrameTriggerConfig } from "./types";

// ─── Trigger State ────────────────────────────────────────────────────────────

export interface TriggerState {
  scroll: number; // 0-100 scroll percentage
  time: number; // ms since page load
  clicks: number; // total click count
  moves: number; // debounced mousemove count
  keys: number; // keydown count
  exit: boolean; // mouse left viewport through top
  viewport: { w: number; h: number; mobile: boolean };
}

// ─── Shared State ─────────────────────────────────────────────────────────────
// Global state updated by event listeners, shared across all triggers.
// Using simple mutable object avoids per-trigger listener overhead.

let sharedState: TriggerState = {
  scroll: 0,
  time: 0,
  clicks: 0,
  moves: 0,
  keys: 0,
  exit: false,
  viewport: {
    w: window.innerWidth,
    h: window.innerHeight,
    mobile: window.innerWidth < 768,
  },
};

let sharedStateInitialized = false;
const startTime = Date.now();

function initSharedState(): void {
  if (sharedStateInitialized) {
    return;
  }
  sharedStateInitialized = true;

  // Scroll
  let scrollTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          sharedState = {
            ...sharedState,
            scroll: Math.round((window.scrollY / scrollHeight) * 100),
          };
        }
      }, 100);
    },
    { passive: true },
  );

  // Clicks
  window.addEventListener(
    "click",
    () => {
      sharedState = { ...sharedState, clicks: sharedState.clicks + 1 };
    },
    { passive: true },
  );

  // Mouse moves (debounced)
  let moveTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener(
    "mousemove",
    () => {
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        sharedState = { ...sharedState, moves: sharedState.moves + 1 };
      }, 50);
    },
    { passive: true },
  );

  // Keys
  window.addEventListener(
    "keydown",
    () => {
      sharedState = { ...sharedState, keys: sharedState.keys + 1 };
    },
    { passive: true },
  );

  // Exit intent - mouse leaves through top of viewport
  document.addEventListener("mouseleave", (event) => {
    if (event.clientY <= 0) {
      sharedState = { ...sharedState, exit: true };
    }
  });

  // Viewport changes
  const updateViewport = (): void => {
    sharedState = {
      ...sharedState,
      viewport: {
        w: window.innerWidth,
        h: window.innerHeight,
        mobile: window.innerWidth < 768,
      },
    };
  };
  window.addEventListener("resize", updateViewport, { passive: true });

  // Time - updated every second
  setInterval(() => {
    sharedState = { ...sharedState, time: Date.now() - startTime };
  }, 1000);
}

// ─── Trigger Setup ────────────────────────────────────────────────────────────

/**
 * Set up a trigger that fires a callback when the condition is met.
 * Returns a cleanup function to remove all event listeners.
 *
 * Mirrors widget-engine behavior/widget-triggers.ts evaluateTrigger().
 */
export function setupTrigger(
  config: FrameTriggerConfig,
  onTrigger: () => void,
): () => void {
  // Initialize shared state tracking on first trigger setup
  initSharedState();

  switch (config.type) {
    case "immediate":
      onTrigger();
      return noop;

    case "scroll":
      return scrollTrigger(config.scrollPercent ?? 50, onTrigger);

    case "time":
      return timeTrigger(config.delayMs ?? 3000, onTrigger);

    case "exit-intent":
      return exitIntentTrigger(onTrigger);

    case "click":
      return clickTrigger(config.selector ?? "", onTrigger);

    case "hover":
      return hoverTrigger(config.selector ?? "", onTrigger);

    case "viewport":
      return viewportTrigger(config, onTrigger);

    default:
      onTrigger();
      return noop;
  }
}

const noop = (): void => undefined;

// ─── Scroll Trigger ──────────────────────────────────────────────────────────

function scrollTrigger(percent: number, callback: () => void): () => void {
  let fired = false;

  function check(): void {
    if (fired) {
      return;
    }
    if (sharedState.scroll >= percent) {
      fired = true;
      callback();
    }
  }

  // Poll - relies on shared state being updated by scroll listener
  const interval = setInterval(check, 200);

  // Check immediately (page may already be scrolled)
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight > 0) {
    const current = Math.round((window.scrollY / scrollHeight) * 100);
    if (current >= percent) {
      fired = true;
      clearInterval(interval);
      callback();
      return noop;
    }
  }

  return () => clearInterval(interval);
}

// ─── Time Trigger ────────────────────────────────────────────────────────────

function timeTrigger(delayMs: number, callback: () => void): () => void {
  const timer = setTimeout(callback, delayMs);
  return () => clearTimeout(timer);
}

// ─── Exit Intent Trigger ─────────────────────────────────────────────────────

function exitIntentTrigger(callback: () => void): () => void {
  let fired = false;

  function onMouseLeave(event: MouseEvent): void {
    if (fired) {
      return;
    }
    if (event.clientY <= 0) {
      fired = true;
      callback();
    }
  }

  document.addEventListener("mouseleave", onMouseLeave);
  return () => document.removeEventListener("mouseleave", onMouseLeave);
}

// ─── Click Trigger ───────────────────────────────────────────────────────────

function clickTrigger(selector: string, callback: () => void): () => void {
  if (!selector) {
    return noop;
  }

  function onClick(event: Event): void {
    const target = event.target as Element | null;
    if (target?.closest(selector)) {
      callback();
    }
  }

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

// ─── Hover Trigger ───────────────────────────────────────────────────────────

function hoverTrigger(selector: string, callback: () => void): () => void {
  if (!selector) {
    return noop;
  }

  let fired = false;

  function onMouseEnter(event: Event): void {
    if (fired) {
      return;
    }
    const target = event.target as Element | null;
    if (target?.closest(selector)) {
      fired = true;
      callback();
    }
  }

  document.addEventListener("mouseover", onMouseEnter);
  return () => document.removeEventListener("mouseover", onMouseEnter);
}

// ─── Viewport Trigger ────────────────────────────────────────────────────────

function viewportTrigger(
  config: FrameTriggerConfig,
  callback: () => void,
): () => void {
  let fired = false;

  function check(): void {
    if (fired) {
      return;
    }
    const { w, h, mobile } = sharedState.viewport;

    const widthOk =
      !config.viewportWidth ||
      (w >= config.viewportWidth[0] && w <= config.viewportWidth[1]);

    const heightOk =
      !config.viewportHeight ||
      (h >= config.viewportHeight[0] && h <= config.viewportHeight[1]);

    const deviceOk =
      !config.deviceType ||
      (config.deviceType === "mobile" && mobile) ||
      (config.deviceType === "desktop" && !mobile);

    if (widthOk && heightOk && deviceOk) {
      fired = true;
      callback();
    }
  }

  // Check immediately + on resize
  check();
  if (fired) {
    return noop;
  }

  const handler = (): void => check();
  window.addEventListener("resize", handler, { passive: true });
  return () => window.removeEventListener("resize", handler);
}
