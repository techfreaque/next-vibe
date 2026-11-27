/**
 * ZUGFeRD 2.3 / Factur-X 1.0 (EN 16931) Cross-Industry Invoice (CII) XML builder.
 */

import { VatTreatment, type VatTreatmentValue } from "@/tax/compliance/enum";

const EN16931_CII_GUIDELINE = "urn:cen.eu:en16931:2017";

export interface ZugferdCiiParty {
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
  phone?: string | null;
}

export interface ZugferdCiiLine {
  description: string;
  quantity: number;
  unitPrice: number;
  netAmount: number;
  taxRate: number;
  taxAmount: number;
}

export interface ZugferdCiiInput {
  number: string;
  issueDate: string;
  supplyDate?: string | null;
  dueDate?: string | null;
  currency: string;
  isCreditNote: boolean;
  treatment: typeof VatTreatmentValue;
  buyerReference?: string | null;
  paymentIban?: string | null;
  paymentBic?: string | null;
  paymentUrl?: string | null;
  notes: string[];
  seller: ZugferdCiiParty;
  buyer: ZugferdCiiParty;
  lines: ZugferdCiiLine[];
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function ciiDate102(isoDate: string): string {
  return isoDate.replaceAll("-", "").slice(0, 8);
}

function formatMoney2(cents: number): string {
  return (cents / 100).toFixed(2);
}

function ciiTaxCategory(
  ratePercent: number,
  treatment: typeof VatTreatmentValue,
): { code: string; exemptionReason?: string } {
  if (ratePercent > 0) {
    return { code: "S" };
  }
  switch (treatment) {
    case VatTreatment.EXEMPT:
      return {
        code: "E",
        exemptionReason: "Exempt from VAT.",
      };
    case VatTreatment.EU_SERVICES_REVERSE_CHARGE:
    case VatTreatment.REVERSE_CHARGE_DOMESTIC:
      return {
        code: "AE",
        exemptionReason:
          "Reverse charge / Steuerschuldnerschaft des Leistungsempfaengers.",
      };
    case VatTreatment.EU_GOODS_EXEMPT:
      return {
        code: "K",
        exemptionReason: "Intra-Community supply exempt from VAT.",
      };
    case VatTreatment.EXPORT_EXEMPT:
      return {
        code: "G",
        exemptionReason: "Export outside the EU exempt from VAT.",
      };
    default:
      return { code: "Z" };
  }
}

export function buildCiiInvoice(input: ZugferdCiiInput): string {
  const typeCode = input.isCreditNote ? "381" : "380";
  const currency = escapeXml(input.currency.toUpperCase());

  const lineTotalsCents = input.lines.map((line) => {
    const netCents = Math.round(line.netAmount * 100);
    const taxCents = Math.round(line.taxAmount * 100);
    const ratePercent = Math.round(line.taxRate * 10000) / 100;
    return { line, netCents, taxCents, ratePercent };
  });

  const taxGroups = new Map<
    string,
    {
      code: string;
      ratePercent: number;
      basisCents: number;
      taxCents: number;
      reason?: string;
    }
  >();

  let sumNetCents = 0;
  let sumTaxCents = 0;

  for (const item of lineTotalsCents) {
    sumNetCents += item.netCents;
    sumTaxCents += item.taxCents;
    const cat = ciiTaxCategory(item.ratePercent, input.treatment);
    const key = `${cat.code}:${item.ratePercent.toFixed(2)}`;
    const existing = taxGroups.get(key);
    if (existing) {
      existing.basisCents += item.netCents;
      existing.taxCents += item.taxCents;
    } else {
      taxGroups.set(key, {
        code: cat.code,
        ratePercent: item.ratePercent,
        basisCents: item.netCents,
        taxCents: item.taxCents,
        reason: cat.exemptionReason,
      });
    }
  }

  const grandTotalCents = sumNetCents + sumTaxCents;
  const sellerName = escapeXml(input.seller.name ?? "Company");
  const buyerName = escapeXml(input.buyer.name ?? "Customer");
  const sellerCountry = escapeXml(
    (input.seller.country ?? "DE").toUpperCase().slice(0, 2),
  );
  const buyerCountry = escapeXml(
    (input.buyer.country ?? sellerCountry).toUpperCase().slice(0, 2),
  );

  const notesXml = input.notes
    .filter((n) => n.trim().length > 0)
    .map(
      (n) =>
        `    <ram:IncludedNote><ram:Content>${escapeXml(n.trim())}</ram:Content></ram:IncludedNote>`,
    )
    .join("\n");

  const lineItemsXml = lineTotalsCents
    .map((item, idx) => {
      const cat = ciiTaxCategory(item.ratePercent, input.treatment);
      const unitNet =
        item.line.quantity !== 0
          ? item.netCents / 100 / item.line.quantity
          : item.line.unitPrice;
      return `    <ram:IncludedSupplyChainTradeLineItem>
      <ram:AssociatedDocumentLineDocument>
        <ram:LineID>${idx + 1}</ram:LineID>
      </ram:AssociatedDocumentLineDocument>
      <ram:SpecifiedTradeProduct>
        <ram:Name>${escapeXml(item.line.description || `Item ${idx + 1}`)}</ram:Name>
      </ram:SpecifiedTradeProduct>
      <ram:SpecifiedLineTradeAgreement>
        <ram:NetPriceProductTradePrice>
          <ram:ChargeAmount>${unitNet.toFixed(4)}</ram:ChargeAmount>
        </ram:NetPriceProductTradePrice>
      </ram:SpecifiedLineTradeAgreement>
      <ram:SpecifiedLineTradeDelivery>
        <ram:BilledQuantity unitCode="C62">${item.line.quantity}</ram:BilledQuantity>
      </ram:SpecifiedLineTradeDelivery>
      <ram:SpecifiedLineTradeSettlement>
        <ram:ApplicableTradeTax>
          <ram:TypeCode>VAT</ram:TypeCode>
          <ram:CategoryCode>${cat.code}</ram:CategoryCode>
          <ram:RateApplicablePercent>${item.ratePercent.toFixed(2)}</ram:RateApplicablePercent>
        </ram:ApplicableTradeTax>
        <ram:SpecifiedTradeSettlementLineMonetarySummation>
          <ram:LineTotalAmount>${formatMoney2(item.netCents)}</ram:LineTotalAmount>
        </ram:SpecifiedTradeSettlementLineMonetarySummation>
      </ram:SpecifiedLineTradeSettlement>
    </ram:IncludedSupplyChainTradeLineItem>`;
    })
    .join("\n");

  const taxBreakdownXml = [...taxGroups.values()]
    .map(
      (g) => `      <ram:ApplicableTradeTax>
        <ram:CalculatedAmount>${formatMoney2(g.taxCents)}</ram:CalculatedAmount>
        <ram:TypeCode>VAT</ram:TypeCode>${g.reason ? `\n        <ram:ExemptionReason>${escapeXml(g.reason)}</ram:ExemptionReason>` : ""}
        <ram:BasisAmount>${formatMoney2(g.basisCents)}</ram:BasisAmount>
        <ram:CategoryCode>${g.code}</ram:CategoryCode>
        <ram:RateApplicablePercent>${g.ratePercent.toFixed(2)}</ram:RateApplicablePercent>
      </ram:ApplicableTradeTax>`,
    )
    .join("\n");

  const sellerTaxRegs: string[] = [];
  if (input.seller.vatNumber) {
    sellerTaxRegs.push(
      `        <ram:SpecifiedTaxRegistration><ram:ID schemeID="VA">${escapeXml(input.seller.vatNumber)}</ram:ID></ram:SpecifiedTaxRegistration>`,
    );
  }
  if (input.seller.taxId) {
    sellerTaxRegs.push(
      `        <ram:SpecifiedTaxRegistration><ram:ID schemeID="FC">${escapeXml(input.seller.taxId)}</ram:ID></ram:SpecifiedTaxRegistration>`,
    );
  }

  const buyerTaxReg = input.buyer.vatNumber
    ? `        <ram:SpecifiedTaxRegistration><ram:ID schemeID="VA">${escapeXml(input.buyer.vatNumber)}</ram:ID></ram:SpecifiedTaxRegistration>`
    : "";

  const paymentMeansXml = input.paymentIban
    ? `      <ram:SpecifiedTradeSettlementPaymentMeans>
        <ram:TypeCode>58</ram:TypeCode>
        <ram:PayeePartyCreditorFinancialAccount>
          <ram:IBANID>${escapeXml(input.paymentIban.replaceAll(/\s+/gu, ""))}</ram:IBANID>
        </ram:PayeePartyCreditorFinancialAccount>${
          input.paymentBic
            ? `\n        <ram:PayeeSpecifiedCreditorFinancialInstitution>\n          <ram:BICID>${escapeXml(input.paymentBic)}</ram:BICID>\n        </ram:PayeeSpecifiedCreditorFinancialInstitution>`
            : ""
        }
      </ram:SpecifiedTradeSettlementPaymentMeans>`
    : "";

  const paymentTermsParts: string[] = [];
  if (input.paymentUrl) {
    paymentTermsParts.push(
      `        <ram:Description>Pay online: ${escapeXml(input.paymentUrl)}</ram:Description>`,
    );
  }
  if (input.dueDate) {
    paymentTermsParts.push(
      `        <ram:DueDateDateTime><udt:DateTimeString format="102">${ciiDate102(input.dueDate)}</udt:DateTimeString></ram:DueDateDateTime>`,
    );
  }
  const paymentTermsXml =
    paymentTermsParts.length > 0
      ? `      <ram:SpecifiedTradePaymentTerms>\n${paymentTermsParts.join("\n")}\n      </ram:SpecifiedTradePaymentTerms>`
      : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>${EN16931_CII_GUIDELINE}</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>${escapeXml(input.number)}</ram:ID>
    <ram:TypeCode>${typeCode}</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${ciiDate102(input.issueDate)}</udt:DateTimeString>
    </ram:IssueDateTime>${notesXml ? `\n${notesXml}` : ""}
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
${lineItemsXml}
    <ram:ApplicableHeaderTradeAgreement>${
      input.buyerReference
        ? `\n      <ram:BuyerReference>${escapeXml(input.buyerReference)}</ram:BuyerReference>`
        : ""
    }
      <ram:SellerTradeParty>
        <ram:Name>${sellerName}</ram:Name>
        <ram:PostalTradeAddress>${
          input.seller.postalCode
            ? `\n          <ram:PostcodeCode>${escapeXml(input.seller.postalCode)}</ram:PostcodeCode>`
            : ""
        }${
          input.seller.addressLine1
            ? `\n          <ram:LineOne>${escapeXml(input.seller.addressLine1)}</ram:LineOne>`
            : ""
        }${
          input.seller.city
            ? `\n          <ram:CityName>${escapeXml(input.seller.city)}</ram:CityName>`
            : ""
        }
          <ram:CountryID>${sellerCountry}</ram:CountryID>
        </ram:PostalTradeAddress>${
          input.seller.email
            ? `\n        <ram:URIUniversalCommunication><ram:URIID schemeID="EM">${escapeXml(input.seller.email)}</ram:URIID></ram:URIUniversalCommunication>`
            : ""
        }${sellerTaxRegs.length > 0 ? `\n${sellerTaxRegs.join("\n")}` : ""}
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${buyerName}</ram:Name>
        <ram:PostalTradeAddress>${
          input.buyer.postalCode
            ? `\n          <ram:PostcodeCode>${escapeXml(input.buyer.postalCode)}</ram:PostcodeCode>`
            : ""
        }${
          input.buyer.addressLine1
            ? `\n          <ram:LineOne>${escapeXml(input.buyer.addressLine1)}</ram:LineOne>`
            : ""
        }${
          input.buyer.city
            ? `\n          <ram:CityName>${escapeXml(input.buyer.city)}</ram:CityName>`
            : ""
        }
          <ram:CountryID>${buyerCountry}</ram:CountryID>
        </ram:PostalTradeAddress>${buyerTaxReg ? `\n${buyerTaxReg}` : ""}
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeDelivery>
      <ram:ActualDeliverySupplyChainEvent>
        <ram:OccurrenceDateTime>
          <udt:DateTimeString format="102">${ciiDate102(input.supplyDate ?? input.issueDate)}</udt:DateTimeString>
        </ram:OccurrenceDateTime>
      </ram:ActualDeliverySupplyChainEvent>
    </ram:ApplicableHeaderTradeDelivery>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:PaymentReference>${escapeXml(input.number)}</ram:PaymentReference>
      <ram:InvoiceCurrencyCode>${currency}</ram:InvoiceCurrencyCode>${paymentMeansXml ? `\n${paymentMeansXml}` : ""}
${taxBreakdownXml}${paymentTermsXml ? `\n${paymentTermsXml}` : ""}
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${formatMoney2(sumNetCents)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${formatMoney2(sumNetCents)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="${currency}">${formatMoney2(sumTaxCents)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${formatMoney2(grandTotalCents)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${formatMoney2(grandTotalCents)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`;
}
