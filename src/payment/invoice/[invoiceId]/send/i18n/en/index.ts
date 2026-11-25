export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  post: {
    title: "Issue Invoice",
    titleShort: "Issue Invoice",
    description: "Issue the draft and create its journal entry.",
    form: {
      title: "Issue Invoice",
      description: "Create a customer view link after issuing.",
    },
    response: {
      success: "Invoice sent",
      message: "Status message",
      viewUrl: "Customer view URL",
    },
    errors: {
      invoiceLines: "Add invoice lines with a positive total before issuing.",
      posting:
        "Check the invoice total, company currency, accounting period and posting accounts.",
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
        title: "Conflict",
        description: "Invoice is not in draft status",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Invoice marked as sent",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "ID of the invoice to send",
    placeholder: "Enter invoice ID",
  },
  widget: {
    back: "Back",
    submit: "Issue invoice",
    sent: "Invoice issued",
    viewUrl: "Customer view link",
  },
};
