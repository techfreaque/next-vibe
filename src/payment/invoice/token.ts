/**
 * Invoice View Token Utility
 * HMAC-SHA256 tokens for public invoice viewing links
 * These tokens are embedded in customer email links and allow unauthenticated access
 * to a specific invoice's public data.
 */

import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/_old/config/env";

/**
 * Generate a view token for a given invoiceId.
 * Token = HMAC-SHA256(JWT_SECRET_KEY, invoiceId) as hex string.
 */
export function generateInvoiceViewToken(invoiceId: string): string {
  const secret = env.JWT_SECRET_KEY;
  return createHmac("sha256", secret).update(invoiceId).digest("hex");
}

/**
 * Verify a view token for a given invoiceId.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyInvoiceViewToken(
  invoiceId: string,
  token: string,
): boolean {
  const expected = generateInvoiceViewToken(invoiceId);
  // Both must be same length for timingSafeEqual
  if (expected.length !== token.length) {
    return false;
  }
  return timingSafeEqual(
    Buffer.from(expected, "utf8"),
    Buffer.from(token, "utf8"),
  );
}
