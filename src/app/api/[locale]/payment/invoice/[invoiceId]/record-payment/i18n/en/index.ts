export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  post: {
    title: "Record Manual Payment",
    titleShort: "Record Payment",
    description:
      "Record a manual payment against an invoice. Marks it as Paid if fully settled.",
    form: {
      title: "Record Payment",
      description: "Enter payment details to record against this invoice",
    },
    response: {
      success: "Payment recorded",
      message: "Status message",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid payment parameters",
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
        description: "Invoice is already paid or voided",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Manual payment recorded",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "ID of the invoice to record payment against",
    placeholder: "Enter invoice ID",
  },
  amount: {
    label: "Amount Paid",
    description: "Amount received",
    placeholder: "0.00",
  },
  method: {
    label: "Payment Method",
    description: "How the payment was received",
    placeholder: "Select method",
  },
  paidAt: {
    label: "Payment Date",
    description: "When the payment was received",
    placeholder: "Select date",
  },
  accountNodeId: {
    label: "Account Node ID",
    description: "Optional: accounting node that received this payment",
    placeholder: "Enter account node ID",
  },
  widget: {
    back: "Back",
    submit: "Record Payment",
    paymentRecorded: "Payment recorded successfully.",
    viewInvoice: "View Invoice",
  },
};
