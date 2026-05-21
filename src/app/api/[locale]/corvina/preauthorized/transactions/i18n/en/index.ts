export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Preauthorized Transactions",
  },
  get: {
    title: "List Preauthorized Transactions",
    description:
      "Lists preauthorized credit transactions with pagination and optional filters.",
    targetWalletId: {
      label: "Target Wallet ID",
      description: "Filter by target wallet ID.",
    },
    orderId: {
      label: "Order ID",
      description: "Filter by order ID.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter by org resource ID.",
    },
    page: {
      label: "Page",
      description: "Page number (starts at 0).",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of results per page.",
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
      total: "Total",
      currentPage: "Current Page",
      totalPages: "Total Pages",
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
        description: "No permission to list preauthorized transactions.",
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
      title: "Transactions Loaded",
      description: "Preauthorized transactions retrieved successfully.",
    },
    submitButton: {
      label: "List Transactions",
      loadingText: "Loading...",
    },
    widget: {
      back: "Back",
      title: "Preauthorized Transactions",
      noItemsFound: "No transactions found.",
    },
  },
  post: {
    title: "Create Preauthorized Transactions (Bulk)",
    description:
      "Creates multiple preauthorized credit transactions in a single request.",
    orderId: {
      label: "Order ID",
      description: "Unique identifier for the order.",
    },
    targetWalletId: {
      label: "Target Wallet ID",
      description: "Wallet ID that will receive the credit.",
    },
    amount: {
      label: "Amount",
      description: "Credit amount for this transaction.",
    },
    ordinal: {
      label: "Ordinal",
      description: "Execution ordinal for this transaction.",
    },
    sourceWalletId: {
      label: "Source Wallet ID",
      description: "Wallet ID that funds this transaction.",
    },
    txDescription: {
      label: "Description",
      description: "Free-text description for this transaction.",
    },
    transactionSubjectType: {
      label: "Subject Type",
      description: "Type of the transaction subject.",
    },
    transactionSubjectRef: {
      label: "Subject Reference",
      description: "Reference identifier for the subject.",
    },
    transactionSubjectQuantity: {
      label: "Subject Quantity",
      description: "Quantity associated with the subject.",
    },
    executionMinTime: {
      label: "Earliest Execution Time",
      description: "Transaction cannot execute before this date.",
    },
    executionMaxTime: {
      label: "Latest Execution Time",
      description: "Transaction must execute before this date.",
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
        description: "No permission to create preauthorized transactions.",
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
      title: "Transactions Created",
      description: "Preauthorized credit transactions created successfully.",
    },
    submitButton: {
      label: "Create Transactions",
      loadingText: "Creating...",
    },
    widget: {
      back: "Back",
    },
  },
  delete: {
    title: "Revoke Preauthorized Transactions (Bulk)",
    description:
      "Revokes multiple preauthorized credit transactions in a single request.",
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
      title: "Transactions Revoked",
      description: "Preauthorized credit transactions revoked successfully.",
    },
    submitButton: {
      label: "Revoke Transactions",
      loadingText: "Revoking...",
    },
    widget: {
      back: "Back",
    },
  },
};
