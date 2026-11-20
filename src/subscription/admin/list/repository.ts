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
} from "drizzle-orm";
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

import { PaymentProvider } from "@/payment/enum";
import { subscriptions } from "@/subscription/db";
import {
  BillingInterval,
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

export class SubscriptionAdminListRepository {
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

      // Status filter
      const statusCondition =
        SubscriptionAdminListRepository.convertStatusFilters(
          searchFilters?.status,
        );
      if (statusCondition) {
        whereConditions.push(statusCondition);
      }

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

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Count total
      const [countResult] = await db
        .select({ total: count() })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(whereClause);

      const totalCount = countResult?.total ?? 0;
      const pageCount = Math.ceil(totalCount / limit);

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
          planId: subscriptions.planId,
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
        })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(whereClause)
        .orderBy(orderFn(orderColumn), desc(subscriptions.id))
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
