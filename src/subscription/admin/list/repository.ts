/**
 * Subscription Admin List Repository
 * Business logic for listing and filtering subscriptions
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
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
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

import { REVENUE_FX_RATES } from "@/payment/analytics/money-sql";
import { paymentTransactions } from "@/payment/db";
import { CheckoutMode, PaymentProvider, PaymentStatus } from "@/payment/enum";
import { subscriptions } from "@/subscription/db";
import {
  BillingInterval,
  type SubscriptionPlanValue,
  SubscriptionStatus,
  type SubscriptionStatusValue,
} from "@/subscription/enum";

import {
  BillingIntervalAdminFilter,
  ProviderAdminFilter,
  SortOrder,
  SubscriptionSortField,
  SubscriptionStatusAdminFilter,
} from "../enum";
import type {
  SubscriptionListRequestOutput,
  SubscriptionListResponseOutput,
} from "./definition";
import { SubscriptionFocus } from "./enum";
import type { SubscriptionAdminListT } from "./i18n";

const statusMap = {
  [SubscriptionStatusAdminFilter.ALL]: null,
  [SubscriptionStatusAdminFilter.ACTIVE]: SubscriptionStatus.ACTIVE,
  [SubscriptionStatusAdminFilter.TRIALING]: SubscriptionStatus.TRIALING,
  [SubscriptionStatusAdminFilter.PAST_DUE]: SubscriptionStatus.PAST_DUE,
  [SubscriptionStatusAdminFilter.CANCELED]: SubscriptionStatus.CANCELED,
  [SubscriptionStatusAdminFilter.UNPAID]: SubscriptionStatus.UNPAID,
  [SubscriptionStatusAdminFilter.PAUSED]: SubscriptionStatus.PAUSED,
  [SubscriptionStatusAdminFilter.INCOMPLETE]: SubscriptionStatus.INCOMPLETE,
  [SubscriptionStatusAdminFilter.INCOMPLETE_EXPIRED]:
    SubscriptionStatus.INCOMPLETE_EXPIRED,
};

const intervalMap = {
  [BillingIntervalAdminFilter.ANY]: null,
  [BillingIntervalAdminFilter.MONTHLY]: BillingInterval.MONTHLY,
  [BillingIntervalAdminFilter.YEARLY]: BillingInterval.YEARLY,
};

const providerMap = {
  [ProviderAdminFilter.ANY]: null,
  [ProviderAdminFilter.STRIPE]: PaymentProvider.STRIPE,
  [ProviderAdminFilter.NOWPAYMENTS]: PaymentProvider.NOWPAYMENTS,
};

const exactSubscription = sql<boolean>`coalesce(
  ${paymentTransactions.metadata}->>'subscriptionId' = ${subscriptions.providerSubscriptionId},
  false
)`;

// Older checkout rows omit the provider subscription reference. Require the
// same plan and period before suggesting an inferred match for those rows.
const lastPaymentSql = sql<{
  amount: string | number;
  currency: string;
  at: string;
  estimated: boolean;
} | null>`(
            select json_build_object('amount', ${paymentTransactions.amount}, 'currency', ${paymentTransactions.currency}, 'at', ${paymentTransactions.createdAt}, 'estimated', not ${exactSubscription})
            from ${paymentTransactions}
            where ${paymentTransactions.userId} = ${subscriptions.userId}
              and ${paymentTransactions.provider} = ${subscriptions.provider}
              and ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}
              and ${paymentTransactions.mode} = ${CheckoutMode.SUBSCRIPTION}
              and (${exactSubscription} or (
                ${paymentTransactions.metadata}->>'subscriptionId' is null
                and regexp_replace(${paymentTransactions.metadata}->>'planId', '^app[.]api[.]subscription[.]', '') =
                    regexp_replace(${subscriptions.planId}, '^app[.]api[.]subscription[.]', '')
                and regexp_replace(${paymentTransactions.metadata}->>'billingInterval', '^app[.]api[.]subscription[.]', '') = ${subscriptions.billingInterval}
                and abs(extract(epoch from (${paymentTransactions.createdAt} - (${subscriptions.currentPeriodStart} at time zone 'UTC')))) < 86400
              ))
            order by ${paymentTransactions.createdAt} desc, ${exactSubscription} desc, ${paymentTransactions.id} desc
            limit 1
          )`;

const DAY_MS = 24 * 60 * 60 * 1000;

export class SubscriptionAdminListRepository {
  // Older rows still carry the translation namespace in the stored plan ID.
  private static readonly planId = sql<typeof SubscriptionPlanValue>`
    regexp_replace(${subscriptions.planId}, '^app[.]api[.]subscription[.]', '')
  `;

  /**
   * Convert status filter values to DB conditions
   */
  private static convertStatusFilters(
    statuses:
      | (typeof SubscriptionStatusAdminFilter)[keyof typeof SubscriptionStatusAdminFilter][]
      | undefined,
  ): SQL | null {
    const mappedStatuses = statuses
      ?.map((status) => statusMap[status])
      .filter(
        (status): status is typeof SubscriptionStatusValue => status !== null,
      );
    return mappedStatuses?.length
      ? inArray(subscriptions.status, mappedStatuses)
      : null;
  }

  /**
   * List subscriptions with filters and pagination
   */
  static async listSubscriptions(
    rawQuery: SubscriptionListRequestOutput | undefined,
    logger: EndpointLogger,
    t: SubscriptionAdminListT,
  ): Promise<ResponseType<SubscriptionListResponseOutput>> {
    try {
      const searchFilters = rawQuery?.searchFilters;
      const sortingOptions = rawQuery?.sortingOptions;
      const paginationInfo = rawQuery?.paginationInfo;

      const page = paginationInfo?.page ?? 1;
      const limit = paginationInfo?.limit ?? 20;
      const offset = (page - 1) * limit;

      logger.debug("Listing subscriptions", {
        page,
        limit,
      });

      // Build where conditions
      const whereConditions: SQL[] = [];
      if (rawQuery?.userId) {
        whereConditions.push(eq(subscriptions.userId, rawQuery.userId));
      }

      // Search by user email or name
      if (searchFilters?.search) {
        const searchCondition = or(
          ilike(users.email, `%${searchFilters.search}%`),
          ilike(users.privateName, `%${searchFilters.search}%`),
          ilike(users.publicName, `%${searchFilters.search}%`),
        );
        if (searchCondition) {
          whereConditions.push(searchCondition);
        }
      }

      // Plan filter (kept apart: the plan counts ignore it)
      const planCondition = searchFilters?.plan
        ? eq(SubscriptionAdminListRepository.planId, searchFilters.plan)
        : undefined;

      // Summary-card drill: renewing within 7 days / set to end
      const liveSql = sql`${subscriptions.status} in (${SubscriptionStatus.ACTIVE}, ${SubscriptionStatus.TRIALING})`;
      const endingSql = sql`(${subscriptions.cancelAtPeriodEnd} or ${subscriptions.cancelAt} is not null)`;
      const focusCondition =
        searchFilters?.focus === SubscriptionFocus.ENDING
          ? sql`${liveSql} and ${endingSql}`
          : searchFilters?.focus === SubscriptionFocus.RENEWING_SOON
            ? sql`${liveSql} and not ${endingSql} and ${subscriptions.currentPeriodEnd} >= now() and ${subscriptions.currentPeriodEnd} <= now() + interval '7 days'`
            : undefined;

      // Status filter (kept apart: the status counts ignore it)
      const statusCondition =
        SubscriptionAdminListRepository.convertStatusFilters(
          searchFilters?.status,
        );

      // Interval filter
      const interval =
        searchFilters?.interval && intervalMap[searchFilters.interval];
      if (interval) {
        whereConditions.push(eq(subscriptions.billingInterval, interval));
      }

      // Provider filter
      const provider =
        searchFilters?.provider && providerMap[searchFilters.provider];
      if (provider) {
        whereConditions.push(eq(subscriptions.provider, provider));
      }

      // Date filters
      if (
        (searchFilters?.dateFrom &&
          !Number.isFinite(searchFilters.dateFrom.getTime())) ||
        (searchFilters?.dateTo &&
          !Number.isFinite(searchFilters.dateTo.getTime()))
      ) {
        return fail({
          message: t("get.errors.validation.description"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      if (searchFilters?.dateFrom) {
        whereConditions.push(
          gte(subscriptions.createdAt, searchFilters.dateFrom),
        );
      }
      if (searchFilters?.dateTo) {
        whereConditions.push(
          lte(subscriptions.createdAt, searchFilters.dateTo),
        );
      }

      const baseClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;
      const whereClause = and(
        baseClause,
        statusCondition ?? undefined,
        planCondition,
        focusCondition,
      );

      // Count total + per status (status counts ignore the status filter)
      const [[countResult], statusRows, planRows] = await Promise.all([
        db
          .select({ total: count() })
          .from(subscriptions)
          .leftJoin(users, eq(subscriptions.userId, users.id))
          .where(whereClause),
        db
          .select({ status: subscriptions.status, count: count() })
          .from(subscriptions)
          .leftJoin(users, eq(subscriptions.userId, users.id))
          .where(and(baseClause, planCondition))
          .groupBy(subscriptions.status)
          .orderBy(desc(count())),
        db
          .select({
            plan: SubscriptionAdminListRepository.planId,
            count: count(),
          })
          .from(subscriptions)
          .leftJoin(users, eq(subscriptions.userId, users.id))
          .where(and(baseClause, statusCondition ?? undefined, focusCondition))
          .groupBy(SubscriptionAdminListRepository.planId)
          .orderBy(desc(count())),
      ]);

      const totalCount = countResult?.total ?? 0;
      const pageCount = Math.ceil(totalCount / limit);

      // Summary over the same filters (status ignored): what is coming up
      const summaryRows = await db
        .select({
          status: subscriptions.status,
          billingInterval: subscriptions.billingInterval,
          currentPeriodEnd: subscriptions.currentPeriodEnd,
          cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
          cancelAt: subscriptions.cancelAt,
          lastPayment: lastPaymentSql,
        })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(and(baseClause, planCondition));
      const now = Date.now();
      const mrrByCurrency = new Map<(typeof CurrenciesArr)[number], number>();
      let renewingSoon = 0;
      let ending = 0;
      let pastDue = 0;
      let noCharge = 0;
      for (const row of summaryRows) {
        const live =
          row.status === SubscriptionStatus.ACTIVE ||
          row.status === SubscriptionStatus.TRIALING;
        if (row.status === SubscriptionStatus.PAST_DUE) {
          pastDue += 1;
        }
        if (!live) {
          continue;
        }
        const endsAt = row.currentPeriodEnd?.getTime();
        if (row.cancelAtPeriodEnd || row.cancelAt) {
          ending += 1;
        } else if (
          endsAt !== undefined &&
          endsAt >= now &&
          endsAt - now <= 7 * DAY_MS
        ) {
          renewingSoon += 1;
        }
        const currency = CurrenciesArr.find(
          (code) => code === row.lastPayment?.currency,
        );
        if (!row.lastPayment || !currency) {
          noCharge += 1;
          continue;
        }
        if (row.cancelAtPeriodEnd || row.cancelAt) {
          continue;
        }
        const monthly =
          Number(row.lastPayment.amount) /
          (row.billingInterval === BillingInterval.YEARLY ? 12 : 1);
        mrrByCurrency.set(
          currency,
          (mrrByCurrency.get(currency) ?? 0) + monthly,
        );
      }
      const mrr = [...mrrByCurrency.entries()].map(([currency, amount]) => ({
        currency,
        amount: Math.round(amount * 100) / 100,
      }));
      const mrrUsd =
        Math.round(
          mrr.reduce(
            (sum, row) =>
              sum +
              row.amount *
                (REVENUE_FX_RATES.find((rate) => rate.currency === row.currency)
                  ?.usdRate ?? 0),
            0,
          ) * 100,
        ) / 100;

      // Determine sort
      const sortBy = sortingOptions?.sortBy ?? SubscriptionSortField.CREATED_AT;
      const sortOrder = sortingOptions?.sortOrder ?? SortOrder.DESC;
      const orderFn = sortOrder === SortOrder.ASC ? asc : desc;

      let orderColumn;
      switch (sortBy) {
        case SubscriptionSortField.STATUS:
          orderColumn = subscriptions.status;
          break;
        case SubscriptionSortField.INTERVAL:
          orderColumn = subscriptions.billingInterval;
          break;
        case SubscriptionSortField.USER_EMAIL:
          orderColumn = users.email;
          break;
        case SubscriptionSortField.PERIOD_END:
          orderColumn = subscriptions.currentPeriodEnd;
          break;
        case SubscriptionSortField.CREATED_AT:
        default:
          orderColumn = subscriptions.createdAt;
          break;
      }

      // Fetch rows
      const rows = await db
        .select({
          id: subscriptions.id,
          userId: subscriptions.userId,
          userEmail: users.email,
          userName: users.privateName,
          planId: SubscriptionAdminListRepository.planId,
          billingInterval: subscriptions.billingInterval,
          status: subscriptions.status,
          createdAt: subscriptions.createdAt,
          currentPeriodEnd: subscriptions.currentPeriodEnd,
          paymentFailedAt: subscriptions.paymentFailedAt,
          gracePeriodEndsAt: subscriptions.gracePeriodEndsAt,
          cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
          canceledAt: subscriptions.canceledAt,
          cancellationReason: subscriptions.cancellationReason,
          provider: subscriptions.provider,
          providerSubscriptionId: subscriptions.providerSubscriptionId,
          cancelAt: subscriptions.cancelAt,
          // Latest successful charge for this subscription (falls back to the
          // customer's latest subscription charge when the row has no link).
          lastPayment: lastPaymentSql,
        })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(whereClause)
        .orderBy(
          searchFilters?.focus === SubscriptionFocus.ENDING
            ? sql`coalesce(${subscriptions.cancelAt}, ${subscriptions.currentPeriodEnd}) asc nulls last`
            : searchFilters?.focus === SubscriptionFocus.RENEWING_SOON
              ? asc(subscriptions.currentPeriodEnd)
              : orderFn(orderColumn),
          desc(subscriptions.id),
        )
        .limit(limit)
        .offset(offset);

      return success({
        response: {
          subscriptions: rows.map((row) => ({
            id: row.id,
            userId: row.userId,
            userEmail: row.userEmail ?? "",
            userName: row.userName ?? null,
            planId: row.planId,
            billingInterval: row.billingInterval,
            status: row.status,
            createdAt: row.createdAt,
            currentPeriodEnd: row.currentPeriodEnd ?? null,
            paymentFailedAt: row.paymentFailedAt,
            gracePeriodEndsAt: row.gracePeriodEndsAt,
            cancelAtPeriodEnd: row.cancelAtPeriodEnd,
            canceledAt: row.canceledAt ?? null,
            cancellationReason: row.cancellationReason ?? null,
            provider: row.provider,
            providerSubscriptionId: row.providerSubscriptionId ?? null,
            cancelAt: row.cancelAt ?? null,
            lastPaymentAmount: row.lastPayment
              ? Number(row.lastPayment.amount)
              : null,
            lastPaymentCurrency:
              CurrenciesArr.find(
                (currency) => currency === row.lastPayment?.currency,
              ) ?? null,
            lastPaymentAt: row.lastPayment
              ? new Date(row.lastPayment.at)
              : null,
            lastPaymentEstimated: row.lastPayment?.estimated ?? false,
          })),
          summary: {
            mrrUsd,
            mrr,
            renewingSoon,
            ending,
            pastDue,
            noCharge,
            // Only the rates actually used for this MRR, so the note stays short
            fxRates: REVENUE_FX_RATES.filter(
              (rate) =>
                rate.currency !== "USD" &&
                mrr.some((row) => row.currency === rate.currency),
            ),
          },
          planCounts: planRows.map((row) => ({
            plan: row.plan,
            count: Number(row.count),
          })),
          statusCounts: statusRows.map((row) => ({
            status: row.status,
            count: Number(row.count),
          })),
        },
        paginationInfo: {
          page,
          limit,
          totalCount,
          pageCount,
        },
      });
    } catch (error) {
      logger.error("Error listing subscriptions", parseError(error));
      return fail({
        message: t("get.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
