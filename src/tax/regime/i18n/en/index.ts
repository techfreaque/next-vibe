export const translations = {
  errors: {
    validation: {
      title: "Validation Error",
      description:
        "Check the company country, VAT treatment and effective date.",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be logged in",
    },
    forbidden: {
      title: "Forbidden",
      description:
        "Only company owners and administrators can change the VAT regime.",
    },
    notFound: { title: "Not Found", description: "Company not found" },
    conflict: {
      title: "Effective date already used",
      description: "This company already has a VAT regime for that date.",
    },
    server: {
      title: "Server Error",
      description: "An internal error occurred",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
  },
  reviewDescription:
    "See which VAT rules apply to this company on the selected date.",
  view: "Review VAT regime",
  asOf: "As of",
  change: "Change tax regime",
  regimes: {
    standard: "Standard VAT",
    german: "Germany: small business (§ 19 UStG)",
    austrian: "Austria: small business (§ 6 Abs. 1 Z 27 UStG)",
    slovak: "Slovakia: business not registered for VAT",
  },
  title: "Company VAT regime",
  description: "Choose the VAT treatment for documents from an effective date.",
  company: "Company",
  from: "Effective from",
  save: "Save tax regime",
  regime: "VAT treatment",
  saved: "The tax regime applies from the selected date.",
  conflict: "Choose a different date or review the existing election.",
  foreign:
    "Check foreign services with your tax adviser. Reverse charge can apply even under the small-business exemption.",
  saleConflict:
    "Sales VAT conflicts with the company exemption. Review the lines before issuing this invoice.",
  choose: "Choose a VAT treatment",
  back: "Back",
  appliesOn: "VAT treatment on {{date}}",
  invoiceText: "Text on invoices",
  savedTitle: "{{regime}} applies from {{date}}",
  pickCompany: {
    title: "Choose a company",
    message: "See which VAT rules apply to its invoices on any date.",
  },
  hints: {
    standard:
      "Invoices charge VAT at the company tax rates. Supplier VAT is deductible.",
    german: "Invoices carry no VAT and state the § 19 UStG exemption.",
    austrian:
      "Invoices carry no VAT and state the Austrian small-business exemption.",
    slovak:
      "Invoices carry no VAT because the business is not registered for VAT.",
  },
};
