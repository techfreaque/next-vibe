/**
 * Stateless signed email-verification tokens (HMAC-SHA256).
 * Format: base64url("<userId>.<expiresAtMs>") + "." + base64url(hmac)
 * The signature covers the CURRENT email address, so changing the email
 * invalidates old links. Verification is idempotent (flag flips once).
 *
 * Purpose "email-change" signs over the PENDING address with its own key, so a
 * change link only confirms that exact pending address and can never pass as
 * a plain verification link (or the other way round).
 */

import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import { identityEnv } from "next-vibe/identity/env";

export const VERIFY_TOKEN_TTL_DAYS = 7;
const TTL_MS = VERIFY_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

export type VerificationTokenPurpose = "verify" | "email-change";

const KEY_LABEL: Record<VerificationTokenPurpose, string> = {
  verify: "email-verify:v1",
  "email-change": "email-change:v1",
};

function sign(
  userId: string,
  email: string,
  expiresAt: number,
  purpose: VerificationTokenPurpose,
): string | null {
  const secret = identityEnv.JWT_SECRET_KEY;
  if (!secret) {
    return null;
  }
  const key = createHash("sha256")
    .update(`${KEY_LABEL[purpose]}:${secret}`)
    .digest();
  return createHmac("sha256", key)
    .update(`${userId}\n${email.toLowerCase()}\n${expiresAt}`)
    .digest("base64url");
}

export function createVerificationToken(
  userId: string,
  email: string,
  nowMs: number = Date.now(),
  purpose: VerificationTokenPurpose = "verify",
): string | null {
  const expiresAt = nowMs + TTL_MS;
  const sig = sign(userId, email, expiresAt, purpose);
  if (!sig) {
    return null;
  }
  const head = Buffer.from(`${userId}.${expiresAt}`).toString("base64url");
  return `${head}.${sig}`;
}

/** Extract the claimed userId without trusting it (needed to load the email). */
export function peekTokenUserId(token: string): string | null {
  const [head] = token.split(".");
  if (!head) {
    return null;
  }
  const decoded = Buffer.from(head, "base64url").toString("utf8");
  const dot = decoded.lastIndexOf(".");
  return dot > 0 ? decoded.slice(0, dot) : null;
}

/**
 * When the link was issued (expiry minus TTL). Only meaningful after
 * isValidVerificationToken() accepted the token.
 */
export function getTokenIssuedAt(token: string): Date | null {
  const [head] = token.split(".");
  if (!head) {
    return null;
  }
  const decoded = Buffer.from(head, "base64url").toString("utf8");
  const expiresAt = Number(decoded.slice(decoded.lastIndexOf(".") + 1));
  return Number.isFinite(expiresAt) ? new Date(expiresAt - TTL_MS) : null;
}

export function isValidVerificationToken(
  token: string,
  userId: string,
  email: string,
  nowMs: number = Date.now(),
  purpose: VerificationTokenPurpose = "verify",
): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }
  const decoded = Buffer.from(parts[0]!, "base64url").toString("utf8");
  const dot = decoded.lastIndexOf(".");
  if (dot <= 0 || decoded.slice(0, dot) !== userId) {
    return false;
  }
  const expiresAt = Number(decoded.slice(dot + 1));
  if (!Number.isFinite(expiresAt) || expiresAt < nowMs) {
    return false;
  }
  const expected = sign(userId, email, expiresAt, purpose);
  if (!expected) {
    return false;
  }
  const a = Buffer.from(expected);
  const b = Buffer.from(parts[1]!);
  return a.length === b.length && timingSafeEqual(a, b);
}
