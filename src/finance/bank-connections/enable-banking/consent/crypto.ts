import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { loadOrCreateKey } from "next-vibe/env/env-crypto";

type KeyPurpose = "state" | "credentials";

function derive(secret: Buffer, purpose: KeyPurpose): Buffer {
  return Buffer.from(
    hkdfSync("sha256", secret, "next-vibe:enable-banking:v1", purpose, 32),
  );
}

function digestNonce(nonce: string): string {
  return createHash("sha256").update(nonce).digest("hex");
}

function stateSignature(nonce: string, secret: Buffer): Buffer {
  return createHmac("sha256", derive(secret, "state")).update(nonce).digest();
}

export function createConsentState(secret = loadOrCreateKey()): {
  state: string;
  digest: string;
} {
  const nonce = randomBytes(32).toString("base64url");
  const signature = stateSignature(nonce, secret).toString("base64url");
  return { state: `${nonce}.${signature}`, digest: digestNonce(nonce) };
}

export function verifyConsentState(
  state: string,
  secret = loadOrCreateKey(),
): string | undefined {
  const match = /^([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{43})$/u.exec(state);
  if (!match?.[1] || !match[2]) {
    return undefined;
  }
  const received = Buffer.from(match[2], "base64url");
  const expected = stateSignature(match[1], secret);
  if (
    received.length !== expected.length ||
    received.toString("base64url") !== match[2] ||
    !timingSafeEqual(received, expected)
  ) {
    return undefined;
  }
  return digestNonce(match[1]);
}

export function encryptConsentValue(
  value: string,
  binding: readonly string[],
  secret = loadOrCreateKey(),
): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    "aes-256-gcm",
    derive(secret, "credentials"),
    iv,
  );
  cipher.setAAD(Buffer.from(JSON.stringify(binding)));
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return [
    "v1",
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptConsentValue(
  value: string,
  binding: readonly string[],
  secret = loadOrCreateKey(),
): string | undefined {
  const [version, iv, authTag, encrypted, ...rest] = value.split(".");
  if (version !== "v1" || !iv || !authTag || !encrypted || rest.length) {
    return undefined;
  }
  try {
    const cipher = createDecipheriv(
      "aes-256-gcm",
      derive(secret, "credentials"),
      Buffer.from(iv, "base64url"),
    );
    cipher.setAAD(Buffer.from(JSON.stringify(binding)));
    cipher.setAuthTag(Buffer.from(authTag, "base64url"));
    return Buffer.concat([
      cipher.update(Buffer.from(encrypted, "base64url")),
      cipher.final(),
    ]).toString("utf8");
  } catch {
    return undefined;
  }
}
