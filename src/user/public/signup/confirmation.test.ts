import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { chatThreads } from "next-vibe/agent/chat/db";
import { chatFavorites } from "next-vibe/agent/skills/favorites/db";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { verifyPassword } from "next-vibe/identity/auth/password";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { createAnonymousLead } from "next-vibe/identity/lead/middleware-ops";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { sessions } from "next-vibe/identity/session/db";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scopedTranslation as creditTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { newsletterSubscriptions } from "@/newsletter/db";
import { referralCodes, userReferrals } from "@/referral/db";

import { LoginRepository } from "../login/repository";
import { scopedTranslation as loginTranslation } from "../login/i18n";
import { SignupBounceReason } from "./bounce-reason";
import { recordSignupDeliveryReport } from "./bounces/repository";
import type { sendSignupChallenge } from "./confirmation-mail";
import { pendingSignups, signupMailAttempts } from "./db";
import type { SignupPatchRequestOutput, SignupPostRequestOutput } from "./definition";
import { signupDomainStatus, setMxResolverForTests } from "./disposable-mx";
import { suggestSignupEmail } from "./email-suggestion";
import { scopedTranslation } from "./i18n";
import { SignupRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const creditsT = creditTranslation.scopedT(defaultLocale).t;
const leadIds: string[] = [];
const accountIds: string[] = [];
const refIds: string[] = [];
const addresses: string[] = [];
const password = "SignupPass103";
const address = () => `signup-${randomUUID()}@fixture.invalid`;
async function guest(): Promise<JWTPublicPayloadType> {
  const leadId = await createAnonymousLead({ userAgent: randomUUID() }, defaultLocale, logger);
  leadIds.push(leadId);
  return { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] };
}

async function start(extra: Partial<SignupPostRequestOutput> = {}, originalLead?: JWTPublicPayloadType) {
  const user = originalLead ?? await guest();
  const email = address();
  addresses.push(email);
  const inbox: { code: string; token: string; email: string }[] = [];
  const deliver: typeof sendSignupChallenge = async (row, challenge) => {
    inbox.push({ ...challenge, email: row.email });
    return `<${randomUUID()}@fixture.invalid>`;
  };
  const started = await SignupRepository.registerUser(
    {
      email,
      password,
      confirmPassword: password,
      privateName: "Signup test",
      publicName: "Signup test",
      acceptTerms: true,
      subscribeToNewsletter: false,
      ...extra,
    },
    user,
    defaultLocale,
    logger,
    Platform.NEXT_API,
    t,
    undefined,
    deliver,
  );
  if (!started.success) return expect.fail(started.message);
  const pendingId = started.data.pendingId;
  const act = (data: SignupPatchRequestOutput, actor = user) =>
    SignupRepository.confirmation(
      { pendingId, ...data },
      actor,
      defaultLocale,
      logger,
      Platform.NEXT_API,
      t,
      undefined,
      deliver,
    );
  return { user, email, inbox, pendingId, act };
}

beforeAll(() => setMxResolverForTests(async () => ["mail.fixture.invalid"]));
afterAll(async () => {
  setMxResolverForTests(null);
  if (addresses.length)
    await db
      .delete(newsletterSubscriptions)
      .where(inArray(newsletterSubscriptions.email, addresses));
  for (const id of accountIds) await deleteTestUser(id);
  if (refIds.length) await db.delete(referralCodes).where(inArray(referralCodes.id, refIds));
  if (leadIds.length) await db.delete(leads).where(inArray(leads.id, leadIds));
});

describe("pending signup", () => {
  it("carries the original lead through correction and cross-browser confirmation", async () => {
    const admin = await resolveTestAdminUser();
    const [ref] = await db
      .insert(referralCodes)
      .values({ ownerUserId: admin.id, code: randomUUID() })
      .returning();
    refIds.push(ref.id);
    const supportedSkillId = randomUUID();
    const { user, email, pendingId, inbox, act } = await start({
      referralCode: ref.code,
      subscribeToNewsletter: true,
      supportedSkillId,
      localFavorites: [
        { skillId: "4chan", customVariantName: "My setup" },
        { skillId: "hermes", customVariantName: "My companion" },
      ],
      callbackUrl: "/en-US/threads",
    });
    const other = await guest();
    expect(await db.select().from(users).where(eq(users.email, email))).toHaveLength(0);
    const [row] = await db.select().from(pendingSignups).where(eq(pendingSignups.id, pendingId));
    expect(await verifyPassword(password, row.passwordHash)).toBe(true);
    expect(row.codeHash).not.toBe(inbox[0].code);
    expect(row.tokenHash).not.toBe(inbox[0].token);
    expect(
      await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, email)),
    ).toHaveLength(0);
    const before = await CreditRepository.getBalance(user, logger, creditsT, defaultLocale);
    expect(before.success && before.data.free).toBe(20);
    const spent = await CreditRepository.deductCreditsForFeature(user, 3, "signup-fixture", logger, creditsT, defaultLocale);
    expect(spent.success).toBe(true);
    const [thread] = await db
      .insert(chatThreads)
      .values({
        title: "Original thread",
        rootFolderId: DefaultFolderId.PUBLIC,
        leadId: user.leadId,
      })
      .returning();
    expect((await act({ resend: true })).success).toBe(false);
    const corrected = address();
    addresses.push(corrected);
    expect((await act({ newEmail: corrected }, other)).success).toBe(false);
    expect((await act({ newEmail: corrected })).success).toBe(true);
    expect(inbox.map((mail) => mail.email)).toEqual([email, corrected]);
    expect((await act({ code: inbox[0].code })).success).toBe(false);
    expect((await act({ token: inbox[0].token }, other)).success).toBe(false);
    const confirmed = await act({ token: inbox[1].token }, other);
    expect(confirmed.success && confirmed.data.redirectTo).toBe("/en-US/threads");
    const [account] = await db.select().from(users).where(eq(users.email, corrected));
    accountIds.push(account.id);
    expect(account.emailVerified).toBe(true);
    expect(await db.select({ id: sessions.id }).from(sessions).where(eq(sessions.userId, account.id))).toHaveLength(1);
    expect((await db.select({ skill: leads.skillId }).from(leads).where(eq(leads.id, user.leadId)))[0].skill).toBe(supportedSkillId);
    expect(await verifyPassword(password, account.password)).toBe(true);
    expect(
      (await db.select().from(userLeadLinks).where(eq(userLeadLinks.userId, account.id))).map(
        (link) => link.leadId,
      ),
    ).toEqual([user.leadId]);
    expect(
      (await db.select().from(chatThreads).where(eq(chatThreads.id, thread.id)))[0].userId,
    ).toBe(account.id);
    expect(
      (await db.select().from(userReferrals).where(eq(userReferrals.referredUserId, account.id)))[0]
        .referralCodeId,
    ).toBe(ref.id);
    const favorites = await db
      .select()
      .from(chatFavorites)
      .where(eq(chatFavorites.userId, account.id));
    expect(favorites.some((f) => f.skillId === "4chan" && f.customVariantName === "My setup")).toBe(
      true,
    );
    expect(favorites.some((f) => f.skillId === "hermes" && f.customVariantName === "My companion")).toBe(true);
    const after = await CreditRepository.getBalance(
      {
        isPublic: false,
        id: account.id,
        leadId: user.leadId,
        roles: [UserPermissionRole.CUSTOMER],
      },
      logger,
      creditsT,
      defaultLocale,
    );
    expect(after.success && after.data.free).toBe(90 - 3);
    expect((await act({ token: inbox[1].token })).success).toBe(false);
  }, 60000);

  it("offers pending login recovery only for the correct password and reports a bounced address", async () => {
    const { user, email, pendingId, act } = await start();
    const loginT = loginTranslation.scopedT(defaultLocale).t;
    const login = (attempt: string, resendPending = false) =>
      LoginRepository.login(
        { email, password: attempt, rememberMe: false, resendPending },
        user,
        defaultLocale,
        undefined,
        logger,
        Platform.NEXT_API,
        loginT,
      );
    const wrong = await login("WrongPassword032");
    expect(!wrong.success && wrong.message).toBe(loginT("errors.invalid_credentials"));
    const valid = await login(password);
    expect(!valid.success && valid.message).toBe(loginT("errors.pendingEmail"));
    const resend = await login(password, true);
    expect(!resend.success && resend.message).toBe(t("confirmation.cooldown"));
    const [row] = await db.select().from(pendingSignups).where(eq(pendingSignups.id, pendingId));
    expect(row.messageId).toBeTruthy();
    const report = (messageId: string | undefined, recipient: string, sentAt?: Date) =>
      recordSignupDeliveryReport(
        {
          failures: [{ recipient, reason: SignupBounceReason.POLICY }],
          messageId,
          sentAt,
          sender: "hi@unbottled.ai",
          subject: t("confirmation.link"),
        },
        new Date(),
        "hi@unbottled.ai",
      );
    expect(await report("<old@fixture.invalid>", email, row.sentAt)).toBe(0);
    expect(await report(row.messageId ?? undefined, address())).toBe(0);
    expect(await report(undefined, email)).toBe(0);
    expect(await report(undefined, email, new Date(row.sentAt.getTime() - 60_000))).toBe(0);
    const untouched = await act({});
    expect(untouched.success && untouched.data.bounced).toBe(false);
    expect(await report(row.messageId ?? undefined, email)).toBe(1);
    expect(await report(row.messageId ?? undefined, email)).toBe(0);
    const status = await act({});
    expect(status.success && status.data.bounced).toBe(true);
    expect(status.success && status.data.message).toBe(t("confirmation.bouncePolicy"));
    const newEmail = address();
    const corrected = await act({ newEmail });
    expect(corrected.success && corrected.data.bounced).toBe(false);
    expect(await report(row.messageId ?? undefined, email)).toBe(0);
    const [rotated] = await db.select().from(pendingSignups).where(eq(pendingSignups.id, pendingId));
    expect(await report(undefined, newEmail, rotated.sentAt)).toBe(1);
  });

  it("allows one resend after cooldown and limits corrections to five emails per hour", async () => {
    const { act, email, inbox } = await start();
    await db
      .update(signupMailAttempts)
      .set({ sentAt: new Date(Date.now() - 65_000) })
      .where(eq(signupMailAttempts.scope, `email:${email}`));
    const concurrent = await Promise.all([act({ resend: true }), act({ resend: true })]);
    expect(concurrent.filter((result) => result.success)).toHaveLength(1);
    for (let i = 0; i < 3; i++) expect((await act({ newEmail: address() })).success).toBe(true);
    const refused = await act({ newEmail: address() });
    expect(!refused.success && refused.message).toBe(t("confirmation.cooldown"));
    expect(inbox).toHaveLength(5);
  });

  it("retires an abandoned address when the same visitor starts the form again", async () => {
    const first = await start();
    const second = await start({}, first.user);
    expect(second.pendingId).not.toBe(first.pendingId);
    expect((await first.act({ token: first.inbox[0].token })).success).toBe(false);
    expect((await first.act({ code: first.inbox[0].code })).success).toBe(false);
    expect((await second.act({})).success).toBe(true);
  });

  it("expires both proofs and limits wrong code attempts", async () => {
    const { act, pendingId, inbox } = await start();
    const wrong = inbox[0].code === "000000" ? "111111" : "000000";
    for (let i = 0; i < 5; i++) expect((await act({ code: wrong })).success).toBe(false);
    expect((await act({ code: inbox[0].code })).success).toBe(false);
    await db
      .update(pendingSignups)
      .set({ attempts: 0, expiresAt: new Date(Date.now() - 1000) })
      .where(eq(pendingSignups.id, pendingId));
    expect((await act({ code: inbox[0].code })).success).toBe(false);
    expect((await act({ token: inbox[0].token })).success).toBe(false);
  });

  it("confirms a code once and grants the account tier without a newsletter opt-in", async () => {
    const { act, email, user, inbox } = await start();
    const attempts = await Promise.all([
      act({ code: inbox[0].code }),
      act({ code: inbox[0].code }),
    ]);
    expect(attempts.filter((result) => result.success)).toHaveLength(1);
    const [account] = await db.select().from(users).where(eq(users.email, email));
    accountIds.push(account.id);
    const balance = await CreditRepository.getBalance(
      {
        isPublic: false,
        id: account.id,
        leadId: user.leadId,
        roles: [UserPermissionRole.CUSTOMER],
      },
      logger,
      creditsT,
      defaultLocale,
    );
    expect(balance.success && balance.data.free).toBe(40);
  }, 60000);
});

describe("signup email checks", () => {
  it("suggests a correction without modifying the local part", () => {
    expect(suggestSignupEmail("Sam+tag@gmial.com")).toBe("Sam+tag@gmail.com");
    expect(suggestSignupEmail("Sam@outlook.con")).toBe("Sam@outlook.com");
    expect(suggestSignupEmail("Sam@ordinary.com")).toBeNull();
  });
  it("accepts MX or implicit address records, rejects null MX and missing hosts, and fails open on DNS timeouts", async () => {
    setMxResolverForTests(async () => ["."]);
    expect(await signupDomainStatus("fixture.invalid")).toBe("undeliverable");
    setMxResolverForTests(async () => []);
    expect(await signupDomainStatus("fixture.invalid", async () => true)).toBe("ok");
    expect(await signupDomainStatus("fixture.invalid", async () => false)).toBe("undeliverable");
    setMxResolverForTests(async () => new Promise<string[]>(() => undefined));
    expect(await signupDomainStatus("fixture.invalid")).toBe("ok");
  });
});
