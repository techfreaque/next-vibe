import { describe, expect, it } from "vitest";

import { planBankMatch } from "../reconciliation-plan";

const base = {
  booked: "98.0000",
  carrying: "100.0000",
  currency: "EUR",
  bookedDate: "2026-11-25",
  carryingDate: new Date("2026-11-24T14:00:00.000Z"),
  document: { currency: "EUR", amount: "100.00" },
  settings: {
    bookedCurrency: "EUR",
    foreignCurrency: "USD",
    maxFxDifference: "4.0000",
    maxFxBps: 300,
    maxDateDistanceDays: 7,
    gainAccountId: "gain",
    lossAccountId: "loss",
    feeAccountId: "fee",
  },
};

describe("bank reconciliation adjustments", () => {
  it("does not turn a same-currency short payment into FX gain or loss", () => {
    expect(planBankMatch(base)).toBeNull();
    expect(
      planBankMatch({ ...base, feeAmount: "-1.0000", feeCurrency: "EUR" }),
    ).toBeNull();
    expect(
      planBankMatch({ ...base, feeAmount: "-2.0000", feeCurrency: "USD" }),
    ).toBeNull();
    expect(
      planBankMatch({ ...base, feeAmount: "-2.0000", feeCurrency: "EUR" }),
    ).toEqual({ kind: "fee", fee: BigInt(-20_000), fx: BigInt(0) });
  });

  it("isolates the fee from FX and requires a configured foreign currency pair", () => {
    const foreign = {
      ...base,
      booked: "101.2500",
      document: { currency: "USD", amount: "120.00" },
      nativeAmount: "120.0000",
      nativeCurrency: "USD",
      feeAmount: "-0.2500",
      feeCurrency: "EUR",
    };
    expect(planBankMatch(foreign)).toEqual({
      kind: "fx",
      fee: BigInt(-2500),
      fx: BigInt(15_000),
    });
    expect(planBankMatch({ ...foreign, nativeAmount: "119.0000" })).toBeNull();
    expect(planBankMatch({ ...foreign, booked: "103.1000" })).toBeNull();
    expect(planBankMatch({ ...foreign, bookedDate: "2026-12-02" })).toBeNull();
  });

  it("uses the posted carrying leg when the foreign original pair is unavailable", () => {
    expect(
      planBankMatch({
        ...base,
        carrying: "-100.0000",
        booked: "-101.1000",
        document: { currency: "USD", amount: "103.50" },
      }),
    ).toEqual({ kind: "fx", fee: BigInt(0), fx: BigInt(-11_000) });
    expect(
      planBankMatch({
        ...base,
        carrying: "-100.0000",
        booked: "101.1000",
        document: { currency: "USD", amount: "103.50" },
      }),
    ).toBeNull();
  });
});
