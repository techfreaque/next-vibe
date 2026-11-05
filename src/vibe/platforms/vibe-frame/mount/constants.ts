export const VIBE_FRAME_MOUNT_ALIAS = "vibe-frame-mount" as const;

/**
 * API path suffix (after /api/<locale>) of the mount endpoint. The embed script
 * calls it cross-origin with identity in the body, so the middleware lets it
 * through without a lead cookie.
 */
export const VIBE_FRAME_MOUNT_API_PATH =
  "/vibe/platforms/vibe-frame/mount" as const;
