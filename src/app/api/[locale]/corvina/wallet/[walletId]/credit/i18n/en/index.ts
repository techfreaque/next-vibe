export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", wallet: "Wallet" },
  post: {
    title: "Credit Wallet",
    description: "Transfers credits from a subscription to a wallet.",
    walletId: {
      label: "Target Wallet ID",
      description: "The wallet to credit.",
      placeholder: "my-wallet-01",
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
    amount: {
      label: "Amount",
      description: "Number of credits to transfer.",
      placeholder: "100",
    },
    sourceOrgResourceId: {
      label: "Source Org ID",
      description: "Source organization resource ID.",
      placeholder: "org.resource.id",
    },
    sourceWalletId: {
      label: "Source Wallet ID",
      description: "Wallet to debit from (if applicable).",
      placeholder: "source-wallet-01",
    },
    transferDescription: {
      label: "Description",
      description: "Optional description for this transfer.",
      placeholder: "Monthly subscription top-up",
    },
    transactionSubjectType: {
      label: "Subject Type",
      description: "Type of transaction subject.",
      placeholder: "subscription",
    },
    transactionSubjectRef: {
      label: "Subject Ref",
      description: "Reference to the transaction subject.",
      placeholder: "sub-123",
    },
    transactionSubjectQuantity: {
      label: "Subject Quantity",
      description: "Quantity of the transaction subject.",
      placeholder: "1",
    },
    nextRenewalDate: {
      label: "Next Renewal Date",
      description: "Date of the next renewal.",
      placeholder: "2025-12-31",
    },
    submitButton: { label: "Credit Wallet", loadingText: "Processing..." },
    response: {
      id: "Transaction ID",
      errorCode: "Error Code",
      executionResult: "Result",
      failureReason: "Failure Reason",
      createdAt: "Created At",
      issuedBy: "Issued By",
      targetWalletId: "Target Wallet",
      txDescription: "Description",
      orderId: "Order ID",
      ordinal: "Ordinal",
      authorizedBy: "Authorized By",
      amount: "Amount",
      sourceOrgResourceId: "Source Org",
      sourceWalletId: "Source Wallet",
    },
    widget: {
      title: "Credit Wallet",
      back: "Back",
      resultTitle: "Transfer Complete",
      success: "Credits transferred successfully.",
      failed: "Transfer failed.",
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
        description: "No permission to credit this wallet.",
      },
      notFound: {
        title: "Not Found",
        description: "The wallet was not found.",
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
      description: "Credits have been transferred to the wallet.",
    },
  },
};
