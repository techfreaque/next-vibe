export const GUEST_MEDIA_CLEANUP_TASK_ID = "guest-media-cleanup";

/** Max files deleted per run; the rest waits for the next daily run. */
export const GUEST_MEDIA_BATCH_SIZE = 1000;

export const GUEST_MEDIA_DELETE_CHUNK = 25;
export const GUEST_MEDIA_BATCH_PAUSE_MS = 500;
