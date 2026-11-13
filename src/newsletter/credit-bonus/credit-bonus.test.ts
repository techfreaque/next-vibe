/**
 * Newsletter credit bonus is account-only and once per account:
 * - guests are rejected by GET and POST (the old guest email-for-credits path)
 * - an account that never subscribed is offered it; claiming subscribes the
 *   ACCOUNT email (double opt-in), confirming makes it live on the user pool
 * - after unsubscribing it is never offered again, and a second claim grants nothing
 * - a legacy signup opt-in (consent recorded, no subscription row) can still claim
 * Requires the dev DB.
 */

import { eq, inArray } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";
import confirmEndpoints from "../confirm/definition";
import creditBonusEndpoints from "./definition";
import { NewsletterCreditOffer } from "./enum";
import { decideCreditOffer, type SubscriptionRow } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const userBase = FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn;
const createdLeadIds: string[] = [];
const createdUserIds: string[] = [];
const createdEmails: string[] = [];

function uniqueEmail(tag: string): string {
  return `nl-bonus-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example-test.invalid`;
}

async function createGuest(): Promise<JwtPayloadType> {
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
  return {
    isPublic: true,
    leadId: lead.id,
    roles: [UserPermissionRole.PUBLIC],
  };
}

async function createAccount(tag: string): Promise<JwtPayloadType | null> {
  const email = uniqueEmail(tag);
  createdEmails.push(email);
  const created = await createTestUser(email);
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    return null;
  }
  createdUserIds.push(created.data.user.id);
  // Account tiers need a verified email
  await db
    .update(users)
    .set({ emailVerified: true })
    .where(eq(users.id, created.data.user.id));
  return created.data.user;
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

async function claim(user: JwtPayloadType): Promise<string | undefined> {
  const res = await sendTestRequest({
    endpoint: creditBonusEndpoints.POST,
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

afterAll(async () => {
  if (createdEmails.length > 0) {
    await db
      .delete(newsletterSubscriptions)
      .where(inArray(newsletterSubscriptions.email, createdEmails));
  }
  for (const id of createdUserIds) {
    await deleteTestUser(id);
  }
  if (createdLeadIds.length > 0) {
    await db.delete(leads).where(inArray(leads.id, createdLeadIds));
  }
});

describe("decideCreditOffer", () => {
  const base: SubscriptionRow = {
    email: "a@example.com",
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    leadId: null,
    userId: "u1",
    confirmedAt: null,
  };
  const ctx = {
    userId: "u1",
    leadIds: ["l1"],
    accountEmail: "a@example.com",
  };
  const row = (patch: Partial<SubscriptionRow>): SubscriptionRow => ({
    ...base,
    ...patch,
  });

  it("no subscription -> AVAILABLE (also for legacy signup opt-ins without a row)", () => {
    expect(decideCreditOffer({ ...ctx, rows: [] })).toBe(
      NewsletterCreditOffer.AVAILABLE,
    );
  });

  it("owned unconfirmed -> PENDING; confirmed -> ACTIVE; confirmed then unsubscribed -> NOT_ELIGIBLE", () => {
    expect(decideCreditOffer({ ...ctx, rows: [row({})] })).toBe(
      NewsletterCreditOffer.PENDING_CONFIRMATION,
    );
    expect(
      decideCreditOffer({ ...ctx, rows: [row({ confirmedAt: new Date() })] }),
    ).toBe(NewsletterCreditOffer.ACTIVE);
    expect(
      decideCreditOffer({
        ...ctx,
        rows: [
          row({
            confirmedAt: new Date(),
            status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
          }),
        ],
      }),
    ).toBe(NewsletterCreditOffer.NOT_ELIGIBLE);
  });

  it("account email owned by another pool -> NOT_ELIGIBLE; lead-owned row counts as own", () => {
    expect(
      decideCreditOffer({
        ...ctx,
        rows: [row({ userId: "other", leadId: "other-lead" })],
      }),
    ).toBe(NewsletterCreditOffer.NOT_ELIGIBLE);
    expect(
      decideCreditOffer({
        ...ctx,
        rows: [row({ userId: null, leadId: "l1", confirmedAt: new Date() })],
      }),
    ).toBe(NewsletterCreditOffer.ACTIVE);
  });
});

describe("newsletter credit bonus endpoint (DB)", () => {
  it("rejects guests on GET and POST", async () => {
    const guest = await createGuest();
    for (const endpoint of [
      creditBonusEndpoints.GET,
      creditBonusEndpoints.POST,
    ]) {
      const res = await sendTestRequest({
        endpoint,
        user: guest,
        toolExecutionContext: undefined,
      });
      expect(res.success).toBe(false);
    }
    const [row] = await db
      .select({ id: newsletterSubscriptions.id })
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.leadId, guest.leadId));
    expect(row).toBeUndefined();
  });

  it("account: offer -> claim (pending) -> confirm (active, +bonus) -> unsubscribe -> never again", async () => {
    const user = await createAccount("flow");
    if (!user || user.isPublic) {
      return;
    }
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.AVAILABLE);
    expect(await freeBalance(user)).toBe(userBase);

    expect(await claim(user)).toBe(NewsletterCreditOffer.PENDING_CONFIRMATION);
    const [account] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, user.id));
    const [sub] = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, account.email));
    expect(sub?.userId).toBe(user.id);
    expect(sub?.confirmedAt).toBeNull();
    expect(await freeBalance(user)).toBe(userBase);
    // A second click before confirming changes nothing
    expect(await claim(user)).toBe(NewsletterCreditOffer.PENDING_CONFIRMATION);

    if (!sub?.confirmationToken) {
      expect(sub?.confirmationToken).toBeTruthy();
      return;
    }
    const confirmed = await sendTestRequest({
      endpoint: confirmEndpoints.POST,
      data: { token: sub.confirmationToken },
      user,
      toolExecutionContext: undefined,
    });
    expect(confirmed.success, JSON.stringify(confirmed)).toBe(true);
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.ACTIVE);
    expect(await freeBalance(user)).toBe(
      userBase + FREE_CREDIT_ALLOWANCE.newsletterBonus,
    );

    await db
      .update(newsletterSubscriptions)
      .set({ status: NewsletterSubscriptionStatus.UNSUBSCRIBED })
      .where(eq(newsletterSubscriptions.id, sub.id));
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.NOT_ELIGIBLE);
    expect(await claim(user)).toBe(NewsletterCreditOffer.NOT_ELIGIBLE);
    const [after] = await db
      .select({ status: newsletterSubscriptions.status })
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.id, sub.id));
    expect(after?.status).toBe(NewsletterSubscriptionStatus.UNSUBSCRIBED);
  });

  it("legacy signup opt-in without a subscription row can still claim", async () => {
    const user = await createAccount("optin");
    if (!user || user.isPublic) {
      return;
    }
    await db
      .update(users)
      .set({ marketingConsent: true })
      .where(eq(users.id, user.id));
    expect(await getOffer(user)).toBe(NewsletterCreditOffer.AVAILABLE);
  });
});
