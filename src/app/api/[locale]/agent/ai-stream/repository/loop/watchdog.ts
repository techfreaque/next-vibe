/**
 * Provider first-part watchdog for the StreamLoop.
 *
 * Stateless: the live timer handle lives on the StreamContext (core state);
 * these static ops arm/clear it so a per-loop instance isn't needed.
 */

import "server-only";

import type { StreamContext } from "../core/stream";

/**
 * Provider first-part watchdog: a dead provider connection (request sent, then
 * nothing - no parts, no close) would hang the stream forever. Armed when a
 * model call starts (start-step), cleared by that call's first response part.
 * Tool execution cannot trip it: the tool-call parts that precede execution
 * clear the timer, and the next arm happens only when the following model call
 * starts.
 */
export class FirstPartWatchdog {
  static readonly TIMEOUT_MS = 180_000;

  static arm(ctx: StreamContext, onTimeout: () => void): void {
    FirstPartWatchdog.clear(ctx);
    ctx.firstPartWatchdogTimer = setTimeout(
      onTimeout,
      FirstPartWatchdog.TIMEOUT_MS,
    );
  }

  static clear(ctx: StreamContext): void {
    if (ctx.firstPartWatchdogTimer) {
      clearTimeout(ctx.firstPartWatchdogTimer);
      ctx.firstPartWatchdogTimer = null;
    }
  }
}
