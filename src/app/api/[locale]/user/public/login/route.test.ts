import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { beforeAll, describe, expect, it } from "vitest";

import loginEndpoints from "./definition";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { env } from "@/config/env";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";

const endpoint = loginEndpoints.POST;

describe("POST /user/public/login", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  const publicUser = () => ({
    isPublic: true as const,
    leadId: adminUser.leadId,
    roles: [UserPermissionRole.PUBLIC],
  });

  it("succeeds with correct credentials and returns token + leadId", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        email: env.VIBE_ADMIN_USER_EMAIL,
        password: env.VIBE_ADMIN_USER_PASSWORD,
        rememberMe: true,
      },
      user: publicUser(),
    });

    expect(res.success, `Login failed: ${String(res.success === false && res.message)}`).toBe(true);
    if (!res.success) return;

    expect(res.data.message).toBeTypeOf("string");
    expect(res.data.message.length).toBeGreaterThan(0);
    expect(res.data.token).toBeTypeOf("string");
    expect(res.data.token!.length).toBeGreaterThan(20);
    expect(res.data.leadId).toBeTypeOf("string");
    expect(res.data.leadId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("rejects wrong password with UNAUTHORIZED", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        email: env.VIBE_ADMIN_USER_EMAIL,
        password: "definitely-wrong-password-xyz",
        rememberMe: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.UNAUTHORIZED.errorCode);
  });

  it("rejects non-existent email with UNAUTHORIZED (not user-enumeration)", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        email: "nobody-at-all-does-not-exist@example.com",
        password: "SomePassword123",
        rememberMe: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    // Must return UNAUTHORIZED (not NOT_FOUND) to prevent user enumeration
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.UNAUTHORIZED.errorCode);
  });

  it("rejects invalid email format with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        email: "not-an-email",
        password: "SomePassword123",
        rememberMe: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects empty password with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        email: env.VIBE_ADMIN_USER_EMAIL,
        password: "",
        rememberMe: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rememberMe=false still returns a valid token", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        email: env.VIBE_ADMIN_USER_EMAIL,
        password: env.VIBE_ADMIN_USER_PASSWORD,
        rememberMe: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(res.data.token).toBeTypeOf("string");
    expect(res.data.token!.length).toBeGreaterThan(20);
  });

  it("email is case-insensitive (uppercase email matches lowercase stored)", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        email: env.VIBE_ADMIN_USER_EMAIL.toUpperCase(),
        password: env.VIBE_ADMIN_USER_PASSWORD,
        rememberMe: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(true);
  });
});
