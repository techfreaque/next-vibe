/**
 * Whop adapter, pure parts: Standard Webhooks signature and the mapping of
 * Whop webhooks onto the internal events the shared handler runs.
 * Payload shapes follow the Whop docs (envelope sample in
 * docs.whop.com/developer/guides/webhooks.md, Payment / Membership / Refund
 * / Dispute schemas in api.whop.com/api/v1/openapi.json, 2026-11-25).
 */

import { describe, expect, it } from "vitest";

import { PROVIDER_SUBSCRIPTION_STATE_EVENT, mapWhopWebhook, whopEnvelopeSchema, whopRelatedLookups } from "./events";
import { ProductIds } from "../../../products/repository-client";
import { whopMoneyToMinor } from "./api";
import { allWhopVariantSpecs, whopVariantKey } from "./catalog";
import { whopRedirectUrl } from "./repository";
import {
  decodeWhopSignatureHeaders,
  encodeWhopSignatureHeaders,
  signWhopPayload,
  verifyWhopSignature,
} from "./signature";

const SECRET = "ws_fixture_secret_0123456789";
const VECTOR_BODY =
  '{"id":"msg_2Lh9fYqFx1example","type":"payment.succeeded","data":{"id":"pay_fixture"}}';

function envelope(type: string, data: Record<string, string | number | boolean | null | Record<string, string | number | boolean | null>>): ReturnType<typeof whopEnvelopeSchema.parse> {
  return whopEnvelopeSchema.parse({
    id: `msg_${type.replace(".", "_")}_1`,
    type,
    api_version: "v1",
    api_version_date: "2026-11-25",
    timestamp: "2026-11-27T22:00:00.000Z",
    account_id: "biz_fixture",
    data,
  });
}

const money = (
  amount: string,
  currency = "usd",
): {
  amount: string;
  currency: string;
  decimals: number;
  display_decimals: number;
} => ({
  amount,
  currency,
  decimals: 2,
  display_decimals: 2,
});

const noRelated = { membership: null, payment: null };

describe("Whop webhook signature", () => {
  it("matches an independently computed HMAC (literal ws_ secret bytes)", () => {
    // openssl dgst -sha256 -hmac '<secret>' over "<id>.<ts>.<body>", base64
    expect(
      signWhopPayload({
        secret: SECRET,
        id: "msg_2Lh9fYqFx1example",
        timestamp: "1764280800",
        body: VECTOR_BODY,
      }),
    ).toBe("v1,GS/GW9MCwfUBXSqkLBQA71CIIe215VXNzm0+RgV+SYo=");
  });

  it("accepts a valid signature among several and rejects tampering and replays", () => {
    const headers = {
      id: "msg_2Lh9fYqFx1example",
      timestamp: "1764280800",
      signature: `v1,bm90LXRoZS1zaWduYXR1cmU= ${signWhopPayload({
        secret: SECRET,
        id: "msg_2Lh9fYqFx1example",
        timestamp: "1764280800",
        body: VECTOR_BODY,
      })}`,
    };
    expect(
      verifyWhopSignature({
        secret: SECRET,
        headers,
        body: VECTOR_BODY,
        nowSeconds: 1764280900,
      }),
    ).toEqual({ valid: true });
    expect(
      verifyWhopSignature({
        secret: SECRET,
        headers,
        body: VECTOR_BODY.replace("pay_fixture", "pay_forged"),
        nowSeconds: 1764280900,
      }),
    ).toEqual({ valid: false, reason: "signature" });
    expect(
      verifyWhopSignature({
        secret: "ws_other",
        headers,
        body: VECTOR_BODY,
        nowSeconds: 1764280900,
      }),
    ).toEqual({ valid: false, reason: "signature" });
    expect(
      verifyWhopSignature({
        secret: SECRET,
        headers,
        body: VECTOR_BODY,
        nowSeconds: 1764280800 + 6 * 60,
      }),
    ).toEqual({ valid: false, reason: "timestamp" });
  });

  it("round-trips the headers through the provider signature string", () => {
    const headers = { id: "msg_1", timestamp: "1", signature: "v1,abc" };
    expect(
      decodeWhopSignatureHeaders(encodeWhopSignatureHeaders(headers)),
    ).toEqual(headers);
    expect(decodeWhopSignatureHeaders("t=1,v1=abc")).toBeNull();
  });
});

describe("Whop webhook mapping", () => {
  it("maps a paid credit pack onto checkout.session.completed", () => {
    const result = mapWhopWebhook(
      envelope("payment.succeeded", {
        id: "pay_pack",
        status: "paid",
        substatus: "succeeded",
        billing_reason: "one_time",
        currency: "eur",
        total: money("10.00", "eur"),
        paid_at: "2026-11-27T22:00:00.000Z",
        created_at: "2026-11-27T21:59:00.000Z",
        membership_id: null,
        checkout_configuration_id: "ch_pack",
        metadata: {
          userId: "user-1",
          type: "credit_pack",
          totalCredits: "1000",
          quantity: "2",
          provider: "WHOP",
        },
      }),
      noRelated,
    );
    expect(result.kind).toBe("event");
    if (result.kind !== "event") {
      return;
    }
    expect(result.event).toMatchObject({
      id: "whop_payment_pay_pack",
      type: "checkout.session.completed",
      data: {
        id: "ch_pack",
        customer: "user-1",
        payment_status: "paid",
        amount_total: 1000,
        currency: "eur",
        payment_intent: "pay_pack",
        metadata: { type: "credit_pack", totalCredits: "1000" },
      },
    });
  });

  it("takes the first plan period from the membership", () => {
    const data = {
      id: "pay_first",
      status: "paid",
      billing_reason: "subscription_create",
      currency: "usd",
      total: money("8.00"),
      membership_id: "mem_1",
      checkout_configuration_id: "ch_plan",
      metadata: {
        userId: "user-1",
        type: "subscription",
        planId: "subscription",
        billingInterval: "MONTHLY",
      },
    };
    const env = envelope("payment.succeeded", data);
    expect(whopRelatedLookups(env)).toEqual({
      membershipId: "mem_1",
      paymentId: null,
    });
    const result = mapWhopWebhook(env, {
      payment: null,
      membership: {
        id: "mem_1",
        status: "active",
        current_period_start: "2026-11-27T22:00:00.000Z",
        current_period_end: "2026-12-27T22:00:00.000Z",
      },
    });
    expect(result.kind === "event" && result.event.data).toMatchObject({
      id: "ch_plan",
      subscription: "mem_1",
      amount_total: 800,
      current_period_start: Date.parse("2026-11-27T22:00:00.000Z") / 1000,
      current_period_end: Date.parse("2026-12-27T22:00:00.000Z") / 1000,
    });
  });

  it("maps a renewal onto invoice.paid with the billed period", () => {
    const result = mapWhopWebhook(
      envelope("payment.succeeded", {
        id: "pay_cycle",
        billing_reason: "subscription_cycle",
        currency: "usd",
        total: money("20.00"),
        paid_at: "2026-12-27T22:00:05.000Z",
        membership_id: "mem_1",
        metadata: { userId: "user-1", type: "subscription" },
      }),
      {
        payment: null,
        membership: {
          id: "mem_1",
          status: "active",
          current_period_start: "2026-12-27T22:00:00.000Z",
          current_period_end: "2027-01-26T22:00:00.000Z",
        },
      },
    );
    expect(result.kind === "event" && result.event).toMatchObject({
      id: "whop_payment_pay_cycle",
      type: "invoice.paid",
      data: {
        id: "pay_cycle",
        subscription: "mem_1",
        status: "paid",
        billing_reason: "subscription_cycle",
        amount_paid: 2000,
        payment_intent: "pay_cycle",
        billingPeriod: {
          start: Date.parse("2026-12-27T22:00:00.000Z") / 1000,
          end: Date.parse("2027-01-26T22:00:00.000Z") / 1000,
        },
      },
    });
  });

  it("falls back to paid_at + interval when the membership has not moved yet", () => {
    const paidAt = "2026-12-27T22:00:05.000Z";
    const result = mapWhopWebhook(
      envelope("payment.succeeded", {
        id: "pay_cycle2",
        billing_reason: "subscription_cycle",
        currency: "usd",
        total: money("88.00"),
        paid_at: paidAt,
        membership_id: "mem_2",
        metadata: { billingInterval: "YEARLY" },
      }),
      noRelated,
    );
    const start = Date.parse(paidAt) / 1000;
    expect(
      result.kind === "event" && result.event.data.billingPeriod,
    ).toEqual({ start, end: start + 365 * 86400 });
  });

  it("maps failed payments: renewal -> past due, first payment -> payment only", () => {
    const renewal = mapWhopWebhook(
      envelope("payment.failed", {
        id: "pay_fail",
        billing_reason: "subscription_cycle",
        membership_id: "mem_1",
      }),
      noRelated,
    );
    expect(renewal.kind === "event" && renewal.event.type).toBe(
      "invoice.payment_failed",
    );
    const first = mapWhopWebhook(
      envelope("payment.failed", {
        id: "pay_fail2",
        billing_reason: "subscription_create",
        membership_id: "mem_9",
      }),
      noRelated,
    );
    expect(first.kind === "event" && first.event.type).toBe(
      "payment_intent.payment_failed",
    );
  });

  it("maps membership.updated onto the provider subscription state", () => {
    const result = mapWhopWebhook(
      envelope("membership.updated", {
        id: "mem_1",
        status: "active",
        cancel_at_period_end: true,
        current_period_start: "2026-11-27T22:00:00.000Z",
        current_period_end: "2026-12-27T22:00:00.000Z",
      }),
      noRelated,
    );
    expect(result.kind === "event" && result.event).toMatchObject({
      type: PROVIDER_SUBSCRIPTION_STATE_EVENT,
      data: { id: "mem_1", status: "active", cancel_at_period_end: true },
    });
  });

  it("maps refunds with the payment's cumulative refunded amount", () => {
    const env = envelope("refund.created", {
      id: "rfnd_1",
      status: "succeeded",
      payment_id: "pay_pack",
      amount: 5,
    });
    expect(whopRelatedLookups(env).paymentId).toBe("pay_pack");
    const result = mapWhopWebhook(env, {
      membership: null,
      payment: {
        id: "pay_pack",
        total: money("10.00"),
        refunded_amount: money("5.00"),
      },
    });
    expect(result.kind === "event" && result.event).toMatchObject({
      id: "whop_refund_rfnd_1",
      type: "charge.refunded",
      data: { payment_intent: "pay_pack", amount: 1000, amount_refunded: 500 },
    });
    const pending = mapWhopWebhook(
      envelope("refund.created", {
        id: "rfnd_2",
        status: "pending",
        payment_id: "pay_pack",
      }),
      noRelated,
    );
    expect(pending.kind).toBe("ignored");
  });

  it("maps disputes: created revokes, won restores, open updates wait", () => {
    const created = mapWhopWebhook(
      envelope("dispute.created", {
        id: "dspt_1",
        status: "needs_response",
        payment: { id: "pay_pack", amount: 10 },
      }),
      noRelated,
    );
    expect(created.kind === "event" && created.event.type).toBe(
      "charge.dispute.created",
    );
    const won = mapWhopWebhook(
      envelope("dispute.updated", {
        id: "dspt_1",
        status: "won",
        payment: { id: "pay_pack", amount: 10 },
      }),
      noRelated,
    );
    expect(won.kind === "event" && won.event).toMatchObject({
      type: "charge.dispute.closed",
      data: { status: "won", payment_intent: "pay_pack" },
    });
    const open = mapWhopWebhook(
      envelope("dispute.updated", {
        id: "dspt_1",
        status: "under_review",
        payment: { id: "pay_pack", amount: 10 },
      }),
      noRelated,
    );
    expect(open.kind).toBe("ignored");
  });

  it("ignores a payment without our checkout metadata", () => {
    const result = mapWhopWebhook(
      envelope("payment.succeeded", {
        id: "pay_link",
        billing_reason: "one_time",
        total: money("5.00"),
      }),
      noRelated,
    );
    expect(result.kind).toBe("ignored");
  });
});

describe("Whop helpers", () => {
  it("reads money objects, numbers and strings as minor units", () => {
    expect(whopMoneyToMinor(money("10.43"))).toBe(1043);
    expect(whopMoneyToMinor(6.9)).toBe(690);
    expect(whopMoneyToMinor("20")).toBe(2000);
    expect(whopMoneyToMinor(null)).toBeNull();
  });

  it("drops the redirect-fulfilment token and Stripe placeholder from the return URL", () => {
    const url = new URL(
      whopRedirectUrl(
        "https://unbottled.ai/en-US/subscription/overview?cbtoken=abc&payment=success&type=subscription&session_id={CHECKOUT_SESSION_ID}",
      ),
    );
    expect(url.searchParams.get("cbtoken")).toBeNull();
    expect(url.searchParams.get("session_id")).toBeNull();
    expect(url.searchParams.get("payment")).toBe("success");
    expect(url.searchParams.get("provider")).toBe("whop");
  });

  it("mirrors the catalog: Starter $8 monthly and every tier and pack have a variant", () => {
    const keys = allWhopVariantSpecs().map((spec) => spec.key);
    expect(keys).toContain(
      whopVariantKey({
        productId: ProductIds.SUBSCRIPTION,
        interval: "month",
        currency: "usd",
        unitAmountMinor: 800,
      }),
    );
    expect(keys).toContain("ub_subscription_year_eur_8800");
    expect(keys).toContain("ub_subscription_ultra_month_pln_75000");
    expect(keys).toContain("ub_credit_pack_one_time_usd_500");
    expect(new Set(keys).size).toBe(keys.length);
  });
});
