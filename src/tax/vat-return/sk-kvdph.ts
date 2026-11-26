/**
 * Kontrolný výkaz DPH (KVDPHv25, § 78a zákona o DPH) XML builder.
 * Schema: https://pfseform.financnasprava.sk/Formulare/eFormVzor/DP/form.607.sk.xsd
 * (targetNamespace https://ekr.financnasprava.sk/Formulare/XSD/kv_dph_2025.xsd).
 */

export const KV_DPH_NAMESPACE =
  "https://ekr.financnasprava.sk/Formulare/XSD/kv_dph_2025.xsd";

export interface KvPeriod {
  year: number;
  month?: number;
  quarter?: number;
}

export interface KvIdentity {
  vatId: string;
  name: string;
  country: string;
  city: string;
  postalCode: string | null;
  street: string | null;
  email: string | null;
}

/** One invoice and rate (A.1, B.2) or one reverse charge invoice (B.1). */
export interface KvInvoiceRow {
  partnerVatId: string | null;
  number: string;
  /** Supply date (ISO day). */
  date: string;
  base: number;
  tax: number;
  ratePercent: number;
  /** Deducted VAT (B sections). */
  deducted?: number;
}

/** A.2 issued domestic reverse charge invoice. */
export interface KvReverseChargeIssued {
  partnerVatId: string;
  number: string;
  date: string;
  base: number;
}

/** C.1 / C.2 corrective invoice. */
export interface KvCorrectionRow {
  partnerVatId: string | null;
  originalNumber: string;
  number: string;
  baseDifference: number;
  taxDifference: number;
  ratePercent: number;
  /** C.2 deducted VAT difference. */
  deductedDifference?: number;
}

/** D.1 / D.2 totals: standard rate and reduced rates. */
export interface KvTotals {
  turnover?: number;
  base: number;
  tax: number;
  reducedBase: number;
  reducedTax: number;
}

export interface KvDphInput {
  identity: KvIdentity;
  period: KvPeriod;
  a1: KvInvoiceRow[];
  a2: KvReverseChargeIssued[];
  b1: KvInvoiceRow[];
  b2: KvInvoiceRow[];
  /** B.3.1 simplified invoices received, totals. */
  b31: { base: number; tax: number; deducted: number } | null;
  c1: KvCorrectionRow[];
  c2: KvCorrectionRow[];
  d1: KvTotals | null;
  d2: KvTotals | null;
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const money = (value: number): string =>
  (Math.round(value * 100) / 100).toFixed(2);

/** Invoice numbers must match \S{1,32}. */
export function kvInvoiceNumber(value: string): string {
  return value.replace(/\s+/g, "").slice(0, 32) || "-";
}

function attributes(
  values: Record<string, string | number | null | undefined>,
): string {
  return Object.entries(values)
    .filter(
      (entry): entry is [string, string | number] =>
        entry[1] !== null && entry[1] !== undefined && entry[1] !== "",
    )
    .map(([key, value]) => ` ${key}="${escapeXml(String(value))}"`)
    .join("");
}

function element(
  name: string,
  value: string | null | undefined,
  indent: string,
): string {
  return value ? `${indent}<${name}>${escapeXml(value)}</${name}>\n` : "";
}

export function buildKvDphXml(input: KvDphInput): string {
  const { identity, period } = input;
  const lines: string[] = [];
  const row = (
    name: string,
    values: Record<string, string | number | null | undefined>,
  ): void => {
    lines.push(`    <${name}${attributes(values)}/>`);
  };
  for (const item of input.a1) {
    row("A1", {
      Odb: item.partnerVatId,
      F: kvInvoiceNumber(item.number),
      Den: item.date,
      Z: money(item.base),
      D: money(item.tax),
      S: item.ratePercent,
    });
  }
  for (const item of input.a2) {
    row("A2", {
      Odb: item.partnerVatId,
      F: kvInvoiceNumber(item.number),
      Den: item.date,
      Z: money(item.base),
    });
  }
  for (const item of input.b1) {
    row("B1", {
      Dod: item.partnerVatId,
      F: kvInvoiceNumber(item.number),
      Den: item.date,
      Z: money(item.base),
      D: money(item.tax),
      S: item.ratePercent,
      O: money(item.deducted ?? 0),
    });
  }
  for (const item of input.b2) {
    row("B2", {
      Dod: item.partnerVatId,
      F: kvInvoiceNumber(item.number),
      Den: item.date,
      Z: money(item.base),
      D: money(item.tax),
      S: item.ratePercent,
      O: money(item.deducted ?? 0),
    });
  }
  if (input.b31) {
    row("B31", {
      Z: money(input.b31.base),
      D: money(input.b31.tax),
      O: money(input.b31.deducted),
    });
  }
  for (const item of input.c1) {
    row("C1", {
      Odb: item.partnerVatId,
      FO: kvInvoiceNumber(item.number),
      FP: kvInvoiceNumber(item.originalNumber),
      ZR: money(item.baseDifference),
      DR: money(item.taxDifference),
      S: item.ratePercent,
    });
  }
  for (const item of input.c2) {
    row("C2", {
      Dod: item.partnerVatId,
      FO: kvInvoiceNumber(item.number),
      FP: kvInvoiceNumber(item.originalNumber),
      ZR: money(item.baseDifference),
      DR: money(item.taxDifference),
      S: item.ratePercent,
      OR: money(item.deductedDifference ?? 0),
    });
  }
  if (input.d1) {
    row("D1", {
      SumaObratov: money(input.d1.turnover ?? 0),
      Z: money(input.d1.base),
      D: money(input.d1.tax),
      ZZn: money(input.d1.reducedBase),
      DZn: money(input.d1.reducedTax),
    });
  }
  if (input.d2) {
    row("D2", {
      Z: money(input.d2.base),
      D: money(input.d2.tax),
      ZZn: money(input.d2.reducedBase),
      DZn: money(input.d2.reducedTax),
    });
  }

  const obdobie = period.month
    ? `      <Rok>${period.year}</Rok>\n      <Mesiac>${period.month}</Mesiac>\n`
    : `      <Rok>${period.year}</Rok>\n      <Stvrtrok>${period.quarter ?? 1}</Stvrtrok>\n`;
  const transactions = lines.length > 0 ? `${lines.join("\n")}\n` : "";
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<KVDPH_2025 xmlns="${KV_DPH_NAMESPACE}">\n` +
    `  <Identifikacia>\n` +
    `    <IcDphPlatitela>${escapeXml(identity.vatId)}</IcDphPlatitela>\n` +
    `    <Druh>R</Druh>\n` +
    `    <Obdobie>\n${obdobie}    </Obdobie>\n` +
    `    <Nazov>${escapeXml(identity.name)}</Nazov>\n` +
    `    <Stat>${escapeXml(identity.country)}</Stat>\n` +
    `    <Obec>${escapeXml(identity.city)}</Obec>\n${element(
      "PSC",
      identity.postalCode,
      "    ",
    )}${element("Ulica", identity.street, "    ")}${element(
      "Email",
      identity.email,
      "    ",
    )}  </Identifikacia>\n` +
    `  <Transakcie>\n${transactions}  </Transakcie>\n` +
    `</KVDPH_2025>\n`
  );
}
