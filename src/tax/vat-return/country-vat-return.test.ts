import { describe, expect, it } from "bun:test";

import { buildAtUva } from "./at-uva";
import { buildDeUstva, buildSmallBusinessEurSummary, elsterZeitraum } from "./de-ustva";
import { buildGenericVatReturn } from "./generic-vat";

describe("German UStVA and § 19 Kleinunternehmer EÜR", () => {
  it("computes UStVA Kennzahlen, ELSTER XML and CSV", () => {
    expect(elsterZeitraum({ year: 2026, month: 11 })).toBe("11");
    expect(elsterZeitraum({ year: 2026, quarter: 4 })).toBe("44");

    const res = buildDeUstva(
      [
        { direction: "sales", rate: 0.19, taxableAmount: 1000.9, taxAmount: 190.17 },
        { direction: "sales", rate: 0.07, taxableAmount: 200, taxAmount: 14 },
        { direction: "purchases", rate: 0.19, taxableAmount: 300, taxAmount: 57 },
        { direction: "reverseCharge", rate: 0.19, taxableAmount: 100, taxAmount: 19 },
      ],
      { euGoods: 500, exports: 250, otherExempt: 0, euServicesReverseCharge: 400 },
      {
        companyName: "Muster GmbH",
        steuernummer: "12/345/67890",
        vatId: "DE123456789",
        street: "Hauptstrasse 1",
        postalCode: "10115",
        city: "Berlin",
        email: "tax@muster.de",
      },
      { year: 2026, month: 11 },
      "2026-11",
    );

    const byLine = new Map(res.lines.map((l) => [l.line, l]));
    expect(byLine.get("Kz 81")?.base).toBe(1000);
    expect(byLine.get("Kz 81")?.amount).toBe(190.17);
    expect(byLine.get("Kz 86")?.base).toBe(200);
    expect(byLine.get("Kz 86")?.amount).toBe(14);
    expect(byLine.get("Kz 41")?.base).toBe(500);
    expect(byLine.get("Kz 43")?.base).toBe(250);
    expect(byLine.get("Kz 45")?.base).toBe(400);
    expect(byLine.get("Kz 66")?.amount).toBe(57);
    expect(byLine.get("Kz 67")?.amount).toBe(19);
    // Output: 190.17 + 14 + 19 = 223.17; Input: 57 + 19 = 76; Net: 147.17
    expect(byLine.get("Kz 83")?.amount).toBe(147.17);
    expect(res.missingSteuernummer).toBe(false);
    expect(res.elsterXml).toContain('<Anmeldungssteuern art="UStVA"');
    expect(res.elsterXml).toContain("<Kz81>1000</Kz81>");
    expect(res.elsterXml).toContain("<Kz83>147.17</Kz83>");
    expect(res.csv).toContain("Kz 81");
  });

  it("builds § 19 UStG EÜR summary with revenue, expenses and net surplus", () => {
    const eur = buildSmallBusinessEurSummary(
      [
        { code: "8195", name: "Erlöse Kleinunternehmer § 19 UStG", kind: "revenue", amount: 4200 },
        { code: "4980", name: "Betriebsbedarf", kind: "expense", amount: 850 },
        { code: "4970", name: "Nebenkosten des Geldverkehrs", kind: "expense", amount: 50 },
      ],
      "2026-11",
      "DE",
    );
    expect(eur.totalRevenue).toBe(4200);
    expect(eur.totalExpenses).toBe(900);
    expect(eur.netSurplus).toBe(3300);
    expect(eur.csv).toContain("EÜR-G");
    expect(eur.csvFileName).toBe("EUR_Summary_DE_2026-11.csv");
  });
});

describe("Austrian UVA (U30)", () => {
  it("computes Austrian U30 Kennzahlen and FinanzOnline XML", () => {
    const res = buildAtUva(
      [
        { direction: "sales", rate: 0.2, taxableAmount: 1000, taxAmount: 200 },
        { direction: "sales", rate: 0.1, taxableAmount: 300, taxAmount: 30 },
        { direction: "purchases", rate: 0.2, taxableAmount: 400, taxAmount: 80 },
      ],
      { euGoods: 200, exports: 0, otherExempt: 0, euServicesReverseCharge: 0 },
      { companyName: "Alpen GmbH", taxId: "12-345/6789", vatId: "ATU12345678" },
      { year: 2026, quarter: 4 },
      "2026-Q4",
    );
    const byLine = new Map(res.lines.map((l) => [l.line, l]));
    expect(byLine.get("Kz 000")?.base).toBe(1500);
    expect(byLine.get("Kz 022")?.amount).toBe(200);
    expect(byLine.get("Kz 029")?.amount).toBe(30);
    expect(byLine.get("Kz 060")?.amount).toBe(80);
    expect(byLine.get("Kz 095")?.amount).toBe(150);
    expect(res.missingVatId).toBe(false);
    expect(res.xml).toContain('<ERKLAERUNG art="U30">');
    expect(res.xml).toContain("<KZ095>150.00</KZ095>");
  });
});

describe("Generic country VAT return", () => {
  it("groups output VAT by rate and computes net VAT payable", () => {
    const res = buildGenericVatReturn(
      [
        { direction: "sales", rate: 0.21, taxableAmount: 500, taxAmount: 105 },
        { direction: "purchases", rate: 0.21, taxableAmount: 200, taxAmount: 42 },
      ],
      { euGoods: 0, exports: 100, otherExempt: 0, euServicesReverseCharge: 0 },
      "NL",
      "EUR",
      "2026-11",
    );
    const byLine = new Map(res.lines.map((l) => [l.line, l]));
    expect(byLine.get("OUT-21%")?.amount).toBe(105);
    expect(byLine.get("IN-VAT")?.amount).toBe(42);
    expect(byLine.get("NET-VAT")?.amount).toBe(63);
    expect(res.csvFileName).toBe("VAT_Return_NL_2026-11.csv");
  });
});
