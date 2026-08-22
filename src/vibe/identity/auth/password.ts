/**
 * Password utility functions
 * Provides secure password hashing and verification using Argon2,
 * with a pure Web Crypto PBKDF2 fallback for environments where the
 * argon2 native module is unavailable (e.g. Windows without build tools).
 */

import "server-only";

import * as argon2 from "argon2";

// Prefix that marks a PBKDF2 fallback hash so verifyPassword can detect it.
const PBKDF2_PREFIX = "$pbkdf2$";

async function pbkdf2Hash(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 310_000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const saltHex = Buffer.from(salt).toString("hex");
  const hashHex = Buffer.from(bits).toString("hex");
  return `${PBKDF2_PREFIX}${saltHex}$${hashHex}`;
}

async function pbkdf2Verify(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.slice(PBKDF2_PREFIX.length).split("$");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {return false;}
  const salt = Buffer.from(parts[0], "hex");
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 310_000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return Buffer.from(bits).toString("hex") === parts[1];
}

export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65_536,
      timeCost: 3,
      parallelism: 4,
    });
  } catch {
    // argon2 native module not available (e.g. Windows without build tools) — use PBKDF2
    return pbkdf2Hash(password);
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    if (hashedPassword.startsWith(PBKDF2_PREFIX)) {
      return pbkdf2Verify(password, hashedPassword);
    }
    return await argon2.verify(hashedPassword, password);
  } catch {
    return false;
  }
}
