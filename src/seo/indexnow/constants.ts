/**
 * IndexNow (https://www.indexnow.org): one ping tells Bing, Yandex, Seznam,
 * Naver and Yep that URLs are new or changed. The key is public by design:
 * it is served as a static file at /<key>.txt (public/<key>.txt) so the
 * search engines can verify the submitter owns the host.
 */

/** Ownership key. Must equal the content of `public/<key>.txt`. */
export const INDEXNOW_KEY = "01f1870b643faddd5126fee5a4771138";

/** Shared endpoint; it forwards to every participating search engine. */
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** Protocol limit per POST. */
export const INDEXNOW_MAX_URLS_PER_REQUEST = 10_000;

export const INDEXNOW_REQUEST_TIMEOUT_MS = 30_000;

/** platform_kv row holding the fingerprints of already submitted URLs. */
export const INDEXNOW_KV_KEY = "indexnow_submitted_v1";

export const INDEXNOW_CRON_ID = "indexnow-submit";
export const INDEXNOW_ALIAS = "indexnow-submit";
