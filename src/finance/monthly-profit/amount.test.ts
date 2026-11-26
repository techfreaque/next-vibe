import { describe, expect, it } from "vitest";

import {
  ledgerAmountTotal,
  ledgerDecimalUnits,
  ledgerUnitsDecimal,
} from "./amount";

describe("monthly profit ledger aggregation", () => {
  it("retains precision for large and signed totals", () => {
    const rows = [
      { amount: "10000000000000.0007" },
      { amount: "-10000000000000.0004" },
      { amount: "-0.0027" },
    ];
    expect(ledgerUnitsDecimal(ledgerAmountTotal(rows))).toBe("-0.0024");
    expect(ledgerUnitsDecimal(ledgerDecimalUnits("125"))).toBe("125.0000");
  });
});
