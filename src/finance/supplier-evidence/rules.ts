import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { z } from "zod";

import { ProviderSources } from "../enum";

export const operationValues = [
  "bind",
  "bill",
  "fund",
  "fundBill",
  "consume",
  "paid",
  "sponsorship",
  "referral",
  "processorFee",
] as const;

export const areaValues = [
  "provider",
  "processor",
  "sponsorship",
  "referral",
  "supplier",
  "unallocated",
] as const;
export const evidenceMonth = z
  .string()
  .regex(/^(?!0000)\d{4}-(0[1-9]|1[0-2])$/);

export const evidenceCurrencies = z.enum(CurrenciesArr);
export const evidenceProvider = z.enum(ProviderSources);

export function parseEvidenceAmount(value: string): number | null {
  if (!/^\d{1,8}(?:\.\d{1,4})?$/.test(value)) {
    return null;
  }
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 10_000 + Number(fraction.padEnd(4, "0"));
}

export function evidenceDay(value: string): Date | null {
  if (!/^(?!0000)\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const day = new Date(value);
  return Number.isFinite(day.getTime()) &&
    day.toISOString().slice(0, 10) === value
    ? day
    : null;
}

/** Bill amounts are confirmed gross and tax. Journal-only evidence is net. */
export function evidenceAmounts(
  gross: string,
  tax: string,
  allowsTax: boolean,
): { gross: number; tax: number; net: number } | null {
  const grossUnits = parseEvidenceAmount(gross);
  const taxUnits = parseEvidenceAmount(tax);
  if (
    !grossUnits ||
    taxUnits === null ||
    taxUnits >= grossUnits ||
    (!allowsTax && taxUnits > 0)
  ) {
    return null;
  }
  return {
    gross: grossUnits / 10_000,
    tax: taxUnits / 10_000,
    net: (grossUnits - taxUnits) / 10_000,
  };
}
