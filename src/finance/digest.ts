/**
 * Finance digest for the daily ops email.
 *
 * Pure collection over a minimal query surface (no DB import, no server-only)
 * so the report composer and tests share it. Every number is read from the
 * finance_* tables or the credit tables. A source that has not reported yet is
 * labeled with the exact env key that unblocks it - never a fabricated figure.
 */

/* eslint-disable i18next/no-literal-string */

import { CreditTransactionType } from "@/credits/enum";
import { CREDIT_VALUE_USD } from "@/products/constants";

import { FinanceSource, RevenueSources, SourceRunStatus } from "./enum";

export type DigestRow = Record<string, string | number | null>;

export interface DigestQueryRunner {
  tableExists(table: string): Promise<boolean>;
  rows(query: string, since: Date): Promise<DigestRow[]>;
}

/** Env key that unblocks each revenue source. */
const REVENUE_KEY: Readonly<Record<string, string>> = {
  [FinanceSource.STRIPE]: "STRIPE_SECRET_KEY",
  [FinanceSource.NOWPAYMENTS]: "NOWPAYMENTS_API_KEY",
};

const LABELS: Readonly<Record<string, string>> = {
  [FinanceSource.STRIPE]: "Stripe",
  [FinanceSource.NOWPAYMENTS]: "NOWPayments",
  [FinanceSource.OPENROUTER]: "OpenRouter",
  [FinanceSource.NANO_GPT]: "NanoGPT",
  [FinanceSource.VENICE]: "Venice",
  [FinanceSource.UNCENSORED_AI]: "uncensored.ai",
  [FinanceSource.GAB]: "Gab AI",
  [FinanceSource.FREEDOM_GPT]: "FreedomGPT",
};

function num(row: DigestRow | undefined, key: string): number | null {
  const value = row?.[key];
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function text(row: DigestRow | undefined, key: string): string {
  const value = row?.[key];
  return value === null || value === undefined ? "" : String(value);
}

export function usd(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function whole(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function label(source: string): string {
  return LABELS[source] ?? source;
}

function monthStartIso(now: Date): string {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();
}

/** Lines for the "Finance" section of the daily email. */
export async function collectFinanceDigestLines(
  run: DigestQueryRunner,
  now: Date,
  since: Date,
): Promise<string[]> {
  const lines: string[] = [];
  const month = monthStartIso(now);

  // Revenue + upstream cost, month to date.
  const [mtd] = await run.rows(
    `SELECT coalesce(sum(net_revenue_usd), 0) AS net, coalesce(sum(upstream_cost_usd), 0) AS cost FROM finance_daily_rollups WHERE day >= '${month}'`,
    since,
  );
  const sourceRows = await run.rows(
    `SELECT source, last_status, last_reason, last_ok_at FROM finance_source_status`,
    since,
  );
  const revenueBlocked = RevenueSources.filter((source) => {
    const row = sourceRows.find((r) => text(r, "source") === source);
    return text(row, "last_status") !== SourceRunStatus.OK;
  });
  const net = num(mtd, "net") ?? 0;
  const cost = num(mtd, "cost") ?? 0;
  if (revenueBlocked.length === RevenueSources.length) {
    lines.push(
      `Revenue MTD: UNVERIFIED (awaiting ${revenueBlocked.map((s) => REVENUE_KEY[s] ?? s).join(" + ")}). Any figure shown would be fake.`,
    );
  } else {
    lines.push(`Revenue MTD (net): ${usd(net)}`);
    for (const source of revenueBlocked) {
      lines.push(
        `  ${label(source)}: awaiting ${REVENUE_KEY[source] ?? source}, not counted`,
      );
    }
  }
  lines.push(
    cost > 0
      ? `Provider cost MTD: ${usd(cost)}`
      : "Provider cost MTD: $0.00 (no spend measured yet, not proof of zero cost)",
  );
  if (net > 0) {
    const margin = net - cost;
    lines.push(
      `Gross margin MTD: ${usd(margin)} (${((margin / net) * 100).toFixed(1)}%)`,
    );
  }

  // Provider spend (last window) + latest balances.
  const [spend] = await run.rows(
    `SELECT sum(spend_usd) AS spent, count(spend_usd) AS readings FROM finance_provider_snapshots WHERE captured_at >= '{{since}}'`,
    since,
  );
  const spent = num(spend, "spent");
  lines.push(
    spent === null
      ? "Provider spend 24h: not measured yet (needs two balance readings per provider)"
      : `Provider spend 24h: ${usd(spent)}`,
  );
  const balances = await run.rows(
    `SELECT DISTINCT ON (provider) provider, balance_usd, balance_native, unit, captured_at FROM finance_provider_snapshots ORDER BY provider, captured_at DESC`,
    since,
  );
  for (const row of balances) {
    const provider = text(row, "provider");
    const balanceUsd = num(row, "balance_usd");
    const native = num(row, "balance_native");
    const unit = text(row, "unit");
    if (balanceUsd !== null) {
      lines.push(`  ${label(provider)}: ${usd(balanceUsd)} left`);
    } else if (native !== null) {
      lines.push(
        `  ${label(provider)}: ${native.toLocaleString("en-US", { maximumFractionDigits: 1 })} ${unit} (no USD rate, excluded from cost)`,
      );
    }
  }
  for (const row of sourceRows) {
    const source = text(row, "source");
    const isProvider = !RevenueSources.some((s) => s === source);
    if (
      isProvider &&
      text(row, "last_status") !== SourceRunStatus.OK &&
      !balances.some((b) => text(b, "provider") === source)
    ) {
      lines.push(
        `  ${label(source)}: no balance feed - ${text(row, "last_reason").slice(0, 80) || "never ran"}`,
      );
    }
  }

  // Free-tier cap utilization.
  if (await run.tableExists("public_free_tier_daily_cap")) {
    const [cap] = await run.rows(
      `SELECT spend_today, cap_amount FROM public_free_tier_daily_cap LIMIT 1`,
      since,
    );
    const used = num(cap, "spend_today");
    const limit = num(cap, "cap_amount");
    if (used !== null && limit !== null && limit > 0) {
      lines.push(
        `Free-tier cap today: ${whole(used)} / ${whole(limit)} credits (${((used / limit) * 100).toFixed(0)}%)`,
      );
    }
  }

  // Credit liability: paid user wallets only. Lead wallets hold the capped free pool.
  if (await run.tableExists("credit_wallets")) {
    const [wallets] = await run.rows(
      `SELECT coalesce(sum(balance) FILTER (WHERE user_id IS NOT NULL), 0) AS owed, count(*) FILTER (WHERE user_id IS NOT NULL AND balance > 0) AS holders, coalesce(sum(free_credits_remaining) FILTER (WHERE lead_id IS NOT NULL), 0) AS free_pool FROM credit_wallets`,
      since,
    );
    const owed = num(wallets, "owed") ?? 0;
    lines.push(
      `Credit liability: ${whole(owed)} credits = ${usd(owed * CREDIT_VALUE_USD)} owed to ${whole(num(wallets, "holders") ?? 0)} user wallets`,
    );
    lines.push(
      `Free pool outstanding: ${whole(num(wallets, "free_pool") ?? 0)} credits (capped, not a liability)`,
    );
  }

  // Active users + usage in the window.
  if (
    (await run.tableExists("credit_transactions")) &&
    (await run.tableExists("credit_wallets"))
  ) {
    const [active] = await run.rows(
      `SELECT count(DISTINCT w.user_id) AS users, count(DISTINCT w.id) AS wallets, coalesce(-sum(t.amount), 0) AS spent FROM credit_transactions t JOIN credit_wallets w ON w.id = t.wallet_id WHERE t.type = '${CreditTransactionType.USAGE}' AND t.created_at >= '{{since}}'`,
      since,
    );
    lines.push(
      `Active 24h: ${whole(num(active, "users") ?? 0)} signed-in users, ${whole(num(active, "wallets") ?? 0)} wallets, ${whole(num(active, "spent") ?? 0)} credits spent`,
    );
  }

  // Threshold breaches = alerts raised in the window.
  const alerts = await run.rows(
    `SELECT severity, message FROM finance_alerts WHERE created_at >= '{{since}}' ORDER BY created_at DESC LIMIT 5`,
    since,
  );
  if (alerts.length === 0) {
    lines.push("Threshold breaches 24h: none");
  } else {
    lines.push(`Threshold breaches 24h: ${alerts.length}`);
    for (const alert of alerts) {
      const critical = text(alert, "severity").endsWith("critical");
      lines.push(
        `  ${critical ? "CRITICAL" : "WARNING"}: ${text(alert, "message").slice(0, 140)}`,
      );
    }
  }
  return lines;
}
