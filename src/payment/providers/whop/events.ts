/**
 * Whop webhook -> internal WebhookEvent mapping (pure, no IO).
 *
 * The shared handler (PaymentRepository.handleWebhook) is keyed on the
 * internal event names Stripe made up; Whop events are normalized onto them
 * so credits, subscriptions, renewals, refunds and disputes run the exact
 * same code as Stripe:
 *
 * | Whop                                   | internal                      |
 * | -------------------------------------- | ----------------------------- |
 * | payment.succeeded (first / one-time)   | checkout.session.completed    |
 * | payment.succeeded (subscription_cycle) | invoice.paid                  |
 * | payment.failed (subscription_cycle)    | invoice.payment_failed        |
 * | payment.failed (first / one-time)      | payment_intent.payment_failed |
 * | membership.updated / activated /       | provider.subscription.state   |
 * |   deactivated / cancel_at_period_end_changed                           |
 * | refund.created / refund.updated        | charge.refunded               |
 * | dispute.created                        | charge.dispute.created        |
 * | dispute.updated (won / lost)           | charge.dispute.closed         |
 *
 * Event ids: payments and refunds key on the Whop object id, so a payment
 * delivered twice (two webhook messages) is still granted once; membership
 * and dispute updates key on the message id (each update is its own event).
 */

import { z } from "zod";

import type { WebhookData, WebhookEvent } from "../types";
import {
  whopDisputeSchema,
  type WhopMembership,
  whopMembershipSchema,
  whopMoneyToMinor,
  type WhopPayment,
  whopPaymentSchema,
  whopRefundSchema,
} from "./api";

/** Internal event for a provider-side subscription state change. */
export const PROVIDER_SUBSCRIPTION_STATE_EVENT = "provider.subscription.state";

const DAY_SECONDS = 24 * 60 * 60;

export const whopEnvelopeSchema = z.object({
  id: z.string(),
  type: z.string(),
  timestamp: z.string().optional(),
  account_id: z.string().nullable().optional(),
  company_id: z.string().nullable().optional(),
  data: z.record(z.string(), z.json()),
});
export type WhopEnvelope = z.infer<typeof whopEnvelopeSchema>;

/** What verifyWebhook must fetch before mapping (webhook payloads are lean). */
export interface WhopRelatedLookups {
  membershipId: string | null;
  paymentId: string | null;
}

export interface WhopRelated {
  membership: WhopMembership | null;
  payment: WhopPayment | null;
}

export type WhopMapResult =
  | { kind: "event"; event: WebhookEvent }
  | { kind: "ignored"; reason: string };

function isoToSeconds(value: string | null | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : undefined;
}

function stringMetadata(
  metadata: WhopPayment["metadata"],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata ?? {})) {
    if (value !== null && value !== undefined) {
      result[key] = String(value);
    }
  }
  return result;
}

function isRenewal(payment: WhopPayment): boolean {
  return payment.billing_reason === "subscription_cycle";
}

export function whopRelatedLookups(envelope: WhopEnvelope): WhopRelatedLookups {
  if (envelope.type.startsWith("payment.")) {
    const payment = whopPaymentSchema.safeParse(envelope.data);
    return {
      membershipId:
        payment.success && envelope.type === "payment.succeeded"
          ? (payment.data.membership_id ?? null)
          : null,
      paymentId: null,
    };
  }
  if (envelope.type.startsWith("refund.")) {
    const refund = whopRefundSchema.safeParse(envelope.data);
    return {
      membershipId: null,
      paymentId: refund.success
        ? (refund.data.payment_id ?? refund.data.payment?.id ?? null)
        : null,
    };
  }
  return { membershipId: null, paymentId: null };
}

/** Paid period of a renewal: the membership's period once it moved past paid_at. */
function renewalPeriod(
  payment: WhopPayment,
  membership: WhopMembership | null,
  metadata: Record<string, string>,
): { start: number; end: number } | undefined {
  const paidAt =
    isoToSeconds(payment.paid_at) ?? isoToSeconds(payment.created_at);
  const start = isoToSeconds(membership?.current_period_start);
  const end = isoToSeconds(membership?.current_period_end);
  if (start !== undefined && end !== undefined && end > (paidAt ?? 0)) {
    return { start, end };
  }
  if (paidAt === undefined) {
    return undefined;
  }
  const days =
    membership?.billing_period_days ??
    (metadata.billingInterval === "YEARLY" ||
    metadata.billingInterval?.endsWith("yearly") ||
    metadata.interval === "year"
      ? 365
      : 30);
  return { start: paidAt, end: paidAt + days * DAY_SECONDS };
}

function mapPayment(
  envelope: WhopEnvelope,
  related: WhopRelated,
): WhopMapResult {
  const parsed = whopPaymentSchema.safeParse(envelope.data);
  if (!parsed.success) {
    return { kind: "ignored", reason: "payment payload unreadable" };
  }
  const payment = parsed.data;
  const metadata = stringMetadata(payment.metadata);
  // Revenue is the pre-tax subtotal: tax is added on top and remitted by
  // Whop (account tax_remitted_by=whop), it is never ours.
  const amountMinor =
    whopMoneyToMinor(payment.subtotal) ?? whopMoneyToMinor(payment.total);
  const membershipId = payment.membership_id ?? undefined;

  if (envelope.type === "payment.failed") {
    if (isRenewal(payment) && membershipId) {
      return {
        kind: "event",
        event: {
          id: `whop_${envelope.id}`,
          type: "invoice.payment_failed",
          data: { id: payment.id, subscription: membershipId, metadata },
        },
      };
    }
    return {
      kind: "event",
      event: {
        id: `whop_${envelope.id}`,
        type: "payment_intent.payment_failed",
        data: { id: payment.id, metadata },
      },
    };
  }

  if (envelope.type !== "payment.succeeded") {
    return { kind: "ignored", reason: `${envelope.type} needs no action` };
  }

  if (isRenewal(payment)) {
    if (!membershipId) {
      return { kind: "ignored", reason: "renewal without membership" };
    }
    const period = renewalPeriod(payment, related.membership, metadata);
    const data: WebhookData = {
      id: payment.id,
      subscription: membershipId,
      status: "paid",
      billing_reason: "subscription_cycle",
      amount_paid: amountMinor ?? undefined,
      currency: payment.currency ?? undefined,
      payment_intent: payment.id,
      invoicePaidAt: isoToSeconds(payment.paid_at),
      billingPeriod: period,
      metadata,
    };
    return {
      kind: "event",
      event: { id: `whop_payment_${payment.id}`, type: "invoice.paid", data },
    };
  }

  if (payment.billing_reason === "subscription_update") {
    return { kind: "ignored", reason: "plan change payment" };
  }

  // First payment of a plan, or a one-time credit pack. Our checkout puts
  // userId + type in the checkout metadata; Whop copies it to the payment.
  if (!metadata.userId || !metadata.type) {
    return {
      kind: "ignored",
      reason: "payment without our checkout metadata (manual link?)",
    };
  }
  const data: WebhookData = {
    // Our payment transaction is keyed by the checkout configuration id.
    id: payment.checkout_configuration_id ?? payment.id,
    metadata: { ...metadata, provider: metadata.provider ?? "WHOP" },
    customer: metadata.userId,
    payment_status: "paid",
    amount_total: amountMinor,
    currency: payment.currency ?? undefined,
    payment_intent: payment.id,
    subscription: membershipId,
    current_period_start: isoToSeconds(
      related.membership?.current_period_start,
    ),
    current_period_end: isoToSeconds(related.membership?.current_period_end),
    created: isoToSeconds(payment.created_at),
  };
  return {
    kind: "event",
    event: {
      id: `whop_payment_${payment.id}`,
      type: "checkout.session.completed",
      data,
    },
  };
}

function mapMembership(envelope: WhopEnvelope): WhopMapResult {
  const parsed = whopMembershipSchema.safeParse(envelope.data);
  if (!parsed.success) {
    return { kind: "ignored", reason: "membership payload unreadable" };
  }
  const membership = parsed.data;
  return {
    kind: "event",
    event: {
      id: `whop_${envelope.id}`,
      type: PROVIDER_SUBSCRIPTION_STATE_EVENT,
      data: {
        id: membership.id,
        status: membership.status,
        cancel_at_period_end: membership.cancel_at_period_end ?? undefined,
        current_period_start: isoToSeconds(membership.current_period_start),
        current_period_end: isoToSeconds(membership.current_period_end),
        metadata: stringMetadata(membership.metadata),
      },
    },
  };
}

function mapRefund(
  envelope: WhopEnvelope,
  related: WhopRelated,
): WhopMapResult {
  const parsed = whopRefundSchema.safeParse(envelope.data);
  if (!parsed.success) {
    return { kind: "ignored", reason: "refund payload unreadable" };
  }
  const refund = parsed.data;
  if (refund.status && refund.status !== "succeeded") {
    return { kind: "ignored", reason: `refund ${refund.status}` };
  }
  const paymentId = refund.payment_id ?? refund.payment?.id;
  if (!paymentId) {
    return { kind: "ignored", reason: "refund without payment" };
  }
  // The payment carries the cumulative refunded amount (what the clawback
  // expects); the refund's own amount is only the fallback.
  // Fractions only: both amounts include tax, so the share is the same.
  const total = whopMoneyToMinor(related.payment?.total);
  const refunded =
    whopMoneyToMinor(related.payment?.refunded_amount) ??
    whopMoneyToMinor(refund.amount);
  return {
    kind: "event",
    event: {
      id: `whop_refund_${refund.id}`,
      type: "charge.refunded",
      data: {
        id: refund.id,
        payment_intent: paymentId,
        amount: total ?? undefined,
        amount_refunded: refunded ?? undefined,
        created: isoToSeconds(related.payment?.created_at),
      },
    },
  };
}

function mapDispute(envelope: WhopEnvelope): WhopMapResult {
  const parsed = whopDisputeSchema.safeParse(envelope.data);
  if (!parsed.success) {
    return { kind: "ignored", reason: "dispute payload unreadable" };
  }
  const dispute = parsed.data;
  const paymentId = dispute.payment?.id;
  if (!paymentId) {
    return { kind: "ignored", reason: "dispute without payment" };
  }
  const closed = dispute.status === "won" || dispute.status === "lost";
  if (envelope.type === "dispute.updated" && !closed) {
    return { kind: "ignored", reason: `dispute ${dispute.status ?? ""}` };
  }
  return {
    kind: "event",
    event: {
      id: `whop_${envelope.id}`,
      type:
        envelope.type === "dispute.created"
          ? "charge.dispute.created"
          : "charge.dispute.closed",
      data: {
        id: dispute.id,
        payment_intent: paymentId,
        status: dispute.status ?? undefined,
        reason: dispute.reason ?? undefined,
        amount: whopMoneyToMinor(dispute.amount) ?? undefined,
      },
    },
  };
}

export function mapWhopWebhook(
  envelope: WhopEnvelope,
  related: WhopRelated,
): WhopMapResult {
  if (envelope.type.startsWith("payment.")) {
    return mapPayment(envelope, related);
  }
  if (envelope.type.startsWith("membership.")) {
    return mapMembership(envelope);
  }
  if (
    envelope.type === "refund.created" ||
    envelope.type === "refund.updated"
  ) {
    return mapRefund(envelope, related);
  }
  if (
    envelope.type === "dispute.created" ||
    envelope.type === "dispute.updated"
  ) {
    return mapDispute(envelope);
  }
  return { kind: "ignored", reason: `${envelope.type} not handled` };
}
