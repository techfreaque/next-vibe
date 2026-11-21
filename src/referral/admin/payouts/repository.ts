import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";

import {
  OPEN_PAYOUT_STATUSES,
  queryOpenRequestGroups,
  queryPartnerBalances,
  queryPartnerIdentity,
  queryPayoutSummary,
} from "../../analytics/queries";
import { PayoutStatusDB } from "../../enum";
import { scopedTranslation } from "../../i18n";
import { ReferralRepository } from "../../repository";
import type {
  AdminPayoutsGetRequestOutput,
  AdminPayoutsGetResponseOutput,
  AdminPayoutsPostRequestOutput,
  AdminPayoutsPostResponseOutput,
} from "./definition";

export const AdminPayoutsRepository = {
  async listPayouts(
    data: AdminPayoutsGetRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AdminPayoutsGetResponseOutput>> {
    const result = await ReferralRepository.listPayoutRequests(
      data,
      data.limit,
      (data.page - 1) * data.limit,
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    const userIds = [
      ...new Set(result.data.requests.map((request) => request.userId)),
    ];
    const context = await Promise.all([
      queryPayoutSummary(data),
      queryPartnerBalances(userIds),
      queryPartnerIdentity(userIds),
      queryOpenRequestGroups(userIds),
    ]).catch((error: Error) => {
      logger.error("Failed to load payout context", parseError(error));
      return null;
    });
    if (!context) {
      return fail({
        message: scopedTranslation
          .scopedT(locale)
          .t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const [summary, balances, identities, openGroups] = context;
    const openCount = new Map<string, number>();
    for (const group of openGroups) {
      openCount.set(
        group.userId,
        (openCount.get(group.userId) ?? 0) + group.count,
      );
    }
    return success({
      summary: PayoutStatusDB.flatMap((status) => {
        const row = summary.find((candidate) => candidate.status === status);
        return row
          ? [{ status, count: row.count, amountCents: row.amountCents }]
          : [];
      }),
      items: result.data.requests.map((request) => {
        const balance = balances.get(request.userId);
        const identity = identities.get(request.userId);
        const isOpen = OPEN_PAYOUT_STATUSES.includes(request.status);
        const sameGroup = openGroups.find(
          (group) =>
            group.userId === request.userId &&
            group.amountCents === request.amountCents &&
            group.currency === request.currency &&
            group.walletAddress === request.walletAddress,
        );
        return {
          ...request,
          duplicateCount:
            isOpen && sameGroup ? Math.max(0, sameGroup.count - 1) : 0,
          partnerName: identity?.name ?? null,
          partnerCodes: identity?.codes ?? [],
          partner: {
            confirmedCents: balance?.confirmedCents ?? 0,
            pendingCents: balance?.pendingCents ?? 0,
            paidOutCents: balance?.paidOutCents ?? 0,
            availableCents: balance?.availableCents ?? 0,
            freeCents: balance?.freeCents ?? 0,
            openCents: balance?.openPayoutCents ?? 0,
            openCount: openCount.get(request.userId) ?? 0,
            referredUsers: balance?.referredUsers ?? 0,
          },
        };
      }),
      totalCount: result.data.totalCount,
      resultPage: data.page,
      pageSize: data.limit,
    });
  },

  async processAction(
    data: AdminPayoutsPostRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<AdminPayoutsPostResponseOutput>> {
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
    let result;
    if (data.action === "approve") {
      result = await ReferralRepository.approvePayoutRequest(
        data.requestId,
        userId,
        data.adminNotes ?? null,
        logger,
        locale,
      );
    } else if (data.action === "reject") {
      result = await ReferralRepository.rejectPayoutRequest(
        data.requestId,
        userId,
        data.rejectionReason ?? "",
        logger,
        locale,
      );
    } else {
      result = await ReferralRepository.completePayoutRequest(
        data.requestId,
        userId,
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
      message: scopedTranslation
        .scopedT(locale)
        .t("admin.payouts.widget.actionSaved"),
    });
  },
};
