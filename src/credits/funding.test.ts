/**
 * Funding attribution on usage debits + the spendable pre-check.
 *
 * - Every usage row written by the deduction walk carries the funding bucket
 *   that paid it (asserted on ledger rows, not balance sums).
 * - A multi-pack walk writes one row per pack in walk order with the pack's
 *   bucket; the free part splits into allowance and signup/newsletter bonus.
 * - The pre-generation balance check counts only what the walk can spend:
 *   a wallet balance without a backing pack is refused before any provider
 *   call (checkMediaBalance is the gate every media tool runs first).
 * Requires the dev DB, like the other credits repository tests.
 */

import "server-only";

import { and, eq, inArray, or } from "drizzle-orm";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { FETCH_URL_ALIAS } from "next-vibe/agent/fetch-url-content/constants";
import fetchUrlDefinitions from "next-vibe/agent/fetch-url-content/definition";
import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import { ImageGenModelId } from "next-vibe/agent/image-generation/models";
import { ApiProvider } from "next-vibe/agent/models/models";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { makeHeadlessContext } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createGenericHandler } from "next-vibe/core/route/handler";
import {
  ErrorResponseTypes,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  checkMediaBalance,
  deductMediaCredits,
} from "../vibe/agent/shared/media-generation";
import {
  type CreditTransaction,
  creditTransactions,
  creditWallets,
} from "./db";
import {
  CreditFundingType,
  CreditPackType,
  CreditTransactionType,
} from "./enum";
import {
  FREE_ALLOWANCE_BASE,
  packFundingType,
  splitFreeDebit,
} from "./funding";
import { scopedTranslation as creditsScopedTranslation } from "./i18n";
import { CreditRepository } from "./repository";
import { TOOL_COST_PROVIDERS } from "./tool-cost-providers";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const stamp = Date.now();

describe("splitFreeDebit", () => {
  it("keeps a debit inside the allowance in one part", () => {
    expect(splitFreeDebit(0, 5, 20)).toEqual([
      { fundingType: CreditFundingType.FREE_ALLOWANCE, amount: 5 },
    ]);
  });
  it("splits a debit that crosses the allowance base", () => {
    expect(splitFreeDebit(15, 10, 20)).toEqual([
      { fundingType: CreditFundingType.FREE_ALLOWANCE, amount: 5 },
      { fundingType: CreditFundingType.FREE_BONUS, amount: 5 },
    ]);
  });
  it("counts everything above the base as bonus", () => {
    expect(splitFreeDebit(25, 3.5, 20)).toEqual([
      { fundingType: CreditFundingType.FREE_BONUS, amount: 3.5 },
    ]);
  });
  it("keeps fractional credits exact to 6 decimals", () => {
    const parts = splitFreeDebit(19.9, 0.3, 20);
    expect(parts.map((part) => part.amount)).toEqual([0.1, 0.2]);
  });
});

describe("packFundingType", () => {
  it("maps every pack source to its bucket", () => {
    expect(
      packFundingType({
        type: CreditPackType.SUBSCRIPTION,
        source: "subscription_purchase",
      }),
    ).toBe(CreditFundingType.SUBSCRIPTION);
    expect(
      packFundingType({
        type: CreditPackType.PERMANENT,
        source: "permanent_purchase",
        sessionId: "cs_live_123",
      }),
    ).toBe(CreditFundingType.PURCHASED);
    expect(
      packFundingType({ type: CreditPackType.BONUS, source: "bonus" }),
    ).toBe(CreditFundingType.ADMIN_GRANT);
    expect(
      packFundingType({
        type: CreditPackType.EARNED,
        source: "referral_earning",
      }),
    ).toBe(CreditFundingType.REFERRAL);
    expect(
      packFundingType({
        type: CreditPackType.BONUS,
        source: "free_purchase",
        sessionId: "referral-subscription-bonus:abc",
      }),
    ).toBe(CreditFundingType.REFERRAL);
    expect(
      packFundingType({
        type: CreditPackType.PERMANENT,
        source: "permanent_purchase",
        sessionId: "payout_req1",
      }),
    ).toBe(CreditFundingType.REFERRAL);
  });
});

async function walletIds(userId: string): Promise<string[]> {
  const leadIds = (
    await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, userId))
  ).map((row) => row.leadId);
  const rows = await db
    .select({ id: creditWallets.id })
    .from(creditWallets)
    .where(
      leadIds.length > 0
        ? or(
            eq(creditWallets.userId, userId),
            inArray(creditWallets.leadId, leadIds),
          )
        : eq(creditWallets.userId, userId),
    );
  return rows.map((row) => row.id);
}

async function usageRows(userId: string): Promise<CreditTransaction[]> {
  const ids = await walletIds(userId);
  return db
    .select()
    .from(creditTransactions)
    .where(
      and(
        inArray(creditTransactions.walletId, ids),
        eq(creditTransactions.type, CreditTransactionType.USAGE),
      ),
    )
    .orderBy(creditTransactions.createdAt);
}

it("records the service on a generic tool charge", async () => {
  const created = await createTestUser(`tool-cost-${stamp}@example.com`);
  expect(created.success).toBe(true);
  if (!created.success) {
    return;
  }
  const { user } = created.data;
  try {
    // Service attribution should be independent of the shared daily free cap.
    const pack = await CreditRepository.addUserCredits(
      user.id,
      1,
      "permanent",
      logger,
      creditsT,
    );
    expect(pack.success).toBe(true);
    const endpoint = fetchUrlDefinitions.GET;
    const handler = createGenericHandler<CreateApiEndpointAny>({
      endpoint,
      handler: () => success(endpoint.examples.responses.default),
    });
    const result = await handler({
      data: { url: "https://example.com" },
      urlPathParams: { locale: defaultLocale },
      user,
      locale: defaultLocale,
      logger,
      platform: Platform.CLI,
      toolExecutionContext: makeHeadlessContext(undefined, undefined, "UTC"),
    });
    expect(result).toMatchObject({ success: true });

    const [row] = await usageRows(user.id);
    expect(row).toMatchObject({
      feature: FETCH_URL_ALIAS,
      modelId: TOOL_COST_PROVIDERS.SCRAPPEY.modelId,
      metadata: { apiProvider: TOOL_COST_PROVIDERS.SCRAPPEY.apiProvider },
    });
  } finally {
    await deleteTestUser(user.id);
  }
});

function sumBy(
  rows: ReadonlyArray<{ amount: number; fundingType: string | null }>,
  fundingType: string,
): number {
  const total = rows
    .filter((row) => row.fundingType === fundingType)
    .reduce((sum, row) => sum - row.amount, 0);
  return Math.round(total * 1_000_000) / 1_000_000;
}

describe("deduction walk stamps the funding bucket", () => {
  let spender: TestUser;

  beforeAll(async () => {
    const created = await createTestUser(`funding-walk-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    spender = created.data;
    const pool = await CreditRepository.getUserPool(
      spender.user.id,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(pool.success).toBe(true);
  });

  afterAll(async () => {
    await deleteTestUser(spender.user.id);
  });

  it("stamps the media model and provider across free credits and three packs", async () => {
    const userId = spender.user.id;
    const grant = async (
      amount: number,
      type: "subscription" | "permanent" | "bonus",
      key: string,
    ): Promise<void> => {
      const result = await CreditRepository.addUserCredits(
        userId,
        amount,
        type,
        logger,
        creditsT,
        type === "subscription"
          ? new Date(Date.now() + 7 * 86_400_000)
          : undefined,
        key,
      );
      expect(result.success).toBe(true);
    };
    await grant(3, "bonus", `funding-bonus-${stamp}`);
    await grant(4, "permanent", `funding-perm-${stamp}`);
    await grant(5, "subscription", `funding-sub-${stamp}`);

    const before = await CreditRepository.getBalance(
      spender.user,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(before.success).toBe(true);
    if (!before.success) {
      return;
    }
    const free = before.data.free;
    expect(before.data.total).toBe(free + 12);

    // Free credits, then subscription (5), then permanent/bonus newest
    // first: the purchased pack (4), then 1 of the admin bonus (3).
    const cost = free + 10;
    const attribution = {
      modelId: ImageGenModelId.FLUX_2_MAX,
      apiProvider: ApiProvider.MODELSLAB,
    };
    const upstreamCostUsd = 0.123456789;
    const charged = await deductMediaCredits(
      spender.user,
      cost,
      IMAGE_GEN_ALIAS,
      defaultLocale,
      logger,
      creditsT,
      attribution,
      upstreamCostUsd,
    );
    expect(charged.success).toBe(true);

    const rows = await usageRows(userId);
    for (const row of rows) {
      expect(row.feature).toBe(IMAGE_GEN_ALIAS);
      expect(row.modelId).toBe(attribution.modelId);
      expect(row.metadata).toMatchObject({
        apiProvider: attribution.apiProvider,
      });
      const costShare =
        "upstreamCostUsd" in row.metadata
          ? row.metadata.upstreamCostUsd
          : undefined;
      expect(costShare).toBeCloseTo(upstreamCostUsd * (-row.amount / cost), 9);
    }
    expect(rows.every((row) => row.fundingType !== null)).toBe(true);
    const total = rows.reduce((sum, row) => sum - row.amount, 0);
    expect(Math.round(total * 1_000_000) / 1_000_000).toBe(cost);
    expect(sumBy(rows, CreditFundingType.FREE_ALLOWANCE)).toBe(
      Math.min(free, FREE_ALLOWANCE_BASE),
    );
    expect(sumBy(rows, CreditFundingType.FREE_BONUS)).toBe(
      Math.max(0, free - FREE_ALLOWANCE_BASE),
    );
    expect(sumBy(rows, CreditFundingType.SUBSCRIPTION)).toBe(5);
    expect(sumBy(rows, CreditFundingType.PURCHASED)).toBe(4);
    expect(sumBy(rows, CreditFundingType.ADMIN_GRANT)).toBe(1);

    const after = await CreditRepository.getBalance(
      spender.user,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(after.success && after.data.total).toBe(2);
  });
});

it("keeps the upstream cost intact when a free debit spans two funding buckets", async () => {
  const created = await createTestUser(`funding-cost-${stamp}@example.com`);
  expect(created.success).toBe(true);
  if (!created.success) {
    return;
  }
  const { user } = created.data;
  try {
    const before = await CreditRepository.getBalance(
      user,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(before.success && before.data.free).toBeGreaterThan(
      FREE_ALLOWANCE_BASE,
    );
    const result = await CreditRepository.deductCreditsForModelUsage(
      user,
      FREE_ALLOWANCE_BASE + 1,
      ChatModelId.GPT_5_MINI,
      logger,
      creditsT,
      defaultLocale,
      {
        upstreamCostUsd: 0.42,
        fallbackCostUsd: 0.21,
        upstreamProvider: "fixture",
        billingBasis: "mixed",
      },
    );
    expect(result.success).toBe(true);
    if (!result.success || result.data.messageId === undefined) {
      return expect.unreachable("Expected a recorded model debit");
    }
    const rows = await db
      .select({
        amount: creditTransactions.amount,
        fundingType: creditTransactions.fundingType,
        metadata: creditTransactions.metadata,
      })
      .from(creditTransactions)
      .where(eq(creditTransactions.messageId, result.data.messageId));
    expect(result.data.partialDeduction).toBe(false);
    expect(rows).toHaveLength(2);
    expect(new Set(rows.map(({ fundingType }) => fundingType))).toEqual(
      new Set([CreditFundingType.FREE_ALLOWANCE, CreditFundingType.FREE_BONUS]),
    );
    for (const row of rows) {
      const share = -row.amount / (FREE_ALLOWANCE_BASE + 1);
      expect(row.metadata).toMatchObject({ upstreamProvider: "fixture" });
      const upstream =
        "upstreamCostUsd" in row.metadata ? row.metadata.upstreamCostUsd : 0;
      const fallback =
        "fallbackCostUsd" in row.metadata ? row.metadata.fallbackCostUsd : 0;
      expect(upstream).toBeCloseTo(0.42 * share, 8);
      expect(fallback).toBeCloseTo(0.21 * share, 8);
    }
  } finally {
    await deleteTestUser(user.id);
  }
});

describe("pre-generation balance check uses the spendable amount", () => {
  let holder: TestUser;

  beforeAll(async () => {
    const created = await createTestUser(
      `funding-spendable-${stamp}@example.com`,
    );
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    holder = created.data;
    const pool = await CreditRepository.getUserPool(
      holder.user.id,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(pool.success).toBe(true);
  });

  afterAll(async () => {
    await deleteTestUser(holder.user.id);
  });

  it("refuses a wallet balance that no pack backs, before the provider runs", async () => {
    // The Atlas admin case: a raised balance with no credit pack behind it.
    await db
      .update(creditWallets)
      .set({ balance: 100_000 })
      .where(eq(creditWallets.userId, holder.user.id));

    const balance = await CreditRepository.getBalance(
      holder.user,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(balance.success).toBe(true);
    if (!balance.success) {
      return;
    }
    expect(balance.data.total).toBe(balance.data.free);

    const cost = balance.data.free + 50;
    const gate = await checkMediaBalance(
      holder.user,
      cost,
      defaultLocale,
      logger,
    );
    expect(gate.success).toBe(false);
    if (!gate.success) {
      expect(gate.errorType.errorCode).toBe(
        ErrorResponseTypes.PAYMENT_REQUIRED.errorCode,
      );
    }
    expect(
      await CreditRepository.hasSufficientCredits(
        holder.user,
        cost,
        logger,
        creditsT,
        defaultLocale,
      ),
    ).toBe(false);

    // A real pack makes the same charge pass the gate.
    const granted = await CreditRepository.addUserCredits(
      holder.user.id,
      60,
      "permanent",
      logger,
      creditsT,
      undefined,
      `funding-spendable-${stamp}`,
    );
    expect(granted.success).toBe(true);
    const passed = await checkMediaBalance(
      holder.user,
      cost,
      defaultLocale,
      logger,
    );
    expect(passed.success).toBe(true);
  });
});
