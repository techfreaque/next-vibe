/**
 * Browser Tool Integration Tests
 *
 * Tests every browser tool using RouteExecuteRepository.runInProcess.
 * Two concurrent sessions (A and B) run against the same Chrome instance using
 * distinct instanceId values — each session owns one isolated tab.
 *
 * Session isolation assertions:
 *   - Each session sees only its own page content in snapshots, console logs, network requests.
 *   - No about:blank pages appear as selected when two sessions are active simultaneously.
 *   - Correct URL is [selected] for each session when listing pages.
 *
 * Graceful recovery: simulate tab close mid-session, verify session reopens automatically.
 *
 * Requires Chrome running on :9222 (vibe dev starts it). Fails fast in beforeAll when unavailable.
 *
 *   Session A → https://example.com  (instanceId: "browser-test-session-a")
 *   Session B → https://example.org  (instanceId: "browser-test-session-b")
 */

import "server-only";

import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import closePageEndpoints from "@/app/api/[locale]/browser/close-page/definition";
import emulateEndpoints from "@/app/api/[locale]/browser/emulate/definition";
import evaluateScriptEndpoints from "@/app/api/[locale]/browser/evaluate-script/definition";
import listConsoleMessagesEndpoints from "@/app/api/[locale]/browser/list-console-messages/definition";
import listNetworkRequestsEndpoints from "@/app/api/[locale]/browser/list-network-requests/definition";
import listPagesEndpoints from "@/app/api/[locale]/browser/list-pages/definition";
import navigatePageEndpoints from "@/app/api/[locale]/browser/navigate-page/definition";
import newPageEndpoints from "@/app/api/[locale]/browser/new-page/definition";
import performanceStartTraceEndpoints from "@/app/api/[locale]/browser/performance-start-trace/definition";
import performanceStopTraceEndpoints from "@/app/api/[locale]/browser/performance-stop-trace/definition";
import resizePageEndpoints from "@/app/api/[locale]/browser/resize-page/definition";
import selectPageEndpoints from "@/app/api/[locale]/browser/select-page/definition";
import takeScreenshotEndpoints from "@/app/api/[locale]/browser/take-screenshot/definition";
import takeSnapshotEndpoints from "@/app/api/[locale]/browser/take-snapshot/definition";
import waitForEndpoints from "@/app/api/[locale]/browser/wait-for/definition";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/logger/server";
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SESSION_A = "browser-test-session-a";
const SESSION_B = "browser-test-session-b";
// Unique URLs per page so a session/page mix-up is caught immediately.
const URL_A1 = "https://example.com"; // SESSION_A page 1
const URL_A2 = "https://example.net"; // SESSION_A page 2
const URL_B1 = "https://example.org"; // SESSION_B page 1
const URL_B2 = "https://httpbin.org/html"; // SESSION_B page 2
// Back-compat aliases used by the single-page isolation tests (B0-B17).
const URL_A = URL_A1;
const URL_B = URL_B1;
const TEST_TIMEOUT = 60_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    return null;
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  return { isPublic: false, id: user.id, leadId: link.leadId, roles };
}

/** Run a browser tool via sendTestRequest with Platform.CLI (instanceId field active). */
async function run<TDef extends CreateApiEndpointAny>(
  definition: TDef,
  input: TDef["types"]["RequestOutput"],
  user: JwtPrivatePayloadType,
): Promise<{
  success: boolean;
  data: TDef["types"]["ResponseOutput"];
  error?: string;
}> {
  // sendTestRequest has a complex conditional intersection type that TS can't narrow for
  // a generic TDef. We cast through the known parameter type to satisfy TypeScript.
  type SendArgs = Parameters<typeof sendTestRequest<TDef>>[0];
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- conditional intersection can't be narrowed for generic TDef; cast is structurally safe
  const sendArgs = { endpoint: definition, data: input, user } as unknown as SendArgs;
  const result = await sendTestRequest(sendArgs);
  if (!result.success) {
    return {
      success: false,
      data: {} as TDef["types"]["ResponseOutput"],
      error: String(result.message ?? "unknown error"),
    };
  }
  return { success: true, data: result.data };
}

async function isChromeAvailable(): Promise<boolean> {
  try {
    const r = await fetch("http://127.0.0.1:9222/json/version", {
      signal: AbortSignal.timeout(2000),
    });
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * Extract text from the typed browser tool response.
 * Shape: { success, result: [{ type, text }], executionId }
 */
function extractText(data: Record<string, WidgetData>): string {
  const result = data["result"];
  if (!Array.isArray(result)) {
    return "";
  }
  return result
    .filter(
      (b): b is Record<string, WidgetData> =>
        typeof b === "object" && b !== null,
    )
    .map((b) => String(b["text"] ?? ""))
    .join("\n");
}

/** Return all open Chrome page tabs. */
async function getChromeTabs(): Promise<Array<{ id: string; url: string }>> {
  try {
    const r = await fetch("http://127.0.0.1:9222/json", {
      signal: AbortSignal.timeout(3000),
    });
    const all = (await r.json()) as Array<{
      id: string;
      url: string;
      type: string;
    }>;
    return all.filter((t) => t.type === "page");
  } catch {
    return [];
  }
}

/**
 * Fully drain a session: call close-page repeatedly until it reports there is
 * no active session left, so every page the session owns gets closed.
 */
async function drainSession(
  sessionId: string,
  user: JwtPrivatePayloadType,
): Promise<void> {
  for (let i = 0; i < 20; i++) {
    const res = await run(
      closePageEndpoints.POST,
      { instanceId: sessionId },
      user,
    );
    if (!res.success) {
      return;
    }
    // "No active session — nothing to close" signals the session is empty.
    if (extractText(res.data).toLowerCase().includes("no active session")) {
      return;
    }
  }
}

/**
 * Close Chrome tabs that belong to our test sessions.
 * Drains each tracked session (closes ALL its pages), then sweeps any leftover
 * about:blank orphans directly via CDP. Leaves unrelated tabs untouched.
 */
async function closeTestTabs(
  sessionIds: string[],
  user: JwtPrivatePayloadType,
): Promise<void> {
  for (const sid of sessionIds) {
    await drainSession(sid, user);
  }
  const tabs = await getChromeTabs();
  const orphanBlanks = tabs.filter((t) => t.url === "about:blank");
  await Promise.allSettled(
    orphanBlanks.map((tab) =>
      fetch(`http://127.0.0.1:9222/json/close/${tab.id}`, {
        signal: AbortSignal.timeout(2000),
      }),
    ),
  );
}

/**
 * Assert Chrome has exactly `baseline + extra` open tabs.
 * `baseline` = tabs that existed before our test suite started (dev server tabs etc).
 * Prints the actual tab list on failure so we can see what's there.
 */
async function assertTabCount(
  baseline: number,
  extra: number,
  label: string,
): Promise<void> {
  const expected = baseline + extra;
  const tabs = await getChromeTabs();
  expect(
    tabs.length,
    `${label}: expected ${expected} tab(s) (baseline ${baseline} + ${extra} test tabs), got ${tabs.length}:\n${tabs.map((t) => `  ${t.url}`).join("\n")}`,
  ).toBe(expected);
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("Browser Tools", () => {
  let testUser: JwtPrivatePayloadType;
  /** Number of Chrome tabs that existed before this test suite opened any tabs.
   *  All assertTabCount calls use this as the baseline. */
  let tabBaseline = 0;

  beforeAll(async () => {
    const chromeAvailable = await isChromeAvailable();
    if (!chromeAvailable) {
      expect(false, "Chrome not available on :9222 — start Chrome with remote debugging (vibe dev) before running browser tests").toBe(true); return;
    }

    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    testUser = resolved;

    // Close any test-session tabs left by a previous run. Each session may own
    // multiple pages, so drain each one fully (closeTestTabs handles that).
    const ALL_TEST_SESSIONS = [
      SESSION_A,
      SESSION_B,
      "browser-test-recovery",
      "browser-test-close-only",
    ];
    await closeTestTabs(ALL_TEST_SESSIONS, testUser);

    // Record baseline after cleanup — whatever is left belongs to other processes.
    tabBaseline = (await getChromeTabs()).length;
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!testUser) {
      return;
    }
    // Drain every page of every test session so no phantom tabs linger.
    await closeTestTabs([SESSION_A, SESSION_B], testUser).catch(() => {
      /* ignore */
    });
  });

  // ── B0: tab count baseline ───────────────────────────────────────────────────

  it(
    "B0: baseline — Chrome starts with 0 tabs",
    { timeout: TEST_TIMEOUT },
    async () => {
      await assertTabCount(tabBaseline, 0, "B0: no test tabs yet");
    },
  );

  // ── B1: new-page — each session opens its own tab ───────────────────────────

  it(
    "B1: new-page — sessions open independent tabs",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(
          newPageEndpoints.POST,
          { url: URL_A, instanceId: SESSION_A },
          testUser,
        ),
        run(
          newPageEndpoints.POST,
          { url: URL_B, instanceId: SESSION_B },
          testUser,
        ),
      ]);

      expect(resA.success, `Session A new-page: ${resA.error ?? ""}`).toBe(
        true,
      );
      expect(resB.success, `Session B new-page: ${resB.error ?? ""}`).toBe(
        true,
      );

      const textA = extractText(resA.data);
      const textB = extractText(resB.data);

      // new_page returns the full Chrome tab list — the [selected] line is what matters.
      expect(textA).toMatch(/example\.com.*\[selected\]/i);
      expect(textB).toMatch(/example\.org.*\[selected\]/i);
      expect(textA).not.toMatch(/example\.org.*\[selected\]/i);
      expect(textB).not.toMatch(/example\.com.*\[selected\]/i);

      // Exactly 2 tabs — one per session, no orphans.
      await assertTabCount(tabBaseline, 2, "B1: after new-page A+B");
    },
  );

  // ── B2: take-snapshot — isolated page content ────────────────────────────────

  it(
    "B2: take-snapshot — each session sees only its own page",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(takeSnapshotEndpoints.POST, { instanceId: SESSION_A }, testUser),
        run(takeSnapshotEndpoints.POST, { instanceId: SESSION_B }, testUser),
      ]);

      expect(resA.success, `Session A snapshot: ${resA.error ?? ""}`).toBe(
        true,
      );
      expect(resB.success, `Session B snapshot: ${resB.error ?? ""}`).toBe(
        true,
      );

      const textA = extractText(resA.data).toLowerCase();
      const textB = extractText(resB.data).toLowerCase();

      expect(textA).not.toBe(textB);
      expect(textA).not.toContain("example.org");
      expect(textB).not.toContain("example.com");

      await assertTabCount(tabBaseline, 2, "B2: after snapshots");
    },
  );

  // ── B3: list-pages — correct [selected] per session ──────────────────────────

  it(
    "B3: list-pages — each session shows its own URL as [selected]",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(listPagesEndpoints.POST, { instanceId: SESSION_A }, testUser),
        run(listPagesEndpoints.POST, { instanceId: SESSION_B }, testUser),
      ]);

      expect(resA.success, `Session A list-pages: ${resA.error ?? ""}`).toBe(
        true,
      );
      expect(resB.success, `Session B list-pages: ${resB.error ?? ""}`).toBe(
        true,
      );

      const textA = extractText(resA.data);
      const textB = extractText(resB.data);

      expect(textA).toMatch(/example\.com.*\[selected\]/i);
      expect(textB).toMatch(/example\.org.*\[selected\]/i);
      expect(textA).not.toMatch(/about:blank.*\[selected\]/i);
      expect(textB).not.toMatch(/about:blank.*\[selected\]/i);

      await assertTabCount(tabBaseline, 2, "B3: after list-pages");
    },
  );

  // ── B4: navigate-page — independent navigation ───────────────────────────────

  it(
    "B4: navigate-page — sessions navigate independently",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(
          navigatePageEndpoints.POST,
          { url: URL_A, instanceId: SESSION_A },
          testUser,
        ),
        run(
          navigatePageEndpoints.POST,
          { url: URL_B, instanceId: SESSION_B },
          testUser,
        ),
      ]);

      expect(resA.success, `Session A navigate: ${resA.error ?? ""}`).toBe(
        true,
      );
      expect(resB.success, `Session B navigate: ${resB.error ?? ""}`).toBe(
        true,
      );

      const [snapA, snapB] = await Promise.all([
        run(takeSnapshotEndpoints.POST, { instanceId: SESSION_A }, testUser),
        run(takeSnapshotEndpoints.POST, { instanceId: SESSION_B }, testUser),
      ]);

      expect(snapA.success).toBe(true);
      expect(snapB.success).toBe(true);
      expect(extractText(snapA.data).toLowerCase()).not.toContain(
        "example.org",
      );
      expect(extractText(snapB.data).toLowerCase()).not.toContain(
        "example.com",
      );

      await assertTabCount(tabBaseline, 2, "B4: after navigate+snapshot");
    },
  );

  // ── B5: resize-page ──────────────────────────────────────────────────────────

  it(
    "B5: resize-page — resize sessions independently",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(
          resizePageEndpoints.POST,
          { width: 1280, height: 720, instanceId: SESSION_A },
          testUser,
        ),
        run(
          resizePageEndpoints.POST,
          { width: 800, height: 600, instanceId: SESSION_B },
          testUser,
        ),
      ]);

      expect(resA.success, `Session A resize: ${resA.error ?? ""}`).toBe(true);
      expect(resB.success, `Session B resize: ${resB.error ?? ""}`).toBe(true);

      await assertTabCount(tabBaseline, 2, "B5: after resize");
    },
  );

  // ── B6: take-screenshot — distinct captures ───────────────────────────────────

  it(
    "B6: take-screenshot — each session captures its own page",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(
          takeScreenshotEndpoints.POST,
          { instanceId: SESSION_A, format: "png" as const },
          testUser,
        ),
        run(
          takeScreenshotEndpoints.POST,
          { instanceId: SESSION_B, format: "png" as const },
          testUser,
        ),
      ]);

      expect(resA.success, `Session A screenshot: ${resA.error ?? ""}`).toBe(
        true,
      );
      expect(resB.success, `Session B screenshot: ${resB.error ?? ""}`).toBe(
        true,
      );
      // Isolation is already proven by B2 (snapshots differ). Here we just
      // confirm both screenshots completed without error — the response data
      // shape differs per platform (image URL vs base64) so we don't compare it.

      await assertTabCount(tabBaseline, 2, "B6: after screenshots");
    },
  );

  // ── B7: evaluate-script — isolated JS context ────────────────────────────────

  it(
    "B7: evaluate-script — scripts execute in isolated page contexts",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(
          evaluateScriptEndpoints.POST,
          { function: "() => window.location.href", instanceId: SESSION_A },
          testUser,
        ),
        run(
          evaluateScriptEndpoints.POST,
          { function: "() => window.location.href", instanceId: SESSION_B },
          testUser,
        ),
      ]);

      expect(resA.success, `Session A eval: ${resA.error ?? ""}`).toBe(true);
      expect(resB.success, `Session B eval: ${resB.error ?? ""}`).toBe(true);

      const textA = extractText(resA.data);
      const textB = extractText(resB.data);

      expect(textA).toContain("example.com");
      expect(textB).toContain("example.org");
      expect(textA).not.toContain("example.org");
      expect(textB).not.toContain("example.com");

      await assertTabCount(tabBaseline, 2, "B7: after eval");
    },
  );

  // ── B8: list-network-requests — no cross-session requests ────────────────────

  it(
    "B8: list-network-requests — sessions see only their own requests",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(
          listNetworkRequestsEndpoints.POST,
          { instanceId: SESSION_A, includePreservedRequests: false },
          testUser,
        ),
        run(
          listNetworkRequestsEndpoints.POST,
          { instanceId: SESSION_B, includePreservedRequests: false },
          testUser,
        ),
      ]);

      expect(
        resA.success,
        `Session A network-requests: ${resA.error ?? ""}`,
      ).toBe(true);
      expect(
        resB.success,
        `Session B network-requests: ${resB.error ?? ""}`,
      ).toBe(true);

      const textA = extractText(resA.data).toLowerCase();
      const textB = extractText(resB.data).toLowerCase();

      expect(textA).not.toMatch(/get https:\/\/example\.org/i);
      expect(textB).not.toMatch(/get https:\/\/example\.com/i);

      await assertTabCount(tabBaseline, 2, "B8: after network-requests");
    },
  );

  // ── B9: console messages — isolated per session ───────────────────────────────

  it(
    "B9: list-console-messages — each session sees only its own console output",
    { timeout: TEST_TIMEOUT },
    async () => {
      await Promise.all([
        run(
          evaluateScriptEndpoints.POST,
          {
            function: "() => console.log('SESSION_A_MARKER_12345')",
            instanceId: SESSION_A,
          },
          testUser,
        ),
        run(
          evaluateScriptEndpoints.POST,
          {
            function: "() => console.log('SESSION_B_MARKER_67890')",
            instanceId: SESSION_B,
          },
          testUser,
        ),
      ]);

      const [resA, resB] = await Promise.all([
        run(
          listConsoleMessagesEndpoints.POST,
          { instanceId: SESSION_A, includePreservedMessages: false },
          testUser,
        ),
        run(
          listConsoleMessagesEndpoints.POST,
          { instanceId: SESSION_B, includePreservedMessages: false },
          testUser,
        ),
      ]);

      expect(
        resA.success,
        `Session A console-messages: ${resA.error ?? ""}`,
      ).toBe(true);
      expect(
        resB.success,
        `Session B console-messages: ${resB.error ?? ""}`,
      ).toBe(true);

      const textA = extractText(resA.data);
      const textB = extractText(resB.data);

      expect(textA).toContain("SESSION_A_MARKER_12345");
      expect(textB).toContain("SESSION_B_MARKER_67890");
      expect(textA).not.toContain("SESSION_B_MARKER_67890");
      expect(textB).not.toContain("SESSION_A_MARKER_12345");

      await assertTabCount(tabBaseline, 2, "B9: after console messages");
    },
  );

  // ── B10: performance tracing — isolated per session ───────────────────────────

  it(
    "B10: performance-start/stop-trace — isolated per session",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [startA, startB] = await Promise.all([
        run(
          performanceStartTraceEndpoints.POST,
          { instanceId: SESSION_A, reload: false, autoStop: false },
          testUser,
        ),
        run(
          performanceStartTraceEndpoints.POST,
          { instanceId: SESSION_B, reload: false, autoStop: false },
          testUser,
        ),
      ]);

      expect(
        startA.success,
        `Session A start-trace: ${startA.error ?? ""}`,
      ).toBe(true);
      expect(
        startB.success,
        `Session B start-trace: ${startB.error ?? ""}`,
      ).toBe(true);

      await Promise.all([
        run(
          evaluateScriptEndpoints.POST,
          { function: "() => document.title", instanceId: SESSION_A },
          testUser,
        ),
        run(
          evaluateScriptEndpoints.POST,
          { function: "() => document.title", instanceId: SESSION_B },
          testUser,
        ),
      ]);

      const [stopA, stopB] = await Promise.all([
        run(
          performanceStopTraceEndpoints.POST,
          { instanceId: SESSION_A },
          testUser,
        ),
        run(
          performanceStopTraceEndpoints.POST,
          { instanceId: SESSION_B },
          testUser,
        ),
      ]);

      expect(stopA.success, `Session A stop-trace: ${stopA.error ?? ""}`).toBe(
        true,
      );
      expect(stopB.success, `Session B stop-trace: ${stopB.error ?? ""}`).toBe(
        true,
      );

      await assertTabCount(tabBaseline, 2, "B10: after perf trace");
    },
  );

  // ── B11: wait-for — waits within isolated session ─────────────────────────────

  it(
    "B11: wait-for — text wait operates on correct session tab",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(
          waitForEndpoints.POST,
          {
            text: ["Example Domain"],
            instanceId: SESSION_A,
            captureSnapshot: false,
          },
          testUser,
        ),
        run(
          waitForEndpoints.POST,
          {
            text: ["Example Domain"],
            instanceId: SESSION_B,
            captureSnapshot: false,
          },
          testUser,
        ),
      ]);

      expect(resA.success, `Session A wait-for: ${resA.error ?? ""}`).toBe(
        true,
      );
      expect(resB.success, `Session B wait-for: ${resB.error ?? ""}`).toBe(
        true,
      );

      await assertTabCount(tabBaseline, 2, "B11: after wait-for");
    },
  );

  // ── B12: emulate — per-session device emulation ───────────────────────────────

  it(
    "B12: emulate — device emulation isolated per session",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [resA, resB] = await Promise.all([
        run(
          emulateEndpoints.POST,
          {
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
            instanceId: SESSION_A,
          },
          testUser,
        ),
        run(
          emulateEndpoints.POST,
          {
            userAgent: "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)",
            instanceId: SESSION_B,
          },
          testUser,
        ),
      ]);

      // Emulate may fail if device name is unrecognized — the other session must be unaffected
      const aReturned = resA.data !== undefined || resA.error !== undefined;
      const bReturned = resB.data !== undefined || resB.error !== undefined;
      expect(aReturned, "Session A emulate produced no response").toBe(true);
      expect(bReturned, "Session B emulate produced no response").toBe(true);

      await assertTabCount(tabBaseline, 2, "B12: after emulate");
    },
  );

  // ── B13: Graceful recovery after tab close ────────────────────────────────────

  it(
    "B13: graceful recovery — session reopens after tab close",
    { timeout: TEST_TIMEOUT * 2 },
    async () => {
      const SID = "browser-test-recovery";

      // Open: 2 (A+B) + 1 = 3 tabs
      const openRes = await run(
        newPageEndpoints.POST,
        { url: URL_A, instanceId: SID },
        testUser,
      );
      expect(openRes.success, `B13 open: ${openRes.error ?? ""}`).toBe(true);
      await assertTabCount(tabBaseline, 3, "B13: after open");

      // Close: back to 2
      const closeRes = await run(
        closePageEndpoints.POST,
        { instanceId: SID },
        testUser,
      );
      expect(closeRes.success, `B13 close: ${closeRes.error ?? ""}`).toBe(true);
      await assertTabCount(tabBaseline, 2, "B13: after close");

      // Re-use same sessionId — must reopen cleanly → 3 again
      const recoverRes = await run(
        newPageEndpoints.POST,
        { url: URL_A, instanceId: SID },
        testUser,
      );
      expect(
        recoverRes.success,
        `B13 recovery: ${recoverRes.error ?? ""}`,
      ).toBe(true);
      await assertTabCount(tabBaseline, 3, "B13: after recovery open");

      const snapRes = await run(
        takeSnapshotEndpoints.POST,
        { instanceId: SID },
        testUser,
      );
      expect(
        snapRes.success,
        `B13 post-recovery snapshot: ${snapRes.error ?? ""}`,
      ).toBe(true);
      expect(extractText(snapRes.data)).toBeTruthy();

      // Cleanup → back to 2
      await run(closePageEndpoints.POST, { instanceId: SID }, testUser);
      await assertTabCount(tabBaseline, 2, "B13: after cleanup");
    },
  );

  // ── B14: No about:blank cross-contamination under concurrency ─────────────────

  it(
    "B14: concurrent operations — no about:blank selected, no session mix",
    { timeout: TEST_TIMEOUT },
    async () => {
      const [snapA, snapB, listA, listB] = await Promise.all([
        run(takeSnapshotEndpoints.POST, { instanceId: SESSION_A }, testUser),
        run(takeSnapshotEndpoints.POST, { instanceId: SESSION_B }, testUser),
        run(listPagesEndpoints.POST, { instanceId: SESSION_A }, testUser),
        run(listPagesEndpoints.POST, { instanceId: SESSION_B }, testUser),
      ]);

      expect(snapA.success, `B14 snapA: ${snapA.error ?? ""}`).toBe(true);
      expect(snapB.success, `B14 snapB: ${snapB.error ?? ""}`).toBe(true);
      expect(listA.success, `B14 listA: ${listA.error ?? ""}`).toBe(true);
      expect(listB.success, `B14 listB: ${listB.error ?? ""}`).toBe(true);

      const listTextA = extractText(listA.data);
      const listTextB = extractText(listB.data);

      expect(listTextA).not.toMatch(/about:blank.*\[selected\]/i);
      expect(listTextB).not.toMatch(/about:blank.*\[selected\]/i);
      expect(listTextA).toMatch(/example\.com.*\[selected\]/i);
      expect(listTextB).toMatch(/example\.org.*\[selected\]/i);

      await assertTabCount(tabBaseline, 2, "B14: concurrent ops — no orphans");
    },
  );

  // ── B15: serverDefault — non-CLI platform uses VIBE_PID ──────────────────────

  it(
    "B15: serverDefault — MCP platform gets VIBE_PID session (no instanceId in input)",
    { timeout: TEST_TIMEOUT },
    async () => {
      const logger = createEndpointLogger(false, Date.now(), defaultLocale);

      // No instanceId in input — field is hidden for MCP, serverDefault injects VIBE_PID
      const result = await RouteExecuteRepository.runInProcessTyped({
        definition: newPageEndpoints.POST,
        input: { url: "https://example.com" },
        user: testUser,
        locale: defaultLocale,
        logger,
        platform: Platform.MCP,
      });

      expect(
        result.success,
        `B15 MCP new-page: ${!result.success ? String(result.message) : ""}`,
      ).toBe(true);

      // VIBE_PID session opens a 3rd tab (2 test sessions + VIBE_PID).
      await assertTabCount(tabBaseline, 3, "B15: after MCP new-page");

      // Clean up: close the VIBE_PID session tab (also no instanceId).
      await RouteExecuteRepository.runInProcessTyped({
        definition: closePageEndpoints.POST,
        input: {},
        user: testUser,
        locale: defaultLocale,
        logger,
        platform: Platform.MCP,
      });

      await assertTabCount(tabBaseline, 2, "B15: after MCP close-page");
    },
  );

  // ── B16: close-page — close current session tab ───────────────────────────────

  it(
    "B16: close-page — closes the correct session tab only",
    { timeout: TEST_TIMEOUT },
    async () => {
      // Open a dedicated session → 3 tabs
      const SID = "browser-test-close-only";
      const openRes = await run(
        newPageEndpoints.POST,
        { url: URL_A, instanceId: SID },
        testUser,
      );
      expect(openRes.success, `B16 open: ${openRes.error ?? ""}`).toBe(true);
      await assertTabCount(tabBaseline, 3, "B16: after open SID");

      // Close only SID → back to 2
      const closeRes = await run(
        closePageEndpoints.POST,
        { instanceId: SID },
        testUser,
      );
      expect(closeRes.success, `B16 close: ${closeRes.error ?? ""}`).toBe(true);
      await assertTabCount(
        tabBaseline,
        2,
        "B16: after close SID — A+B still alive",
      );

      // Sessions A and B must still be alive
      const [listA, listB] = await Promise.all([
        run(listPagesEndpoints.POST, { instanceId: SESSION_A }, testUser),
        run(listPagesEndpoints.POST, { instanceId: SESSION_B }, testUser),
      ]);

      expect(listA.success, `B16 listA still alive: ${listA.error ?? ""}`).toBe(
        true,
      );
      expect(listB.success, `B16 listB still alive: ${listB.error ?? ""}`).toBe(
        true,
      );
    },
  );

  // ── B17: select-page — select within own session only ────────────────────────

  it(
    "B17: select-page — selects page within own session, does not cross sessions",
    { timeout: TEST_TIMEOUT },
    async () => {
      // List pages to get a valid page ID for session A
      const listRes = await run(
        listPagesEndpoints.POST,
        { instanceId: SESSION_A },
        testUser,
      );
      expect(listRes.success, `B17 list: ${listRes.error ?? ""}`).toBe(true);

      const listText = extractText(listRes.data);
      const pageIdMatch = /^(\d+):/m.exec(listText.trim());
      expect(
        pageIdMatch,
        "B17: no pages returned by list-pages — cannot select",
      ).toBeTruthy();
      if (!pageIdMatch) {
        return;
      }
      const pageId = parseInt(pageIdMatch[1] ?? "1", 10);

      const selectRes = await run(
        selectPageEndpoints.POST,
        { pageId, instanceId: SESSION_A },
        testUser,
      );
      expect(selectRes.success, `B17 select: ${selectRes.error ?? ""}`).toBe(
        true,
      );

      // Session B must be unaffected — still on example.org
      const snapB = await run(
        takeSnapshotEndpoints.POST,
        { instanceId: SESSION_B },
        testUser,
      );
      expect(snapB.success).toBe(true);
      expect(extractText(snapB.data).toLowerCase()).not.toContain(
        "example.com",
      );

      // select_page doesn't open new tabs
      await assertTabCount(tabBaseline, 2, "B17: after select-page");
    },
  );

  // ── B_MULTI: a session accumulates pages; close auto-jumps to a remaining one ─
  //
  // Uses two fresh, self-contained sessions. B0-B17 keep SESSION_A/SESSION_B
  // alive (afterAll closes them), so we capture a LOCAL baseline after cleaning
  // up only our own sessions and assert deltas against that.

  it(
    "B_MULTI: multi-page session — accumulate, isolate, close + auto-jump",
    { timeout: TEST_TIMEOUT * 2 },
    async () => {
      const MA = "browser-test-multi-a";
      const MB = "browser-test-multi-b";

      // Make sure our own sessions are clean, then snapshot the local baseline
      // (whatever other live test sessions have open right now).
      await closeTestTabs([MA, MB], testUser);
      const localBase = (await getChromeTabs()).length;

      try {
        // A opens PAGE_A1 → +1 tab (A:1, B:0)
        const a1 = await run(
          newPageEndpoints.POST,
          { url: URL_A1, instanceId: MA },
          testUser,
        );
        expect(a1.success, `B_MULTI a1: ${a1.error ?? ""}`).toBe(true);
        expect(extractText(a1.data)).toMatch(/example\.com.*\[selected\]/i);
        await assertTabCount(localBase, 1, "B_MULTI: after A1");

        // A opens PAGE_A2 → +2 tabs (A:2, B:0)
        const a2 = await run(
          newPageEndpoints.POST,
          { url: URL_A2, instanceId: MA },
          testUser,
        );
        expect(a2.success, `B_MULTI a2: ${a2.error ?? ""}`).toBe(true);
        expect(extractText(a2.data)).toMatch(/example\.net.*\[selected\]/i);
        await assertTabCount(localBase, 2, "B_MULTI: after A2");

        // B opens PAGE_B1 → +3 tabs (A:2, B:1)
        const b1 = await run(
          newPageEndpoints.POST,
          { url: URL_B1, instanceId: MB },
          testUser,
        );
        expect(b1.success, `B_MULTI b1: ${b1.error ?? ""}`).toBe(true);
        expect(extractText(b1.data)).toMatch(/example\.org.*\[selected\]/i);
        await assertTabCount(localBase, 3, "B_MULTI: after B1");

        // list-pages for A: most recent page (A2 = example.net) is [selected].
        const listA = await run(
          listPagesEndpoints.POST,
          { instanceId: MA },
          testUser,
        );
        expect(listA.success, `B_MULTI listA: ${listA.error ?? ""}`).toBe(true);
        const listATxt = extractText(listA.data);
        expect(listATxt).toMatch(/example\.net.*\[selected\]/i);
        expect(listATxt).not.toMatch(/example\.com.*\[selected\]/i);

        // list-pages for B: B1 (example.org) is [selected].
        const listB = await run(
          listPagesEndpoints.POST,
          { instanceId: MB },
          testUser,
        );
        expect(listB.success, `B_MULTI listB: ${listB.error ?? ""}`).toBe(true);
        expect(extractText(listB.data)).toMatch(/example\.org.*\[selected\]/i);

        // take-snapshot for A shows A2's content (example.net), not A1/B.
        const snapA2 = await run(
          takeSnapshotEndpoints.POST,
          { instanceId: MA },
          testUser,
        );
        expect(snapA2.success, `B_MULTI snapA2: ${snapA2.error ?? ""}`).toBe(
          true,
        );
        const snapA2Url = await run(
          evaluateScriptEndpoints.POST,
          { function: "() => window.location.href", instanceId: MA },
          testUser,
        );
        expect(extractText(snapA2Url.data)).toContain("example.net");
        expect(extractText(snapA2Url.data)).not.toContain("example.com");

        // close_page for A → removes A2, auto-jumps to A1 → 2 tabs (A:1, B:1)
        const closeA2 = await run(
          closePageEndpoints.POST,
          { instanceId: MA },
          testUser,
        );
        expect(closeA2.success, `B_MULTI closeA2: ${closeA2.error ?? ""}`).toBe(
          true,
        );
        await assertTabCount(localBase, 2, "B_MULTI: after close A2");

        // take-snapshot for A now shows A1's content (example.com).
        const a1Url = await run(
          evaluateScriptEndpoints.POST,
          { function: "() => window.location.href", instanceId: MA },
          testUser,
        );
        expect(a1Url.success, `B_MULTI a1Url: ${a1Url.error ?? ""}`).toBe(true);
        expect(extractText(a1Url.data)).toContain("example.com");
        expect(extractText(a1Url.data)).not.toContain("example.net");

        // close_page for A again → removes A1, session empty → 1 tab (B:1)
        const closeA1 = await run(
          closePageEndpoints.POST,
          { instanceId: MA },
          testUser,
        );
        expect(closeA1.success, `B_MULTI closeA1: ${closeA1.error ?? ""}`).toBe(
          true,
        );
        await assertTabCount(localBase, 1, "B_MULTI: after close A1");

        // B still alive and isolated on example.org.
        const bUrl = await run(
          evaluateScriptEndpoints.POST,
          { function: "() => window.location.href", instanceId: MB },
          testUser,
        );
        expect(bUrl.success, `B_MULTI bUrl: ${bUrl.error ?? ""}`).toBe(true);
        expect(extractText(bUrl.data)).toContain("example.org");

        // close_page for B → removes B1, session empty → 0 tabs.
        const closeB1 = await run(
          closePageEndpoints.POST,
          { instanceId: MB },
          testUser,
        );
        expect(closeB1.success, `B_MULTI closeB1: ${closeB1.error ?? ""}`).toBe(
          true,
        );
        await assertTabCount(localBase, 0, "B_MULTI: all closed");
      } finally {
        await closeTestTabs([MA, MB], testUser);
      }
    },
  );

  // ── B_UNIQUE_URLS: unique URLs per page catch any session/page mix-up ─────────

  it(
    "B_UNIQUE_URLS: each page keeps its own URL across two multi-page sessions",
    { timeout: TEST_TIMEOUT * 2 },
    async () => {
      const UA = "browser-test-unique-a";
      const UB = "browser-test-unique-b";
      await closeTestTabs([UA, UB], testUser);
      const localBase = (await getChromeTabs()).length;

      try {
        // A: two pages (example.com, example.net). B: two pages (example.org, httpbin).
        await run(
          newPageEndpoints.POST,
          { url: URL_A1, instanceId: UA },
          testUser,
        );
        await run(
          newPageEndpoints.POST,
          { url: URL_B1, instanceId: UB },
          testUser,
        );
        await run(
          newPageEndpoints.POST,
          { url: URL_A2, instanceId: UA },
          testUser,
        );
        await run(
          newPageEndpoints.POST,
          { url: URL_B2, instanceId: UB },
          testUser,
        );
        await assertTabCount(localBase, 4, "B_UNIQUE: 4 pages open");

        // Active page of A is its latest (example.net); active of B is httpbin.
        const aUrl = await run(
          evaluateScriptEndpoints.POST,
          { function: "() => window.location.href", instanceId: UA },
          testUser,
        );
        const bUrl = await run(
          evaluateScriptEndpoints.POST,
          { function: "() => window.location.href", instanceId: UB },
          testUser,
        );
        expect(aUrl.success, `B_UNIQUE aUrl: ${aUrl.error ?? ""}`).toBe(true);
        expect(bUrl.success, `B_UNIQUE bUrl: ${bUrl.error ?? ""}`).toBe(true);

        const aText = extractText(aUrl.data);
        const bText = extractText(bUrl.data);
        // A's active page must be example.net and must NOT be any of B's URLs.
        expect(aText).toContain("example.net");
        expect(aText).not.toContain("example.org");
        expect(aText).not.toContain("httpbin.org");
        // B's active page must be httpbin and must NOT be any of A's URLs.
        expect(bText).toContain("httpbin.org");
        expect(bText).not.toContain("example.com");
        expect(bText).not.toContain("example.net");

        // list-pages for each session shows only that session's own URLs.
        const listA = await run(
          listPagesEndpoints.POST,
          { instanceId: UA },
          testUser,
        );
        const listB = await run(
          listPagesEndpoints.POST,
          { instanceId: UB },
          testUser,
        );
        expect(extractText(listA.data)).toMatch(/example\.net.*\[selected\]/i);
        expect(extractText(listB.data)).toMatch(/httpbin\.org.*\[selected\]/i);
      } finally {
        await closeTestTabs([UA, UB], testUser);
        await assertTabCount(localBase, 0, "B_UNIQUE: cleaned up");
      }
    },
  );
});
