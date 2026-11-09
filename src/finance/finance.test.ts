/**
 * Finance monitor - unit + integration tests.
 *
 * Pure logic (margin, spike / drain thresholds, day anomalies, dedup window)
 * plus ingest against the real DB with every external call mocked: the HTTP
 * port, the Stripe port and the mailer are injected, so nothing here can reach
 * a live Stripe / provider API or send a real mail. Rows are written at a
 * fixed instant in 2031 and removed afterwards; dev data is never touched.
 */

import "server-only";

import { and, eq, gte, like } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { paymentRefunds, paymentTransactions } from "@/payment/db";
import {
  PaymentProvider,
  PaymentStatus,
  type PaymentStatusValue,
  RefundStatus,
} from "@/payment/enum";

type TestCurrency = "USD" | "EUR" | "PLN";

import {
  financeAlerts,
  financeDailyRollups,
  financeProviderSnapshots,
  financeRevenueEvents,
  financeRevenueSnapshots,
  financeSourceStatus,
  financeThresholds,
} from "./db";
import {
  CostCoverage,
  FinanceAlertType,
  FinanceSource,
  IngestScope,
  type IngestScopeValue,
  SourceRunStatus,
  ThresholdKey,
} from "./enum";
import { scopedTranslation } from "./i18n";
import type { FinanceIngestResponseOutput } from "./ingest/definition";
import {
  classifyCostCoverage,
  computeMargin,
  DEFAULT_THRESHOLDS,
  detectDayAnomalies,
  detectProviderAnomalies,
  isDuplicateAlert,
  minorToUsd,
  resolveThresholds,
  spendBetween,
  trailingSpendRate,
} from "./logic";
import { type FinanceDeps, FinanceRepository, defaultFinanceDeps } from "./repository";
import type { FinanceHttp, HttpRequest, HttpResult } from "./sources/http";
import type { StripeLedgerPort } from "./sources/revenue";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

// ─── Pure logic ──────────────────────────────────────────────────────────────

describe("computeMargin", () => {
  it("nets refunds and disputes, subtracts upstream cost", () => {
    const m = computeMargin({
      grossRevenueUsd: 100,
      refundsUsd: 20,
      disputesUsd: 10,
      upstreamCostUsd: 28,
      internalBilledUsd: 40,
    });
    expect(m.netRevenueUsd).toBe(70);
    expect(m.grossMarginUsd).toBe(42);
    expect(m.grossMarginPct).toBe(60);
    expect(m.billingGapPct).toBe(-30);
  });

  it("has no percentage when there is no revenue", () => {
    const m = computeMargin({
      grossRevenueUsd: 0,
      refundsUsd: 0,
      disputesUsd: 0,
      upstreamCostUsd: 5,
      internalBilledUsd: 0,
    });
    expect(m.grossMarginUsd).toBe(-5);
    expect(m.grossMarginPct).toBeNull();
    expect(m.billingGapPct).toBeNull();
  });
});

describe("classifyCostCoverage", () => {
  // Prod shape: cost tracking began 2026-11-08 21:00 UTC.
  const firstHour = new Date(Date.UTC(2026, 10, 8, 21));
  const now = new Date(Date.UTC(2026, 10, 9, 13));
  const day = (y: number, m: number, d: number): { start: Date; end: Date } => ({
    start: new Date(Date.UTC(y, m, d)),
    end: new Date(Date.UTC(y, m, d + 1)),
  });

  it("is NONE before tracking began or when no snapshots exist", () => {
    const d = day(2026, 10, 7);
    expect(
      classifyCostCoverage({
        snapshotHours: 0,
        dayStart: d.start,
        dayEnd: d.end,
        firstSnapshotHour: firstHour,
        now,
        gapToleranceHours: 2,
      }),
    ).toBe(CostCoverage.NONE);
    // No snapshots anywhere yet.
    expect(
      classifyCostCoverage({
        snapshotHours: 5,
        dayStart: d.start,
        dayEnd: d.end,
        firstSnapshotHour: null,
        now,
        gapToleranceHours: 2,
      }),
    ).toBe(CostCoverage.NONE);
  });

  it("is PARTIAL on the day tracking began (straddles the start)", () => {
    const d = day(2026, 10, 8); // starts 00:00, before firstHour 21:00
    expect(
      classifyCostCoverage({
        snapshotHours: 2,
        dayStart: d.start,
        dayEnd: d.end,
        firstSnapshotHour: firstHour,
        now,
        gapToleranceHours: 2,
      }),
    ).toBe(CostCoverage.PARTIAL);
  });

  it("is COMPLETE on a fully-tracked day whose elapsed hours are covered", () => {
    const d = day(2026, 10, 9); // starts after firstHour; 13 elapsed hours by now
    expect(
      classifyCostCoverage({
        snapshotHours: 13,
        dayStart: d.start,
        dayEnd: d.end,
        firstSnapshotHour: firstHour,
        now,
        gapToleranceHours: 2,
      }),
    ).toBe(CostCoverage.COMPLETE);
  });

  it("is PARTIAL on a fully-tracked day with a wide gap in readings", () => {
    const d = day(2026, 10, 9);
    expect(
      classifyCostCoverage({
        snapshotHours: 5, // 13 expected, far below tolerance
        dayStart: d.start,
        dayEnd: d.end,
        firstSnapshotHour: firstHour,
        now,
        gapToleranceHours: 2,
      }),
    ).toBe(CostCoverage.PARTIAL);
  });
});

describe("minorToUsd", () => {
  it("converts cents and applies the FX rate", () => {
    expect(minorToUsd(1000, "usd")).toBe(10);
    expect(minorToUsd(1000, "EUR")).toBe(10.8);
  });
  it("returns null for a currency without a rate", () => {
    expect(minorToUsd(1000, "xyz")).toBeNull();
  });
});

describe("spendBetween", () => {
  const t0 = new Date("2031-03-04T10:00:00Z");
  const t1 = new Date("2031-03-04T12:00:00Z");
  it("prefers the provider usage counter (ignores top-ups)", () => {
    const d = spendBetween(
      { balanceUsd: 10, cumulativeUsageUsd: 100, at: t0 },
      { balanceUsd: 50, cumulativeUsageUsd: 104, at: t1 },
    );
    expect(d).toEqual({ spendUsd: 4, elapsedHours: 2 });
  });
  it("falls back to a balance drop, a balance rise counts as 0", () => {
    expect(
      spendBetween(
        { balanceUsd: 10, cumulativeUsageUsd: null, at: t0 },
        { balanceUsd: 7.5, cumulativeUsageUsd: null, at: t1 },
      )?.spendUsd,
    ).toBe(2.5);
    expect(
      spendBetween(
        { balanceUsd: 10, cumulativeUsageUsd: null, at: t0 },
        { balanceUsd: 30, cumulativeUsageUsd: null, at: t1 },
      )?.spendUsd,
    ).toBe(0);
  });
  it("cannot compare readings without common data", () => {
    expect(
      spendBetween(
        { balanceUsd: null, cumulativeUsageUsd: null, at: t0 },
        { balanceUsd: 5, cumulativeUsageUsd: null, at: t1 },
      ),
    ).toBeNull();
  });
});

describe("trailingSpendRate", () => {
  it("rates total cost over gap-free hours, never over wall-clock hours", () => {
    // The real 2026-11-09 16:00 OpenRouter window: $6.364 of cost, but one
    // overnight reading spans a 15h gap. Covered (gap-free) hours = 1.001 +
    // 1.476 + 0.517 = 2.994. True rate = 6.364 / 2.994 = ~$2.13/h - NOT the
    // 6.364 / 17.995 = ~$0.35/h the wall-clock denominator produced.
    const rate = trailingSpendRate({
      windowSpendUsd: 6.364,
      coveredHours: 2.994,
    });
    expect(rate.coverage).toBe(CostCoverage.COMPLETE);
    expect(rate.perHourUsd).toBeCloseTo(2.126, 2);
  });
  it("reports insufficient data (null rate) under a clean hour of coverage", () => {
    const rate = trailingSpendRate({ windowSpendUsd: 0.4, coveredHours: 0.5 });
    expect(rate.coverage).toBe(CostCoverage.PARTIAL);
    expect(rate.perHourUsd).toBeNull();
    const none = trailingSpendRate({ windowSpendUsd: 0, coveredHours: 0 });
    expect(none.coverage).toBe(CostCoverage.NONE);
    expect(none.perHourUsd).toBeNull();
  });
});

describe("detectProviderAnomalies", () => {
  const base = {
    provider: FinanceSource.OPENROUTER,
    providerLabel: "OpenRouter",
    balanceUsd: 100,
    thresholds: DEFAULT_THRESHOLDS,
  };
  /** A fully-covered trailing baseline at the given $/h. */
  const baselineAt = (perHourUsd: number): ReturnType<typeof trailingSpendRate> =>
    trailingSpendRate({ windowSpendUsd: perHourUsd * 48, coveredHours: 48 });
  const noBaseline = trailingSpendRate({ windowSpendUsd: 0, coveredHours: 0 });

  it("flags an hourly spend over the cap as possible key compromise", () => {
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 60,
      elapsedHours: 1,
      trailing: baselineAt(40),
    });
    expect(out.map((a) => a.type)).toContain(FinanceAlertType.SPEND_SPIKE);
    expect(out[0]?.message).toContain("Possible key compromise: OpenRouter");
  });
  it("flags a drain over N x the trailing average even below the cap", () => {
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 10,
      elapsedHours: 1,
      trailing: baselineAt(1),
    });
    expect(out.map((a) => a.type)).toEqual([FinanceAlertType.BALANCE_DRAIN]);
  });
  it("stays quiet on normal spend, on a quiet account and without baseline", () => {
    expect(
      detectProviderAnomalies({
        ...base,
        spendUsd: 2.5,
        elapsedHours: 1,
        trailing: baselineAt(1),
      }),
    ).toEqual([]);
    expect(
      detectProviderAnomalies({
        ...base,
        spendUsd: 1.5,
        elapsedHours: 0.01,
        trailing: baselineAt(0.1),
      }),
    ).toEqual([]);
    expect(
      detectProviderAnomalies({
        ...base,
        spendUsd: 5,
        elapsedHours: 1,
        trailing: noBaseline,
      }),
    ).toEqual([]);
  });
  it("scales spend to dollars per hour over long gaps", () => {
    // $30 over 6h = $5/h: under the cap, 5x a $1/h baseline
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 30,
      elapsedHours: 6,
      trailing: baselineAt(1),
    });
    expect(out.map((a) => a.type)).toEqual([FinanceAlertType.BALANCE_DRAIN]);
  });

  it("does NOT alarm when a sparse window dilutes the baseline (regression)", () => {
    // Exact 2026-11-09 16:00 OpenRouter false positive: a normal $2.68/h hour
    // against a gap-diluted baseline. Correct trailing rate is ~$2.13/h over the
    // 2.994 covered hours, so $2.67/h is ~1.3x - well under the 3x drain limit.
    // The old wall-clock math made the baseline ~$0.35/h and fired an 8x CRITICAL.
    const trailing = trailingSpendRate({
      windowSpendUsd: 6.363911,
      coveredHours: 2.9939,
    });
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 2.67797,
      elapsedHours: 1.0018,
      trailing,
    });
    expect(out).toEqual([]);
  });

  it("stays silent on insufficient trailing data instead of crying wolf", () => {
    // Under a clean hour of covered data there is no meaningful baseline, so the
    // relative drain tripwire holds its fire (the absolute cap still guards).
    const trailing = trailingSpendRate({ windowSpendUsd: 0.2, coveredHours: 0.5 });
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 10,
      elapsedHours: 1,
      trailing,
    });
    expect(out).toEqual([]);
  });

  it("still fires on a genuine sustained rate spike with a solid baseline", () => {
    // Two days of covered data at ~$0.31/h, then $30 in one hour: both the drain
    // (97x) and the absolute cap trip - real detection is intact.
    const trailing = trailingSpendRate({ windowSpendUsd: 15, coveredHours: 48 });
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 30,
      elapsedHours: 1,
      trailing,
    });
    expect(out.map((a) => a.type)).toEqual(
      expect.arrayContaining([
        FinanceAlertType.SPEND_SPIKE,
        FinanceAlertType.BALANCE_DRAIN,
      ]),
    );
  });
});

describe("detectDayAnomalies", () => {
  const quiet = {
    day: "2031-03-03",
    grossRevenueUsd: 200,
    refundsUsd: 0,
    disputesUsd: 0,
    refundCount: 0,
    disputeCount: 0,
    cancellationCount: 0,
    trailingAvgCancellations: 1,
    upstreamCostUsd: 60,
    internalBilledUsd: 80,
  };
  const types = (over: Partial<typeof quiet>): string[] =>
    detectDayAnomalies({ ...quiet, ...over }, DEFAULT_THRESHOLDS).map(
      (a) => a.type,
    );

  it("is silent for a healthy day", () => {
    expect(types({})).toEqual([]);
  });
  it("flags negative margin", () => {
    expect(types({ upstreamCostUsd: 260 })).toContain(
      FinanceAlertType.NEGATIVE_MARGIN,
    );
  });
  it("flags thin margin below the floor, not above", () => {
    expect(types({ upstreamCostUsd: 170 })).toEqual([
      FinanceAlertType.THIN_MARGIN,
      FinanceAlertType.BILLING_GAP,
    ]);
    expect(types({ upstreamCostUsd: 100, internalBilledUsd: 100 })).toEqual([]);
  });
  it("flags refund, dispute, cancellation spikes and the billing gap", () => {
    expect(types({ refundsUsd: 40 })).toContain(FinanceAlertType.REFUND_SPIKE);
    expect(types({ disputeCount: 2, disputesUsd: 30 })).toContain(
      FinanceAlertType.DISPUTE_SPIKE,
    );
    expect(types({ cancellationCount: 6 })).toContain(
      FinanceAlertType.CANCELLATION_SPIKE,
    );
    expect(types({ cancellationCount: 2 })).not.toContain(
      FinanceAlertType.CANCELLATION_SPIKE,
    );
    expect(types({ upstreamCostUsd: 60, internalBilledUsd: 20 })).toContain(
      FinanceAlertType.BILLING_GAP,
    );
  });

  // Free-tier / credit-prepaid economics must NOT trip the margin or billing-gap
  // alarms: cost is judged against credit-value consumed, not same-day sales.
  it("stays silent on a free-tier day: $0 sales, cost covered by credits consumed", () => {
    // 11-08 prod shape: no sales revenue, real upstream, credits consumed > cost.
    expect(
      types({
        grossRevenueUsd: 0,
        upstreamCostUsd: 0.96,
        internalBilledUsd: 7.14,
      }),
    ).toEqual([]);
  });
  it("does not cry wolf on a cold-start sampling artifact (tiny billed vs measured cost)", () => {
    // The reported false alerts: cost measured but almost nothing billed in the
    // window - a sparse-sampling / day-boundary artifact, not a per-use loss.
    expect(
      types({
        grossRevenueUsd: 0,
        upstreamCostUsd: 4.36,
        internalBilledUsd: 0.04,
      }),
    ).toEqual([]);
    expect(
      types({
        grossRevenueUsd: 0,
        upstreamCostUsd: 1.05,
        internalBilledUsd: 0.24,
      }),
    ).toEqual([]);
  });
  it("still flags genuine mis-pricing: substantive billing below upstream cost", () => {
    // Real leak: enough billed to trust the data, yet billed < cost.
    const alerts = types({
      grossRevenueUsd: 0,
      upstreamCostUsd: 60,
      internalBilledUsd: 20,
    });
    expect(alerts).toContain(FinanceAlertType.NEGATIVE_MARGIN);
    expect(alerts).toContain(FinanceAlertType.BILLING_GAP);
  });
});

describe("thresholds + dedup window", () => {
  it("an enabled override wins, a disabled one falls back", () => {
    const th = resolveThresholds([
      { key: ThresholdKey.MARGIN_FLOOR_PCT, value: 50, enabled: true },
      { key: ThresholdKey.DRAIN_MULTIPLIER, value: 9, enabled: false },
    ]);
    expect(th.marginFloorPct).toBe(50);
    expect(th.drainMultiplier).toBe(DEFAULT_THRESHOLDS.drainMultiplier);
  });
  it("suppresses a repeat inside the window only", () => {
    const now = new Date("2031-03-04T12:00:00Z");
    expect(isDuplicateAlert(null, now, 12)).toBe(false);
    expect(isDuplicateAlert(new Date("2031-03-04T03:00:00Z"), now, 12)).toBe(
      true,
    );
    expect(isDuplicateAlert(new Date("2031-03-03T23:00:00Z"), now, 12)).toBe(
      false,
    );
  });
});

// ─── Integration (real DB, mocked externals) ─────────────────────────────────

const NOW = new Date(Date.UTC(2031, 2, 4, 12, 30));
const FUTURE = new Date(Date.UTC(2031, 0, 1));

let openRouterUsage = 100;
const httpCalls: string[] = [];
const mails: { to: string; subject: string }[] = [];

const mockHttp: FinanceHttp = async (
  request: HttpRequest,
): Promise<HttpResult> => {
  httpCalls.push(request.url);
  if (request.url.includes("openrouter.ai/api/v1/credits")) {
    return {
      status: 200,
      json: {
        data: { total_credits: 500, total_usage: openRouterUsage },
      },
    };
  }
  if (request.url.includes("nano-gpt.com")) {
    return { status: 200, json: { usd_balance: "19.5" } };
  }
  if (request.url.includes("api.venice.ai")) {
    return { status: 500, json: null };
  }
  return { status: 404, json: null };
};

const stripePort: StripeLedgerPort = {
  async listBalanceTransactions() {
    const at = Math.floor(Date.UTC(2031, 2, 3, 10) / 1000);
    return [
      { id: "txn_t1", reportingCategory: "charge", amount: 10000, fee: 320, currency: "usd", createdUnix: at },
      { id: "txn_t2", reportingCategory: "refund", amount: -2000, fee: 0, currency: "usd", createdUnix: at },
      { id: "txn_t3", reportingCategory: "dispute", amount: -1000, fee: 1500, currency: "usd", createdUnix: at },
      { id: "txn_t4", reportingCategory: "payout", amount: -5000, fee: 0, currency: "usd", createdUnix: at },
      { id: "txn_t5", reportingCategory: "fee", amount: -100, fee: 0, currency: "usd", createdUnix: at },
    ];
  },
  async listCancellations() {
    return [{ id: "evt_t1", createdUnix: Math.floor(Date.UTC(2031, 2, 3, 11) / 1000) }];
  },
};

const testDeps: FinanceDeps = {
  ...defaultFinanceDeps,
  http: mockHttp,
  now: () => NOW,
  apiKey: (source) =>
    source === FinanceSource.OPENROUTER ||
    source === FinanceSource.NANO_GPT ||
    source === FinanceSource.VENICE ||
    source === FinanceSource.UNCENSORED_AI ||
    source === FinanceSource.FREEDOM_GPT
      ? "test-key"
      : undefined,
  stripePort: () => stripePort,
  nowPaymentsPort: () => null,
  recipients: () => ["ops@example.com"],
  async sendMail(input) {
    mails.push({ to: input.to, subject: input.subject });
    return { ok: true, detail: "sent" };
  },
};

async function purge(): Promise<void> {
  await db.delete(financeAlerts).where(gte(financeAlerts.createdAt, FUTURE));
  await db
    .delete(financeProviderSnapshots)
    .where(gte(financeProviderSnapshots.bucketAt, FUTURE));
  await db
    .delete(financeRevenueEvents)
    .where(gte(financeRevenueEvents.occurredAt, FUTURE));
  await db
    .delete(financeRevenueSnapshots)
    .where(gte(financeRevenueSnapshots.day, FUTURE));
  await db
    .delete(financeDailyRollups)
    .where(gte(financeDailyRollups.day, FUTURE));
}

async function insertPayment(
  userId: string,
  amount: string,
  currency: TestCurrency,
  status: typeof PaymentStatusValue,
  createdAt: Date,
): Promise<string> {
  const [row] = await db
    .insert(paymentTransactions)
    .values({
      userId,
      amount,
      currency,
      status,
      provider: PaymentProvider.STRIPE,
      createdAt,
    })
    .returning({ id: paymentTransactions.id });
  if (!row) {
    throw new Error("failed to seed payment transaction");
  }
  return row.id;
}

async function insertRefund(
  userId: string,
  transactionId: string,
  amount: string,
  currency: TestCurrency,
  createdAt: Date,
): Promise<void> {
  await db.insert(paymentRefunds).values({
    userId,
    transactionId,
    providerRefundId: `re_test_${transactionId}`,
    amount,
    currency,
    status: RefundStatus.SUCCEEDED,
    createdAt,
  });
}

async function ingest(
  scope: typeof IngestScopeValue,
  dryRun = false,
): Promise<FinanceIngestResponseOutput> {
  const result = await FinanceRepository.ingest(
    { scope, dryRun },
    undefined,
    logger,
    t,
    defaultLocale,
  );
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.data;
}

describe("finance ingest (mocked externals)", () => {
  let savedStatus: (typeof financeSourceStatus.$inferSelect)[] = [];
  let savedThresholds: (typeof financeThresholds.$inferSelect)[] = [];

  beforeAll(async () => {
    FinanceRepository.deps = testDeps;
    savedStatus = await db.select().from(financeSourceStatus);
    savedThresholds = await db.select().from(financeThresholds);
    await db.delete(financeThresholds);
    await purge();
  });

  beforeEach(async () => {
    await purge();
    httpCalls.length = 0;
    mails.length = 0;
    openRouterUsage = 100;
  });

  afterAll(async () => {
    await purge();
    await db.delete(financeSourceStatus);
    if (savedStatus.length > 0) {
      await db.insert(financeSourceStatus).values(savedStatus);
    }
    await db.delete(financeThresholds);
    if (savedThresholds.length > 0) {
      await db.insert(financeThresholds).values(savedThresholds);
    }
    FinanceRepository.deps = defaultFinanceDeps;
  });

  async function seedPreviousReading(usage: number): Promise<void> {
    await db.insert(financeProviderSnapshots).values({
      provider: FinanceSource.OPENROUTER,
      bucketAt: new Date(Date.UTC(2031, 2, 4, 11)),
      capturedAt: new Date(Date.UTC(2031, 2, 4, 11, 30)),
      balanceUsd: 500 - usage,
      balanceNative: 500 - usage,
      unit: "usd",
      cumulativeUsageUsd: usage,
      spendUsd: 0.5,
      elapsedHours: 1,
    });
  }

  it("skips a provider with no endpoint and keeps going", async () => {
    const data = await ingest(IngestScope.BALANCES);
    const uncensored = data.sources.find(
      (s) => s.source === FinanceSource.UNCENSORED_AI,
    );
    expect(uncensored?.status).toBe(SourceRunStatus.SKIPPED);
    expect(uncensored?.reason).toContain("no API-key balance endpoint");
    const freedom = data.sources.find(
      (s) => s.source === FinanceSource.FREEDOM_GPT,
    );
    expect(freedom?.status).toBe(SourceRunStatus.SKIPPED);
    // No HTTP attempt was made for them
    expect(httpCalls.some((u) => u.includes("uncensored") || u.includes("freedomgpt"))).toBe(false);

    const or = data.sources.find((s) => s.source === FinanceSource.OPENROUTER);
    expect(or?.status).toBe(SourceRunStatus.OK);
    expect(or?.balanceUsd).toBe(400);
    // A failing provider (Venice 500) is recorded, not thrown
    const venice = data.sources.find((s) => s.source === FinanceSource.VENICE);
    expect(venice?.status).toBe(SourceRunStatus.FAILED);
    expect(venice?.reason).toBe("HTTP 500");
    // A provider without a key is skipped
    const gab = data.sources.find((s) => s.source === FinanceSource.GAB);
    expect(gab?.status).toBe(SourceRunStatus.SKIPPED);
    expect(gab?.reason).toBe("no API key configured");
  });

  it("is idempotent: a re-run in the same hour keeps one snapshot", async () => {
    await ingest(IngestScope.BALANCES);
    await ingest(IngestScope.BALANCES);
    const rows = await db
      .select()
      .from(financeProviderSnapshots)
      .where(
        and(
          gte(financeProviderSnapshots.bucketAt, FUTURE),
          like(financeProviderSnapshots.provider, "enums.source.openrouter"),
        ),
      );
    expect(rows).toHaveLength(1);
  });

  it("stores revenue idempotently by Stripe object id and rolls up margin", async () => {
    await seedPreviousReading(90);
    openRouterUsage = 90;
    await ingest(IngestScope.ALL);
    const second = await ingest(IngestScope.ALL);

    const events = await db
      .select()
      .from(financeRevenueEvents)
      .where(gte(financeRevenueEvents.occurredAt, FUTURE));
    // charge, refund, dispute, payout, cancellation: the fee row is ignored
    expect(events).toHaveLength(5);

    const snaps = await db
      .select()
      .from(financeRevenueSnapshots)
      .where(gte(financeRevenueSnapshots.day, FUTURE));
    expect(snaps).toHaveLength(1);
    expect(snaps[0]?.grossUsd).toBe(100);
    expect(snaps[0]?.refundsUsd).toBe(20);
    expect(snaps[0]?.disputesUsd).toBe(10);
    expect(snaps[0]?.netUsd).toBe(70);
    expect(snaps[0]?.payoutsUsd).toBe(50);
    expect(snaps[0]?.cancellationCount).toBe(1);

    const day = second.days.find((d) => d.day === "2031-03-03");
    expect(day?.netRevenueUsd).toBe(70);
    const rollups = await db
      .select()
      .from(financeDailyRollups)
      .where(gte(financeDailyRollups.day, FUTURE));
    expect(rollups.map((r) => r.netRevenueUsd).sort()).toEqual([0, 70]);
  });

  it("falls back to the local sales ledger when a processor API key is missing", async () => {
    // No Stripe / NOWPayments API key: the run must not skip revenue. It reads
    // our own succeeded payments instead (none in this 2031 window) and stays OK.
    FinanceRepository.deps = {
      ...testDeps,
      stripePort: () => null,
      nowPaymentsPort: () => null,
    };
    try {
      const data = await ingest(IngestScope.REVENUE);
      const stripe = data.sources.find((s) => s.source === FinanceSource.STRIPE);
      expect(stripe?.status).toBe(SourceRunStatus.OK);
      expect(stripe?.reason).toContain("Local sales ledger");
      expect(stripe?.events).toBe(0);
      const np = data.sources.find((s) => s.source === FinanceSource.NOWPAYMENTS);
      expect(np?.status).toBe(SourceRunStatus.OK);
      expect(np?.reason).toContain("Local sales ledger");
    } finally {
      FinanceRepository.deps = testDeps;
    }
  });

  it("counts real succeeded payments as revenue, excluding pending / failed", async () => {
    // Seed real sales in the test window: two succeeded USD charges ($25 + $50),
    // one pending ($20, must NOT count), one EUR charge (FX -> USD), one refund.
    const [anyUser] = await db.select({ id: users.id }).from(users).limit(1);
    if (!anyUser) {
      throw new Error("test requires at least one user");
    }
    const day = new Date(Date.UTC(2031, 2, 3, 15));
    const okA = await insertPayment(anyUser.id, "25.00", "USD", PaymentStatus.SUCCEEDED, day);
    const okB = await insertPayment(anyUser.id, "50.00", "USD", PaymentStatus.SUCCEEDED, day);
    await insertPayment(anyUser.id, "20.00", "USD", PaymentStatus.PENDING, day);
    await insertPayment(anyUser.id, "10.00", "EUR", PaymentStatus.SUCCEEDED, day);
    await insertRefund(anyUser.id, okB, "5.00", "USD", day);

    // Realistic prod shape: the Stripe key is set but the connected account
    // returns no charges (empty / test account), so revenue must come from our
    // own succeeded payments via reconciliation.
    FinanceRepository.deps = {
      ...testDeps,
      stripePort: () => ({
        listBalanceTransactions: async () => [],
        listCancellations: async () => [],
      }),
      nowPaymentsPort: () => null,
    };
    try {
      const data = await ingest(IngestScope.REVENUE);
      const stripe = data.sources.find((s) => s.source === FinanceSource.STRIPE);
      expect(stripe?.status).toBe(SourceRunStatus.OK);
      // 2 USD charges + 1 EUR charge + 1 refund = 4 events; pending excluded.
      expect(stripe?.events).toBe(4);

      const snap = await db
        .select()
        .from(financeRevenueSnapshots)
        .where(gte(financeRevenueSnapshots.day, FUTURE));
      expect(snap).toHaveLength(1);
      // 25 + 50 USD + 10 EUR * 1.08 = 85.80 gross; refund 5; net 80.80.
      expect(snap[0]?.grossUsd).toBe(85.8);
      expect(snap[0]?.refundsUsd).toBe(5);
      expect(snap[0]?.netUsd).toBe(80.8);
      expect(snap[0]?.paymentCount).toBe(3);

      const rolled = data.days.find((d) => d.day === "2031-03-03");
      expect(rolled?.netRevenueUsd).toBe(80.8);
    } finally {
      FinanceRepository.deps = testDeps;
      await db
        .delete(paymentRefunds)
        .where(gte(paymentRefunds.createdAt, FUTURE));
      await db
        .delete(paymentTransactions)
        .where(gte(paymentTransactions.createdAt, FUTURE));
    }
  });

  it("backfills a past day from the payment ledger and marks missing cost incomplete", async () => {
    // A real sale on a historical day that has NO provider cost snapshots.
    const [anyUser] = await db.select({ id: users.id }).from(users).limit(1);
    if (!anyUser) {
      throw new Error("test requires at least one user");
    }
    const sale = new Date(Date.UTC(2031, 2, 2, 15)); // 2031-03-02
    await insertPayment(
      anyUser.id,
      "30.00",
      "USD",
      PaymentStatus.SUCCEEDED,
      sale,
    );
    try {
      const result = await FinanceRepository.ingest(
        {
          scope: IngestScope.ALL,
          dryRun: false,
          backfillFrom: "2031-03-01",
          backfillTo: "2031-03-03",
        },
        undefined,
        logger,
        t,
        defaultLocale,
      );
      if (!result.success) {
        throw new Error(result.message);
      }
      // Three days recomputed; revenue reconstructed from the ledger.
      expect(result.data.days).toHaveLength(3);
      const day = result.data.days.find((d) => d.day === "2031-03-02");
      expect(day?.netRevenueUsd).toBe(30);
      // No cost snapshots that day: cost and margin are UNKNOWN, never a faked 0
      // or a false negative margin.
      expect(day?.costCoverage).toBe(CostCoverage.NONE);
      expect(day?.upstreamCostUsd).toBeNull();
      expect(day?.grossMarginUsd).toBeNull();

      // Persisted the same way.
      const [rollup] = await db
        .select()
        .from(financeDailyRollups)
        .where(eq(financeDailyRollups.day, new Date(Date.UTC(2031, 2, 2))));
      expect(rollup?.netRevenueUsd).toBe(30);
      expect(rollup?.upstreamCostUsd).toBeNull();
      expect(rollup?.grossMarginUsd).toBeNull();
      expect(rollup?.costCoverage).toBe(CostCoverage.NONE);
      // Backfill raises no alerts.
      expect(result.data.alertsRaised).toBe(0);
    } finally {
      await db
        .delete(paymentTransactions)
        .where(gte(paymentTransactions.createdAt, FUTURE));
    }
  });

  it("raises a stolen-key alert once, mails it, and dedups the repeat", async () => {
    // Previous reading one hour earlier at usage 100; now usage 190 = $90/h > $25/h cap
    await seedPreviousReading(100);
    openRouterUsage = 190;

    const first = await ingest(IngestScope.BALANCES);
    const spike = first.alerts.filter(
      (a) => a.type === FinanceAlertType.SPEND_SPIKE,
    );
    expect(spike).toHaveLength(1);
    expect(spike[0]?.delivery).toBe("sent");
    expect(spike[0]?.message).toContain("Possible key compromise: OpenRouter");
    // Hard cap and drain-vs-baseline both trip: two distinct alerts, two mails
    expect(mails).toHaveLength(2);
    expect(mails[0]?.to).toBe("ops@example.com");

    openRouterUsage = 260;
    const second = await ingest(IngestScope.BALANCES);
    const repeat = second.alerts.filter(
      (a) => a.type === FinanceAlertType.SPEND_SPIKE,
    );
    expect(repeat[0]?.delivery).toBe("suppressed");
    expect(second.alertsSuppressed).toBeGreaterThan(0);
    expect(mails).toHaveLength(2);

    const stored = await db
      .select()
      .from(financeAlerts)
      .where(gte(financeAlerts.createdAt, FUTURE));
    expect(
      stored.filter((a) => a.type === FinanceAlertType.SPEND_SPIKE),
    ).toHaveLength(1);
  });

  it("a dry run reports alerts but stores and sends nothing", async () => {
    await seedPreviousReading(100);
    openRouterUsage = 190;
    const data = await ingest(IngestScope.BALANCES, true);
    expect(data.dryRunResult).toBe(true);
    expect(
      data.alerts.some((a) => a.type === FinanceAlertType.SPEND_SPIKE),
    ).toBe(true);
    expect(mails).toHaveLength(0);
    const stored = await db
      .select()
      .from(financeAlerts)
      .where(gte(financeAlerts.createdAt, FUTURE));
    expect(stored).toHaveLength(0);
    const snaps = await db
      .select()
      .from(financeProviderSnapshots)
      .where(gte(financeProviderSnapshots.bucketAt, FUTURE));
    expect(snaps).toHaveLength(1); // only the seeded one
  });

  it("without a recipient the alert is still logged and recorded", async () => {
    FinanceRepository.deps = { ...testDeps, recipients: () => [] };
    try {
      await seedPreviousReading(100);
      openRouterUsage = 190;
      const data = await ingest(IngestScope.BALANCES);
      const spike = data.alerts.find(
        (a) => a.type === FinanceAlertType.SPEND_SPIKE,
      );
      expect(spike?.delivery).toContain("skipped: no recipient");
      expect(mails).toHaveLength(0);
    } finally {
      FinanceRepository.deps = testDeps;
    }
  });
});
