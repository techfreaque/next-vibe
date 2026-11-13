/**
 * Finance digest (daily ops email section): composed from mocked rows, no DB.
 */

import { describe, expect, it } from "vitest";

import { collectFinanceDigestLines, type DigestQueryRunner, type DigestRow } from "./digest";
import { FinanceSource, SourceRunStatus } from "./enum";

function runner(rows: Record<string, DigestRow[]>): DigestQueryRunner {
  return {
    tableExists: () => Promise.resolve(true),
    rows: (query) => {
      for (const [needle, value] of Object.entries(rows)) {
        if (query.includes(needle)) {
          return Promise.resolve(value);
        }
      }
      return Promise.resolve([]);
    },
  };
}

const NOW = new Date("2031-03-03T06:00:00Z");
const SINCE = new Date("2031-03-02T06:00:00Z");

describe("finance digest", () => {
  it("labels blocked revenue instead of faking a number", async () => {
    const lines = await collectFinanceDigestLines(
      runner({
        "FROM finance_source_status": [
          { source: FinanceSource.STRIPE, last_status: SourceRunStatus.SKIPPED },
          { source: FinanceSource.NOWPAYMENTS, last_status: SourceRunStatus.SKIPPED },
        ],
        "FROM finance_daily_rollups": [{ net: 0, cost: 0 }],
        "FROM public_free_tier_daily_cap": [{ spend_today: 250, cap_amount: 500 }],
        "FROM credit_wallets": [{ owed: 1000, holders: 3, free_pool: 400 }],
      }),
      NOW,
      SINCE,
    );
    const body = lines.join("\n");
    expect(body).toContain("UNVERIFIED (awaiting STRIPE_SECRET_KEY + NOWPAYMENTS_API_KEY)");
    expect(body).toContain("Free-tier cap today: 250 / 500 credits (50%)");
    expect(body).toContain("Credit liability: 1,000 credits = $10.00 owed to 3 user wallets");
    expect(body).toContain("Threshold breaches 24h: none");
    expect(body).not.toContain("NaN");
  });

  it("reports real revenue, margin and breaches when sources are live", async () => {
    const lines = await collectFinanceDigestLines(
      runner({
        "FROM finance_source_status": [
          { source: FinanceSource.STRIPE, last_status: SourceRunStatus.OK },
          { source: FinanceSource.NOWPAYMENTS, last_status: SourceRunStatus.SKIPPED },
        ],
        "FROM finance_daily_rollups": [{ net: 200, cost: 50 }],
        "FROM finance_provider_snapshots WHERE": [{ spent: 4.5, readings: 3 }],
        "FROM finance_alerts": [{ severity: "enums.severity.critical", message: "drain on OpenRouter" }],
      }),
      NOW,
      SINCE,
    );
    const body = lines.join("\n");
    expect(body).toContain("Revenue MTD (net): $200.00");
    expect(body).toContain("NOWPayments: awaiting NOWPAYMENTS_API_KEY, not counted");
    expect(body).toContain("Gross margin MTD: $150.00 (75.0%)");
    expect(body).toContain("Provider spend 24h: $4.50");
    expect(body).toContain("CRITICAL: drain on OpenRouter");
  });

  it("flags fallback revenue, nets fees, and names the flat Gab plan", async () => {
    const lines = await collectFinanceDigestLines(
      runner({
        "FROM finance_source_status": [
          { source: FinanceSource.STRIPE, last_status: SourceRunStatus.OK, last_fallback: "false" },
          { source: FinanceSource.NOWPAYMENTS, last_status: SourceRunStatus.OK, last_fallback: "true" },
        ],
        "FROM finance_daily_rollups": [{ net: 100, cost: 30, fees: 5 }],
        "DISTINCT ON (provider)": [
          { provider: FinanceSource.GAB, balance_usd: null, balance_native: 1997.2, unit: "gab-credits" },
          { provider: FinanceSource.UNCENSORED_AI, balance_usd: null, balance_native: 351, unit: "calls" },
        ],
      }),
      NOW,
      SINCE,
    );
    const body = lines.join("\n");
    expect(body).toContain(
      "NOWPayments: FALLBACK, counted from our own payment records",
    );
    expect(body).toContain("NOWPAYMENTS_API_KEY + NOWPAYMENTS_EMAIL + NOWPAYMENTS_PASSWORD");
    expect(body).not.toContain("Stripe: FALLBACK");
    expect(body).toContain("Processor fees MTD: $5.00");
    expect(body).toContain("Gross margin MTD: $65.00 (65.0%)");
    expect(body).toContain("Gab AI: flat-rate plan $20.00/month (counted in cost)");
    expect(body).toContain("uncensored.ai: no API, spend estimated from 351 billed calls");
  });
});
