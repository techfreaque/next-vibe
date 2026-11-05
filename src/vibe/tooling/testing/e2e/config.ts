// Testing infrastructure - messages are for test debugging, not end users

import { join } from "node:path";

import { defaultLocale } from "../../../core/i18n/core/config";
import { ATLAS_PID_FILE, readPidFilePort } from "../../../platforms/web/pid";

/** Locale every E2E page is opened under — translations resolve against it. */
export const E2E_LOCALE = defaultLocale;

/** Per-test hard cap. First hit on a cold dev route compiles it (Vite), so be generous. */
export const E2E_TEST_TIMEOUT_MS = 120_000;

/** Max wait for a page to hydrate (first `[data-field]` / submit button visible). */
export const E2E_HYDRATION_TIMEOUT_MS = 60_000;

/** Max wait for the endpoint's API response after clicking submit. */
export const E2E_RESPONSE_TIMEOUT_MS = 20_000;

/** Failure artifacts (trace.zip, screenshot, console log) land here. */
export const E2E_ARTIFACTS_DIR = join(
  process.cwd(),
  ".tmp",
  "e2e",
  "artifacts",
);

/** Per-suite coverage records, aggregated by coverage-report.ts. */
export const E2E_COVERAGE_DIR = join(process.cwd(), ".tmp", "e2e", "coverage");

/**
 * Base URL of the server under test.
 * `E2E_BASE_URL` overrides (e.g. Hermes dev, a CI container); default is Atlas dev.
 */
export function resolveE2EBaseUrl(): string | null {
  const override = process.env["E2E_BASE_URL"];
  if (override) {
    return override.replace(/\/$/, "");
  }
  const port = readPidFilePort(ATLAS_PID_FILE);
  return port ? `http://localhost:${port}` : null;
}
