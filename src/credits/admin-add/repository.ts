/**
 * Admin Add Credits Repository
 * Handles adding credit packs to user accounts (admin only)
 */

import "server-only";

import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { databaseFailureDiagnostics } from "next-vibe/database/error-diagnostics";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { paymentTransactions } from "@/payment/db";
import { CheckoutMode, PaymentStatus } from "@/payment/enum";
import { subscriptions } from "@/subscription/db";
import type { SubscriptionPlanValue } from "@/subscription/enum";

import { creditPacks, creditWallets } from "../db";
import { scopedTranslation } from "../i18n";
import { CreditRepository } from "../repository";
import type {
  AdminAddCreditsPostRequestOutput,
  AdminAddCreditsPostResponseOutput,
  GrantRecipientGetResponseOutput,
} from "./definition";

export class AdminAddCreditsRepository {
  static async getRecipient(
    targetUserId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<GrantRecipientGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const lookupBy = targetUserId.includes("@") ? "email" : "id";
    let stage = "recipient-account";
    try {
      const [recipient] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.privateName,
          joinedAt: users.createdAt,
        })
        .from(users)
        .where(
          lookupBy === "email"
            ? eq(sql`lower(${users.email})`, targetUserId.toLowerCase())
            : eq(users.id, targetUserId),
        )
        .limit(1);

      if (!recipient) {
        logger.warn("Credit grant recipient account not found", { lookupBy });
        return fail({
          message: t("adminAdd.post.errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      stage = "subscription-devices-grants";
      const [[subscription], [devices], recentGrants] = await Promise.all([
        db
          .select({
            planId: sql<typeof SubscriptionPlanValue>`
              regexp_replace(${subscriptions.planId}, '^app[.]api[.]subscription[.]', '')
            `,
            status: subscriptions.status,
            currentPeriodEnd: subscriptions.currentPeriodEnd,
            cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
            provider: subscriptions.provider,
            providerSubscriptionId: subscriptions.providerSubscriptionId,
          })
          .from(subscriptions)
          .where(eq(subscriptions.userId, recipient.id))
          .orderBy(desc(subscriptions.createdAt))
          .limit(1),
        db
          .select({ value: count() })
          .from(userLeadLinks)
          .where(eq(userLeadLinks.userId, recipient.id)),
        db
          .select({
            amount: creditPacks.originalAmount,
            createdAt: creditPacks.createdAt,
          })
          .from(creditPacks)
          .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
          .where(
            and(
              eq(creditWallets.userId, recipient.id),
              inArray(creditPacks.source, ["bonus", "admin_grant"]),
            ),
          )
          .orderBy(desc(creditPacks.createdAt), desc(creditPacks.id))
          .limit(5),
      ]);

      stage = "last-subscription-charge";
      const [lastCharge] = subscription?.providerSubscriptionId
        ? await db
            .select({
              amount: paymentTransactions.amount,
              currency: paymentTransactions.currency,
            })
            .from(paymentTransactions)
            .where(
              and(
                eq(paymentTransactions.userId, recipient.id),
                eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
                eq(paymentTransactions.mode, CheckoutMode.SUBSCRIPTION),
                eq(paymentTransactions.provider, subscription.provider),
                sql`${paymentTransactions.metadata}->>'subscriptionId' = ${subscription.providerSubscriptionId}`,
              ),
            )
            .orderBy(desc(paymentTransactions.createdAt))
            .limit(1)
        : [];

      stage = "pool-balance";
      const pool = await CreditRepository.adminPoolBalance(
        recipient.id,
        undefined,
      );

      return success({
        freeBalance: pool.free,
        subscription: subscription
          ? {
              planId: subscription.planId,
              status: subscription.status,
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
              currentPeriodEnd: subscription.currentPeriodEnd ?? null,
              lastChargeAmount: lastCharge ? Number(lastCharge.amount) : null,
              lastChargeCurrency: lastCharge?.currency ?? null,
            }
          : null,
        linkedDevices: Number(devices?.value ?? 0),
        recentGrants: recentGrants.map((grant) => ({
          amount: Number(grant.amount),
          createdAt: grant.createdAt,
        })),
        id: recipient.id,
        email: recipient.email,
        name: recipient.name || null,
        balance: pool.paid,
        joinedAt: recipient.joinedAt,
      });
    } catch (error) {
      logger.error("Failed to verify credit grant recipient", {
        lookupBy,
        stage,
        ...databaseFailureDiagnostics(
          error instanceof Error ? error : parseError(error),
        ),
      });
      return fail({
        message: t("adminAdd.recipient.loadFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async addCredits(
    data: AdminAddCreditsPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<AdminAddCreditsPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const recipient = await AdminAddCreditsRepository.getRecipient(
      data.targetUserId,
      logger,
      locale,
    );
    if (!recipient.success) {
      return recipient;
    }

    const result = await CreditRepository.addUserCredits(
      recipient.data.id,
      data.amount,
      "bonus",
      logger,
      t,
    );
    if (!result.success) {
      return result;
    }
    return success({
      recipientId: recipient.data.id,
      packId: result.data.packId ?? undefined,
      message: t("repository.bonusCreditsAdded", { amount: data.amount }),
    });
  }
}
