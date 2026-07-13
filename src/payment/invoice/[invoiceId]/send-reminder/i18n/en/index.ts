export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "Send Payment Reminder",
    titleShort: "Send Reminder",
    description:
      "Send a payment reminder for an overdue invoice. Invoice must be OPEN status and past its due date. Logs the reminder as a customer note.",
    form: {
      title: "Send Reminder",
      description: "Notify the customer about their overdue payment",
    },
    response: {
      success: "Reminder sent",
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
          "Reminders can only be sent for open invoices past their due date",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Payment reminder sent and logged",
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
    back: "Back",
    submit: "Send Reminder",
    reminderSent: "Reminder sent. The customer has been notified.",
    viewInvoice: "View Invoice",
  },
};
