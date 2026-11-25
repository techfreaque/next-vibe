export const translations = {
  title: "Supplier payables",
  titleShort: "Payables aging",
  description: "What you owe suppliers, by days overdue.",
  tag: "Payables aging",
  company: {
    label: "Company",
    description: "Choose the company whose supplier bills you want to review.",
    choose: "Choose a company",
    empty: "Select a company to see what you owe suppliers.",
  },
  currency: {
    label: "Currency",
    description: "Show bills in one currency. Amounts are not converted.",
    default: "Company currency",
    codes: {
      EUR: "EUR",
      USD: "USD",
      PLN: "PLN",
    },
  },
  agingDate: {
    label: "Aging date",
    description: "The date used to measure how many days a bill is overdue.",
  },
  columns: {
    supplier: "Supplier",
    vat: "VAT number",
    current: "Not overdue",
    days1to30: "1–30 days",
    days31to60: "31–60 days",
    days61to90: "61–90 days",
    over90: "91+ days",
    undated: "No due date",
    total: "Total",
    billNumber: "Bill number",
    billDate: "Bill date",
    dueDate: "Due date",
    billAmount: "Amount in cents",
  },
  approved: {
    title: "Approved and unpaid",
    empty: "No approved bills to pay",
    emptyDescription:
      "Approved bills with an outstanding balance will appear here.",
  },
  received: {
    title: "Awaiting approval",
    empty: "No bills awaiting approval",
    emptyDescription: "Received bills will appear here until approved.",
  },
  disputed: {
    title: "Disputed",
    empty: "No disputed bills",
    emptyDescription:
      "Disputed bills are excluded from the approved and pending totals.",
  },
  widget: {
    asOf: "As of {{date}}",
    back: "Back",
    loading: "Loading payables",
    details: "Bills from {{supplier}}",
    unknownSupplier: "Unknown supplier",
    datedBill: "Bill dated {{date}}",
    due: "Due {{date}}",
  },
  success: {
    title: "Payables loaded",
    description: "The selected company’s supplier bills are ready to review.",
  },
  errors: {
    validation: {
      title: "Check your report filters",
      description: "Choose a valid date and currency for this report.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to view supplier payables.",
    },
    forbidden: {
      title: "Company unavailable",
      description: "You do not have access to this company’s supplier bills.",
    },
    notFound: {
      title: "Not found",
      description: "The requested resource could not be found.",
    },
    server: {
      title: "Could not load payables",
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
