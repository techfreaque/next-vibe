export const translations = {
  tags: { compliance: "Compliance", tax: "Tax" },
  enums: {
    vatTreatment: {
      domestic: "Domestic sale with VAT",
      reverseChargeDomestic: "Domestic reverse charge",
      euServices: "Services to an EU business (reverse charge)",
      euGoods: "Goods to an EU business (exempt)",
      export: "Export outside the EU (exempt)",
      exempt: "VAT exempt supply",
    },
    severity: {
      error: "Blocks issuing",
      warning: "Check",
      info: "Note",
    },
  },
  issues: {
    issuerAddressMissing:
      "Add the company street, city and postal code. Invoices must show the full address.",
    issuerRegistrationMissing:
      "Add the company registration number (IČO). It must appear on every invoice.",
    issuerRegistrationInvalid:
      "The registration number (IČO) is not valid. It has 8 digits and a check digit.",
    issuerTaxIdMissing:
      "Add the tax number (DIČ). It must appear on every invoice.",
    issuerTaxIdInvalid: "The tax number (DIČ) is not valid. It has 10 digits.",
    issuerVatIdMissing:
      "Add the VAT ID (IČ DPH). VAT registered companies must print it on invoices.",
    issuerVatIdInvalid:
      "The VAT ID (IČ DPH) is not valid. It is SK followed by 10 digits.",
    customerVatIdMissing:
      "Add the customer VAT ID to the billing address. Reverse charge and EU supplies need it.",
    customerVatIdInvalid: "The customer VAT ID is not valid.",
    customerNotForeignEu:
      "EU treatments need a customer VAT ID from another EU country.",
    customerNotDomestic:
      "Domestic reverse charge needs a customer VAT ID from your country.",
    treatmentNotAllowed:
      "This VAT treatment does not fit the company VAT regime. Pick another treatment or update the regime.",
    treatmentRequiresZeroRate:
      "Reverse charge and exempt supplies carry no VAT. Set every line to 0 %.",
    rateNotValidOnDate:
      "{{rate}} % VAT does not apply on {{date}}. Use a rate valid on the supply date.",
    zeroRateWithoutReason:
      "A line has 0 % VAT on a domestic sale. Pick the exemption or reverse charge treatment that applies.",
    issueDeadlinePassed:
      "Issued {{days}} days after the supply. The legal limit is {{limit}} days.",
    regimeNotElected:
      "No VAT regime recorded. The ERP treats the company as a VAT payer until you choose one.",
    chartTemplateMismatch:
      "The chart of accounts does not come from the template for this country.",
    taxRatesMissing:
      "Tax rates for this country are missing. Add them so documents can use them.",
    taxRatesOutdated:
      "Some active tax rates are no longer valid today. Deactivate them or set an end date.",
    fiscalProviderMissing:
      "Cash and card sales need a certified eKasa cash register. POS sales stay blocked until one is connected.",
    eInvoicingUpcoming:
      "Structured e-invoices become mandatory on {{date}}. Peppol UBL export is ready.",
    vatThresholdNear:
      "Turnover this calendar year is {{turnover}}. VAT registration is required above {{threshold}}.",
    vatThresholdExceeded:
      "Turnover this calendar year is {{turnover}}, above the {{threshold}} VAT threshold. Register for VAT.",
  },
  review: {
    title: "Country compliance check",
    titleShort: "Compliance check",
    description:
      "See which legal requirements of the company's country are met and what to fix first.",
    company: {
      label: "Company",
      description: "The company to check",
    },
    disclaimer:
      "We provide tooling, not tax advice. Check filings with your tax adviser.",
    country: "Country rules",
    regime: "VAT regime",
    findings: "Findings",
    findingCode: "Finding",
    findingSeverity: "Severity",
    allClear: "Everything required for this country is in place.",
    countries: {
      SK: "Slovakia",
      DE: "Germany",
      AT: "Austria",
      XX: "Generic (no country rules)",
    },
    facts: {
      title: "What the ERP prepares",
      vatReturn: "VAT return and control statement",
      statements: "Statutory financial statements",
      fiscal: "Fiscal receipts",
      eInvoicing: "Mandatory e-invoicing from",
      yes: "Available",
      no: "Not available for this country",
      notRequired: "Not required",
      required: "Required, through a certified eKasa cash register",
    },
    actions: {
      company: "Edit company details",
      regime: "Choose VAT regime",
      rates: "Review tax rates",
      chart: "Set up chart of accounts",
      vatReturn: "Open VAT return",
      fiscal: "Open POS fiscal settings",
    },
    pickCompany: "Choose a company to check.",
    errors: {
      validation: {
        title: "Invalid request",
        description: "Choose a company you belong to.",
      },
      unauthorized: {
        title: "Sign in required",
        description: "Sign in to check compliance.",
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
        description: "The company changed while checking. Try again.",
      },
      server: {
        title: "Check failed",
        description: "The compliance check could not run. Try again.",
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
      title: "Compliance checked",
      description: "The findings reflect the company data right now.",
    },
  },
};
