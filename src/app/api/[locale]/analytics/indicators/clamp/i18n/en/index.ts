export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Clamp",
    description: "Clamp values to a [min, max] range — caps outliers",
    fields: {
      source: { label: "Source", description: "Input time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to compute" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      min: {
        label: "Min",
        description: "Minimum value (lower bound)",
      },
      max: {
        label: "Max",
        description: "Maximum value (upper bound)",
      },
      result: { label: "Clamped", description: "Output time series" },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Clamp computed",
      description: "Clamped series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Clamp computation failed",
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
