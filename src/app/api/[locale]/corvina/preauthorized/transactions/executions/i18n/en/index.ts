export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Preauthorized Transactions",
  },
  post: {
    title: "Bulk Execute Preauthorized Transactions",
    description:
      "Triggers execution for multiple preauthorized transactions in a single request.",
    preauthorizedCreditTransactionId: {
      label: "Transaction ID",
      description: "Preauthorized credit transaction ID to execute.",
    },
    ordinal: {
      label: "Ordinal",
      description: "Execution ordinal to trigger.",
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
        description: "No permission to trigger bulk executions.",
      },
      notFound: { title: "Not Found", description: "Resource not found." },
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
      title: "Executions Triggered",
      description: "Bulk execution orders created successfully.",
    },
    submitButton: {
      label: "Trigger Executions",
      loadingText: "Triggering...",
    },
    widget: {
      back: "Back",
      title: "Execution Results",
      noItemsFound: "No execution orders returned.",
    },
  },
};
