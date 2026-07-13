import { beforeAll, describe, expect, it } from "vitest";

import { env } from "@/env/env";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import loginOptionsEndpoints from "./definition";

const endpoint = loginOptionsEndpoints.GET;

describe("GET /user/public/login/options", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  const publicUser = () => ({
    isPublic: true as const,
    leadId: adminUser.leadId,
    roles: [UserPermissionRole.PUBLIC],
  });

  it("returns general login options without email", async () => {
    const res = await sendTestRequest({
      streamContext: undefined,
      endpoint,
      data: {},
      user: publicUser(),
    });

    expect(
      res.success,
      `GET login options failed: ${String(res.success === false && res.message)}`,
    ).toBe(true);
    if (!res.success) return;

    const { response } = res.data;
    expect(response.success).toBe(true);
    expect(response.message).toBeTypeOf("string");
    expect(response.loginMethods.password.enabled).toBe(true);
    expect(response.loginMethods.password.passwordDescription).toBeTypeOf(
      "string",
    );
    expect(response.loginMethods.social).toBeDefined();
    expect(response.loginMethods.social.providers).toBeInstanceOf(Array);
    expect(response.security.maxAttempts).toBeTypeOf("number");
    expect(response.security.maxAttempts).toBeGreaterThan(0);
    expect(response.security.securityDescription).toBeTypeOf("string");
  });

  it("returns user-specific options when email is provided for known user", async () => {
    const res = await sendTestRequest({
      streamContext: undefined,
      endpoint,
      data: { email: env.VIBE_ADMIN_USER_EMAIL },
      user: publicUser(),
    });

    expect(
      res.success,
      `GET login options with email failed: ${String(res.success === false && res.message)}`,
    ).toBe(true);
    if (!res.success) return;

    const { response } = res.data;
    expect(response.success).toBe(true);
    expect(response.forUser).toBe(env.VIBE_ADMIN_USER_EMAIL);
    expect(response.loginMethods.password.enabled).toBe(true);
    expect(response.security.requireTwoFactor).toBe(false);
  });

  it("returns NOT_FOUND for unknown email", async () => {
    const res = await sendTestRequest({
      streamContext: undefined,
      endpoint,
      data: { email: "nobody-123456@example-nonexistent.invalid" },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    // Repository returns NOT_FOUND when email not found
    const { ErrorResponseTypes } =
      await import("next-vibe/core/route/response.schema");
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });

  it("returns VALIDATION_ERROR for invalid email format", async () => {
    const res = await sendTestRequest({
      streamContext: undefined,
      endpoint,
      data: { email: "not-an-email" },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    const { ErrorResponseTypes } =
      await import("next-vibe/core/route/response.schema");
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("social providers array has expected shape when present", async () => {
    const res = await sendTestRequest({
      streamContext: undefined,
      endpoint,
      data: {},
      user: publicUser(),
    });

    expect(res.success).toBe(true);
    if (!res.success) return;

    const providers = res.data.response.loginMethods.social.providers;
    for (const provider of providers) {
      expect(provider.name).toBeTypeOf("string");
      expect(provider.id).toBeTypeOf("string");
      expect(typeof provider.enabled).toBe("boolean");
      expect(provider.description).toBeTypeOf("string");
    }
  });
});
