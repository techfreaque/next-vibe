/**
 * Subscription Admin Purchases Repository
 * Business logic for listing credit pack purchases
 */

import "server-only";

import {
  and,
  count,
  desc,
  asc,
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

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { creditPacks, creditWallets } from "@/app/api/[locale]/credits/db";
import { users } from "@/app/api/[locale]/user/db";
import {
  CreditPackSourceAdminFilter,
  CreditPackTypeAdminFilter,
  PurchaseSortField,
  SortOrder,
} from "@/app/api/[locale]/subscription/admin/enum";

import type { CountryLanguage } from "@/i18n/core/config";

import type {
  PurchasesGetRequestOutput,
  PurchasesGetResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

type PurchasesResponse = NonNullable<PurchasesGetResponseOutput["response"]>;

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
      const {
        searchFilters,
        sortingOptions,
        paginationInfo: { page, limit },
      } = data;

      const conditions: SQL[] = [];

      // Only show packs that belong to user wallets (not lead wallets)
      conditions.push(sql`${creditWallets.userId} IS NOT NULL`);

      // Pack type filter
      if (searchFilters?.packType && searchFilters.packType.length > 0) {
        const typeConditions: SQL[] = [];
        for (const packType of searchFilters.packType) {
          if (packType === CreditPackTypeAdminFilter.ANY) {
            // No filter needed
            break;
          }
          // Map enum value to DB value - strip the enum prefix
          const dbValue = packType
            .replace("enums.creditPackTypeFilter.", "")
            .toLowerCase();
          typeConditions.push(sql`LOWER(${creditPacks.type}) = ${dbValue}`);
        }
        if (typeConditions.length > 0) {
          conditions.push(or(...typeConditions)!);
        }
      }

      // Source filter
      if (
        searchFilters?.source &&
        searchFilters.source !== CreditPackSourceAdminFilter.ANY
      ) {
        // Map enum value to DB source pattern
        const sourceMap: Record<string, string> = {
          [CreditPackSourceAdminFilter.STRIPE_PURCHASE]: "stripe_purchase",
          [CreditPackSourceAdminFilter.STRIPE_SUBSCRIPTION]:
            "stripe_subscription",
          [CreditPackSourceAdminFilter.ADMIN_GRANT]: "admin_grant",
          [CreditPackSourceAdminFilter.REFERRAL_EARNING]: "referral_earning",
        };
        const dbSource = sourceMap[searchFilters.source];
        if (dbSource) {
          conditions.push(
            sql`LOWER(${creditPacks.source}) LIKE ${`%${dbSource}%`}`,
          );
        }
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

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Sort mapping
      const sortColumn = (():
        | typeof creditPacks.createdAt
        | typeof creditPacks.originalAmount
        | typeof creditPacks.type
        | typeof users.email => {
        switch (sortingOptions.sortBy) {
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

      const orderDirection =
        sortingOptions.sortOrder === SortOrder.ASC ? asc : desc;

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
          userEmail: users.email,
          userName: users.privateName,
          packType: creditPacks.type,
          source: creditPacks.source,
          originalAmount: creditPacks.originalAmount,
          remaining: creditPacks.remaining,
          expiresAt: creditPacks.expiresAt,
          createdAt: creditPacks.createdAt,
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
        userEmail: row.userEmail ?? "",
        userName: row.userName ?? "",
        packType: row.packType ?? "",
        source: row.source ?? "",
        originalAmount: row.originalAmount,
        remaining: row.remaining,
        expiresAt: row.expiresAt,
        createdAt: row.createdAt,
      }));

      return success({
        response: { purchases },
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
