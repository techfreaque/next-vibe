export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  post: {
    title: "Record payment",
    titleShort: "Record payment",
    description:
      "Record a manual payment against an invoice. Marks it as Paid if fully settled.",
    form: {
      title: "Record payment",
      description: "Enter payment details to record against this invoice",
    },
    response: {
      success: "Payment recorded",
      message: "Status message",
    },
    errors: {
      receiptKeyConflict:
        "This receipt key already belongs to a different payment.",
      paymentPrecision:
        "Enter a positive amount with at most two decimal places.",
      paymentStatus:
        "Record payments against open invoices with a positive amount.",
      overpayment: "The payment exceeds the invoice balance.",
      fullPayment:
        "Enter the full remaining amount for an invoice without a company.",
      issuancePosting:
        "The invoice needs a posted receivable matching its total before payment.",
      paymentAccount:
        "Choose an active bank or cash account from this company.",
      paymentPosting:
        "Check the payment date, company currency and posting accounts.",
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
  enums: {
    manualPaymentMethod: {
      cash: "Cash",
      bankTransfer: "Bank Transfer",
      other: "Other",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "ID of the invoice to record payment against",
    placeholder: "Enter invoice ID",
  },
  amount: {
    label: "Amount paid",
    description: "Amount received",
    placeholder: "0.00",
  },
  method: {
    label: "Payment method",
    description: "How the payment was received",
    placeholder: "Select method",
  },
  paidAt: {
    label: "Payment date",
    description: "When the payment was received",
    placeholder: "Select date",
  },
  receiptKey: {
    label: "Receipt key",
    description:
      "Use the same key to retry this payment. Use a new key for another receipt.",
  },
  accountNodeId: {
    label: "Payment account",
    description: "Choose the bank or cash account that received the payment.",
    placeholder: "Choose an account",
    automatic: "Use the default account",
  },
  widget: {
    details: "Payment details",
    back: "Back",
    submit: "Record payment",
    paymentRecorded: "Payment recorded successfully.",
    viewInvoice: "View invoice",
    amountDue: "{{amount}} open",
    notOpenTitle: "This invoice is not open",
    notOpenMessage:
      "Only issued, unpaid invoices take payments. Issue the invoice first, or open the right one.",
  },
};
