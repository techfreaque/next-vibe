/**
 * TOTP (RFC 6238) + recovery-code primitives. Pure crypto, no DB.
 * - HMAC-SHA1, 6 digits, 30s step, +-1 step skew (RFC 4226 dynamic truncation)
 * - Secrets are encrypted at rest with AES-256-GCM (key derived from JWT_SECRET_KEY)
 * - Recovery codes are stored as SHA-256 hashes, shown once
 */

import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

import { identityEnv } from "next-vibe/identity/env";

export const TOTP_DIGITS = 6;
export const TOTP_STEP_SECONDS = 30;
export const TOTP_WINDOW = 1;
export const RECOVERY_CODE_COUNT = 10;

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function base32Encode(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    out += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return out;
}

export function base32Decode(input: string): Buffer {
  const clean = input.replace(/[\s=-]/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of clean) {
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) {
      continue;
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

/** 160-bit random secret, base32 (the form authenticator apps accept). */
export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

/** RFC 4226 HOTP over a counter. */
export function hotp(
  secret: Buffer,
  counter: number,
  digits = TOTP_DIGITS,
): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const binary =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);
  return (binary % 10 ** digits).toString().padStart(digits, "0");
}

export function totpAt(secretBase32: string, timeMs: number): string {
  return hotp(
    base32Decode(secretBase32),
    Math.floor(timeMs / 1000 / TOTP_STEP_SECONDS),
  );
}

function safeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Verify a user-typed code against the secret with a +-1 step window. */
export function verifyTotp(
  secretBase32: string,
  code: string,
  nowMs: number = Date.now(),
): boolean {
  const normalized = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(normalized)) {
    return false;
  }
  const secret = base32Decode(secretBase32);
  const counter = Math.floor(nowMs / 1000 / TOTP_STEP_SECONDS);
  let ok = false;
  for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
    // no early return: constant work per attempt
    if (safeEqualStr(hotp(secret, counter + i), normalized)) {
      ok = true;
    }
  }
  return ok;
}

export function buildOtpauthUri(
  secretBase32: string,
  accountEmail: string,
  issuer: string,
): string {
  const label = encodeURIComponent(`${issuer}:${accountEmail}`);
  const params = new URLSearchParams({
    secret: secretBase32,
    issuer,
    algorithm: "SHA1",
    digits: String(TOTP_DIGITS),
    period: String(TOTP_STEP_SECONDS),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

// ---------------------------------------------------------------- at-rest

function getKey(): Buffer | null {
  const raw = identityEnv.JWT_SECRET_KEY;
  if (!raw) {
    return null;
  }
  return createHash("sha256").update(`2fa-secret:v1:${raw}`).digest();
}

export function encryptSecret(plaintext: string): string | null {
  const key = getKey();
  if (!key) {
    return null;
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${enc.toString("hex")}`;
}

export function decryptSecret(ciphertext: string): string | null {
  const key = getKey();
  const parts = ciphertext.split(":");
  if (!key || parts.length !== 3) {
    return null;
  }
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(parts[0]!, "hex"),
    );
    decipher.setAuthTag(Buffer.from(parts[1]!, "hex"));
    return Buffer.concat([
      decipher.update(Buffer.from(parts[2]!, "hex")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

// --------------------------------------------------------------- recovery

/** Format XXXXX-XXXXX (no ambiguous characters). */
export function generateRecoveryCodes(count = RECOVERY_CODE_COUNT): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    let raw = "";
    for (let j = 0; j < 10; j++) {
      raw += RECOVERY_ALPHABET[randomInt(RECOVERY_ALPHABET.length)];
    }
    codes.push(`${raw.slice(0, 5)}-${raw.slice(5)}`);
  }
  return codes;
}

export function normalizeRecoveryCode(code: string): string {
  return code.replace(/[\s-]/g, "").toUpperCase();
}

export function hashRecoveryCode(code: string): string {
  return createHash("sha256")
    .update(`2fa-recovery:v1:${normalizeRecoveryCode(code)}`)
    .digest("hex");
}

export function looksLikeRecoveryCode(code: string): boolean {
  return /^[A-Z2-9]{10}$/.test(normalizeRecoveryCode(code));
}

/**
 * Check a recovery code against stored hashes.
 * Returns the remaining hashes (used one removed) or null when no match.
 */
export function consumeRecoveryCode(
  storedHashes: string[],
  code: string,
): string[] | null {
  if (!looksLikeRecoveryCode(code)) {
    return null;
  }
  const hash = hashRecoveryCode(code);
  const idx = storedHashes.findIndex((h) => safeEqualStr(h, hash));
  if (idx === -1) {
    return null;
  }
  return [...storedHashes.slice(0, idx), ...storedHashes.slice(idx + 1)];
}
