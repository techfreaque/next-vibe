import { expect, test } from "bun:test";

import { historyHeader, parseCostHistory } from "./history";

test("keeps stable references, net commitments and unknown settlement facts", () => {
  const text = [
    historyHeader,
    [
      "fixture-1",
      "creator",
      "commitment",
      "",
      "",
      "EUR",
      "",
      "",
      "100.00",
    ].join("\t"),
    ["fixture-2", "referral", "paid", "", "5.10", "PLN", "", "", ""].join("\t"),
  ].join("\n");
  expect(parseCostHistory(text)).toMatchObject([
    { reference: "fixture-1", net: "100.00", currency: "EUR" },
    { reference: "fixture-2", gross: "5.10", evidence: "paid" },
  ]);
  expect(parseCostHistory(text)?.[1]?.date).toBeUndefined();
  expect(parseCostHistory(text + "\n" + text.split("\n")[1])).toBeUndefined();
  expect(parseCostHistory(text.replace("5.10", "5,10"))).toBeUndefined();
});

test("rejects contradictory source values", () => {
  const invalid = [
    "fixture-1",
    "creator",
    "invoice",
    "2026-02-30",
    "5.00",
    "EUR",
    "1.00",
    "INV-1",
    "",
  ].join("\t");
  expect(parseCostHistory(`${historyHeader}\n${invalid}`)).toBeUndefined();
  const invalidTax = invalid
    .replace("2026-02-30", "2026-02-28")
    .replace("1.00", "6.00");
  expect(parseCostHistory(`${historyHeader}\n${invalidTax}`)).toBeUndefined();
});
