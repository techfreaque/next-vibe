import { describe, expect, it } from "bun:test";

import { VatTreatment } from "@/tax/compliance/enum";

import {
  buildUblInvoice,
  escapeXml,
  PEPPOL_CUSTOMIZATION_ID,
  PEPPOL_PROFILE_ID,
  type UblInvoiceInput,
  type UblParty,
  ublEndpoint,
  ublTotals,
  validateUblInput,
  XRECHNUNG_CUSTOMIZATION_ID,
} from "./ubl";

const seller: UblParty = {
  name: "Tatra Ledger s.r.o.",
  addressLine1: "Hlavná 1",
  addressLine2: null,
  city: "Bratislava",
  postalCode: "811 01",
  country: "SK",
  registrationNumber: "35757442",
  taxId: "2020123456",
  vatNumber: "SK2020123456",
  email: "billing@tatra.example",
};

const skBuyer: UblParty = {
  name: "Dunaj a.s.",
  addressLine1: "Obchodná 5",
  addressLine2: null,
  city: "Košice",
  postalCode: "040 01",
  country: "SK",
  registrationNumber: "31322832",
  taxId: "2021000000",
  vatNumber: "SK2021000000",
  email: null,
};

const czBuyer: UblParty = {
  name: "Vltava s.r.o.",
  addressLine1: "Národní 10",
  addressLine2: null,
  city: "Praha",
  postalCode: "110 00",
  country: "CZ",
  registrationNumber: "12345678",
  taxId: null,
  vatNumber: "CZ12345678",
  email: null,
};

function base(overrides: Partial<UblInvoiceInput> = {}): UblInvoiceInput {
  return {
    documentType: "INVOICE",
    number: "2026000042",
    issueDate: "2026-11-20",
    dueDate: "2026-12-04",
    supplyDate: "2026-11-18",
    currency: "EUR",
    treatment: VatTreatment.DOMESTIC,
    vatPayer: true,
    notes: [],
    exemptionReason: null,
    buyerReference: null,
    originalInvoice: null,
    iban: null,
    seller,
    buyer: skBuyer,
    lines: [
      {
        description: "Consulting",
        quantity: 2,
        unitPrice: 100,
        taxRate: 0.23,
        taxAmount: 46,
        lineTotal: 246,
      },
      {
        description: "Hosting",
        quantity: 3,
        unitPrice: 9.99,
        taxRate: 0.23,
        taxAmount: 6.89,
        lineTotal: 36.86,
      },
    ],
    ...overrides,
  };
}

function count(xml: string, needle: string): number {
  return xml.split(needle).length - 1;
}

describe("buildUblInvoice", () => {
  it("builds a Slovak domestic 23 % invoice", () => {
    const input = base();
    const xml = buildUblInvoice(input);
    expect(validateUblInput(input)).toEqual([]);
    expect(xml).toContain(`<cbc:CustomizationID>${PEPPOL_CUSTOMIZATION_ID}</cbc:CustomizationID>`);
    expect(xml).toContain(`<cbc:ProfileID>${PEPPOL_PROFILE_ID}</cbc:ProfileID>`);
    expect(xml).toContain("<cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>");
    expect(xml).toContain("<cbc:DueDate>2026-12-04</cbc:DueDate>");
    expect(xml).toContain("<cbc:TaxPointDate>2026-11-18</cbc:TaxPointDate>");
    expect(xml).toContain('<cbc:EndpointID schemeID="9950">SK2020123456</cbc:EndpointID>');
    expect(xml).toContain("<cbc:IdentificationCode>SK</cbc:IdentificationCode>");
    expect(xml).toContain(
      "<cac:PartyTaxScheme><cbc:CompanyID>SK2020123456</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>",
    );
    expect(xml).toContain("<cbc:CompanyID>35757442</cbc:CompanyID>");
    expect(count(xml, "<cac:TaxSubtotal>")).toBe(1);
    expect(xml).toContain(
      '<cbc:TaxableAmount currencyID="EUR">229.97</cbc:TaxableAmount><cbc:TaxAmount currencyID="EUR">52.89</cbc:TaxAmount><cac:TaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>23</cbc:Percent>',
    );
    expect(xml).toContain('<cbc:PayableAmount currencyID="EUR">282.86</cbc:PayableAmount>');
    expect(xml).toContain('<cbc:InvoicedQuantity unitCode="C62">3.00</cbc:InvoicedQuantity>');
    expect(xml).toContain('<cbc:PriceAmount currencyID="EUR">9.99</cbc:PriceAmount>');
    expect(xml).not.toContain("TaxExemptionReason");
    expect(xml).not.toContain("PaymentMeans");
    expect(xml).not.toMatch(/<([a-zA-Z:]+)[^>]*><\/\1>/);
  });

  it("marks a reverse charge invoice to a Czech customer as AE", () => {
    const input = base({
      treatment: VatTreatment.EU_SERVICES_REVERSE_CHARGE,
      buyer: czBuyer,
      notes: ["Prenesenie daňovej povinnosti"],
      exemptionReason: "Prenesenie daňovej povinnosti",
      lines: [
        {
          description: "Software license",
          quantity: 1,
          unitPrice: 500,
          taxRate: 0,
          taxAmount: 0,
          lineTotal: 500,
        },
      ],
    });
    const xml = buildUblInvoice(input);
    expect(validateUblInput(input)).toEqual([]);
    expect(xml).toContain('<cbc:EndpointID schemeID="9929">CZ12345678</cbc:EndpointID>');
    expect(xml).toContain(
      "<cac:TaxCategory><cbc:ID>AE</cbc:ID><cbc:Percent>0</cbc:Percent><cbc:TaxExemptionReasonCode>VATEX-EU-AE</cbc:TaxExemptionReasonCode><cbc:TaxExemptionReason>Prenesenie daňovej povinnosti</cbc:TaxExemptionReason>",
    );
    expect(xml).toContain(
      "<cac:ClassifiedTaxCategory><cbc:ID>AE</cbc:ID><cbc:Percent>0</cbc:Percent><cac:TaxScheme>",
    );
    expect(xml).toContain("<cbc:Note>Prenesenie daňovej povinnosti</cbc:Note>");
    expect(xml).toContain('<cbc:TaxAmount currencyID="EUR">0.00</cbc:TaxAmount>');

    expect(validateUblInput({ ...input, buyer: { ...czBuyer, vatNumber: null } })).toContain(
      "BT-48",
    );
  });

  it("builds a credit note with a billing reference and positive amounts", () => {
    const input = base({
      documentType: "CREDIT_NOTE",
      number: "2026000050",
      dueDate: null,
      originalInvoice: { number: "2026000042", issueDate: "2026-11-20" },
      lines: [
        {
          description: "Consulting",
          quantity: 1,
          unitPrice: -100,
          taxRate: 0.23,
          taxAmount: -23,
          lineTotal: -123,
        },
      ],
    });
    const xml = buildUblInvoice(input);
    expect(validateUblInput(input)).toEqual([]);
    expect(xml).toContain(
      '<CreditNote xmlns="urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2"',
    );
    expect(xml).toContain("<cbc:CreditNoteTypeCode>381</cbc:CreditNoteTypeCode>");
    expect(xml).toContain(
      "<cac:BillingReference><cac:InvoiceDocumentReference><cbc:ID>2026000042</cbc:ID><cbc:IssueDate>2026-11-20</cbc:IssueDate></cac:InvoiceDocumentReference></cac:BillingReference>",
    );
    expect(xml).toContain('<cbc:CreditedQuantity unitCode="C62">1.00</cbc:CreditedQuantity>');
    expect(xml).toContain('<cbc:PayableAmount currencyID="EUR">123.00</cbc:PayableAmount>');
    expect(xml).not.toContain("<cbc:DueDate>");
    expect(xml).not.toMatch(/>-\d/);
    // Tax point date comes before the type code in a UBL 2.1 credit note.
    expect(xml.indexOf("TaxPointDate")).toBeLessThan(xml.indexOf("CreditNoteTypeCode"));
  });

  it("uses category O without percent or VAT ids for a non payer", () => {
    const nonPayer: UblParty = { ...seller, vatNumber: null };
    const input = base({
      vatPayer: false,
      seller: nonPayer,
      lines: [
        {
          description: "Translation",
          quantity: 1,
          unitPrice: 80,
          taxRate: 0,
          taxAmount: 0,
          lineTotal: 80,
        },
      ],
    });
    const xml = buildUblInvoice(input);
    expect(validateUblInput(input)).toEqual([]);
    expect(xml).toContain('<cbc:EndpointID schemeID="0245">2020123456</cbc:EndpointID>');
    expect(xml).toContain(
      "<cac:TaxCategory><cbc:ID>O</cbc:ID><cbc:TaxExemptionReasonCode>VATEX-EU-O</cbc:TaxExemptionReasonCode><cbc:TaxExemptionReason>Not subject to VAT</cbc:TaxExemptionReason>",
    );
    expect(xml).not.toContain("<cbc:Percent>");
    expect(xml).not.toContain("PartyTaxScheme");
  });

  it("escapes XML in all text", () => {
    const input = base({
      seller: { ...seller, name: 'Smith & Sons <"Ltd">' },
      lines: [
        {
          description: "Fish & <chips> 'special'",
          quantity: 1,
          unitPrice: 10,
          taxRate: 0.23,
          taxAmount: 2.3,
          lineTotal: 12.3,
        },
      ],
    });
    const xml = buildUblInvoice(input);
    expect(xml).toContain("Smith &amp; Sons &lt;&quot;Ltd&quot;&gt;");
    expect(xml).toContain("<cbc:Name>Fish &amp; &lt;chips&gt; &apos;special&apos;</cbc:Name>");
    expect(xml).not.toContain("Fish & <");
    expect(escapeXml("a&b")).toBe("a&amp;b");
  });

  it("totals add up across mixed rates", () => {
    const input = base({
      lines: [
        {
          description: "Standard",
          quantity: 1,
          unitPrice: 10.01,
          taxRate: 0.23,
          taxAmount: 2.3,
          lineTotal: 12.31,
        },
        {
          description: "Reduced",
          quantity: 7,
          unitPrice: 1.43,
          taxRate: 0.19,
          taxAmount: 1.9,
          lineTotal: 11.91,
        },
        {
          description: "Books",
          quantity: 1,
          unitPrice: 20,
          taxRate: 0.05,
          taxAmount: 1,
          lineTotal: 21,
        },
      ],
    });
    const totals = ublTotals(input);
    const gross = input.lines.reduce((sum, line) => sum + Math.round(line.lineTotal * 100), 0);
    expect(totals.taxInclusiveCents).toBe(gross);
    expect(totals.lineExtensionCents + totals.taxCents).toBe(totals.payableCents);
    const xml = buildUblInvoice(input);
    expect(count(xml, "<cac:TaxSubtotal>")).toBe(3);
    expect(xml).toContain(
      '<cbc:TaxInclusiveAmount currencyID="EUR">45.22</cbc:TaxInclusiveAmount>',
    );
    expect(xml).toContain(
      '<cbc:LineExtensionAmount currencyID="EUR">40.02</cbc:LineExtensionAmount>',
    );
  });

  it("reports missing mandatory fields", () => {
    const input = base({
      dueDate: null,
      seller: { ...seller, vatNumber: null, taxId: null, registrationNumber: null },
      buyer: null,
    });
    expect(validateUblInput(input)).toEqual(["BT-9", "BT-31", "BT-34", "BT-44", "BT-49", "BT-55"]);
  });

  it("resolves endpoint schemes", () => {
    expect(ublEndpoint({ ...czBuyer, vatNumber: "DE 123 456 789" })).toEqual({
      scheme: "9930",
      id: "DE123456789",
    });
    expect(
      ublEndpoint({
        ...czBuyer,
        vatNumber: null,
        country: "BE",
        registrationNumber: "0123.456.789",
      }),
    ).toEqual({ scheme: "0208", id: "0123456789" });
    expect(ublEndpoint({ ...skBuyer, vatNumber: null, taxId: null })).toEqual({
      scheme: "0158",
      id: "31322832",
    });
  });
});

describe("country e-invoice formats", () => {
  it("uses Slovak DIČ as the Peppol address and reports missing domestic street details", () => {
    const input = base({ buyer: { ...skBuyer, addressLine1: null } });
    expect(validateUblInput(input, "sk-efaktura")).toEqual(["BT-50"]);
    expect(buildUblInvoice(input, "sk-efaktura")).toContain(
      '<cbc:EndpointID schemeID="0245">2020123456</cbc:EndpointID>',
    );
  });

  it("builds a German small-business XRechnung with buyer reference and card payment terms", () => {
    const input = base({
      seller: { ...seller, country: "DE", vatNumber: null, phone: "+49 30 123456" },
      buyer: { ...skBuyer, country: "DE", vatNumber: null, email: "invoice@buyer.example" },
      vatPayer: false,
      smallBusinessExemption: true,
      buyerReference: "ORDER-1",
      paymentUrl: "https://pay.example/invoice?i=1&sig=2",
      exemptionReason: "Steuerbefreiung für Kleinunternehmer gemäß § 19 UStG",
      lines: [
        {
          description: "Design",
          quantity: 1,
          unitPrice: 50,
          taxRate: 0,
          taxAmount: 0,
          lineTotal: 50,
        },
      ],
    });
    expect(validateUblInput(input, "xrechnung")).toEqual([]);
    expect(validateUblInput({ ...input, buyerReference: null }, "xrechnung")).toContain("BT-10");
    const xml = buildUblInvoice(input, "xrechnung");
    expect(xml).toContain(
      `<cbc:CustomizationID>${XRECHNUNG_CUSTOMIZATION_ID}</cbc:CustomizationID>`,
    );
    expect(xml).toContain('<cbc:EndpointID schemeID="EM">invoice@buyer.example</cbc:EndpointID>');
    expect(xml).toContain("<cbc:BuyerReference>ORDER-1</cbc:BuyerReference>");
    expect(xml).toContain("<cbc:ID>FC</cbc:ID>");
    expect(xml).toContain("<cbc:PaymentMeansCode>48</cbc:PaymentMeansCode>");
    expect(xml).toContain(
      "<cac:PaymentTerms><cbc:Note>https://pay.example/invoice?i=1&amp;sig=2</cbc:Note></cac:PaymentTerms>",
    );
    expect(xml).toContain("<cac:TaxCategory><cbc:ID>E</cbc:ID><cbc:Percent>0</cbc:Percent>");
  });
});
