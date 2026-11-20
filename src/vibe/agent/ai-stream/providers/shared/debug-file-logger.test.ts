import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { join } from "node:path";

import { expect, it } from "bun:test";

const warning = "debug request logging is disabled in production";
const payload = '{"messages":[{"role":"user","content":"test payload"}]}';
const requestsMarker = "making test requests";

function runDebugLogger(
  nodeEnv: "development" | "production",
  appUrl: string,
  previewMode: boolean,
  debug: boolean,
): { debugDir: string; output: string[] } {
  const discardDir = join(process.cwd(), ".tmp", "todelete");
  mkdirSync(discardDir, { recursive: true });
  const runDir = mkdtempSync(join(discardDir, "debug-file-logger-test-"));
  const modulePath = join(import.meta.dir, "debug-file-logger.ts");
  const result = spawnSync(
    process.execPath,
    [
      "--no-env-file",
      "--eval",
      `process.chdir(${JSON.stringify(runDir)});
       const { logProviderRequest } = await import(${JSON.stringify(modulePath)});
       process.stderr.write(${JSON.stringify(`${requestsMarker}\n`)});
       logProviderRequest("fixture", ${JSON.stringify(payload)});
       logProviderRequest("fixture", ${JSON.stringify(payload)});`,
    ],
    {
      encoding: "utf-8",
      env: {
        NODE_ENV: nodeEnv,
        IS_PREVIEW_MODE: String(previewMode),
        NEXT_PUBLIC_APP_URL: appUrl,
        NEXT_PUBLIC_VIBE_DEBUG: String(debug),
        VIBE_SECRET_KEY: "0".repeat(64),
      },
    },
  );

  expect(result.status, result.stderr).toBe(0);
  return {
    debugDir: join(runDir, ".tmp", "ai-debug-runs"),
    output: result.stderr.trim().split("\n"),
  };
}

it("blocks request logging in production mode even on Hermes and warns once", () => {
  const { debugDir, output } = runDebugLogger(
    "production",
    "http://localhost:3001",
    true,
    true,
  );

  expect(existsSync(debugDir)).toBe(false);
  expect(output).toEqual([warning, requestsMarker]);
});

it("blocks request logging on Thea even in development mode and warns once", () => {
  const { debugDir, output } = runDebugLogger(
    "development",
    "https://production.example",
    false,
    true,
  );

  expect(existsSync(debugDir)).toBe(false);
  expect(output).toEqual([warning, requestsMarker]);
});

it("leaves local debug request logging enabled in development", () => {
  const { debugDir, output } = runDebugLogger(
    "development",
    "http://localhost:3000",
    false,
    true,
  );

  const files = readdirSync(debugDir);
  expect(files).toHaveLength(2);
  expect(
    files.map((file) => readFileSync(join(debugDir, file), "utf-8")),
  ).toEqual([payload, payload]);
  expect(output).toEqual([requestsMarker]);
});

it("stays silent in production when the debug flag is off", () => {
  const { debugDir, output } = runDebugLogger(
    "production",
    "https://production.example",
    false,
    false,
  );

  expect(existsSync(debugDir)).toBe(false);
  expect(output).toEqual([requestsMarker]);
});
