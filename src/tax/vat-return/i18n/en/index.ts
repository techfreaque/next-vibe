export const translations = {
  tags: { tax: "Tax", vatReturn: "VAT return" },
  title: "VAT return",
  titleShort: "VAT return",
  description:
    "Your VAT return for the period, in your country's official format.",
  company: {
    label: "Company",
    description: "The company to prepare the filing for",
  },
  period: {
    label: "Period",
    description: "Month or quarter of the return",
    month: "{{month}} {{year}}",
    quarter: "Q{{quarter}} {{year}}",
  },
  disclaimer:
    "We provide tooling, not tax advice. Review filings with your tax adviser before submitting.",
  summary: "{{company}}, {{from}} to {{to}}",
  formats: {
    SK_DPH: "DPH return lines (DPHv25)",
    DE_USTVA: "Umsatzsteuer-Voranmeldung (UStVA)",
    DE_EUR_SMALL_BUSINESS: "EÜR summary (§ 19 UStG small business)",
    AT_UVA: "Umsatzsteuervoranmeldung (U30)",
    AT_EA_SMALL_BUSINESS: "Revenue and expense summary (§ 6 Abs. 1 Z 27 UStG)",
    GENERIC_VAT: "VAT return summary by rate",
  },
  dueByFormat: {
    SK_DPH: "Due on the 25th of the following month, electronically.",
    DE_USTVA: "Due on the 10th of the following month via ELSTER.",
    DE_EUR_SMALL_BUSINESS: "Annual EÜR filing with income tax return.",
    AT_UVA: "Due on the 15th of the second following month via FinanzOnline.",
    AT_EA_SMALL_BUSINESS: "Annual income summary for small businesses.",
    GENERIC_VAT: "Check your local tax authority filing deadline.",
  },
  smallBusiness: {
    title: "No VAT return required under small-business exemption",
    body: {
      SK_DPH: "This company is not VAT registered.",
      DE_USTVA: "No regular UStVA filing is required.",
      DE_EUR_SMALL_BUSINESS:
        "This company uses the § 19 UStG Kleinunternehmer exemption. No regular UStVA is needed. Below is your EÜR revenue and expense summary for the period.",
      AT_UVA: "No regular UVA filing is required.",
      AT_EA_SMALL_BUSINESS:
        "This company uses the § 6 Abs. 1 Z 27 UStG small-business exemption. Below is your revenue and expense summary for the period.",
      GENERIC_VAT: "No VAT return is required for this tax regime.",
    },
  },
  xmlSection: {
    SK_DPH: "Control statement (KV DPH)",
    DE_USTVA: "ELSTER UStVA XML",
    DE_EUR_SMALL_BUSINESS: "XML export",
    AT_UVA: "FinanzOnline UVA XML (U30)",
    AT_EA_SMALL_BUSINESS: "XML export",
    GENERIC_VAT: "XML export",
  },
  xmlNote: {
    SK_DPH: "Upload the KVDPHv25 XML in the eDane portal.",
    DE_USTVA:
      "ELSTER Anmeldungssteuern UStVA XML prepared for tax-advisor import or ERiC transmission. Direct automated ELSTER submission requires an ERiC certificate; you can also copy the Kennzahlen above into Mein ELSTER or download the CSV.",
    DE_EUR_SMALL_BUSINESS: "Use the structured CSV export above for your EÜR.",
    AT_UVA:
      "FinanzOnline U30 XML prepared for portal upload or tax-advisor review. You can also download the structured CSV above.",
    AT_EA_SMALL_BUSINESS: "Use the structured CSV export above.",
    GENERIC_VAT:
      "Use the structured CSV export above for your local tax filing.",
  },
  lines: {
    title: "Return lines",
    line: "Line",
    meaning: "Meaning",
    base: "Taxable base",
    amount: "Amount",
    r01: "Base at 19 %",
    r02: "VAT at 19 %",
    r01a: "Base at 5 %",
    r02a: "VAT at 5 %",
    r03: "Base at 23 %",
    r04: "VAT at 23 %",
    r09: "Reverse charge base at 19 % (you pay the tax)",
    r10: "Reverse charge VAT at 19 %",
    r09a: "Reverse charge base at 5 %",
    r10a: "Reverse charge VAT at 5 %",
    r09b: "Reverse charge base at 23 %",
    r10b: "Reverse charge VAT at 23 %",
    r13: "Exempt supplies",
    r14: "of which intra-EU supplies of goods (§ 43)",
    r15: "of which exports (§§ 46, 47)",
    r17: "Total output VAT",
    r18: "Input VAT deducted at 19 %",
    r18a: "Input VAT deducted at 5 %",
    r19: "Input VAT deducted at 23 %",
    r20: "of which domestic invoices at 19 %",
    r20a: "of which domestic invoices at 5 %",
    r21: "of which domestic invoices at 23 %",
    r24: "Base corrections (credit notes, § 25)",
    r25: "VAT corrections (credit notes, § 25)",
    r32: "VAT payable",
    r33: "Excess deduction (refund)",
  },
  sections: {
    title: "Control statement",
    section: "Section",
    count: "Rows",
    A1: "A.1 Issued invoices to VAT payers",
    A2: "A.2 Issued domestic reverse charge invoices",
    B1: "B.1 Received invoices, you pay the tax",
    B2: "B.2 Received domestic invoices with deduction",
    B31: "B.3.1 Simplified invoices received (total)",
    C1: "C.1 Issued credit notes",
    D1: "D.1 Fiscal register turnover",
    D2: "D.2 Other supplies (customers without VAT ID)",
  },
  warnings: {
    noVatId:
      "The company has no valid VAT ID configured. Add it in company settings before submitting.",
    noTaxId:
      "The company has no tax number (Steuernummer) configured. Add it in company settings before submitting to ELSTER.",
    customerVatIds:
      "{{count}} invoices have customers without a VAT ID and are reported in D.2.",
    unmappedRates:
      "{{count}} rows use non-standard tax rates and are not included in the mapped lines. Review them.",
    b32Required:
      "Deducted VAT from simplified invoices reached 3,000 EUR. List them per supplier in B.3.2 before submitting.",
  },
  actions: {
    downloadXml: "Download XML",
    downloadCsv: "Download CSV",
    showXml: "Show XML",
    hideXml: "Hide XML",
    copy: "Copy",
    copied: "Copied",
    copyError: "Could not copy. Select the text and copy it manually.",
  },
  pickCompany: "Choose a company to prepare its VAT return.",
  empty: "No relevant documents in this period.",
  errors: {
    validation: {
      title: "Invalid request",
      description: "Choose a company and a valid month or quarter.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to prepare VAT returns.",
    },
    forbidden: {
      title: "No access",
      description: "You are not a member of this company.",
    },
    notFound: {
      title: "Company not found",
      description: "The company does not exist or is inactive.",
    },
    conflict: {
      title: "Conflict",
      description: "The data changed while preparing. Try again.",
    },
    server: {
      title: "Return not prepared",
      description: "The VAT return could not be prepared. Try again.",
    },
    network: {
      title: "Network error",
      description: "Check your connection and try again.",
    },
    unknown: {
      title: "Unexpected error",
      description: "Something went wrong. Try again.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first.",
    },
  },
  success: {
    title: "VAT return prepared",
    description: "Return lines and export files reflect the saved documents.",
  },
};
