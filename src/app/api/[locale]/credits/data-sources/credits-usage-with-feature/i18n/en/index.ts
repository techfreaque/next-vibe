export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Credits Usage With Feature",
    description:
      "Credit usage transactions with feature tag per resolution bucket",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      result: {
        label: "Credits Usage With Feature",
        description: "Output time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Credits Usage With Feature computed",
      description: "Credits Usage With Feature series returned",
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
