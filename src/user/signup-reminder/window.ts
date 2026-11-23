/**
 * Signup reminder timing (pure, unit tested).
 *
 * Everyone who confirmed a signup on prod did so within 12 minutes of the
 * first email (2026-11-23), and the code expires after 30 minutes. A pending
 * signup still open 2 hours after its last email was abandoned, so it gets one
 * reminder; after a day it is left alone.
 */

export const HOUR_MS = 60 * 60 * 1000;

/** Reminder goes out this long after the last confirmation email. */
export const REMINDER_DELAY_HOURS = 2;

/** Pending signups last mailed longer ago than this are never reminded. */
export const REMINDER_MAX_AGE_HOURS = 24;

/** Last-send range [sentAfter, sentBefore) that is due for a reminder at `now`. */
export function reminderDueRange(now: Date): {
  sentAfter: Date;
  sentBefore: Date;
} {
  return {
    sentAfter: new Date(now.getTime() - REMINDER_MAX_AGE_HOURS * HOUR_MS),
    sentBefore: new Date(now.getTime() - REMINDER_DELAY_HOURS * HOUR_MS),
  };
}

/** Dedupe key of the one reminder a pending signup can get. */
export function reminderDedupeKey(pendingId: string): string {
  return `reminder:${pendingId}`;
}
