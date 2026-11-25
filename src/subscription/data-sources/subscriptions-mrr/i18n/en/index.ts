export const translations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "MRR (USD)",
    titleShort: "MRR",
    description:
      "Monthly recurring revenue in approx. USD at the end of each bucket. Each running subscription is priced by its latest paid subscription payment; yearly plans count 1/12. Admin accounts excluded.",
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
        label: "MRR (USD)",
        description: "Output time series",
      },
      meta: {
        label: "Meta",
        description: "Node execution metadata",
      },
    },
    success: {
      title: "MRR computed",
      description: "MRR series returned",
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
