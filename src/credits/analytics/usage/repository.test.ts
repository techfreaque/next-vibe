/**
 * Credit usage report: invariants on the Atlas data (read-only).
 */

import "server-only";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { describe, expect, it } from "vitest";

import definitions, {
  type CreditUsageReportResponseOutput,
} from "./definition";
import { UsageActor, UsageCreditKind } from "./enum";
import { scopedTranslation } from "./i18n";
import { CreditUsageReportRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

async function report(
  input: Record<string, string | boolean>,
): Promise<CreditUsageReportResponseOutput> {
  const parsed = definitions.GET.requestSchema.safeParse(input);
  if (!parsed.success) {
    return expect.unreachable(parsed.error.message);
  }
  const res = await CreditUsageReportRepository.getReport(
    parsed.data,
    logger,
    t,
  );
  if (!res.success) {
    return expect.unreachable(res.message);
  }
  return res.data;
}

function sum(values: readonly number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

/** Series round each bucket to whole credits, so totals match within 0.5%. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(
    Math.max(1, Math.abs(expected) * 0.005),
  );
}

describe("credit usage report", () => {
  it("returns a schema-valid report whose series add up to the KPIs", async () => {
    const data = await report({ range: AnalyticsRange.LAST_90_DAYS });
    expect(definitions.GET.responseSchema.safeParse(data).success).toBe(true);
    const total = data.kpis.creditsSpent.value;
    const [users, guests] = data.spendByActor.series;
    expect(users?.values.length).toBe(data.spendByActor.buckets.length);
    expectNear(sum(users?.values ?? []) + sum(guests?.values ?? []), total);
    const [free, pack] = data.spendByKind.series;
    expectNear(sum(free?.values ?? []) + sum(pack?.values ?? []), total);
    const funding = data.spendByFunding.series.flatMap((x) => x.values);
    expectNear(sum(funding), total);
    if (total > 0) {
      expect(sum(guests?.values ?? []) / total).toBeCloseTo(
        data.kpis.guestShare.value,
        2,
      );
    }
    expect(data.kpis.creditsSpent.previous).not.toBeNull();
  }, 30_000);

  it("splits spend into disjoint actor and credit-kind slices", async () => {
    const all = await report({ range: AnalyticsRange.LAST_90_DAYS });
    const guests = await report({
      range: AnalyticsRange.LAST_90_DAYS,
      actor: UsageActor.GUESTS,
    });
    const users = await report({
      range: AnalyticsRange.LAST_90_DAYS,
      actor: UsageActor.USERS,
    });
    expect(
      guests.kpis.creditsSpent.value + users.kpis.creditsSpent.value,
    ).toBeCloseTo(all.kpis.creditsSpent.value, 0);
    expect(guests.topSpenders.every((s) => s.userId === null)).toBe(true);
    expect(users.topSpenders.every((s) => s.userId !== null)).toBe(true);

    const free = await report({
      range: AnalyticsRange.LAST_90_DAYS,
      creditKind: UsageCreditKind.FREE,
    });
    const pack = await report({
      range: AnalyticsRange.LAST_90_DAYS,
      creditKind: UsageCreditKind.PACK,
    });
    expect(free.kpis.creditsSpent.value + pack.kpis.creditsSpent.value).toBeCloseTo(
      all.kpis.creditsSpent.value,
      0,
    );
    expect(pack.kpis.freeShare.value).toBe(0);
  }, 30_000);

  it("filters by model and has no previous period for all time", async () => {
    const all = await report({ range: AnalyticsRange.ALL_TIME });
    expect(all.kpis.creditsSpent.previous).toBeNull();
    const top = all.byModel.find(
      (row) => row.key !== null && !row.key.startsWith("feature:"),
    );
    if (top?.key) {
      const one = await report({
        range: AnalyticsRange.ALL_TIME,
        model: top.key,
      });
      expect(one.byModel.length).toBe(1);
      expect(one.kpis.creditsSpent.value).toBeCloseTo(
        top.metrics.credits ?? 0,
        0,
      );
    }
  }, 30_000);
});
