/**
 * Normalized fiscal receipt data (pure, no DB).
 *
 * Built from a completed POS order and stored as pos_fiscal_receipts.payload.
 * Adapters translate it to their wire format (eKasa XML/JSON of the
 * certified ORP vendor). Amounts are rounded to cents; VAT rates are percent.
 *
 * Content follows zákon 384/2025 Z. z. § 8 ods. 1. TO VERIFY against the eKasa
 * integration spec (v2.7, 2022; reissue for 384/2025 unverified): item types,
 * VAT rate codes, payment type codes, cash rounding to 5 cents (zákon 18/1996
 * § 3 ods. 4) which is not modelled yet.
 */

import { PosPaymentMethod } from "../enum";

export type FiscalPaymentType = "CASH" | "CARD" | "OTHER";

export interface FiscalReceiptItem {
  name: string;
  quantity: number;
  /** Gross unit price (incl. VAT), as printed on the receipt. */
  unitPrice: number;
  /** VAT rate in percent, e.g. 23, 19, 5, 0. */
  vatRate: number;
  /** Gross line total (incl. VAT). */
  lineTotal: number;
  vatAmount: number;
}

export interface FiscalVatSummary {
  vatRate: number;
  base: number;
  vat: number;
}

export interface FiscalReceiptData {
  /** DIČ (companies.taxId). */
  dic: string;
  /** IČO (companies.registrationNumber). */
  ico: string | null;
  /** IČ DPH (companies.vatNumber), null for non payers. */
  icDph: string | null;
  sellerName: string;
  /** kód pokladnice ORP. */
  cashRegisterCode: string;
  /** poradové číslo dokladu. */
  receiptNumber: number;
  /** ISO 8601 timestamp of issue. */
  issuedAt: string;
  orderNumber: string;
  currency: string;
  items: FiscalReceiptItem[];
  /** Always contains the 23/19/5/0 rows plus any other rate used. */
  vatSummary: FiscalVatSummary[];
  total: number;
  payments: { type: FiscalPaymentType; amount: number }[];
}

export interface FiscalOrderInput {
  orderNumber: string;
  currency: string;
  total: number;
}

export interface FiscalOrderItemInput {
  description: string;
  quantity: number;
  /** Net unit price (POS stores net). */
  unitPrice: number;
  /** Fraction, 0.23 = 23 %. */
  taxRate: number;
  taxAmount: number;
  /** Gross line total. */
  lineTotal: number;
}

export interface FiscalPaymentInput {
  /** PosPaymentMethod value. */
  method: string;
  amount: number;
  change: number;
}

export interface FiscalCompanyInput {
  name: string;
  taxId: string | null;
  registrationNumber: string | null;
  vatNumber: string | null;
}

/** Slovak rates printed in the VAT summary even when unused. */
export const SK_SUMMARY_RATES = [23, 19, 5, 0] as const;

function cents(value: number): number {
  return Math.round(Math.round(value * 10_000) / 100);
}

function fromCents(value: number): number {
  return value / 100;
}

function percent(rate: number): number {
  return Math.round(rate * 10_000) / 100;
}

export function fiscalPaymentType(method: string): FiscalPaymentType {
  if (method === PosPaymentMethod.CASH) {
    return "CASH";
  }
  if (method === PosPaymentMethod.CARD) {
    return "CARD";
  }
  return "OTHER";
}

export function buildFiscalReceiptData(input: {
  order: FiscalOrderInput;
  items: readonly FiscalOrderItemInput[];
  payments: readonly FiscalPaymentInput[];
  company: FiscalCompanyInput;
  cashRegisterCode: string;
  receiptNumber: number;
  issuedAt: Date;
}): FiscalReceiptData {
  const summary = new Map<number, { base: number; vat: number }>();
  for (const rate of SK_SUMMARY_RATES) {
    summary.set(rate, { base: 0, vat: 0 });
  }

  const items = input.items.map((item): FiscalReceiptItem => {
    const vatRate = percent(item.taxRate);
    const gross = cents(item.lineTotal);
    const vat = cents(item.taxAmount);
    const row = summary.get(vatRate) ?? { base: 0, vat: 0 };
    row.base += gross - vat;
    row.vat += vat;
    summary.set(vatRate, row);
    const unitGross =
      item.quantity === 0
        ? cents(item.unitPrice * (1 + item.taxRate))
        : Math.round(gross / item.quantity);
    return {
      name: item.description,
      quantity: item.quantity,
      unitPrice: fromCents(unitGross),
      vatRate,
      lineTotal: fromCents(gross),
      vatAmount: fromCents(vat),
    };
  });

  const payments = new Map<FiscalPaymentType, number>();
  for (const payment of input.payments) {
    const type = fiscalPaymentType(payment.method);
    payments.set(
      type,
      (payments.get(type) ?? 0) + cents(payment.amount) - cents(payment.change),
    );
  }

  return {
    dic: input.company.taxId?.trim() ?? "",
    ico: input.company.registrationNumber?.trim() || null,
    icDph: input.company.vatNumber?.trim() || null,
    sellerName: input.company.name,
    cashRegisterCode: input.cashRegisterCode,
    receiptNumber: input.receiptNumber,
    issuedAt: input.issuedAt.toISOString(),
    orderNumber: input.order.orderNumber,
    currency: input.order.currency,
    items,
    vatSummary: [...summary.entries()]
      .toSorted(([a], [b]) => b - a)
      .map(([vatRate, row]) => ({
        vatRate,
        base: fromCents(row.base),
        vat: fromCents(row.vat),
      })),
    total: fromCents(cents(input.order.total)),
    payments: [...payments.entries()]
      .filter(([, amount]) => amount > 0)
      .map(([type, amount]) => ({ type, amount: fromCents(amount) })),
  };
}

/** dd.MM.yyyy HH:mm:ss in Slovak local time (TO VERIFY: eKasa PKP date format). */
export function formatEkasaDateTime(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((entry) => entry.type === type)?.value ?? "00";
  return `${part("day")}.${part("month")}.${part("year")} ${part("hour")}:${part("minute")}:${part("second")}`;
}

/**
 * Input string the ORP signs with the entrepreneur's private key to get the
 * PKP: DIČ|kód pokladnice|poradové číslo dokladu|dátum a čas|celková suma.
 * TO VERIFY: exact field formats (date pattern, decimal separator) in the spec.
 */
export function pkpSigningInput(data: FiscalReceiptData): string {
  return [
    data.dic,
    data.cashRegisterCode,
    String(data.receiptNumber),
    formatEkasaDateTime(data.issuedAt),
    data.total.toFixed(2),
  ].join("|");
}
