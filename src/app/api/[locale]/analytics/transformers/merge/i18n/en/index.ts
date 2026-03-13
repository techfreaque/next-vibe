export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Merge",
    description: "Merge — sums two time series aligned by timestamp",
    fields: {
      a: { label: "Series A", description: "First input time series" },
      b: { label: "Series B", description: "Second input time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to compute" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      result: { label: "Merged", description: "Output time series (A + B)" },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Merge computed",
      description: "Merged series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Merge computation failed",
      },
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
