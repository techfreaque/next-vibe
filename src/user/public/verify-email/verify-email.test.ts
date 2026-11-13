/**
 * Verify-email integration: signup leaves the email unverified and builds a
 * verification mail; the token verifies (idempotent); bad tokens are rejected.
 * Mail is never sent (the test instance has no SMTP account; we only render).
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import userDeleteDefinitions from "@/users/user/[id]/definition";

import signupEndpoints from "../signup/definition";
import definition from "./definition";
import { verifyEmailSignupEmailTemplate } from "./email";
import { createVerificationToken } from "./token";

const logger = createEndpointLogger(false, defaultLocale);
const endpoint = definition.POST;

describe("verify-email", () => {
  let admin: JwtPrivatePayloadType;
  let email = "";
  let userId = "";

  const publicUser = () => ({
    isPublic: true as const,
    leadId: admin.leadId,
    roles: [UserPermissionRole.PUBLIC],
  });
  const verifiedFlag = async (): Promise<boolean | undefined> =>
    (await db.select({ v: users.emailVerified }).from(users).where(eq(users.id, userId)))[0]?.v;

  beforeAll(async () => {
    admin = await resolveTestAdminUser();
    email = `test-verify-${Date.now()}-${Math.floor(Math.random() * 100000)}@example-test.invalid`;
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: signupEndpoints.POST,
      data: {
        privateName: "Verify Test",
        publicName: "VerifyTest",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });
    expect(res.success).toBe(true);
    const found = await UserRepository.getUserByEmail(email, UserDetailLevel.STANDARD, defaultLocale, logger);
    if (!found.success) {
      throw new Error("user missing");
    }
    userId = found.data.id;
  }, 60_000);

  afterAll(async () => {
    await sendTestRequest({
      endpoint: userDeleteDefinitions.DELETE,
      urlPathParams: { id: userId },
      user: admin,
      toolExecutionContext: undefined,
    });
  });

  it("signup leaves the email unverified and builds a verification mail with a valid link", async () => {
    expect(await verifiedFlag()).toBe(false);
    const rendered = await verifyEmailSignupEmailTemplate.render({
      requestData: {
        privateName: "Verify Test",
        publicName: "VerifyTest",
        email,
        password: "x",
        confirmPassword: "x",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      urlPathParams: undefined as never,
      responseData: { message: "" } as never,
      user: publicUser() as never,
      t: (k: string): string => k,
      locale: defaultLocale,
      logger,
      tracking: { leadId: undefined, userId: undefined, campaignId: undefined, locale: defaultLocale, baseUrl: "http://x" },
    });
    expect(rendered.success).toBe(true);
    if (rendered.success && "toEmail" in rendered.data) {
      expect(rendered.data.toEmail).toBe(email);
    } else {
      throw new Error("expected a mail, got skip/error");
    }
  }, 60_000);

  it("rejects bad tokens and logged-out resend", async () => {
    const bad = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: { token: "this-is-not-a-valid-token-at-all" },
      user: publicUser(),
    });
    expect(bad.success).toBe(false);
    const wrongUser = createVerificationToken("00000000-0000-4000-8000-000000000000", email) ?? "";
    expect((await sendTestRequest({ toolExecutionContext: undefined, endpoint, data: { token: wrongUser }, user: publicUser() })).success).toBe(false);
    expect(await verifiedFlag()).toBe(false);
    const anon = await sendTestRequest({ toolExecutionContext: undefined, endpoint, data: {}, user: publicUser() });
    expect(anon.success).toBe(false);
  }, 60_000);

  it("verifies with a valid token, idempotently, and then skips the mail", async () => {
    const token = createVerificationToken(userId, email) ?? "";
    const first = await sendTestRequest({ toolExecutionContext: undefined, endpoint, data: { token }, user: publicUser() });
    expect(first.success, JSON.stringify(first)).toBe(true);
    expect(await verifiedFlag()).toBe(true);
    const second = await sendTestRequest({ toolExecutionContext: undefined, endpoint, data: { token }, user: publicUser() });
    expect(second.success && second.data.verified).toBe(true);
    expect(await verifiedFlag()).toBe(true);

    const resend = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {},
      user: { id: userId, leadId: admin.leadId, isPublic: false, roles: [UserPermissionRole.CUSTOMER] },
    });
    expect(resend.success && resend.data.verified).toBe(true);
  }, 60_000);
});
