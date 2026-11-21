/**
 * Subscription Admin Purchases Repository
 * Business logic for listing credit pack purchases
 */

import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import {
  type CountryLanguage,
  CurrenciesArr,
} from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditPacks, creditWallets } from "@/credits/db";
import { CreditPackType } from "@/credits/enum";
import { paymentTransactions } from "@/payment/db";
import { CheckoutMode, PaymentStatus } from "@/payment/enum";
import { subscriptions } from "@/subscription/db";
import { SubscriptionPlanDB } from "@/subscription/enum";

import {
  CreditPackSourceAdminFilter,
  CreditPackTypeAdminFilter,
  PurchaseSortField,
  SortOrder,
} from "../enum";
import type {
  PurchasesGetRequestOutput,
  PurchasesGetResponseOutput,
} from "./definition";
import { PackRemainingFilter } from "./enum";
import { scopedTranslation } from "./i18n";

type PurchasesResponse = NonNullable<PurchasesGetResponseOutput["response"]>;

/**
 * Payment that bought a pack: matched by the pack's idempotency key, else the
 * same account's subscription charge within a day of a subscription pack.
 */
const paymentSql = sql<{
  id: string;
  amount: string | number;
  currency: string;
} | null>`coalesce(
  (
    select json_build_object('id', ${paymentTransactions.id}, 'amount', ${paymentTransactions.amount}, 'currency', ${paymentTransactions.currency})
    from ${paymentTransactions}
    where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}
      and (${paymentTransactions.providerSessionId} = ${creditPacks.metadata}->>'sessionId'
        or ${paymentTransactions.providerInvoiceId} = ${creditPacks.metadata}->>'sessionId')
    limit 1
  ),
  (
    select json_build_object('id', ${paymentTransactions.id}, 'amount', ${paymentTransactions.amount}, 'currency', ${paymentTransactions.currency})
    from ${paymentTransactions}
    where ${creditPacks.type} = ${CreditPackType.SUBSCRIPTION}
      and ${paymentTransactions.userId} = ${creditWallets.userId}
      and ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}
      and ${paymentTransactions.mode} = ${CheckoutMode.SUBSCRIPTION}
      and abs(extract(epoch from (${paymentTransactions.createdAt} - ${creditPacks.createdAt}))) < 86400
    order by abs(extract(epoch from (${paymentTransactions.createdAt} - ${creditPacks.createdAt})))
    limit 1
  )
)`;

const packTypeMap = {
  [CreditPackTypeAdminFilter.SUBSCRIPTION]: CreditPackType.SUBSCRIPTION,
  [CreditPackTypeAdminFilter.PERMANENT]: CreditPackType.PERMANENT,
  [CreditPackTypeAdminFilter.BONUS]: CreditPackType.BONUS,
  [CreditPackTypeAdminFilter.EARNED]: CreditPackType.EARNED,
} as const;

const sourceMap = {
  [CreditPackSourceAdminFilter.STRIPE_PURCHASE]: [
    "permanent_purchase",
    "permanent",
  ],
  [CreditPackSourceAdminFilter.STRIPE_SUBSCRIPTION]: [
    "subscription_purchase",
    "subscription",
  ],
  [CreditPackSourceAdminFilter.ADMIN_GRANT]: ["bonus"],
  [CreditPackSourceAdminFilter.REFERRAL_EARNING]: ["referral_earning"],
};

export class SubscriptionAdminPurchasesRepository {
  /**
   * List credit pack purchases with filtering and pagination
   */
  static async listPurchases(
    data: PurchasesGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PurchasesGetResponseOutput>> {
    try {
      const { searchFilters } = data;
      const sortBy =
        data.sortingOptions?.sortBy ?? PurchaseSortField.CREATED_AT;
      const sortOrder = data.sortingOptions?.sortOrder ?? SortOrder.DESC;
      const page = data.paginationInfo?.page ?? 1;
      const limit = data.paginationInfo?.limit ?? 20;

      const conditions: SQL[] = [];

      // Only show packs that belong to user wallets (not lead wallets)
      conditions.push(sql`${creditWallets.userId} IS NOT NULL`);

      // Pack type filter (stored values are the credits pack type keys)
      const packTypes = (searchFilters?.packType ?? []).flatMap((packType) =>
        packType === CreditPackTypeAdminFilter.ANY
          ? []
          : [packTypeMap[packType]],
      );
      if (
        packTypes.length > 0 &&
        !searchFilters?.packType?.includes(CreditPackTypeAdminFilter.ANY)
      ) {
        conditions.push(inArray(creditPacks.type, packTypes));
      }

      // Source filter (stored sources: <type>_purchase, bonus, referral_earning)
      if (
        searchFilters?.source &&
        searchFilters.source !== CreditPackSourceAdminFilter.ANY
      ) {
        conditions.push(
          inArray(creditPacks.source, sourceMap[searchFilters.source]),
        );
      }

      // Date range filters
      if (searchFilters?.dateFrom) {
        conditions.push(gte(creditPacks.createdAt, searchFilters.dateFrom));
      }
      if (searchFilters?.dateTo) {
        conditions.push(lte(creditPacks.createdAt, searchFilters.dateTo));
      }

      if (searchFilters?.remaining === PackRemainingFilter.LEFT) {
        conditions.push(sql`${creditPacks.remaining} > 0`);
      }
      if (searchFilters?.remaining === PackRemainingFilter.USED_UP) {
        conditions.push(sql`${creditPacks.remaining} <= 0`);
      }

      // Search on user email/name
      if (searchFilters?.search) {
        const searchTerm = `%${searchFilters.search}%`;
        conditions.push(
          or(
            ilike(users.email, searchTerm),
            ilike(users.privateName, searchTerm),
          )!,
        );
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Sort mapping
      const sortColumn = (():
        | typeof creditPacks.createdAt
        | typeof creditPacks.originalAmount
        | typeof creditPacks.type
        | typeof users.email => {
        switch (sortBy) {
          case PurchaseSortField.AMOUNT:
            return creditPacks.originalAmount;
          case PurchaseSortField.TYPE:
            return creditPacks.type;
          case PurchaseSortField.USER_EMAIL:
            return users.email;
          case PurchaseSortField.CREATED_AT:
          default:
            return creditPacks.createdAt;
        }
      })();

      const orderDirection = sortOrder === SortOrder.ASC ? asc : desc;

      // Count total
      const [countResult] = await db
        .select({ value: count() })
        .from(creditPacks)
        .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
        .innerJoin(users, eq(creditWallets.userId, users.id))
        .where(whereClause);

      const totalCount = countResult?.value ?? 0;
      const pageCount = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;

      // Fetch purchases
      const rows = await db
        .select({
          id: creditPacks.id,
          userId: users.id,
          userEmail: users.email,
          userName: users.privateName,
          packType: creditPacks.type,
          source: creditPacks.source,
          originalAmount: creditPacks.originalAmount,
          remaining: creditPacks.remaining,
          expiresAt: creditPacks.expiresAt,
          createdAt: creditPacks.createdAt,
          payment: paymentSql,
          planId: sql<string | null>`(
            select ${subscriptions.planId} from ${subscriptions}
            where ${subscriptions.userId} = ${users.id}
            order by ${subscriptions.createdAt} desc limit 1
          )`,
        })
        .from(creditPacks)
        .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
        .innerJoin(users, eq(creditWallets.userId, users.id))
        .where(whereClause)
        .orderBy(orderDirection(sortColumn))
        .limit(limit)
        .offset(offset);

      const purchases: PurchasesResponse["purchases"] = rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        userEmail: row.userEmail ?? "",
        userName: row.userName ?? "",
        packType: row.packType ?? "",
        source: row.source ?? "",
        originalAmount: row.originalAmount,
        remaining: row.remaining,
        expiresAt: row.expiresAt,
        createdAt: row.createdAt,
        paidAmount: row.payment ? Number(row.payment.amount) : null,
        paymentId: row.payment?.id ?? null,
        paidCurrency:
          CurrenciesArr.find((code) => code === row.payment?.currency) ?? null,
        planId:
          row.packType === CreditPackType.SUBSCRIPTION
            ? (SubscriptionPlanDB.find((plan) => plan === row.planId) ?? null)
            : null,
      }));

      // Totals over every matching pack (not only this page)
      const [totals, paidRows] = await Promise.all([
        db
          .select({
            credits: sql<number>`coalesce(sum(${creditPacks.originalAmount}), 0)`,
            remaining: sql<number>`coalesce(sum(${creditPacks.remaining}), 0)`,
          })
          .from(creditPacks)
          .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
          .innerJoin(users, eq(creditWallets.userId, users.id))
          .where(whereClause),
        db
          .select({ payment: paymentSql, packType: creditPacks.type })
          .from(creditPacks)
          .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
          .innerJoin(users, eq(creditWallets.userId, users.id))
          .where(whereClause),
      ]);
      const paidByCurrency = new Map<(typeof CurrenciesArr)[number], number>();
      const paidSubs = new Map<(typeof CurrenciesArr)[number], number>();
      const paidPacks = new Map<(typeof CurrenciesArr)[number], number>();
      let unmatchedPaidPacks = 0;
      for (const row of paidRows) {
        if (
          !row.payment &&
          (row.packType === CreditPackType.SUBSCRIPTION ||
            row.packType === CreditPackType.PERMANENT)
        ) {
          unmatchedPaidPacks += 1;
        }
        const currency = CurrenciesArr.find(
          (code) => code === row.payment?.currency,
        );
        if (row.payment && currency) {
          paidByCurrency.set(
            currency,
            (paidByCurrency.get(currency) ?? 0) + Number(row.payment.amount),
          );
          const bucket =
            row.packType === CreditPackType.SUBSCRIPTION ? paidSubs : paidPacks;
          bucket.set(
            currency,
            (bucket.get(currency) ?? 0) + Number(row.payment.amount),
          );
        }
      }
      const summary = {
        unmatchedPaidPacks,
        credits: Number(totals[0]?.credits ?? 0),
        remaining: Number(totals[0]?.remaining ?? 0),
        paid: [...paidByCurrency.entries()].map(([currency, amount]) => ({
          currency,
          amount: Math.round(amount * 100) / 100,
        })),
        paidSubscriptions: [...paidSubs.entries()].map(
          ([currency, amount]) => ({
            currency,
            amount: Math.round(amount * 100) / 100,
          }),
        ),
        paidPacks: [...paidPacks.entries()].map(([currency, amount]) => ({
          currency,
          amount: Math.round(amount * 100) / 100,
        })),
      };

      return success({
        response: { purchases, summary },
        paginationInfo: {
          page,
          limit,
          totalCount,
          pageCount,
        },
      });
    } catch (error) {
      logger.error("Failed to list purchases", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
