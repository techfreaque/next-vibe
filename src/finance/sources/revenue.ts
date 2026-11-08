/**
 * Finance revenue adapters (READ-ONLY).
 *
 *  - Stripe: balance transactions (reporting_category charge / refund /
 *    dispute / payout) plus customer.subscription.deleted events, via the
 *    existing Stripe client. Paginated, capped, idempotent by object id.
 *  - NOWPayments: GET /payment needs a JWT (email + password login), an API
 *    key alone is rejected. With NOWPAYMENTS_EMAIL / NOWPAYMENTS_PASSWORD we
 *    pull the list; without them we fall back to the local IPN ledger
 *    (payment_transactions / payment_refunds). Payouts need the same JWT.
 * Ports are interfaces so tests inject fixtures and never touch a live API.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { and, eq, gte } from "drizzle-orm";
import { db } from "next-vibe/database";
import { z } from "zod";

import { paymentRefunds, paymentTransactions } from "@/payment/db";
import { PaymentProvider, PaymentStatus } from "@/payment/enum";
import { paymentEnv } from "@/payment/env";
import { StripeProvider } from "@/payment/providers/stripe/repository";

import { FINANCE_CONFIG } from "../config";
import { financeEnv } from "../env";
import {
  FinanceSource,
  RevenueEventKind,
  type RevenueEventKindValue,
} from "../enum";
import { minorToUsd } from "../logic";
import type { FinanceHttp } from "./http";
import type { RevenueEventInput } from "./types";

// ─── Stripe ──────────────────────────────────────────────────────────────────

export interface StripeTxn {
  id: string;
  reportingCategory: string;
  /** Minor units, signed (refunds / disputes / payouts are negative) */
  amount: number;
  fee: number;
  currency: string;
  createdUnix: number;
}

export interface StripeCancellation {
  id: string;
  createdUnix: number;
}

export interface StripeLedgerPort {
  listBalanceTransactions(since: Date): Promise<StripeTxn[]>;
  listCancellations(since: Date): Promise<StripeCancellation[]>;
}

const MAX_ITEMS = FINANCE_CONFIG.maxPages * 100;

function sinceUnix(since: Date): number {
  return Math.floor(since.getTime() / 1000);
}

/** null when STRIPE_SECRET_KEY is not configured. */
export function createStripePort(): StripeLedgerPort | null {
  const stripe = StripeProvider.getStripe();
  if (!stripe) {
    return null;
  }
  return {
    async listBalanceTransactions(since) {
      const out: StripeTxn[] = [];
      for await (const bt of stripe.balanceTransactions.list({
        created: { gte: sinceUnix(since) },
        limit: 100,
      })) {
        out.push({
          id: bt.id,
          reportingCategory: bt.reporting_category,
          amount: bt.amount,
          fee: bt.fee,
          currency: bt.currency,
          createdUnix: bt.created,
        });
        if (out.length >= MAX_ITEMS) {
          break;
        }
      }
      return out;
    },
    async listCancellations(since) {
      const out: StripeCancellation[] = [];
      for await (const ev of stripe.events.list({
        type: "customer.subscription.deleted",
        created: { gte: sinceUnix(since) },
        limit: 100,
      })) {
        out.push({ id: ev.id, createdUnix: ev.created });
        if (out.length >= MAX_ITEMS) {
          break;
        }
      }
      return out;
    },
  };
}

export interface RevenuePull {
  events: RevenueEventInput[];
  /** Rows dropped because their currency has no FX rate */
  unconvertible: number;
  note: string | null;
}

const STRIPE_KIND: Readonly<Record<string, typeof RevenueEventKindValue>> = {
  charge: RevenueEventKind.CHARGE,
  refund: RevenueEventKind.REFUND,
  dispute: RevenueEventKind.DISPUTE,
  payout: RevenueEventKind.PAYOUT,
};

export async function pullStripe(
  port: StripeLedgerPort,
  since: Date,
): Promise<RevenuePull> {
  const events: RevenueEventInput[] = [];
  let unconvertible = 0;
  for (const txn of await port.listBalanceTransactions(since)) {
    const kind = STRIPE_KIND[txn.reportingCategory];
    if (kind === undefined) {
      continue;
    }
    const amountUsd = minorToUsd(Math.abs(txn.amount), txn.currency);
    const feeUsd = minorToUsd(Math.abs(txn.fee), txn.currency);
    if (amountUsd === null || feeUsd === null) {
      unconvertible += 1;
      continue;
    }
    events.push({
      source: FinanceSource.STRIPE,
      kind,
      externalId: txn.id,
      amountUsd,
      feeUsd,
      currency: txn.currency.toLowerCase(),
      occurredAt: new Date(txn.createdUnix * 1000),
    });
  }
  for (const c of await port.listCancellations(since)) {
    events.push({
      source: FinanceSource.STRIPE,
      kind: RevenueEventKind.CANCELLATION,
      externalId: c.id,
      amountUsd: 0,
      feeUsd: 0,
      currency: "usd",
      occurredAt: new Date(c.createdUnix * 1000),
    });
  }
  return { events, unconvertible, note: null };
}

// ─── NOWPayments ─────────────────────────────────────────────────────────────

export interface NowPaymentsPayment {
  id: string;
  /** Major units in price currency */
  priceAmount: number;
  priceCurrency: string;
  status: string;
  createdAt: Date;
}

export interface NowPaymentsRefund {
  id: string;
  amount: number;
  currency: string;
  createdAt: Date;
}

export interface NowPaymentsLedger {
  /** "api" = live list via JWT, "local" = IPN ledger fallback */
  origin: "api" | "local";
  payments: NowPaymentsPayment[];
  refunds: NowPaymentsRefund[];
}

export interface NowPaymentsPort {
  load(since: Date): Promise<NowPaymentsLedger>;
}

const npAuthSchema = z.object({ token: z.string().min(1) });
const npListSchema = z.object({
  data: z.array(
    z.object({
      payment_id: z.union([z.string(), z.number()]).transform(String),
      payment_status: z.string(),
      price_amount: z.union([z.number(), z.string()]).transform(Number),
      price_currency: z.string(),
      created_at: z.string(),
    }),
  ),
});

/** Local IPN ledger: what the webhook recorded. */
async function loadLocalLedger(since: Date): Promise<NowPaymentsLedger> {
  const tx = await db
    .select()
    .from(paymentTransactions)
    .where(
      and(
        eq(paymentTransactions.provider, PaymentProvider.NOWPAYMENTS),
        eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
        gte(paymentTransactions.createdAt, since),
      ),
    );
  const refunds = await db
    .select({ r: paymentRefunds, provider: paymentTransactions.provider })
    .from(paymentRefunds)
    .innerJoin(
      paymentTransactions,
      eq(paymentRefunds.transactionId, paymentTransactions.id),
    )
    .where(
      and(
        eq(paymentTransactions.provider, PaymentProvider.NOWPAYMENTS),
        gte(paymentRefunds.createdAt, since),
      ),
    );
  return {
    origin: "local",
    payments: tx.map((row) => ({
      id: row.providerPaymentIntentId ?? row.providerSessionId ?? row.id,
      priceAmount: Number(row.amount),
      priceCurrency: row.currency,
      status: "finished",
      createdAt: row.createdAt,
    })),
    refunds: refunds.map(({ r }) => ({
      id: r.providerRefundId,
      amount: Number(r.amount),
      currency: r.currency,
      createdAt: r.createdAt,
    })),
  };
}

export function createNowPaymentsPort(
  http: FinanceHttp,
): NowPaymentsPort | null {
  const apiKey = paymentEnv.NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    return null;
  }
  const base = paymentEnv.NOWPAYMENTS_API_URL;
  const email = financeEnv.NOWPAYMENTS_EMAIL;
  const password = financeEnv.NOWPAYMENTS_PASSWORD;
  return {
    async load(since) {
      if (!email || !password) {
        return loadLocalLedger(since);
      }
      const auth = await http({
        url: `${base}/auth`,
        method: "POST",
        headers: { "x-api-key": apiKey },
        body: { email, password },
      });
      const token = npAuthSchema.safeParse(auth.json);
      if (auth.status !== 200 || !token.success) {
        return loadLocalLedger(since);
      }
      const payments: NowPaymentsPayment[] = [];
      for (let page = 0; page < FINANCE_CONFIG.maxPages; page += 1) {
        const query = new URLSearchParams({
          limit: "100",
          page: String(page),
          sortBy: "created_at",
          orderBy: "desc",
          dateFrom: since.toISOString(),
        });
        const res = await http({
          url: `${base}/payment/?${query.toString()}`,
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            Authorization: `Bearer ${token.data.token}`,
          },
        });
        const list = npListSchema.safeParse(res.json);
        if (res.status !== 200 || !list.success) {
          break;
        }
        for (const p of list.data.data) {
          payments.push({
            id: p.payment_id,
            priceAmount: p.price_amount,
            priceCurrency: p.price_currency,
            status: p.payment_status,
            createdAt: new Date(p.created_at),
          });
        }
        if (list.data.data.length < 100) {
          break;
        }
      }
      // The list API has no refund object; refunds come from our ledger.
      const local = await loadLocalLedger(since);
      return { origin: "api", payments, refunds: local.refunds };
    },
  };
}

const NP_PAID = new Set(["finished", "partially_paid"]);

export function pullNowPayments(ledger: NowPaymentsLedger): RevenuePull {
  const events: RevenueEventInput[] = [];
  let unconvertible = 0;
  for (const p of ledger.payments) {
    if (!NP_PAID.has(p.status)) {
      continue;
    }
    const amountUsd = minorToUsd(
      Math.round(p.priceAmount * 100),
      p.priceCurrency,
    );
    if (amountUsd === null) {
      unconvertible += 1;
      continue;
    }
    events.push({
      source: FinanceSource.NOWPAYMENTS,
      kind: RevenueEventKind.CHARGE,
      externalId: p.id,
      amountUsd,
      feeUsd: 0,
      currency: p.priceCurrency.toLowerCase(),
      occurredAt: p.createdAt,
    });
  }
  for (const r of ledger.refunds) {
    const amountUsd = minorToUsd(Math.round(r.amount * 100), r.currency);
    if (amountUsd === null) {
      unconvertible += 1;
      continue;
    }
    events.push({
      source: FinanceSource.NOWPAYMENTS,
      kind: RevenueEventKind.REFUND,
      externalId: r.id,
      amountUsd,
      feeUsd: 0,
      currency: r.currency.toLowerCase(),
      occurredAt: r.createdAt,
    });
  }
  return {
    events,
    unconvertible,
    note:
      ledger.origin === "local"
        ? "NOWPayments payment list needs a JWT (set NOWPAYMENTS_EMAIL / NOWPAYMENTS_PASSWORD); used the local IPN ledger. Payouts unavailable."
        : "Payouts unavailable (not pulled).",
  };
}
