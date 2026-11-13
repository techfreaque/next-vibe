/**
 * Retention for guest media (lead-owned files from incognito chats and
 * standalone tool runs of leads that never became an account): 4 months.
 */
export const GUEST_MEDIA_RETENTION_DAYS = 120;

/** Max files deleted per run; the rest waits for the next daily run. */
export const GUEST_MEDIA_BATCH_SIZE = 1000;
