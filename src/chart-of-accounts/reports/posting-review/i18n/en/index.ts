export const translations = {
  title: "Posting review",
  description:
    "Review active posted journals and verify posting links for issued invoices and approved or paid bills.",
  tag: "Accounting review",
  company: {
    label: "Company",
    description: "Choose the company whose postings you want to review.",
    choose: "Choose a company",
    empty: "Select a company to review its journal entries and document links.",
  },
  filters: {
    issue: "Issue",
    all: "All issues",
    matches: "Matching issues",
  },
  issues: {
    missingLines: "Missing journal lines",
    invalidLegs: "Invalid journal lines",
    invoiceLink: "Invoice posting links",
    billLink: "Bill posting links",
  },
  reasons: {
    fewLines:
      "Fewer than two journal lines. Open the journal and check the original source.",
    invalidLegs:
      "At least one currency does not balance, or a line has an invalid amount, account, or direction. Open the journal to inspect its lines.",
    noBacklink:
      "The document has no link to a journal entry. Check the source before posting or recording payment.",
    wrongPosting:
      "The linked journal is missing, belongs to a different source, or is no longer active. Review the document’s posting history.",
    controlLeg:
      "The linked journal has an invalid balance, currency, or control amount. Review the source before recording payment.",
  },
  columns: {
    record: "Record",
    date: "Record date",
    reason: "Review finding",
    counterparty: "Counterparty",
    open: "Open record",
  },
  records: {
    journal: "Journal entry",
    invoice: "Customer invoice",
    bill: "Supplier bill",
    journalDate: "Journal date",
    invoiceDate: "Invoice created",
    billDate: "Bill date",
    dateInfo: "{{label}} {{date}}",
    openJournal: "Open journal",
    openInvoice: "Open invoice",
    openBill: "Open bill",
  },
  pagination: {
    pageLabel: "Page",
    pageSize: "Page size",
    totalPages: "Total pages",
    previous: "Previous",
    next: "Next",
    pageInfo: "Page {{page}} of {{total}}",
    firstPage: "First page",
    emptyPage: "This page has no rows",
  },
  widget: {
    loading: "Loading posting review",
    empty: "No matching posting issues",
    coverage:
      "Review covers active original journals and positive issued invoices or approved and paid bills.",
    back: "Back",
  },
  success: {
    title: "Review ready",
    description: "Journal and document checks are complete.",
  },
  errors: {
    validation: {
      title: "Check your report filters",
      description: "Use a valid issue filter, page and page size.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to review accounting postings.",
    },
    forbidden: {
      title: "Company unavailable",
      description:
        "You do not have access to this company’s accounting records.",
    },
    notFound: {
      title: "Not found",
      description: "The requested resource could not be found.",
    },
    server: {
      title: "Could not load posting review",
      description: "Try loading the report again.",
    },
    network: {
      title: "Connection unavailable",
      description: "Check your connection and try again.",
    },
    conflict: {
      title: "Report conflict",
      description: "Refresh and run the report again.",
    },
    unknown: {
      title: "Unexpected error",
      description: "Try again or contact support.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Keep or discard your changes before leaving.",
    },
  },
};
