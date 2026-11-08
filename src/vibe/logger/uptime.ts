/**
 * Shared elapsed-time formatter for every log timestamp (request, framework,
 * Pulse, connector). One implementation so the formats can never diverge.
 */

/** Format elapsed seconds: `1.234s` under a minute, then `1m22s`, `1h2m3s`, `1d2h3m4s`. */
export function formatElapsed(totalSec: number): string {
  if (totalSec < 60) {
    return `${totalSec.toFixed(3)}s`;
  }
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const secs = Math.floor(totalSec % 60);
  if (days > 0) {
    return `${days}d${hours}h${minutes}m${secs}s`;
  }
  if (hours > 0) {
    return `${hours}h${minutes}m${secs}s`;
  }
  return `${minutes}m${secs}s`;
}

/** Elapsed since server start (VIBE_START_TIME), falling back to process uptime. */
export function formatSinceStart(): string {
  const startTime = Number(process.env["VIBE_START_TIME"]);
  const sec = Number.isFinite(startTime)
    ? (Date.now() - startTime) / 1000
    : process.uptime();
  return formatElapsed(sec);
}
