/**
 * Env Value Encryption
 *
 * Encrypts sensitive .env values at rest using AES-256-GCM.
 * Key stored in ~/.vibe/keys/<sha256(cwd)>.key - outside the project, never committed.
 *
 * Format: vibe:enc:<ivHex>:<tagHex>:<ctHex>
 */

import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ENC_PREFIX = "vibe:enc:";
const KEY_DIR = join(homedir(), ".vibe", "keys");

/** Returns the path to this project's key file */
export function getKeyFilePath(cwd: string): string {
  const hash = createHash("sha256").update(cwd).digest("hex").slice(0, 16);
  return join(KEY_DIR, `${hash}.key`);
}

/**
 * Loads the encryption key using priority order:
 *
 * 1. `VIBE_SECRET_KEY` env var (64-char hex) - explicit prod override (Docker/CI)
 * 2. Derive from `JWT_SECRET_KEY` via SHA256 - prod fallback, no extra config needed
 * 3. Key file at `~/.vibe/keys/<sha256(cwd)>.key` - local dev default
 *
 * Security note: derivation from JWT_SECRET_KEY protects against passive file reads
 * (backups, volume snapshots, AI file-read-only scenarios). It does NOT protect
 * against full shell access - that is an accepted tradeoff for zero-extra-config prod.
 */
export function loadOrCreateKey(cwd: string = process.cwd()): Buffer {
  // 1. Explicit override (Docker/CI/prod)
  const explicit = process.env["VIBE_SECRET_KEY"];
  if (explicit && explicit.length >= 64) {
    return Buffer.from(explicit.slice(0, 64), "hex");
  }

  // 2. Derive from JWT_SECRET_KEY (prod fallback - no extra config needed)
  const jwtKey = process.env["JWT_SECRET_KEY"];
  if (jwtKey && jwtKey.length >= 32) {
    // SHA256("vibe-env-encryption-v1:" + jwtKey) - deterministic, not reversible without JWT key
    return createHash("sha256")
      .update("vibe-env-encryption-v1:")
      .update(jwtKey)
      .digest();
  }

  // 3. Key file (local dev - ~/.vibe/keys/<hash>.key)
  const keyPath = getKeyFilePath(cwd);

  if (existsSync(keyPath)) {
    const raw = readFileSync(keyPath, "utf-8").trim();
    return Buffer.from(raw, "hex");
  }

  // Generate and persist a new key
  const key = randomBytes(32);
  if (!existsSync(KEY_DIR)) {
    mkdirSync(KEY_DIR, { recursive: true });
  }
  writeFileSync(keyPath, key.toString("hex"), {
    encoding: "utf-8",
    mode: 0o600,
  });
  try {
    chmodSync(keyPath, 0o600);
  } catch {
    // chmod may fail on some systems but the file is still created
  }
  return key;
}

/** Returns true if the value is an encrypted env blob */
export function isEncryptedValue(value: string): boolean {
  return value.startsWith(ENC_PREFIX);
}

/**
 * Encrypts a plaintext env value.
 * Returns a `vibe:enc:<ivHex>:<tagHex>:<ctHex>` string.
 */
export function encryptEnvValue(plaintext: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${ENC_PREFIX}${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts a `vibe:enc:...` env value.
 * Returns null if decryption fails (wrong key, corrupted value, etc.).
 */
export function decryptEnvValue(
  ciphertext: string,
  key: Buffer,
): string | null {
  if (!isEncryptedValue(ciphertext)) {
    return ciphertext;
  }
  const body = ciphertext.slice(ENC_PREFIX.length);
  const parts = body.split(":");
  if (parts.length !== 3) {
    return null;
  }
  const [ivHex, tagHex, encHex] = parts;
  try {
    const iv = Buffer.from(ivHex!, "hex");
    const authTag = Buffer.from(tagHex!, "hex");
    const encrypted = Buffer.from(encHex!, "hex");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    return `${decipher.update(encrypted)}${decipher.final("utf8")}`;
  } catch {
    return null;
  }
}

/**
 * Shallow-clones a process.env-like object and decrypts all `vibe:enc:*` values.
 * Values that fail to decrypt are set to undefined (treated as unset).
 * Plain values are passed through unchanged.
 */
export function decryptEnvObject(
  env: Record<string, string | undefined>,
  key: Buffer,
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(env)) {
    if (v !== undefined && isEncryptedValue(v)) {
      const decrypted = decryptEnvValue(v, key);
      if (decrypted === null) {
        // Decryption failed - treat as unset, not a crash
        process.stderr.write(
          `[vibe:env] Warning: failed to decrypt ${k} - key file may be missing or corrupted. Re-enter this value via settings.\n`,
        );
        result[k] = undefined;
      } else {
        result[k] = decrypted;
      }
    } else {
      result[k] = v;
    }
  }
  return result;
}
