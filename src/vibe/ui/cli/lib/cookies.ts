/**
 * CLI cookie implementation - file-backed, one file per key.
 * Stored at ./.tmp/cookies/<key>.json relative to cwd.
 * Used for auth tokens and remote connection credentials.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import { reportStorageFailure } from "../../../logger/storage-failure";
import type { EndpointLogger } from "../../../logger/types";

function cookiesDir(): string {
  return join(process.cwd(), ".tmp", "cookies");
}

function keyPath(key: string): string {
  const safe = key.replaceAll(/[^a-zA-Z0-9_\-.]/g, "_"); // eslint-disable-line i18next/no-literal-string
  return join(cookiesDir(), `${safe}.json`);
}

function ensureDir(): void {
  const dir = cookiesDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export async function getCookie(
  name: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const path = keyPath(name);
    if (!existsSync(path)) {
      return null;
    }
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as { value: string };
    return parsed.value;
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "cli",
      area: "file",
      operation: "get",
      key: name,
      error: error instanceof Error ? error : String(error),
    });
    return null;
  }
}

export async function setCookie(
  name: string,
  value: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    ensureDir();
    writeFileSync(keyPath(name), JSON.stringify({ value }), "utf-8");
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "cli",
      area: "file",
      operation: "set",
      key: name,
      error: error instanceof Error ? error : String(error),
      valueLength: value.length,
    });
  }
}

export async function deleteCookie(
  name: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    const path = keyPath(name);
    if (existsSync(path)) {
      unlinkSync(path);
    }
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "cli",
      area: "file",
      operation: "remove",
      key: name,
      error: error instanceof Error ? error : String(error),
    });
  }
}

export async function getAllCookies(
  logger: EndpointLogger,
): Promise<Record<string, string>> {
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
      } catch (error) {
        // Skip corrupt file - but say which one
        reportStorageFailure(logger, {
          platform: "cli",
          area: "file",
          operation: "parse",
          key: file,
          error: error instanceof Error ? error : String(error),
        });
      }
    }
    return cookies;
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "cli",
      area: "file",
      operation: "list",
      key: null,
      error: error instanceof Error ? error : String(error),
    });
    return {};
  }
}

// ─── Sync raw cookie access (CLI: not applicable, no document.cookie) ────────

export function getRawCookieString(): string {
  return ""; // no document.cookie in CLI — use getCookie() (async) instead
}

export function setRawCookieString(value: string): void {
  void value;
}
