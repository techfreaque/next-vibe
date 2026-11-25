export const translations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    source: {
      public: "Public (guests)",
      usersFree: "Users free",
      paid: "Paid",
      gifted: "Gifted",
      internal: "Internal (admins)",
      unattributed: "Unattributed (history)",
    },
  },
  post: {
    titleShort: "Usage by Source",
    title: "Credits Spent by Source",
    description:
      "Credits spent, split by who spent them and which credits paid: public (guests), users free, paid, gifted, internal, unattributed. The sources add up to all spend.",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      source: {
        label: "Source",
        description:
          "Which credits to count: public guests, signed-in free credits, paid (subscription + packs), gifted (admin grants), internal (admin accounts) or unattributed history",
      },
      result: { label: "Credits Spent", description: "Output time series" },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Credits by source computed",
      description: "Credits spent by source series returned",
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
