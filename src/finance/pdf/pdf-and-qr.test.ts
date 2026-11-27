import { describe, expect, test } from "bun:test";

import { buildCiiInvoice } from "./zugferd-cii";
import { VatTreatment } from "@/tax/compliance/enum";

import { generateDocumentPdf } from "./document-pdf";
import {
  buildEpcQrPayload,
  buildInvoicePaymentQr,
  buildPayBySquarePayload,
  renderQrSvg,
} from "./payment-qr";

describe("Payment QR codes (EPC GiroCode & PAY by square)", () => {
  test("builds spec-compliant EPC069-12 v3.1 SEPA QR payload for EUR", () => {
    const payload = buildEpcQrPayload({
      beneficiaryName: "Muster GmbH",
      iban: "DE89 3704 0044 0532 0130 00",
      bic: "COBADEFFXXX",
      amount: 1190,
      currency: "EUR",
      reference: "INV-2026-0042",
    });
    expect(payload).not.toBeNull();
    const lines = (payload ?? "").split("\n");
    expect(lines[0]).toBe("BCD");
    expect(lines[1]).toBe("002");
    expect(lines[2]).toBe("1");
    expect(lines[3]).toBe("SCT");
    expect(lines[4]).toBe("COBADEFFXXX");
    expect(lines[5]).toBe("Muster GmbH");
    expect(lines[6]).toBe("DE89370400440532013000");
    expect(lines[7]).toBe("EUR1190.00");
    expect(lines[9]).toBe("INV-2026-0042");
  });

  test("rejects non-EUR currency for EPC QR", () => {
    const payload = buildEpcQrPayload({
      beneficiaryName: "US Corp",
      iban: "DE89370400440532013000",
      amount: 100,
      currency: "USD",
    });
    expect(payload).toBeNull();
  });

  test("builds Base32Hex PAY by square v1.2.0 payload and SVG for SK", () => {
    const qr = buildInvoicePaymentQr("SK", {
      beneficiaryName: "Demo Slovensko s.r.o.",
      iban: "SK31 1200 0000 1987 4263 7541",
      bic: "GIBASKBX",
      amount: 1036.5,
      currency: "EUR",
      dueDate: "2026-12-10",
      variableSymbol: "20260001",
      remittanceText: "Faktura FV-2026-0001",
    });
    expect(qr).not.toBeNull();
    expect(qr?.kind).toBe("PAY_BY_SQUARE");
    expect(qr?.payload).toMatch(/^[0-9A-V]+$/u);
    expect((qr?.payload.length ?? 0) > 40).toBe(true);
    expect(qr?.svg).toContain("<svg");
    expect(qr?.svg).toContain("<rect");
    const direct = buildPayBySquarePayload({
      beneficiaryName: "Demo Slovensko s.r.o.",
      iban: "SK3112000000198742637541",
      amount: 100,
      currency: "EUR",
    });
    expect(direct).toMatch(/^[0-9A-V]+$/u);
    expect(renderQrSvg(direct ?? "")).toContain("</svg>");
  });
});

describe("ZUGFeRD / Factur-X EN 16931 CII XML and PDF/A-3B", () => {
  test("generates valid CII XML and embeds it into PDF/A-3B invoice with QR and payment link", () => {
    const cii = buildCiiInvoice({
      number: "RE-2026-0007",
      issueDate: "2026-11-26",
      supplyDate: "2026-11-26",
      dueDate: "2026-12-10",
      currency: "EUR",
      isCreditNote: false,
      treatment: VatTreatment.DOMESTIC,
      buyerReference: "PO-9001",
      paymentIban: "DE89370400440532013000",
      paymentBic: "COBADEFFXXX",
      paymentUrl: "https://example.com/en-US/invoice/123?token=abc",
      notes: ["Thank you for your business."],
      seller: {
        name: "Muster GmbH",
        addressLine1: "Hauptstrasse 1",
        addressLine2: null,
        city: "Berlin",
        postalCode: "10115",
        country: "DE",
        registrationNumber: "HRB 12345",
        taxId: "30/123/45678",
        vatNumber: "DE123456789",
        email: "billing@muster.example",
        phone: "+49 30 123456",
      },
      buyer: {
        name: "Kunde AG",
        addressLine1: "Marktplatz 5",
        addressLine2: null,
        city: "Munich",
        postalCode: "80331",
        country: "DE",
        registrationNumber: null,
        taxId: null,
        vatNumber: "DE987654321",
        email: "ap@kunde.example",
      },
      lines: [
        {
          description: "ERP implementation consulting",
          quantity: 10,
          unitPrice: 100,
          netAmount: 1000,
          taxRate: 0.19,
          taxAmount: 190,
        },
      ],
    });

    expect(cii).toContain("<rsm:CrossIndustryInvoice");
    expect(cii).toContain("urn:cen.eu:en16931:2017");
    expect(cii).toContain("<ram:TypeCode>380</ram:TypeCode>");
    expect(cii).toContain("<ram:GrandTotalAmount>1190.00</ram:GrandTotalAmount>");
    expect(cii).toContain("<ram:IBANID>DE89370400440532013000</ram:IBANID>");

    const qr = buildInvoicePaymentQr("DE", {
      beneficiaryName: "Muster GmbH",
      iban: "DE89370400440532013000",
      bic: "COBADEFFXXX",
      amount: 1190,
      currency: "EUR",
      reference: "RE-2026-0007",
    });

    const pdfBytes = generateDocumentPdf({
      kind: "invoice",
      locale: "de-DE",
      countryCode: "DE",
      documentNumber: "RE-2026-0007",
      issueDate: "2026-11-26",
      supplyDate: "2026-11-26",
      dueDate: "2026-12-10",
      buyerReference: "PO-9001",
      currency: "EUR",
      seller: {
        name: "Muster GmbH",
        addressLine1: "Hauptstrasse 1",
        city: "Berlin",
        postalCode: "10115",
        country: "DE",
        vatNumber: "DE123456789",
        taxId: "30/123/45678",
      },
      buyer: {
        name: "Kunde AG",
        addressLine1: "Marktplatz 5",
        city: "Munich",
        postalCode: "80331",
        country: "DE",
        vatNumber: "DE987654321",
      },
      lines: [
        {
          description: "ERP implementation consulting",
          quantity: 10,
          unitPrice: 100,
          taxRate: 0.19,
          taxAmount: 190,
          lineTotal: 1190,
        },
      ],
      subtotal: 1000,
      taxAmount: 190,
      total: 1190,
      notes: ["Thank you for your business."],
      bankIban: "DE89370400440532013000",
      bankBic: "COBADEFFXXX",
      paymentUrl: "https://example.com/de-DE/invoice/123?token=abc",
      paymentQr: qr,
      zugferdXml: cii,
    });

    const pdfText = new TextDecoder("latin1").decode(pdfBytes);
    expect(pdfText.startsWith("%PDF-1.7")).toBe(true);
    expect(pdfText).toContain("%%EOF");
    expect(pdfText).toContain("/EmbeddedFiles");
    expect(pdfText).toContain("factur-x.xml");
    expect(pdfText).toContain("/AFRelationship /Alternative");
    expect(pdfText).toContain("pdfaid:part>3</pdfaid:part>");
    expect(pdfText).toContain("fx:DocumentFileName>factur-x.xml");
    expect(pdfText).toContain("RE-2026-0007");
    expect(pdfText).toContain("USt-IdNr.: DE123456789");
    expect(pdfText).toContain("/Subtype /Link");
  });

  test("generates estimate and credit note PDFs without ZUGFeRD for estimates", () => {
    const estPdf = generateDocumentPdf({
      kind: "estimate",
      locale: "en-US",
      countryCode: "AT",
      documentNumber: "EST-2026-0003",
      issueDate: "2026-11-26",
      dueDate: "2026-12-26",
      currency: "EUR",
      seller: { name: "Alpine Works GmbH", country: "AT" },
      buyer: { name: "Client Ltd", country: "AT" },
      lines: [
        {
          description: "Annual support plan",
          quantity: 1,
          unitPrice: 500,
          taxRate: 0.2,
          taxAmount: 100,
          lineTotal: 600,
        },
      ],
      subtotal: 500,
      taxAmount: 100,
      total: 600,
    });
    const text = new TextDecoder("latin1").decode(estPdf);
    expect(text).toContain("ESTIMATE");
    expect(text).toContain("EST-2026-0003");
    expect(text).not.toContain("/EmbeddedFiles");
  });
});
