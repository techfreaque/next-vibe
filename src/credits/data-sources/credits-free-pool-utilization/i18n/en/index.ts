export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "Free Allowance Used",
    title: "Free Allowance Used (month-to-date)",
    description:
      "Free credits consumed divided by free credits granted, both month-to-date (UTC month, resets on the 1st). 0 = nothing used, 1 = every granted free credit spent. Works for tiered allowances (guest / user / newsletter).",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      result: {
        label: "Free Allowance Used",
        description: "Output time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Credits Free Pool Utilization computed",
      description: "Credits Free Pool Utilization series returned",
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
