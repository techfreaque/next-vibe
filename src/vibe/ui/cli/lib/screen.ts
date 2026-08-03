import type { EndpointLogger } from "../../../logger/types";

/**
 * Imperative terminal-size readers — the CLI half of `next-vibe/ui/lib/screen`.
 *
 * These are an escape hatch for call sites that are NOT React components
 * (store actions, imperative positioning), where a hook cannot be used. They
 * are non-reactive by construction: the value is read once at call time and
 * never updates on SIGWINCH.
 *
 * Inside a component use `useWindowSize()` from
 * `next-vibe/ui/hooks/use-window-size` instead — it re-renders on resize.
 */
export function getScreenWidth(_logger: EndpointLogger): number {
  void _logger;
  return process.stdout.columns ?? 80;
}

export function getScreenHeight(_logger: EndpointLogger): number {
  void _logger;
  return process.stdout.rows ?? 24;
}
