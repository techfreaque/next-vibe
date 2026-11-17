export const PUBLIC_FEED_ALIAS = "forum-threads" as const;
export const FORUM_POST_ALIAS = "forum-post" as const;

/**
 * Forum posting guard rails (forum-post). One account may publish at most this
 * many AI posts in the public forum per rolling hour, whatever calls it.
 */
export const FORUM_POST_MAX_PER_HOUR = 6;
