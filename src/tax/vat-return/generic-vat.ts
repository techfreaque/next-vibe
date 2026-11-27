/**
 * Generic country-agnostic VAT return summary by rate.
 * Used for any country without a specialized statutory XML schema so the
 * VAT return tool works for every company worldwide.
 */

import type { CountryFilingLine } from "./de-ustva";
import type { VatReportRow, ZeroRatedSales } from "./sk-dph";

export interface GenericVatResult {
  lines: CountryFilingLine[];
  csv: string;
  csvFileName: string;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function buildGenericVatReturn(
  rows: readonly VatReportRow[],
  zeroRated: ZeroRatedSales & { euServicesReverseCharge: number },
  countryCode: string,
  currency: string,
  periodKey: string,
): GenericVatResult {
  const outputByRate = new Map<number, { base: number; tax: number }>();
  let reverseBase = 0;
  let reverseTax = 0;
  let inputBase = 0;
  let inputTax = 0;

  for (const row of rows) {
    if (row.direction === "nonDeductible") {
      continue;
    }
    const ratePct = row.rate === null ? 0 : Math.round(row.rate * 1000) / 10;
    if (
      row.direction === "sales" ||
      row.direction === "posSales" ||
      row.direction === "creditNotes"
    ) {
      if (ratePct === 0 && row.taxAmount === 0) {
        continue;
      }
      const bucket = outputByRate.get(ratePct) ?? { base: 0, tax: 0 };
      bucket.base += row.taxableAmount;
      bucket.tax += row.taxAmount;
      outputByRate.set(ratePct, bucket);
    } else if (row.direction === "reverseCharge") {
      reverseBase += row.taxableAmount;
      reverseTax += row.taxAmount;
      inputTax += row.taxAmount;
    } else if (row.direction === "purchases") {
      inputBase += row.taxableAmount;
      inputTax += row.taxAmount;
    }
  }

  const lines: CountryFilingLine[] = [];
  let totalOutputTax = 0;
  let totalOutputBase = 0;

  for (const [ratePct, bucket] of [...outputByRate.entries()].toSorted(
    (a, b) => b[0] - a[0],
  )) {
    const base = round2(bucket.base);
    const tax = round2(bucket.tax);
    totalOutputBase += base;
    totalOutputTax += tax;
    lines.push({
      line: `OUT-${ratePct}%`,
      label: `Taxable supplies at ${ratePct}%`,
      base,
      amount: tax,
    });
  }

  const totalExempt = round2(
    zeroRated.euGoods +
      zeroRated.exports +
      zeroRated.otherExempt +
      zeroRated.euServicesReverseCharge,
  );
  if (totalExempt !== 0) {
    lines.push({
      line: "OUT-0%",
      label: "Zero-rated, export and exempt supplies",
      base: totalExempt,
      amount: 0,
    });
  }

  if (reverseTax !== 0 || reverseBase !== 0) {
    totalOutputTax += round2(reverseTax);
    lines.push({
      line: "RC-IN",
      label: "Reverse-charge acquisitions",
      base: round2(reverseBase),
      amount: round2(reverseTax),
    });
  }

  lines.push({
    line: "OUT-TOT",
    label: "Total output VAT",
    base: round2(totalOutputBase + totalExempt),
    amount: round2(totalOutputTax),
    isTotal: true,
  });

  lines.push({
    line: "IN-VAT",
    label: "Deductible input VAT",
    base: round2(inputBase),
    amount: round2(inputTax),
  });

  const netPayable = round2(totalOutputTax - inputTax);
  lines.push({
    line: "NET-VAT",
    label: netPayable >= 0 ? "Net VAT payable" : "Net VAT refundable",
    amount: netPayable,
    isTotal: true,
  });

  const csv = [
    `code;description;base_${currency};vat_${currency}`,
    ...lines.map(
      (l) =>
        `${csvCell(l.line)};${csvCell(l.label)};${l.base !== undefined ? l.base.toFixed(2) : ""};${l.amount.toFixed(2)}`,
    ),
  ].join("\n");

  const code = (countryCode || "XX").toUpperCase();
  return {
    lines,
    csv,
    csvFileName: `VAT_Return_${code}_${periodKey}.csv`,
  };
}
