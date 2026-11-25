export const translations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    kind: {
      paid: "Paid (packs + subscriptions)",
      packs: "Paid packs",
      subscriptions: "Subscription credits",
      gifted: "Gifted (admin grants)",
    },
  },
  post: {
    titleShort: "Credits Issued",
    title: "Credits Issued (paid, gifted)",
    description:
      "Credits added to wallets per bucket, in credits (not money): paid packs and subscription credits from real checkouts, or gifted admin grants (testers, creators, goodwill).",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      kind: {
        label: "Kind",
        description:
          "Which grants to count: paid packs + subscriptions, packs only, subscriptions only, or gifted admin grants",
      },
      result: {
        label: "Credits Issued",
        description: "Output time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Credits Purchased computed",
      description: "Credits Purchased series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: { title: "Server error", description: "Query failed" },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request parameters",
      },
      notFound: { title: "Not found", description: "Not found" },
      conflict: { title: "Conflict", description: "Conflict" },
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
