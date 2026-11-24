import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { SessionRepository } from "next-vibe/identity/session/repository";
import { sessions } from "next-vibe/identity/session/db";
import { loginAttempts, users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import {
  createTestUser,
  deleteTestUser,
  TEST_USER_PASSWORD,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterEach, describe, expect, it, vi } from "vitest";

import { isPaidUser, resetPaidCache } from "@/api-keys/paid";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";

import {
  encryptSecret,
  generateTotpSecret,
  totpAt,
} from "../../private/me/two-factor/totp";
import { SignupBounceReason } from "../signup/bounce-reason";
import { recordSignupDeliveryReport } from "../signup/bounces/repository";
import type { sendAccountChallenge } from "../signup/confirmation-mail";
import {
  claimAccountCode,
  requestAccountChallenge,
} from "../verify-email/account-challenge";
import { accountEmailChallenges } from "../verify-email/db";
import { scopedTranslation as verifyTranslation } from "../verify-email/i18n";
import { sessionNoticeRecipient } from "../verify-email/session-notice";
import { VerifyEmailRepository } from "../verify-email/repository";
import type { LoginPostRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";
import { LoginRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const loginT = scopedTranslation.scopedT(defaultLocale).t;
const verifyT = verifyTranslation.scopedT(defaultLocale).t;
const cleanup: Array<{ id: string; email: string }> = [];

afterEach(async () => {
  for (const { id, email } of cleanup.splice(0)) {
    resetPaidCache(id);
    await db.delete(loginAttempts).where(eq(loginAttempts.email, email));
    await deleteTestUser(id);
  }
});

async function legacyAccount() {
  const email = `legacy-confirm-${randomUUID()}@example-test.invalid`;
  const result = await createTestUser(email);
  if (!result.success) {
    return expect.fail(result.message);
  }
  const user = result.data.user;
  cleanup.push({ id: user.id, email });
  await db
    .update(users)
    .set({ emailVerified: false })
    .where(eq(users.id, user.id));
  const inbox: Array<{ code: string; token: string }> = [];
  const messageId = `<${randomUUID()}@fixture.invalid>`;
  const deliver: typeof sendAccountChallenge = async (
    _recipient,
    challenge,
  ) => {
    inbox.push(challenge);
    return { messageId, bounced: false };
  };
  const guest: JWTPublicPayloadType = {
    isPublic: true,
    leadId: user.leadId,
    roles: [UserPermissionRole.PUBLIC],
  };
  const login = (data: Partial<LoginPostRequestOutput> = {}) =>
    LoginRepository.login(
      { email, password: TEST_USER_PASSWORD, rememberMe: false, ...data },
      guest,
      defaultLocale,
      undefined,
      logger,
      Platform.NEXT_API,
      loginT,
      deliver,
    );
  const notice = () =>
    VerifyEmailRepository.handle(
      { notice: true },
      user,
      logger,
      verifyT,
      defaultLocale,
      deliver,
    );
  const openSessions = () =>
    db
      .select({ token: sessions.token })
      .from(sessions)
      .where(eq(sessions.userId, user.id));
  return {
    user,
    email,
    inbox,
    deliver,
    messageId,
    login,
    notice,
    openSessions,
    guest,
  };
}

describe("confirmation for existing accounts", () => {
  it("checks the password first, mails one code, preserves the session and requires inbox proof for a new session", async () => {
    const { user, email, inbox, login, openSessions } = await legacyAccount();
    const before = await openSessions();
    expect(before.length).toBeGreaterThan(0);
    expect(
      (
        await SessionRepository.create(
          {
            userId: user.id,
            token: randomUUID(),
            expiresAt: new Date(Date.now() + 60_000),
          },
          defaultLocale,
        )
      ).success,
    ).toBe(false);
    expect((await login({ password: "wrong-password" })).success).toBe(false);
    expect(inbox).toHaveLength(0);
    const first = await login();
    expect(!first.success && first.errorType).toEqual(
      ErrorResponseTypes.EMAIL_CONFIRMATION_REQUIRED,
    );
    await login();
    await login({ resendPending: true });
    expect(inbox).toHaveLength(1);
    const code = inbox[0]!.code;
    const wrong = code === "000000" ? "111111" : "000000";
    expect((await login({ emailCode: wrong })).success).toBe(false);
    expect(await openSessions()).toEqual(before);
    expect((await login({ emailCode: code })).success).toBe(true);
    expect((await openSessions()).length).toBe(before.length + 1);
    expect(
      (await claimAccountCode(user.id, email, code, defaultLocale)).success,
    ).toBe(false);
  }, 60_000);

  it("shows the same one-time notice for a paying account, leaves its session usable and confirms the same account by link", async () => {
    const { user, email, inbox, login, notice, openSessions, guest } =
      await legacyAccount();
    await db.insert(paymentTransactions).values({
      userId: user.id,
      amount: "1.00",
      currency: "EUR",
      status: PaymentStatus.SUCCEEDED,
    });
    const before = await openSessions();
    expect(
      (await sessionNoticeRecipient(before[0]!.token, defaultLocale))?.email,
    ).toBe(email);
    expect(
      await sessionNoticeRecipient(randomUUID(), defaultLocale),
    ).toBeNull();
    const results = await Promise.all([notice(), notice()]);
    expect(
      results.every((result) => result.success && !result.data.verified),
    ).toBe(true);
    expect((await login()).success).toBe(false);
    expect(inbox).toHaveLength(1);
    expect(
      (
        await AuthRepository.validateSession(
          before[0]!.token,
          user.id,
          defaultLocale,
          logger,
        )
      )?.id,
    ).toBe(user.id);
    expect(await isPaidUser(user.id)).toBe(true);
    const result = await VerifyEmailRepository.handle(
      { token: inbox[0]!.token },
      guest,
      logger,
      verifyT,
      defaultLocale,
    );
    expect(result.success && result.data.email).toBe(email);
    const seen = await notice();
    expect(seen.success && seen.data.verified).toBe(true);
    expect(
      await sessionNoticeRecipient(before[0]!.token, defaultLocale),
    ).toBeNull();
    expect(inbox).toHaveLength(1);
    expect(await openSessions()).toEqual(before);
    expect((await login()).success).toBe(true);
  }, 60_000);

  it("rotates the code and link together on explicit resend", async () => {
    const { email, user, inbox, login, notice, guest } = await legacyAccount();
    await notice();
    const clock = vi
      .spyOn(Date, "now")
      .mockReturnValue(Date.now() + 6 * 60_000);
    try {
      await login({ resendPending: true });
      expect(inbox).toHaveLength(2);
      expect(
        (
          await VerifyEmailRepository.handle(
            { token: inbox[0]!.token },
            guest,
            logger,
            verifyT,
            defaultLocale,
          )
        ).success,
      ).toBe(false);
      // A six-digit value can legitimately repeat after rotation.
      if (inbox[0]!.code !== inbox[1]!.code) {
        expect(
          (
            await claimAccountCode(
              user.id,
              email,
              inbox[0]!.code,
              defaultLocale,
            )
          ).success,
        ).toBe(false);
      }
      expect((await login({ emailCode: inbox[1]!.code })).success).toBe(true);
    } finally {
      clock.mockRestore();
    }
  }, 60_000);

  it("rejects the correct code once its attempt limit is exhausted", async () => {
    const { user, email, inbox, login, openSessions } = await legacyAccount();
    const before = await openSessions();
    await login();
    const wrong = inbox[0]!.code === "123456" ? "654321" : "123456";
    for (let i = 0; i < 5; i++) {
      expect(
        (await claimAccountCode(user.id, email, wrong, defaultLocale)).success,
      ).toBe(false);
    }
    expect((await login({ emailCode: inbox[0]!.code })).success).toBe(false);
    expect(await openSessions()).toEqual(before);
  }, 60_000);

  it("rejects a previously valid code after expiry and completes sign-in only after TOTP", async () => {
    const { user, inbox, login, openSessions } = await legacyAccount();
    const before = await openSessions();
    await login();
    // Advance verification time without modifying the stored challenge or its hash.
    const clock = vi
      .spyOn(Date, "now")
      .mockReturnValue(Date.now() + 31 * 60_000);
    try {
      expect((await login({ emailCode: inbox[0]!.code })).success).toBe(false);
    } finally {
      clock.mockRestore();
    }
    expect(await openSessions()).toEqual(before);
    const secret = generateTotpSecret();
    await db
      .update(users)
      .set({ twoFactorEnabled: true, twoFactorSecret: encryptSecret(secret) })
      .where(eq(users.id, user.id));
    const second = await login({ emailCode: inbox[0]!.code });
    expect(!second.success && second.errorType).toEqual(
      ErrorResponseTypes.TWO_FACTOR_REQUIRED,
    );
    expect((await login({ twoFactorCode: "wrong" })).success).toBe(false);
    expect(await openSessions()).toEqual(before);
    expect(
      (await login({ twoFactorCode: totpAt(secret, Date.now()) })).success,
    ).toBe(true);
    expect(await openSessions()).toHaveLength(before.length + 1);
  }, 60_000);

  it("keeps a permanent SMTP rejection suppressed after the resend window", async () => {
    const { user, email, login, inbox } = await legacyAccount();
    await requestAccountChallenge(
      { ...user, email, privateName: "Fixture" },
      "login",
      defaultLocale,
      logger,
      async () => ({ messageId: null, bounced: true }),
    );
    await db
      .update(accountEmailChallenges)
      .set({ sentAt: new Date(0) })
      .where(eq(accountEmailChallenges.userId, user.id));
    await login({ resendPending: true });
    expect(inbox).toHaveLength(0);
  }, 60_000);

  it("suppresses repeated delivery to invalid and bounced addresses and retries SMTP failures only on request", async () => {
    const { user, email, inbox, notice, deliver, messageId, login } =
      await legacyAccount();
    const recipient = { ...user, email, privateName: "Fixture" };
    expect(
      (
        await requestAccountChallenge(
          { ...recipient, email: "invalid" },
          "notice",
          defaultLocale,
          logger,
          deliver,
        )
      ).success,
    ).toBe(false);
    expect(inbox).toHaveLength(0);
    const failure = await requestAccountChallenge(
      recipient,
      "notice",
      defaultLocale,
      logger,
      async () => ({ messageId: null, bounced: false }),
    );
    expect(failure.success).toBe(false);
    await db
      .update(accountEmailChallenges)
      .set({ sentAt: new Date(0) })
      .where(eq(accountEmailChallenges.userId, user.id));
    expect((await notice()).success).toBe(false);
    await login();
    expect(inbox).toHaveLength(0);
    await login({ resendPending: true });
    expect(inbox).toHaveLength(1);
    expect(
      await recordSignupDeliveryReport(
        {
          messageId,
          failures: [
            { recipient: email, reason: SignupBounceReason.MAILBOX_MISSING },
          ],
        },
        new Date(),
        "fixture@example.invalid",
      ),
    ).toBe(1);
    await db
      .update(accountEmailChallenges)
      .set({ sentAt: new Date(0) })
      .where(eq(accountEmailChallenges.userId, user.id));
    await notice();
    await login({ resendPending: true });
    expect(inbox).toHaveLength(1);
  }, 60_000);
});
