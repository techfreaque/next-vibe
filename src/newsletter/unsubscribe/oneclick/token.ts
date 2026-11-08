/**
 * One-click unsubscribe token (RFC 8058).
 *
 * token = base64url(email) + "." + hex(HMAC-SHA256(JWT_SECRET_KEY, "unsubscribe:" + email))
 *
 * Stateless, unguessable without the server secret, scoped to one address and
 * valid for the lifetime of the email (no expiry - old mails must keep working).
 */

import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { coreEnv } from "next-vibe/core/env";
import { identityEnv } from "next-vibe/identity/env";

function sign(email: string): string {
  return createHmac("sha256", identityEnv.JWT_SECRET_KEY)
    .update(`unsubscribe:${email}`)
    .digest("hex");
}

export function signUnsubscribeToken(email: string): string {
  const normalized = email.trim().toLowerCase();
  return `${Buffer.from(normalized, "utf8").toString("base64url")}.${sign(normalized)}`;
}

/** Returns the email the token was issued for, or null when invalid/tampered. */
export function verifyUnsubscribeToken(token: string): string | null {
  const dot = token.indexOf(".");
  if (dot <= 0) {
    return null;
  }
  const email = Buffer.from(token.slice(0, dot), "base64url").toString("utf8");
  const sig = token.slice(dot + 1);
  const expected = sign(email);
  if (
    !email ||
    sig.length !== expected.length ||
    !timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"))
  ) {
    return null;
  }
  return email;
}

/** Absolute URL the mailbox provider POSTs to for one-click unsubscribe. */
export function buildOneClickUnsubscribeUrl(email: string): string {
  return `${coreEnv.NEXT_PUBLIC_APP_URL}/api/en-GLOBAL/newsletter/unsubscribe/oneclick/${signUnsubscribeToken(email)}`;
}
