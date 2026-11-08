export const CHAT_MODERATION_ALIAS = "chat-moderation" as const;
export const THREAD_REPORT_ALIAS = "thread-report" as const;

/**
 * Auto-hide threshold: distinct open reporters >= this -> UNDER_REVIEW.
 * Same value and meaning as SKILL_AUTO_HIDE_REPORT_THRESHOLD.
 */
export const THREAD_AUTO_HIDE_REPORT_THRESHOLD = 5;
/**
 * Severe reports (CSAM_FLAG, ILLEGAL) hide faster: this many distinct open
 * reporters with a severe reason -> UNDER_REVIEW.
 */
export const THREAD_AUTO_HIDE_SEVERE_THRESHOLD = 2;

/** Report rate limits (rolling window). IPs are hashed, never stored raw. */
export const THREAD_REPORT_WINDOW_MS = 60 * 60 * 1000;
export const THREAD_REPORT_MAX_PER_LEAD = 10;
export const THREAD_REPORT_MAX_PER_IP = 20;
