export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  get: {
    title: "Wallet Transaction History",
    description:
      "Fetches paginated credit transaction history for a Corvina wallet.",
    walletId: {
      label: "Wallet ID",
      description: "The ID of the wallet to retrieve history for.",
    },
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of transactions per page.",
    },
    orderBy: {
      label: "Order By",
      description: "Field to sort by — e.g. id, serialNumber.",
    },
    orderDir: {
      label: "Order Direction",
      description: "Sort direction — ASC or DESC.",
    },
    response: {
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
      transactions: {
        id: "ID",
        executionResult: "Result",
        failureReason: "Failure Reason",
        sourceWalletId: "Source Wallet",
        targetWalletId: "Target Wallet",
        amount: "Amount",
        createdAt: "Created",
        authorizedBy: "Authorized By",
        description: "Description",
        orderId: "Order ID",
        orgResourceId: "Org Resource ID",
      },
    },
    widget: {
      title: "Transactions",
      noItemsFound: "No transactions found.",
      back: "Back",
      success: "SUCCESS",
      failure: "FAILURE",
      noop: "NOOP",
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
        description:
          "The API key does not have access to this wallet's history.",
      },
      notFound: {
        title: "Not Found",
        description: "No wallet found with the given ID.",
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
      title: "Success",
      description: "Transaction history fetched successfully.",
    },
  },
};
