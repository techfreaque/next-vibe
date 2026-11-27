/**
 * Whop webhook signatures (Standard Webhooks).
 *
 * https://docs.whop.com/developer/guides/webhooks.md and the official SDK
 * helper (@whop/sdk 2.8.1, helpers/verifyWebhook): headers `webhook-id`,
 * `webhook-timestamp` (unix seconds), `webhook-signature` (space-separated
 * `v1,<base64>` entries). Signed content is `${id}.${timestamp}.${rawBody}`,
 * HMAC-SHA256 keyed with the LITERAL UTF-8 bytes of the whole `ws_...`
 * secret (not base64-decoded), base64 output. Timestamps more than five
 * minutes off are rejected (replay window).
 */

import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const WHOP_SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

export interface WhopSignatureHeaders {
  id: string;
  timestamp: string;
  signature: string;
}

/**
 * The webhook route passes the three headers as one string through the
 * provider interface (`verifyWebhook(body, signature)`).
 */
export function encodeWhopSignatureHeaders(
  headers: WhopSignatureHeaders,
): string {
  return JSON.stringify(headers);
}

export function decodeWhopSignatureHeaders(
  value: string,
): WhopSignatureHeaders | null {
  try {
    const parsed: { id?: string; timestamp?: string; signature?: string } =
      JSON.parse(value);
    if (
      typeof parsed.id === "string" &&
      typeof parsed.timestamp === "string" &&
      typeof parsed.signature === "string"
    ) {
      return {
        id: parsed.id,
        timestamp: parsed.timestamp,
        signature: parsed.signature,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function signWhopPayload(params: {
  secret: string;
  id: string;
  timestamp: string;
  body: string;
}): string {
  const digest = createHmac("sha256", Buffer.from(params.secret, "utf8"))
    .update(`${params.id}.${params.timestamp}.${params.body}`)
    .digest("base64");
  return `v1,${digest}`;
}

export type WhopSignatureCheck =
  | { valid: true }
  | { valid: false; reason: "timestamp" | "signature" };

export function verifyWhopSignature(params: {
  secret: string;
  headers: WhopSignatureHeaders;
  body: string;
  nowSeconds?: number;
}): WhopSignatureCheck {
  const timestamp = Number.parseInt(params.headers.timestamp, 10);
  const now = params.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (
    !Number.isFinite(timestamp) ||
    Math.abs(now - timestamp) > WHOP_SIGNATURE_TOLERANCE_SECONDS
  ) {
    return { valid: false, reason: "timestamp" };
  }
  const expected = Buffer.from(
    signWhopPayload({
      secret: params.secret,
      id: params.headers.id,
      timestamp: params.headers.timestamp,
      body: params.body,
    }),
  );
  const matches = params.headers.signature
    .split(" ")
    .filter((entry) => entry.startsWith("v1,"))
    .some((entry) => {
      const received = Buffer.from(entry);
      return (
        received.length === expected.length &&
        timingSafeEqual(received, expected)
      );
    });
  return matches ? { valid: true } : { valid: false, reason: "signature" };
}
