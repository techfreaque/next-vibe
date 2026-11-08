/**
 * Tiered monthly free allowance: guest 20, signed-in 50, +20 with a CONFIRMED
 * newsletter subscription. Pure math + real-DB pool scenarios through
 * CreditRepository (balance reads, deductions, top-ups).
 * Requires the dev DB (PGlite socket or Postgres) - same as other repository tests.
 */

import { and, eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import {
  leadLeadLinks,
  leads,
  userLeadLinks,
} from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { creditWallets } from "./db";
import { publicFreeTierDailyCap } from "./public-cap/db";
import {
  computeFreeAllowance,
  computeFreeAvailable,
  computeFreeTopUp,
} from "./free-allowance";
import { scopedTranslation } from "./i18n";
import { CreditRepository } from "./repository";

const { guest, signedIn, newsletterBonus } = FREE_CREDIT_ALLOWANCE;
const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

const createdLeadIds: string[] = [];
const createdUserIds: string[] = [];
const createdEmails: string[] = [];

function uniqueEmail(tag: string): string {
  return `free-allowance-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example-test.invalid`;
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

function guestUser(leadId: string): JwtPayloadType {
  return { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] };
}

async function freeBalance(user: JwtPayloadType): Promise<number> {
  const res = await CreditRepository.getBalance(user, logger, t, defaultLocale);
  expect(res.success, JSON.stringify(res)).toBe(true);
  return res.success ? res.data.free : -1;
}

async function spend(user: JwtPayloadType, amount: number): Promise<void> {
  const res = await CreditRepository.deductCreditsForFeature(
    user,
    amount,
    "free-allowance-test",
    logger,
    t,
    defaultLocale,
  );
  expect(res.success, JSON.stringify(res)).toBe(true);
}

async function addNewsletter(
  owner: { leadId?: string; userId?: string },
  confirmed: boolean,
): Promise<string> {
  const email = uniqueEmail("nl");
  createdEmails.push(email);
  await db.insert(newsletterSubscriptions).values({
    email,
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    leadId: owner.leadId ?? null,
    userId: owner.userId ?? null,
    confirmedAt: confirmed ? new Date() : null,
  });
  return email;
}

// Free-tier deductions also count against the global daily public cap. Park it
// at 0 for the run and put the real figure back, so tests neither trip it nor
// eat the dev instance's daily budget.
let savedCapSpend: { id: string; spendToday: number } | undefined;

beforeAll(async () => {
  const [row] = await db
    .select({
      id: publicFreeTierDailyCap.id,
      spendToday: publicFreeTierDailyCap.spendToday,
    })
    .from(publicFreeTierDailyCap)
    .limit(1);
  if (row) {
    savedCapSpend = row;
    await db
      .update(publicFreeTierDailyCap)
      .set({ spendToday: 0 })
      .where(eq(publicFreeTierDailyCap.id, row.id));
  }
});

afterAll(async () => {
  if (savedCapSpend) {
    await db
      .update(publicFreeTierDailyCap)
      .set({ spendToday: savedCapSpend.spendToday })
      .where(eq(publicFreeTierDailyCap.id, savedCapSpend.id));
  }
  if (createdEmails.length > 0) {
    await db
      .delete(newsletterSubscriptions)
      .where(inArray(newsletterSubscriptions.email, createdEmails));
  }
  for (const userId of createdUserIds) {
    await deleteTestUser(userId);
  }
  if (createdLeadIds.length > 0) {
    await db
      .delete(leadLeadLinks)
      .where(inArray(leadLeadLinks.leadId1, createdLeadIds));
    await db.delete(leads).where(inArray(leads.id, createdLeadIds));
  }
});

describe("free allowance math", () => {
  it("tiers: guest, guest+newsletter, user, user+newsletter", () => {
    expect(
      computeFreeAllowance({ isUserPool: false, hasConfirmedNewsletter: false }),
    ).toBe(20);
    expect(
      computeFreeAllowance({ isUserPool: false, hasConfirmedNewsletter: true }),
    ).toBe(40);
    expect(
      computeFreeAllowance({ isUserPool: true, hasConfirmedNewsletter: false }),
    ).toBe(50);
    expect(
      computeFreeAllowance({ isUserPool: true, hasConfirmedNewsletter: true }),
    ).toBe(70);
  });

  it("available is capped by allowance minus period spending", () => {
    expect(
      computeFreeAvailable({
        allowance: 20,
        spentThisPeriod: 30,
        remainingInWallets: 10,
      }),
    ).toBe(0);
    expect(
      computeFreeAvailable({
        allowance: 50,
        spentThisPeriod: 15,
        remainingInWallets: 40,
      }),
    ).toBe(35);
  });

  it("top-up only fills what the cap still owes", () => {
    expect(
      computeFreeTopUp({
        allowance: 50,
        spentThisPeriod: 15,
        remainingInWallets: 5,
      }),
    ).toBe(30);
    expect(
      computeFreeTopUp({
        allowance: 20,
        spentThisPeriod: 0,
        remainingInWallets: 20,
      }),
    ).toBe(0);
  });
});

describe("free allowance pools (DB)", () => {
  it("guest pool gets the guest allowance", async () => {
    const leadId = await createGuestLead();
    expect(await freeBalance(guestUser(leadId))).toBe(guest);
  });

  it("unconfirmed newsletter adds nothing; confirmed adds the bonus once", async () => {
    const leadId = await createGuestLead();
    const user = guestUser(leadId);
    expect(await freeBalance(user)).toBe(guest);

    const email = await addNewsletter({ leadId }, false);
    expect(await freeBalance(user)).toBe(guest);

    await db
      .update(newsletterSubscriptions)
      .set({ confirmedAt: new Date() })
      .where(eq(newsletterSubscriptions.email, email));
    expect(await freeBalance(user)).toBe(guest + newsletterBonus);
    // Idempotent: repeated reads never stack a second bonus
    expect(await freeBalance(user)).toBe(guest + newsletterBonus);
  });

  it("signed-in user gets the user allowance, +bonus with a confirmed newsletter", async () => {
    const created = await createTestUser(uniqueEmail("user"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const user = created.data.user;
    createdUserIds.push(user.id);

    expect(await freeBalance(user)).toBe(signedIn);
    await addNewsletter({ userId: user.id }, true);
    expect(await freeBalance(user)).toBe(signedIn + newsletterBonus);
  });

  it("linked leads share one cap - spending on both counts together", async () => {
    const a = await createGuestLead();
    const b = await createGuestLead();
    expect(await freeBalance(guestUser(a))).toBe(guest);
    expect(await freeBalance(guestUser(b))).toBe(guest);
    await spend(guestUser(a), 15);
    await spend(guestUser(b), 15);

    await db.insert(leadLeadLinks).values({
      leadId1: a,
      leadId2: b,
      linkReason: "test",
    });

    // 30 spent across the pool against a 20 cap -> nothing left on either device
    expect(await freeBalance(guestUser(a))).toBe(0);
    expect(await freeBalance(guestUser(b))).toBe(0);
  });

  it("guest -> user mid-month carries usage over (no double dipping)", async () => {
    const guestLead = await createGuestLead();
    const asGuest = guestUser(guestLead);
    expect(await freeBalance(asGuest)).toBe(guest);
    await spend(asGuest, 15);
    expect(await freeBalance(asGuest)).toBe(guest - 15);

    const created = await createTestUser(uniqueEmail("upgrade"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const user = created.data.user;
    createdUserIds.push(user.id);
    // Login on the guest's device links its lead into the user pool
    await db
      .insert(userLeadLinks)
      .values({ userId: user.id, leadId: guestLead, linkReason: "login" });

    expect(await freeBalance(user)).toBe(signedIn - 15);

    // Guest's earlier newsletter claim (lead-owned) follows into the user pool
    await addNewsletter({ leadId: guestLead }, true);
    expect(await freeBalance(user)).toBe(signedIn + newsletterBonus - 15);
    expect(await freeBalance(user)).toBe(signedIn + newsletterBonus - 15);

    // Logged out on that device: display matches what deductions draw on
    // (account cap + account-wide spending, free credits only)
    const expected = signedIn + newsletterBonus - 15;
    expect(await freeBalance(asGuest)).toBe(expected);
    const shown = await CreditRepository.getCreditBalanceForUser(
      asGuest,
      defaultLocale,
      logger,
      t,
    );
    expect(shown.success && shown.data.free).toBe(expected);
    expect(shown.success && shown.data.total).toBe(expected);
    await spend(asGuest, 5);
    expect(await freeBalance(user)).toBe(expected - 5);
  });

  it("zeroed or spent free credits are never regenerated by the top-up", async () => {
    const leadId = await createGuestLead();
    const user = guestUser(leadId);
    expect(await freeBalance(user)).toBe(guest);
    await db
      .update(creditWallets)
      .set({ freeCreditsRemaining: 0 })
      .where(eq(creditWallets.leadId, leadId));
    expect(await freeBalance(user)).toBe(0);
  });

  it("unsubscribing drops the bonus; spending already above the guest cap leaves 0", async () => {
    const leadId = await createGuestLead();
    const user = guestUser(leadId);
    const email = await addNewsletter({ leadId }, true);
    expect(await freeBalance(user)).toBe(guest + newsletterBonus);
    await spend(user, 30);
    expect(await freeBalance(user)).toBe(guest + newsletterBonus - 30);

    await db
      .update(newsletterSubscriptions)
      .set({ status: NewsletterSubscriptionStatus.UNSUBSCRIBED })
      .where(
        and(
          eq(newsletterSubscriptions.email, email),
          eq(newsletterSubscriptions.leadId, leadId),
        ),
      );
    expect(await freeBalance(user)).toBe(0);
  });
});
