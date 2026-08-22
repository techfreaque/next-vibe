/**
 * Password utility functions
 * Uses @node-rs/argon2 — Rust-based, ships prebuilt binaries for all platforms
 * (Windows/Linux/macOS), no node-gyp compilation needed.
 */

import "server-only";

import { hash, verify } from "@node-rs/argon2";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    algorithm: 2, // Argon2id
    memoryCost: 65_536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    return await verify(hashedPassword, password);
  } catch {
    return false;
  }
}
