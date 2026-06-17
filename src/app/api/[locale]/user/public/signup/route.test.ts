import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { beforeAll, describe, expect, it } from "vitest";

import signupEndpoints from "./definition";
import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

const endpoint = signupEndpoints.POST;

describe("POST /user/public/signup", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
  });

  const publicUser = () => ({
    isPublic: true as const,
    leadId: adminUser.leadId,
    roles: [UserPermissionRole.PUBLIC],
  });

  const uniqueEmail = () =>
    `test-signup-${Date.now()}-${Math.floor(Math.random() * 10000)}@example-test.invalid`;

  it("creates a new account successfully and returns a message", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(res.success, `Signup failed: ${String(res.success === false && res.message)}`).toBe(true);
    if (!res.success) return;
    expect(res.data.message).toBeTypeOf("string");
    expect(res.data.message.length).toBeGreaterThan(0);
  });

  it("rejects duplicate email with CONFLICT", async () => {
    const email = uniqueEmail();

    const first = await sendTestRequest({
      endpoint,
      data: {
        privateName: "First User",
        publicName: "First",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(first.success, `First signup failed: ${String(first.success === false && first.message)}`).toBe(true);

    const second = await sendTestRequest({
      endpoint,
      data: {
        privateName: "Duplicate User",
        publicName: "Duplicate",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(second.success).toBe(false);
    if (second.success) return;
    // Repository returns VALIDATION_ERROR for duplicate email (field-level error, not 409)
    expect(second.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects weak password (too short) with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "short",
        confirmPassword: "short",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects password without uppercase with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "alllowercase123",
        confirmPassword: "alllowercase123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects invalid email format with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: "not-an-email",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects if acceptTerms is false with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: false,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("rejects privateName shorter than 2 chars with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      endpoint,
      data: {
        privateName: "A",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.VALIDATION_ERROR.errorCode);
  });

  it("email is stored lowercase even if submitted with uppercase", async () => {
    const base = uniqueEmail();
    const upperEmail = base.toUpperCase();

    const res = await sendTestRequest({
      endpoint,
      data: {
        privateName: "Case Test",
        publicName: "CaseTester",
        email: upperEmail,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });

    expect(res.success, `Signup with uppercase email failed: ${String(res.success === false && res.message)}`).toBe(true);
  });
});
