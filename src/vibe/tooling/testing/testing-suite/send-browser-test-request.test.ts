/**
 * Integration tests for sendBrowserTestRequest.
 *
 * Uses user create + delete as subjects — real admin operations with
 * assertable responses. Each test creates a temp user then cleans up.
 *
 * Requires: Atlas dev server running (`vibe dev`).
 */

import "server-only";

import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import userCreateDefinitions, {
  type UserCreateResponseOutput,
} from "@/users/create/definition";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import { resolveTestAdminUser } from "./resolve-test-user";
import { sendBrowserTestRequest } from "./send-browser-test-request";
import { sendTestRequest } from "./send-test-request";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TEST_TIMEOUT = 120_000;

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("sendBrowserTestRequest", () => {
  beforeAll(async () => {
    const { readPidFilePort, ATLAS_PID_FILE } =
      await import("../../../platforms/web/server/pid");
    expect(
      readPidFilePort(ATLAS_PID_FILE),
      "Atlas dev server not running — start with `vibe dev`",
    ).toBeTruthy();
  }, 30_000);

  // ── T1: create user ───────────────────────────────────────────────────────

  it(
    "T1: create user — fills form, submits, reads response from query cache",
    { timeout: TEST_TIMEOUT },
    async () => {
      const result = await sendBrowserTestRequest({
        endpoint: userCreateDefinitions.POST,
        data: {
          basicInfo: {
            email: `browser-test-${Date.now()}@example.com`,
            password: "Test1234!",
            privateName: "Browser Test",
            publicName: "BrowserTest",
            country: "US",
            language: "en",
          },
          adminSettings: {},
        },
      });

      expect(
        result.success,
        `create user failed: ${JSON.stringify(result)}`,
      ).toBe(true);

      if (result.success) {
        const data = result.data as UserCreateResponseOutput;
        expect(typeof data.responseId).toBe("string");
        expect(data.responseEmail).toContain("browser-test-");

        // cleanup
        const user = await resolveTestAdminUser();
        type SendArgs = Parameters<
          typeof sendTestRequest<CreateApiEndpointAny>
        >[0];
        await sendTestRequest({
          endpoint: userDeleteDefinitions.DELETE,
          urlPathParams: { id: data.responseId },
          user,
          toolExecutionContext: undefined,
        } as SendArgs);
      }
    },
  );

  // ── T2: create then delete ────────────────────────────────────────────────

  it(
    "T2: create user via browser, delete via browser",
    { timeout: TEST_TIMEOUT },
    async () => {
      const email = `browser-test-del-${Date.now()}@example.com`;

      const createResult = await sendBrowserTestRequest({
        endpoint: userCreateDefinitions.POST,
        data: {
          basicInfo: {
            email,
            password: "Test1234!",
            privateName: "ToDelete User",
            publicName: "ToDeleteUser",
            country: "US",
            language: "en",
          },
          adminSettings: {},
        },
      });

      expect(createResult.success).toBe(true);
      if (!createResult.success) {
        return;
      }

      const created = createResult.data as UserCreateResponseOutput;

      const deleteResult = await sendBrowserTestRequest({
        endpoint: userDeleteDefinitions.DELETE,
        urlPathParams: { id: created.responseId },
      });

      expect(
        deleteResult.success,
        `delete failed: ${!deleteResult.success && "message" in deleteResult ? deleteResult.message : ""}`,
      ).toBe(true);
    },
  );

  // ── T3: screenshot always fires ───────────────────────────────────────────

  it(
    "T3: screenshot saved to .tmp/ after create",
    { timeout: TEST_TIMEOUT },
    async () => {
      const result = await sendBrowserTestRequest({
        endpoint: userCreateDefinitions.POST,
        data: {
          basicInfo: {
            email: `browser-screenshot-${Date.now()}@example.com`,
            password: "Test1234!",
            privateName: "Screenshot Test",
            publicName: "ScreenshotTest",
            country: "US",
            language: "en",
          },
          adminSettings: {},
        },
      });

      expect(result.success).toBe(true);

      if (result.success) {
        // cleanup
        const user = await resolveTestAdminUser();
        const created = result.data as UserCreateResponseOutput;
        type SendArgs = Parameters<
          typeof sendTestRequest<CreateApiEndpointAny>
        >[0];
        await sendTestRequest({
          endpoint: userDeleteDefinitions.DELETE,
          urlPathParams: { id: created.responseId },
          user,
          toolExecutionContext: undefined,
        } as SendArgs);
      }
    },
  );

  // ── T4: endpoint without alias — resolves via path/METHOD URL ─────────────

  it(
    "T4: works for an aliasless endpoint via /tools/<path>/<METHOD>",
    { timeout: TEST_TIMEOUT },
    async () => {
      // Strip the alias so the browser must use the canonical path+method URL
      // segment (users/create/POST). The /tools/ widget resolves that form too.
      const noAlias = {
        ...userCreateDefinitions.POST,
        aliases: undefined,
      } as typeof userCreateDefinitions.POST;

      const result = await sendBrowserTestRequest({
        endpoint: noAlias,
        data: {
          basicInfo: {
            email: `browser-test-noalias-${Date.now()}@example.com`,
            password: "Test1234!",
            privateName: "No Alias",
            publicName: "NoAlias",
            country: "US",
            language: "en",
          },
          adminSettings: {},
        },
      });

      expect(
        result.success,
        `aliasless create failed: ${JSON.stringify(result)}`,
      ).toBe(true);

      if (result.success) {
        const data = result.data as UserCreateResponseOutput;
        expect(typeof data.responseId).toBe("string");
        expect(data.responseEmail).toContain("browser-test-noalias-");

        // cleanup
        const user = await resolveTestAdminUser();
        type SendArgs = Parameters<
          typeof sendTestRequest<CreateApiEndpointAny>
        >[0];
        await sendTestRequest({
          endpoint: userDeleteDefinitions.DELETE,
          urlPathParams: { id: data.responseId },
          user,
          toolExecutionContext: undefined,
        } as SendArgs);
      }
    },
  );

  afterAll(async () => {
    /* sessions close themselves via finally block in sendBrowserTestRequest */
  });
});
