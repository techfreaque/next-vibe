/**
 * Request body size limit.
 *
 * Next.js buffers every request body through the proxy (src/proxy.ts) and
 * TRUNCATES anything above `proxyClientMaxBodySize` (next.config.ts imports
 * this constant). A truncated multipart body fails `request.formData()`, the
 * handler then validates `{}` and the user gets "rootFolderId: Invalid
 * option ... threadId: expected string" for what was really a 47 MB upload
 * (prod 2026-11-18). Clients check attachments against this before sending,
 * the server answers an oversized Content-Length with a clear error.
 *
 * Kept dependency-free: next.config.ts loads it at build time.
 */
export const MAX_REQUEST_BODY_BYTES = 30 * 1024 * 1024;

/** Room left for the JSON fields and multipart framing next to the files. */
const BODY_OVERHEAD_BYTES = 512 * 1024;

/** Largest total of file bytes one request may carry. */
export const MAX_UPLOAD_BYTES = MAX_REQUEST_BODY_BYTES - BODY_OVERHEAD_BYTES;

export function bytesToMegabytes(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

/** Limit as shown to users (whole MB). */
export const MAX_UPLOAD_MEGABYTES = String(
  Math.floor(MAX_REQUEST_BODY_BYTES / (1024 * 1024)),
);

/**
 * Total size of the files a request would upload. Returns the total when it
 * exceeds MAX_UPLOAD_BYTES, else null.
 */
export function getOversizedUploadBytes(
  files: ReadonlyArray<{ size: number } | null | undefined>,
): number | null {
  let total = 0;
  for (const file of files) {
    total += file?.size ?? 0;
  }
  return total > MAX_UPLOAD_BYTES ? total : null;
}

/**
 * True when a Content-Length header announces a body the proxy cannot pass
 * through intact.
 */
export function isContentLengthTooLarge(contentLength: string | null): boolean {
  if (!contentLength) {
    return false;
  }
  const bytes = Number(contentLength);
  return Number.isFinite(bytes) && bytes > MAX_REQUEST_BODY_BYTES;
}
