/**
 * Referral Code Report (admin) - Repository
 * Server-only.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  resolveAnalyticsWindow,
  serializeWindow,
} from "next-vibe/unified-ui/analytics/window";

import { centsToUsd, previousSpan } from "../../analytics/overview";
import {
  queryCodeHeader,
  queryEarningsByLevel,
  queryOwnerPayouts,
  queryPartnerBalances,
  queryReferredUsers,
  querySeries,
  queryTotals,
} from "../../analytics/queries";
import { buildKpis, buildTrend } from "../../analytics/rows";
import { PayoutCurrencyDB, PayoutStatusDB } from "../../enum";
import {
  REFERRAL_CODE_REPORT_PAYOUTS_LIMIT,
  REFERRAL_CODE_REPORT_USERS_LIMIT,
} from "./constants";
import type {
  ReferralCodeReportGetRequestOutput,
  ReferralCodeReportGetResponseOutput,
} from "./definition";
import type { ReferralCodeReportT } from "./i18n";

type PayoutCurrencyValue = (typeof PayoutCurrencyDB)[number];
type PayoutStatusValue = (typeof PayoutStatusDB)[number];

function asCurrency(value: string): PayoutCurrencyValue | null {
  return PayoutCurrencyDB.find((currency) => currency === value) ?? null;
}

function asStatus(value: string): PayoutStatusValue | null {
  return PayoutStatusDB.find((status) => status === value) ?? null;
}

export const ReferralCodeReportRepository = {
  async getReport(
    data: ReferralCodeReportGetRequestOutput,
    logger: EndpointLogger,
    t: ReferralCodeReportT,
  ): Promise<ResponseType<ReferralCodeReportGetResponseOutput>> {
    try {
      const header = await queryCodeHeader(data.code);
      if (!header) {
        return fail({
          message: t("errors.codeNotFound", { code: data.code }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const filters = { codeId: header.codeId };
      const win = resolveAnalyticsWindow(data, new Date(), header.createdAt);
      const range = { from: win.from, to: win.to };
      const prevRange = previousSpan(win);
      const [current, previous, series, levels, referred, balances, payouts] =
        await Promise.all([
          queryTotals(filters, range),
          prevRange ? queryTotals(filters, prevRange) : Promise.resolve(null),
          querySeries(filters, range, win.bucket),
          queryEarningsByLevel(header.codeId, range),
          queryReferredUsers(header.codeId, REFERRAL_CODE_REPORT_USERS_LIMIT),
          queryPartnerBalances([header.ownerUserId]),
          queryOwnerPayouts(
            header.ownerUserId,
            REFERRAL_CODE_REPORT_PAYOUTS_LIMIT,
          ),
        ]);
      const balance = balances.get(header.ownerUserId);
      return success({
        window: serializeWindow(win),
        header: {
          ...header,
          createdAt: header.createdAt.toISOString(),
        },
        kpis: buildKpis(current, previous),
        funnel: [
          { key: "clicks", value: current.clicks },
          { key: "leads", value: current.leads },
          { key: "signups", value: current.signups },
          { key: "payers", value: current.payers },
        ],
        trend: buildTrend(win, series),
        balance: {
          confirmedUsd: centsToUsd(balance?.confirmedCents ?? 0),
          pendingUsd: centsToUsd(balance?.pendingCents ?? 0),
          paidOutUsd: centsToUsd(balance?.paidOutCents ?? 0),
          openPayoutUsd: centsToUsd(balance?.openPayoutCents ?? 0),
          availableUsd: centsToUsd(balance?.availableCents ?? 0),
          freeUsd: centsToUsd(balance?.freeCents ?? 0),
        },
        earningsByLevel: levels.map((row) => ({
          level: row.level,
          count: row.count,
          pendingUsd: centsToUsd(row.pendingCents),
          confirmedUsd: centsToUsd(row.confirmedCents),
          canceledUsd: centsToUsd(row.canceledCents),
        })),
        referredUsers: referred.rows.map((row) => ({
          userId: row.userId,
          email: row.email,
          name: row.name,
          signedUpAt: row.signedUpAt.toISOString(),
          payments: row.payments,
          revenueUsd: centsToUsd(row.revenueCents),
          commissionUsd: centsToUsd(row.commissionCents),
          lastPaymentAt: row.lastPaymentAt?.toISOString() ?? null,
        })),
        referredTotal: referred.total,
        payouts: payouts.flatMap((row) => {
          const currency = asCurrency(row.currency);
          const status = asStatus(row.status);
          return currency && status
            ? [
                {
                  id: row.id,
                  amountUsd: centsToUsd(row.amountCents),
                  currency,
                  status,
                  createdAt: row.createdAt.toISOString(),
                  processedAt: row.processedAt?.toISOString() ?? null,
                },
              ]
            : [];
        }),
      });
    } catch (error) {
      logger.error("Failed to build referral code report", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};
