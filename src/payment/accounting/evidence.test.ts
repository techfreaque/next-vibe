import { expect, it } from "bun:test";

import { PaymentProvider } from "../enum";
import {
  merchantCredentialId,
  readVerifiedAccountingEvidence,
} from "./evidence";

const date = "2026-11-25T12:00:00.000Z";
const nowPayment = {
  payment_status: "finished",
  invoice_id: "local-invoice",
  payment_id: "external-payment",
  updated_at: date,
  price_currency: "eur",
  pay_currency: "eur",
  outcome_currency: "eur",
  price_amount: "12.34",
  actually_paid: "12.34",
  outcome_amount: "12.02",
};

it("retains native NOWPayments amounts with an explicit credential identity and absent tax and fee", () => {
  const merchant = merchantCredentialId("fixture-one");
  expect(merchant).not.toEqual(merchantCredentialId("fixture-two"));
  expect(
    readVerifiedAccountingEvidence(
      JSON.stringify(nowPayment),
      PaymentProvider.NOWPAYMENTS,
      merchant,
      "offer-fixture",
    ),
  ).toMatchObject({
    provider: PaymentProvider.NOWPAYMENTS,
    merchantId: merchant,
    currency: "EUR",
    grossMinor: 1234,
    sourceKind: "sale",
    externalId: "external-payment",
    sourceDate: new Date(date),
  });
  const read = (body: typeof nowPayment) =>
    readVerifiedAccountingEvidence(
      JSON.stringify(body),
      PaymentProvider.NOWPAYMENTS,
      merchant,
      "offer-fixture",
    );
  expect(read(nowPayment)?.feeMinor).toBeUndefined();
  expect(read(nowPayment)?.taxMinor).toBeUndefined();
  expect(read({ ...nowPayment, actually_paid: "12.33" })).toBeUndefined();
  expect(read({ ...nowPayment, outcome_currency: "usdt" })).toBeUndefined();
  expect(read({ ...nowPayment, price_amount: "12.342" })).toBeUndefined();
  expect(read({ ...nowPayment, payment_status: "waiting" })).toBeUndefined();
});

it("uses a signed Stripe account and keeps paid, refund and fee identities separate", () => {
  const read = (
    type: string,
    object: Record<
      string,
      string | number | boolean | { [key: string]: string | number }
    >,
  ) =>
    readVerifiedAccountingEvidence(
      JSON.stringify({
        livemode: false,
        account: "acct_fixture",
        type,
        created: 1795608000,
        data: { object },
      }),
      PaymentProvider.STRIPE,
      "different-platform",
    );
  expect(
    read("checkout.session.completed", {
      id: "cs_test_fixture",
      mode: "payment",
      payment_status: "paid",
      currency: "eur",
      payment_intent: "pi_fixture",
      amount_total: 1234,
      total_details: { amount_tax: 234 },
      metadata: { providerPriceId: "price_fixture" },
    }),
  ).toMatchObject({
    merchantId: "test:acct_fixture",
    sourceKind: "sale",
    externalId: "pi_fixture",
    taxMinor: 234,
  });
  expect(
    read("refund.updated", {
      id: "re_fixture",
      status: "succeeded",
      amount: 1234,
      currency: "eur",
      payment_intent: "pi_fixture",
      created: 1795608000,
    }),
  ).toMatchObject({
    sourceKind: "refund",
    externalId: "re_fixture",
    paymentIntentId: "pi_fixture",
  });
  expect(
    read("charge.succeeded", {
      paid: true,
      captured: true,
      amount_captured: 1234,
      currency: "eur",
      payment_intent: "pi_fixture",
      balance_transaction: {
        id: "txn_fixture",
        fee: 52,
        net: 1182,
        amount: 1234,
        currency: "eur",
        created: 1795608000,
      },
    }),
  ).toMatchObject({
    sourceKind: "fee",
    externalId: "txn_fixture",
    feeMinor: 52,
  });
  expect(
    read("charge.succeeded", {
      paid: true,
      captured: true,
      amount_captured: 1234,
      currency: "eur",
      payment_intent: "pi_fixture",
      balance_transaction: {
        id: "txn_bad",
        fee: 52,
        net: 1182,
        amount: 1234,
        currency: "usd",
        created: 1795608000,
      },
    }),
  ).toBeUndefined();
});

it("accepts explicit native tax only for a fully allocated signed credit note", () => {
  const note = {
    status: "issued",
    invoice: "in_fixture",
    currency: "eur",
    amount: 600,
    total: 600,
    pre_payment_amount: 0,
    post_payment_amount: 600,
    out_of_band_amount: null,
    customer_balance_transaction: null,
    total_taxes: [{ amount: 100 }],
    refunds: [
      {
        type: "refund",
        amount_refunded: 600,
        refund: {
          id: "re_fixture",
          currency: "eur",
          status: "succeeded",
          amount: 600,
          created: 1795608000,
          payment_intent: "pi_fixture",
        },
      },
    ],
  };
  const read = (object: typeof note) =>
    readVerifiedAccountingEvidence(
      JSON.stringify({
        livemode: false,
        account: "acct_fixture",
        type: "credit_note.created",
        created: 1795608000,
        data: { object },
      }),
      PaymentProvider.STRIPE,
      "different-platform",
    );
  expect(read(note)).toMatchObject({
    sourceKind: "refund",
    externalId: "re_fixture",
    invoiceReference: "in_fixture",
    grossMinor: 600,
    taxMinor: 100,
  });
  expect(
    read({ ...note, out_of_band_amount: null, post_payment_amount: 700 }),
  ).toBeUndefined();
  expect(read({ ...note, total_taxes: [{ amount: 601 }] })).toBeUndefined();
});
