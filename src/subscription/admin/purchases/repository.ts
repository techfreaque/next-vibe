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
import { PaymentStatus } from "@/payment/enum";
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

/** Payment identified by the account and the pack's recorded reference. */
const paymentSql = sql<{
  id: string;
  amount: string | number;
  currency: string;
  planId: string | null;
} | null>`(
    select json_build_object('id', ${paymentTransactions.id}, 'amount', ${paymentTransactions.amount}, 'currency', ${paymentTransactions.currency},
      'planId', regexp_replace(${paymentTransactions.metadata}->>'planId', '^app[.]api[.]subscription[.]', ''))
    from ${paymentTransactions}
    where ${paymentTransactions.userId} = ${creditWallets.userId}
      and ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}
      and (${paymentTransactions.providerSessionId} = ${creditPacks.metadata}->>'sessionId'
        or ${paymentTransactions.providerInvoiceId} = ${creditPacks.metadata}->>'sessionId')
    order by ${paymentTransactions.createdAt} desc, ${paymentTransactions.id} desc
    limit 1
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
  [CreditPackSourceAdminFilter.ADMIN_GRANT]: ["bonus", "admin_grant"],
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
      const now = Date.now();
      const utcNow = new Date(now).toISOString();
      const weekAhead = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
      const unexpired = sql`(${creditPacks.expiresAt} is null or ${creditPacks.expiresAt} > ${utcNow}::timestamp)`;
      const expiringSoon = sql`${creditPacks.remaining} > 0
        and ${creditPacks.expiresAt} > ${utcNow}::timestamp
        and ${creditPacks.expiresAt} <= ${weekAhead}::timestamp`;

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

      const scope = and(...conditions);
      const whereClause = and(
        scope,
        searchFilters?.remaining === PackRemainingFilter.LEFT
          ? sql`${creditPacks.remaining} > 0 and ${unexpired}`
          : searchFilters?.remaining === PackRemainingFilter.USED_UP
            ? sql`${creditPacks.remaining} <= 0`
            : searchFilters?.remaining === PackRemainingFilter.EXPIRING_SOON
              ? expiringSoon
              : undefined,
      );

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
        })
        .from(creditPacks)
        .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
        .innerJoin(users, eq(creditWallets.userId, users.id))
        .where(whereClause)
        .orderBy(
          searchFilters?.remaining === PackRemainingFilter.EXPIRING_SOON
            ? asc(creditPacks.expiresAt)
            : orderDirection(sortColumn),
          desc(creditPacks.id),
        )
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
            ? (SubscriptionPlanDB.find(
                (plan) => plan === row.payment?.planId,
              ) ?? null)
            : null,
      }));

      // Totals over every matching pack (not only this page)
      const [totals, expiring, paidRows] = await Promise.all([
        db
          .select({
            credits: sql<number>`coalesce(sum(${creditPacks.originalAmount}), 0)`,
            remaining: sql<number>`coalesce(sum(${creditPacks.remaining}) filter (where ${unexpired}), 0)`,
          })
          .from(creditPacks)
          .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
          .innerJoin(users, eq(creditWallets.userId, users.id))
          .where(whereClause),
        db
          .select({
            packs: count(),
            credits: sql<number>`coalesce(sum(${creditPacks.remaining}), 0)`,
          })
          .from(creditPacks)
          .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
          .innerJoin(users, eq(creditWallets.userId, users.id))
          .where(and(scope, expiringSoon)),
        db
          .select({
            payment: paymentSql,
            packType: creditPacks.type,
            source: creditPacks.source,
          })
          .from(creditPacks)
          .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
          .innerJoin(users, eq(creditWallets.userId, users.id))
          .where(whereClause),
      ]);
      const paidByCurrency = new Map<(typeof CurrenciesArr)[number], number>();
      const paidSubs = new Map<(typeof CurrenciesArr)[number], number>();
      const paidPacks = new Map<(typeof CurrenciesArr)[number], number>();
      const matchedPayments = new Set<string>();
      let unmatchedPaidPacks = 0;
      for (const row of paidRows) {
        if (
          !row.payment &&
          row.source !== "admin_grant" &&
          (row.packType === CreditPackType.SUBSCRIPTION ||
            row.packType === CreditPackType.PERMANENT)
        ) {
          unmatchedPaidPacks += 1;
        }
        const currency = CurrenciesArr.find(
          (code) => code === row.payment?.currency,
        );
        if (row.payment && currency && !matchedPayments.has(row.payment.id)) {
          matchedPayments.add(row.payment.id);
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
        expiringPacks: expiring[0]?.packs ?? 0,
        expiringCredits: Number(expiring[0]?.credits ?? 0),
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
