export const translations = {
  title: "Process refund",
  titleShort: "Refund",
  description: "Process a refund for a payment transaction",
  category: "Payment refunds",

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
    title: "Refund form",
    description: "Enter refund details",
    fields: {
      transactionId: {
        label: "Transaction ID",
        description: "ID of the transaction to refund",
        placeholder: "Enter transaction ID",
      },
      amount: {
        label: "Refund amount",
        description: "Optional partial refund in the transaction currency",
        placeholder: "Enter amount",
      },
      reason: {
        label: "Refund reason",
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
    title: "Process refund",
    description: "Process a payment refund",
    response: {
      success: "Refund processed successfully",
      message: "Status message",
      refund: {
        title: "Refund details",
        description: "Processed refund information",
        id: "Refund ID",
        userId: "User ID",
        transactionId: "Transaction ID",
        stripeRefundId: "Stripe refund ID",
        amount: "Refund amount",
        currency: "Currency",
        status: "Refund status",
        reason: "Refund reason",
        createdAt: "Created at",
        updatedAt: "Updated at",
      },
    },
    errors: {
      validation: {
        title: "Validation error",
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
        title: "Not found",
        description: "Transaction not found",
      },
      server: {
        detail: "Could not process the refund: {{error}}",
        noPaymentIntent:
          "This transaction has no linked Stripe payment, so it cannot be refunded",
        title: "Server error",
        description: "Internal server error occurred",
      },
      network: {
        title: "Network error",
        description: "Network connection error",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Conflict",
        description: "Refund conflict detected",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Refund processed successfully",
    },
  },
};
