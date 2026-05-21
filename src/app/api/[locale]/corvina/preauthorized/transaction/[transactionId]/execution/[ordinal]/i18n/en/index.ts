export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Preauthorized Transactions",
  },
  post: {
    title: "Execute Preauthorized Transaction",
    description:
      "Triggers execution of a preauthorized transaction at the given ordinal.",
    transactionId: {
      label: "Transaction ID",
      description: "Numeric ID of the preauthorized transaction.",
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
        description: "No permission to execute this transaction.",
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
      title: "Execution Triggered",
      description: "Preauthorized transaction execution order created.",
    },
    submitButton: {
      label: "Execute",
      loadingText: "Executing...",
    },
    widget: {
      back: "Back",
    },
  },
};
