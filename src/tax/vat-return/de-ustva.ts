/**
 * German UStVA (Umsatzsteuer-Voranmeldung) Kennzahlen + ELSTER-compatible XML
 * and § 19 UStG Kleinunternehmer EÜR (Einnahmenüberschussrechnung) summary.
 *
 * Pure builders; amounts in EUR. Tooling, not tax advice.
 * Direct submission to ELSTER requires ERiC / ElsterOnline authentication;
 * the exported XML follows the official ELSTER Anmeldungssteuern UStVA
 * schema structure and is paired with a structured CSV for manual entry or
 * tax-advisor handoff.
 */

import type { VatReportRow, ZeroRatedSales } from "./sk-dph";

export interface CountryFilingLine {
  line: string;
  label: string;
  base?: number;
  amount: number;
  isTotal?: boolean;
}

export interface DeUstvaIdentity {
  companyName: string;
  steuernummer: string | null;
  vatId: string | null;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  email: string | null;
}

export interface DeUstvaPeriod {
  year: number;
  month?: number;
  quarter?: number;
}

export interface DeUstvaResult {
  lines: CountryFilingLine[];
  elsterXml: string;
  elsterFileName: string;
  csv: string;
  csvFileName: string;
  unmapped: VatReportRow[];
  missingSteuernummer: boolean;
}

export interface EurAccountRow {
  code: string;
  name: string;
  kind: "revenue" | "expense";
  amount: number;
}

export interface DeEurSummaryResult {
  lines: CountryFilingLine[];
  totalRevenue: number;
  totalExpenses: number;
  netSurplus: number;
  csv: string;
  csvFileName: string;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;
const wholeEur = (value: number): number => Math.trunc(value);

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

function xmlTag(tag: string, value: number, integer = false): string {
  if (value === 0 && tag !== "Kz83") {
    return "";
  }
  const formatted = integer ? String(Math.trunc(value)) : value.toFixed(2);
  return `          <${tag}>${formatted}</${tag}>\n`;
}

/**
 * Map period to official ELSTER Zeitraum code:
 * Months: "01".."12", Quarters: "41" (Q1), "42" (Q2), "43" (Q3), "44" (Q4).
 */
export function elsterZeitraum(period: DeUstvaPeriod): string {
  if (period.quarter) {
    return String(40 + period.quarter);
  }
  return String(period.month ?? 1).padStart(2, "0");
}

export function buildDeUstva(
  rows: readonly VatReportRow[],
  zeroRated: ZeroRatedSales & { euServicesReverseCharge: number },
  identity: DeUstvaIdentity,
  period: DeUstvaPeriod,
  periodKey: string,
): DeUstvaResult {
  let base19 = 0;
  let tax19 = 0;
  let base7 = 0;
  let tax7 = 0;
  let reverseBase = 0;
  let reverseTax = 0;
  let inputVatDomestic = 0;
  let inputVatReverse = 0;
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
      if (pct === 19) {
        base19 += row.taxableAmount;
        tax19 += row.taxAmount;
      } else if (pct === 7) {
        base7 += row.taxableAmount;
        tax7 += row.taxAmount;
      } else {
        unmapped.push(row);
      }
    } else if (row.direction === "reverseCharge") {
      reverseBase += row.taxableAmount;
      reverseTax += row.taxAmount;
      inputVatReverse += row.taxAmount;
    } else if (row.direction === "purchases") {
      inputVatDomestic += row.taxAmount;
    }
  }

  // Official UStVA bases are truncated to full EUR (Abrundung auf volle Euro)
  const kz81 = wholeEur(round2(base19));
  const kz81Tax = round2(tax19);
  const kz86 = wholeEur(round2(base7));
  const kz86Tax = round2(tax7);
  const kz41 = wholeEur(round2(zeroRated.euGoods));
  const kz43 = wholeEur(round2(zeroRated.exports));
  const kz45 = wholeEur(round2(zeroRated.euServicesReverseCharge));
  const kz48 = wholeEur(round2(zeroRated.otherExempt));
  const kz46 = wholeEur(round2(reverseBase));
  const kz47 = round2(reverseTax);
  const kz66 = round2(inputVatDomestic);
  const kz67 = round2(inputVatReverse);

  const totalOutputVat = round2(kz81Tax + kz86Tax + kz47);
  const totalInputVat = round2(kz66 + kz67);
  const kz83 = round2(totalOutputVat - totalInputVat);

  const lines: CountryFilingLine[] = [
    {
      line: "Kz 81",
      label: "Steuerpflichtige Umsätze zum Steuersatz von 19 %",
      base: kz81,
      amount: kz81Tax,
    },
    {
      line: "Kz 86",
      label: "Steuerpflichtige Umsätze zum Steuersatz von 7 %",
      base: kz86,
      amount: kz86Tax,
    },
    {
      line: "Kz 41",
      label: "Innergemeinschaftliche Lieferungen (§ 4 Nr. 1b UStG)",
      base: kz41,
      amount: 0,
    },
    {
      line: "Kz 43",
      label:
        "Weitere steuerfreie Umsätze mit Vorsteuerabzug (Ausfuhr § 4 Nr. 1a)",
      base: kz43,
      amount: 0,
    },
    {
      line: "Kz 45",
      label: "Übrige nicht steuerbare Umsätze (EU-Leistungen § 18b UStG)",
      base: kz45,
      amount: 0,
    },
    {
      line: "Kz 48",
      label: "Steuerfreie Umsätze ohne Vorsteuerabzug",
      base: kz48,
      amount: 0,
    },
    {
      line: "Kz 46/47",
      label: "Leistungen i.S.d. § 13b UStG (Reverse Charge Eingang)",
      base: kz46,
      amount: kz47,
    },
    {
      line: "Kz 66",
      label: "Vorsteuerbeträge aus Rechnungen von anderen Unternehmern (§ 15)",
      amount: kz66,
    },
    {
      line: "Kz 67",
      label: "Vorsteuerbeträge aus Leistungen i.S.d. § 13b UStG",
      amount: kz67,
    },
    {
      line: "Kz 83",
      label: "Verbleibende Umsatzsteuer-Vorauszahlung / Überschuss",
      amount: kz83,
      isTotal: true,
    },
  ];

  const steuernummer = (identity.steuernummer ?? "").replaceAll(/\D+/gu, "");
  const zeitraum = elsterZeitraum(period);

  const elsterXml = `<?xml version="1.0" encoding="UTF-8"?>
<Elster xmlns="http://www.elster.de/elsterxml/schema/v11">
  <TransferHeader version="11">
    <Verfahren>ElsterAnmeldung</Verfahren>
    <DatenArt>UStVA</DatenArt>
    <Vorgang>send-NoSig</Vorgang>
    <HerstellerID>00000</HerstellerID>
    <DatenLieferant>${escXml(identity.companyName)}</DatenLieferant>
    <Datei>
      <Verschluesselung>PKCS#7v1.5</Verschluesselung>
      <Kompression>GZIP</Kompression>
      <TransportSchluessel/>
    </Datei>
  </TransferHeader>
  <DatenTeil>
    <Nutzdatenblock>
      <NutzdatenHeader version="11">
        <NutzdatenTicket>1</NutzdatenTicket>
        <Empfaenger id="F">${steuernummer.slice(0, 4) || "0000"}</Empfaenger>
      </NutzdatenHeader>
      <Nutzdaten>
        <Anmeldungssteuern art="UStVA" version="${period.year}01">
          <DatenLieferant>
            <Name>${escXml(identity.companyName)}</Name>
            <Strasse>${escXml(identity.street ?? "")}</Strasse>
            <PLZ>${escXml(identity.postalCode ?? "")}</PLZ>
            <Ort>${escXml(identity.city ?? "")}</Ort>
          </DatenLieferant>
          <Erstellungsdatum>${new Date().toISOString().slice(0, 10).replaceAll("-", "")}</Erstellungsdatum>
          <Steuerfall>
            <Umsatzsteuervoranmeldung>
              <Jahr>${period.year}</Jahr>
              <Zeitraum>${zeitraum}</Zeitraum>
              <Steuernummer>${escXml(steuernummer)}</Steuernummer>
${xmlTag("Kz81", kz81, true)}${xmlTag("Kz86", kz86, true)}${xmlTag("Kz41", kz41, true)}${xmlTag("Kz43", kz43, true)}${xmlTag("Kz45", kz45, true)}${xmlTag("Kz48", kz48, true)}${xmlTag("Kz46", kz46, true)}${xmlTag("Kz47", kz47)}${xmlTag("Kz66", kz66)}${xmlTag("Kz67", kz67)}${xmlTag("Kz83", kz83)}            </Umsatzsteuervoranmeldung>
          </Steuerfall>
        </Anmeldungssteuern>
      </Nutzdaten>
    </Nutzdatenblock>
  </DatenTeil>
</Elster>`;

  const csvRows = [
    "kennzahl;description;base_eur;tax_eur",
    ...lines.map(
      (l) =>
        `${csvCell(l.line)};${csvCell(l.label)};${l.base !== undefined ? l.base.toFixed(2) : ""};${l.amount.toFixed(2)}`,
    ),
  ];

  const safeId = (steuernummer || identity.vatId || "DE").replaceAll(
    /[^A-Za-z0-9_-]+/gu,
    "",
  );
  return {
    lines,
    elsterXml,
    elsterFileName: `ELSTER_UStVA_${safeId}_${periodKey}.xml`,
    csv: csvRows.join("\n"),
    csvFileName: `UStVA_${safeId}_${periodKey}.csv`,
    unmapped,
    missingSteuernummer: steuernummer.length === 0,
  };
}

/**
 * Builds the EÜR (Einnahmenüberschussrechnung) summary for German § 19 UStG
 * Kleinunternehmer (and Austrian § 6 Abs. 1 Z 27 small businesses) who are
 * exempt from regular VAT returns.
 */
export function buildSmallBusinessEurSummary(
  accounts: readonly EurAccountRow[],
  periodKey: string,
  countryCode: string,
): DeEurSummaryResult {
  const revenueRows = accounts.filter(
    (a) => a.kind === "revenue" && Math.abs(a.amount) > 0.0001,
  );
  const expenseRows = accounts.filter(
    (a) => a.kind === "expense" && Math.abs(a.amount) > 0.0001,
  );

  const totalRevenue = round2(
    revenueRows.reduce((sum, r) => sum + r.amount, 0),
  );
  const totalExpenses = round2(
    expenseRows.reduce((sum, r) => sum + r.amount, 0),
  );
  const netSurplus = round2(totalRevenue - totalExpenses);

  const lines: CountryFilingLine[] = [
    ...revenueRows.map((r) => ({
      line: r.code,
      label: r.name,
      amount: round2(r.amount),
    })),
    {
      line: "EÜR-E",
      label:
        countryCode === "AT"
          ? "Summe Betriebseinnahmen"
          : "Summe Betriebseinnahmen (EÜR)",
      amount: totalRevenue,
      isTotal: true,
    },
    ...expenseRows.map((r) => ({
      line: r.code,
      label: r.name,
      amount: -round2(r.amount),
    })),
    {
      line: "EÜR-A",
      label:
        countryCode === "AT"
          ? "Summe Betriebsausgaben"
          : "Summe Betriebsausgaben (EÜR)",
      amount: -totalExpenses,
      isTotal: true,
    },
    {
      line: "EÜR-G",
      label: "Gewinn / Verlust (Einnahmenüberschuss)",
      amount: netSurplus,
      isTotal: true,
    },
  ];

  const csv = [
    "code;category;amount",
    ...lines.map(
      (l) => `${csvCell(l.line)};${csvCell(l.label)};${l.amount.toFixed(2)}`,
    ),
  ].join("\n");

  const prefix = countryCode === "AT" ? "EA_Summary" : "EUR_Summary";
  return {
    lines,
    totalRevenue,
    totalExpenses,
    netSurplus,
    csv,
    csvFileName: `${prefix}_${countryCode}_${periodKey}.csv`,
  };
}
