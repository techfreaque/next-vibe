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
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { subscriptions } from "@/app/api/[locale]/subscription/db";
import {
  BillingInterval,
  SubscriptionStatus,
} from "@/app/api/[locale]/subscription/enum";
import { PaymentProvider } from "@/app/api/[locale]/payment/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

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
import { scopedTranslation } from "./i18n";

export class SubscriptionAdminListRepository {
  /**
   * Convert status filter values to DB conditions
   */
  private static convertStatusFilters(
    statuses:
      | (typeof SubscriptionStatusAdminFilter)[keyof typeof SubscriptionStatusAdminFilter][]
      | undefined,
  ): SQL | null {
    if (!statuses?.length) {
      return null;
    }

    // Remove "ALL" from filters
    const filtered = statuses.filter(
      (s) => s !== SubscriptionStatusAdminFilter.ALL,
    );
    if (filtered.length === 0) {
      return null;
    }

    // Map admin filter values to subscription status values
    const statusMap: Record<string, string> = {
      [SubscriptionStatusAdminFilter.ACTIVE]: SubscriptionStatus.ACTIVE,
      [SubscriptionStatusAdminFilter.TRIALING]: SubscriptionStatus.TRIALING,
      [SubscriptionStatusAdminFilter.PAST_DUE]: SubscriptionStatus.PAST_DUE,
      [SubscriptionStatusAdminFilter.CANCELED]: SubscriptionStatus.CANCELED,
      [SubscriptionStatusAdminFilter.UNPAID]: SubscriptionStatus.UNPAID,
      [SubscriptionStatusAdminFilter.PAUSED]: SubscriptionStatus.PAUSED,
    };

    const mappedStatuses = filtered
      .map((s) => statusMap[s])
      .filter((s): s is string => s !== undefined);

    if (mappedStatuses.length === 0) {
      return null;
    }

    if (mappedStatuses.length === 1) {
      return eq(
        subscriptions.status,
        mappedStatuses[0] as typeof SubscriptionStatus.ACTIVE,
      );
    }

    return sql`${subscriptions.status} IN (${sql.join(
      mappedStatuses.map((s) => sql`${s}`),
      sql`, `,
    )})`;
  }

  /**
   * List subscriptions with filters and pagination
   */
  static async listSubscriptions(
    rawQuery: SubscriptionListRequestOutput | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionListResponseOutput>> {
    try {
      const searchFilters = rawQuery?.searchFilters;
      const sortingOptions = rawQuery?.sortingOptions;
      const paginationInfo = rawQuery?.paginationInfo;

      const page = paginationInfo?.page ?? 1;
      const limit = paginationInfo?.limit ?? 20;
      const offset = (page - 1) * limit;

      logger.debug("Listing subscriptions", {
        search: searchFilters?.search,
        page,
        limit,
      });

      // Build where conditions
      const whereConditions: SQL[] = [];

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
      if (
        searchFilters?.interval &&
        searchFilters.interval !== BillingIntervalAdminFilter.ANY
      ) {
        const intervalMap: Record<string, string> = {
          [BillingIntervalAdminFilter.MONTHLY]: BillingInterval.MONTHLY,
          [BillingIntervalAdminFilter.YEARLY]: BillingInterval.YEARLY,
        };
        const mapped = intervalMap[searchFilters.interval];
        if (mapped) {
          whereConditions.push(
            eq(
              subscriptions.billingInterval,
              mapped as typeof BillingInterval.MONTHLY,
            ),
          );
        }
      }

      // Provider filter
      if (
        searchFilters?.provider &&
        searchFilters.provider !== ProviderAdminFilter.ANY
      ) {
        const providerMap: Record<string, string> = {
          [ProviderAdminFilter.STRIPE]: PaymentProvider.STRIPE,
          [ProviderAdminFilter.NOWPAYMENTS]: PaymentProvider.NOWPAYMENTS,
        };
        const mappedProvider = providerMap[searchFilters.provider];
        if (mappedProvider) {
          whereConditions.push(
            eq(
              subscriptions.provider,
              mappedProvider as typeof PaymentProvider.STRIPE,
            ),
          );
        }
      }

      // Date filters
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
        case SubscriptionSortField.CREATED_AT:
        default:
          orderColumn = subscriptions.createdAt;
          break;
      }

      // Fetch rows
      const rows = await db
        .select({
          id: subscriptions.id,
          userEmail: users.email,
          userName: users.privateName,
          planId: subscriptions.planId,
          billingInterval: subscriptions.billingInterval,
          status: subscriptions.status,
          createdAt: subscriptions.createdAt,
          currentPeriodEnd: subscriptions.currentPeriodEnd,
          cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
          canceledAt: subscriptions.canceledAt,
          cancellationReason: subscriptions.cancellationReason,
          provider: subscriptions.provider,
          providerSubscriptionId: subscriptions.providerSubscriptionId,
        })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(whereClause)
        .orderBy(orderFn(orderColumn))
        .limit(limit)
        .offset(offset);

      return success({
        response: {
          subscriptions: rows.map((row) => ({
            id: row.id,
            userEmail: row.userEmail ?? "",
            userName: row.userName ?? null,
            planId: row.planId,
            billingInterval: row.billingInterval,
            status: row.status,
            createdAt: row.createdAt,
            currentPeriodEnd: row.currentPeriodEnd ?? null,
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
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
