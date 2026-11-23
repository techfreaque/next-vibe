/**
 * Money overview for the admin business overview (lead package).
 * One call: revenue, paying customers, active subscriptions, credit spend,
 * guest spend, provider cost and margin for a window, with a daily/weekly trend.
 * All money is approx. USD (payments at static FX rates, credits at list value).
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Kpi, TimeSeries } from "next-vibe/unified-ui/analytics/schema";
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";

import { UsageActor, UsageCreditKind } from "@/credits/analytics/usage/enum";
import { CreditUsageReportRepository } from "@/credits/analytics/usage/repository";

import { RevenueKind } from "./revenue/enum";
import { scopedTranslation } from "./revenue/i18n";
import { RevenueReportRepository } from "./revenue/repository";

export interface MoneyOverview {
  kpis: {
    revenueUsd: Kpi;
    payingCustomers: Kpi;
    activeSubscriptions: Kpi;
    creditSpendUsd: Kpi;
    guestSpendUsd: Kpi;
    upstreamCostUsd: Kpi;
    /** Billed usage value (USD) of rows with provider cost data: the margin base. */
    costedSpendUsd: Kpi;
    marginUsd: Kpi;
  };
  /** Series keys: revenueUsd, spendUsd, upstreamCostUsd. */
  trend: TimeSeries;
}

export async function getMoneyOverview(
  win: AnalyticsWindow,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<MoneyOverview>> {
  try {
    const [revenue, { report: usage, guestSpendUsd }] = await Promise.all([
      RevenueReportRepository.build(win, {
        kind: RevenueKind.ALL,
        includeInternal: false,
      }),
      CreditUsageReportRepository.build(win, {
        actor: UsageActor.ALL,
        creditKind: UsageCreditKind.ALL,
        includeInternal: false,
      }),
    ]);
    const revenueSeries = revenue.revenueByKind.series.reduce<number[]>(
      (sum, s) =>
        s.values.map((v, i) => Math.round((v + (sum[i] ?? 0)) * 100) / 100),
      [],
    );
    const spend =
      usage.costVsSpend.series.find((s) => s.key === "spendUsd")?.values ?? [];
    const cost =
      usage.costVsSpend.series.find((s) => s.key === "upstreamCostUsd")
        ?.values ?? [];
    return success({
      kpis: {
        revenueUsd: revenue.kpis.grossRevenueUsd,
        payingCustomers: revenue.kpis.payingCustomers,
        activeSubscriptions: revenue.kpis.activeSubscriptions,
        creditSpendUsd: usage.kpis.spendUsd,
        guestSpendUsd,
        upstreamCostUsd: usage.kpis.upstreamCostUsd,
        costedSpendUsd: usage.kpis.costedSpendUsd,
        marginUsd: usage.kpis.marginUsd,
      },
      trend: {
        buckets: win.buckets,
        series: [
          { key: "revenueUsd", values: revenueSeries },
          { key: "spendUsd", values: [...spend] },
          { key: "upstreamCostUsd", values: [...cost] },
        ],
      },
    });
  } catch (error) {
    logger.error("Failed to build money overview", parseError(error));
    return fail({
      message: scopedTranslation
        .scopedT(locale)
        .t("get.errors.server.description"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
