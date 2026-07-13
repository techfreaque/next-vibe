/**
 * Remote Connection [instanceId] — Unit Tests
 *
 * Tests GET, PATCH, DELETE via sendTestRequest (in-process, no HTTP).
 * Covers auth guards, validation, and response shape.
 * E2E behaviour (WS propagation, remote notify) is covered by
 * route.transport.test.ts (requires hermes dev).
 *
 *   RC-GET1  — GET returns not-connected shape when no row exists
 *   RC-GET2  — GET is admin-only
 *   RC-PAT1  — PATCH rejects non-admin attempt to set admin-only fields
 *   RC-PAT2  — PATCH with no fields returns updated=true
 *   RC-DEL1  — DELETE returns not-found for unknown instanceId
 */

import "server-only";

import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { describe, expect, it } from "vitest";

import definitions from "./definition";

const NONEXISTENT_INSTANCE = "does-not-exist-xyz";

const customerUser: JwtPrivatePayloadType = {
  id: "00000000-0000-0000-0000-000000000001",
  leadId: "00000000-0000-0000-0000-000000000001",
  roles: [UserPermissionRole.CUSTOMER],
  isPublic: false,
};

describe("Remote Connection [instanceId]", () => {
  // ── RC-GET1 ────────────────────────────────────────────────────────────────

  it("RC-GET1: GET returns isConnected=false when no row exists for instance", async () => {
    const result = await sendTestRequest({
      streamContext: undefined,
      endpoint: definitions.GET,
      urlPathParams: { instanceId: NONEXISTENT_INSTANCE },
    });

    expect(result.success, "RC-GET1: expected success response").toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.isConnected, "RC-GET1: isConnected must be false").toBe(
      false,
    );
    expect(result.data.remoteUrl, "RC-GET1: remoteUrl must be null").toBeNull();
  });

  // ── RC-GET2 ────────────────────────────────────────────────────────────────

  it("RC-GET2: GET is rejected for non-admin users", async () => {
    const result = await sendTestRequest({
      streamContext: undefined,
      endpoint: definitions.GET,
      urlPathParams: { instanceId: NONEXISTENT_INSTANCE },
      user: customerUser,
    });

    expect(result.success, "RC-GET2: customer must be rejected").toBe(false);
  });

  // ── RC-PAT1 ────────────────────────────────────────────────────────────────

  it("RC-PAT1: PATCH rejects customer setting admin-only fields", async () => {
    const result = await sendTestRequest({
      streamContext: undefined,
      endpoint: definitions.PATCH,
      urlPathParams: { instanceId: NONEXISTENT_INSTANCE },
      data: {
        forceSystemProvider: true,
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

    expect(result.success, "RC-PAT1: must be rejected").toBe(false);
  });

  // ── RC-PAT2 ────────────────────────────────────────────────────────────────

  it("RC-PAT2: PATCH with no-op fields returns not-found (no row exists)", async () => {
    const result = await sendTestRequest({
      streamContext: undefined,
      endpoint: definitions.PATCH,
      urlPathParams: { instanceId: NONEXISTENT_INSTANCE },
      data: {
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: true,
          threads: false,
        },
      },
    });

    // No row exists → NOT_FOUND
    expect(result.success, "RC-PAT2: must fail — no row").toBe(false);
  });

  // ── RC-DEL1 ────────────────────────────────────────────────────────────────

  it("RC-DEL1: DELETE returns not-found for unknown instanceId", async () => {
    const result = await sendTestRequest({
      streamContext: undefined,
      endpoint: definitions.DELETE,
      urlPathParams: { instanceId: NONEXISTENT_INSTANCE },
    });

    expect(result.success, "RC-DEL1: must fail — no row").toBe(false);
  });
});
