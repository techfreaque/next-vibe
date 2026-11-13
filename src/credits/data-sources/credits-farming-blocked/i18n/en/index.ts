export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Farming Blocked",
    title: "Free Credit Farming Blocked",
    description:
      "Blocked free-credit farming attempts per bucket: subnet budget full (accounts or guests), duplicate email, disposable email. A spike means someone is farming.",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      result: {
        label: "Farming attempts blocked",
        description: "Output time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Blocked farming attempts counted",
      description: "Blocked farming attempts series returned",
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
