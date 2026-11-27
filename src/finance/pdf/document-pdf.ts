/**
 * Pure TypeScript A4 PDF/A-3B generator for ERP Invoices, Credit Notes, and Estimates.
 *
 * Features:
 * - Company branding header, legal identifiers per country profile (DE, SK, AT, generic)
 * - Localized labels across all 7 platform languages (en, de, pl, fr, it, es, sk)
 * - Line items table with automatic multi-page pagination
 * - VAT breakdown by rate, paid/open totals
 * - Vector QR code rendering (EPC/GiroCode or PAY by square) via uqr
 * - Clickable online payment URL annotation
 * - PDF/A-3B ZUGFeRD / Factur-X `factur-x.xml` embedded attachment with /AF + XMP metadata
 */

import { type CountryLanguage } from "next-vibe/core/i18n/core/config";

import { getQrMatrix, type PaymentQrResult } from "./payment-qr";

export type PdfDocumentKind = "invoice" | "credit_note" | "estimate";

export interface PdfParty {
  name: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  registrationNumber?: string | null;
  taxId?: string | null;
  vatNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
}

export interface PdfLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // fraction e.g. 0.19
  taxAmount: number;
  lineTotal: number; // gross
}

export interface DocumentPdfInput {
  kind: PdfDocumentKind;
  locale: CountryLanguage;
  countryCode?: string | null;
  documentNumber: string;
  issueDate: string; // YYYY-MM-DD
  supplyDate?: string | null;
  dueDate?: string | null; // or validUntil for estimates
  originalInvoiceNumber?: string | null;
  buyerReference?: string | null;
  currency: string;
  seller: PdfParty;
  buyer: PdfParty;
  lines: PdfLineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid?: number;
  amountDue?: number;
  notes?: string[];
  bankIban?: string | null;
  bankBic?: string | null;
  bankHolder?: string | null;
  paymentUrl?: string | null;
  paymentQr?: PaymentQrResult | null;
  zugferdXml?: string | null;
}

interface PdfLabels {
  invoice: string;
  creditNote: string;
  estimate: string;
  from: string;
  billTo: string;
  issueDate: string;
  supplyDate: string;
  dueDate: string;
  validUntil: string;
  reference: string;
  originalInvoice: string;
  description: string;
  qty: string;
  unitPrice: string;
  vat: string;
  total: string;
  subtotal: string;
  vatTotal: string;
  grandTotal: string;
  paid: string;
  amountDue: string;
  paymentDetails: string;
  iban: string;
  bic: string;
  payOnline: string;
  scanToPay: string;
  notes: string;
  page: string;
}

const LABELS_BY_LANG: Record<string, PdfLabels> = {
  en: {
    invoice: "INVOICE",
    creditNote: "CREDIT NOTE",
    estimate: "ESTIMATE",
    from: "From",
    billTo: "Bill to",
    issueDate: "Issue date",
    supplyDate: "Supply date",
    dueDate: "Due date",
    validUntil: "Valid until",
    reference: "Reference",
    originalInvoice: "Original invoice",
    description: "Description",
    qty: "Qty",
    unitPrice: "Unit price",
    vat: "VAT",
    total: "Total",
    subtotal: "Subtotal (net)",
    vatTotal: "VAT",
    grandTotal: "Total",
    paid: "Paid",
    amountDue: "Amount due",
    paymentDetails: "Payment details",
    iban: "IBAN",
    bic: "BIC",
    payOnline: "Pay online",
    scanToPay: "Scan to pay",
    notes: "Notes",
    page: "Page",
  },
  de: {
    invoice: "RECHNUNG",
    creditNote: "GUTSCHRIFT",
    estimate: "ANGEBOT",
    from: "Absender",
    billTo: "Empfaenger",
    issueDate: "Rechnungsdatum",
    supplyDate: "Leistungsdatum",
    dueDate: "Faellig am",
    validUntil: "Gueltig bis",
    reference: "Referenz",
    originalInvoice: "Urspruengliche Rechnung",
    description: "Beschreibung",
    qty: "Menge",
    unitPrice: "Einzelpreis",
    vat: "USt",
    total: "Gesamt",
    subtotal: "Nettobetrag",
    vatTotal: "Umsatzsteuer",
    grandTotal: "Gesamtbetrag",
    paid: "Bezahlt",
    amountDue: "Offener Betrag",
    paymentDetails: "Zahlungsinformationen",
    iban: "IBAN",
    bic: "BIC",
    payOnline: "Online bezahlen",
    scanToPay: "Zum Bezahlen scannen",
    notes: "Hinweise",
    page: "Seite",
  },
  sk: {
    invoice: "FAKTURA",
    creditNote: "DOBROPIS",
    estimate: "CENOVA PONUKA",
    from: "Dodavatel",
    billTo: "Odberatel",
    issueDate: "Datum vystavenia",
    supplyDate: "Datum dodania",
    dueDate: "Datum splatnosti",
    validUntil: "Platnost do",
    reference: "Variabilny symbol",
    originalInvoice: "Povodna faktura",
    description: "Polozka",
    qty: "Mnoz.",
    unitPrice: "Jedn. cena",
    vat: "DPH",
    total: "Spolu",
    subtotal: "Zaklad dane",
    vatTotal: "DPH",
    grandTotal: "Spolu na uhradu",
    paid: "Uhradene",
    amountDue: "Zostava uhradit",
    paymentDetails: "Platobne udaje",
    iban: "IBAN",
    bic: "BIC",
    payOnline: "Zaplatt online",
    scanToPay: "PAY by square",
    notes: "Poznamky",
    page: "Strana",
  },
  pl: {
    invoice: "FAKTURA",
    creditNote: "FAKTURA KORYGUJACA",
    estimate: "WYCENA",
    from: "Sprzedawca",
    billTo: "Nabywca",
    issueDate: "Data wystawienia",
    supplyDate: "Data sprzedazy",
    dueDate: "Termin platnosci",
    validUntil: "Wazna do",
    reference: "Referencja",
    originalInvoice: "Faktura pierwotna",
    description: "Opis",
    qty: "Ilosc",
    unitPrice: "Cena jedn.",
    vat: "VAT",
    total: "Razem",
    subtotal: "Netto",
    vatTotal: "VAT",
    grandTotal: "Brutto",
    paid: "Zaplacono",
    amountDue: "Do zaplaty",
    paymentDetails: "Dane do platnosci",
    iban: "IBAN",
    bic: "BIC",
    payOnline: "Zaplac online",
    scanToPay: "Zeskanuj aby zaplacic",
    notes: "Uwagi",
    page: "Strona",
  },
  fr: {
    invoice: "FACTURE",
    creditNote: "AVOIR",
    estimate: "DEVIS",
    from: "Emetteur",
    billTo: "Client",
    issueDate: "Date d'emission",
    supplyDate: "Date de prestation",
    dueDate: "Date d'echeance",
    validUntil: "Valide jusqu'au",
    reference: "Reference",
    originalInvoice: "Facture d'origine",
    description: "Description",
    qty: "Qte",
    unitPrice: "Prix unit.",
    vat: "TVA",
    total: "Total",
    subtotal: "Total HT",
    vatTotal: "TVA",
    grandTotal: "Total TTC",
    paid: "Paye",
    amountDue: "Net a payer",
    paymentDetails: "Coordonnees bancaires",
    iban: "IBAN",
    bic: "BIC",
    payOnline: "Payer en ligne",
    scanToPay: "Scanner pour payer",
    notes: "Mentions",
    page: "Page",
  },
  it: {
    invoice: "FATTURA",
    creditNote: "NOTA DI CREDITO",
    estimate: "PREVENTIVO",
    from: "Emittente",
    billTo: "Cliente",
    issueDate: "Data emissione",
    supplyDate: "Data fornitura",
    dueDate: "Scadenza",
    validUntil: "Valido fino al",
    reference: "Riferimento",
    originalInvoice: "Fattura originale",
    description: "Descrizione",
    qty: "Qta",
    unitPrice: "Prezzo unit.",
    vat: "IVA",
    total: "Totale",
    subtotal: "Imponibile",
    vatTotal: "IVA",
    grandTotal: "Totale documento",
    paid: "Pagato",
    amountDue: "Importo dovuto",
    paymentDetails: "Coordinate bancarie",
    iban: "IBAN",
    bic: "BIC",
    payOnline: "Paga online",
    scanToPay: "Scansiona per pagare",
    notes: "Note",
    page: "Pagina",
  },
  es: {
    invoice: "FACTURA",
    creditNote: "NOTA DE CREDITO",
    estimate: "PRESUPUESTO",
    from: "Emisor",
    billTo: "Cliente",
    issueDate: "Fecha de emision",
    supplyDate: "Fecha de entrega",
    dueDate: "Fecha de vencimiento",
    validUntil: "Valido hasta",
    reference: "Referencia",
    originalInvoice: "Factura original",
    description: "Concepto",
    qty: "Cant.",
    unitPrice: "Precio unit.",
    vat: "IVA",
    total: "Total",
    subtotal: "Base imponible",
    vatTotal: "IVA",
    grandTotal: "Total",
    paid: "Pagado",
    amountDue: "Importe pendiente",
    paymentDetails: "Datos de pago",
    iban: "IBAN",
    bic: "BIC",
    payOnline: "Pagar en linea",
    scanToPay: "Escanear para pagar",
    notes: "Notas",
    page: "Pagina",
  },
};

/** Transliterates common Latin diacritics to clean WinAnsi / PDF ASCII text. */
function pdfSafeText(value: string): string {
  const normalized = value
    .replaceAll("€", "EUR")
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("Ä", "Ae")
    .replaceAll("Ö", "Oe")
    .replaceAll("Ü", "Ue")
    .replaceAll("ß", "ss")
    .normalize("NFKD")
    .replaceAll(/[\u0300-\u036f]/gu, "");
  let out = "";
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    const ch = normalized[i];
    if (ch === "\\" || ch === "(" || ch === ")") {
      out += `\\${ch}`;
    } else if (code >= 32 && code <= 126) {
      out += ch;
    } else {
      out += " ";
    }
  }
  return out;
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/u).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length === 0) {
      current = word.slice(0, maxChars);
    } else if (current.length + 1 + word.length <= maxChars) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word.slice(0, maxChars);
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

function fmtAmount(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

function partyLegalLines(party: PdfParty, countryCode: string): string[] {
  const out: string[] = [];
  if (party.addressLine1) {
    out.push(party.addressLine1);
  }
  if (party.addressLine2) {
    out.push(party.addressLine2);
  }
  const cityLine = [party.postalCode, party.city].filter(Boolean).join(" ");
  if (cityLine) {
    out.push(
      party.country ? `${cityLine}, ${party.country.toUpperCase()}` : cityLine,
    );
  }
  if (countryCode === "SK") {
    if (party.registrationNumber) {
      out.push(`ICO: ${party.registrationNumber}`);
    }
    if (party.taxId) {
      out.push(`DIC: ${party.taxId}`);
    }
    if (party.vatNumber) {
      out.push(`IC DPH: ${party.vatNumber}`);
    }
  } else if (countryCode === "DE") {
    if (party.vatNumber) {
      out.push(`USt-IdNr.: ${party.vatNumber}`);
    }
    if (party.taxId) {
      out.push(`Steuernr.: ${party.taxId}`);
    }
    if (party.registrationNumber) {
      out.push(`Reg.-Nr.: ${party.registrationNumber}`);
    }
  } else {
    if (party.vatNumber) {
      out.push(`VAT: ${party.vatNumber}`);
    }
    if (party.taxId) {
      out.push(`Tax ID: ${party.taxId}`);
    }
    if (party.registrationNumber) {
      out.push(`Reg.: ${party.registrationNumber}`);
    }
  }
  if (party.email) {
    out.push(party.email);
  }
  if (party.phone) {
    out.push(party.phone);
  }
  return out;
}

function buildXmpMetadata(hasZugferd: boolean, title: string): string {
  const zugferdXmp = hasZugferd
    ? `
      <rdf:Description rdf:about="" xmlns:fx="urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#">
        <fx:DocumentType>INVOICE</fx:DocumentType>
        <fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>
        <fx:Version>1.0</fx:Version>
        <fx:ConformanceLevel>EN 16931</fx:ConformanceLevel>
      </rdf:Description>`
    : "";
  return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
      <pdfaid:part>3</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
    </rdf:Description>
    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${title.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</rdf:li></rdf:Alt></dc:title>
    </rdf:Description>${zugferdXmp}
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

export function generateDocumentPdf(input: DocumentPdfInput): Uint8Array {
  const lang = input.locale.split("-")[0] ?? "en";
  const labels = LABELS_BY_LANG[lang] ?? LABELS_BY_LANG.en;
  const country = (
    input.countryCode ??
    input.seller.country ??
    "DE"
  ).toUpperCase();
  const title =
    input.kind === "credit_note"
      ? labels.creditNote
      : input.kind === "estimate"
        ? labels.estimate
        : labels.invoice;

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN_L = 45;
  const MARGIN_R = 550;
  const pages: string[][] = [[]];
  let pageIdx = 0;
  let y = PAGE_H - 48;

  const currentOps = (): string[] => pages[pageIdx];

  const drawText = (
    text: string,
    x: number,
    yy: number,
    size: number,
    bold = false,
    rgb: [number, number, number] = [0.1, 0.12, 0.16],
  ): void => {
    currentOps().push(
      `BT ${rgb[0]} ${rgb[1]} ${rgb[2]} rg /${bold ? "F2" : "F1"} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${yy.toFixed(2)} Tm (${pdfSafeText(text)}) Tj ET`,
    );
  };

  const drawTextRight = (
    text: string,
    rightX: number,
    yy: number,
    size: number,
    bold = false,
    rgb: [number, number, number] = [0.1, 0.12, 0.16],
  ): void => {
    // Helvetica average char width approximation ~0.52 * size for digits/uppercase
    const safe = pdfSafeText(text);
    const estWidth = safe.length * size * 0.52;
    drawText(text, Math.max(MARGIN_L, rightX - estWidth), yy, size, bold, rgb);
  };

  const drawRect = (
    x: number,
    yy: number,
    w: number,
    h: number,
    rgb: [number, number, number],
  ): void => {
    currentOps().push(
      `${rgb[0]} ${rgb[1]} ${rgb[2]} rg ${x.toFixed(2)} ${yy.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`,
    );
  };

  const drawHLine = (
    yy: number,
    rgb: [number, number, number] = [0.85, 0.87, 0.9],
  ): void => {
    currentOps().push(
      `${rgb[0]} ${rgb[1]} ${rgb[2]} RG 0.7 w ${MARGIN_L} ${yy.toFixed(2)} m ${MARGIN_R} ${yy.toFixed(2)} l S`,
    );
  };

  const ensureSpace = (needed: number): void => {
    if (y - needed < 60) {
      pages.push([]);
      pageIdx += 1;
      y = PAGE_H - 54;
    }
  };

  // ---- Brand top accent bar ----
  drawRect(0, PAGE_H - 10, PAGE_W, 10, [0.14, 0.38, 0.92]);

  // ---- Header: Seller name left, Document title & number right ----
  drawText(input.seller.name, MARGIN_L, y, 18, true, [0.08, 0.11, 0.18]);
  drawTextRight(title, MARGIN_R, y, 18, true, [0.14, 0.38, 0.92]);
  y -= 20;
  drawTextRight(input.documentNumber, MARGIN_R, y, 12, true, [0.1, 0.12, 0.16]);
  if (input.seller.website) {
    drawText(input.seller.website, MARGIN_L, y, 9, false, [0.4, 0.45, 0.52]);
  }
  y -= 24;
  drawHLine(y);
  y -= 18;

  // ---- Two columns: Seller / Buyer + Document meta ----
  const startPartyY = y;
  drawText(labels.from.toUpperCase(), MARGIN_L, y, 8, true, [0.45, 0.5, 0.58]);
  drawText(labels.billTo.toUpperCase(), 235, y, 8, true, [0.45, 0.5, 0.58]);
  y -= 14;

  let leftY = y;
  drawText(input.seller.name, MARGIN_L, leftY, 10, true);
  leftY -= 13;
  for (const line of partyLegalLines(input.seller, country)) {
    drawText(line, MARGIN_L, leftY, 8.5, false, [0.3, 0.34, 0.4]);
    leftY -= 12;
  }

  let midY = y;
  drawText(input.buyer.name || "-", 235, midY, 10, true);
  midY -= 13;
  for (const line of partyLegalLines(input.buyer, country)) {
    drawText(line, 235, midY, 8.5, false, [0.3, 0.34, 0.4]);
    midY -= 12;
  }

  let rightY = startPartyY;
  const metaRows: Array<[string, string]> = [
    [labels.issueDate, input.issueDate],
  ];
  if (input.supplyDate) {
    metaRows.push([labels.supplyDate, input.supplyDate]);
  }
  if (input.dueDate) {
    metaRows.push([
      input.kind === "estimate" ? labels.validUntil : labels.dueDate,
      input.dueDate,
    ]);
  }
  if (input.buyerReference) {
    metaRows.push([labels.reference, input.buyerReference]);
  }
  if (input.originalInvoiceNumber) {
    metaRows.push([labels.originalInvoice, input.originalInvoiceNumber]);
  }
  for (const [k, v] of metaRows) {
    drawText(k, 415, rightY, 8.5, false, [0.45, 0.5, 0.58]);
    drawTextRight(v, MARGIN_R, rightY, 8.5, true);
    rightY -= 14;
  }

  y = Math.min(leftY, midY, rightY) - 16;

  // ---- Line items table header ----
  drawRect(MARGIN_L, y - 4, MARGIN_R - MARGIN_L, 20, [0.95, 0.96, 0.98]);
  drawText(
    labels.description,
    MARGIN_L + 6,
    y + 3,
    8.5,
    true,
    [0.3, 0.35, 0.42],
  );
  drawTextRight(labels.qty, 340, y + 3, 8.5, true, [0.3, 0.35, 0.42]);
  drawTextRight(labels.unitPrice, 420, y + 3, 8.5, true, [0.3, 0.35, 0.42]);
  drawTextRight(labels.vat, 470, y + 3, 8.5, true, [0.3, 0.35, 0.42]);
  drawTextRight(
    labels.total,
    MARGIN_R - 6,
    y + 3,
    8.5,
    true,
    [0.3, 0.35, 0.42],
  );
  y -= 18;

  for (const item of input.lines) {
    const descLines = wrapText(item.description, 46);
    const rowHeight = Math.max(18, descLines.length * 12 + 6);
    ensureSpace(rowHeight + 10);
    descLines.forEach((dl, idx) => {
      drawText(dl, MARGIN_L + 6, y - idx * 12, 9, idx === 0);
    });
    drawTextRight(String(item.quantity), 340, y, 9);
    drawTextRight(fmtAmount(item.unitPrice, input.currency), 420, y, 9);
    drawTextRight(`${Math.round(item.taxRate * 100)}%`, 470, y, 9);
    drawTextRight(
      fmtAmount(item.lineTotal, input.currency),
      MARGIN_R - 6,
      y,
      9,
      true,
    );
    y -= rowHeight;
    drawHLine(y + 4, [0.92, 0.93, 0.95]);
  }

  y -= 10;
  ensureSpace(140);

  // ---- Totals block right ----
  const totalsTopY = y;
  let totalsY = y;
  drawText(labels.subtotal, 360, totalsY, 9.5, false, [0.35, 0.4, 0.48]);
  drawTextRight(
    fmtAmount(input.subtotal, input.currency),
    MARGIN_R - 6,
    totalsY,
    9.5,
  );
  totalsY -= 16;

  // Group VAT by rate
  const vatByRate = new Map<number, number>();
  for (const item of input.lines) {
    const ratePct = Math.round(item.taxRate * 100);
    vatByRate.set(ratePct, (vatByRate.get(ratePct) ?? 0) + item.taxAmount);
  }
  if (vatByRate.size > 0) {
    for (const [ratePct, amt] of vatByRate.entries()) {
      drawText(
        `${labels.vatTotal} (${ratePct}%)`,
        360,
        totalsY,
        9.5,
        false,
        [0.35, 0.4, 0.48],
      );
      drawTextRight(fmtAmount(amt, input.currency), MARGIN_R - 6, totalsY, 9.5);
      totalsY -= 15;
    }
  } else {
    drawText(labels.vatTotal, 360, totalsY, 9.5, false, [0.35, 0.4, 0.48]);
    drawTextRight(
      fmtAmount(input.taxAmount, input.currency),
      MARGIN_R - 6,
      totalsY,
      9.5,
    );
    totalsY -= 15;
  }

  currentOps().push(
    `0.14 0.38 0.92 RG 1.2 w 360 ${(totalsY + 8).toFixed(2)} m ${MARGIN_R} ${(totalsY + 8).toFixed(2)} l S`,
  );
  totalsY -= 6;
  drawText(labels.grandTotal, 360, totalsY, 11, true);
  drawTextRight(
    fmtAmount(input.total, input.currency),
    MARGIN_R - 6,
    totalsY,
    11,
    true,
  );
  totalsY -= 16;

  if (input.amountPaid && input.amountPaid > 0) {
    drawText(labels.paid, 360, totalsY, 9.5, false, [0.1, 0.55, 0.3]);
    drawTextRight(
      `-${fmtAmount(input.amountPaid, input.currency)}`,
      MARGIN_R - 6,
      totalsY,
      9.5,
      false,
      [0.1, 0.55, 0.3],
    );
    totalsY -= 15;
    const due = input.amountDue ?? Math.max(0, input.total - input.amountPaid);
    drawText(labels.amountDue, 360, totalsY, 10.5, true);
    drawTextRight(
      fmtAmount(due, input.currency),
      MARGIN_R - 6,
      totalsY,
      10.5,
      true,
    );
    totalsY -= 16;
  }

  // ---- Payment details & QR code on the left side of totals ----
  let payY = totalsTopY;
  let linkAnnotation: {
    pageIdx: number;
    rect: [number, number, number, number];
    uri: string;
  } | null = null;
  if (input.bankIban || input.paymentUrl || input.paymentQr) {
    drawText(
      labels.paymentDetails.toUpperCase(),
      MARGIN_L,
      payY,
      8.5,
      true,
      [0.3, 0.35, 0.42],
    );
    payY -= 14;
    if (input.bankHolder) {
      drawText(input.bankHolder, MARGIN_L, payY, 8.5);
      payY -= 12;
    }
    if (input.bankIban) {
      drawText(`${labels.iban}: ${input.bankIban}`, MARGIN_L, payY, 8.5, true);
      payY -= 12;
    }
    if (input.bankBic) {
      drawText(`${labels.bic}: ${input.bankBic}`, MARGIN_L, payY, 8.5);
      payY -= 12;
    }
    if (input.paymentUrl) {
      drawText(
        `${labels.payOnline}:`,
        MARGIN_L,
        payY,
        8.5,
        true,
        [0.14, 0.38, 0.92],
      );
      payY -= 11;
      const shownUrl = input.paymentUrl.slice(0, 58);
      drawText(shownUrl, MARGIN_L, payY, 7.5, false, [0.14, 0.38, 0.92]);
      linkAnnotation = {
        pageIdx,
        rect: [MARGIN_L, payY - 3, MARGIN_L + 260, payY + 10],
        uri: input.paymentUrl,
      };
      payY -= 14;
    }

    if (input.paymentQr) {
      const qrSize = 86;
      const qrX = MARGIN_L;
      const qrTopY = payY - 4;
      const qrBottomY = qrTopY - qrSize;
      if (qrBottomY >= 60) {
        const matrix = getQrMatrix(input.paymentQr.payload);
        const modSize = qrSize / matrix.length;
        currentOps().push("0 0 0 rg");
        for (let r = 0; r < matrix.length; r++) {
          for (let c = 0; c < matrix.length; c++) {
            if (matrix[r][c]) {
              const rx = qrX + c * modSize;
              const ry = qrTopY - (r + 1) * modSize;
              currentOps().push(
                `${rx.toFixed(2)} ${ry.toFixed(2)} ${modSize.toFixed(2)} ${modSize.toFixed(2)} re f`,
              );
            }
          }
        }
        drawText(
          input.paymentQr.kind === "PAY_BY_SQUARE"
            ? "PAY by square"
            : labels.scanToPay,
          qrX + qrSize + 10,
          qrTopY - 14,
          8.5,
          true,
          [0.25, 0.3, 0.38],
        );
        payY = qrBottomY - 10;
      }
    }
  }

  y = Math.min(totalsY, payY) - 14;

  // ---- Notes & Legal Notices ----
  const allNotes = (input.notes ?? []).filter((n) => n.trim().length > 0);
  if (allNotes.length > 0) {
    ensureSpace(40);
    drawHLine(y + 6);
    y -= 8;
    drawText(
      labels.notes.toUpperCase(),
      MARGIN_L,
      y,
      8,
      true,
      [0.45, 0.5, 0.58],
    );
    y -= 13;
    for (const note of allNotes) {
      for (const wrapped of wrapText(note, 96)) {
        ensureSpace(16);
        drawText(wrapped, MARGIN_L, y, 8.5, false, [0.3, 0.34, 0.4]);
        y -= 12;
      }
    }
  }

  // ---- Page footers ----
  for (let i = 0; i < pages.length; i++) {
    pages[i].push(
      `BT 0.5 0.54 0.6 rg /F1 8 Tf 1 0 0 1 ${MARGIN_L} 28 Tm (${pdfSafeText(`${input.seller.name} - ${input.documentNumber}`)}) Tj ET`,
      `BT 0.5 0.54 0.6 rg /F1 8 Tf 1 0 0 1 500 28 Tm (${pdfSafeText(`${labels.page} ${i + 1} / ${pages.length}`)}) Tj ET`,
    );
  }

  // ---- Assemble PDF/A-3B object table ----
  const objects: Array<{ id: number; body: Uint8Array }> = [];
  const encoder = new TextEncoder();
  const addObj = (body: string | Uint8Array): number => {
    const id = objects.length + 1;
    objects.push({
      id,
      body: typeof body === "string" ? encoder.encode(body) : body,
    });
    return id;
  };

  // Reserve IDs 1 (Catalog) and 2 (Pages)
  const catalogId = addObj("");
  const pagesId = addObj("");
  const fontRegularId = addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  );
  const fontBoldId = addObj(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  );

  // XMP Metadata stream (PDF/A-3B + Factur-X)
  const hasZugferd = Boolean(input.zugferdXml && input.zugferdXml.length > 0);
  const xmpBytes = encoder.encode(
    buildXmpMetadata(hasZugferd, `${title} ${input.documentNumber}`),
  );
  const metadataId = addObj(
    concatBytes([
      encoder.encode(
        `<< /Type /Metadata /Subtype /XML /Length ${xmpBytes.length} >>\nstream\n`,
      ),
      xmpBytes,
      encoder.encode("\nendstream"),
    ]),
  );

  // Embedded ZUGFeRD / Factur-X XML attachment
  let fileSpecId: number | null = null;
  let namesId: number | null = null;
  if (hasZugferd && input.zugferdXml) {
    const xmlBytes = encoder.encode(input.zugferdXml);
    const embeddedStreamId = addObj(
      concatBytes([
        encoder.encode(
          `<< /Type /EmbeddedFile /Subtype /text#2Fxml /Length ${xmlBytes.length} /Params << /Size ${xmlBytes.length} >> >>\nstream\n`,
        ),
        xmlBytes,
        encoder.encode("\nendstream"),
      ]),
    );
    fileSpecId = addObj(
      `<< /Type /Filespec /F (factur-x.xml) /UF (factur-x.xml) /Desc (Factur-X / ZUGFeRD EN 16931 XML Invoice) /AFRelationship /Alternative /EF << /F ${embeddedStreamId} 0 R /UF ${embeddedStreamId} 0 R >> >>`,
    );
    namesId = addObj(
      `<< /EmbeddedFiles << /Names [(factur-x.xml) ${fileSpecId} 0 R] >> >>`,
    );
  }

  // Optional URI Link Annotation for online payment button
  let linkAnnotId: number | null = null;
  if (linkAnnotation) {
    const [x1, y1, x2, y2] = linkAnnotation.rect;
    linkAnnotId = addObj(
      `<< /Type /Annot /Subtype /Link /Rect [${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${pdfSafeText(linkAnnotation.uri)}) >> >>`,
    );
  }

  const pageIds: number[] = [];
  for (let i = 0; i < pages.length; i++) {
    const streamBytes = encoder.encode(pages[i].join("\n"));
    const contentId = addObj(
      concatBytes([
        encoder.encode(`<< /Length ${streamBytes.length} >>\nstream\n`),
        streamBytes,
        encoder.encode("\nendstream"),
      ]),
    );
    const annotsEntry =
      linkAnnotation && linkAnnotation.pageIdx === i && linkAnnotId
        ? ` /Annots [${linkAnnotId} 0 R]`
        : "";
    const pageObjId = addObj(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W.toFixed(2)} ${PAGE_H.toFixed(2)}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R${annotsEntry} >>`,
    );
    pageIds.push(pageObjId);
  }

  // OutputIntent for PDF/A-3B
  const outputIntentId = addObj(
    `<< /Type /OutputIntent /S /GTS_PDFA1 /OutputConditionIdentifier (sRGB IEC61966-2.1) /Info (sRGB IEC61966-2.1) >>`,
  );

  // Fill Catalog & Pages
  const afEntry = fileSpecId ? ` /AF [${fileSpecId} 0 R]` : "";
  const namesEntry = namesId ? ` /Names ${namesId} 0 R` : "";
  objects[catalogId - 1].body = encoder.encode(
    `<< /Type /Catalog /Pages ${pagesId} 0 R /Metadata ${metadataId} 0 R /OutputIntents [${outputIntentId} 0 R]${namesEntry}${afEntry} >>`,
  );
  objects[pagesId - 1].body = encoder.encode(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`,
  );

  // Serialize PDF with exact byte-offset xref table
  const chunks: Uint8Array[] = [];
  const header = encoder.encode("%PDF-1.7\n%\u00e2\u00e3\u00cf\u00d3\n");
  chunks.push(header);
  let offset = header.length;
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(offset);
    const prefix = encoder.encode(`${obj.id} 0 obj\n`);
    const suffix = encoder.encode("\nendobj\n");
    chunks.push(prefix, obj.body, suffix);
    offset += prefix.length + obj.body.length + suffix.length;
  }

  const xrefOffset = offset;
  const xrefLines = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((o) => `${String(o).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF\n",
  ];
  chunks.push(encoder.encode(xrefLines.join("\n")));

  return concatBytes(chunks);
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const part of parts) {
    total += part.length;
  }
  const out = new Uint8Array(total);
  let pos = 0;
  for (const part of parts) {
    out.set(part, pos);
    pos += part.length;
  }
  return out;
}
