export const translations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    stage: {
      leads: "All leads",
      humans: "Human leads",
      firstChats: "Chatted",
      signups: "Signed up",
      emailConfirmed: "Email confirmed",
      payers: "Paid",
    },
  },
  post: {
    title: "Lead Funnel Stage",
    titleShort: "Funnel Stage",
    description:
      "Leads created per time bucket and how many of them reached one funnel stage. Bots excluded after the first stage.",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      stage: {
        label: "Stage",
        description: "Which funnel stage to count",
      },
      result: {
        label: "Stage count",
        description: "Output time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Lead funnel stage data",
      description: "Funnel stage series returned",
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
