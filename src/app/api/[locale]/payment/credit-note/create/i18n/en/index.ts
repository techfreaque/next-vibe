export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
    creditNote: "credit-note",
  },
  post: {
    title: "Create Credit Note",
    titleShort: "Credit Note",
    description:
      "Create a credit note linked to an original invoice. Full credit negates all lines. Partial credit applies the specified line items. Posts a reversal journal entry: Dr Revenue, Cr AR.",
    form: {
      title: "Create Credit Note",
      description: "Issue a credit against an existing invoice",
    },
    response: {
      success: "Credit note created",
      message: "Status message",
      creditNote: {
        title: "Credit Note",
        subtitle: "Created credit note details",
        id: "Credit Note ID",
        invoiceId: "Original Invoice ID",
        companyId: "Company ID",
        currency: "Currency",
        status: "Status",
        amount: "Amount",
        reason: "Reason",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Invoice not found",
      },
      conflict: {
        title: "Cannot Credit",
        description: "Only OPEN or PAID invoices can have credit notes",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Credit note created and journal entry posted",
    },
    widget: {
      back: "Back",
      submit: "Create Credit Note",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "The invoice being credited",
    placeholder: "Enter invoice ID",
  },
  companyId: {
    label: "Company ID",
    description: "Company issuing the credit note",
    placeholder: "Enter company ID",
  },
  reason: {
    label: "Reason",
    description: "Why this credit is being issued",
    placeholder: "Describe the reason for the credit",
  },
  lineItems: {
    label: "Line Items",
    description:
      "Optional partial credit lines. If omitted, full credit is applied.",
    placeholder: "",
  },
};
