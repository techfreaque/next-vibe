export const translations = {
  title: "Process Refund",
  titleShort: "Refund",
  description: "Process a refund for a payment transaction",
  category: "Payment Refunds",

  tags: {
    refund: "refund",
    transaction: "transaction",
  },

  success: {
    created: "Refund processed successfully",
  },

  reason: {
    requestedByCustomer: "Requested by customer",
  },

  form: {
    title: "Refund Form",
    description: "Enter refund details",
    fields: {
      transactionId: {
        label: "Transaction ID",
        description: "ID of the transaction to refund",
        placeholder: "Enter transaction ID",
      },
      amount: {
        label: "Refund Amount",
        description: "Optional partial refund in the transaction currency",
        placeholder: "Enter amount",
      },
      reason: {
        label: "Refund Reason",
        description: "Reason for the refund",
        placeholder: "Enter reason",
      },
      metadata: {
        label: "Metadata",
        description: "Additional refund metadata",
        placeholder: "Enter metadata as JSON",
      },
    },
  },

  widget: {
    transactionDetails: "Saved transaction",
    customerEmail: "Customer email",
    customerId: "Customer ID",
    originalAmount: "Original charge",
    enterTransaction: "Enter a transaction ID to load payment details.",
    lookupLoading: "Loading saved transaction",
    transactionMissing: "Transaction not found",
    lookupFailed: "Couldn’t load the transaction",
    retryLookup: "Retry lookup",
    amountExceedsCharge: "Enter an amount up to the original charge.",
    confirmRemaining:
      "Stripe will refund the remaining balance in {{currency}}.",
    confirmAmount: "Partial refund: {{amount}} ({{currency}}).",
    title: "Review Stripe refund",
    amountHelp:
      "Enter a partial amount in {{currency}}. Leave it blank to refund the remaining balance.",
    review: "Review amount",
    confirmTitle: "Confirm Stripe refund",
    confirmDescription:
      "Stripe will refund transaction {{transactionId}} for {{email}}. This action moves money.",
    confirm: "Issue refund",
    cancel: "Cancel",
  },

  post: {
    title: "Process Refund",
    description: "Process a payment refund",
    response: {
      success: "Refund processed successfully",
      message: "Status message",
      refund: {
        title: "Refund Details",
        description: "Processed refund information",
        id: "Refund ID",
        userId: "User ID",
        transactionId: "Transaction ID",
        stripeRefundId: "Stripe Refund ID",
        amount: "Refund Amount",
        currency: "Currency",
        status: "Refund Status",
        reason: "Refund Reason",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid refund parameters",
        ineligible: "This transaction is ineligible for a Stripe refund.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Permission denied",
      },
      notFound: {
        detail: "No transaction found with id {{transactionId}}",
        title: "Not Found",
        description: "Transaction not found",
      },
      server: {
        detail: "Could not process the refund: {{error}}",
        noPaymentIntent:
          "This transaction has no linked Stripe payment, so it cannot be refunded",
        title: "Server Error",
        description: "Internal server error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network connection error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Conflict",
        description: "Refund conflict detected",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Refund processed successfully",
    },
  },
};
