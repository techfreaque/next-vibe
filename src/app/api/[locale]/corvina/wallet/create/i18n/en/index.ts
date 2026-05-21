export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  post: {
    title: "Create Wallet",
    description: "Creates a new wallet in the Corvina platform.",
    id: {
      label: "Wallet ID",
      description:
        "Optional custom ID for the wallet. Must match pattern: lowercase letters, hyphens, alphanumeric (e.g. my-wallet-01).",
      placeholder: "my-wallet-01",
    },
    type: {
      label: "Type",
      description: "Wallet type: GENERIC for general use, APP for app-specific wallets.",
      placeholder: "Select type",
    },
    description: {
      label: "Description",
      description: "Human-readable description for this wallet.",
      placeholder: "Production payment wallet",
    },
    webhookUrl: {
      label: "Webhook URL",
      description: "URL to receive wallet event notifications.",
      placeholder: "https://example.com/webhook",
    },
    submitButton: {
      label: "Create Wallet",
      loadingText: "Creating...",
    },
    response: {
      id: "Wallet ID",
      type: "Type",
      description: "Description",
      webhookUrl: "Webhook URL",
    },
    widget: {
      title: "Create Wallet",
      resultTitle: "Wallet created",
      idLabel: "ID",
      typeLabel: "Type",
      descriptionLabel: "Description",
      webhookLabel: "Webhook URL",
      back: "Back",
      noType: "No type",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The wallet creation request is invalid.",
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
        description: "The API key does not have permission to create wallets.",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found.",
      },
      conflict: {
        title: "Conflict",
        description: "A wallet with this ID already exists.",
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
      title: "Wallet Created",
      description: "The wallet was created successfully.",
    },
  },
};
