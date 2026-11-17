/**
 * Referral code subscription bonus — integration tests against the real DB.
 * Admin sets a per-code bonus; a referred user gets it once with their first
 * paid plan (never on signup, never twice); a code without a bonus grants
 * nothing; the signup display reads the bonus from the lead's code.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { creditPacks, creditWallets } from "@/credits/db";

import { referralSubscriptionBonusKey } from "../../config";
import { referralCodes, userReferrals } from "../../db";
import { ReferralRepository } from "../../repository";
import definitions from "./definition";

const logger = createEndpointLogger(false, defaultLocale);
const stamp = Date.now();
const CODE = `Bonus${stamp}`;
const PLAIN_CODE = `NoBonus${stamp}`;

let owner: TestUser;
let referred: TestUser;
let plainReferred: TestUser;

async function bonusPackCredits(userId: string): Promise<number> {
  const rows = await db
    .select({ amount: creditPacks.originalAmount })
    .from(creditPacks)
    .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
    .where(
      and(
        eq(creditWallets.userId, userId),
        sql`${creditPacks.metadata}->>'sessionId' = ${referralSubscriptionBonusKey(userId)}`,
      ),
    );
  return rows.reduce((sum, row) => sum + row.amount, 0);
}

describe("referral-code-bonus", () => {
  beforeAll(async () => {
    const o = await createTestUser(`bonus-owner-${stamp}@example.com`);
    const r = await createTestUser(`bonus-referred-${stamp}@example.com`);
    const p = await createTestUser(`bonus-plain-${stamp}@example.com`);
    expect(o.success && r.success && p.success).toBe(true);
    if (!o.success || !r.success || !p.success) {
      return;
    }
    owner = o.data;
    referred = r.data;
    plainReferred = p.data;

    const [code] = await db
      .insert(referralCodes)
      .values({ code: CODE, ownerUserId: owner.user.id })
      .returning({ id: referralCodes.id });
    const [plain] = await db
      .insert(referralCodes)
      .values({ code: PLAIN_CODE, ownerUserId: owner.user.id })
      .returning({ id: referralCodes.id });
    await db.insert(userReferrals).values([
      {
        referrerUserId: owner.user.id,
        referredUserId: referred.user.id,
        referralCodeId: code.id,
      },
      {
        referrerUserId: owner.user.id,
        referredUserId: plainReferred.user.id,
        referralCodeId: plain.id,
      },
    ]);
  }, 60_000);

  afterAll(async () => {
    await deleteTestUser(referred.user.id);
    await deleteTestUser(plainReferred.user.id);
    await deleteTestUser(owner.user.id);
  }, 60_000);

  it("unknown code is NOT_FOUND", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: { code: `missing${stamp}`, bonusCredits: 100 },
      toolExecutionContext: undefined,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errorType.errorCode).toBe(
        ErrorResponseTypes.NOT_FOUND.errorCode,
      );
    }
  });

  it("admin sets the bonus (code match ignores case)", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: { code: CODE.toUpperCase(), bonusCredits: 100 },
      toolExecutionContext: undefined,
    });
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.updatedCode).toBe(CODE);
    expect(res.data.previousBonusCredits).toBe(0);
    expect(res.data.subscriptionBonusCredits).toBe(100);
    const [row] = await db
      .select({ bonus: referralCodes.subscriptionBonusCredits })
      .from(referralCodes)
      .where(eq(referralCodes.code, CODE));
    expect(row?.bonus).toBe(100);
  });

  it("nothing is granted before a paid plan", async () => {
    expect(await bonusPackCredits(referred.user.id)).toBe(0);
  });

  it("first paid plan grants the bonus exactly once", async () => {
    const first = await ReferralRepository.grantSubscriptionSignupBonus(
      referred.user.id,
      logger,
      defaultLocale,
    );
    expect(first.success && first.data.granted).toBe(100);
    // Webhook retry, re-subscribe after cancel: no second grant
    const again = await ReferralRepository.grantSubscriptionSignupBonus(
      referred.user.id,
      logger,
      defaultLocale,
    );
    expect(again.success && again.data.granted).toBe(0);
    expect(await bonusPackCredits(referred.user.id)).toBe(100);
  });

  it("a code without a bonus grants nothing", async () => {
    const res = await ReferralRepository.grantSubscriptionSignupBonus(
      plainReferred.user.id,
      logger,
      defaultLocale,
    );
    expect(res.success && res.data.granted).toBe(0);
    expect(await bonusPackCredits(plainReferred.user.id)).toBe(0);
  });

  it("an unreferred user gets nothing", async () => {
    const res = await ReferralRepository.grantSubscriptionSignupBonus(
      owner.user.id,
      logger,
      defaultLocale,
    );
    expect(res.success && res.data.granted).toBe(0);
  });

  it("0 clears the bonus", async () => {
    const res = await sendTestRequest({
      endpoint: definitions.POST,
      data: { code: CODE, bonusCredits: 0 },
      toolExecutionContext: undefined,
    });
    expect(res.success && res.data.subscriptionBonusCredits).toBe(0);
  });
});
