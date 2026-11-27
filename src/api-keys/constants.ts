import { V1_API_PATH_REGEX } from "next-vibe/platforms/web/middleware/utils";

/** Public docs path (relative to /<locale>). */
export const API_DOCS_PATH = "docs/api" as const;

/** Account page where users manage their keys (relative to /<locale>). */
export const API_KEYS_PAGE_PATH = "user/api-keys" as const;

export const API_KEYS_ALIAS = "api-keys" as const;

/** Every key starts with this - lets auth reject non-key bearers cheaply. */
export const API_KEY_PREFIX = "sk-unb-" as const;

/** Characters of the key kept in plaintext for display (prefix + a few chars). */
export const API_KEY_DISPLAY_LENGTH = 14;

/**
 * Default per-key burst ceiling (requests per minute). Paying accounts have no
 * fixed low rate limit; credit billing is the natural limit. This ceiling is
 * only a high abuse guard and is configurable via API_KEY_BURST_LIMIT_PER_MINUTE.
 */
export const API_KEY_DEFAULT_BURST_LIMIT_PER_MINUTE = 1_200;

/** @deprecated The existing framework page still displays the default API burst ceiling. */
export const API_KEY_DEFAULT_RATE_LIMIT_PER_MINUTE =
  API_KEY_DEFAULT_BURST_LIMIT_PER_MINUTE;

/**
 * Default per-key concurrency cap (simultaneous in-flight streams). Prevents
 * runaway clients from exhausting server sockets/memory. Configurable via
 * API_KEY_MAX_CONCURRENT_STREAMS.
 */
export const API_KEY_DEFAULT_MAX_CONCURRENT_STREAMS = 50;

/** Retry-After (seconds) returned when the per-key concurrent stream cap is hit. */
export const API_KEY_CONCURRENCY_RETRY_AFTER_SECONDS = 5;

/** Fallback Retry-After (seconds) when an upstream provider 429 omits the header. */
export const API_KEY_UPSTREAM_RATE_LIMIT_RETRY_AFTER_SECONDS = 5;

/** Max active keys per user. */
export const API_KEY_MAX_ACTIVE = 20;

/** Matches the public OpenAI-compatible mount: /api/<locale>/v1/... */
export const V1_PATH_REGEX = V1_API_PATH_REGEX;
