/**
 * Remote Connection sync/providers — Unit Tests
 *
 *   SP1  — GET returns list of registered providers
 *   SP2  — GET is admin-only
 *   SP3  — Provider list includes expected domains (memories, documents, skills)
 */

import "server-only";

import { describe, expect, it } from "vitest";

import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import endpoints from "./definition";

const customerUser: JwtPrivatePayloadType = {
  id: "00000000-0000-0000-0000-000000000001",
  leadId: "00000000-0000-0000-0000-000000000001",
  roles: [UserPermissionRole.CUSTOMER],
  isPublic: false,
};

describe("Remote Connection sync/providers", () => {
  // ── SP1 ────────────────────────────────────────────────────────────────────

  it("SP1: GET returns providers array", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.GET,
    });

    expect(result.success, "SP1: expected success").toBe(true);
    if (!result.success) {return;}
    expect(
      Array.isArray(result.data.providers),
      "SP1: providers must be array",
    ).toBe(true);
  });

  // ── SP2 ────────────────────────────────────────────────────────────────────

  it("SP2: GET is admin-only", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.GET,
      user: customerUser,
    });

    expect(result.success, "SP2: customer must be rejected").toBe(false);
  });

  // ── SP3 ────────────────────────────────────────────────────────────────────

  it("SP3: provider list includes core sync domains", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.GET,
    });

    expect(result.success, "SP3: expected success").toBe(true);
    if (!result.success) {return;}

    const keys = result.data.providers.map((p) => p.key);
    expect(keys, "SP3: must include memories").toContain("memories");
    expect(keys, "SP3: must include documents").toContain("documents");
    expect(keys, "SP3: must include skills").toContain("skills");
  });
});
