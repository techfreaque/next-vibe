/**
 * Admin grant reason: stored on the pack, the grant ledger row and every
 * usage row paid from that pack (so reports split refunds from gifts even
 * after the pack is spent and deleted). Integration test against the real DB.
 */

import "server-only";

import { and, eq, gt, lt } from "drizzle-orm";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { expect, it } from "vitest";

import { creditPacks, creditTransactions, creditWallets } from "../db";
import { CreditFundingType, CreditGrantReason } from "../enum";
import { scopedTranslation as creditsScopedTranslation } from "../i18n";
import { CreditRepository } from "../repository";
import { AdminAddCreditsRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;

it("stores the grant reason on pack, grant row and pack-funded usage", async () => {
  const created = await createTestUser(
    `grant-reason-${Date.now()}@example.com`,
  );
  expect(created.success).toBe(true);
  if (!created.success) {
    return;
  }
  const { user } = created.data;
  try {
    const granted = await AdminAddCreditsRepository.addCredits(
      {
        targetUserId: user.id,
        amount: 50,
        reason: CreditGrantReason.COMPENSATION,
      },
      logger,
      defaultLocale,
    );
    expect(granted.success).toBe(true);
    if (!granted.success || !granted.data.packId) {
      return expect.unreachable("Expected a granted pack");
    }
    const packId = granted.data.packId;

    const [pack] = await db
      .select({ grantReason: creditPacks.grantReason })
      .from(creditPacks)
      .where(eq(creditPacks.id, packId));
    expect(pack?.grantReason).toBe(CreditGrantReason.COMPENSATION);

    const [grantRow] = await db
      .select({ grantReason: creditTransactions.grantReason })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.packId, packId),
          gt(creditTransactions.amount, 0),
        ),
      );
    expect(grantRow?.grantReason).toBe(CreditGrantReason.COMPENSATION);

    const recipient = await AdminAddCreditsRepository.getRecipient(
      user.id,
      logger,
      defaultLocale,
    );
    expect(recipient.success && recipient.data.recentGrants[0]?.reason).toBe(
      CreditGrantReason.COMPENSATION,
    );

    // Spend all free credits plus 5 so part of the debit comes from the pack.
    const before = await CreditRepository.getBalance(
      user,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(before.success).toBe(true);
    if (!before.success) {
      return;
    }
    const spent = await CreditRepository.deductCreditsForModelUsage(
      user,
      before.data.free + 5,
      ChatModelId.GPT_5_MINI,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(spent.success).toBe(true);

    const [wallet] = await db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(eq(creditWallets.userId, user.id));
    const usage = await db
      .select({
        amount: creditTransactions.amount,
        fundingType: creditTransactions.fundingType,
        grantReason: creditTransactions.grantReason,
      })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.walletId, wallet?.id ?? ""),
          lt(creditTransactions.amount, 0),
        ),
      );
    const fromGrant = usage.filter(
      (row) => row.fundingType === CreditFundingType.ADMIN_GRANT,
    );
    expect(fromGrant.reduce((sum, row) => sum - row.amount, 0)).toBe(5);
    expect(
      fromGrant.every(
        (row) => row.grantReason === CreditGrantReason.COMPENSATION,
      ),
    ).toBe(true);
    expect(
      usage
        .filter((row) => row.fundingType !== CreditFundingType.ADMIN_GRANT)
        .every((row) => row.grantReason === null),
    ).toBe(true);
  } finally {
    await deleteTestUser(user.id);
  }
}, 60_000);
