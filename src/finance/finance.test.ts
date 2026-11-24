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

import { afterAll, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { and, eq, gte, like } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { pgliteReady } from "next-vibe/database/client";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";

import { paymentRefunds, paymentTransactions } from "@/payment/db";
import {
  PaymentProvider,
  PaymentStatus,
  type PaymentStatusValue,
  RefundStatus,
} from "@/payment/enum";
import { ApiProvider } from "@/vibe/agent/models/models";

import { FINANCE_CONFIG } from "./config";
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
  AlertSeverity,
  CostCoverage,
  FinanceAlertType,
  FinanceSource,
  IngestScope,
  type IngestScopeValue,
  SourceRunStatus,
  ThresholdKey,
} from "./enum";
import { isFinanceProductionInstance } from "./env";
import { scopedTranslation } from "./i18n";
import type { FinanceIngestResponseOutput } from "./ingest/definition";
import { tasks as financeTasks } from "./ingest/task";
import {
  classifyCostCoverage,
  computeMargin,
  DEFAULT_THRESHOLDS,
  detectDayAnomalies,
  detectProviderAnomalies,
  isDuplicateAlert,
  type LedgerUsageBreakdown,
  minorToUsd,
  resolveThresholds,
  spendBetween,
  trailingSpendRate,
} from "./logic";
import {
  defaultFinanceDeps,
  type FinanceDeps,
  FinanceRepository,
} from "./repository";
import { UNCENSORED_CREDIT_UNIT } from "./sources/dashboard";
import type { FinanceHttp, HttpRequest, HttpResult } from "./sources/http";
import { usagePricing } from "./sources/providers";
import type { StripeLedgerPort } from "./sources/revenue";

type TestCurrency = "USD" | "EUR" | "PLN";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

// ─── Pure logic ──────────────────────────────────────────────────────────────

describe("computeMargin", () => {
  it("nets refunds and disputes, subtracts upstream cost", () => {
    const m = computeMargin({
      grossRevenueUsd: 100,
      refundsUsd: 20,
      disputesUsd: 10,
      processorFeesUsd: 0,
      upstreamCostUsd: 28,
      internalBilledUsd: 40,
    });
    expect(m.netRevenueUsd).toBe(70);
    expect(m.grossMarginUsd).toBe(42);
    expect(m.grossMarginPct).toBe(60);
    expect(m.billingGapPct).toBe(-30);
  });

  it("subtracts processor fees from the margin", () => {
    const m = computeMargin({
      grossRevenueUsd: 100,
      refundsUsd: 0,
      disputesUsd: 0,
      processorFeesUsd: 6,
      upstreamCostUsd: 30,
      internalBilledUsd: 40,
    });
    expect(m.netRevenueUsd).toBe(100);
    expect(m.grossMarginUsd).toBe(64);
    expect(m.grossMarginPct).toBe(64);
  });

  it("has no percentage when there is no revenue", () => {
    const m = computeMargin({
      grossRevenueUsd: 0,
      refundsUsd: 0,
      disputesUsd: 0,
      processorFeesUsd: 0,
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
    spendBasis: "provider-api" as const,
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
    expect(out[0]?.severity).toBe(AlertSeverity.CRITICAL);
    expect(out[0]?.metadata.spendBasis).toBe("provider-api");
  });

  describe("ledger-estimated providers (no spend API)", () => {
    const ledgerBase = {
      ...base,
      provider: FinanceSource.UNCENSORED_AI,
      providerLabel: "uncensored.ai",
      balanceUsd: null,
      spendBasis: "usage-ledger" as const,
    };
    /** One new payer burning a $5 pack: $6.50 billed vs ~$5 upstream (~30% margin). */
    const onePayer = {
      calls: 100,
      billedCredits: 650,
      packCredits: 600,
      freeCredits: 50,
      walletCount: 2,
      topWallets: [
        { wallet: "user u-1", credits: 600 },
        { wallet: "lead l-1", credits: 50 },
      ],
    };

    it("words a covered spike as a usage spike, WARNING, never key compromise", () => {
      const out = detectProviderAnomalies({
        ...ledgerBase,
        thresholds: { ...DEFAULT_THRESHOLDS, hourlySpendCapUsd: 2 },
        spendUsd: 5,
        elapsedHours: 1,
        trailing: baselineAt(0.5),
        ledgerUsage: onePayer,
      });
      expect(out.map((a) => a.type)).toEqual([
        FinanceAlertType.SPEND_SPIKE,
        FinanceAlertType.BALANCE_DRAIN,
      ]);
      for (const alert of out) {
        expect(alert.severity).toBe(AlertSeverity.WARNING);
        expect(alert.message).not.toMatch(/compromise/i);
        expect(alert.message).toContain("Usage spike on uncensored.ai");
        expect(alert.message).toContain("estimated from our own credit ledger");
        expect(alert.message).toContain("100 calls from 2 wallets");
        expect(alert.message).toContain("user u-1 92%");
        expect(alert.message).toContain(
          "Billed $6.50 in credits (pack $6.00, free $0.50) vs $5.00 estimated upstream cost",
        );
        expect(alert.message).toContain("margin 23.1%: covered");
        expect(alert.message).toContain(
          "Key theft on uncensored.ai is only visible in its own dashboard",
        );
        expect(alert.metadata.spendBasis).toBe("usage-ledger");
        expect(alert.metadata.topWalletSharePct).toBe(92.31);
        expect(alert.metadata.billedUsd).toBe(6.5);
      }
    });

    it("keeps CRITICAL as a margin problem when billing does not cover the cost", () => {
      const out = detectProviderAnomalies({
        ...ledgerBase,
        spendUsd: 30,
        elapsedHours: 1,
        trailing: noBaseline,
        ledgerUsage: { ...onePayer, billedCredits: 2000, packCredits: 1950 },
      });
      expect(out.map((a) => a.type)).toEqual([FinanceAlertType.SPEND_SPIKE]);
      expect(out[0]?.severity).toBe(AlertSeverity.CRITICAL);
      expect(out[0]?.message).not.toMatch(/compromise/i);
      expect(out[0]?.message).toContain("does NOT cover the estimated cost");
      expect(out[0]?.message).toContain("shortfall $10.00");
      expect(out[0]?.message).toContain("Margin problem");
      expect(out[0]?.message).toContain("only visible in its own dashboard");
    });

    it("still alerts (WARNING) without a ledger breakdown", () => {
      const out = detectProviderAnomalies({
        ...ledgerBase,
        spendUsd: 30,
        elapsedHours: 1,
        trailing: noBaseline,
        ledgerUsage: null,
      });
      expect(out.map((a) => a.type)).toEqual([FinanceAlertType.SPEND_SPIKE]);
      expect(out[0]?.severity).toBe(AlertSeverity.WARNING);
      expect(out[0]?.message).toContain("margin unknown");
      expect(out[0]?.message).not.toMatch(/compromise/i);
    });
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
    processorFeesUsd: 0,
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
    const [thin] = detectDayAnomalies(
      {
        ...quiet,
        upstreamCostUsd: 170,
        variableSpendByProvider: { secondary: 40, primary: 130 },
      },
      DEFAULT_THRESHOLDS,
    );
    expect(thin?.metadata).toMatchObject({
      largestVariableCostProvider: "primary",
      largestVariableCostUsd: 130,
    });
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
let openRouterCredits = 500;
let nanoGptBalance = 100;
let veniceBalance: number | null = null;
let gabBalance = 1_000;
let observedAt = NOW;
/** Billed calls the mocked usage log reports for uncensored.ai / FreedomGPT. */
let billedCalls = 10;
/** Who / what the mocked usage log reports for a ledger spike window. */
let ledgerBreakdown: LedgerUsageBreakdown = {
  calls: 0,
  billedCredits: 0,
  packCredits: 0,
  freeCredits: 0,
  walletCount: 0,
  topWallets: [],
};
const ledgerWindows: { from: Date; to: Date }[] = [];
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
        // Account-wide usage includes other (dev) keys: never booked as spend.
        data: {
          total_credits: openRouterCredits,
          total_usage: openRouterUsage + 40,
        },
      },
    };
  }
  if (request.url.includes("openrouter.ai/api/v1/key")) {
    return { status: 200, json: { data: { usage: openRouterUsage } } };
  }
  if (request.url.includes("nano-gpt.com")) {
    return { status: 200, json: { usd_balance: String(nanoGptBalance) } };
  }
  if (request.url.includes("api.venice.ai")) {
    return veniceBalance === null
      ? { status: 500, json: null }
      : { status: 200, json: { data: { balances: { USD: veniceBalance } } } };
  }
  if (request.url === "https://gab.ai/v1/credits") {
    return {
      status: 200,
      json: {
        total_available: gabBalance,
        monthly_allotment: { total: 2_000, used: 2_000 - gabBalance },
        purchased: { available: 0 },
      },
    };
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
  isProduction: true,
  http: mockHttp,
  now: () => observedAt,
  apiKey: (source) =>
    source === FinanceSource.OPENROUTER ||
    source === FinanceSource.NANO_GPT ||
    source === FinanceSource.VENICE ||
    source === FinanceSource.UNCENSORED_AI ||
    source === FinanceSource.FREEDOM_GPT
      ? "test-key"
      : undefined,
  dashboardCredentials: () => null,
  stripePort: () => stripePort,
  nowPaymentsPort: () => null,
  usageLedger: {
    billedCalls: async () => billedCalls,
    async usageBreakdown(_modelIds, from, to) {
      ledgerWindows.push({ from, to });
      return ledgerBreakdown;
    },
  },
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

async function checkAutoTopUpBalances(nano: number, venice: number, minutes: number, dryRun = false): Promise<FinanceIngestResponseOutput["alerts"]> {
  nanoGptBalance = nano;
  veniceBalance = venice;
  observedAt = new Date(NOW.getTime() + minutes * 60_000);
  const result = await ingest(IngestScope.BALANCES, dryRun);
  return result.alerts.filter((alert) => alert.type === FinanceAlertType.LOW_BALANCE);
}

describe("finance ingest (mocked externals)", () => {
  let savedStatus: (typeof financeSourceStatus.$inferSelect)[] = [];
  let savedThresholds: (typeof financeThresholds.$inferSelect)[] = [];

  beforeAll(async () => {
    await pgliteReady;
    FinanceRepository.deps = testDeps;
    savedStatus = await db.select().from(financeSourceStatus);
    savedThresholds = await db.select().from(financeThresholds);
    await db.delete(financeThresholds);
    await purge();
  });

  beforeEach(async () => {
    FinanceRepository.deps = testDeps;
    await purge();
    await db.delete(financeThresholds);
    await db
      .update(financeSourceStatus)
      .set({
        lowBalanceSeverity: null,
        lowBalanceObservedAt: null,
        lowBalanceSince: null,
        lowBalanceFloorUsd: null,
      })
      .where(gte(financeSourceStatus.lastRunAt, FUTURE));
    httpCalls.length = 0;
    mails.length = 0;
    openRouterUsage = 100;
    openRouterCredits = 500;
    nanoGptBalance = 100;
    veniceBalance = null;
    gabBalance = 1_000;
    observedAt = NOW;
    billedCalls = 10;
    ledgerWindows.length = 0;
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

  it("prices API-less providers from the usage log and keeps going", async () => {
    const data = await ingest(IngestScope.BALANCES);
    const uncensored = data.sources.find(
      (s) => s.source === FinanceSource.UNCENSORED_AI,
    );
    // No balance API: tracked from our own usage log instead of skipped.
    expect(uncensored?.status).toBe(SourceRunStatus.OK);
    expect(uncensored?.fallback).toBe(true);
    expect(uncensored?.reason).toContain("usage log");
    expect(uncensored?.reason).toContain("$0.05/call");
    const freedom = data.sources.find(
      (s) => s.source === FinanceSource.FREEDOM_GPT,
    );
    expect(freedom?.status).toBe(SourceRunStatus.OK);
    expect(freedom?.fallback).toBe(true);
    expect(freedom?.reason).toContain("$0.08/call");
    // No HTTP attempt was made for them
    expect(httpCalls.some((u) => u.includes("uncensored") || u.includes("freedomgpt"))).toBe(false);

    const or = data.sources.find((s) => s.source === FinanceSource.OPENROUTER);
    expect(or?.status).toBe(SourceRunStatus.OK);
    // Balance is the shared account wallet (500 - 140 account-wide usage)...
    expect(or?.balanceUsd).toBe(360);
    // ...but spend is THIS key's usage counter, never the account-wide total.
    expect(httpCalls.some((u) => u.includes("openrouter.ai/api/v1/key"))).toBe(true);
    const [orSnap] = await db
      .select()
      .from(financeProviderSnapshots)
      .where(
        and(
          eq(financeProviderSnapshots.provider, FinanceSource.OPENROUTER),
          eq(financeProviderSnapshots.bucketAt, new Date(Date.UTC(2031, 2, 4, 12))),
        ),
      );
    expect(orSnap?.cumulativeUsageUsd).toBe(100);
    // A failing provider (Venice 500) is recorded, not thrown
    const venice = data.sources.find((s) => s.source === FinanceSource.VENICE);
    expect(venice?.status).toBe(SourceRunStatus.FAILED);
    expect(venice?.reason).toBe("HTTP 500");
    // A provider without a key is skipped
    const gab = data.sources.find((s) => s.source === FinanceSource.GAB);
    expect(gab?.status).toBe(SourceRunStatus.SKIPPED);
    expect(gab?.reason).toBe("no API key configured");
  });

  it("turns new billed calls into spend for a usage-log provider", async () => {
    // Previous reading: 10 calls at $0.05 = $0.50 cumulative. Now 30 calls.
    await db.insert(financeProviderSnapshots).values({
      provider: FinanceSource.UNCENSORED_AI,
      bucketAt: new Date(Date.UTC(2031, 2, 4, 11)),
      capturedAt: new Date(Date.UTC(2031, 2, 4, 11, 30)),
      balanceUsd: null,
      balanceNative: 10,
      unit: "calls",
      cumulativeUsageUsd: 0.5,
      spendUsd: null,
      elapsedHours: null,
    });
    billedCalls = 30;
    const data = await ingest(IngestScope.BALANCES);
    const uncensored = data.sources.find(
      (s) => s.source === FinanceSource.UNCENSORED_AI,
    );
    expect(uncensored?.spendUsd).toBe(1);
    const [stored] = await db
      .select()
      .from(financeProviderSnapshots)
      .where(
        and(
          eq(financeProviderSnapshots.provider, FinanceSource.UNCENSORED_AI),
          eq(financeProviderSnapshots.bucketAt, new Date(Date.UTC(2031, 2, 4, 12))),
        ),
      );
    expect(stored?.balanceNative).toBeNull();
    expect(stored?.cumulativeUsageUsd).toBe(1.5);
  });

  it("uses uncensored.ai's credit counter and falls back across a counter reset", async () => {
    await db.insert(financeThresholds).values({
      key: ThresholdKey.UNCENSORED_AI_LOW_BALANCE_CREDITS,
      value: 40,
    });
    const previousCapture = new Date(Date.UTC(2031, 2, 4, 11, 30));
    await db.insert(financeProviderSnapshots).values({
      provider: FinanceSource.UNCENSORED_AI,
      bucketAt: new Date(Date.UTC(2031, 2, 4, 11)),
      capturedAt: previousCapture,
      balanceUsd: 3,
      balanceNative: 60,
      unit: UNCENSORED_CREDIT_UNIT,
      cumulativeUsageUsd: 2,
    });
    let allocatedCredits = 80;
    FinanceRepository.deps = {
      ...testDeps,
      apiKey: (source) =>
        source === FinanceSource.UNCENSORED_AI ? undefined : testDeps.apiKey(source),
      dashboardCredentials: (source) =>
        source === FinanceSource.UNCENSORED_AI
          ? { email: "finance@example.test", password: "fixture-password" }
          : null,
      usageLedger: {
        ...testDeps.usageLedger,
        async billedCalls(_models, dateRange) {
          if (dateRange) {
            expect(dateRange).toEqual({ from: previousCapture, to: NOW });
            return 3;
          }
          return 100;
        },
      },
      async http(request) {
        const url = new URL(request.url);
        if (url.hostname !== "mkstqjtsujvcaobdksxs.supabase.co") {
          return await mockHttp(request);
        }
        switch (url.pathname) {
          case "/auth/v1/token":
            return {
              status: 200,
              json: {
                access_token: "fixture-session",
                expires_in: 3600,
                user: { id: "70dd4cc6-9269-4eb9-8c07-49d1ff541f3c" },
              },
            };
          case "/rest/v1/rpc/get_user_credit_balance":
            return { status: 200, json: 5 };
          default:
            return {
              status: 200,
              json: [{ status: "active", total_credits: allocatedCredits, credits_remaining: 10 }],
            };
        }
      },
    };
    const result = await ingest(IngestScope.BALANCES);
    expect(result.sources.find((source) => source.source === FinanceSource.UNCENSORED_AI))
      .toMatchObject({ balanceUsd: 0.75, spendUsd: 1.5, fallback: false });
    expect(result.alerts).toContainEqual(expect.objectContaining({
      subject: FinanceSource.UNCENSORED_AI,
      severity: AlertSeverity.CRITICAL,
      type: FinanceAlertType.LOW_BALANCE,
    }));
    const status = await FinanceRepository.status(t, logger);
    expect(status.success && status.data.sources.find((source) => source.source === FinanceSource.UNCENSORED_AI))
      .toMatchObject({ balanceNative: 15, fallback: false, lastSpendUsd: 1.5 });

    allocatedCredits = 20;
    const retry = await ingest(IngestScope.BALANCES);
    expect(retry.sources.find((source) => source.source === FinanceSource.UNCENSORED_AI))
      .toMatchObject({
        balanceUsd: 0.75,
        spendUsd: expect.closeTo(0.15),
        fallback: true,
        reason: expect.stringContaining("dashboard usage counter decreased"),
      });
  });

  it("raises a ledger spike as a WARNING usage spike with who / what", async () => {
    // 10 -> 1010 calls at $0.05 in 1h = $50 estimated, over the $25/h cap.
    await db.insert(financeProviderSnapshots).values({
      provider: FinanceSource.UNCENSORED_AI,
      bucketAt: new Date(Date.UTC(2031, 2, 4, 11)),
      capturedAt: new Date(Date.UTC(2031, 2, 4, 11, 30)),
      balanceUsd: null,
      balanceNative: 10,
      unit: "calls",
      cumulativeUsageUsd: 0.5,
      spendUsd: null,
      elapsedHours: null,
    });
    billedCalls = 1010;
    ledgerBreakdown = {
      calls: 1000,
      billedCredits: 6500,
      packCredits: 6500,
      freeCredits: 0,
      walletCount: 1,
      topWallets: [{ wallet: "user u-payer", credits: 6500 }],
    };
    const data = await ingest(IngestScope.BALANCES, true);
    // Breakdown window = previous reading -> now (FreedomGPT shares the mock)
    expect(ledgerWindows).toContainEqual({
      from: new Date(Date.UTC(2031, 2, 4, 11, 30)),
      to: NOW,
    });
    const spike = data.alerts.find(
      (a) =>
        a.type === FinanceAlertType.SPEND_SPIKE &&
        a.subject === FinanceSource.UNCENSORED_AI,
    );
    expect(spike?.severity).toBe(AlertSeverity.WARNING);
    expect(spike?.message).toContain("Usage spike on uncensored.ai");
    expect(spike?.message).toContain("user u-payer 100%");
    expect(spike?.message).not.toMatch(/compromise/i);
  });

  it("the live usage ledger breakdown query runs and adds up", async () => {
    const { modelIds } = usagePricing(ApiProvider.UNCENSORED_AI);
    const all = await defaultFinanceDeps.usageLedger.usageBreakdown(
      modelIds,
      new Date(Date.UTC(2020, 0, 1)),
      new Date(Date.UTC(2100, 0, 1)),
    );
    expect(all.calls).toBeGreaterThanOrEqual(0);
    expect(all.packCredits + all.freeCredits).toBeCloseTo(all.billedCredits, 1);
    expect(all.topWallets.length).toBeLessThanOrEqual(
      Math.min(all.walletCount, 3),
    );
    const none = await defaultFinanceDeps.usageLedger.usageBreakdown(
      modelIds,
      FUTURE,
      new Date(FUTURE.getTime() + 1000),
    );
    expect(none).toEqual({
      calls: 0,
      billedCredits: 0,
      packCredits: 0,
      freeCredits: 0,
      walletCount: 0,
      topWallets: [],
    });
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
    // charge, refund, dispute, payout, fee, cancellation
    expect(events).toHaveLength(6);

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
    // charge fee $3.20 + dispute fee $15 + account fee row $1
    expect(snaps[0]?.feesUsd).toBe(19.2);
    expect(snaps[0]?.cancellationCount).toBe(1);

    const day = second.days.find((d) => d.day === "2031-03-03");
    expect(day?.netRevenueUsd).toBe(70);
    expect(day?.processorFeesUsd).toBe(19.2);
    const stripe = second.sources.find((s) => s.source === FinanceSource.STRIPE);
    expect(stripe?.fallback).toBe(false);
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
      expect(stripe?.reason).toContain("FALLBACK: local sales ledger");
      expect(stripe?.fallback).toBe(true);
      expect(stripe?.events).toBe(0);
      const np = data.sources.find((s) => s.source === FinanceSource.NOWPAYMENTS);
      expect(np?.status).toBe(SourceRunStatus.OK);
      expect(np?.fallback).toBe(true);
      expect(np?.reason).toContain("NOWPAYMENTS_EMAIL + NOWPAYMENTS_PASSWORD");
      // The flag is persisted so finance-status and the digest show it too.
      const [npStatus] = await db
        .select()
        .from(financeSourceStatus)
        .where(eq(financeSourceStatus.source, FinanceSource.NOWPAYMENTS));
      expect(npStatus?.lastFallback).toBe(true);
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
      // API said nothing while our ledger has sales: flagged, not silent.
      expect(stripe?.fallback).toBe(true);

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
    // No processor API: the backfill falls back (flagged) to our own ledger.
    FinanceRepository.deps = {
      ...testDeps,
      stripePort: () => null,
      nowPaymentsPort: () => null,
    };
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
      FinanceRepository.deps = testDeps;
      await db
        .delete(paymentTransactions)
        .where(gte(paymentTransactions.createdAt, FUTURE));
    }
  });

  it("never double counts one sale seen by the local ledger and the Stripe API", async () => {
    // Prod regression: a backfill stored the sale under its payment_transactions
    // id, the live Stripe pull stored it again under the balance-transaction id,
    // and the day's revenue doubled. The window re-pull must replace, not add.
    const [anyUser] = await db.select({ id: users.id }).from(users).limit(1);
    if (!anyUser) {
      throw new Error("test requires at least one user");
    }
    const sale = new Date(Date.UTC(2031, 2, 3, 10));
    await insertPayment(anyUser.id, "100.00", "USD", PaymentStatus.SUCCEEDED, sale);
    try {
      FinanceRepository.deps = { ...testDeps, stripePort: () => null };
      await ingest(IngestScope.REVENUE);
      FinanceRepository.deps = testDeps;
      await ingest(IngestScope.REVENUE);
      const charges = await db
        .select()
        .from(financeRevenueEvents)
        .where(
          and(
            gte(financeRevenueEvents.occurredAt, FUTURE),
            eq(financeRevenueEvents.kind, "enums.eventKind.charge"),
          ),
        );
      expect(charges.map((c) => c.externalId)).toEqual(["txn_t1"]);
      const [snap] = await db
        .select()
        .from(financeRevenueSnapshots)
        .where(
          and(
            gte(financeRevenueSnapshots.day, FUTURE),
            eq(financeRevenueSnapshots.source, FinanceSource.STRIPE),
          ),
        );
      expect(snap?.grossUsd).toBe(100);
    } finally {
      FinanceRepository.deps = testDeps;
      await db
        .delete(paymentTransactions)
        .where(gte(paymentTransactions.createdAt, FUTURE));
    }
  });

  it("adds the flat-rate Gab plan to daily cost when its key is set", async () => {
    FinanceRepository.deps = {
      ...testDeps,
      apiKey: (source) =>
        source === FinanceSource.GAB ? "test-key" : testDeps.apiKey(source),
    };
    try {
      await seedPreviousReading(90);
      openRouterUsage = 91;
      const data = await ingest(IngestScope.BALANCES);
      const today = data.days.find((d) => d.day === "2031-03-04");
      const [rollup] = await db
        .select()
        .from(financeDailyRollups)
        .where(eq(financeDailyRollups.day, new Date(Date.UTC(2031, 2, 4))));
      // $200/year = $16.67/month / 31 days in March = $0.54 per day, on top
      // of the measured spend.
      const spend = rollup?.perProviderSpend ?? {};
      expect(spend[FinanceSource.GAB]).toBe(0.54);
      const total = Object.values(spend).reduce((a, b) => a + b, 0);
      expect(today?.upstreamCostUsd).toBe(Math.round(total * 100) / 100);
      expect(today?.upstreamCostUsd ?? 0).toBeGreaterThanOrEqual(1.54);
    } finally {
      FinanceRepository.deps = testDeps;
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

  it("waits over an hour for NanoGPT and Venice auto top-ups", async () => {
    expect(await checkAutoTopUpBalances(9.75, 9.9, 0)).toEqual([]);
    expect(await checkAutoTopUpBalances(4.5, 3, 1, true)).toEqual([]);
    expect(await checkAutoTopUpBalances(4.5, 3, 1)).toEqual([]);
    expect(await checkAutoTopUpBalances(4.5, 3, 61)).toEqual([]);
    expect(mails).toHaveLength(0);

    expect(await checkAutoTopUpBalances(4.5, 3, 62)).toEqual([
      expect.objectContaining({
        subject: FinanceSource.NANO_GPT,
        severity: AlertSeverity.CRITICAL,
        delivery: "sent",
      }),
      expect.objectContaining({
        subject: FinanceSource.VENICE,
        severity: AlertSeverity.CRITICAL,
        delivery: "sent",
      }),
    ]);
    expect((await checkAutoTopUpBalances(4.5, 3, 63)).map((alert) => alert.delivery)).toEqual([
      "suppressed",
      "suppressed",
    ]);

    // A recovery clears only this provider's low-balance streak.
    expect(await checkAutoTopUpBalances(5, 3, 64)).toEqual([
      expect.objectContaining({
        subject: FinanceSource.VENICE,
        delivery: "suppressed",
      }),
    ]);
    expect(await checkAutoTopUpBalances(4.9, 5, 65)).toEqual([]);
    expect(await checkAutoTopUpBalances(4.9, 5, 125)).toEqual([]);
    expect(await checkAutoTopUpBalances(4.9, 5, 126)).toEqual([
      expect.objectContaining({
        subject: FinanceSource.NANO_GPT,
        severity: AlertSeverity.CRITICAL,
        delivery: "sent",
      }),
    ]);
    expect(mails).toHaveLength(3);
  });

  it("waits for OpenRouter's grace period and resets it on recovery or a missed hour", async () => {
    async function checkBalance(balance: number, mins: number, dryRun = false) {
      openRouterCredits = openRouterUsage + 40 + balance;
      observedAt = new Date(NOW.getTime() + mins * 60_000);
      const result = await ingest(IngestScope.BALANCES, dryRun);
      return result.alerts.find(
        (alert) => alert.type === FinanceAlertType.LOW_BALANCE &&
          alert.subject === FinanceSource.OPENROUTER,
      );
    }

    expect(await checkBalance(4, 0)).toBeUndefined();
    expect(await checkBalance(4, 60)).toBeUndefined();
    expect(await checkBalance(4, 61, true)).toMatchObject({ delivery: "dry-run" });
    expect(await checkBalance(4, 61)).toMatchObject({
      severity: AlertSeverity.CRITICAL,
      delivery: "sent",
    });
    expect(await checkBalance(4, 62)).toMatchObject({ delivery: "suppressed" });
    expect(await checkBalance(5, 63)).toBeUndefined();
    expect(await checkBalance(4, 64)).toBeUndefined();
    expect(await checkBalance(4, 180)).toBeUndefined();
    expect(await checkBalance(4, 241)).toMatchObject({ delivery: "sent" });
    expect(mails).toHaveLength(2);
  });

  it("uses the configured OpenRouter floor and grace period", async () => {
    await db.insert(financeThresholds).values([
      { key: ThresholdKey.OPENROUTER_AUTO_TOP_UP_FLOOR_USD, value: 7 },
      { key: ThresholdKey.OPENROUTER_AUTO_TOP_UP_GRACE_HOURS, value: 0.25 },
    ]);
    openRouterCredits = 146;
    expect((await ingest(IngestScope.BALANCES)).alerts).toHaveLength(0);
    observedAt = new Date(NOW.getTime() + 16 * 60_000);
    expect((await ingest(IngestScope.BALANCES)).alerts).toEqual([
      expect.objectContaining({
        severity: AlertSeverity.CRITICAL,
        subject: FinanceSource.OPENROUTER,
        message: expect.stringContaining("$6.00, below $7.00"),
        delivery: "sent",
      }),
    ]);
  });

  it("tracks Gab credit charges over closed hours and alerts on its native balance", async () => {
    gabBalance = 150;
    await db.insert(financeThresholds).values({
      key: ThresholdKey.GAB_LOW_BALANCE_CREDITS,
      value: 200,
    });
    const bucketAt = new Date(Date.UTC(2031, 2, 4, 12));
    const endSeconds = bucketAt.getTime() / 1_000;
    const endDate = new Date(bucketAt.getTime() - 1_000).toISOString();
    const previousBucket = new Date(bucketAt.getTime() - FINANCE_CONFIG.hourMs);
    const startDate = previousBucket.toISOString();
    await db.insert(financeProviderSnapshots).values({
      provider: FinanceSource.GAB,
      bucketAt: previousBucket,
      capturedAt: previousBucket,
      unit: "gab-credits",
      spendNative: 0,
    });
    let usageCalls = 0;
    let failUsage = false;
    FinanceRepository.deps = {
      ...testDeps,
      apiKey: (source) => (source === FinanceSource.GAB ? "test-key" : testDeps.apiKey(source)),
      async http(request): Promise<HttpResult> {
        const url = new URL(request.url);
        if (url.origin !== "https://gab.ai" || url.pathname !== "/v1/usage") {
          return await mockHttp(request);
        }
        usageCalls += 1;
        expect(request.method).toBe("GET");
        expect(request.headers.Authorization).toBe("Bearer test-key");
        if (failUsage) {
          expect(url.searchParams.get("start_date")).toBe(bucketAt.toISOString());
          return { status: 503, json: null };
        }
        expect(url.searchParams.get("start_date")).toBe(startDate);
        expect(url.searchParams.get("end_date")).toBe(endDate);
        if (url.searchParams.get("before") === "cursor") {
          return {
            status: 200,
            json: { data: [{ created: endSeconds - 3_600, credits_used: 3 }], has_more: false },
          };
        }
        return {
          status: 200,
          json: {
            data: [
              { created: endSeconds, credits_used: 99 },
              { created: endSeconds - 1, credits_used: 4 },
            ],
            has_more: true,
            last_id: "cursor",
          },
        };
      },
    };
    try {
      const result = await ingest(IngestScope.BALANCES);
      expect(usageCalls).toBe(2);
      expect(result.sources.find(({ source }) => source === FinanceSource.GAB))
        .toMatchObject({ balanceUsd: null, spendUsd: null, fallback: false, reason: expect.stringContaining("7 Gab credits charged") });
      expect(result.alerts).toEqual([
        expect.objectContaining({
          subject: FinanceSource.GAB,
          severity: AlertSeverity.WARNING,
          message: expect.stringContaining("150 credits remaining, below 200"),
        }),
      ]);
      const status = await FinanceRepository.status(t, logger);
      expect(status.success && status.data.sources.find(({ source }) => source === FinanceSource.GAB))
        .toMatchObject({ balanceNative: 150, lastSpendNative: 7 });

      failUsage = true;
      gabBalance = 40;
      observedAt = new Date(NOW.getTime() + FINANCE_CONFIG.hourMs);
      const duringOutage = await ingest(IngestScope.BALANCES);
      expect(duringOutage.alerts).toEqual([
        expect.objectContaining({ subject: FinanceSource.GAB, severity: AlertSeverity.CRITICAL }),
      ]);
      expect(duringOutage.sources.find(({ source }) => source === FinanceSource.GAB)).toMatchObject(
        {
          status: SourceRunStatus.OK,
          reason: expect.stringContaining("Gab usage unavailable (HTTP 503)"),
        },
      );
    } finally {
      FinanceRepository.deps = testDeps;
    }
  });

  it("keeps the reported NanoGPT and Venice balances quiet during normal auto top-up dips", async () => {
    nanoGptBalance = 14.52;
    veniceBalance = 6.02;
    const bucketAt = new Date(Date.UTC(2031, 2, 4, 11));
    await db.insert(financeProviderSnapshots).values([
      {
        provider: FinanceSource.NANO_GPT,
        bucketAt,
        capturedAt: bucketAt,
        balanceUsd: nanoGptBalance,
        spendUsd: (nanoGptBalance / 8.7) * 7,
        elapsedHours: 1,
      },
      {
        provider: FinanceSource.VENICE,
        bucketAt,
        capturedAt: bucketAt,
        balanceUsd: veniceBalance,
        spendUsd: (veniceBalance / 23.8) * 7,
        elapsedHours: 1,
      },
    ]);

    expect((await ingest(IngestScope.BALANCES)).alerts).toHaveLength(0);
    expect(mails).toHaveLength(0);
  });

  it("uses separate NanoGPT and Venice auto top-up overrides", async () => {
    veniceBalance = 5.5;
    nanoGptBalance = 6.5;
    await db.insert(financeThresholds).values([
      { key: ThresholdKey.NANO_GPT_AUTO_TOP_UP_FLOOR_USD, value: 7 },
      { key: ThresholdKey.NANO_GPT_AUTO_TOP_UP_GRACE_HOURS, value: 0.25 },
      { key: ThresholdKey.VENICE_AUTO_TOP_UP_FLOOR_USD, value: 6 },
      { key: ThresholdKey.VENICE_AUTO_TOP_UP_GRACE_HOURS, value: 0.5 },
    ]);

    expect((await ingest(IngestScope.BALANCES)).alerts).toEqual([]);
    observedAt = new Date(NOW.getTime() + 16 * 60_000);
    expect((await ingest(IngestScope.BALANCES)).alerts).toEqual([
      expect.objectContaining({
        subject: FinanceSource.NANO_GPT,
        severity: AlertSeverity.CRITICAL,
        delivery: "sent",
      }),
    ]);
    observedAt = new Date(NOW.getTime() + 31 * 60_000);
    expect((await ingest(IngestScope.BALANCES)).alerts).toEqual([
      expect.objectContaining({
        subject: FinanceSource.NANO_GPT,
        delivery: "suppressed",
      }),
      expect.objectContaining({
        subject: FinanceSource.VENICE,
        severity: AlertSeverity.CRITICAL,
        delivery: "sent",
      }),
    ]);
  });

  it("claims one low balance crossing across concurrent ingests", async () => {
    nanoGptBalance = 4;
    expect((await ingest(IngestScope.BALANCES)).alerts).toEqual([]);
    observedAt = new Date(NOW.getTime() + 61 * 60_000);
    const outcomes = await Promise.all([
      ingest(IngestScope.BALANCES),
      ingest(IngestScope.BALANCES),
    ]);
    const deliveries = outcomes.flatMap((outcome) => outcome.alerts.map((alert) => alert.delivery));
    expect(deliveries.toSorted()).toEqual(["sent", "suppressed"]);
    expect(mails).toHaveLength(1);
  });

  it("does not send low balance mail from a non-production instance", async () => {
    FinanceRepository.deps = { ...testDeps, isProduction: false };
    try {
      nanoGptBalance = 0.74;
      expect((await ingest(IngestScope.BALANCES)).alerts).toEqual([]);
      observedAt = new Date(NOW.getTime() + 61 * 60_000);
      const data = await ingest(IngestScope.BALANCES);
      expect(data.alerts[0]).toMatchObject({
        type: FinanceAlertType.LOW_BALANCE,
        delivery: "skipped: no recipient (non-production instance)",
      });
      expect(mails).toHaveLength(0);
    } finally {
      FinanceRepository.deps = testDeps;
    }
  });

  // Regression 2026-11-18: Atlas dev + Hermes ran the finance crons on Stripe
  // TEST data (8 test subscriptions cancelled on 11-17) and mailed
  // "[finance] WARNING: Cancellation spike" to the ops inboxes as if from prod.
  it("non-production instances never run the crons or mail alerts", () => {
    expect(isFinanceProductionInstance).toBe(false);
    expect(defaultFinanceDeps.recipients()).toEqual([]);
    for (const task of financeTasks) {
      expect(task.enabled).toBe(false);
    }
  });
});
