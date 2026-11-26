import { describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { defaultVatPeriod, parseVatPeriod, recentVatPeriods } from "./period";
import { buildSkDphReturn, dphLineAmount } from "./sk-dph";
import { buildKvDphXml, kvInvoiceNumber } from "./sk-kvdph";

const XSD = join(import.meta.dir, "fixtures", "kv_dph_2025.xsd");

describe("Slovak DPH return lines", () => {
  const result = buildSkDphReturn(
    [
      { direction: "sales", rate: 0.23, taxableAmount: 800, taxAmount: 184 },
      { direction: "sales", rate: 0.05, taxableAmount: 50, taxAmount: 2.5 },
      { direction: "posSales", rate: 0.19, taxableAmount: 100, taxAmount: 19 },
      { direction: "sales", rate: 0, taxableAmount: 1200, taxAmount: 0 },
      {
        direction: "creditNotes",
        rate: 0.23,
        taxableAmount: -100,
        taxAmount: -23,
      },
      { direction: "purchases", rate: 0.23, taxableAmount: 300, taxAmount: 69 },
      {
        direction: "reverseCharge",
        rate: 0.23,
        taxableAmount: 200,
        taxAmount: 46,
      },
      {
        direction: "nonDeductible",
        rate: 0.23,
        taxableAmount: 10,
        taxAmount: 2.3,
      },
      { direction: "sales", rate: 0.2, taxableAmount: 10, taxAmount: 2 },
    ],
    { euGoods: 400, exports: 0, otherExempt: 0 },
  );

  it("places sales by the 2025 rate buckets", () => {
    expect(dphLineAmount(result, "r03")).toBe(800);
    expect(dphLineAmount(result, "r04")).toBe(184);
    expect(dphLineAmount(result, "r01a")).toBe(50);
    expect(dphLineAmount(result, "r02a")).toBe(2.5);
    expect(dphLineAmount(result, "r01")).toBe(100);
    expect(dphLineAmount(result, "r02")).toBe(19);
  });

  it("books reverse charge as output and input VAT", () => {
    expect(dphLineAmount(result, "r09b")).toBe(200);
    expect(dphLineAmount(result, "r10b")).toBe(46);
    expect(dphLineAmount(result, "r19")).toBe(69 + 46);
    expect(dphLineAmount(result, "r21")).toBe(69);
  });

  it("totals and the payable line", () => {
    expect(dphLineAmount(result, "r14")).toBe(400);
    expect(dphLineAmount(result, "r13")).toBe(400);
    expect(dphLineAmount(result, "r24")).toBe(-100);
    expect(dphLineAmount(result, "r25")).toBe(-23);
    expect(dphLineAmount(result, "r17")).toBe(184 + 2.5 + 19 + 46);
    // 251.5 - 115 - 23 = 113.5
    expect(dphLineAmount(result, "r32")).toBe(113.5);
    expect(dphLineAmount(result, "r33")).toBe(0);
    expect(result.unmapped).toHaveLength(1);
  });

  it("reports an excess deduction", () => {
    const refund = buildSkDphReturn(
      [{ direction: "purchases", rate: 0.23, taxableAmount: 100, taxAmount: 23 }],
      { euGoods: 0, exports: 0, otherExempt: 0 },
    );
    expect(dphLineAmount(refund, "r32")).toBe(0);
    expect(dphLineAmount(refund, "r33")).toBe(23);
  });
});

describe("VAT periods", () => {
  it("parses months and quarters", () => {
    const month = parseVatPeriod("2026-02");
    expect(month?.start.toISOString()).toBe("2026-02-01T00:00:00.000Z");
    expect(month?.end.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    const quarter = parseVatPeriod("2026-Q4");
    expect(quarter?.kv).toEqual({ year: 2026, quarter: 4 });
    expect(quarter?.end.toISOString()).toBe("2027-01-01T00:00:00.000Z");
    expect(parseVatPeriod("2026-13")).toBeNull();
    expect(defaultVatPeriod(new Date("2026-01-10T00:00:00Z"))).toBe("2025-12");
    expect(recentVatPeriods(new Date("2026-11-26T00:00:00Z"), 3)).toEqual([
      "2026-11",
      "2026-Q4",
      "2026-10",
      "2026-09",
      "2026-Q3",
    ]);
  });
});

describe("KV DPH XML", () => {
  const xml = buildKvDphXml({
    identity: {
      vatId: "SK2020273893",
      name: "Demo Slovensko s.r.o. & synovia",
      country: "SK",
      city: "Bratislava",
      postalCode: "81101",
      street: "Hlavná 1",
      email: null,
    },
    period: { year: 2026, month: 10 },
    a1: [
      {
        partnerVatId: "SK2021869234",
        number: "INV 12",
        date: "2026-10-15",
        base: 800,
        tax: 184,
        ratePercent: 23,
      },
    ],
    a2: [],
    b1: [
      {
        partnerVatId: "CZ12345678",
        number: "F-77",
        date: "2026-10-02",
        base: 200,
        tax: 46,
        ratePercent: 23,
        deducted: 46,
      },
    ],
    b2: [
      {
        partnerVatId: "SK2021869234",
        number: "D-1",
        date: "2026-10-03",
        base: 300,
        tax: 69,
        ratePercent: 23,
        deducted: 69,
      },
    ],
    b31: { base: 10, tax: 2.3, deducted: 2.3 },
    c1: [
      {
        partnerVatId: "SK2021869234",
        number: "CN-1",
        originalNumber: "INV-12",
        baseDifference: -100,
        taxDifference: -23,
        ratePercent: 23,
      },
    ],
    c2: [],
    d1: { turnover: 119, base: 0, tax: 0, reducedBase: 100, reducedTax: 19 },
    d2: null,
  });

  it("escapes text and normalizes invoice numbers", () => {
    expect(xml).toContain("Demo Slovensko s.r.o. &amp; synovia");
    expect(xml).toContain('F="INV12"');
    expect(kvInvoiceNumber("x".repeat(40))).toHaveLength(32);
  });

  it("validates against the official KVDPHv25 schema", () => {
    const probe = spawnSync("xmllint", ["--version"]);
    if (probe.status !== 0) {
      return;
    }
    const dir = mkdtempSync(join(tmpdir(), "kvdph-"));
    const file = join(dir, "kv.xml");
    writeFileSync(file, xml);
    const run = spawnSync("xmllint", ["--noout", "--schema", XSD, file], {
      encoding: "utf8",
    });
    expect(run.stderr).toContain("validates");
    expect(run.status).toBe(0);
  });
});
