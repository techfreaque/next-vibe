export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  get: {
    title: "Wallet Balance",
    description: "Fetches the current balance for a Corvina wallet.",
    walletId: {
      label: "Wallet ID",
      description: "The unique identifier of the wallet.",
    },
    response: {
      balance: "Balance",
    },
    widget: {
      title: "Wallet Balance",
      back: "Back",
      units: "credits",
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
        description: "The API key does not have access to this wallet.",
      },
      notFound: {
        title: "Not Found",
        description: "No wallet found with that ID.",
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
      description: "Wallet balance fetched.",
    },
  },
};
