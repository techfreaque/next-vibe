import { createHmac } from "node:crypto";

import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { z } from "zod";

import { PaymentProvider } from "../enum";
import type { paymentAccountingEvidence } from "./db";

type Provider = typeof paymentAccountingEvidence.$inferInsert.provider;
export type AccountingEvidence = Omit<
  typeof paymentAccountingEvidence.$inferInsert,
  "id" | "createdAt"
>;

const isoCurrency = z
  .string()
  .transform((value) => value.toUpperCase())
  .pipe(z.enum(CurrenciesArr));
const minor = z.number().int().min(0).max(9_999_999_999);
const unixSeconds = z.number().int().min(0).max(253_402_300_799);
const opaqueId = z.string().min(1).max(255);
const stripeEvent = z.object({
  account: z
    .string()
    .regex(/^acct_[a-zA-Z0-9]+$/)
    .optional(),
  livemode: z.boolean(),
  type: z.string(),
  created: unixSeconds,
  data: z.object({ object: z.record(z.string(), z.json()) }),
});

export function merchantCredentialId(secret: string): string {
  return `credential:${createHmac("sha256", secret).update("next-vibe:payment-accounting:v1").digest("hex")}`;
}

function exactMinor(value: string | number): number | undefined {
  const digits = /^(0|[1-9]\d{0,7})(?:\.(\d{1,2}))?$/u.exec(String(value));
  if (!digits?.[1]) {
    return undefined;
  }
  return Number(digits[1]) * 100 + Number((digits[2] ?? "").padEnd(2, "0"));
}

const stripeCheckout = z.object({
  id: opaqueId,
  mode: z.literal("payment"),
  payment_status: z.literal("paid"),
  currency: isoCurrency,
  payment_intent: opaqueId,
  amount_total: minor,
  total_details: z.object({ amount_tax: minor }),
  metadata: z.object({ providerPriceId: opaqueId }),
});

const stripeInvoice = z.object({
  id: opaqueId,
  status: z.literal("paid"),
  currency: isoCurrency,
  total: minor,
  amount_paid: minor,
  amount_remaining: z.literal(0),
  status_transitions: z.object({ paid_at: unixSeconds }),
  total_taxes: z.array(z.object({ amount: minor })),
  lines: z.object({
    has_more: z.literal(false),
    data: z.tuple([
      z.object({
        pricing: z.object({ price_details: z.object({ price: opaqueId }) }),
      }),
    ]),
  }),
});

const stripeServicePeriod = z.object({
  billing_reason: z.enum(["subscription_create", "subscription_cycle"]),
  amount_due: minor,
  total_excluding_tax: minor,
  starting_balance: z.literal(0),
  pre_payment_credit_notes_amount: z.literal(0),
  post_payment_credit_notes_amount: z.literal(0),
  lines: z.object({
    data: z.tuple([
      z.object({
        amount: minor,
        currency: isoCurrency,
        period: z.object({ start: unixSeconds, end: unixSeconds }),
        parent: z.object({
          type: z.literal("subscription_item_details"),
          subscription_item_details: z.object({
            proration: z.literal(false),
            subscription: opaqueId,
          }),
        }),
      }),
    ]),
  }),
});

function serviceAllocation(
  data: z.infer<ReturnType<typeof z.json>>,
  invoice: z.infer<typeof stripeInvoice>,
  tax: number,
): Pick<
  AccountingEvidence,
  "servicePeriodStart" | "servicePeriodEnd" | "serviceNetMinor"
> {
  const parsed = stripeServicePeriod.safeParse(data);
  if (!parsed.success) {
    return {};
  }
  const service = parsed.data;
  const [{ amount, currency, period }] = service.lines.data;
  if (
    amount <= 0 ||
    currency !== invoice.currency ||
    service.amount_due !== invoice.amount_paid ||
    amount !== service.total_excluding_tax ||
    amount + tax !== invoice.amount_paid ||
    period.end <= period.start
  ) {
    return {};
  }
  return {
    servicePeriodStart: new Date(period.start * 1000),
    servicePeriodEnd: new Date(period.end * 1000),
    serviceNetMinor: amount,
  };
}

const stripeRefund = z.object({
  id: opaqueId,
  currency: isoCurrency,
  status: z.literal("succeeded"),
  amount: minor,
  created: unixSeconds,
  payment_intent: opaqueId,
});

const stripeCreditNote = z.object({
  status: z.literal("issued"),
  invoice: opaqueId,
  currency: isoCurrency,
  amount: minor,
  total: minor,
  pre_payment_amount: z.literal(0),
  post_payment_amount: minor,
  out_of_band_amount: z.union([z.literal(0), z.null()]),
  customer_balance_transaction: z.null(),
  total_taxes: z.array(z.object({ amount: minor })).max(100),
  refunds: z.tuple([
    z.object({
      type: z.literal("refund"),
      amount_refunded: minor,
      refund: stripeRefund,
    }),
  ]),
});

const stripeChargeWithFee = z.object({
  paid: z.literal(true),
  captured: z.literal(true),
  payment_intent: opaqueId,
  currency: isoCurrency,
  amount_captured: minor,
  balance_transaction: z.object({
    id: opaqueId,
    amount: minor,
    currency: isoCurrency,
    created: unixSeconds,
    fee: minor,
    net: minor,
  }),
});

function stripeEvidence(
  event: z.infer<typeof stripeEvent>,
  credentialId: string,
): AccountingEvidence | undefined {
  const provider = PaymentProvider.STRIPE;
  const merchantId = `${event.livemode ? "live" : "test"}:${event.account ?? credentialId}`;
  const sourceDate = new Date(event.created * 1000);
  const data = event.data.object;
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const parsed = stripeCheckout.safeParse(data);
      if (!parsed.success) {
        return undefined;
      }
      const sale = parsed.data;
      return {
        provider,
        merchantId,
        sourceKind: "sale",
        externalId: sale.payment_intent,
        checkoutId: sale.id,
        paymentIntentId: sale.payment_intent,
        offerId: sale.metadata.providerPriceId,
        sourceDate,
        currency: sale.currency,
        grossMinor: sale.amount_total,
        taxMinor: sale.total_details.amount_tax,
      };
    }
    case "invoice.paid":
    case "invoice.payment_succeeded": {
      const parsed = stripeInvoice.safeParse(data);
      if (!parsed.success) {
        return undefined;
      }
      const sale = parsed.data;
      if (sale.total !== sale.amount_paid) {
        return undefined;
      }
      const tax = sale.total_taxes.reduce((sum, line) => sum + line.amount, 0);
      return {
        provider,
        merchantId,
        sourceKind: "sale",
        externalId: sale.id,
        invoiceReference: sale.id,
        offerId: sale.lines.data[0].pricing.price_details.price,
        sourceDate: new Date(sale.status_transitions.paid_at * 1000),
        currency: sale.currency,
        grossMinor: sale.amount_paid,
        taxMinor: tax,
        ...serviceAllocation(data, sale, tax),
      };
    }
    case "refund.created":
    case "refund.updated": {
      const parsed = stripeRefund.safeParse(data);
      if (!parsed.success) {
        return undefined;
      }
      const refund = parsed.data;
      return {
        provider,
        merchantId,
        sourceKind: "refund",
        externalId: refund.id,
        paymentIntentId: refund.payment_intent,
        currency: refund.currency,
        grossMinor: refund.amount,
        sourceDate: new Date(refund.created * 1000),
      };
    }
    case "credit_note.created":
    case "credit_note.updated": {
      const parsed = stripeCreditNote.safeParse(data);
      if (!parsed.success) {
        return undefined;
      }
      const note = parsed.data;
      const [{ refund, amount_refunded: amountRefunded }] = note.refunds;
      const taxMinor = note.total_taxes.reduce(
        (total, tax) => total + tax.amount,
        0,
      );
      if (
        refund.currency !== note.currency ||
        refund.amount !== amountRefunded ||
        refund.amount !== note.amount ||
        refund.amount !== note.total ||
        refund.amount !== note.post_payment_amount ||
        taxMinor > refund.amount
      ) {
        return undefined;
      }
      return {
        provider,
        merchantId,
        sourceKind: "refund",
        externalId: refund.id,
        paymentIntentId: refund.payment_intent,
        invoiceReference: note.invoice,
        currency: note.currency,
        grossMinor: refund.amount,
        taxMinor,
        sourceDate: new Date(refund.created * 1000),
      };
    }
    case "charge.succeeded":
    case "charge.updated": {
      const parsed = stripeChargeWithFee.safeParse(data);
      if (!parsed.success) {
        return undefined;
      }
      const charge = parsed.data;
      const fee = charge.balance_transaction;
      if (
        fee.currency !== charge.currency ||
        fee.amount !== charge.amount_captured ||
        fee.amount !== fee.fee + fee.net
      ) {
        return undefined;
      }
      return {
        provider,
        merchantId,
        sourceKind: "fee",
        externalId: fee.id,
        paymentIntentId: charge.payment_intent,
        currency: fee.currency,
        grossMinor: fee.amount,
        feeMinor: fee.fee,
        sourceDate: new Date(fee.created * 1000),
      };
    }
    default:
      return undefined;
  }
}

const nativeAmount = z.union([z.number(), z.string()]);
const nowPayment = z.object({
  payment_id: z.union([
    opaqueId,
    z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  ]),
  invoice_id: z.union([
    opaqueId,
    z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  ]),
  payment_status: z.literal("finished"),
  price_currency: isoCurrency,
  pay_currency: isoCurrency,
  outcome_currency: isoCurrency,
  price_amount: nativeAmount,
  actually_paid: nativeAmount,
  outcome_amount: nativeAmount,
  updated_at: z.iso.datetime({ offset: true }),
});

/** Only invoke after the corresponding webhook signature verifier succeeds. */
export function readVerifiedAccountingEvidence(
  body: string,
  provider: Provider,
  credentialId: string,
  offerId?: string,
): AccountingEvidence | undefined {
  const payload = z.json().safeParse(JSON.parse(body));
  if (!payload.success) {
    return undefined;
  }
  if (provider === PaymentProvider.STRIPE) {
    const parsed = stripeEvent.safeParse(payload.data);
    return parsed.success
      ? stripeEvidence(parsed.data, credentialId)
      : undefined;
  }
  const parsed = nowPayment.safeParse(payload.data);
  if (!parsed.success || !offerId) {
    return undefined;
  }
  const payment = parsed.data;
  const gross = exactMinor(payment.price_amount);
  const outcome = exactMinor(payment.outcome_amount);
  if (
    !gross ||
    exactMinor(payment.actually_paid) !== gross ||
    !outcome ||
    outcome > gross ||
    payment.price_currency !== payment.pay_currency ||
    payment.price_currency !== payment.outcome_currency
  ) {
    return undefined;
  }
  return {
    provider,
    merchantId: credentialId,
    sourceKind: "sale",
    externalId: String(payment.payment_id),
    checkoutId: String(payment.invoice_id),
    offerId,
    currency: payment.price_currency,
    grossMinor: gross,
    sourceDate: new Date(payment.updated_at),
  };
}
