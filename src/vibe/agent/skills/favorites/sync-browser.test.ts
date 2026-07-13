/**
 * Favorites Cross-Instance Sync — Browser E2E
 *
 * Verifies that adding tutor skill favorites on atlas via the browser UI
 * propagates to hermes via remote events AND appears in the hermes browser UI.
 *
 * Runs twice — once per transport mode:
 *   Round 1: direct-http  (atlas→hermes via HTTP POST to hermes bridge)
 *   Round 2: reverse-ws   (atlas emits on WS hub; hermes connector picks it up)
 *
 * Transport semantics:
 *   transportMode      = how THIS side (atlas) sends TO the remote (hermes)
 *   remoteTransportMode = how the remote (hermes) sends back to THIS side (atlas)
 *
 * Flow:
 *   beforeAll:
 *     - connect to hermes, configure syncScope (favorites: true)
 *     - open ATLAS browser tab, login on atlas (port 3000)
 *     - open HERMES browser tab, login on hermes (port 3002)
 *     - navigate both to their favorites pages
 *     - clean pre-existing tutor favs; assert 0 tutor cards in hermes browser
 *   Per round:
 *     - add tutor variant on atlas via browser UI (navigate create form, fill, submit)
 *     - wait for "Tutor" to appear in hermes browser (WS event → UI re-render)
 *     - delete on atlas via browser UI (click delete on card)
 *     - assert tutor gone in hermes browser
 *   afterAll: final cleanup, disconnect, unregister
 *
 * Hermes verification: browser ONLY — no sendTestRequest instanceId:"hermes",
 * no DB queries. The browser IS the truth for hermes state.
 *
 * Requires:
 *   vibe dev               → http://localhost:3000  (atlas)
 *   vibe --hermes dev      → http://localhost:3002  (hermes)
 */

import "server-only";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { env } from "@/env/env";

import {
  connectToHermes,
  disconnectFromHermes,
  LOCAL_DEV_URL,
  readServerPort,
  resolveDevUser,
  resolveProdUserId,
  resolveRemoteUrlSync,
  unregisterDevFromHermes,
} from "../../ai-stream/testing/remote-setup";

function sleep(ms: number): Promise<void> {
  return new Promise<void>((_resolve) => {
    setTimeout(_resolve, ms);
  });
}

/** Extract text from browser endpoint response data (result array of content blocks) */
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

/**
 * Extract UIDs from a chrome-devtools-mcp a11y snapshot for a given label pattern.
 * Snapshot format: `  uid=1_7 textbox "Your Email"`
 */
function findUid(snapshot: string, pattern: RegExp): string | null {
  const lines = snapshot.split("\n");
  for (const line of lines) {
    if (pattern.test(line)) {
      const uidMatch = /uid=([\w]+)/.exec(line);
      if (uidMatch) {
        return uidMatch[1];
      }
    }
  }
  return null;
}

// ── Skip guard (synchronous) ──────────────────────────────────────────────────

const _atlasPort = readServerPort(".tmp/.atlas.pid");
const _hermesPort = readServerPort(".tmp/.hermes-dev.pid");
const _hermesUrl = resolveRemoteUrlSync();

if (!_atlasPort || !_hermesPort || !_hermesUrl) {
  describe.skip("Favorites sync browser E2E — servers not running (need: vibe dev + vibe --hermes dev)", () => {
    it.skip("skipped", () => undefined);
  });
}

if (_atlasPort && _hermesPort && _hermesUrl) {
  describe("Favorites sync browser E2E", () => {
    const TEST_TIMEOUT = 120_000;
    const ATLAS_SESSION = "atlas-e2e";
    const HERMES_SESSION = "hermes-e2e";
    const ATLAS_PORT = _atlasPort;
    const HERMES_PORT = _hermesPort;
    const ATLAS_BASE = `http://localhost:${ATLAS_PORT}`;
    const HERMES_BASE = `http://localhost:${HERMES_PORT}`;
    const HERMES_FAVORITES_URL = `${HERMES_BASE}/en-US/tools/favorites?cat=ai`;
    // skill-get panel URL — shows "Add All" once career-coach favs are cleaned
    const ATLAS_SKILL_URL = `${ATLAS_BASE}/en-US/tools/skill-get?cat=ai&id=career-coach`;
    const SKILL_ID = "career-coach";

    let atlasUser: JwtPrivatePayloadType;
    let prodUserId: string;
    let suiteFailed = false;

    function fit(
      name: string,
      fn: () => Promise<void>,
      timeout?: number,
    ): void {
      it(
        name,
        async () => {
          if (suiteFailed) {
            expect(false, `[${name}] previous step failed — aborting`).toBe(
              true,
            );
            return;
          }
          try {
            await fn();
          } catch (err) {
            suiteFailed = true;
            // oxlint-disable-next-line restricted-syntax
            throw err;
          }
        },
        timeout ?? TEST_TIMEOUT,
      );
    }

    // ── browser helpers ───────────────────────────────────────────────────

    // Browser endpoints always run in-process on atlas (sendTestRequest, no instanceId routing).
    // The session name is passed in the request body as input.instanceId — the browser manager
    // on atlas maps session names to Playwright page contexts.
    async function browserRun<TDef extends CreateApiEndpointAny>(
      definition: TDef,
      input: TDef["types"]["RequestOutput"],
    ): Promise<{
      success: boolean;
      data: Record<string, WidgetData>;
      message?: string;
    }> {
      const result = await sendTestRequest<CreateApiEndpointAny>({
        endpoint: definition,
        data: input as CreateApiEndpointAny["types"]["RequestOutput"],
        user: atlasUser,
        streamContext: undefined,
      });
      if (!result.success) {
        return {
          success: false,
          data: {},
          message: String(result.message ?? "unknown"),
        };
      }
      return { success: true, data: result.data as Record<string, WidgetData> };
    }

    async function browserNewPage(session: string, url: string): Promise<void> {
      const def = (
        await import("@/browser/new-page/definition")
      ).default;
      const r = await browserRun(def.POST, {
        url,
        replacePage: true,
        timeout: 60_000,
        instanceId: session,
      });
      expect(r.success, `browser-new-page(${url}) failed: ${r.message}`).toBe(
        true,
      );
    }

    async function browserSnapshot(session: string): Promise<string> {
      const def = (
        await import("@/browser/take-snapshot/definition")
      ).default;
      const r = await browserRun(def.POST, { instanceId: session });
      expect(r.success, `browser-take-snapshot failed: ${r.message}`).toBe(
        true,
      );
      return extractText(r.data);
    }

    async function browserFill(
      session: string,
      uid: string,
      value: string,
    ): Promise<void> {
      const def = (await import("@/browser/fill/definition"))
        .default;
      const r = await browserRun(def.POST, {
        uid,
        value,
        instanceId: session,
      });
      expect(r.success, `browser-fill(${uid}) failed: ${r.message}`).toBe(true);
    }

    async function browserClick(session: string, uid: string): Promise<void> {
      const def = (await import("@/browser/click/definition"))
        .default;
      const r = await browserRun(def.POST, {
        uid,
        dblClick: false,
        instanceId: session,
      });
      expect(r.success, `browser-click(${uid}) failed: ${r.message}`).toBe(
        true,
      );
    }

    async function browserWaitFor(
      session: string,
      text: string | string[],
      timeoutMs = 20_000,
    ): Promise<void> {
      const def = (
        await import("@/browser/wait-for/definition")
      ).default;
      const r = await browserRun(def.POST, {
        text: Array.isArray(text) ? text : [text],
        timeout: timeoutMs,
        captureSnapshot: false,
        instanceId: session,
      });
      expect(
        r.success,
        `browser-wait-for(${JSON.stringify(text)}) timed out: ${r.message}`,
      ).toBe(true);
    }

    async function browserNavigate(
      session: string,
      url: string,
    ): Promise<void> {
      const def = (
        await import("@/browser/navigate-page/definition")
      ).default;
      const r = await browserRun(def.POST, {
        type: "url",
        url,
        instanceId: session,
      });
      expect(r.success, `browser-navigate(${url}) failed: ${r.message}`).toBe(
        true,
      );
    }

    /** Login to an instance via browser UI. Uses dev quick-login if available, form otherwise. Skips if already logged in. */
    async function loginBrowser(
      session: string,
      baseUrl: string,
    ): Promise<void> {
      await browserNewPage(session, `${baseUrl}/en-US/user/login`);
      await sleep(2_000);
      const snapshot = await browserSnapshot(session);

      // Already logged in — redirected away from login page
      if (
        !snapshot.includes("/en-US/user/login") ||
        findUid(snapshot, /Dev Quick Login/i)
      ) {
        // Try dev quick-login button first (fastest)
        const quickLoginUid = findUid(
          snapshot,
          new RegExp(
            env.VIBE_ADMIN_USER_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i",
          ),
        );
        if (quickLoginUid) {
          await browserClick(session, quickLoginUid);
          await browserWaitFor(
            session,
            ["Threads", "Chat", "Favorites", "Tools"],
            15_000,
          );
          process.stdout.write(
            `[browser:${session}] quick-logged in to ${baseUrl}\n`,
          );
          return;
        }
      }

      // Already authenticated (no login form visible)
      const emailUid = findUid(snapshot, /textbox.*Your Email|Your Email/i);
      if (!emailUid) {
        process.stdout.write(
          `[browser:${session}] already logged in to ${baseUrl}\n`,
        );
        return;
      }

      const passwordUid = findUid(
        snapshot,
        /textbox.*Your Password|Your Password/i,
      );
      if (!passwordUid) {
        return;
      }

      await browserFill(session, emailUid, env.VIBE_ADMIN_USER_EMAIL);
      await browserFill(
        session,
        passwordUid,
        env.VIBE_ADMIN_USER_PASSWORD ?? "password123",
      );

      const snapshot2 = await browserSnapshot(session);
      const submitUid = findUid(snapshot2, /button "Login"/i);
      if (!submitUid) {
        return;
      }

      await browserClick(session, submitUid);
      await browserWaitFor(
        session,
        ["Threads", "Chat", "Favorites", "Tools"],
        15_000,
      );
      process.stdout.write(`[browser:${session}] logged in to ${baseUrl}\n`);
    }

    /**
     * API cleanup: delete all career-coach favorites from atlas.
     * The relay propagates deletes to hermes automatically.
     */
    async function cleanCareerCoachOnAtlasApi(): Promise<void> {
      const favListDef = (
        await import("next-vibe/agent/skills/favorites/definition")
      ).default;
      const favDelDef = (
        await import("next-vibe/agent/skills/favorites/[id]/definition")
      ).default;
      const list = await sendTestRequest({
        streamContext: undefined,
        endpoint: favListDef.GET,
        data: {},
        user: atlasUser,
      });
      if (!list.success) {
        return;
      }
      const toDelete = list.data.favorites.filter((f: { skillId: string }) =>
        f.skillId.startsWith(SKILL_ID),
      );
      if (toDelete.length === 0) {
        return;
      }
      process.stdout.write(
        `[cleanup] removing ${toDelete.length} pre-existing ${SKILL_ID} favs from atlas\n`,
      );
      await Promise.allSettled(
        toDelete.map((f: { id: string }) =>
          sendTestRequest({
            streamContext: undefined,
            endpoint: favDelDef.DELETE,
            urlPathParams: { id: f.id },
            user: atlasUser,
          }),
        ),
      );
    }

    /**
     * Add career-coach favorites via atlas browser:
     * navigate to skill-get panel, wait for "Add All", click it.
     */
    async function addFavViaAtlasBrowser(): Promise<void> {
      await browserNavigate(ATLAS_SESSION, ATLAS_SKILL_URL);
      await browserWaitFor(ATLAS_SESSION, ["Career Coach", "Add All"], 15_000);
      const snapshot = await browserSnapshot(ATLAS_SESSION);
      const addAllUid = findUid(snapshot, /^.*button "Add All".*$/m);
      expect(
        addAllUid,
        `"Add All" button not found. snapshot:\n${snapshot.slice(0, 800)}`,
      ).toBeTruthy();
      if (!addAllUid) {
        return;
      }
      await browserClick(ATLAS_SESSION, addAllUid);
      await sleep(1_000);
      process.stdout.write(`[atlas] ✓ clicked "Add All" for ${SKILL_ID}\n`);
    }

    // career-coach variants that appear only inside fav cards (not in sidebar)
    const CAREER_COACH_VARIANT = "Headhunter";

    /**
     * Assert no career-coach fav cards visible in hermes favorites browser.
     * NO page reload — snapshot the current page as-is.
     */
    async function assertNoCareerCoachInHermes(label: string): Promise<void> {
      await sleep(1_500);
      const snapshot = await browserSnapshot(HERMES_SESSION);
      expect(
        snapshot.includes(CAREER_COACH_VARIANT),
        `[${label}] expected NO ${CAREER_COACH_VARIANT} fav card in hermes browser but found one\n${snapshot.slice(0, 500)}`,
      ).toBe(false);
    }

    /**
     * Poll hermes snapshot until career-coach fav card appears.
     * NO page reload — stays on current page, waits for DOM update from WS event.
     */
    async function waitForCareerCoachInHermes(label: string): Promise<void> {
      const deadline = Date.now() + 8_000;
      let lastSnapshot = "";
      while (Date.now() < deadline) {
        const snapshot = await browserSnapshot(HERMES_SESSION);
        if (snapshot.includes(CAREER_COACH_VARIANT)) {
          process.stdout.write(
            `[${label}] ✓ ${CAREER_COACH_VARIANT} fav card appeared in hermes browser\n`,
          );
          return;
        }
        lastSnapshot = snapshot;
        await sleep(500);
      }
      expect(
        false,
        `[${label}] ${CAREER_COACH_VARIANT} never appeared in hermes browser after 8s\n${lastSnapshot.slice(0, 800)}`,
      ).toBe(true);
    }

    /**
     * Switch atlas→hermes transport mode via PATCH.
     * transportMode = how atlas reaches hermes.
     * The PATCH handler automatically mirrors remoteTransportMode to the hermes row.
     */
    async function switchTransportMode(
      mode: "direct-http" | "reverse-ws",
    ): Promise<void> {
      const connByIdDef = (
        await import("next-vibe/remote-connection/[instanceId]/definition")
      ).default;
      const result = await sendTestRequest({
        streamContext: undefined,
        endpoint: connByIdDef.PATCH,
        data: {
          transportMode: mode,
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: false,
          },
        },
        urlPathParams: { instanceId: "hermes" },
        user: atlasUser,
      });
      expect(
        result.success,
        `switch to ${mode} failed: ${result.message}`,
      ).toBe(true);

      // Verify both sides updated
      const status = await sendTestRequest({
        streamContext: undefined,
        endpoint: connByIdDef.GET,
        urlPathParams: { instanceId: "hermes" },
        user: atlasUser,
      });
      if (status.success) {
        process.stdout.write(
          `[transport] atlas transportMode=${status.data.transportMode} remoteTransportMode=${status.data.remoteTransportMode}\n`,
        );
      }

      // Give connector time to open/close
      await sleep(2_000);
    }

    // ── Setup / teardown ──────────────────────────────────────────────────

    beforeAll(async () => {
      const resolved = await resolveDevUser(env.VIBE_ADMIN_USER_EMAIL);
      expect(resolved, "Admin user not found in atlas DB").toBeTruthy();
      if (!resolved) {
        return;
      }
      atlasUser = resolved;

      prodUserId = await resolveProdUserId();
      await connectToHermes(atlasUser, LOCAL_DEV_URL);

      // Enable favorites sync scope and set initial transport to direct-http
      const connByIdDef = (
        await import("next-vibe/remote-connection/[instanceId]/definition")
      ).default;
      const patchResult = await sendTestRequest({
        streamContext: undefined,
        endpoint: connByIdDef.PATCH,
        data: {
          syncScope: {
            memories: true,
            documents: true,
            skills: true,
            favorites: true,
            threads: false,
          },
          transportMode: "direct-http",
        },
        urlPathParams: { instanceId: "hermes" },
        user: atlasUser,
      });
      expect(
        patchResult.success,
        `syncScope+transport PATCH failed: ${patchResult.message}`,
      ).toBe(true);

      // Clean pre-existing career-coach favs via API (relay propagates deletes to hermes)
      await cleanCareerCoachOnAtlasApi();
      await sleep(2_000);

      // Login both browser sessions in parallel
      await Promise.all([
        loginBrowser(ATLAS_SESSION, ATLAS_BASE),
        loginBrowser(HERMES_SESSION, HERMES_BASE),
      ]);

      // Navigate hermes to favorites page, atlas to skill-get panel
      await Promise.all([
        (async (): Promise<void> => {
          await browserNavigate(ATLAS_SESSION, ATLAS_SKILL_URL);
          await browserWaitFor(ATLAS_SESSION, "Career Coach", 10_000);
        })(),
        (async (): Promise<void> => {
          await browserNavigate(HERMES_SESSION, HERMES_FAVORITES_URL);
          await browserWaitFor(HERMES_SESSION, "Favorites", 10_000);
        })(),
      ]);

      process.stdout.write(`[browser] sessions ready\n`);

      // Assert clean slate — no career-coach cards in hermes before tests
      await assertNoCareerCoachInHermes("beforeAll");
    }, TEST_TIMEOUT);

    afterAll(async () => {
      await cleanCareerCoachOnAtlasApi().catch(() => undefined);
      await disconnectFromHermes(atlasUser.id);
      if (prodUserId) {
        await unregisterDevFromHermes(prodUserId, LOCAL_DEV_URL);
      }
    });

    // ── Round 1: direct-http ──────────────────────────────────────────────
    // atlas.transportMode = "direct-http" → atlas POSTs bridge event to hermes

    fit("FSB1 [direct-http]: hermes has no Headhunter card before add", async () => {
      const snapshot = await browserSnapshot(HERMES_SESSION);
      expect(
        snapshot.includes(CAREER_COACH_VARIANT),
        `Headhunter already on hermes BEFORE add — slate not clean!\n${snapshot.slice(0, 500)}`,
      ).toBe(false);
    });

    fit("FSB2 [direct-http]: add career-coach on atlas via browser UI", async () => {
      await addFavViaAtlasBrowser();
    });

    fit("FSB3 [direct-http]: career-coach appears in hermes browser (WS event, no reload)", async () => {
      await waitForCareerCoachInHermes("direct-http");
    });

    fit("FSB4 [direct-http]: clean via API → Headhunter gone in hermes browser (no reload)", async () => {
      await cleanCareerCoachOnAtlasApi();
      await sleep(3_000);
      await assertNoCareerCoachInHermes("direct-http cleanup");
    });

    // ── Round 2: reverse-ws ───────────────────────────────────────────────
    // atlas.transportMode = "reverse-ws" → atlas emits on atlas WS hub;
    // hermes connector (subscribed to atlas WS) picks it up and applies

    fit("FSB5 [reverse-ws]: switch atlas→hermes transport to reverse-ws", async () => {
      await switchTransportMode("reverse-ws");
    });

    fit("FSB6 [reverse-ws]: hermes has no Headhunter card before add", async () => {
      const snapshot = await browserSnapshot(HERMES_SESSION);
      expect(
        snapshot.includes(CAREER_COACH_VARIANT),
        `Headhunter already on hermes BEFORE add — slate not clean!\n${snapshot.slice(0, 500)}`,
      ).toBe(false);
    });

    fit("FSB7 [reverse-ws]: add career-coach on atlas via browser UI", async () => {
      await addFavViaAtlasBrowser();
    });

    fit("FSB8 [reverse-ws]: career-coach appears in hermes browser (reverse-ws, no reload)", async () => {
      await waitForCareerCoachInHermes("reverse-ws");
    });

    fit("FSB9 [reverse-ws]: clean via API → Headhunter gone in hermes browser (no reload), restore transport", async () => {
      await cleanCareerCoachOnAtlasApi();
      await sleep(3_000);
      await assertNoCareerCoachInHermes("reverse-ws cleanup");

      // Restore to direct-http for next run
      await switchTransportMode("direct-http");
    });
  });
}
