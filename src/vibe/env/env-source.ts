/**
 * The raw environment `defineEnv` validates against.
 *
 * This is a seam, not a wrapper. Reading `process.env` and expanding
 * `vibe:enc:*` ciphertext are two different concerns, and only the first one is
 * universal: a build that ships no env-crypto (no key file, nothing that ever
 * writes an encrypted value) has nothing to expand and should not pull the
 * crypto module onto the env path just to call it with an empty input. Keeping
 * the choice in its own module lets such a build replace this file wholesale
 * instead of editing branches inside define-env.ts.
 *
 * Computed once and reused across every defineEnv call — decryption reads the
 * project key file, and each env module would otherwise pay that read again.
 */

import { decryptEnvObject, loadOrCreateKey } from "./env-crypto";

let cachedEnv: NodeJS.ProcessEnv | undefined;

/** Process env with `vibe:enc:*` values decrypted. Memoized. */
export function getRawEnv(): NodeJS.ProcessEnv {
  if (!cachedEnv) {
    cachedEnv = decryptEnvObject(
      process.env as Record<string, string | undefined>,
      loadOrCreateKey(),
    ) as NodeJS.ProcessEnv;
  }
  return cachedEnv;
}
