/**
 * Debug file logger for AI provider request payloads.
 * Writes JSON files to .tmp/ai-debug-runs/ when debug logging is enabled outside production.
 * File naming: {timestamp}_{provider}_{seq}_request.json
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { coreEnv } from "next-vibe/core/env";
import { Environment } from "next-vibe/env/env-util";
import { enableDebugLogger } from "next-vibe/logger/debug";
import { deriveDefaultSelfInstanceId } from "next-vibe/remote-connection/instance-identity";

declare global {
  var __vibeDebugRequestLoggingWarningShown: boolean | undefined;
}

const DEBUG_DIR = join(process.cwd(), ".tmp", "ai-debug-runs");
const isProductionInstance =
  deriveDefaultSelfInstanceId(
    coreEnv.NEXT_PUBLIC_APP_URL,
    coreEnv.IS_PREVIEW_MODE,
  ) === "thea";
const isProduction =
  process.env["NODE_ENV"] === Environment.PRODUCTION ||
  coreEnv.NODE_ENV === Environment.PRODUCTION ||
  isProductionInstance;
let requestSeq = 0;

if (
  isProduction &&
  (enableDebugLogger || process.env["NEXT_PUBLIC_VIBE_DEBUG"] === "true") &&
  !globalThis.__vibeDebugRequestLoggingWarningShown
) {
  globalThis.__vibeDebugRequestLoggingWarningShown = true;
  // eslint-disable-next-line no-console
  console.warn("debug request logging is disabled in production");
}

function ensureDir(): void {
  if (!existsSync(DEBUG_DIR)) {
    mkdirSync(DEBUG_DIR, { recursive: true });
  }
}

/**
 * Log a provider request payload to disk.
 */
export function logProviderRequest(provider: string, payload: string): void {
  if (isProduction || !enableDebugLogger) {
    return;
  }
  try {
    ensureDir();
    const seq = ++requestSeq;
    const ts = new Date().toISOString().replaceAll(/[:.]/g, "-");
    const id = `${ts}_${provider}_${seq}`;
    const filePath = join(DEBUG_DIR, `${id}_request.json`);
    writeFileSync(filePath, payload, "utf-8");
  } catch {
    // Silently ignore
  }
}
