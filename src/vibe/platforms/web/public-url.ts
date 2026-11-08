/**
 * `NEXT_PUBLIC_APP_URL` follows the port a server actually runs on. `vibe start`
 * and `vibe build` share this rule so a build bakes in the port the running
 * server ended up on.
 */

const ENV_NAME = "NEXT_PUBLIC_APP_URL";

/**
 * Point `NEXT_PUBLIC_APP_URL` at `port`.
 *
 * Only localhost / 127.0.0.1 URLs are rewritten - a production URL is left
 * untouched, as is a value that is not a URL. When the variable is unset it is
 * defaulted to `http://localhost:<port>` only if `setIfMissing` is true.
 * Child processes inherit `process.env`, so they see the patched value.
 */
export function patchPublicUrlPort(
  port: number,
  { setIfMissing }: { setIfMissing: boolean },
): void {
  const current = process.env[ENV_NAME];
  // Object.assign, not a property assignment: Next.js inlines NEXT_PUBLIC_*
  // reads at build time, which would turn the assignment into
  // `"literal string" = value` (invalid JS).
  if (!current) {
    if (setIfMissing) {
      Object.assign(process.env, {
        [ENV_NAME]: `http://localhost:${String(port)}`,
      });
    }
    return;
  }
  try {
    const parsed = new URL(current);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      parsed.port = String(port);
      Object.assign(process.env, { [ENV_NAME]: parsed.toString() });
    }
  } catch {
    // Not a valid URL - leave it as-is
  }
}
