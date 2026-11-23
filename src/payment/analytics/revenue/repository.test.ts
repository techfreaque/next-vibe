/**
 * Revenue report + money overview: invariants on the Atlas data (read-only).
 */

import "server-only";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { resolveAnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import { describe, expect, it } from "vitest";

import { PaymentProvider } from "../../enum";
import { getMoneyOverview } from "../overview";
import definitions, { type RevenueReportResponseOutput } from "./definition";
import { RevenueKind } from "./enum";
import { scopedTranslation } from "./i18n";
import { RevenueReportRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

async function report(
  input: Record<string, string | boolean>,
): Promise<RevenueReportResponseOutput> {
  const parsed = definitions.GET.requestSchema.safeParse(input);
  if (!parsed.success) {
    return expect.unreachable(parsed.error.message);
  }
  const res = await RevenueReportRepository.getReport(parsed.data, logger, t);
  if (!res.success) {
    return expect.unreachable(res.message);
  }
  return res.data;
}

function sum(values: readonly number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

describe("revenue report", () => {
  it("returns a schema-valid report whose series add up to gross revenue", async () => {
    const data = await report({ range: AnalyticsRange.LAST_90_DAYS });
    expect(definitions.GET.responseSchema.safeParse(data).success).toBe(true);
    const gross = data.kpis.grossRevenueUsd.value;
    const byKind = sum(data.revenueByKind.series.flatMap((s) => s.values));
    const byProcessor = sum(
      data.revenueByProcessor.series.flatMap((s) => s.values),
    );
    expect(byKind).toBeCloseTo(gross, 0);
    expect(byProcessor).toBeCloseTo(gross, 0);
    expect(data.kpis.netRevenueUsd.value).toBeCloseTo(
      gross - data.kpis.refundsUsd.value,
      1,
    );
    expect(data.fxRates.length).toBeGreaterThan(0);
    const [mrr, active] = data.mrrTrend.series;
    expect(mrr?.values.length).toBe(data.mrrTrend.buckets.length);
    expect(active?.values.at(-1)).toBe(data.kpis.activeSubscriptions.value);
    expect(mrr?.values.at(-1)).toBeCloseTo(data.kpis.mrrUsd.value, 0);
  }, 30_000);

  it("splits revenue into disjoint kinds and processors", async () => {
    const all = await report({ range: AnalyticsRange.LAST_90_DAYS });
    let kinds = 0;
    for (const kind of [
      RevenueKind.PACK,
      RevenueKind.NEW_SUBSCRIPTION,
      RevenueKind.RENEWAL,
    ]) {
      const slice = await report({ range: AnalyticsRange.LAST_90_DAYS, kind });
      kinds += slice.kpis.grossRevenueUsd.value;
      expect(slice.recentPayments.every((p) => p.kind === kind)).toBe(true);
    }
    expect(kinds).toBeCloseTo(all.kpis.grossRevenueUsd.value, 0);
    const stripe = await report({
      range: AnalyticsRange.LAST_90_DAYS,
      provider: PaymentProvider.STRIPE,
    });
    expect(
      stripe.recentPayments.every((p) => p.provider === PaymentProvider.STRIPE),
    ).toBe(true);
  }, 30_000);

  it("money overview matches the two reports", async () => {
    const win = resolveAnalyticsWindow({ range: AnalyticsRange.LAST_30_DAYS });
    const overview = await getMoneyOverview(win, logger, defaultLocale);
    expect(overview.success).toBe(true);
    if (!overview.success) {
      return;
    }
    const revenue = await report({ range: AnalyticsRange.LAST_30_DAYS });
    expect(overview.data.kpis.revenueUsd.value).toBeCloseTo(
      revenue.kpis.grossRevenueUsd.value,
      1,
    );
    expect(overview.data.trend.series.map((s) => s.key)).toEqual([
      "revenueUsd",
      "spendUsd",
      "upstreamCostUsd",
    ]);
    for (const s of overview.data.trend.series) {
      expect(s.values.length).toBe(win.buckets.length);
    }
  }, 30_000);
});
