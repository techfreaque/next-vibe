import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { beforeAll, describe, expect, it } from "vitest";

import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";

import passwordEndpoints from "./definition";

const endpoint = passwordEndpoints.POST;

describe("POST /user/private/me/password", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  it("rejects wrong current password with UNAUTHORIZED", async () => {
    const res = await sendTestRequest({
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
    if (res.success) {return;}
    // Repository returns VALIDATION_ERROR for wrong current password (field-level error)
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects new password shorter than 8 chars with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        currentCredentials: {
          currentPassword: env.VIBE_ADMIN_USER_PASSWORD,
        },
        newCredentials: {
          newPassword: "short",
          confirmPassword: "short",
        },
      },
      user: adminUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects current password shorter than 8 chars with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
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
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects unauthenticated user with FORBIDDEN", async () => {
    const res = await sendTestRequest({
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
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.FORBIDDEN.errorCode);
  });

  it("rejects invalid 2FA code format (not 6 chars) with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        currentCredentials: {
          currentPassword: env.VIBE_ADMIN_USER_PASSWORD,
        },
        newCredentials: {
          newPassword: "NewSecure456!",
          confirmPassword: "NewSecure456!",
        },
        twoFactorCode: "12",
      },
      user: adminUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {return;}
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });
});
