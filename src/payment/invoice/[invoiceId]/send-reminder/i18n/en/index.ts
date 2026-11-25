export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "Prepare payment reminder",
    titleShort: "Prepare reminder",
    description:
      "Create a reminder draft with the current overdue balance and an optional note.",
    form: {
      title: "Prepare reminder",
      description: "Review the outstanding amount before sharing the draft.",
    },
    response: {
      success: "Reminder draft ready",
      message: "Status message",
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
        title: "Not Overdue",
        description:
          "A draft requires an open invoice with an outstanding balance and a past due date.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Reminder draft ready",
      description:
        "Saved in invoice history. The reminder is ready to share with the customer.",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "ID of the overdue invoice",
    placeholder: "Enter invoice ID",
  },
  message: {
    label: "Custom Message",
    description: "Optional custom message to include in the reminder",
    placeholder: "Add a personal note to the reminder...",
  },
  widget: {
    copy: "Copy reminder",
    copied: "Reminder copied",
    copyFailed: "Copy failed. Try again",
    download: "Download reminder",
    subject: "Payment reminder for invoice {{number}}",
    body: "The outstanding balance is {{amount}}. Payment was due on {{date}}.",
    back: "Back",
    submit: "Prepare reminder",
    reminderSent:
      "Saved in invoice history. The reminder is ready to share with the customer.",
    viewInvoice: "View Invoice",
  },
};
