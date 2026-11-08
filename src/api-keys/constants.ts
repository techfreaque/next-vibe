import { V1_API_PATH_REGEX } from "next-vibe/platforms/web/middleware/utils";

export const API_KEYS_ALIAS = "api-keys" as const;

/** Every key starts with this - lets auth reject non-key bearers cheaply. */
export const API_KEY_PREFIX = "sk-unb-" as const;

/** Characters of the key kept in plaintext for display (prefix + a few chars). */
export const API_KEY_DISPLAY_LENGTH = 14;

export const API_KEY_DEFAULT_RATE_LIMIT_PER_MINUTE = 60;

/** Max active keys per user. */
export const API_KEY_MAX_ACTIVE = 20;

/** Matches the public OpenAI-compatible mount: /api/<locale>/v1/... */
export const V1_PATH_REGEX = V1_API_PATH_REGEX;
