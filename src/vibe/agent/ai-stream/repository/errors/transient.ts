/**
 * Transient upstream failure detection - ONE definition, shared by the stream
 * loop (log level) and the task retry policy (retry or not).
 *
 * Upstream capacity/availability problems (rate limit, 5xx, overload,
 * timeouts) are outside our control and usually clear on their own.
 */

export const TRANSIENT_ERROR_PATTERN =
  /\b(429|500|502|503|504|529)\b|rate.?limit|concurrent request limit|overloaded|provider_unavailable|temporarily unavailable|timed? ?out|ECONNRESET|stream failed/i;

export function isTransientErrorText(errorText: string): boolean {
  return TRANSIENT_ERROR_PATTERN.test(errorText);
}
