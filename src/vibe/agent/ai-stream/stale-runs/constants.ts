/**
 * Stale-run reaper thresholds.
 *
 * LOCAL: a locally looped run whose owner stopped heartbeating for this long is
 * dead. Owners beat every minute (run-heartbeat.ts), so 10 minutes is ten
 * missed beats. A stream's own hard timeout is 15 minutes, so no live run
 * stays silent this long anyway.
 *
 * REMOTE: a thread whose loop runs on another instance (loop_instance_id set)
 * has no heartbeat here; liveness is relayed activity (thread + messages).
 * Twice the remote stream's hard timeout.
 */
export const STALE_RUN_LOCAL_THRESHOLD_MINUTES = 10;
export const STALE_RUN_REMOTE_THRESHOLD_MINUTES = 30;
export const STALE_RUN_BATCH_SIZE = 50;

/**
 * Queued messages only auto-start when the user queued one this recently. A
 * queue left behind months ago (prod had 16 messages from August) would
 * otherwise replay stale prompts back to back and bill every one of them.
 * Older queues stay queued; the next turn in that thread drains them as usual.
 */
export const STALE_RUN_QUEUED_MAX_AGE_MS = 6 * 60 * 60_000;

/** Prefix of the run id the reaper claims a stale thread with. */
export const STALE_RUN_REAPER_RUN_PREFIX = "reaper:";
