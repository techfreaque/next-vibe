export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Preauthorized Transactions",
  },
  get: {
    title: "Get Preauthorized Transaction",
    description: "Fetches a single preauthorized credit transaction by ID.",
    transactionId: {
      label: "Transaction ID",
      description: "Numeric ID of the preauthorized transaction.",
    },
    response: {
      id: "ID",
      orderId: "Order ID",
      ordinal: "Ordinal",
      authorizedBy: "Authorized By",
      targetWalletId: "Target Wallet ID",
      amount: "Amount",
      sourceOrgResourceId: "Source Org Resource ID",
      sourceWalletId: "Source Wallet ID",
      description: "Description",
      transactionSubjectType: "Subject Type",
      transactionSubjectRef: "Subject Reference",
      transactionSubjectQuantity: "Subject Quantity",
      executionMinTime: "Earliest Execution",
      executionMaxTime: "Latest Execution",
      updatedAt: "Updated At",
      revokedBy: "Revoked By",
      executionMaxOrdinal: "Max Execution Ordinal",
      state: "State",
      orgResourceId: "Org Resource ID",
      expectedPaymentsToDate: "Expected Payments to Date",
      actualPaymentsReceived: "Actual Payments Received",
      nextPaymentDate: "Next Payment Date",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No permission to read preauthorized transactions.",
      },
      notFound: {
        title: "Not Found",
        description: "No transaction with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Transaction Loaded",
      description: "Preauthorized transaction retrieved successfully.",
    },
    submitButton: {
      label: "Fetch Transaction",
      loadingText: "Fetching...",
    },
    widget: {
      back: "Back",
    },
  },
  delete: {
    title: "Revoke Preauthorized Transaction",
    description: "Revokes a preauthorized credit transaction by ID.",
    transactionId: {
      label: "Transaction ID",
      description: "Numeric ID of the transaction to revoke.",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No permission to revoke preauthorized transactions.",
      },
      notFound: {
        title: "Not Found",
        description: "No transaction with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Transaction Revoked",
      description: "Preauthorized transaction revoked successfully.",
    },
    submitButton: {
      label: "Revoke Transaction",
      loadingText: "Revoking...",
    },
    widget: {
      back: "Back",
      revokedTransaction: "Revoked transaction",
    },
  },
};
