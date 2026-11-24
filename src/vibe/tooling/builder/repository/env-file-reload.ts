/**
 * Carry .env edits into process.env across the in-process dev restart.
 *
 * Vite restarts the dev server when .env changes (the settings page and
 * /setup write it), but process.env keeps the values dotenv loaded at boot,
 * so the fresh server would read the old settings. Only keys whose value in
 * the file actually changed are applied: values that came from the caller
 * (`--hermes`, MCP env blocks) stay untouched.
 */

import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parse } from "dotenv";

let fileSnapshot: Record<string, string> | null = null;

function readEnvFile(): Record<string, string> {
  const envPath = join(process.cwd(), ".env");
  return existsSync(envPath) ? parse(readFileSync(envPath)) : {};
}

/** Remember the .env contents the running server was started with. */
export function snapshotEnvFile(): void {
  fileSnapshot ??= readEnvFile();
}

/** Apply keys added, changed or removed in .env since the last snapshot. */
export function applyEnvFileChanges(): string[] {
  const previous = fileSnapshot ?? {};
  const next = readEnvFile();
  const changed: string[] = [];
  for (const [key, value] of Object.entries(next)) {
    if (previous[key] !== value) {
      process.env[key] = value;
      changed.push(key);
    }
  }
  for (const key of Object.keys(previous)) {
    if (!(key in next)) {
      Reflect.deleteProperty(process.env, key);
      changed.push(key);
    }
  }
  fileSnapshot = next;
  return changed;
}
