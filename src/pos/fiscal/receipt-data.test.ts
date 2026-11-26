import { describe, expect, it } from "bun:test";

import { PosPaymentMethod } from "../enum";
import {
  buildFiscalReceiptData,
  formatEkasaDateTime,
  pkpSigningInput,
} from "./receipt-data";

const company = {
  name: "Kaviareň s.r.o.",
  taxId: "2020123456",
  registrationNumber: "12345678",
  vatNumber: "SK2020123456",
};

function build(): ReturnType<typeof buildFiscalReceiptData> {
  return buildFiscalReceiptData({
    order: { orderNumber: "POS-0001", currency: "EUR", total: 17.3 },
    items: [
      // 2 x 5.00 net at 23 %: gross 12.30, VAT 2.30
      {
        description: "Káva",
        quantity: 2,
        unitPrice: 5,
        taxRate: 0.23,
        taxAmount: 2.3,
        lineTotal: 12.3,
      },
      // 1 x 4.2017 net at 19 %: gross 5.00, VAT 0.80 (four-place POS values)
      {
        description: "Koláč",
        quantity: 1,
        unitPrice: 4.2017,
        taxRate: 0.19,
        taxAmount: 0.7983,
        lineTotal: 5,
      },
    ],
    payments: [
      { method: PosPaymentMethod.CASH, amount: 20, change: 5 },
      { method: PosPaymentMethod.CARD, amount: 2.3, change: 0 },
      { method: PosPaymentMethod.TRANSFER, amount: 0, change: 0 },
    ],
    company,
    cashRegisterCode: "88812345678900001",
    receiptNumber: 7,
    issuedAt: new Date("2026-07-01T08:00:00.000Z"),
  });
}

describe("buildFiscalReceiptData", () => {
  it("maps company identifiers and receipt header", () => {
    const data = build();
    expect(data.dic).toBe("2020123456");
    expect(data.ico).toBe("12345678");
    expect(data.icDph).toBe("SK2020123456");
    expect(data.cashRegisterCode).toBe("88812345678900001");
    expect(data.receiptNumber).toBe(7);
    expect(data.issuedAt).toBe("2026-07-01T08:00:00.000Z");
    expect(data.total).toBe(17.3);
  });

  it("prints gross items with percent rates", () => {
    const [coffee, cake] = build().items;
    expect(coffee).toEqual({
      name: "Káva",
      quantity: 2,
      unitPrice: 6.15,
      vatRate: 23,
      lineTotal: 12.3,
      vatAmount: 2.3,
    });
    expect(cake?.vatRate).toBe(19);
    expect(cake?.vatAmount).toBe(0.8);
    expect(cake?.lineTotal).toBe(5);
  });

  it("summarizes VAT for 23/19/5/0 even when unused", () => {
    expect(build().vatSummary).toEqual([
      { vatRate: 23, base: 10, vat: 2.3 },
      { vatRate: 19, base: 4.2, vat: 0.8 },
      { vatRate: 5, base: 0, vat: 0 },
      { vatRate: 0, base: 0, vat: 0 },
    ]);
  });

  it("nets change from cash and maps payment types", () => {
    expect(build().payments).toEqual([
      { type: "CASH", amount: 15 },
      { type: "CARD", amount: 2.3 },
    ]);
  });

  it("keeps null identifiers for non payers", () => {
    const data = buildFiscalReceiptData({
      order: { orderNumber: "X", currency: "EUR", total: 0 },
      items: [],
      payments: [],
      company: { ...company, vatNumber: null, registrationNumber: " " },
      cashRegisterCode: "1",
      receiptNumber: 1,
      issuedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(data.icDph).toBeNull();
    expect(data.ico).toBeNull();
  });
});

describe("PKP signing input", () => {
  it("formats Slovak local time", () => {
    // CEST in July: UTC+2
    expect(formatEkasaDateTime("2026-07-01T08:00:00.000Z")).toBe(
      "01.07.2026 10:00:00",
    );
  });

  it("joins DIČ|code|number|date|total", () => {
    expect(pkpSigningInput(build())).toBe(
      "2020123456|88812345678900001|7|01.07.2026 10:00:00|17.30",
    );
  });
});
