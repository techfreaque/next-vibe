// Testing infrastructure - messages are for test debugging, not end users

/**
 * E2E harness — one Chromium per suite, one fresh BrowserContext per test.
 *
 *   describe("E2E: login", () => {
 *     const e2e = useE2E("user/public/login");
 *     e2e.it("logs in", async ({ open }) => { ... });
 *   });
 *
 * Every test gets: isolated cookies/storage, a Playwright trace, and
 * uncaught-page-error detection (any `pageerror` fails the test). On failure
 * the trace, a full-page screenshot and the console log are written to
 * .tmp/e2e/artifacts/<suite>/<test>/ and the path is appended to the error.
 *
 * Target server: Atlas dev by default, `E2E_BASE_URL` to override.
 * `E2E_HEADED=1` shows the browser; `E2E_SLOWMO=<ms>` slows every action.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { Browser, BrowserContext, ConsoleMessage, Page } from "playwright";
import { chromium } from "playwright";
import { afterAll, beforeAll, expect, it } from "vitest";

import { slugify } from "../../../agent/ai-stream/testing/fetch-cache";
import { seedFixtureThread } from "../../../agent/ai-stream/testing/fixture-seed";
import { endpointToUrlSegment } from "../../../core/core-utils/path";
import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { FIXTURE_SCOPE_HEADER } from "../../../core/execution-context";
import type { JwtPrivatePayloadType } from "../../../identity/auth/types";
import { createTestSessionToken, E2E_AUTH_COOKIE_NAME } from "./auth";
import {
  E2E_ARTIFACTS_DIR,
  E2E_HYDRATION_TIMEOUT_MS,
  E2E_LOCALE,
  E2E_TEST_TIMEOUT_MS,
  resolveE2EBaseUrl,
} from "./config";
import { flushCoverage, recordPage } from "./coverage";
import type { E2ESubmitSent } from "./endpoint-form";
import {
  captureEndpointCall,
  e2eEndpointId,
  EndpointForm,
} from "./endpoint-form";

export interface E2EOpenOptions {
  /** Locale-less page path ("/user/login"). Default: the endpoint's /tools/<alias> page. */
  path?: string;
  /**
   * Query string. On /tools/<alias> pages, `[param]` keys become URL path
   * params and the rest prefill request fields (help-tool seeds the stack).
   */
  query?: Record<string, string>;
  /**
   * When the page is usable. Default: the endpoint's form is hydrated, or
   * network idle when the definition has no inputs. Override for display-only
   * / custom widgets that never render the endpoint's own form fields.
   */
  ready?: (page: Page) => Promise<void>;
}

export interface E2ESuiteOptions {
  /**
   * Record/replay external HTTP (AI providers, media, email) per test: the
   * first run calls the provider live and writes
   * src/generated/ai-fixtures/http-cache/e2e-<suite>--<test>/, every later run
   * replays it. Delete that folder to re-record.
   */
  fixtures?: boolean;
}

export interface E2EFixtures {
  page: Page;
  context: BrowserContext;
  baseUrl: string;
  /** Open a page and return the driver for `endpoint`'s form on it. */
  open: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    options?: E2EOpenOptions,
  ) => Promise<EndpointForm<TEndpoint>>;
  /**
   * Run an action on a hand-built UI and return the `endpoint` call it made.
   * `timeoutMs` for calls fired late (beacons, post-hydration effects).
   */
  capture: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    action: () => Promise<void>,
    timeoutMs?: number,
  ) => Promise<E2ESubmitSent<TEndpoint>>;
  /** Navigate to a locale-less path (waits for load; retries dev-server 503s). */
  goto: (path: string) => Promise<void>;
  /**
   * Navigate until `ready` resolves, reloading through dev-server HMR windows —
   * what `open()` does, for hand-built pages driven via `page`.
   */
  gotoReady: (path: string, ready: () => Promise<void>) => Promise<void>;
  /** Authenticate this test's context as `user` (real DB session + cookie). */
  loginAs: (user: JwtPrivatePayloadType) => Promise<void>;
  /** Unique, recognisable address for data created by this test. */
  uniqueEmail: (tag: string) => string;
  /** Run after the test, pass or fail (reverse order). */
  cleanup: (fn: () => Promise<void>) => void;
}

export interface E2EHarness {
  it: (
    name: string,
    fn: (fixtures: E2EFixtures) => Promise<void>,
    timeoutMs?: number,
  ) => void;
}

/**
 * A dev server mid-HMR full reload answers the client entry with 503, so the
 * page never hydrates. Environmental, not a product failure: wait and reload.
 */
const DEV_RELOAD_ERROR = "Failed to fetch dynamically imported module";
const DEV_RELOAD_RETRIES = 3;
const DEV_RELOAD_BACKOFF_MS = 3_000;
/** Our own per-test deadline sits this far inside bun's, so failures keep artifacts. */
const TEST_GUARD_MARGIN_MS = 15_000;

function slug(value: string): string {
  return value
    .replaceAll(/[^a-zA-Z0-9-]+/g, "-")
    .replaceAll(/^-|-$/g, "")
    .slice(0, 80);
}

function launchBrowser(): Promise<Browser> {
  return chromium.launch({
    headless: process.env["E2E_HEADED"] !== "1",
    slowMo: Number(process.env["E2E_SLOWMO"] ?? 0),
  });
}

export function useE2E(
  suite: string,
  options: E2ESuiteOptions = {},
): E2EHarness {
  let browser: Browser | null = null;
  let baseUrl = "";
  let userAgent = "";

  beforeAll(async () => {
    const resolved = resolveE2EBaseUrl();
    expect(
      resolved,
      "[e2e] no server to test — start Atlas dev (`vibe dev`) or set E2E_BASE_URL",
    ).toBeTruthy();
    baseUrl = resolved ?? "";
    // oxlint-disable-next-line restricted/no-raw-fetch -- reachability probe of the server under test
    const probe = await fetch(baseUrl, { signal: AbortSignal.timeout(60_000) })
      .then((r) => r.status)
      .catch((error: Error) => error.message);
    expect(
      typeof probe === "number" && probe < 500,
      `[e2e] ${baseUrl} not reachable (${String(probe)}) — is the server up?`,
    ).toBe(true);

    browser = await launchBrowser();
    const probeContext = await browser.newContext();
    const probePage = await probeContext.newPage();
    // Evaluated in the browser — the real Chromium UA, suffixed per test below
    userAgent = await probePage.evaluate<string>("navigator.userAgent");
    await probeContext.close();
  }, E2E_TEST_TIMEOUT_MS);

  // Explicit timeout: bun's 5s default cuts browser.close() short, and the
  // orphaned Chromium is then reaped mid-way through the NEXT suite.
  afterAll(async () => {
    flushCoverage(suite);
    await browser?.close();
    browser = null;
  }, E2E_TEST_TIMEOUT_MS);

  // Fixture folders are slugified + cut to 60 chars, so long suite ids leave
  // little room for the test name — two tests sharing a folder would replay
  // each other's recordings. Fail at registration instead.
  const fixtureFolders = new Map<string, string>();

  return {
    it: (name, fn, timeoutMs = E2E_TEST_TIMEOUT_MS) => {
      if (options.fixtures) {
        const folder = slugify(`e2e-${slug(suite)}--${slug(name)}`);
        const clash = fixtureFolders.get(folder);
        if (clash !== undefined) {
          // eslint-disable-next-line restricted/restricted-syntax -- test registration error
          throw new Error(
            `[e2e] "${name}" and "${clash}" share fixture folder ${folder} — make the names differ within the first ${folder.length} chars`,
          );
        }
        fixtureFolders.set(folder, name);
      }
      it(
        name,
        async () => {
          // A test that hits bun's timeout gets its Chromium reaped as a
          // dangling process — relaunch so one hang can't fail the rest.
          if (browser && !browser.isConnected()) {
            browser = await launchBrowser();
          }
          if (!browser) {
            // eslint-disable-next-line restricted/restricted-syntax -- test infrastructure failure
            throw new Error("[e2e] browser not launched — beforeAll failed");
          }
          // Unique UA per test: anonymous leads are deduped by IP + user agent,
          // so without it every context on localhost shares one lead — and one
          // test's cleanup deletes it under another.
          const context = await browser.newContext({
            baseURL: baseUrl,
            userAgent: `${userAgent} vibe-e2e/${crypto.randomUUID()}`,
          });
          if (options.fixtures) {
            // One scope per test: ordinals replay by position, so a scope
            // shared across tests would shift whenever one is filtered out.
            const scopeId = `e2e:${slug(suite)}:${slug(name)}`;
            await seedFixtureThread(
              scopeId,
              `e2e-${slug(suite)}--${slug(name)}`,
              false,
            );
            await context.setExtraHTTPHeaders({
              [FIXTURE_SCOPE_HEADER]: scopeId,
            });
          }
          await context.tracing.start({ screenshots: true, snapshots: true });
          const page = await context.newPage();

          const pageErrors: string[] = [];
          const consoleLog: string[] = [];
          page.on("pageerror", (error) => {
            pageErrors.push(`${error.name}: ${error.message}`);
          });
          page.on("console", (msg) => {
            consoleLog.push(`[${msg.type()}] ${msg.text()}`);
          });

          const cleanups: Array<() => Promise<void>> = [];
          // Endpoint forms signal their own hydration (`[data-hydrated]`, see
          // EndpointForm.root); "load" covers hand-built pages driven via `page`.
          const goto = async (path: string): Promise<void> => {
            for (let attempt = 0; ; attempt++) {
              const response = await page.goto(
                `${baseUrl}/${E2E_LOCALE}${path}`,
                { waitUntil: "load", timeout: E2E_HYDRATION_TIMEOUT_MS },
              );
              // 503 = dev proxy while the inner server restarts
              if (response?.status() !== 503 || attempt >= DEV_RELOAD_RETRIES) {
                return;
              }
              await new Promise<void>((resolve) => {
                setTimeout(resolve, DEV_RELOAD_BACKOFF_MS);
              });
            }
          };
          /**
           * Resolves when the page reports a dev-server reload import failure —
           * thrown (pageerror) or logged by the TanStack client's hydration
           * guard (console: "[client] hydration failed: …").
           */
          const devReload = (): Promise<"reload"> =>
            new Promise((resolve) => {
              const done = (): void => {
                page.off("pageerror", onError);
                page.off("console", onConsole);
                resolve("reload");
              };
              const onError = (error: Error): void => {
                if (error.message.includes(DEV_RELOAD_ERROR)) {
                  done();
                }
              };
              const onConsole = (msg: ConsoleMessage): void => {
                if (
                  msg.type() === "error" &&
                  msg.text().includes(DEV_RELOAD_ERROR)
                ) {
                  done();
                }
              };
              page.on("pageerror", onError);
              page.on("console", onConsole);
            });
          /** Navigate until `ready` resolves, reloading through dev-server HMR windows. */
          const gotoUntilReady = async (
            path: string,
            ready: () => Promise<void>,
          ): Promise<void> => {
            for (let attempt = 0; ; attempt++) {
              const reload = devReload();
              await goto(path);
              const outcome = await Promise.race([
                ready().then(() => "ready" as const),
                reload,
              ]);
              if (outcome === "ready") {
                return;
              }
              if (attempt >= DEV_RELOAD_RETRIES) {
                // eslint-disable-next-line restricted/restricted-syntax -- test infrastructure failure
                throw new Error(
                  `[e2e] ${path}: dev server kept reloading (${DEV_RELOAD_RETRIES + 1} attempts) — is something editing sources?`,
                );
              }
              await new Promise<void>((resolve) => {
                setTimeout(resolve, DEV_RELOAD_BACKOFF_MS);
              });
            }
          };

          const fixtures: E2EFixtures = {
            page,
            context,
            baseUrl,
            goto,
            gotoReady: gotoUntilReady,
            capture: (endpoint, action, callTimeoutMs) =>
              captureEndpointCall(page, endpoint, action, callTimeoutMs),
            open: async (endpoint, openOptions = {}) => {
              const path =
                openOptions.path ?? `/tools/${endpointToUrlSegment(endpoint)}`;
              const query = openOptions.query
                ? `?${new URLSearchParams(openOptions.query).toString()}`
                : "";
              // Record before navigating so calls fired on mount are captured
              const form = new EndpointForm(page, endpoint);
              await form.attach();
              await gotoUntilReady(`${path}${query}`, async () => {
                if (openOptions.ready) {
                  await openOptions.ready(page);
                } else if (form.hasInputs) {
                  await form.root.waitFor({
                    state: "visible",
                    timeout: E2E_HYDRATION_TIMEOUT_MS,
                  });
                } else {
                  await page.waitForLoadState("networkidle", {
                    timeout: E2E_HYDRATION_TIMEOUT_MS,
                  });
                }
              });
              recordPage(e2eEndpointId(endpoint), path);
              return form;
            },
            loginAs: async (user) => {
              const token = await createTestSessionToken(user);
              expect(token.success, "[e2e] could not create test session").toBe(
                true,
              );
              if (!token.success) {
                return;
              }
              await context.addCookies([
                {
                  name: E2E_AUTH_COOKIE_NAME,
                  value: token.data,
                  url: baseUrl,
                  httpOnly: true,
                },
              ]);
            },
            uniqueEmail: (tag) =>
              `e2e-${slug(tag)}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.com`,
            cleanup: (cleanupFn) => {
              cleanups.push(cleanupFn);
            },
          };

          let failure: Error | null = null;
          try {
            // Fail ourselves before bun's timeout does: bun kills the test
            // (and reaps Chromium) with no screenshot or trace written.
            const deadline = Promise.withResolvers<never>();
            const guard = setTimeout(() => {
              deadline.reject(
                new Error(
                  `[e2e] test exceeded ${timeoutMs - TEST_GUARD_MARGIN_MS}ms`,
                ),
              );
            }, timeoutMs - TEST_GUARD_MARGIN_MS);
            await Promise.race([fn(fixtures), deadline.promise]).finally(() => {
              clearTimeout(guard);
            });
            // Dev-reload import failures were recovered by gotoUntilReady (or the
            // test already failed) — every other uncaught error fails the test.
            expect(
              pageErrors.filter((e) => !e.includes(DEV_RELOAD_ERROR)),
              "[e2e] uncaught errors in the page",
            ).toEqual([]);
          } catch (error) {
            failure = error instanceof Error ? error : new Error(String(error));
          }

          if (failure) {
            const dir = join(E2E_ARTIFACTS_DIR, slug(suite), slug(name));
            mkdirSync(dir, { recursive: true });
            await page
              .screenshot({ path: join(dir, "screenshot.png"), fullPage: true })
              .catch(() => undefined);
            await context.tracing
              .stop({ path: join(dir, "trace.zip") })
              .catch(() => undefined);
            writeFileSync(
              join(dir, "console.log"),
              [
                `url: ${page.url()}`,
                ...pageErrors.map((e) => `[pageerror] ${e}`),
                ...consoleLog,
              ].join("\n"),
            );
            failure.message += `\n[e2e] artifacts: ${dir}\n[e2e] trace: bunx playwright show-trace "${join(dir, "trace.zip")}"`;
          } else {
            await context.tracing.stop();
          }
          // Drop in-flight route handlers first, else they surface as
          // "Request context disposed" unhandled errors in the next test.
          await page.unrouteAll({ behavior: "ignoreErrors" });
          await context.close();
          for (const cleanupFn of cleanups.toReversed()) {
            await cleanupFn();
          }
          if (failure) {
            // eslint-disable-next-line restricted/restricted-syntax -- rethrow so the test runner records the failure
            throw failure;
          }
        },
        timeoutMs,
      );
    },
  };
}
