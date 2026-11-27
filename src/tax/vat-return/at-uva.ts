/**
 * Austrian UVA (Umsatzsteuervoranmeldung, Formular U30) Kennzahlen +
 * FinanzOnline-structured XML and CSV builder.
 *
 * Pure builder; amounts in EUR. Tooling, not tax advice.
 */

import type { CountryFilingLine } from "./de-ustva";
import type { VatReportRow, ZeroRatedSales } from "./sk-dph";

export interface AtUvaIdentity {
  companyName: string;
  taxId: string | null;
  vatId: string | null;
}

export interface AtUvaPeriod {
  year: number;
  month?: number;
  quarter?: number;
}

export interface AtUvaResult {
  lines: CountryFilingLine[];
  xml: string;
  xmlFileName: string;
  csv: string;
  csvFileName: string;
  unmapped: VatReportRow[];
  missingVatId: boolean;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

function escXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function buildAtUva(
  rows: readonly VatReportRow[],
  zeroRated: ZeroRatedSales & { euServicesReverseCharge: number },
  identity: AtUvaIdentity,
  period: AtUvaPeriod,
  periodKey: string,
): AtUvaResult {
  let base20 = 0;
  let tax20 = 0;
  let base10 = 0;
  let tax10 = 0;
  let base13 = 0;
  let tax13 = 0;
  let reverseTax = 0;
  let inputVat = 0;
  const unmapped: VatReportRow[] = [];

  for (const row of rows) {
    if (row.direction === "nonDeductible") {
      continue;
    }
    const pct = row.rate === null ? null : Math.round(row.rate * 100);
    if (
      row.direction === "sales" ||
      row.direction === "posSales" ||
      row.direction === "creditNotes"
    ) {
      if (pct === 0) {
        continue;
      }
      if (pct === 20) {
        base20 += row.taxableAmount;
        tax20 += row.taxAmount;
      } else if (pct === 10) {
        base10 += row.taxableAmount;
        tax10 += row.taxAmount;
      } else if (pct === 13) {
        base13 += row.taxableAmount;
        tax13 += row.taxAmount;
      } else {
        unmapped.push(row);
      }
    } else if (row.direction === "reverseCharge") {
      reverseTax += row.taxAmount;
      inputVat += row.taxAmount;
    } else if (row.direction === "purchases") {
      inputVat += row.taxAmount;
    }
  }

  const kz011 = round2(zeroRated.exports);
  const kz017 = round2(zeroRated.euGoods);
  const kz022Base = round2(base20);
  const kz022Tax = round2(tax20);
  const kz029Base = round2(base10);
  const kz029Tax = round2(tax10);
  const kz006Base = round2(base13);
  const kz006Tax = round2(tax13);
  const kz000 = round2(
    kz022Base +
      kz029Base +
      kz006Base +
      kz011 +
      kz017 +
      zeroRated.otherExempt +
      zeroRated.euServicesReverseCharge,
  );
  const kz057 = round2(reverseTax);
  const kz060 = round2(inputVat);
  const kz095 = round2(kz022Tax + kz029Tax + kz006Tax + kz057 - kz060);

  const lines: CountryFilingLine[] = [
    {
      line: "Kz 000",
      label:
        "Gesamtbetrag der Bemessungsgrundlagen für Lieferungen und Leistungen",
      base: kz000,
      amount: 0,
    },
    {
      line: "Kz 011",
      label: "Ausfuhrlieferungen (§ 6 Abs. 1 Z 1 UStG)",
      base: kz011,
      amount: 0,
    },
    {
      line: "Kz 017",
      label: "Innergemeinschaftliche Lieferungen (Art. 6 Abs. 1 UStG)",
      base: kz017,
      amount: 0,
    },
    {
      line: "Kz 022",
      label: "20 % Normalsteuersatz",
      base: kz022Base,
      amount: kz022Tax,
    },
    {
      line: "Kz 029",
      label: "10 % ermäßigter Steuersatz",
      base: kz029Base,
      amount: kz029Tax,
    },
    {
      line: "Kz 006",
      label: "13 % ermäßigter Steuersatz",
      base: kz006Base,
      amount: kz006Tax,
    },
    {
      line: "Kz 057",
      label: "Steuerschuld gemäß § 19 Abs. 1 (Reverse Charge)",
      amount: kz057,
    },
    {
      line: "Kz 060",
      label: "Gesamtbetrag der Vorsteuern",
      amount: kz060,
    },
    {
      line: "Kz 095",
      label: "Vorauszahlung / Überschuss",
      amount: kz095,
      isTotal: true,
    },
  ];

  const periodFromMonth = period.quarter
    ? (period.quarter - 1) * 3 + 1
    : (period.month ?? 1);
  const periodToMonth = period.quarter
    ? period.quarter * 3
    : (period.month ?? 1);
  const von = `${period.year}-${String(periodFromMonth).padStart(2, "0")}`;
  const bis = `${period.year}-${String(periodToMonth).padStart(2, "0")}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ERKLAERUNGS_UEBERMITTLUNG>
  <INFO_DATEN>
    <ART_IDENTIFIKATIONSBEGRIFF>FASTNR</ART_IDENTIFIKATIONSBEGRIFF>
    <IDENTIFIKATIONSBEGRIFF>${escXml((identity.taxId ?? "").replaceAll(/\D+/gu, ""))}</IDENTIFIKATIONSBEGRIFF>
    <PAKET_NR>1</PAKET_NR>
    <DATUM_ERSTELLUNG>${new Date().toISOString().slice(0, 10)}</DATUM_ERSTELLUNG>
    <ANZAHL_ERKLAERUNGEN>1</ANZAHL_ERKLAERUNGEN>
  </INFO_DATEN>
  <ERKLAERUNG art="U30">
    <SATZNR>1</SATZNR>
    <ALLGEMEINE_DATEN>
      <ANBRINGEN>U30</ANBRINGEN>
      <ZRVON>${von}</ZRVON>
      <ZRBIS>${bis}</ZRBIS>
      <FASTNR>${escXml((identity.taxId ?? "").replaceAll(/\D+/gu, ""))}</FASTNR>
      <UID>${escXml(identity.vatId ?? "")}</UID>
      <NAME>${escXml(identity.companyName)}</NAME>
    </ALLGEMEINE_DATEN>
    <LIEFERUNGEN_LEISTUNGEN_EIGENVERBRAUCH>
      <KZ000>${kz000.toFixed(2)}</KZ000>
      <KZ011>${kz011.toFixed(2)}</KZ011>
      <KZ017>${kz017.toFixed(2)}</KZ017>
      <KZ022>${kz022Base.toFixed(2)}</KZ022>
      <KZ029>${kz029Base.toFixed(2)}</KZ029>
      <KZ006>${kz006Base.toFixed(2)}</KZ006>
      <KZ057>${kz057.toFixed(2)}</KZ057>
    </LIEFERUNGEN_LEISTUNGEN_EIGENVERBRAUCH>
    <VORSTEUER>
      <KZ060>${kz060.toFixed(2)}</KZ060>
    </VORSTEUER>
    <ERGEBNIS>
      <KZ095>${kz095.toFixed(2)}</KZ095>
    </ERGEBNIS>
  </ERKLAERUNG>
</ERKLAERUNGS_UEBERMITTLUNG>`;

  const csv = [
    "kennzahl;description;base_eur;tax_eur",
    ...lines.map(
      (l) =>
        `${csvCell(l.line)};${csvCell(l.label)};${l.base !== undefined ? l.base.toFixed(2) : ""};${l.amount.toFixed(2)}`,
    ),
  ].join("\n");

  const safeId = (identity.vatId || identity.taxId || "AT").replaceAll(
    /[^A-Za-z0-9_-]+/gu,
    "",
  );

  return {
    lines,
    xml,
    xmlFileName: `UVA_U30_${safeId}_${periodKey}.xml`,
    csv,
    csvFileName: `UVA_U30_${safeId}_${periodKey}.csv`,
    unmapped,
    missingVatId: !(identity.vatId && /^ATU\d{8}$/iu.test(identity.vatId)),
  };
}
