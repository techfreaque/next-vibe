export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Free-Tier Spend",
    title: "Free-Tier Spend (mirrors public cap)",
    description:
      "Free credits consumed by guests and signed-in free users. Same axis as the public daily cap's Spent Today, bucketed on the cap's server-local midnight.",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      result: { label: "Free-Tier Spend", description: "Output time series" },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Free-Tier Spend computed",
      description: "Free-Tier Spend series returned",
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
