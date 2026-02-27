/**
 * Debug file logger for AI provider request payloads.
 * Writes JSON files to .tmp/ai-debug-runs/ when enableDebugLogger is true.
 * File naming: {timestamp}_{provider}_{seq}_request.json
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { enableDebugLogger } from "@/config/debug";

/* eslint-disable i18next/no-literal-string */

const DEBUG_DIR = "/home/max/projects/next-vibe/.tmp/ai-debug-runs";
let requestSeq = 0;

function ensureDir(): void {
  if (!existsSync(DEBUG_DIR)) {
    mkdirSync(DEBUG_DIR, { recursive: true });
  }
}

/**
 * Log a provider request payload to disk.
 * Only writes when enableDebugLogger is true.
 */
export function logProviderRequest(provider: string, payload: string): void {
  if (!enableDebugLogger) {
    return;
  }
  try {
    ensureDir();
    const seq = ++requestSeq;
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const id = `${ts}_${provider}_${seq}`;
    const filePath = join(DEBUG_DIR, `${id}_request.json`);
    writeFileSync(filePath, payload, "utf-8");
  } catch {
    // Silently ignore
  }
}
