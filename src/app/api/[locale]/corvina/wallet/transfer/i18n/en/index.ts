export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  post: {
    title: "Transfer Wallet Credits",
    description:
      "Transfers credits between two wallets in the Corvina platform.",
    sourceWalletId: {
      label: "Source Wallet ID",
      description: "The wallet to debit credits from.",
      placeholder: "source-wallet-01",
    },
    targetWalletId: {
      label: "Target Wallet ID",
      description: "The wallet to credit.",
      placeholder: "target-wallet-01",
    },
    amount: {
      label: "Amount",
      description: "Number of credits to transfer.",
      placeholder: "100",
    },
    orderId: {
      label: "Order ID",
      description: "Unique identifier for this transfer order.",
      placeholder: "order-12345",
    },
    ordinal: {
      label: "Ordinal",
      description: "Order sequence number (optional).",
      placeholder: "1",
    },
    authorizedBy: {
      label: "Authorized By",
      description: "Who authorized this transfer.",
      placeholder: "admin@example.com",
    },
    sourceOrgResourceId: {
      label: "Source Org ID",
      description: "Source organization resource ID.",
      placeholder: "org.resource.id",
    },
    transferDescription: {
      label: "Description",
      description: "Optional description for this transfer.",
      placeholder: "Wallet rebalancing",
    },
    submitButton: {
      label: "Transfer Credits",
      loadingText: "Transferring...",
    },
    response: {
      id: "Transaction ID",
      errorCode: "Error Code",
      executionResult: "Result",
      failureReason: "Failure Reason",
      createdAt: "Created At",
      issuedBy: "Issued By",
      sourceWalletId: "Source Wallet",
      targetWalletId: "Target Wallet",
      amount: "Amount",
      orderId: "Order ID",
      ordinal: "Ordinal",
      authorizedBy: "Authorized By",
      sourceOrgResourceId: "Source Org",
    },
    widget: {
      title: "Transfer Wallet Credits",
      back: "Back",
      resultTitle: "Transfer Complete",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The transfer request is invalid.",
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
        description: "No permission to transfer between these wallets.",
      },
      notFound: {
        title: "Not Found",
        description: "One of the wallets was not found.",
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
      title: "Transfer Complete",
      description: "Credits have been transferred successfully.",
    },
  },
};
