/**
 * Credit pack purchase: packs top up a live plan (Max, 2026-11-17).
 *
 * - A signed-in user with NO subscription is refused (FORBIDDEN) for both
 *   providers (Stripe + NowPayments); with a live plan the checkout is created.
 *   The payment provider is mocked, the user/DB are real.
 * - Pack pricing params (standard + large) and per-country one-time prices.
 * - Credit grant on a confirmed payment is idempotent on webhook retries.
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { PaymentProvider } from "../../payment/enum";
import type { CheckoutSessionParams } from "../../payment/providers/types";
import {
  CREDIT_PACK_PRODUCT_IDS,
  getPricingParams,
  ProductIds,
  productsRepository,
} from "../../products/repository-client";
import { hasLivePlan } from "../../subscription/active-plan";
import { subscriptions } from "../../subscription/db";
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../subscription/enum";
import { scopedTranslation } from "../i18n";
import { CreditRepository } from "../repository";
import { scopedTranslation as purchaseScopedTranslation } from "./i18n";
import { CreditPurchaseRepository } from "./repository";

const capturedParams: CheckoutSessionParams[] = [];

vi.mock("../../payment/providers", () => ({
  getPaymentProvider: (): {
    name: string;
    ensureCustomer: () => Promise<ReturnType<typeof success>>;
    createCheckoutSession: (
      params: CheckoutSessionParams,
    ) => Promise<ReturnType<typeof success>>;
  } => ({
    name: "mock",
    ensureCustomer: () => Promise.resolve(success({ customerId: "cus_mock" })),
    createCheckoutSession: (params: CheckoutSessionParams) => {
      capturedParams.push(params);
      return Promise.resolve(
        success({
          sessionId: `sess_${capturedParams.length}`,
          checkoutUrl: "https://checkout.example.test/pay",
        }),
      );
    },
  }),
}));

const logger = createEndpointLogger(false, defaultLocale);
const { t: creditsT } = scopedTranslation.scopedT(defaultLocale);
const { t: purchaseT } = purchaseScopedTranslation.scopedT(defaultLocale);

describe("pack pricing", () => {
  it("sells only the standard pack", () => {
    expect([...CREDIT_PACK_PRODUCT_IDS]).toEqual([ProductIds.CREDIT_PACK]);
    expect(productsRepository.canPurchase(ProductIds.CREDIT_PACK)).toBe(true);
    expect(
      productsRepository.getProductDefinitions()[ProductIds.CREDIT_PACK]
        .allowedIntervals,
    ).toEqual(["one_time"]);
  });

  it("retires the large pack but keeps it resolvable for past purchases", () => {
    expect(productsRepository.canPurchase(ProductIds.CREDIT_PACK_LARGE)).toBe(
      false,
    );
    expect(productsRepository.isDeprecated(ProductIds.CREDIT_PACK_LARGE)).toBe(
      true,
    );
    expect(
      productsRepository.getReplacementProduct(ProductIds.CREDIT_PACK_LARGE),
    ).toBe(ProductIds.CREDIT_PACK);
    const large = productsRepository.getProduct(
      ProductIds.CREDIT_PACK_LARGE,
      "en-US",
      "one_time",
    );
    expect(large.credits).toBe(2500);
    expect(large.status).toBe("deprecated");
  });

  it("getPricingParams no longer advertises the large pack", () => {
    const params = getPricingParams("en-US");
    expect(params.packCredits).toBe("500");
    expect(params.packPrice).toBe("$5");
    expect(params.largePackCredits).toBeUndefined();
    expect(params.largePackPrice).toBeUndefined();
  });
});

describe("pack purchase requires a live plan", () => {
  let testUser: TestUser;
  let userId: string;

  beforeAll(async () => {
    const created = await createTestUser(
      `pack-plan-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example-test.invalid`,
    );
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success || created.data.user.isPublic) {
      throw new Error("test user setup failed");
    }
    testUser = created.data;
    userId = created.data.user.id;
  });

  afterAll(async () => {
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    await deleteTestUser(userId);
  });

  for (const provider of [PaymentProvider.STRIPE, PaymentProvider.NOWPAYMENTS]) {
    it(`refuses a ${provider} pack checkout without a plan`, async () => {
      const before = capturedParams.length;
      const res = await CreditPurchaseRepository.createCheckoutSession(
        { quantity: 1, productId: ProductIds.CREDIT_PACK, provider },
        userId,
        "en-US",
        logger,
        purchaseT,
      );
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.errorType.errorCode).toBe(
          ErrorResponseTypes.FORBIDDEN.errorCode,
        );
      }
      expect(capturedParams.length).toBe(before);
    });
  }

  it("refuses when the plan is canceled or its crypto period ran out", async () => {
    await db.insert(subscriptions).values({
      userId,
      planId: SubscriptionPlan.SUBSCRIPTION,
      status: SubscriptionStatus.ACTIVE,
      provider: PaymentProvider.NOWPAYMENTS,
      currentPeriodStart: new Date(Date.now() - 40 * 86_400_000),
      currentPeriodEnd: new Date(Date.now() - 5 * 86_400_000),
    });
    expect(await hasLivePlan(userId)).toBe(false);
    await db
      .update(subscriptions)
      .set({
        status: SubscriptionStatus.CANCELED,
        currentPeriodEnd: new Date(Date.now() + 5 * 86_400_000),
      })
      .where(eq(subscriptions.userId, userId));
    expect(await hasLivePlan(userId)).toBe(false);
  });

  it("allows packs once the plan is live", async () => {
    await db
      .update(subscriptions)
      .set({
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: new Date(Date.now() + 20 * 86_400_000),
      })
      .where(eq(subscriptions.userId, userId));
    expect(await hasLivePlan(userId)).toBe(true);
  });

  for (const provider of [PaymentProvider.STRIPE, PaymentProvider.NOWPAYMENTS]) {
    for (const productId of CREDIT_PACK_PRODUCT_IDS) {
      it(`creates a ${provider} checkout for ${productId} with a plan`, async () => {
        const before = capturedParams.length;
        const res = await CreditPurchaseRepository.createCheckoutSession(
          { quantity: 2, productId, provider },
          userId,
          "en-US",
          logger,
          purchaseT,
        );
        expect(res.success, JSON.stringify(res)).toBe(true);
        const product = productsRepository.getProduct(
          productId,
          "en-US",
          "one_time",
        );
        if (res.success) {
          expect(res.data.totalAmount).toBe(product.price * 2);
          expect(res.data.totalCredits).toBe(product.credits * 2);
        }
        const sent = capturedParams[before];
        expect(sent.interval).toBe("one_time");
        expect(sent.productId).toBe(productId);
        expect(sent.metadata.type).toBe("credit_pack");
        expect(sent.metadata.totalCredits).toBe(String(product.credits * 2));
      });
    }
  }

  // Uses the retired large pack: webhooks for packs bought before the
  // retirement must still grant the credits fixed at checkout.
  it("grants credits once even when the webhook is retried", async () => {
    const session = {
      id: `sess_idem_${Date.now()}`,
      metadata: {
        userId,
        type: "credit_pack",
        productId: ProductIds.CREDIT_PACK_LARGE,
        quantity: "1",
        totalCredits: "2500",
      },
    };
    const balance = async (): Promise<number> => {
      const res = await CreditRepository.getBalance(
        testUser.user,
        logger,
        creditsT,
        defaultLocale,
      );
      expect(res.success, JSON.stringify(res)).toBe(true);
      return res.success ? res.data.permanent : -1;
    };
    const start = await balance();
    await CreditRepository.handleCreditPackPurchase(session, logger, creditsT);
    expect(await balance()).toBe(start + 2500);
    await CreditRepository.handleCreditPackPurchase(session, logger, creditsT);
    await CreditRepository.handleCreditPackPurchase(session, logger, creditsT);
    expect(await balance()).toBe(start + 2500);
  }, 60_000);
});
