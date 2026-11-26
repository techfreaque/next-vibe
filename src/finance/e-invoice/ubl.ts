/**
 * Peppol BIS Billing 3.0 (UBL 2.1, EN 16931) export for issued sales
 * documents. Pure: takes a resolved document and returns XML.
 *
 * Code lists checked against docs.peppol.eu/poacc/billing/3.0/codelist/
 * (eas, vatex) on 2026-11-26. Tooling, not tax advice.
 */

import { VatTreatment, type VatTreatmentValue } from "@/tax/compliance/enum";

export const PEPPOL_CUSTOMIZATION_ID =
  "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0";
export const PEPPOL_PROFILE_ID = "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0";

export type UblDocumentType = "INVOICE" | "CREDIT_NOTE";

/** UNCL5305 VAT category codes used by EN 16931. */
export type UblTaxCategory = "S" | "AE" | "K" | "G" | "E" | "O";

export interface UblParty {
  name: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  registrationNumber: string | null;
  taxId: string | null;
  vatNumber: string | null;
  email: string | null;
}

/** A line as stored: lineTotal is gross, taxAmount is the line VAT. */
export interface UblLine {
  description: string;
  quantity: number;
  unitPrice: number;
  /** Fraction, 0.23 = 23 %. */
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
}

export interface UblInvoiceInput {
  documentType: UblDocumentType;
  number: string | null;
  /** ISO dates (YYYY-MM-DD). */
  issueDate: string | null;
  dueDate: string | null;
  supplyDate: string | null;
  currency: string | null;
  treatment: typeof VatTreatmentValue;
  /** False when the issuer is not a VAT payer (category O). */
  vatPayer: boolean;
  /** Legal notes printed on the document. */
  notes: readonly string[];
  /** Legal text explaining a zero rate, reverse charge or exemption. */
  exemptionReason: string | null;
  buyerReference: string | null;
  originalInvoice: { number: string; issueDate: string | null } | null;
  iban: string | null;
  seller: UblParty;
  buyer: UblParty | null;
  /** Amounts as stored (credit notes carry negative amounts). */
  lines: readonly UblLine[];
}

/** EN 16931 business terms the export can report as missing. */
export const UBL_FIELD_IDS = [
  "BT-1",
  "BT-2",
  "BT-5",
  "BT-9",
  "BT-27",
  "BT-31",
  "BT-34",
  "BT-40",
  "BT-44",
  "BT-48",
  "BT-49",
  "BT-55",
  "BT-153",
  "BG-25",
] as const;
export type UblFieldId = (typeof UBL_FIELD_IDS)[number];

/** EAS codes for VAT numbers by VAT prefix (Peppol EAS code list). */
const VAT_EAS: Readonly<Record<string, string>> = {
  AD: "9922",
  AL: "9923",
  AT: "9914",
  BA: "9924",
  BE: "9925",
  BG: "9926",
  CH: "9927",
  CY: "9928",
  CZ: "9929",
  DE: "9930",
  EE: "9931",
  EL: "9933",
  ES: "9920",
  FR: "9957",
  GB: "9932",
  GR: "9933",
  HR: "9934",
  HU: "9910",
  IE: "9935",
  IT: "0211",
  LI: "9936",
  LT: "9937",
  LU: "9938",
  LV: "9939",
  MC: "9940",
  ME: "9941",
  MK: "9942",
  MT: "9943",
  NL: "9944",
  PL: "9945",
  PT: "9946",
  RO: "9947",
  RS: "9948",
  SI: "9949",
  SK: "9950",
  SM: "9951",
  TR: "9952",
  VA: "9953",
};

/** EAS codes for national company registration numbers by country. */
const REGISTRATION_EAS: Readonly<Record<string, string>> = {
  BE: "0208",
  DK: "0184",
  FR: "0002",
  IS: "0196",
  LT: "0200",
  LV: "0218",
  NO: "0192",
  SE: "0007",
  // IČO under zákon 540/2001 Z. z. o štátnej štatistike, § 27.
  SK: "0158",
};

/** Generic exemption texts when the document carries no legal note. */
const DEFAULT_REASON: Readonly<Record<UblTaxCategory, string | null>> = {
  S: null,
  AE: "Reverse charge",
  K: "Intra-Community supply",
  G: "Export outside the EU",
  E: "Exempt from VAT",
  O: "Not subject to VAT",
};

const VATEX: Readonly<Record<UblTaxCategory, string | null>> = {
  S: null,
  AE: "VATEX-EU-AE",
  K: "VATEX-EU-IC",
  G: "VATEX-EU-G",
  E: null,
  O: "VATEX-EU-O",
};

function clean(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function compact(value: string | null | undefined): string | null {
  const trimmed = value?.replace(/[\s.\-/]/g, "").toUpperCase();
  return trimmed ? trimmed : null;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cents(value: number): number {
  return Math.round(value * 100);
}

function money(centsValue: number): string {
  const sign = centsValue < 0 ? "-" : "";
  const abs = Math.abs(centsValue);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

function decimal(value: number, maxDecimals: number): string {
  const [whole, fraction = ""] = value.toFixed(maxDecimals).split(".");
  return `${whole}.${fraction.replace(/0+$/, "").padEnd(2, "0")}`;
}

function percent(rate: number): string {
  return String(Math.round(rate * 10_000) / 100);
}

/** VAT category per line for the document treatment and issuer regime. */
export function ublTaxCategory(
  treatment: typeof VatTreatmentValue,
  vatPayer: boolean,
  rate: number,
): UblTaxCategory {
  if (!vatPayer) {
    return "O";
  }
  switch (treatment) {
    case VatTreatment.DOMESTIC:
      return rate > 0 ? "S" : "E";
    case VatTreatment.REVERSE_CHARGE_DOMESTIC:
    case VatTreatment.EU_SERVICES_REVERSE_CHARGE:
      return "AE";
    case VatTreatment.EU_GOODS_EXEMPT:
      return "K";
    case VatTreatment.EXPORT_EXEMPT:
      return "G";
    case VatTreatment.EXEMPT:
      return "E";
  }
}

/** Peppol electronic address (EndpointID) for a party, null if none. */
export function ublEndpoint(
  party: UblParty | null,
): { scheme: string; id: string } | null {
  if (!party) {
    return null;
  }
  const vat = compact(party.vatNumber);
  const vatPrefix = vat?.slice(0, 2);
  if (vat && vatPrefix && VAT_EAS[vatPrefix]) {
    return { scheme: VAT_EAS[vatPrefix], id: vat };
  }
  const country = party.country?.trim().toUpperCase() ?? null;
  const taxId = compact(party.taxId);
  if (country === "SK" && taxId) {
    // DIČ, Slovakia (EAS 0245).
    return { scheme: "0245", id: taxId };
  }
  const registration = compact(party.registrationNumber);
  if (country && registration && REGISTRATION_EAS[country]) {
    return { scheme: REGISTRATION_EAS[country], id: registration };
  }
  return null;
}

interface PreparedLine {
  name: string;
  quantity: number;
  netCents: number;
  taxCents: number;
  price: number;
  rate: number;
  category: UblTaxCategory;
}

function prepareLines(input: UblInvoiceInput): PreparedLine[] {
  const sign = input.documentType === "CREDIT_NOTE" ? -1 : 1;
  return input.lines.map((line) => {
    const netCents = sign * (cents(line.lineTotal) - cents(line.taxAmount));
    const taxCents = sign * cents(line.taxAmount);
    const rawQuantity =
      Math.abs(line.quantity) > 0 ? Math.abs(line.quantity) : 1;
    // Prices stay non-negative (BR-27); a negative line carries the sign on the quantity.
    const quantity = netCents < 0 ? -rawQuantity : rawQuantity;
    let price = Math.abs(line.unitPrice);
    if (Math.abs(cents(quantity * price) - netCents) > 1) {
      price = Math.abs(netCents) / 100 / rawQuantity;
    }
    return {
      name: line.description,
      quantity,
      netCents,
      taxCents,
      price,
      rate: line.taxRate,
      category: ublTaxCategory(input.treatment, input.vatPayer, line.taxRate),
    };
  });
}

interface Subtotal {
  category: UblTaxCategory;
  rate: number;
  taxableCents: number;
  taxCents: number;
}

function subtotals(lines: readonly PreparedLine[]): Subtotal[] {
  const groups = new Map<string, Subtotal>();
  for (const line of lines) {
    const rate = line.category === "S" ? line.rate : 0;
    const key = `${line.category}:${percent(rate)}`;
    const group = groups.get(key) ?? {
      category: line.category,
      rate,
      taxableCents: 0,
      taxCents: 0,
    };
    group.taxableCents += line.netCents;
    group.taxCents += line.taxCents;
    groups.set(key, group);
  }
  return [...groups.values()];
}

export interface UblTotals {
  lineExtensionCents: number;
  taxCents: number;
  taxInclusiveCents: number;
  payableCents: number;
}

export function ublTotals(input: UblInvoiceInput): UblTotals {
  const lines = prepareLines(input);
  const lineExtensionCents = lines.reduce((sum, l) => sum + l.netCents, 0);
  const taxCents = subtotals(lines).reduce((sum, s) => sum + s.taxCents, 0);
  const taxInclusiveCents = lineExtensionCents + taxCents;
  return {
    lineExtensionCents,
    taxCents,
    taxInclusiveCents,
    payableCents: taxInclusiveCents,
  };
}

function categoriesOf(input: UblInvoiceInput): Set<UblTaxCategory> {
  return new Set(prepareLines(input).map((line) => line.category));
}

/** Mandatory EN 16931 / Peppol fields that are missing for this document. */
export function validateUblInput(input: UblInvoiceInput): UblFieldId[] {
  const missing: UblFieldId[] = [];
  const categories = categoriesOf(input);
  const needsSellerVat = [...categories].some((c) => c !== "O");
  const needsBuyerVat = categories.has("AE") || categories.has("K");
  const add = (id: UblFieldId, isMissing: boolean): void => {
    if (isMissing) {
      missing.push(id);
    }
  };
  add("BT-1", !clean(input.number));
  add("BT-2", !clean(input.issueDate));
  add("BT-5", !clean(input.currency));
  add(
    "BT-9",
    input.documentType === "INVOICE" &&
      !clean(input.dueDate) &&
      ublTotals(input).payableCents > 0,
  );
  add("BT-27", !clean(input.seller.name));
  add("BT-31", needsSellerVat && !compact(input.seller.vatNumber));
  add("BT-34", !ublEndpoint(input.seller));
  add("BT-40", !clean(input.seller.country));
  add("BT-44", !clean(input.buyer?.name));
  add("BT-48", needsBuyerVat && !compact(input.buyer?.vatNumber));
  add("BT-49", !ublEndpoint(input.buyer));
  add("BT-55", !clean(input.buyer?.country));
  add("BG-25", input.lines.length === 0);
  add(
    "BT-153",
    input.lines.some((line) => !clean(line.description)),
  );
  return missing;
}

type Node = string | null;

function el(
  tag: string,
  content: string | null | undefined,
  attrs?: string,
): Node {
  const value = clean(content);
  if (value === null) {
    return null;
  }
  return `<${tag}${attrs ? ` ${attrs}` : ""}>${escapeXml(value)}</${tag}>`;
}

function wrap(tag: string, children: readonly Node[]): Node {
  const parts = children.filter((child): child is string => Boolean(child));
  return parts.length > 0 ? `<${tag}>${parts.join("")}</${tag}>` : null;
}

function amount(tag: string, centsValue: number, currency: string): string {
  return `<${tag} currencyID="${escapeXml(currency)}">${money(centsValue)}</${tag}>`;
}

function partyNode(value: UblParty | null, includeVat: boolean): Node {
  const endpoint = ublEndpoint(value);
  const vat = compact(value?.vatNumber);
  const name = clean(value?.name);
  return wrap("cac:Party", [
    endpoint
      ? `<cbc:EndpointID schemeID="${endpoint.scheme}">${escapeXml(endpoint.id)}</cbc:EndpointID>`
      : null,
    wrap("cac:PartyName", [el("cbc:Name", name)]),
    wrap("cac:PostalAddress", [
      el("cbc:StreetName", value?.addressLine1),
      el("cbc:AdditionalStreetName", value?.addressLine2),
      el("cbc:CityName", value?.city),
      el("cbc:PostalZone", value?.postalCode),
      wrap("cac:Country", [
        el("cbc:IdentificationCode", value?.country?.trim().toUpperCase()),
      ]),
    ]),
    includeVat && vat
      ? wrap("cac:PartyTaxScheme", [
          el("cbc:CompanyID", vat),
          "<cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>",
        ])
      : null,
    name
      ? wrap("cac:PartyLegalEntity", [
          el("cbc:RegistrationName", name),
          el("cbc:CompanyID", compact(value?.registrationNumber)),
        ])
      : null,
    wrap("cac:Contact", [el("cbc:ElectronicMail", value?.email)]),
  ]);
}

function taxCategory(
  tag: "cac:TaxCategory" | "cac:ClassifiedTaxCategory",
  category: UblTaxCategory,
  rate: number,
  reason: string | null,
): string {
  return (
    wrap(tag, [
      el("cbc:ID", category),
      category === "O" ? null : el("cbc:Percent", percent(rate)),
      tag === "cac:TaxCategory"
        ? el("cbc:TaxExemptionReasonCode", VATEX[category])
        : null,
      tag === "cac:TaxCategory" && category !== "S"
        ? el("cbc:TaxExemptionReason", reason ?? DEFAULT_REASON[category])
        : null,
      "<cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>",
    ]) ?? ""
  );
}

/** Builds the Peppol BIS 3.0 Invoice or CreditNote XML. */
export function buildUblInvoice(input: UblInvoiceInput): string {
  const isCredit = input.documentType === "CREDIT_NOTE";
  const root = isCredit ? "CreditNote" : "Invoice";
  const currency = clean(input.currency)?.toUpperCase() ?? "EUR";
  const lines = prepareLines(input);
  const groups = subtotals(lines);
  const totals = ublTotals(input);
  const categories = new Set(lines.map((line) => line.category));
  const includeVat = !categories.has("O");
  const note = input.notes
    .map((n) => n.trim())
    .filter(Boolean)
    .join("\n");
  const supplyDate = clean(input.supplyDate);
  const iban = compact(input.iban);
  const ns = isCredit
    ? "urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2"
    : "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2";

  const header: Node[] = [
    el("cbc:CustomizationID", PEPPOL_CUSTOMIZATION_ID),
    el("cbc:ProfileID", PEPPOL_PROFILE_ID),
    el("cbc:ID", input.number),
    el("cbc:IssueDate", input.issueDate),
  ];
  // UBL 2.1 element order differs between Invoice and CreditNote.
  if (isCredit) {
    header.push(
      el("cbc:TaxPointDate", supplyDate),
      el("cbc:CreditNoteTypeCode", "381"),
      el("cbc:Note", note),
    );
  } else {
    header.push(
      el("cbc:DueDate", input.dueDate),
      el("cbc:InvoiceTypeCode", "380"),
      el("cbc:Note", note),
      el("cbc:TaxPointDate", supplyDate),
    );
  }
  header.push(
    el("cbc:DocumentCurrencyCode", currency),
    el("cbc:BuyerReference", input.buyerReference ?? input.number),
    input.originalInvoice
      ? wrap("cac:BillingReference", [
          wrap("cac:InvoiceDocumentReference", [
            el("cbc:ID", input.originalInvoice.number),
            el("cbc:IssueDate", input.originalInvoice.issueDate),
          ]),
        ])
      : null,
    wrap("cac:AccountingSupplierParty", [partyNode(input.seller, includeVat)]),
    wrap("cac:AccountingCustomerParty", [partyNode(input.buyer, includeVat)]),
    supplyDate
      ? wrap("cac:Delivery", [
          el("cbc:ActualDeliveryDate", supplyDate),
          categories.has("K")
            ? wrap("cac:DeliveryLocation", [
                wrap("cac:Address", [
                  wrap("cac:Country", [
                    el(
                      "cbc:IdentificationCode",
                      input.buyer?.country?.trim().toUpperCase(),
                    ),
                  ]),
                ]),
              ])
            : null,
        ])
      : null,
    iban
      ? wrap("cac:PaymentMeans", [
          el("cbc:PaymentMeansCode", currency === "EUR" ? "58" : "30"),
          isCredit ? el("cbc:PaymentDueDate", input.dueDate) : null,
          el("cbc:PaymentID", input.number),
          wrap("cac:PayeeFinancialAccount", [el("cbc:ID", iban)]),
        ])
      : null,
    wrap("cac:TaxTotal", [
      amount("cbc:TaxAmount", totals.taxCents, currency),
      ...groups.map((sub) =>
        wrap("cac:TaxSubtotal", [
          amount("cbc:TaxableAmount", sub.taxableCents, currency),
          amount("cbc:TaxAmount", sub.taxCents, currency),
          taxCategory(
            "cac:TaxCategory",
            sub.category,
            sub.rate,
            clean(input.exemptionReason),
          ),
        ]),
      ),
    ]),
    wrap("cac:LegalMonetaryTotal", [
      amount("cbc:LineExtensionAmount", totals.lineExtensionCents, currency),
      amount("cbc:TaxExclusiveAmount", totals.lineExtensionCents, currency),
      amount("cbc:TaxInclusiveAmount", totals.taxInclusiveCents, currency),
      amount("cbc:PayableAmount", totals.payableCents, currency),
    ]),
  );

  const lineTag = isCredit ? "cac:CreditNoteLine" : "cac:InvoiceLine";
  const quantityTag = isCredit
    ? "cbc:CreditedQuantity"
    : "cbc:InvoicedQuantity";
  const body = lines.map((line, index) =>
    wrap(lineTag, [
      el("cbc:ID", String(index + 1)),
      `<${quantityTag} unitCode="C62">${decimal(line.quantity, 4)}</${quantityTag}>`,
      amount("cbc:LineExtensionAmount", line.netCents, currency),
      wrap("cac:Item", [
        el("cbc:Name", line.name),
        taxCategory(
          "cac:ClassifiedTaxCategory",
          line.category,
          line.category === "S" ? line.rate : 0,
          null,
        ),
      ]),
      wrap("cac:Price", [
        `<cbc:PriceAmount currencyID="${escapeXml(currency)}">${decimal(line.price, 6)}</cbc:PriceAmount>`,
      ]),
    ]),
  );

  const children = [...header, ...body].filter((child): child is string =>
    Boolean(child),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<${root} xmlns="${ns}" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">`,
    ...children.map((child) => `  ${child}`),
    `</${root}>`,
    "",
  ].join("\n");
}
