/**
 * CLI cookie implementation — file-backed, one file per key.
 * Stored at ./.tmp/cookies/<key>.json relative to cwd.
 * Used for auth tokens and remote connection credentials.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";

function cookiesDir(): string {
  return join(process.cwd(), ".tmp", "cookies");
}

function keyPath(key: string): string {
  const safe = key.replace(/[^a-zA-Z0-9_\-.]/g, "_"); // eslint-disable-line i18next/no-literal-string
  return join(cookiesDir(), `${safe}.json`);
}

function ensureDir(): void {
  const dir = cookiesDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export async function getCookie(name: string): Promise<string | null> {
  try {
    const path = keyPath(name);
    if (!existsSync(path)) {
      return null;
    }
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as { value: string };
    return parsed.value;
  } catch {
    return null;
  }
}

export async function setCookie(name: string, value: string): Promise<void> {
  try {
    ensureDir();
    writeFileSync(keyPath(name), JSON.stringify({ value }), "utf-8");
  } catch {
    // Silent
  }
}

export async function deleteCookie(name: string): Promise<void> {
  try {
    const path = keyPath(name);
    if (existsSync(path)) {
      unlinkSync(path);
    }
  } catch {
    // Silent
  }
}

export async function getAllCookies(): Promise<Record<string, string>> {
  try {
    const dir = cookiesDir();
    if (!existsSync(dir)) {
      return {};
    }
    const { readdirSync } = await import("node:fs");
    const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
    const cookies: Record<string, string> = {};
    for (const file of files) {
      try {
        const raw = readFileSync(join(dir, file), "utf-8");
        const parsed = JSON.parse(raw) as { value: string };
        const key = file.replace(/\.json$/, "");
        cookies[key] = parsed.value;
      } catch {
        // Skip corrupt file
      }
    }
    return cookies;
  } catch {
    return {};
  }
}
