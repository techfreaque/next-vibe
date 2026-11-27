import { confirmedTestSignup } from "next-vibe/tooling/testing/testing-suite/confirmed-signup";
/** Confirmed signup and subsequent newsletter consent on the same account. */

import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import type { JwtPayloadType, JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import newsletterConfirmEndpoints from "@/newsletter/confirm/definition";
import { NewsletterConfirmRepository } from "@/newsletter/confirm/repository";
import creditBonusEndpoints from "@/newsletter/credit-bonus/definition";
import { NewsletterCreditOffer } from "@/newsletter/credit-bonus/enum";
import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import verifyEmailEndpoints from "../verify-email/definition";
import { createVerificationToken } from "../verify-email/token";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const userBase = FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn;
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
  const res = await confirmedTestSignup(
    {
      privateName: "Newsletter Optin",
      publicName: "NewsletterOptin",
      email,
      password: "SecurePass123",
      confirmPassword: "SecurePass123",
      acceptTerms: true,
      subscribeToNewsletter,
    },
    { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] },
  );
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
  return db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
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
  const res = await CreditRepository.getBalance(user, logger, creditsT, defaultLocale);
  return res.success ? res.data.free : -1;
}

async function confirmNewsletter(token: string): Promise<void> {
  const res = await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint: newsletterConfirmEndpoints.POST,
    data: { token },
    user: admin,
  });
  expect(res.success, JSON.stringify(res)).toBe(true);
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
    expect(await NewsletterConfirmRepository.hasPendingForAccount(user.id, email)).toBe(false);
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.AVAILABLE);
  }, 60_000);

  it("ticked: subscribed at signup, the bonus waits for the welcome email click", async () => {
    const { user, email } = await signup("on", true);
    const [sub] = await subscriptionsFor(email);
    expect(sub?.userId).toBe(user.id);
    expect(sub?.status).toBe(NewsletterSubscriptionStatus.SUBSCRIBED);
    // Signup no longer auto-confirms: the welcome email carries the link
    expect(sub?.confirmedAt).toBeNull();
    expect(sub?.confirmationToken).toBeTruthy();
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.PENDING_CONFIRMATION);
    expect(await freeBalance(user)).toBe(userBase);

    await confirmNewsletter(sub?.confirmationToken ?? "");
    const [confirmed] = await subscriptionsFor(email);
    expect(confirmed?.confirmedAt).toBeInstanceOf(Date);
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.ACTIVE);
    expect(await freeBalance(user)).toBe(userBase + FREE_CREDIT_ALLOWANCE.newsletterBonus);

    // Second click changes nothing; the bonus is not stacked
    await confirmNewsletter(sub?.confirmationToken ?? "");
    expect(await freeBalance(user)).toBe(userBase + FREE_CREDIT_ALLOWANCE.newsletterBonus);

    // Unsubscribed after having the bonus: never offered again
    await db
      .update(newsletterSubscriptions)
      .set({ status: NewsletterSubscriptionStatus.UNSUBSCRIBED })
      .where(eq(newsletterSubscriptions.email, email));
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.NOT_ELIGIBLE);
  }, 60_000);

  it("a verification link issued before the subscription never confirms it", async () => {
    const { user, email } = await signup("late", false);
    const oldToken = createVerificationToken(user.id, email, Date.now() - 60_000) ?? "";
    const claimed = await sendTestRequest({
      endpoint: creditBonusEndpoints.POST,
      user,
      toolExecutionContext: undefined,
    });
    expect(claimed.success, JSON.stringify(claimed)).toBe(true);
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.PENDING_CONFIRMATION);

    await verify(oldToken, user.leadId);
    const [sub] = await subscriptionsFor(email);
    expect(sub?.confirmedAt).toBeNull();
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.PENDING_CONFIRMATION);
  }, 60_000);
});
