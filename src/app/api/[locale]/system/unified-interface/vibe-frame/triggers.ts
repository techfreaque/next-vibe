/**
 * Vibe Frame — Trigger System
 *
 * Detects scroll position, time delays, exit intent, and click events.
 * Adapted from partner-widget-everywhere behavior/widget-triggers.ts.
 * Framework-agnostic — no React or Preact dependency.
 */

import type { FrameTriggerConfig } from "./types";

const SESSION_KEY_PREFIX = "vf-triggered-";

/**
 * Set up a trigger that fires a callback when the condition is met.
 * Returns a cleanup function to remove all event listeners.
 */
export function setupTrigger(
  config: FrameTriggerConfig,
  onTrigger: () => void,
): () => void {
  // Check "once" constraint
  if (config.once) {
    const key = SESSION_KEY_PREFIX + config.type;
    try {
      if (sessionStorage.getItem(key) === "1") {
        // Already triggered this session, do not fire
        return (): void => undefined;
      }
    } catch {
      // sessionStorage not available, proceed anyway
    }
  }

  const wrappedTrigger = (): void => {
    if (config.once) {
      const key = SESSION_KEY_PREFIX + config.type;
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        // Ignore storage errors
      }
    }
    onTrigger();
  };

  switch (config.type) {
    case "immediate":
      wrappedTrigger();
      return (): void => undefined;

    case "scroll":
      return scrollTrigger(config.scrollPercent ?? 50, wrappedTrigger);

    case "time":
      return timeTrigger(config.delayMs ?? 3000, wrappedTrigger);

    case "exitIntent":
      return exitIntentTrigger(wrappedTrigger);

    case "click":
      return clickTrigger(config.clickSelector ?? "", wrappedTrigger);

    default:
      wrappedTrigger();
      return (): void => undefined;
  }
}

// ─── Scroll Trigger ──────────────────────────────────────────────────────────

function scrollTrigger(percent: number, callback: () => void): () => void {
  let fired = false;

  function onScroll(): void {
    if (fired) {
      return;
    }

    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) {
      return;
    }

    const scrollPercent = (window.scrollY / scrollHeight) * 100;
    if (scrollPercent >= percent) {
      fired = true;
      callback();
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  // Check immediately in case page is already scrolled
  onScroll();

  return () => {
    window.removeEventListener("scroll", onScroll);
  };
}

// ─── Time Trigger ────────────────────────────────────────────────────────────

function timeTrigger(delayMs: number, callback: () => void): () => void {
  const timer = setTimeout(callback, delayMs);
  return () => {
    clearTimeout(timer);
  };
}

// ─── Exit Intent Trigger ─────────────────────────────────────────────────────

function exitIntentTrigger(callback: () => void): () => void {
  let fired = false;

  function onMouseLeave(event: MouseEvent): void {
    if (fired) {
      return;
    }
    // Only trigger when mouse leaves through the top of the viewport
    if (event.clientY <= 0) {
      fired = true;
      callback();
    }
  }

  document.addEventListener("mouseleave", onMouseLeave);

  return () => {
    document.removeEventListener("mouseleave", onMouseLeave);
  };
}

// ─── Click Trigger ───────────────────────────────────────────────────────────

function clickTrigger(selector: string, callback: () => void): () => void {
  if (!selector) {
    return (): void => undefined;
  }

  function onClick(event: Event): void {
    const target = event.target as Element | null;
    if (target?.closest(selector)) {
      callback();
    }
  }

  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
  };
}
