export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Preauthorized Transactions",
  },
  get: {
    title: "List Execution Orders",
    description: "Lists all execution orders for a preauthorized transaction.",
    transactionId: {
      label: "Transaction ID",
      description: "Numeric ID of the preauthorized transaction.",
    },
    ordinal: {
      label: "Ordinal",
      description: "Filter by execution ordinal.",
    },
    issuer: {
      label: "Issuer",
      description: "Filter by issuer.",
    },
    response: {
      id: "ID",
      transactionId: "Transaction ID",
      preauthorizedCreditTransactionId: "Preauthorized Credit Transaction ID",
      executionTime: "Execution Time",
      ordinal: "Ordinal",
      executionResult: "Execution Result",
      errorCode: "Error Code",
      failureReason: "Failure Reason",
      issuer: "Issuer",
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
        description: "No permission to list execution orders.",
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
      title: "Execution Orders Loaded",
      description: "Execution orders retrieved successfully.",
    },
    submitButton: {
      label: "List Executions",
      loadingText: "Loading...",
    },
    widget: {
      back: "Back",
      title: "Execution Orders",
      noItemsFound: "No execution orders found.",
    },
  },
};
