export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  post: {
    title: "Bulk Transfer Credits",
    description:
      "Transfers credits from a subscription to a wallet. Executes a single transfer wrapped in a bulk request.",
    targetWalletId: {
      label: "Target Wallet ID",
      description: "ID of the wallet to receive the credits.",
      placeholder: "b-12345-6789-abcde",
    },
    orderId: {
      label: "Order ID",
      description: "Unique order identifier for this transaction.",
      placeholder: "order-12345",
    },
    amount: {
      label: "Amount",
      description: "Number of credits to transfer.",
      placeholder: "100",
    },
    ordinal: {
      label: "Ordinal",
      description:
        "Position of this transaction in the order (starting from 0).",
      placeholder: "0",
    },
    sourceWalletId: {
      label: "Source Wallet ID",
      description: "Source wallet ID (if transferring between wallets).",
      placeholder: "a-12345-6789-abcde",
    },
    transferDescription: {
      label: "Description",
      description: "Human-readable description of the transfer.",
      placeholder: "Payment for services",
    },
    transactionSubjectType: {
      label: "Subject Type",
      description: "Type of the transaction subject (e.g., SERVICE).",
      placeholder: "SERVICE",
    },
    transactionSubjectRef: {
      label: "Subject Reference",
      description: "Reference identifier for the transaction subject.",
      placeholder: "service-12345",
    },
    transactionSubjectQuantity: {
      label: "Subject Quantity",
      description: "Quantity associated with the transaction subject.",
      placeholder: "1",
    },
    response: {
      items: {
        id: "Transaction ID",
        executionResult: "Result",
        failureReason: "Failure Reason",
        sourceWalletId: "Source Wallet",
        targetWalletId: "Target Wallet",
        amount: "Amount",
        createdAt: "Created At",
        orderId: "Order ID",
        ordinal: "Ordinal",
        orgResourceId: "Org Resource ID",
      },
    },
    widget: {
      title: "Bulk Credit Transfer",
      back: "Back",
      noItems: "No transactions returned.",
    },
    submitButton: {
      label: "Transfer Credits",
      loadingText: "Transferring...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Check target wallet ID, order ID, and amount.",
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
        description: "No permission to transfer credits.",
      },
      notFound: {
        title: "Not Found",
        description: "Wallet not found.",
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
      title: "Credits Transferred",
      description: "Bulk credit transfer completed successfully.",
    },
  },
};
