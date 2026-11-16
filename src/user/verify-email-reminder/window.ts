/**
 * Reminder timing (pure, unit tested).
 */

/** Reminder goes out this long after signup (the copy says "yesterday") */
export const REMINDER_DELAY_HOURS = 24;

/** No reminder when the address got any mail this recently (double-run guard) */
export const RECENT_MAIL_GUARD_HOURS = 6;

export const HOUR_MS = 60 * 60 * 1000;

/**
 * Signup window [from, to) for a run at `now`: one full clock hour,
 * REMINDER_DELAY_HOURS old. Consecutive hourly runs tile the timeline, so each
 * signup lands in exactly one run.
 */
export function reminderWindow(now: Date): { from: Date; to: Date } {
  const hourStart = Math.floor(now.getTime() / HOUR_MS) * HOUR_MS;
  const to = new Date(hourStart - REMINDER_DELAY_HOURS * HOUR_MS);
  return { from: new Date(to.getTime() - HOUR_MS), to };
}
