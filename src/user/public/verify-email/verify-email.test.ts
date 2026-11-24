/**
 * Verify-email integration: a legacy unverified account builds a
 * verification mail. Its link verifies idempotently. SMTP is captured in-process.
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { success } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { SmtpSendingRepository } from "@/messenger/providers/email/smtp-client/sending/repository";
import { requestAccountChallenge } from "./account-challenge";
import definition from "./definition";
import { createVerificationToken } from "./token";

const logger = createEndpointLogger(false, defaultLocale);
const endpoint = definition.POST;

describe("verify-email", () => {
  let leadId = "";
  let email = "";
  let userId = "";

  const publicUser = () => ({
    isPublic: true as const,
    leadId,
    roles: [UserPermissionRole.PUBLIC],
  });
  const verifiedFlag = async (): Promise<boolean | undefined> =>
    (
      await db
        .select({ v: users.emailVerified })
        .from(users)
        .where(eq(users.id, userId))
    )[0]?.v;

  beforeAll(async () => {
    email = `test-verify-${crypto.randomUUID()}@example-test.invalid`;
    const result = await createTestUser(email, "Verify Test");
    if (!result.success) {
      return expect.fail(result.message);
    }
    userId = result.data.user.id;
    leadId = result.data.user.leadId;
    // This legacy account predates mandatory confirmation.
    await db
      .update(users)
      .set({ emailVerified: false })
      .where(eq(users.id, userId));
  }, 60_000);

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(userId);
    }
  });

  it("a legacy unverified account builds a verification mail with a valid link", async () => {
    expect(await verifiedFlag()).toBe(false);
    const smtp = vi.spyOn(SmtpSendingRepository, "sendEmail").mockResolvedValue(
      success({
        messageId: `<${userId}@fixture.invalid>`,
        accountId: "fixture",
        accountName: "Fixture",
        accepted: [email],
        rejected: [],
        response: "Accepted",
      }),
    );
    try {
      const result = await requestAccountChallenge(
        { id: userId, email, leadId, privateName: "Verify Test" },
        "login",
        defaultLocale,
        logger,
      );
      expect(result.success).toBe(true);
      const mail = smtp.mock.calls[0]?.[0];
      expect(mail?.to).toBe(email);
      expect(mail?.text).toMatch(/\b[0-9]{6}\b/);
      expect(mail?.text).toContain(`/${defaultLocale}/user/verify-email/`);
      expect(mail?.html).toContain(`/${defaultLocale}/user/verify-email/`);
    } finally {
      smtp.mockRestore();
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
    const wrongUser =
      createVerificationToken("00000000-0000-4000-8000-000000000000", email) ??
      "";
    expect(
      (
        await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint,
          data: { token: wrongUser },
          user: publicUser(),
        })
      ).success,
    ).toBe(false);
    expect(await verifiedFlag()).toBe(false);
    const anon = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {},
      user: publicUser(),
    });
    expect(anon.success).toBe(false);
  }, 60_000);

  it("verifies with a valid token, idempotently, and then skips the mail", async () => {
    const token = createVerificationToken(userId, email) ?? "";
    const first = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: { token },
      user: publicUser(),
    });
    expect(first.success, JSON.stringify(first)).toBe(true);
    expect(await verifiedFlag()).toBe(true);
    const second = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: { token },
      user: publicUser(),
    });
    expect(second.success && second.data.verified).toBe(true);
    expect(await verifiedFlag()).toBe(true);

    const resend = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {},
      user: {
        id: userId,
        leadId,
        isPublic: false,
        roles: [UserPermissionRole.CUSTOMER],
      },
    });
    expect(resend.success && resend.data.verified).toBe(true);
  }, 60_000);
});
