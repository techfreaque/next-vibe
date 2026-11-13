/**
 * Tiered monthly free allowance: no account 20, account 40, account + CONFIRMED
 * newsletter subscription 90 (guests never get the newsletter bonus). Pure math + real-DB pool scenarios through
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
import {
  NewsletterSubscriptionStatus,
  type NewsletterSubscriptionStatusValue,
} from "@/newsletter/enum";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { creditTransactions, creditWallets } from "./db";
import { CreditTransactionType } from "./enum";
import { publicFreeTierDailyCap } from "./public-cap/db";
import {
  computeFreeAllowance,
  computeFreeAvailable,
  computeFreeTopUp,
  computeGrandfatheredFreeCap,
  computeLegacyFreeAllowance,
} from "./free-allowance";
import { scopedTranslation } from "./i18n";
import { CreditRepository } from "./repository";

const { guest, newsletterBonus } = FREE_CREDIT_ALLOWANCE;
// A USER pool stacks the lead's guest allowance under the signed-in grant:
// guest 20 + signedIn 20 = 40 base, +50 newsletter = 90.
const userBase = FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn;
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
    // Account first: a guest pool never gets the newsletter bonus
    expect(
      computeFreeAllowance({ isUserPool: false, hasConfirmedNewsletter: true }),
    ).toBe(20);
    // User pool is ADDITIVE: lead 20 + user 20 = 40 base, +50 newsletter = 90.
    expect(
      computeFreeAllowance({ isUserPool: true, hasConfirmedNewsletter: false }),
    ).toBe(40);
    expect(
      computeFreeAllowance({ isUserPool: true, hasConfirmedNewsletter: true }),
    ).toBe(90);
  });

  it("tier cut: what was granted under the old tiers stays until the next refill", () => {
    const legacyAccount = computeLegacyFreeAllowance({
      isUserPool: true,
      hasConfirmedNewsletter: false,
    });
    expect(legacyAccount).toBe(70);
    // Existing account refilled at 70 before the cut keeps 70 this month
    expect(
      computeGrandfatheredFreeCap({
        allowance: 40,
        legacyAllowance: legacyAccount,
        legacyGrantedThisPeriod: 70,
      }),
    ).toBe(70);
    // Nothing granted under the old tiers (new month, new account): new cap
    expect(
      computeGrandfatheredFreeCap({
        allowance: 40,
        legacyAllowance: legacyAccount,
        legacyGrantedThisPeriod: 0,
      }),
    ).toBe(40);
    // Merged guest grants never stack past the old tier cap
    expect(
      computeGrandfatheredFreeCap({
        allowance: 40,
        legacyAllowance: legacyAccount,
        legacyGrantedThisPeriod: 140,
      }),
    ).toBe(70);
    // Never below the new cap
    expect(
      computeGrandfatheredFreeCap({
        allowance: 90,
        legacyAllowance: 90,
        legacyGrantedThisPeriod: 20,
      }),
    ).toBe(90);
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

  it("guest pool: even a confirmed newsletter adds nothing (account first)", async () => {
    const leadId = await createGuestLead();
    const user = guestUser(leadId);
    expect(await freeBalance(user)).toBe(guest);

    const email = await addNewsletter({ leadId }, false);
    expect(await freeBalance(user)).toBe(guest);

    await db
      .update(newsletterSubscriptions)
      .set({ confirmedAt: new Date() })
      .where(eq(newsletterSubscriptions.email, email));
    expect(await freeBalance(user)).toBe(guest);
  });

  it("user pool: unconfirmed adds nothing; confirmed adds the bonus once", async () => {
    const created = await createTestUser(uniqueEmail("user-nl"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const user = created.data.user;
    createdUserIds.push(user.id);

    const email = await addNewsletter({ userId: user.id }, false);
    expect(await freeBalance(user)).toBe(userBase);

    await db
      .update(newsletterSubscriptions)
      .set({ confirmedAt: new Date() })
      .where(eq(newsletterSubscriptions.email, email));
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus);
    // Idempotent: repeated reads never stack a second bonus
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus);
  });

  it("signed-in user gets the user allowance, +bonus with a confirmed newsletter", async () => {
    const created = await createTestUser(uniqueEmail("user"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const user = created.data.user;
    createdUserIds.push(user.id);

    expect(await freeBalance(user)).toBe(userBase);
    await addNewsletter({ userId: user.id }, true);
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus);
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

    // 30 spent across the pool against the guest allowance -> nothing left on either device
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

    expect(await freeBalance(user)).toBe(userBase - 15);

    // Guest's earlier newsletter claim (lead-owned) follows into the user pool
    await addNewsletter({ leadId: guestLead }, true);
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus - 15);
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus - 15);

    // Logged out on that device: display matches what deductions draw on
    // (account cap + account-wide spending, free credits only)
    const expected = userBase + newsletterBonus - 15;
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

  it("existing user under the old cap is topped up to the new cap on next activity (not double-granted, prior spend carries)", async () => {
    const created = await createTestUser(uniqueEmail("existing"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const user = created.data.user;
    createdUserIds.push(user.id);
    // Create the lead's wallet by accessing it as a guest first (free credits
    // live only on lead wallets, created lazily on access), then link it into
    // the user pool - the same path a real login takes.
    const leadId = await createGuestLead();
    expect(await freeBalance(guestUser(leadId))).toBe(guest);
    await db
      .insert(userLeadLinks)
      .values({ userId: user.id, leadId, linkReason: "login" });

    // Fresh account already converges to the new additive base on first read.
    expect(await freeBalance(user)).toBe(userBase);

    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const [wallet] = await db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(eq(creditWallets.leadId, leadId))
      .limit(1);
    expect(wallet).toBeDefined();
    if (!wallet) {
      return;
    }

    // Simulate an EXISTING user left mid-period under the OLD, lower cap: wipe
    // this period's grant rows (so grantedThisPeriod reflects only the old cap)
    // and force stored free credits down to the old amount. No usage yet.
    const oldCap = 20;
    await db
      .delete(creditTransactions)
      .where(
        and(
          eq(creditTransactions.walletId, wallet.id),
          eq(creditTransactions.freePeriodId, periodId),
          eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
        ),
      );
    await db
      .update(creditWallets)
      .set({ freeCreditsRemaining: oldCap })
      .where(eq(creditWallets.id, wallet.id));

    // Next activity recomputes the allowance (40) and lazily tops up the delta,
    // never beyond the cap.
    expect(await freeBalance(user)).toBe(userBase);

    // Prior spend carries: after spending 15, the balance is cap - spent = 25.
    await spend(user, 15);
    expect(await freeBalance(user)).toBe(userBase - 15);

    // Confirming the newsletter lifts the ceiling to 90; still minus prior spend.
    await addNewsletter({ userId: user.id }, true);
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus - 15);
    // Idempotent: repeated reads never push past the cap.
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus - 15);
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

  it("unsubscribe + resubscribe never pays the bonus twice in a period", async () => {
    const created = await createTestUser(uniqueEmail("user-resub"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const user = created.data.user;
    createdUserIds.push(user.id);
    const email = await addNewsletter({ userId: user.id }, true);
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus);
    await spend(user, 30);
    const afterSpend = userBase + newsletterBonus - 30;
    expect(await freeBalance(user)).toBe(afterSpend);

    const setStatus = async (
      status: typeof NewsletterSubscriptionStatusValue,
    ): Promise<void> => {
      await db
        .update(newsletterSubscriptions)
        .set({ status })
        .where(eq(newsletterSubscriptions.email, email));
    };
    await setStatus(NewsletterSubscriptionStatus.UNSUBSCRIBED);
    expect(await freeBalance(user)).toBe(userBase - 30);
    // Back on: the cap returns, the spend still counts. No fresh +bonus.
    await setStatus(NewsletterSubscriptionStatus.SUBSCRIBED);
    expect(await freeBalance(user)).toBe(afterSpend);
  });

  it("existing account refilled at the old 70 keeps it this month, drops to 40 at the next refill", async () => {
    const created = await createTestUser(uniqueEmail("legacy-70"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const user = created.data.user;
    createdUserIds.push(user.id);
    const leadId = await createGuestLead();
    expect(await freeBalance(guestUser(leadId))).toBe(guest);
    await db
      .insert(userLeadLinks)
      .values({ userId: user.id, leadId, linkReason: "login" });
    expect(await freeBalance(user)).toBe(userBase);

    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const [wallet] = await db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(eq(creditWallets.leadId, leadId))
      .limit(1);
    expect(wallet).toBeDefined();
    if (!wallet) {
      return;
    }

    // Replace this period's grants with one refill made by the OLD code:
    // 70 credits, no tierVersion stamp.
    const legacyCap = 70;
    await db
      .delete(creditTransactions)
      .where(
        and(
          eq(creditTransactions.walletId, wallet.id),
          eq(creditTransactions.freePeriodId, periodId),
          eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
        ),
      );
    await db.insert(creditTransactions).values({
      walletId: wallet.id,
      amount: legacyCap,
      balanceAfter: legacyCap,
      type: CreditTransactionType.FREE_GRANT,
      freePeriodId: periodId,
      metadata: { reason: "monthly_reset", freeCreditsRemaining: legacyCap },
    });
    await db
      .update(creditWallets)
      .set({ freeCreditsRemaining: legacyCap })
      .where(eq(creditWallets.id, wallet.id));

    // No clawback mid-month
    expect(await freeBalance(user)).toBe(legacyCap);
    await spend(user, 10);
    expect(await freeBalance(user)).toBe(legacyCap - 10);

    // Move the whole pool to last month: the next read is the monthly refill
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    const lastPeriodId = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;
    const poolLeadIds = (
      await db
        .select({ leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, user.id))
    ).map((r) => r.leadId);
    const poolWalletIds = (
      await db
        .select({ id: creditWallets.id })
        .from(creditWallets)
        .where(inArray(creditWallets.leadId, poolLeadIds))
    ).map((r) => r.id);
    await db
      .update(creditTransactions)
      .set({ freePeriodId: lastPeriodId })
      .where(
        and(
          inArray(creditTransactions.walletId, poolWalletIds),
          eq(creditTransactions.freePeriodId, periodId),
        ),
      );
    await db
      .update(creditWallets)
      .set({ freePeriodStart: lastMonth, freePeriodId: lastPeriodId })
      .where(inArray(creditWallets.id, poolWalletIds));

    expect(await freeBalance(user)).toBe(userBase);
    // Newsletter still lifts the new base to 90
    await addNewsletter({ userId: user.id }, true);
    expect(await freeBalance(user)).toBe(userBase + newsletterBonus);
  });
});
