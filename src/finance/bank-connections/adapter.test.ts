import { describe, expect, it } from "bun:test";

import { type BankFeedAdapter, collectBankWindow } from "./adapter";

const period = { from: "2026-01-01", to: "2026-01-31" };
const line = {
  transactionId: "fixture-1",
  bookedDate: "2026-01-14",
  amount: "-12.3000",
  currency: "EUR",
};
describe("bank feed windows", () => {
  it("retains the booked and original amounts across pages", async () => {
    const pages: BankFeedAdapter = {
      readPage: async (_window, cursor) =>
        cursor === null
          ? { success: true, data: { rows: [line], next: "page-two" } }
          : {
              success: true,
              data: {
                rows: [
                  {
                    ...line,
                    transactionId: "fixture-2",
                    nativeAmount: "-14.0000",
                    nativeCurrency: "USD",
                  },
                ],
                next: null,
              },
            },
    };
    expect(await collectBankWindow(pages, period)).toEqual({
      success: true,
      data: [
        line,
        {
          ...line,
          transactionId: "fixture-2",
          nativeAmount: "-14.0000",
          nativeCurrency: "USD",
        },
      ],
    });
  });
  it("withholds partial windows on a repeated cursor, out-of-range date, or expired consent", async () => {
    expect(
      await collectBankWindow(
        {
          readPage: async () => ({
            success: true,
            data: { rows: [line], next: "same" },
          }),
        },
        period,
      ),
    ).toEqual({ success: false, reason: "invalidResponse" });
    expect(
      await collectBankWindow(
        {
          readPage: async () => ({
            success: true,
            data: { rows: [{ ...line, bookedDate: "2025-12-31" }], next: null },
          }),
        },
        period,
      ),
    ).toEqual({ success: false, reason: "invalidResponse" });
    expect(
      await collectBankWindow(
        {
          readPage: async (_window, cursor) =>
            cursor === null
              ? { success: true, data: { rows: [line], next: "p2" } }
              : { success: false, reason: "consent" },
        },
        period,
      ),
    ).toEqual({ success: false, reason: "consent" });
  });
});

describe("incremental bank windows", () => {
  it("backfills in bounded months and revisits recent booking days without crossing the configured start", async () => {
    const { nextBankWindow } = await import("./window");
    expect(nextBankWindow("2024-02-01", undefined, "2024-04-12")).toEqual({
      from: "2024-02-01",
      to: "2024-03-01",
    });
    expect(nextBankWindow("2024-02-01", "2024-02-02", "2024-02-03")).toEqual({
      from: "2024-02-01",
      to: "2024-02-03",
    });
    expect(nextBankWindow("2024-02-01", "2024-03-01", "2024-04-12")).toEqual({
      from: "2024-02-24",
      to: "2024-03-24",
    });
    expect(nextBankWindow("2024-05-01", undefined, "2024-04-12")).toBeNull();
  });
});
