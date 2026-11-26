export const translations = {
  tags: { tax: "Tax", vatReturn: "VAT return" },
  title: "Slovak VAT return and control statement",
  titleShort: "VAT return (SK)",
  description:
    "Prepare the DPH return lines and the kontrolný výkaz XML for a month or quarter.",
  company: { label: "Company", description: "The VAT registered company" },
  period: {
    label: "Period",
    description: "Month or quarter of the return",
    month: "{{month}} {{year}}",
    quarter: "Q{{quarter}} {{year}}",
  },
  unsupportedCountry:
    "The VAT return is prepared for Slovak companies only. Set the company country to Slovakia to use it.",
  disclaimer:
    "We provide tooling, not tax advice. Check filings with your tax adviser before you submit them in eDane.",
  summary: "{{company}}, {{from}} to {{to}}",
  due: "Due on the 25th of the following month, electronically.",
  lines: {
    title: "DPH return lines (DPHv25)",
    line: "Line",
    meaning: "Meaning",
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
    title: "Control statement (KV DPH)",
    section: "Section",
    count: "Rows",
    A1: "A.1 Issued invoices to VAT payers",
    A2: "A.2 Issued domestic reverse charge invoices",
    B1: "B.1 Received invoices, you pay the tax",
    B2: "B.2 Received domestic invoices with deduction",
    B31: "B.3.1 Simplified invoices received (total)",
    C1: "C.1 Issued credit notes",
    D1: "D.1 eKasa turnover",
    D2: "D.2 Other supplies (customers without IČ DPH)",
  },
  warnings: {
    noVatId:
      "The company has no valid IČ DPH. The KV XML needs it before you can submit.",
    customerVatIds:
      "{{count}} invoices have customers without IČ DPH and are reported in D.2.",
    unmappedRates:
      "{{count}} rows use rates outside 23 / 19 / 5 % and are not in the return. Check them.",
    b32Required:
      "Deducted VAT from simplified invoices reached 3,000 EUR. List them per supplier in B.3.2 before you submit.",
  },
  actions: {
    downloadKv: "Download KV DPH XML",
    downloadCsv: "Download return lines (CSV)",
    showXml: "Show XML",
    hideXml: "Hide XML",
    copy: "Copy",
    copied: "Copied",
    copyError: "Could not copy. Select the text and copy it manually.",
  },
  pickCompany: "Choose a company to prepare its VAT return.",
  empty: "No VAT relevant documents in this period.",
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
    description: "Lines and control statement reflect the saved documents.",
  },
};
