/**
 * Signup newsletter opt-in (requires the dev DB, no mail is sent):
 * - unticked: no subscription, the in-chat +20 offer stays AVAILABLE
 * - ticked: a real pending subscription on the new account (no extra confirm
 *   mail; the verification mail says its link confirms the newsletter too)
 * - clicking the verification link confirms it: offer ACTIVE, +20 on the pool
 * - a verification link issued BEFORE a subscription existed never confirms it
 */

import { render } from "@react-email/render";
import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { FREE_POOL_CLAIMS_START } from "@/credits/anti-farming/config";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { NewsletterConfirmRepository } from "@/newsletter/confirm/repository";
import creditBonusEndpoints from "@/newsletter/credit-bonus/definition";
import { NewsletterCreditOffer } from "@/newsletter/credit-bonus/enum";
import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import verifyEmailEndpoints from "../verify-email/definition";
import { verifyEmailSignupEmailTemplate } from "../verify-email/email";
import { scopedTranslation as verifyEmailScopedTranslation } from "../verify-email/i18n";
import { createVerificationToken } from "../verify-email/token";
import signupEndpoints from "./definition";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const userBase = FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn;
/** Accounts created now are grandfathered until the account-rules cutoff */
function createdBeforeCutoff(): boolean {
  return Date.now() < FREE_POOL_CLAIMS_START.getTime();
}
const createdLeadIds: string[] = [];
const createdUserIds: string[] = [];
const createdEmails: string[] = [];
let admin: JwtPrivatePayloadType;

function uniqueEmail(tag: string): string {
  return `signup-nl-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example-test.invalid`;
}

async function createGuestLead(): Promise<string> {
  const { language, country } = getLanguageAndCountryFromLocale(defaultLocale);
  const [lead] = await db
    .insert(leads)
    .values({
      businessName: "",
      status: LeadStatus.WEBSITE_USER,
      source: LeadSource.WEBSITE,
      country,
      language,
    })
    .returning({ id: leads.id });
  createdLeadIds.push(lead.id);
  return lead.id;
}

/** Sign up through the endpoint; returns the account JWT (signup lead). */
async function signup(
  tag: string,
  subscribeToNewsletter: boolean,
): Promise<{ user: JwtPrivatePayloadType; email: string }> {
  const leadId = await createGuestLead();
  const email = uniqueEmail(tag);
  createdEmails.push(email);
  const res = await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint: signupEndpoints.POST,
    data: {
      privateName: "Newsletter Optin",
      publicName: "NewsletterOptin",
      email,
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      acceptTerms: true,
      subscribeToNewsletter,
    },
    user: { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] },
  });
  expect(res.success, JSON.stringify(res)).toBe(true);
  const [row] = await db
    .select({ id: users.id, marketingConsent: users.marketingConsent })
    .from(users)
    .where(eq(users.email, email));
  expect(row).toBeDefined();
  createdUserIds.push(row.id);
  expect(row.marketingConsent).toBe(subscribeToNewsletter);
  return {
    email,
    user: {
      id: row.id,
      leadId,
      isPublic: false,
      roles: [UserPermissionRole.CUSTOMER],
    },
  };
}

async function subscriptionsFor(
  email: string,
): Promise<Array<typeof newsletterSubscriptions.$inferSelect>> {
  return db
    .select()
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email));
}

async function getOffer(user: JwtPayloadType): Promise<string | undefined> {
  const res = await sendTestRequest({
    endpoint: creditBonusEndpoints.GET,
    user,
    toolExecutionContext: undefined,
  });
  expect(res.success, JSON.stringify(res)).toBe(true);
  return res.success ? res.data.offer : undefined;
}

async function freeBalance(user: JwtPayloadType): Promise<number> {
  const res = await CreditRepository.getBalance(
    user,
    logger,
    creditsT,
    defaultLocale,
  );
  return res.success ? res.data.free : -1;
}

async function verify(token: string, leadId: string): Promise<void> {
  const res = await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint: verifyEmailEndpoints.POST,
    data: { token },
    user: { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] },
  });
  expect(res.success, JSON.stringify(res)).toBe(true);
}

/** Render the signup verification mail; true when it carries the newsletter line. */
async function verifyMailMentionsNewsletter(email: string): Promise<boolean> {
  const rendered = await verifyEmailSignupEmailTemplate.render({
    requestData: {
      privateName: "Newsletter Optin",
      publicName: "NewsletterOptin",
      email,
      password: "x",
      confirmPassword: "x",
      acceptTerms: true,
      subscribeToNewsletter: true,
    },
    urlPathParams: undefined as never,
    responseData: { message: "" } as never,
    user: {
      isPublic: true,
      leadId: admin.leadId,
      roles: [UserPermissionRole.PUBLIC],
    } as never,
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
  if (!rendered.success || !("jsx" in rendered.data)) {
    throw new Error("expected a verification mail");
  }
  const html = await render(rendered.data.jsx);
  const { t } = verifyEmailScopedTranslation.scopedT(defaultLocale);
  const line = t("email.newsletter", {
    credits: FREE_CREDIT_ALLOWANCE.newsletterBonus,
  });
  return html.includes(line.slice(0, 40));
}

beforeAll(async () => {
  admin = await resolveTestAdminUser();
});

afterAll(async () => {
  if (createdEmails.length > 0) {
    await db
      .delete(newsletterSubscriptions)
      .where(inArray(newsletterSubscriptions.email, createdEmails));
  }
  for (const id of createdUserIds) {
    await sendTestRequest({
      endpoint: userDeleteDefinitions.DELETE,
      urlPathParams: { id },
      user: admin,
      toolExecutionContext: undefined,
    });
  }
  if (createdLeadIds.length > 0) {
    await db.delete(leads).where(inArray(leads.id, createdLeadIds));
  }
});

describe("signup newsletter opt-in", () => {
  it("unticked: no subscription, offer stays AVAILABLE", async () => {
    const { user, email } = await signup("off", false);
    expect(await subscriptionsFor(email)).toHaveLength(0);
    expect(
      await NewsletterConfirmRepository.hasPendingForAccount(user.id, email),
    ).toBe(false);
    expect(await verifyMailMentionsNewsletter(email)).toBe(false);
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.AVAILABLE);
  }, 60_000);

  it("ticked: pending subscription, verification link confirms it and adds the bonus once", async () => {
    const { user, email } = await signup("on", true);
    const [sub] = await subscriptionsFor(email);
    expect(sub?.userId).toBe(user.id);
    expect(sub?.status).toBe(NewsletterSubscriptionStatus.SUBSCRIBED);
    expect(sub?.confirmedAt).toBeNull();
    // The verification mail carries the newsletter line
    expect(
      await NewsletterConfirmRepository.hasPendingForAccount(user.id, email),
    ).toBe(true);
    expect(await verifyMailMentionsNewsletter(email)).toBe(true);
    expect(await getOffer(user)).toBe(
      NewsletterCreditOffer.PENDING_CONFIRMATION,
    );
    // Created before the account-rules cutoff: grandfathered, no verification
    // needed yet (anti-farming.test.ts covers new accounts)
    expect(await freeBalance(user)).toBe(
      createdBeforeCutoff() ? userBase : FREE_CREDIT_ALLOWANCE.guest,
    );

    const token = createVerificationToken(user.id, email) ?? "";
    await verify(token, user.leadId);
    const [confirmed] = await subscriptionsFor(email);
    expect(confirmed?.confirmedAt).not.toBeNull();
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.ACTIVE);
    expect(await freeBalance(user)).toBe(
      userBase + FREE_CREDIT_ALLOWANCE.newsletterBonus,
    );

    // Second click changes nothing; the bonus is not stacked
    await verify(token, user.leadId);
    expect(await freeBalance(user)).toBe(
      userBase + FREE_CREDIT_ALLOWANCE.newsletterBonus,
    );

    // Unsubscribed after having the bonus: never offered again
    await db
      .update(newsletterSubscriptions)
      .set({ status: NewsletterSubscriptionStatus.UNSUBSCRIBED })
      .where(eq(newsletterSubscriptions.email, email));
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.NOT_ELIGIBLE);
  }, 60_000);

  it("a verification link issued before the subscription never confirms it", async () => {
    const { user, email } = await signup("late", false);
    const oldToken =
      createVerificationToken(user.id, email, Date.now() - 60_000) ?? "";
    const claimed = await sendTestRequest({
      endpoint: creditBonusEndpoints.POST,
      user,
      toolExecutionContext: undefined,
    });
    expect(claimed.success, JSON.stringify(claimed)).toBe(true);
    expect(await getOffer(user)).toBe(
      NewsletterCreditOffer.PENDING_CONFIRMATION,
    );

    await verify(oldToken, user.leadId);
    const [sub] = await subscriptionsFor(email);
    expect(sub?.confirmedAt).toBeNull();
    expect(await getOffer(user)).toBe(
      NewsletterCreditOffer.PENDING_CONFIRMATION,
    );
  }, 60_000);
});
