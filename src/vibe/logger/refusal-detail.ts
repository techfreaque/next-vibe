/**
 * Metadata key for the per-occurrence detail of a business refusal (out of
 * credits, daily free limit, a reply still holding the free allowance).
 *
 * One refusal is seen by several layers (credit gate, stream setup, HTTP
 * response, browser). Each layer logs the refusal CLASS at the top level
 * (error key, gate kind, actor) and puts what differs per occurrence (model,
 * thread, translated message, amounts) under this key. The key is left out of
 * every fingerprint (server and client), so a class is one error_logs row with
 * an occurrence count instead of one row per model x message x folder. The row
 * still stores the latest detail.
 */
export const REFUSAL_DETAIL_LOG_KEY = "refusalDetail";
