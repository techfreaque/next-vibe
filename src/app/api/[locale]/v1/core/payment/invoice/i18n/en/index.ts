export const translations = {
  post: {
    title: "Invoice",
    description: "Invoice endpoint",
    form: {
      title: "Invoice Configuration",
      description: "Configure invoice parameters",
    },
    response: {
      invoice: {
        title: "Invoice Details",
        description: "Generated invoice information",
        id: "Invoice ID",
        userId: "User ID",
        stripeInvoiceId: "Stripe Invoice ID",
        invoiceNumber: "Invoice Number",
        amount: "Amount",
        currency: "Currency",
        status: "Status",
        invoiceUrl: "Invoice URL",
        invoicePdf: "Invoice PDF",
        dueDate: "Due Date",
        paidAt: "Paid At",
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
        description: "Invalid request parameters",
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
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
