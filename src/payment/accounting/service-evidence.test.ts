import { expect, test } from "bun:test";

import { PaymentProvider } from "../enum";
import { readVerifiedAccountingEvidence } from "./evidence";

const start = 1_800_000_000;
const end = start + 259_200;

const invoice = {
  id: "in_service_fixture",
  status: "paid",
  billing_reason: "subscription_cycle",
  currency: "eur",
  total: 121,
  amount_due: 121,
  amount_paid: 121,
  amount_remaining: 0,
  total_excluding_tax: 101,
  starting_balance: 0,
  pre_payment_credit_notes_amount: 0,
  post_payment_credit_notes_amount: 0,
  status_transitions: { paid_at: start },
  total_taxes: [{ amount: 20 }],
  lines: {
    has_more: false,
    data: [
      {
        amount: 101,
        currency: "eur",
        period: { start, end },
        parent: {
          type: "subscription_item_details",
          subscription_item_details: {
            proration: false,
            subscription: "sub_fixture",
          },
        },
        pricing: { price_details: { price: "price_fixture" } },
      },
    ],
  },
};

function read(
  data: typeof invoice,
): ReturnType<typeof readVerifiedAccountingEvidence> {
  return readVerifiedAccountingEvidence(
    JSON.stringify({
      livemode: false,
      account: "acct_fixture",
      type: "invoice.paid",
      created: start,
      data: { object: data },
    }),
    PaymentProvider.STRIPE,
    "fixture",
  );
}

test("captures explicit recurring Stripe service dates and native allocated net", () => {
  expect(read(invoice)).toMatchObject({
    currency: "EUR",
    grossMinor: 121,
    taxMinor: 20,
    serviceNetMinor: 101,
    servicePeriodStart: new Date(start * 1000),
    servicePeriodEnd: new Date(end * 1000),
  });
});

test("does not infer service allocation for proration, credits or contradictory native amounts", () => {
  const [line] = invoice.lines.data;
  if (!line) return;
  expect(
    read({ ...invoice, starting_balance: -10 })?.serviceNetMinor,
  ).toBeUndefined();
  expect(
    read({ ...invoice, total_excluding_tax: 104 })?.serviceNetMinor,
  ).toBeUndefined();
  expect(
    read({ ...invoice, billing_reason: "subscription_update" })
      ?.serviceNetMinor,
  ).toBeUndefined();
  expect(
    read({
      ...invoice,
      lines: { ...invoice.lines, data: [{ ...line, currency: "usd" }] },
    })?.serviceNetMinor,
  ).toBeUndefined();
  expect(
    read({
      ...invoice,
      lines: {
        ...invoice.lines,
        data: [
          {
            ...line,
            parent: {
              ...line.parent,
              subscription_item_details: {
                ...line.parent.subscription_item_details,
                proration: true,
              },
            },
          },
        ],
      },
    })?.serviceNetMinor,
  ).toBeUndefined();
});
