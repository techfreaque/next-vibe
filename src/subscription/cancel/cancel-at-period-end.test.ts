/**
 * "Cancel at period end" keeps the paid Stripe period: the subscription is
 * updated with cancel_at_period_end, never deleted. An immediate cancel still
 * deletes it.
 */

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { pgliteReady } from "next-vibe/database/client";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import Stripe from "stripe";
import { expect, it, vi } from "vitest";

import { PaymentProvider } from "../../payment/enum";
import { StripeProvider } from "../../payment/providers/stripe/repository";
import { ProductIds } from "../../products/repository-client";
import { subscriptions } from "../db";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../enum";
import { SubscriptionRepository } from "../repository";

type StripeHttpRequest = InstanceType<typeof Stripe.HttpClient>["makeRequest"];

function recordingStripe(calls: { method: string; path: string; body: string }[]): Stripe {
  return new Stripe("sk_test_cancel_fixture", {
    maxNetworkRetries: 0,
    httpClient: {
      getClientName: (): string => "cancel-fixture",
      async makeRequest(
        ...[, , path, method, , body]: Parameters<StripeHttpRequest>
      ): ReturnType<StripeHttpRequest> {
        calls.push({ method, path, body: String(body ?? "") });
        const response = {
          id: "sub_cancel_fixture",
          object: "subscription",
          status: method === "DELETE" ? "canceled" : "active",
          cancel_at_period_end: method !== "DELETE",
        };
        return {
          getStatusCode: (): number => 200,
          getHeaders: (): Record<string, string> => ({}),
          getRawResponse: (): typeof response => response,
          toStream: (): null => null,
          toJSON: async (): Promise<typeof response> => response,
        };
      },
    },
  });
}

const logger = createEndpointLogger(false, "en-US");

async function withStripeSubscriber(
  run: (userId: string, providerSubscriptionId: string) => Promise<void>,
): Promise<void> {
  await pgliteReady;
  const created = await createTestUser(
    `cancel-period-end-${crypto.randomUUID()}@example.test`,
  );
  expect(created.success).toBe(true);
  if (!created.success) {
    return;
  }
  const userId = created.data.user.id;
  const providerSubscriptionId = `sub_cancel_${crypto.randomUUID()}`;
  try {
    await db.insert(subscriptions).values({
      userId,
      planId: SubscriptionPlan.SUBSCRIPTION,
      billingInterval: BillingInterval.MONTHLY,
      productId: ProductIds.SUBSCRIPTION,
      status: SubscriptionStatus.ACTIVE,
      provider: PaymentProvider.STRIPE,
      providerSubscriptionId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 20 * 86400_000),
    });
    await run(userId, providerSubscriptionId);
  } finally {
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    await deleteTestUser(userId);
  }
}

it("cancel at period end updates the Stripe subscription instead of ending it", async () => {
  const calls: { method: string; path: string; body: string }[] = [];
  const getStripe = vi
    .spyOn(StripeProvider, "getStripe")
    .mockReturnValue(recordingStripe(calls));
  try {
    await withStripeSubscriber(async (userId, providerSubscriptionId) => {
      const result = await SubscriptionRepository.cancelSubscription(
        { cancelAtPeriodEnd: true },
        userId,
        logger,
        "en-US",
      );
      expect(result.success).toBe(true);
      expect(calls).toHaveLength(1);
      expect(calls[0]?.method).toBe("POST");
      expect(calls[0]?.path).toBe(`/v1/subscriptions/${providerSubscriptionId}`);
      expect(new URLSearchParams(calls[0]?.body).get("cancel_at_period_end")).toBe(
        "true",
      );

      const [row] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));
      expect(row?.status).toBe(SubscriptionStatus.ACTIVE);
      expect(row?.cancelAtPeriodEnd).toBe(true);
      expect(row?.endedAt).toBeNull();
    });
  } finally {
    getStripe.mockRestore();
  }
});

it("immediate cancel still deletes the Stripe subscription", async () => {
  const calls: { method: string; path: string; body: string }[] = [];
  const getStripe = vi
    .spyOn(StripeProvider, "getStripe")
    .mockReturnValue(recordingStripe(calls));
  try {
    await withStripeSubscriber(async (userId, providerSubscriptionId) => {
      const result = await SubscriptionRepository.cancelSubscription(
        { cancelAtPeriodEnd: false },
        userId,
        logger,
        "en-US",
      );
      expect(result.success).toBe(true);
      expect(calls.map((call) => `${call.method} ${call.path}`)).toEqual([
        `DELETE /v1/subscriptions/${providerSubscriptionId}`,
      ]);
      const [row] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));
      expect(row?.status).toBe(SubscriptionStatus.CANCELED);
    });
  } finally {
    getStripe.mockRestore();
  }
});
