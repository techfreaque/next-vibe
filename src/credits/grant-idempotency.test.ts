/**
 * Credit grant idempotency — integration tests against the real DB.
 *
 * Concurrent addUserCredits calls with the same idempotency key (webhook +
 * success redirect + parallel getSubscription safety nets) must mint exactly
 * one pack, one ledger row and one balance increment. Guarded by the unique
 * index uq_packs_session_id + ON CONFLICT DO NOTHING.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import { creditPacks, creditTransactions, creditWallets } from "./db";
import { scopedTranslation as creditsScopedTranslation } from "./i18n";
import { CreditRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const stamp = Date.now();
const CONCURRENCY = 10;
const GRANT = 800;

let buyer: TestUser;

async function walletBalance(userId: string): Promise<number> {
  const [wallet] = await db
    .select({ balance: creditWallets.balance })
    .from(creditWallets)
    .where(eq(creditWallets.userId, userId));
  return wallet?.balance ?? 0;
}

async function packsFor(key: string): Promise<string[]> {
  const rows = await db
    .select({ id: creditPacks.id })
    .from(creditPacks)
    .where(sql`${creditPacks.metadata}->>'sessionId' = ${key}`);
  return rows.map((r) => r.id);
}

async function grantRowsFor(packIds: string[]): Promise<number> {
  let count = 0;
  for (const packId of packIds) {
    const rows = await db
      .select({ id: creditTransactions.id })
      .from(creditTransactions)
      .where(eq(creditTransactions.packId, packId));
    count += rows.length;
  }
  return count;
}

describe("CreditRepository.addUserCredits idempotency", () => {
  beforeAll(async () => {
    const created = await createTestUser(`grant-idem-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    buyer = created.data;
    // Create the wallet up front so the race is on the grant, not wallet creation
    const pool = await CreditRepository.getUserPool(
      buyer.user.id,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(pool.success).toBe(true);
  });

  afterAll(async () => {
    await deleteTestUser(buyer.user.id);
  });

  it("concurrent grants with the same key mint exactly one pack", async () => {
    const key = `renewal_sub_test_race_${stamp}_1797164525000`;
    const before = await walletBalance(buyer.user.id);

    const results = await Promise.all(
      Array.from({ length: CONCURRENCY }, () =>
        CreditRepository.addUserCredits(
          buyer.user.id,
          GRANT,
          "subscription",
          logger,
          creditsT,
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          key,
        ),
      ),
    );

    for (const result of results) {
      expect(result.success, JSON.stringify(result)).toBe(true);
    }
    const successes = results.flatMap((r) => (r.success ? [r.data] : []));
    const winners = successes.filter((r) => r.granted);
    expect(winners).toHaveLength(1);
    // Every caller gets the same (winning) pack back
    const packIds = new Set(successes.map((r) => r.packId));
    expect(packIds.size).toBe(1);

    const packs = await packsFor(key);
    expect(packs).toEqual([winners[0].packId]);
    expect(await grantRowsFor(packs)).toBe(1);
    expect(await walletBalance(buyer.user.id)).toBe(before + GRANT);
  });

  it("a later retry with the same key is a no-op returning the existing pack", async () => {
    const key = `cs_test_grant_idem_retry_${stamp}`;
    const first = await CreditRepository.addUserCredits(
      buyer.user.id,
      500,
      "permanent",
      logger,
      creditsT,
      undefined,
      key,
    );
    expect(first.success && first.data.granted).toBe(true);
    const afterFirst = await walletBalance(buyer.user.id);

    const retry = await CreditRepository.addUserCredits(
      buyer.user.id,
      500,
      "permanent",
      logger,
      creditsT,
      undefined,
      key,
    );
    expect(retry.success).toBe(true);
    if (!first.success || !retry.success) {
      return;
    }
    expect(retry.data).toEqual({ packId: first.data.packId, granted: false });
    expect(await walletBalance(buyer.user.id)).toBe(afterFirst);
    expect(await packsFor(key)).toHaveLength(1);
  });

  it("unkeyed grants are never deduplicated", async () => {
    const before = await walletBalance(buyer.user.id);
    const results = await Promise.all(
      Array.from({ length: 3 }, () =>
        CreditRepository.addUserCredits(
          buyer.user.id,
          10,
          "permanent",
          logger,
          creditsT,
        ),
      ),
    );
    expect(results.every((r) => r.success && r.data.granted)).toBe(true);
    expect(await walletBalance(buyer.user.id)).toBe(before + 30);
  });
});
