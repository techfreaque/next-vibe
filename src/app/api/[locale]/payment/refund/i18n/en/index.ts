export const translations = {
  title: "Process Refund",
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
        description: "Amount to refund (optional, defaults to full amount)",
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
        title: "Not Found",
        description: "Transaction not found",
      },
      server: {
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
