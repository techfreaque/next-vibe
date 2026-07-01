import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { beforeAll, describe, expect, it } from "vitest";

import logoutEndpoints from "./definition";

const endpoint = logoutEndpoints.POST;

describe("POST /user/private/logout", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  it("logs out authenticated user and returns a message", async () => {
    const res = await sendTestRequest({
      endpoint,
      user: adminUser,
    });

    expect(res.success, `Logout failed: ${String(res.success === false && res.message)}`).toBe(true);
    if (!res.success) {return;}
    expect(res.data.message).toBeTypeOf("string");
    expect(res.data.message.length).toBeGreaterThan(0);
  });

  it("rejects unauthenticated (public) user with FORBIDDEN", async () => {
    const res = await sendTestRequest({
      endpoint,
      user: {
        isPublic: true,
        leadId: "00000000-0000-0000-0000-000000000002",
        roles: [UserPermissionRole.PUBLIC],
      },
    });

    expect(res.success).toBe(false);
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.FORBIDDEN.errorCode);
  });

  it("calling logout twice in a row both succeed (idempotent session clearing)", async () => {
    const first = await sendTestRequest({ endpoint, user: adminUser });
    expect(first.success, `First logout failed: ${String(first.success === false && first.message)}`).toBe(true);

    const second = await sendTestRequest({ endpoint, user: adminUser });
    expect(second.success, `Second logout failed: ${String(second.success === false && second.message)}`).toBe(true);
    if (!second.success) {return;}
    expect(second.data.message).toBeTypeOf("string");
  });
});
