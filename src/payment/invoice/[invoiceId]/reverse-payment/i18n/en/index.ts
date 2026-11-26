export const translations = {
  title: "Reverse customer receipt",
  description:
    "Record why this receipt is being corrected. Its original entry stays in the journal.",
  invoiceId: "Invoice reference",
  entryId: "Receipt posting reference",
  date: "Reversal date",
  reason: "Reason for reversal",
  reasonPlaceholder: "For example, the bank returned this payment",
  datePlaceholder: "Today",
  viewInvoice: "View invoice",
  reversal: "Reversal entry",
  originalDate: "Original receipt date",
  receiptAmount: "Receipt amount",
  postingStatus: "Posting status",
  viewReversal: "View reversal entry",
  cancel: "Cancel",
  confirmTitle: "Post this receipt reversal?",
  confirm: "Post reversal",
  success: {
    title: "Receipt reversed",
    description: "The invoice balance now reflects the reversal.",
  },
  invalidDate: "Enter a date from the original receipt date through today.",
  noPeriod: "There is no open accounting period for this date.",
  invalidReceipt: "This receipt cannot be reversed for this invoice.",
  invalidLines:
    "The saved receipt lines are incomplete or belong to another currency or company.",
  errors: {
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    validation: {
      title: "Validation error",
      description: "Invalid payment parameters",
    },
    server: {
      title: "Server error",
      description: "Internal server error occurred",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred",
    },
    network: {
      title: "Network error",
      description: "Network error occurred",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    notFound: {
      title: "Not found",
      description: "Invoice not found",
    },
    conflict: {
      title: "Conflict",
      description: "Invoice is already paid or voided",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "There are unsaved changes",
    },
  },
  tags: { payment: "payment", invoice: "invoice" },
};
