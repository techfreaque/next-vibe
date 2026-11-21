/**
 * Referral overview for other reports (business overview, dashboards).
 * Server only. Same metric definitions as the admin `referral-overview` tool.
 */

import "server-only";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { BreakdownRow, Kpi } from "next-vibe/unified-ui/analytics/schema";
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";

import { scopedTranslation } from "../i18n";
import {
  type CodeMetricsRow,
  type MetricTotals,
  OPEN_PAYOUT_STATUSES,
  queryCodeMetrics,
  queryPayoutStates,
  queryTotals,
  type ReferralScopeFilters,
  type TimeSpan,
} from "./queries";

export interface ReferralOverview {
  kpis: {
    clicks: Kpi;
    leads: Kpi;
    signups: Kpi;
    payers: Kpi;
    revenueUsd: Kpi;
    commissionUsd: Kpi;
  };
  pendingPayouts: { count: number; amountUsd: number };
  /** key = code, metrics: clicks, signups, payers, revenueUsd */
  topCodes: BreakdownRow[];
}

export function centsToUsd(cents: number): number {
  return Math.round(cents) / 100;
}

export function previousSpan(win: AnalyticsWindow): TimeSpan | null {
  return win.previousFrom && win.previousTo
    ? { from: win.previousFrom, to: win.previousTo }
    : null;
}

export function kpi(
  current: number,
  previous: MetricTotals | null,
  pick: (totals: MetricTotals) => number,
): Kpi {
  return { value: current, previous: previous ? pick(previous) : null };
}

/** Order codes for "top" lists: revenue, then payers, signups, clicks. */
export function compareCodeImpact(
  a: CodeMetricsRow,
  b: CodeMetricsRow,
): number {
  return (
    b.revenueCents - a.revenueCents ||
    b.payers - a.payers ||
    b.signups - a.signups ||
    b.clicks - a.clicks ||
    a.code.localeCompare(b.code)
  );
}

export async function getReferralOverview(
  win: AnalyticsWindow,
  logger: EndpointLogger,
  filters: ReferralScopeFilters = {},
  topLimit = 5,
): Promise<ResponseType<ReferralOverview>> {
  try {
    const range: TimeSpan = { from: win.from, to: win.to };
    const prevRange = previousSpan(win);
    const [current, previous, codes, payoutStates] = await Promise.all([
      queryTotals(filters, range),
      prevRange ? queryTotals(filters, prevRange) : Promise.resolve(null),
      queryCodeMetrics(filters, range),
      queryPayoutStates(filters),
    ]);
    const open = payoutStates.filter((row) =>
      OPEN_PAYOUT_STATUSES.includes(row.status),
    );
    const topCodes = codes
      .filter(
        (row) =>
          row.clicks > 0 || row.signups > 0 || row.payers > 0 || row.leads > 0,
      )
      .toSorted(compareCodeImpact)
      .slice(0, topLimit)
      .map((row) => ({
        key: row.code,
        metrics: {
          clicks: row.clicks,
          signups: row.signups,
          payers: row.payers,
          revenueUsd: centsToUsd(row.revenueCents),
        },
      }));
    return success({
      kpis: {
        clicks: kpi(current.clicks, previous, (t) => t.clicks),
        leads: kpi(current.leads, previous, (t) => t.leads),
        signups: kpi(current.signups, previous, (t) => t.signups),
        payers: kpi(current.payers, previous, (t) => t.payers),
        revenueUsd: kpi(centsToUsd(current.revenueCents), previous, (t) =>
          centsToUsd(t.revenueCents),
        ),
        commissionUsd: kpi(centsToUsd(current.commissionCents), previous, (t) =>
          centsToUsd(t.commissionCents),
        ),
      },
      pendingPayouts: {
        count: open.reduce((sum, row) => sum + row.count, 0),
        amountUsd: centsToUsd(
          open.reduce((sum, row) => sum + row.amountCents, 0),
        ),
      },
      topCodes,
    });
  } catch (error) {
    logger.error("Failed to build referral overview", parseError(error));
    return fail({
      message: scopedTranslation
        .scopedT(defaultLocale)
        .t("errors.serverError.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
