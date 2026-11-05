// Testing infrastructure - messages are for test debugging, not end users

/**
 * Shared waits for the chat E2E suites (stream + ai-run).
 */

import type { Locator, Page } from "playwright";
import { expect } from "vitest";

/** Poll `check` until it holds (bun's vitest shim has no expect.poll). */
export async function until(
  what: string,
  check: () => Promise<boolean>,
  timeoutMs = 30_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!(await check())) {
    if (Date.now() > deadline) {
      expect.fail(`[e2e] timed out waiting for: ${what}`);
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 200);
    });
  }
}

const DEV_RELOAD_ERROR = "Failed to fetch dynamically imported module";

/**
 * Wait for `target` to show. A dev-server HMR reload (another process editing
 * sources) can kill a lazily imported widget mid-test — the harness forgives
 * the page error but the view is gone. Only in that case, `recover` (default:
 * reload the page) and wait again; any other absence still fails.
 */
export async function waitVisibleThroughDevReload(
  page: Page,
  target: Locator,
  recover: () => Promise<void> = async (): Promise<void> => {
    await page.reload({ waitUntil: "load" });
  },
  timeoutMs = 60_000,
): Promise<void> {
  let devReloaded = false;
  const onError = (error: Error): void => {
    if (error.message.includes(DEV_RELOAD_ERROR)) {
      devReloaded = true;
    }
  };
  page.on("pageerror", onError);
  try {
    for (let attempt = 0; ; attempt++) {
      const shown = await target
        .waitFor({ state: "visible", timeout: timeoutMs })
        .then(() => true)
        .catch(() => false);
      if (shown) {
        return;
      }
      expect(
        devReloaded && attempt < 3,
        "[e2e] expected content never rendered",
      ).toBe(true);
      devReloaded = false;
      await recover();
    }
  } finally {
    page.off("pageerror", onError);
  }
}

/**
 * Run a send `attempt` (navigate + type + send) and retry it when the shared
 * dev server answered 503 mid-restart (its proxy's plain-text "Service
 * Unavailable" — the request never reached a handler, so no fixture ordinal
 * was consumed). Any real response, success or rejection, is returned as-is.
 */
export async function sendThroughDevRestart<
  TResult extends { call: { status: number; contentType: string } },
>(baseUrl: string, attempt: () => Promise<TResult>): Promise<TResult> {
  for (let round = 0; ; round++) {
    const result = await attempt();
    const devRestart =
      result.call.status === 503 &&
      !result.call.contentType.includes("application/json");
    if (!devRestart || round >= 3) {
      return result;
    }
    await until(
      "dev server back up",
      async () => {
        // oxlint-disable-next-line restricted/no-raw-fetch -- reachability probe of the server under test
        const status = await fetch(baseUrl)
          .then((r) => r.status)
          .catch(() => 0);
        return status > 0 && status < 500;
      },
      120_000,
    );
  }
}
