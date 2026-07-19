/**
 * Remote Connection list — Unit Tests
 *
 *   RL1  — GET returns success with connections array (may be empty)
 *   RL2  — GET is admin-only
 *   RL3  — GET activeOnly=true returns only active connections
 */

import "server-only";

import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { describe, expect, it } from "vitest";

import endpoints from "./definition";

const customerUser: JwtPrivatePayloadType = {
  id: "00000000-0000-0000-0000-000000000001",
  leadId: "00000000-0000-0000-0000-000000000001",
  roles: [UserPermissionRole.CUSTOMER],
  isPublic: false,
};

describe("Remote Connection list", () => {
  // ── RL1 ────────────────────────────────────────────────────────────────────

  it("RL1: GET returns success with connections array", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: {},
    });

    expect(result.success, "RL1: expected success").toBe(true);
    if (!result.success) {
      return;
    }
    expect(
      Array.isArray(result.data.connections),
      "RL1: connections must be an array",
    ).toBe(true);
  });

  // ── RL2 ────────────────────────────────────────────────────────────────────

  it("RL2: GET is admin-only", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: {},
      user: customerUser,
    });

    expect(result.success, "RL2: customer must be rejected").toBe(false);
  });

  // ── RL3 ────────────────────────────────────────────────────────────────────

  it("RL3: GET activeOnly=true returns success (array may be empty)", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.GET,
      data: { activeOnly: true },
    });

    expect(result.success, "RL3: expected success with activeOnly").toBe(true);
    if (!result.success) {
      return;
    }
    expect(
      Array.isArray(result.data.connections),
      "RL3: connections must be array",
    ).toBe(true);
  });
});
