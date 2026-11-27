/**
 * API key primitives: generation, hashing, lookup, per-key rate limit.
 * Plaintext keys exist only in the create response. At rest: SHA-256 hash.
 */

import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";

import {
  API_KEY_CONCURRENCY_RETRY_AFTER_SECONDS,
  API_KEY_DISPLAY_LENGTH,
  API_KEY_PREFIX,
} from "./constants";
import { type UserApiKey, userApiKeys } from "./db";
import { apiKeysEnv } from "./env";

/** Keys are 256 bits of CSPRNG output - a fast hash is sufficient (no passwords). */
export function hashApiKey(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

export function generateApiKey(): {
  plaintext: string;
  keyPrefix: string;
  hashedKey: string;
} {
  const plaintext = `${API_KEY_PREFIX}${randomBytes(32).toString("base64url")}`;
  return {
    plaintext,
    keyPrefix: plaintext.slice(0, API_KEY_DISPLAY_LENGTH),
    hashedKey: hashApiKey(plaintext),
  };
}

export function looksLikeApiKey(token: string): boolean {
  return token.startsWith(API_KEY_PREFIX);
}

/**
 * Active (not revoked) key for a plaintext bearer, or undefined.
 * Keys of a suspended (banned or deactivated) account never resolve.
 */
export async function findActiveKey(
  plaintext: string,
): Promise<UserApiKey | undefined> {
  if (!looksLikeApiKey(plaintext)) {
    return undefined;
  }
  const [row] = await db
    .select({ key: userApiKeys })
    .from(userApiKeys)
    .innerJoin(users, eq(users.id, userApiKeys.userId))
    .where(
      and(
        eq(userApiKeys.hashedKey, hashApiKey(plaintext)),
        isNull(userApiKeys.revokedAt),
        eq(users.isBanned, false),
        eq(users.isActive, true),
      ),
    )
    .limit(1);
  return row?.key;
}

const LAST_USED_THROTTLE_MS = 60_000;
const lastTouched = new Map<string, number>();

/** Stamp lastUsedAt at most once a minute per key (no write per request). */
export async function touchKey(keyId: string): Promise<void> {
  const now = Date.now();
  const prev = lastTouched.get(keyId);
  if (prev !== undefined && now - prev < LAST_USED_THROTTLE_MS) {
    return;
  }
  lastTouched.set(keyId, now);
  await db
    .update(userApiKeys)
    .set({ lastUsedAt: new Date(now) })
    .where(eq(userApiKeys.id, keyId));
}

// ── Per-key abuse guards (per process) ──────────────────────────────────────
// Paying accounts have no fixed low per-key limit; billing (credits) is the
// natural limit. Only a high burst ceiling and a concurrent-stream cap apply
// so runaway loops cannot overload the server.
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();
const inFlightStreams = new Map<string, number>();

/**
 * Effective burst ceiling for a paying key: always at least the configured
 * abuse-guard ceiling so legacy DB rows (which defaulted to 60) are never
 * throttled at 60 req/min. An explicit higher per-key override still applies.
 */
export function effectiveBurstLimit(
  storedLimitPerMinute?: number,
  envCeiling: number = apiKeysEnv.API_KEY_BURST_LIMIT_PER_MINUTE,
): number {
  return Math.max(envCeiling, storedLimitPerMinute ?? 0);
}

export function consumeRateLimit(
  keyId: string,
  limitPerMinute: number = apiKeysEnv.API_KEY_BURST_LIMIT_PER_MINUTE,
  now: number = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  const recent = (hits.get(keyId) ?? []).filter((ts) => now - ts < WINDOW_MS);
  if (recent.length >= limitPerMinute) {
    const oldest = recent[0] ?? now;
    if (recent.length > 0) {
      hits.set(keyId, recent);
    } else {
      hits.delete(keyId);
    }
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((WINDOW_MS - (now - oldest)) / 1000),
      ),
    };
  }
  recent.push(now);
  hits.set(keyId, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}

export type StreamSlotResult =
  | { allowed: true; release: () => void }
  | { allowed: false; retryAfterSeconds: number };

/**
 * Reserves one in-flight stream slot for `keyId`. Callers MUST invoke
 * `release()` when the stream finishes, errors, or is cancelled. `release()`
 * is idempotent so calling it in both `finally` and `cancel` is safe.
 */
export function acquireStreamSlot(
  keyId: string,
  maxConcurrent: number = apiKeysEnv.API_KEY_MAX_CONCURRENT_STREAMS,
): StreamSlotResult {
  const current = inFlightStreams.get(keyId) ?? 0;
  if (current >= maxConcurrent) {
    return {
      allowed: false,
      retryAfterSeconds: API_KEY_CONCURRENCY_RETRY_AFTER_SECONDS,
    };
  }
  inFlightStreams.set(keyId, current + 1);
  let released = false;
  return {
    allowed: true,
    release: (): void => {
      if (released) {
        return;
      }
      released = true;
      const active = inFlightStreams.get(keyId) ?? 0;
      if (active <= 1) {
        inFlightStreams.delete(keyId);
      } else {
        inFlightStreams.set(keyId, active - 1);
      }
    },
  };
}

export function getActiveStreamCount(keyId: string): number {
  return inFlightStreams.get(keyId) ?? 0;
}

export function resetRateLimit(keyId?: string): void {
  if (keyId) {
    hits.delete(keyId);
    inFlightStreams.delete(keyId);
  } else {
    hits.clear();
    inFlightStreams.clear();
  }
}
