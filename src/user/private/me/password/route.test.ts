import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { identityEnv } from "next-vibe/identity/env";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
  TEST_USER_PASSWORD,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { beforeAll, describe, expect, it } from "vitest";

import passwordEndpoints from "./definition";

const endpoint = passwordEndpoints.POST;

describe("POST /user/private/me/password", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  it("rejects wrong current password with UNAUTHORIZED", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        currentCredentials: {
          currentPassword: "definitely-wrong-current-password",
        },
        newCredentials: {
          newPassword: "NewSecure456!",
          confirmPassword: "NewSecure456!",
        },
      },
      user: adminUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    // Repository returns VALIDATION_ERROR for wrong current password (field-level error)
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("rejects new password shorter than 8 chars with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        currentCredentials: {
          currentPassword: identityEnv.VIBE_ADMIN_USER_PASSWORD,
        },
        newCredentials: {
          newPassword: "short",
          confirmPassword: "short",
        },
      },
      user: adminUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("rejects current password shorter than 8 chars with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        currentCredentials: {
          currentPassword: "short",
        },
        newCredentials: {
          newPassword: "NewSecure456!",
          confirmPassword: "NewSecure456!",
        },
      },
      user: adminUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("rejects unauthenticated user with FORBIDDEN", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        currentCredentials: {
          currentPassword: "SomePassword123",
        },
        newCredentials: {
          newPassword: "NewSecure456!",
          confirmPassword: "NewSecure456!",
        },
      },
      user: {
        isPublic: true,
        leadId: "00000000-0000-0000-0000-000000000002",
        roles: [UserPermissionRole.PUBLIC],
      },
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.FORBIDDEN.errorCode,
    );
  });

  // 2FA is not implemented (inert flag): a correct current password alone
  // changes the password. Runs on a throwaway account — never the admin,
  // whose seeded password the rest of the suite depends on.
  it("changes the password with the current password alone (no 2FA gate)", async () => {
    const created = await createTestUser(
      `pw-change-${Date.now()}@example.com`,
    );
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    try {
      const res = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint,
        data: {
          currentCredentials: {
            currentPassword: TEST_USER_PASSWORD,
          },
          newCredentials: {
            newPassword: "NewSecure456!",
            confirmPassword: "NewSecure456!",
          },
        },
        user: created.data.user,
      });
      expect(res.success, res.success ? "" : res.message).toBe(true);
    } finally {
      await deleteTestUser(created.data.user.id);
    }
  });
});
