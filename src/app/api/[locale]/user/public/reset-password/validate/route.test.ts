import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { beforeAll, describe, expect, it } from "vitest";

import resetPasswordValidateEndpoints from "./definition";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

const endpoint = resetPasswordValidateEndpoints.GET;

describe("GET /user/public/reset-password/validate", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  const publicUser = () => ({
    isPublic: true as const,
    leadId: adminUser.leadId,
    roles: [UserPermissionRole.PUBLIC],
  });

  it("rejects a non-JWT token (NOT_FOUND or VALIDATION_ERROR)", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        tokenInput: {
          token: "fake-token-that-is-not-a-jwt",
        },
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    // Repository may return NOT_FOUND or VALIDATION_ERROR depending on JWT parse path
    expect([
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
      ErrorResponseTypes.NOT_FOUND.errorCode,
    ]).toContain(res.errorType?.errorCode);
    expect(res.message).toBeTypeOf("string");
    expect(res.message.length).toBeGreaterThan(0);
  });

  it("rejects empty token with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        tokenInput: {
          token: "",
        },
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects expired or unknown JWT token (NOT_FOUND or TOKEN_EXPIRED or VALIDATION_ERROR)", async () => {
    // A structurally valid JWT signed with the wrong secret — will fail verification
    const fakeJwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    const res = await sendTestRequest({
      endpoint,
      data: {
        tokenInput: {
          token: fakeJwt,
        },
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect([
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
      ErrorResponseTypes.NOT_FOUND.errorCode,
      ErrorResponseTypes.TOKEN_EXPIRED_ERROR?.errorCode,
    ].filter(Boolean)).toContain(res.errorType?.errorCode);
  });
});
