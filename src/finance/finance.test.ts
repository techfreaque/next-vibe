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

import { and, gte, like } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

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
  computeMargin,
  DEFAULT_THRESHOLDS,
  detectDayAnomalies,
  detectProviderAnomalies,
  isDuplicateAlert,
  minorToUsd,
  resolveThresholds,
  spendBetween,
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

describe("detectProviderAnomalies", () => {
  const base = {
    provider: FinanceSource.OPENROUTER,
    providerLabel: "OpenRouter",
    balanceUsd: 100,
    thresholds: DEFAULT_THRESHOLDS,
  };
  it("flags an hourly spend over the cap as possible key compromise", () => {
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 60,
      elapsedHours: 1,
      trailingAvgHourlyUsd: 40,
    });
    expect(out.map((a) => a.type)).toContain(FinanceAlertType.SPEND_SPIKE);
    expect(out[0]?.message).toContain("Possible key compromise: OpenRouter");
  });
  it("flags a drain over N x the trailing average even below the cap", () => {
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 10,
      elapsedHours: 1,
      trailingAvgHourlyUsd: 1,
    });
    expect(out.map((a) => a.type)).toEqual([FinanceAlertType.BALANCE_DRAIN]);
  });
  it("stays quiet on normal spend, on a quiet account and without baseline", () => {
    expect(
      detectProviderAnomalies({
        ...base,
        spendUsd: 2.5,
        elapsedHours: 1,
        trailingAvgHourlyUsd: 1,
      }),
    ).toEqual([]);
    expect(
      detectProviderAnomalies({
        ...base,
        spendUsd: 1.5,
        elapsedHours: 0.01,
        trailingAvgHourlyUsd: 0.1,
      }),
    ).toEqual([]);
    expect(
      detectProviderAnomalies({
        ...base,
        spendUsd: 5,
        elapsedHours: 1,
        trailingAvgHourlyUsd: 0,
      }),
    ).toEqual([]);
  });
  it("scales spend to dollars per hour over long gaps", () => {
    // $30 over 6h = $5/h: under the cap, 5x a $1/h baseline
    const out = detectProviderAnomalies({
      ...base,
      spendUsd: 30,
      elapsedHours: 6,
      trailingAvgHourlyUsd: 1,
    });
    expect(out.map((a) => a.type)).toEqual([FinanceAlertType.BALANCE_DRAIN]);
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
  recipient: () => "ops@example.com",
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

  it("records a missing Stripe key as skipped, never crashes the run", async () => {
    FinanceRepository.deps = { ...testDeps, stripePort: () => null };
    try {
      const data = await ingest(IngestScope.REVENUE);
      const stripe = data.sources.find((s) => s.source === FinanceSource.STRIPE);
      expect(stripe?.status).toBe(SourceRunStatus.SKIPPED);
      expect(stripe?.reason).toBe("STRIPE_SECRET_KEY not configured");
      const np = data.sources.find((s) => s.source === FinanceSource.NOWPAYMENTS);
      expect(np?.status).toBe(SourceRunStatus.SKIPPED);
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
    FinanceRepository.deps = { ...testDeps, recipient: () => null };
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
