export const translations = {
  title: "E-invoice (Peppol)",
  titleShort: "E-invoice",
  description:
    "Export an issued invoice or credit note as a Peppol BIS Billing 3.0 file (UBL, EN 16931).",
  invoiceId: {
    label: "Invoice",
    description: "The issued invoice or credit note to export",
  },
  response: {
    invoiceNumber: "Document number",
    isCreditNote: "Credit note",
    fileName: "File name",
    ready: "Ready to send",
    missingFields: "Missing details",
    xml: "XML",
  },
  widget: {
    back: "Back",
    submit: "Prepare e-invoice",
    invoice: "Invoice {{number}}",
    creditNote: "Credit note {{number}}",
    ready: "Ready. All mandatory EN 16931 details are present.",
    missing: "Add these details before you send the file:",
    download: "Download XML",
    copy: "Copy XML",
    copied: "XML copied",
    copyFailed: "Could not copy the XML",
    preview: "Show XML",
    disclaimer: "We provide tooling, not tax advice.",
  },
  fields: {
    bt1: "Document number",
    bt2: "Issue date",
    bt5: "Currency",
    bt9: "Due date",
    bt27: "Your company name",
    bt31: "Your VAT ID",
    bt34: "Your electronic address (VAT ID, tax ID or company number)",
    bt40: "Your company country",
    bt44: "Customer name",
    bt48: "Customer VAT ID",
    bt49: "Customer electronic address (VAT ID, tax ID or company number)",
    bt55: "Customer address with country",
    bt153: "A description on every line",
    bg25: "At least one line",
  },
  errors: {
    validation: {
      title: "Invalid request",
      description: "Check the invoice reference.",
    },
    network: {
      title: "Network error",
      description: "The e-invoice could not be loaded.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Please sign in to export e-invoices.",
    },
    forbidden: {
      title: "No access",
      description: "You do not have access to this document.",
    },
    notFound: {
      title: "Document not found",
      description: "This invoice does not exist.",
    },
    server: {
      title: "Export failed",
      description: "The e-invoice could not be built. Please try again.",
    },
    unknown: {
      title: "Unknown error",
      description: "Something went wrong.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save your changes first.",
    },
    conflict: {
      title: "Not issued yet",
      description: "Issue the invoice before you export it as an e-invoice.",
    },
  },
  success: {
    title: "E-invoice prepared",
    description: "The Peppol file is ready.",
  },
  tags: { payment: "payment", invoice: "invoice", eInvoice: "e-invoice" },
};
