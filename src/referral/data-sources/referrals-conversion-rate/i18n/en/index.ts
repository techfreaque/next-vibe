export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Referral Conversion Rate",
    titleShort: "Conversion Rate",
    description:
      "Share of measured first referral visits that led to a credited signup",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      result: {
        label: "Conversion Rate",
        description:
          "Signups as a percentage of first visits, grouped by visit date",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Conversion rate computed",
      description: "Referral conversion rate series returned",
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
