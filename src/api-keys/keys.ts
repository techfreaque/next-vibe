/**
 * API key primitives: generation, hashing, lookup, per-key rate limit.
 * Plaintext keys exist only in the create response. At rest: SHA-256 hash.
 */

import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "next-vibe/database";

import { API_KEY_DISPLAY_LENGTH, API_KEY_PREFIX } from "./constants";
import { type UserApiKey, userApiKeys } from "./db";

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

/** Active (not revoked) key for a plaintext bearer, or undefined. */
export async function findActiveKey(
  plaintext: string,
): Promise<UserApiKey | undefined> {
  if (!looksLikeApiKey(plaintext)) {
    return undefined;
  }
  const [row] = await db
    .select()
    .from(userApiKeys)
    .where(
      and(
        eq(userApiKeys.hashedKey, hashApiKey(plaintext)),
        isNull(userApiKeys.revokedAt),
      ),
    )
    .limit(1);
  return row;
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

// ── Per-key sliding-window rate limit (per process) ─────────────────────────
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

export function consumeRateLimit(
  keyId: string,
  limitPerMinute: number,
  now: number = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  const recent = (hits.get(keyId) ?? []).filter((ts) => now - ts < WINDOW_MS);
  if (recent.length >= limitPerMinute) {
    const oldest = recent[0] ?? now;
    hits.set(keyId, recent);
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

export function resetRateLimit(keyId: string): void {
  hits.delete(keyId);
}
