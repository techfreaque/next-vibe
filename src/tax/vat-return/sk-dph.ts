/**
 * Slovak VAT return (daňové priznanie k DPH, form DPHv25, valid from
 * 1.7.2025) and control statement (KV DPH, KVDPHv25) builders.
 * Pure functions; amounts in EUR with cents.
 *
 * Line meaning: scratchpad/erp/SLOVAK-COMPLIANCE.md section 4.3.
 * KV schema: https://pfseform.financnasprava.sk/Formulare/eFormVzor/DP/form.607.sk.xsd
 */

export const SK_DPH_LINES = [
  "r01",
  "r02",
  "r01a",
  "r02a",
  "r03",
  "r04",
  "r09",
  "r10",
  "r09a",
  "r10a",
  "r09b",
  "r10b",
  "r13",
  "r14",
  "r15",
  "r17",
  "r18",
  "r18a",
  "r19",
  "r20",
  "r20a",
  "r21",
  "r24",
  "r25",
  "r32",
  "r33",
] as const;
export type SkDphLine = (typeof SK_DPH_LINES)[number];

/** Rate buckets of the 2025 return: 19 % (ods. 2), 5 % (ods. 3), 23 % (standard). */
type RateBucket = "r19" | "r5" | "r23";

function bucket(rate: number | null): RateBucket | null {
  if (rate === null) {
    return null;
  }
  const percent = Math.round(rate * 100);
  if (percent === 19) {
    return "r19";
  }
  if (percent === 5) {
    return "r5";
  }
  if (percent === 23) {
    return "r23";
  }
  return null;
}

export interface VatReportRow {
  direction:
    | "sales"
    | "posSales"
    | "creditNotes"
    | "reverseCharge"
    | "purchases"
    | "nonDeductible";
  rate: number | null;
  taxableAmount: number;
  taxAmount: number;
}

export interface ZeroRatedSales {
  /** § 43 intra-EU supplies of goods (r14). */
  euGoods: number;
  /** §§ 46, 47 exports (r15). */
  exports: number;
  /** Other exempt supplies (part of r13 only). */
  otherExempt: number;
}

export interface SkDphReturn {
  lines: { line: SkDphLine; amount: number }[];
  /** Rows the return could not place (rates outside 23 / 19 / 5 %). */
  unmapped: VatReportRow[];
}

const cents = (value: number): number => Math.round(value * 100);

export function buildSkDphReturn(
  rows: readonly VatReportRow[],
  zeroRated: ZeroRatedSales,
): SkDphReturn {
  const sums = new Map<SkDphLine, number>();
  const add = (line: SkDphLine, amount: number): void => {
    sums.set(line, (sums.get(line) ?? 0) + cents(amount));
  };
  const unmapped: VatReportRow[] = [];
  const outputLines: Record<RateBucket, [SkDphLine, SkDphLine]> = {
    r19: ["r01", "r02"],
    r5: ["r01a", "r02a"],
    r23: ["r03", "r04"],
  };
  const reverseLines: Record<RateBucket, [SkDphLine, SkDphLine]> = {
    r19: ["r09", "r10"],
    r5: ["r09a", "r10a"],
    r23: ["r09b", "r10b"],
  };
  const inputLines: Record<RateBucket, [SkDphLine, SkDphLine]> = {
    r19: ["r18", "r20"],
    r5: ["r18a", "r20a"],
    r23: ["r19", "r21"],
  };

  for (const row of rows) {
    if (row.direction === "nonDeductible") {
      continue;
    }
    if (row.direction === "creditNotes") {
      // § 25 corrections of base and tax (signed, negative for credits).
      if (row.taxAmount !== 0 || row.taxableAmount !== 0) {
        add("r24", row.taxableAmount);
        add("r25", row.taxAmount);
      }
      continue;
    }
    if (
      (row.direction === "sales" || row.direction === "posSales") &&
      row.rate === 0
    ) {
      continue;
    }
    const target = bucket(row.rate);
    if (!target) {
      unmapped.push(row);
      continue;
    }
    if (row.direction === "sales" || row.direction === "posSales") {
      const [base, tax] = outputLines[target];
      add(base, row.taxableAmount);
      add(tax, row.taxAmount);
    } else if (row.direction === "reverseCharge") {
      // Buyer pays the tax (§ 69 ods. 2, 3, 9 to 12) and deducts it.
      const [base, tax] = reverseLines[target];
      add(base, row.taxableAmount);
      add(tax, row.taxAmount);
      add(inputLines[target][0], row.taxAmount);
    } else {
      const [deducted, domestic] = inputLines[target];
      add(deducted, row.taxAmount);
      add(domestic, row.taxAmount);
    }
  }

  add("r14", zeroRated.euGoods);
  add("r15", zeroRated.exports);
  add("r13", zeroRated.euGoods + zeroRated.exports + zeroRated.otherExempt);

  const get = (line: SkDphLine): number => sums.get(line) ?? 0;
  const output =
    get("r02") +
    get("r02a") +
    get("r04") +
    get("r10") +
    get("r10a") +
    get("r10b");
  sums.set("r17", output);
  const result = output - get("r18") - get("r18a") - get("r19") + get("r25");
  sums.set("r32", result > 0 ? result : 0);
  sums.set("r33", result < 0 ? -result : 0);

  const lines = SK_DPH_LINES.map((line) => ({
    line,
    amount: get(line) / 100,
  }));
  return { lines, unmapped };
}

export function dphLineAmount(result: SkDphReturn, line: SkDphLine): number {
  return result.lines.find((entry) => entry.line === line)?.amount ?? 0;
}
