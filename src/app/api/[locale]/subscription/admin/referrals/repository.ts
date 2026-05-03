/**
 * Subscription Admin Referrals Repository
 * Business logic for referral dashboard and payout actions
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
  sum,
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
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  referralCodes,
  userReferrals,
  referralEarnings,
  payoutRequests,
} from "@/app/api/[locale]/referral/db";
import { users } from "@/app/api/[locale]/user/db";
import { ReferralRepository } from "@/app/api/[locale]/referral/repository";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import {
  PayoutAction,
  PayoutStatusAdminFilter,
  ReferralSortField,
  SortOrder,
} from "@/app/api/[locale]/subscription/admin/enum";
import { PayoutStatus } from "@/app/api/[locale]/referral/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ReferralsGetRequestOutput,
  ReferralsGetResponseOutput,
  ReferralsPostRequestOutput,
  ReferralsPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

type ReferralsResponse = NonNullable<ReferralsGetResponseOutput["response"]>;

export class SubscriptionAdminReferralsRepository {
  /**
   * List referral codes, earnings summary, and payout requests
   */
  static async listReferrals(
    data: ReferralsGetRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ReferralsGetResponseOutput>> {
    try {
      const {
        searchFilters,
        sortingOptions,
        paginationInfo: { page, limit },
      } = data;

      // === CODES QUERY ===
      const codeConditions: SQL[] = [];

      if (searchFilters?.search) {
        const searchTerm = `%${searchFilters.search}%`;
        codeConditions.push(
          or(
            ilike(users.email, searchTerm),
            ilike(users.privateName, searchTerm),
            ilike(referralCodes.code, searchTerm),
          )!,
        );
      }

      if (searchFilters?.dateFrom) {
        codeConditions.push(
          gte(referralCodes.createdAt, searchFilters.dateFrom),
        );
      }
      if (searchFilters?.dateTo) {
        codeConditions.push(lte(referralCodes.createdAt, searchFilters.dateTo));
      }

      const codeWhereClause =
        codeConditions.length > 0 ? and(...codeConditions) : undefined;

      // Sort mapping for codes
      const codeSortColumn = (():
        | typeof referralCodes.createdAt
        | typeof referralCodes.currentUses => {
        switch (sortingOptions.sortBy) {
          case ReferralSortField.EARNINGS:
            return referralCodes.currentUses;
          case ReferralSortField.SIGNUPS:
            return referralCodes.currentUses;
          case ReferralSortField.CREATED_AT:
          default:
            return referralCodes.createdAt;
        }
      })();

      const orderDirection =
        sortingOptions.sortOrder === SortOrder.ASC ? asc : desc;

      // Count total codes
      const [codeCountResult] = await db
        .select({ value: count() })
        .from(referralCodes)
        .innerJoin(users, eq(referralCodes.ownerUserId, users.id))
        .where(codeWhereClause);

      const totalCount = codeCountResult?.value ?? 0;
      const pageCount = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;

      // Fetch codes with owner info
      const codeRows = await db
        .select({
          code: referralCodes.code,
          ownerEmail: users.email,
          ownerName: users.privateName,
          currentUses: referralCodes.currentUses,
          isActive: referralCodes.isActive,
          createdAt: referralCodes.createdAt,
          ownerUserId: referralCodes.ownerUserId,
        })
        .from(referralCodes)
        .innerJoin(users, eq(referralCodes.ownerUserId, users.id))
        .where(codeWhereClause)
        .orderBy(orderDirection(codeSortColumn))
        .limit(limit)
        .offset(offset);

      // Get signups and earnings per code owner
      const codes: ReferralsResponse["codes"] = [];
      for (const row of codeRows) {
        // Count signups via userReferrals where referrerUserId = owner
        const [signupResult] = await db
          .select({ value: count() })
          .from(userReferrals)
          .where(eq(userReferrals.referrerUserId, row.ownerUserId));

        // Sum earnings for this owner
        const [earningsResult] = await db
          .select({ value: sum(referralEarnings.amountCents) })
          .from(referralEarnings)
          .where(eq(referralEarnings.earnerUserId, row.ownerUserId));

        codes.push({
          code: row.code,
          ownerEmail: row.ownerEmail ?? "",
          ownerName: row.ownerName ?? "",
          currentUses: row.currentUses,
          totalSignups: signupResult?.value ?? 0,
          totalEarned: Number(earningsResult?.value ?? 0),
          isActive: row.isActive,
          createdAt: row.createdAt,
        });
      }

      // === PAYOUT REQUESTS QUERY ===
      const payoutConditions: SQL[] = [];

      if (
        searchFilters?.payoutStatus &&
        searchFilters.payoutStatus !== PayoutStatusAdminFilter.ALL
      ) {
        // Map the admin filter enum to the DB payout status
        const statusMap: Record<
          string,
          (typeof PayoutStatus)[keyof typeof PayoutStatus]
        > = {
          [PayoutStatusAdminFilter.PENDING]: PayoutStatus.PENDING,
          [PayoutStatusAdminFilter.APPROVED]: PayoutStatus.APPROVED,
          [PayoutStatusAdminFilter.REJECTED]: PayoutStatus.REJECTED,
          [PayoutStatusAdminFilter.PROCESSING]: PayoutStatus.PROCESSING,
          [PayoutStatusAdminFilter.COMPLETED]: PayoutStatus.COMPLETED,
          [PayoutStatusAdminFilter.FAILED]: PayoutStatus.FAILED,
        };
        const dbStatus = statusMap[searchFilters.payoutStatus];
        if (dbStatus) {
          payoutConditions.push(eq(payoutRequests.status, dbStatus));
        }
      }

      if (searchFilters?.search) {
        const searchTerm = `%${searchFilters.search}%`;
        // Sub-select for payout user emails
        payoutConditions.push(
          sql`${payoutRequests.userId} IN (SELECT id FROM users WHERE email ILIKE ${searchTerm} OR private_name ILIKE ${searchTerm})`,
        );
      }

      const payoutWhereClause =
        payoutConditions.length > 0 ? and(...payoutConditions) : undefined;

      const payoutRows = await db
        .select({
          id: payoutRequests.id,
          userId: payoutRequests.userId,
          amountCents: payoutRequests.amountCents,
          currency: payoutRequests.currency,
          status: payoutRequests.status,
          walletAddress: payoutRequests.walletAddress,
          adminNotes: payoutRequests.adminNotes,
          rejectionReason: payoutRequests.rejectionReason,
          createdAt: payoutRequests.createdAt,
          processedAt: payoutRequests.processedAt,
        })
        .from(payoutRequests)
        .where(payoutWhereClause)
        .orderBy(desc(payoutRequests.createdAt))
        .limit(50);

      // Resolve user emails for payout requests
      const payoutRequestsList: ReferralsResponse["payoutRequests"] = [];
      for (const row of payoutRows) {
        const [userRow] = await db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.id, row.userId))
          .limit(1);

        payoutRequestsList.push({
          id: row.id,
          userEmail: userRow?.email ?? "",
          amountCents: row.amountCents,
          currency: row.currency,
          status: row.status,
          walletAddress: row.walletAddress,
          adminNotes: row.adminNotes,
          rejectionReason: row.rejectionReason,
          createdAt: row.createdAt,
          processedAt: row.processedAt,
        });
      }

      // === SUMMARY ===
      const [totalCodesResult] = await db
        .select({ value: count() })
        .from(referralCodes);

      const [totalSignupsResult] = await db
        .select({ value: count() })
        .from(userReferrals);

      const [totalEarnedResult] = await db
        .select({ value: sum(referralEarnings.amountCents) })
        .from(referralEarnings);

      const [totalPaidOutResult] = await db
        .select({ value: sum(payoutRequests.amountCents) })
        .from(payoutRequests)
        .where(eq(payoutRequests.status, PayoutStatus.COMPLETED));

      const [pendingPayoutsResult] = await db
        .select({ value: sum(payoutRequests.amountCents) })
        .from(payoutRequests)
        .where(
          or(
            eq(payoutRequests.status, PayoutStatus.PENDING),
            eq(payoutRequests.status, PayoutStatus.APPROVED),
            eq(payoutRequests.status, PayoutStatus.PROCESSING),
          ),
        );

      const summary: ReferralsResponse["summary"] = {
        totalCodes: totalCodesResult?.value ?? 0,
        totalSignups: totalSignupsResult?.value ?? 0,
        totalEarned: Number(totalEarnedResult?.value ?? 0),
        totalPaidOut: Number(totalPaidOutResult?.value ?? 0),
        pendingPayouts: Number(pendingPayoutsResult?.value ?? 0),
      };

      return success({
        response: {
          summary,
          codes,
          payoutRequests: payoutRequestsList,
        },
        paginationInfo: {
          page,
          limit,
          totalCount,
          pageCount,
        },
      });
    } catch (error) {
      logger.error("Failed to list referrals", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Process a payout action (approve / reject / complete)
   * Delegates to the existing ReferralRepository
   */
  static async processPayoutAction(
    data: ReferralsPostRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ReferralsPostResponseOutput>> {
    try {
      const { t: creditsT } = creditsScopedTranslation.scopedT(locale);

      let result;
      if (data.action === PayoutAction.APPROVE) {
        result = await ReferralRepository.approvePayoutRequest(
          data.requestId,
          user.id,
          data.adminNotes ?? null,
          logger,
          locale,
        );
      } else if (data.action === PayoutAction.REJECT) {
        result = await ReferralRepository.rejectPayoutRequest(
          data.requestId,
          user.id,
          data.rejectionReason ?? "",
          logger,
          locale,
        );
      } else {
        result = await ReferralRepository.completePayoutRequest(
          data.requestId,
          user.id,
          data.adminNotes ?? null,
          logger,
          creditsT,
          locale,
        );
      }

      if (!result.success) {
        return result;
      }

      return success({
        success: true,
        message: "Action completed successfully",
      });
    } catch (error) {
      logger.error("Failed to process payout action", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
