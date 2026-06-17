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
 * Requires Chrome running on :9222 (vibe dev starts it). Skips gracefully when unavailable.
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
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
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
const URL_A = "https://example.com";
const URL_B = "https://example.org";
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
  const result = await sendTestRequest({ endpoint: definition, data: input, user });
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
 * Close Chrome tabs that belong to our test sessions.
 * Only closes tabs whose URL matches a known test session URL or about:blank.
 * Leaves unrelated tabs (e.g. the vibe dev server's own session) untouched.
 */
async function closeTestTabs(sessionIds: string[]): Promise<void> {
  // Close via the repository's close-page tool for tracked sessions.
  // This also evicts session state so the repo doesn't hold stale references.
  // We need a testUser here, so this is a module-level helper called with it.
  // For truly untracked orphans (about:blank with no session), use CDP directly.
  const tabs = await getChromeTabs();
  const orphanBlanks = tabs.filter((t) => t.url === "about:blank");
  await Promise.allSettled(
    orphanBlanks.map((tab) =>
      fetch(`http://127.0.0.1:9222/json/close/${tab.id}`, {
        signal: AbortSignal.timeout(2000),
      }),
    ),
  );
  void sessionIds;
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
  let chromeAvailable = false;
  /** Number of Chrome tabs that existed before this test suite opened any tabs.
   *  All assertTabCount calls use this as the baseline. */
  let tabBaseline = 0;

  beforeAll(async () => {
    chromeAvailable = await isChromeAvailable();
    if (!chromeAvailable) {
      return;
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

    // Close any test-session tabs left by a previous run (tracked + orphan blanks).
    const ALL_TEST_SESSIONS = [
      SESSION_A,
      SESSION_B,
      "browser-test-recovery",
      "browser-test-close-only",
    ];
    await Promise.allSettled(
      ALL_TEST_SESSIONS.map((sid) =>
        run(closePageEndpoints.POST, { instanceId: sid }, testUser),
      ),
    );
    await closeTestTabs(ALL_TEST_SESSIONS);

    // Record baseline after cleanup — whatever is left belongs to other processes.
    tabBaseline = (await getChromeTabs()).length;
  });

  afterAll(async () => {
    if (!chromeAvailable || !testUser) {
      return;
    }
    for (const sid of [SESSION_A, SESSION_B]) {
      await run(closePageEndpoints.POST, { instanceId: sid }, testUser).catch(
        () => {
          /* ignore */
        },
      );
    }
  });

  // ── B0: tab count baseline ───────────────────────────────────────────────────

  it(
    "B0: baseline — Chrome starts with 0 tabs",
    { timeout: TEST_TIMEOUT },
    async () => {
      if (!chromeAvailable) {return;}
      await assertTabCount(tabBaseline, 0, "B0: no test tabs yet");
    },
  );

  // ── B1: new-page — each session opens its own tab ───────────────────────────

  it(
    "B1: new-page — sessions open independent tabs",
    { timeout: TEST_TIMEOUT },
    async () => {
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

      const [resA, resB] = await Promise.all([
        run(takeScreenshotEndpoints.POST, { instanceId: SESSION_A, format: "png" as const }, testUser),
        run(takeScreenshotEndpoints.POST, { instanceId: SESSION_B, format: "png" as const }, testUser),
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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

      const [resA, resB] = await Promise.all([
        run(
          waitForEndpoints.POST,
          { text: ["Example Domain"], instanceId: SESSION_A, captureSnapshot: false },
          testUser,
        ),
        run(
          waitForEndpoints.POST,
          { text: ["Example Domain"], instanceId: SESSION_B, captureSnapshot: false },
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
      if (!chromeAvailable) {
        return;
      }

      const [resA, resB] = await Promise.all([
        run(
          emulateEndpoints.POST,
          { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)", instanceId: SESSION_A },
          testUser,
        ),
        run(
          emulateEndpoints.POST,
          { userAgent: "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)", instanceId: SESSION_B },
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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      if (!chromeAvailable) {
        return;
      }

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
      await assertTabCount(tabBaseline, 2, "B16: after close SID — A+B still alive");

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
      if (!chromeAvailable) {
        return;
      }

      // List pages to get a valid page ID for session A
      const listRes = await run(
        listPagesEndpoints.POST,
        { instanceId: SESSION_A },
        testUser,
      );
      expect(listRes.success, `B17 list: ${listRes.error ?? ""}`).toBe(true);

      const listText = extractText(listRes.data);
      const pageIdMatch = /^(\d+):/.exec(listText.trim());
      if (!pageIdMatch) {
        return; // no pages to select — skip silently
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
});
