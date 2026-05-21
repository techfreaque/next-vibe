export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  get: {
    title: "Get Wallet",
    description: "Fetches a single Corvina wallet by ID.",
    walletId: {
      label: "Wallet ID",
      description: "The unique identifier of the wallet.",
    },
    response: {
      id: "ID",
      type: "Type",
      description: "Description",
      webhookUrl: "Webhook URL",
    },
    widget: {
      title: "Wallet",
      edit: "Edit",
      back: "Back",
      noData: "No wallet data.",
      labels: {
        id: "ID",
        type: "Type",
        description: "Description",
        webhookUrl: "Webhook URL",
      },
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
        description: "The API key does not have read access to this wallet.",
      },
      notFound: {
        title: "Not Found",
        description: "No wallet with that ID exists.",
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
    enums: {
      walletType: {
        generic: "Generic",
        app: "App",
      },
    },
    success: {
      title: "Success",
      description: "Wallet fetched.",
    },
  },
  put: {
    title: "Update Wallet",
    description: "Updates the configuration of a Corvina wallet.",
    walletId: {
      label: "Wallet ID",
      description: "The unique identifier of the wallet to update.",
    },
    type: {
      label: "Type",
      description: "Wallet type — GENERIC or APP.",
      placeholder: "GENERIC",
    },
    description: {
      label: "Description",
      description: "Human-readable label for this wallet.",
      placeholder: "My wallet",
    },
    webhookUrl: {
      label: "Webhook URL",
      description: "URL that receives wallet event notifications.",
      placeholder: "https://example.com/webhook",
    },
    submitButton: {
      label: "Save changes",
      loadingText: "Saving…",
    },
    errors: {
      validation: {
        title: "Invalid Update",
        description: "Corvina rejected the update payload.",
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
        description: "The API key does not have write access to this wallet.",
      },
      notFound: {
        title: "Not Found",
        description: "No wallet with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reports a conflict for this update.",
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
      title: "Saved",
      description: "Wallet updated.",
    },
  },
};
