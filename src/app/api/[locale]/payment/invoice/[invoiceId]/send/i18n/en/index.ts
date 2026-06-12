export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  post: {
    title: "Send Invoice",
    titleShort: "Send Invoice",
    description: "Mark a draft invoice as sent — transitions status to Open",
    form: {
      title: "Send Invoice",
      description: "Sends the invoice to the customer",
    },
    response: {
      success: "Invoice sent",
      message: "Status message",
      viewUrl: "Customer view URL",
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
    submit: "Send Invoice",
    sent: "Invoice sent",
    viewUrl: "Customer view link",
  },
};
