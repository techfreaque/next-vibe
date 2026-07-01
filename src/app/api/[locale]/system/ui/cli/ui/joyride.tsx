/**
 * Joyride – CLI implementation
 * No-op stubs for react-joyride. Guided tours don't apply in terminal UI.
 */

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * No-op Joyride component for CLI - guided tours are a browser concept.
 */
export function Joyride(): null {
  return null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const ACTIONS = {
  INIT: "init",
  START: "start",
  STOP: "stop",
  RESET: "reset",
  PREV: "prev",
  NEXT: "next",
  GO: "go",
  CLOSE: "close",
  SKIP: "skip",
  UPDATE: "update",
  COMPLETE: "complete",
} as const;

export const EVENTS = {
  TOUR_START: "tour:start",
  STEP_BEFORE_HOOK: "step:before_hook",
  STEP_BEFORE: "step:before",
  SCROLL_START: "scroll:start",
  SCROLL_END: "scroll:end",
  BEACON: "beacon",
  TOOLTIP: "tooltip",
  STEP_AFTER: "step:after",
  STEP_AFTER_HOOK: "step:after_hook",
  TOUR_END: "tour:end",
  TOUR_STATUS: "tour:status",
  TARGET_NOT_FOUND: "error:target_not_found",
  ERROR: "error",
} as const;

export const STATUS = {
  IDLE: "idle",
  READY: "ready",
  WAITING: "waiting",
  RUNNING: "running",
  PAUSED: "paused",
  SKIPPED: "skipped",
  FINISHED: "finished",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Step {
  target: string;
  content: React.ReactNode;
  title?: React.ReactNode;
  placement?: string;
  disableBeacon?: boolean;
  disableOverlay?: boolean;
  skipBeacon?: boolean;
  blockTargetInteraction?: boolean;
  event?: string;
  offset?: number;
  spotlightClicks?: boolean;
  spotlightPadding?: number;
  styles?: Record<string, string | number>;
}

export interface EventData {
  action: string;
  controlled: boolean;
  index: number;
  lifecycle: string;
  size: number;
  status: string;
  step: Step;
  type: string;
}
