/**
 * Upstream HTTP error bodies, made readable.
 *
 * A provider behind Cloudflare answers a WAF block / challenge with a full
 * HTML page ("Attention Required! | Cloudflare", 403). Passed through as-is,
 * that page became the AI SDK error message: kilobytes of HTML in the error
 * log and in the user's error bubble, with the one useful fact (the ray id)
 * buried (prod 2026-11-17, FreedomGPT, 31 rows). Non-HTML bodies (the
 * provider's own JSON error) pass through unchanged.
 */

const HTML_BODY_PATTERN = /^\s*(<!doctype html|<html)/i;
const TITLE_PATTERN = /<title[^>]*>([^<]*)<\/title>/i;
const MAX_TEXT_BODY_CHARS = 2000;

export interface UpstreamErrorSummary {
  /** Body to hand to the AI SDK (compact JSON error for HTML pages). */
  body: string;
  /** Short human-readable cause for logs. */
  summary: string;
  /** Cloudflare ray id - quote it to the provider to get a block lifted. */
  cfRay: string | null;
  /** True when the provider's edge (not its API) answered with an HTML page. */
  isHtmlPage: boolean;
}

export function summarizeUpstreamError(
  label: string,
  status: number,
  headers: Headers,
  rawBody: string,
): UpstreamErrorSummary {
  const cfRay = headers.get("cf-ray");
  if (!HTML_BODY_PATTERN.test(rawBody)) {
    return {
      body: rawBody,
      summary: rawBody.slice(0, MAX_TEXT_BODY_CHARS),
      cfRay,
      isHtmlPage: false,
    };
  }
  const title = TITLE_PATTERN.exec(rawBody)?.[1]?.trim() || "HTML error page";
  const isCloudflareBlock = /cloudflare/i.test(title) || cfRay !== null;
  const summary = `${label} edge returned ${status} "${title}"${
    isCloudflareBlock ? " (Cloudflare block/challenge)" : ""
  }${cfRay ? `, cf-ray ${cfRay}` : ""}`;
  return {
    body: JSON.stringify({
      error: { message: summary, code: status, type: "upstream_html_error" },
    }),
    summary,
    cfRay,
    isHtmlPage: true,
  };
}

/** Response to hand back to the AI SDK in place of the failed one. */
export function upstreamErrorResponse(
  response: Response,
  error: UpstreamErrorSummary,
): Response {
  const headers = new Headers(response.headers);
  if (error.isHtmlPage) {
    headers.set("content-type", "application/json");
    headers.delete("content-length");
  }
  return new Response(error.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
