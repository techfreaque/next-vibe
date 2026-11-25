import { describe, expect, it } from "bun:test";

import { LineType } from "../enum";
import { validateJournalLines } from "../shared/journal-validation";

const debit = (amount: number, currency = "EUR") => ({
  type: LineType.DEBIT,
  amount,
  currency,
});
const credit = (amount: number, currency = "EUR") => ({
  type: LineType.CREDIT,
  amount,
  currency,
});

describe("journal entry validation", () => {
  it("balances decimal amounts at the storage precision", () => {
    expect(
      validateJournalLines([debit(0.1), debit(0.2), credit(0.3)], "EUR"),
    ).toBeNull();
    expect(
      validateJournalLines(
        [debit(9_999_999_999.9999), credit(9_999_999_999.9999)],
        "EUR",
      ),
    ).toBeNull();
    expect(validateJournalLines([debit(0.3), credit(0.3001)], "EUR")).toBe(
      "balance",
    );
    expect(validateJournalLines([debit(2), debit(2)], "EUR")).toBe("balance");
  });

  it("requires two lines with valid sides and positive representable amounts", () => {
    expect(validateJournalLines([debit(1)], "EUR")).toBe("empty");
    expect(
      validateJournalLines([debit(1), { ...credit(1), type: "Other" }], "EUR"),
    ).toBe("line");
    expect(
      validateJournalLines(
        [
          { ...debit(1), type: "DEBIT" },
          { ...credit(1), type: "CREDIT" },
        ],
        "EUR",
      ),
    ).toBeNull();
    for (const amount of [
      0,
      -1,
      0.00005,
      10_000_000_000,
      Number.NaN,
      Infinity,
    ]) {
      expect(validateJournalLines([debit(amount), credit(amount)], "EUR")).toBe(
        "line",
      );
    }
  });

  it("requires company currency", () => {
    expect(validateJournalLines([debit(1), credit(1, "USD")], "EUR")).toBe(
      "currency",
    );
    expect(
      validateJournalLines([debit(1, "USD"), credit(1, "USD")], "EUR"),
    ).toBe("currency");
    expect(
      validateJournalLines([debit(1, "USD"), credit(1, "USD")], "USD"),
    ).toBeNull();
  });
});
