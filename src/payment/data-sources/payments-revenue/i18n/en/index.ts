export const translations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    kind: {
      all: "Everything",
      pack: "Credit packs",
      subscription: "Subscriptions (new + renewals)",
      newSubscription: "New subscriptions",
      renewal: "Renewals",
    },
    provider: {
      all: "All processors",
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
  },
  post: {
    title: "Revenue (USD)",
    titleShort: "Revenue",
    description:
      "Money collected per bucket in approx. USD (EUR and PLN at static rates). Succeeded and later-refunded payments, admin accounts excluded. Filter by what was bought and by processor.",
    fields: {
      resolution: {
        label: "Resolution",
        description: "Computation timeframe",
      },
      range: {
        label: "Range",
        description: "Time range to query",
      },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      result: {
        label: "Revenue (USD)",
        description: "Output time series",
      },
      meta: {
        label: "Meta",
        description: "Node execution metadata",
      },
      kind: {
        label: "Paid for",
        description:
          "Credit packs, subscriptions (new + renewals), or one of them",
      },
      provider: {
        label: "Processor",
        description: "Stripe, NOWPayments or both",
      },
    },
    success: {
      title: "Revenue computed",
      description: "Revenue series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server error",
        description: "Query failed",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request parameters",
      },
      notFound: {
        title: "Not found",
        description: "Not found",
      },
      conflict: {
        title: "Conflict",
        description: "Conflict",
      },
      network: {
        title: "Network error",
        description: "Network request failed",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save changes first",
      },
    },
  },
};
