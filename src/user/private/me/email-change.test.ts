/**
 * Email change needs the NEW inbox: a profile save only parks the address in
 * users.pendingEmail; the link mailed to it swaps it in (verify-email,
 * purpose "email-change"). The old address stays the login until then.
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
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

import signupEndpoints from "../../public/signup/definition";
import verifyEmailDefinition from "../../public/verify-email/definition";
import { createVerificationToken } from "../../public/verify-email/token";
import meEndpoints from "./definition";
import { emailChangeConfirmEmailTemplate } from "./email";

const logger = createEndpointLogger(false, defaultLocale);
const tag = (): string =>
  `${String(Date.now())}-${String(Math.floor(Math.random() * 100000))}`;
const address = (label: string): string =>
  `test-email-change-${label}-${tag()}@example-test.invalid`;

describe("email change via confirm link", () => {
  let admin: JwtPrivatePayloadType;
  const created: string[] = [];

  const publicUser = (): {
    isPublic: true;
    leadId: string;
    roles: (typeof UserPermissionRole.PUBLIC)[];
  } => ({
    isPublic: true as const,
    leadId: admin.leadId,
    roles: [UserPermissionRole.PUBLIC],
  });

  async function signup(email: string): Promise<JwtPrivatePayloadType> {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: signupEndpoints.POST,
      data: {
        privateName: "Change Test",
        publicName: "ChangeTest",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });
    expect(res.success, JSON.stringify(res)).toBe(true);
    const found = await UserRepository.getUserByEmail(
      email,
      UserDetailLevel.STANDARD,
      defaultLocale,
      logger,
    );
    if (!found.success) {
      throw new Error("user missing");
    }
    created.push(found.data.id);
    // Verified accounts stay verified through a change
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, found.data.id));
    return {
      id: found.data.id,
      leadId: found.data.leadId,
      isPublic: false,
      roles: [UserPermissionRole.CUSTOMER],
    };
  }

  async function row(id: string): Promise<{
    email: string;
    pendingEmail: string | null;
    emailVerified: boolean;
  }> {
    const [r] = await db
      .select({
        email: users.email,
        pendingEmail: users.pendingEmail,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, id));
    if (!r) {
      throw new Error("row missing");
    }
    return r;
  }

  const requestChange = (
    user: JwtPrivatePayloadType,
    email: string,
  ): ReturnType<typeof sendTestRequest<typeof meEndpoints.POST>> =>
    sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: meEndpoints.POST,
      data: { basicInfo: { email } },
      user,
    });

  const confirm = (
    token: string,
  ): ReturnType<typeof sendTestRequest<typeof verifyEmailDefinition.POST>> =>
    sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: verifyEmailDefinition.POST,
      data: { token },
      user: publicUser(),
    });

  beforeAll(async () => {
    admin = await resolveTestAdminUser();
  });

  afterAll(async () => {
    for (const id of created) {
      await sendTestRequest({
        endpoint: userDeleteDefinitions.DELETE,
        urlPathParams: { id },
        user: admin,
        toolExecutionContext: undefined,
      });
    }
  });

  it("parks the new address, mails it, and swaps only after the link", async () => {
    const oldEmail = address("old");
    const newEmail = address("new");
    const user = await signup(oldEmail);

    const res = await requestChange(user, newEmail);
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.response.email).toBe(oldEmail);
    expect(res.data.response.pendingEmail).toBe(newEmail);
    expect(res.data.response.changesSummary.verificationRequired).toBe(true);
    expect(await row(user.id)).toEqual({
      email: oldEmail,
      pendingEmail: newEmail,
      emailVerified: true,
    });

    // GET shows the pending change too
    const me = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: meEndpoints.GET,
      user,
    });
    expect(me.success && me.data.pendingEmail).toBe(newEmail);

    // The confirm mail goes to the NEW address
    const rendered = await emailChangeConfirmEmailTemplate.render({
      requestData: { basicInfo: { email: newEmail } },
      urlPathParams: undefined as never,
      responseData: res.data,
      user,
      t: (k: string): string => k,
      locale: defaultLocale,
      logger,
      tracking: {
        leadId: undefined,
        userId: undefined,
        campaignId: undefined,
        locale: defaultLocale,
        baseUrl: "http://x",
      },
    });
    if (!rendered.success || !("toEmail" in rendered.data)) {
      throw new Error("expected a mail, got skip/error");
    }
    expect(rendered.data.toEmail).toBe(newEmail);

    // A plain verification token for the new address does not swap it
    const plain = createVerificationToken(user.id, newEmail) ?? "";
    expect((await confirm(plain)).success).toBe(false);
    expect((await row(user.id)).email).toBe(oldEmail);

    const token =
      createVerificationToken(user.id, newEmail, Date.now(), "email-change") ??
      "";
    const done = await confirm(token);
    expect(done.success, JSON.stringify(done)).toBe(true);
    if (done.success) {
      expect(done.data.emailChanged).toBe(true);
      expect(done.data.email).toBe(newEmail);
    }
    expect(await row(user.id)).toEqual({
      email: newEmail,
      pendingEmail: null,
      emailVerified: true,
    });

    // Single use: the same link does nothing now
    expect((await confirm(token)).success).toBe(false);
  }, 90_000);

  it("saving the current address cancels; a newer request voids the old link", async () => {
    const current = address("cur");
    const user = await signup(current);
    const first = address("first");
    const second = address("second");

    expect((await requestChange(user, first)).success).toBe(true);
    const firstToken =
      createVerificationToken(user.id, first, Date.now(), "email-change") ??
      "";
    expect((await requestChange(user, second)).success).toBe(true);
    expect((await row(user.id)).pendingEmail).toBe(second);
    expect((await confirm(firstToken)).success).toBe(false);

    expect((await requestChange(user, current)).success).toBe(true);
    expect(await row(user.id)).toEqual({
      email: current,
      pendingEmail: null,
      emailVerified: true,
    });
  }, 90_000);

  it("refuses the swap when another account took the address meanwhile", async () => {
    const user = await signup(address("a"));
    const other = await signup(address("b"));
    const wanted = address("wanted");

    expect((await requestChange(user, wanted)).success).toBe(true);
    const otherEmail = (await row(other.id)).email;
    await db.update(users).set({ email: wanted }).where(eq(users.id, other.id));
    try {
      const token =
        createVerificationToken(user.id, wanted, Date.now(), "email-change") ??
        "";
      const res = await confirm(token);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.errorType?.errorCode).toBe(
          ErrorResponseTypes.CONFLICT.errorCode,
        );
      }
      const after = await row(user.id);
      expect(after.email).not.toBe(wanted);
      expect(after.pendingEmail).toBeNull();
    } finally {
      await db
        .update(users)
        .set({ email: otherEmail })
        .where(eq(users.id, other.id));
    }
  }, 90_000);
});
