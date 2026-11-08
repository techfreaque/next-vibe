export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "All Spend",
    title: "All Spend (leads + users, paid + free)",
    description:
      "Every usage transaction, paid and free, leads and users. Includes spend the public cap never counts.",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      result: {
        label: "All Spend",
        description: "Output time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Credits Spent Total computed",
      description: "Credits Spent Total series returned",
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
