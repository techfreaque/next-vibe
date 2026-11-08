/**
 * Account deletion ordering — integration tests (real DB).
 *
 * Billing is canceled FIRST: if the provider cancel fails the account must
 * stay (deleting it would keep billing a user who can no longer cancel).
 * On success the user is gone and email-bearing leads are scrubbed.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { SubscriptionPlan, SubscriptionStatus } from "@/subscription/enum";
import { subscriptions } from "@/subscription/db";
import { SubscriptionRepository } from "@/subscription/repository";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import { scopedTranslation } from "./i18n";
import { UserProfileRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const stamp = Date.now();
const email = `delete-order-${stamp}@example.com`;

let account: TestUser;

async function userExists(userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId));
  return rows.length > 0;
}

describe("UserProfileRepository.deleteAccount", () => {
  beforeAll(async () => {
    const created = await createTestUser(email);
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    account = created.data;
    await db.insert(subscriptions).values({
      userId: account.user.id,
      status: SubscriptionStatus.ACTIVE,
      planId: SubscriptionPlan.SUBSCRIPTION,
      providerSubscriptionId: `sub_test_delete_${stamp}`,
    });
    // A lead carrying the user's email (e.g. a newsletter/contact capture)
    await db
      .update(leads)
      .set({ email })
      .where(eq(leads.id, account.user.leadId));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    if (await userExists(account.user.id)) {
      await deleteTestUser(account.user.id);
    }
  });

  it("aborts — and keeps the account — when billing cannot be canceled", async () => {
    const cancel = vi
      .spyOn(SubscriptionRepository, "cancelSubscription")
      .mockResolvedValue(
        fail({
          message: "subscription.errors.cancel_failed",
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        }),
      );

    const result = await UserProfileRepository.deleteAccount(
      account.user,
      defaultLocale,
      logger,
      t,
    );

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(result.message).toBe(t("delete.errors.billingCancelFailed"));
    expect(await userExists(account.user.id)).toBe(true);
  });

  it("cancels billing first, then deletes the user and scrubs leads", async () => {
    const order: string[] = [];
    vi.spyOn(SubscriptionRepository, "cancelSubscription").mockImplementation(
      async () => {
        order.push(
          (await userExists(account.user.id))
            ? "cancel-before-delete"
            : "cancel-after-delete",
        );
        return success({
          success: true,
          message: "subscription.cancel.success",
        });
      },
    );

    const result = await UserProfileRepository.deleteAccount(
      account.user,
      defaultLocale,
      logger,
      t,
    );

    expect(result.success).toBe(true);
    expect(order).toEqual(["cancel-before-delete"]);
    expect(await userExists(account.user.id)).toBe(false);

    const [lead] = await db
      .select({ email: leads.email, convertedUserId: leads.convertedUserId })
      .from(leads)
      .where(eq(leads.id, account.user.leadId));
    expect(lead?.email ?? null).toBeNull();
    expect(lead?.convertedUserId ?? null).toBeNull();
  });
});
