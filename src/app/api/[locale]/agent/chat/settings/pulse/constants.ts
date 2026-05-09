/** Default cron schedule for Dreaming: 2:00 AM every night */
export const DREAM_DEFAULT_SCHEDULE = "0 2 * * *";

/** Default cron schedule for Autopilot: 8:00 AM weekdays */
export const AUTOPILOT_DEFAULT_SCHEDULE = "0 8 * * 1-5";

/** Default cron schedule for Mama heartbeat: every 4 hours */
export const MAMA_DEFAULT_SCHEDULE = "0 */4 * * *";

/**
 * Get the current UTC offset in hours for an IANA timezone.
 * Positive = ahead of UTC (e.g. +2 for Europe/Warsaw), negative = behind.
 */
function getUtcOffsetHours(timezone: string): number {
  const now = new Date();
  // Format a date in the target timezone and compare to UTC
  const utcStr = now.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = now.toLocaleString("en-US", { timeZone: timezone });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return Math.round((tzDate.getTime() - utcDate.getTime()) / 3_600_000);
}

/**
 * Generate a random cron schedule for Dreaming, adjusted to the user's timezone.
 * Fires at a random minute within a random hour in the 1–4 AM local window (UTC).
 * Spreads users across the window to avoid server spikes.
 */
export function generateRandomDreamerSchedule(timezone: string): string {
  const minute = Math.floor(Math.random() * 60);
  // Local window: 1–4 AM
  const localHour = 1 + Math.floor(Math.random() * 4); // 1, 2, 3, or 4
  const utcOffset = getUtcOffsetHours(timezone);
  const utcHour = (((localHour - utcOffset) % 24) + 24) % 24;
  return `${minute} ${utcHour} * * *`;
}

/**
 * Generate a random cron schedule for Autopilot, adjusted to the user's timezone.
 * Fires at a random minute within a random hour in the 8–11 AM local window, weekdays only (UTC).
 * Spreads users across the window to avoid server spikes.
 */
export function generateRandomAutopilotSchedule(timezone: string): string {
  const minute = Math.floor(Math.random() * 60);
  // Local window: 8–11 AM
  const localHour = 8 + Math.floor(Math.random() * 4); // 8, 9, 10, or 11
  const utcOffset = getUtcOffsetHours(timezone);
  const utcHour = (((localHour - utcOffset) % 24) + 24) % 24;
  return `${minute} ${utcHour} * * 1-5`;
}
