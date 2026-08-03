/**
 * Remote Connection connect-reverse — Unit Tests
 *
 * Tests the register (POST) and update (PATCH) endpoints via sendTestRequest.
 * Full E2E (token push, subfolder creation on hermes) is in connect/connect.test.ts.
 *
 *   CR1  — POST with missing instanceId fails validation
 *   CR2  — POST with missing localUrl fails validation
 *   CR3  — POST with invalid localUrl fails validation
 *   CR4  — POST is admin-only
 *   CRU1 — PATCH update with unknown instanceId returns not-found
 *   CRU2 — PATCH update is admin-only
 */

import "server-only";

import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { sendTestRequest } from "../../tooling/testing/testing-suite/send-test-request";
import { describe, expect, it } from "vitest";

import definitions from "./definition";
import updateDefinitions from "./update/definition";

const customerUser: JwtPrivatePayloadType = {
  id: "00000000-0000-0000-0000-000000000001",
  leadId: "00000000-0000-0000-0000-000000000001",
  roles: [UserPermissionRole.CUSTOMER],
  isPublic: false,
};

describe("Remote Connection connect-reverse", () => {
  // ── CR1 ────────────────────────────────────────────────────────────────────

  it("CR1: POST register rejects empty instanceId", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: definitions.POST,
      data: {
        instanceId: "",
        localUrl: "http://localhost:3002",
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: false,
        },
      },
    });

    expect(result.success, "CR1: must fail validation").toBe(false);
  });

  // ── CR2 ────────────────────────────────────────────────────────────────────

  it("CR2: POST register rejects missing localUrl", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: definitions.POST,
      // @ts-expect-error intentional — testing missing required field
      data: { instanceId: "hermes" },
    });

    expect(result.success, "CR2: must fail validation").toBe(false);
  });

  // ── CR3 ────────────────────────────────────────────────────────────────────

  it("CR3: POST register rejects invalid URL for localUrl", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: definitions.POST,
      data: {
        instanceId: "hermes",
        localUrl: "not-a-url",
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: false,
        },
      },
    });

    expect(result.success, "CR3: must fail — invalid URL").toBe(false);
  });

  // ── CR4 ────────────────────────────────────────────────────────────────────

  it("CR4: POST register is admin-only", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: definitions.POST,
      data: {
        instanceId: "hermes",
        localUrl: "http://localhost:3002",
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: false,
        },
      },
      user: customerUser,
    });

    expect(result.success, "CR4: customer must be rejected").toBe(false);
  });

  // ── CRU1 ───────────────────────────────────────────────────────────────────

  it("CRU1: PATCH update returns not-found for unknown instanceId", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: updateDefinitions.PATCH,
      data: {
        instanceId: "does-not-exist-xyz",
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: true,
        },
      },
    });

    expect(result.success, "CRU1: must fail — no reverse entry").toBe(false);
  });

  // ── CRU2 ───────────────────────────────────────────────────────────────────

  it("CRU2: PATCH update is admin-only", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: updateDefinitions.PATCH,
      data: {
        instanceId: "hermes",
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: true,
        },
      },
      user: customerUser,
    });

    expect(result.success, "CRU2: customer must be rejected").toBe(false);
  });
});
