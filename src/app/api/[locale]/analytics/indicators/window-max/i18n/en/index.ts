export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Window Max",
    description:
      "Rolling window maximum — tracks the highest value in a fixed window",
    fields: {
      source: { label: "Source", description: "Input time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to compute" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      size: {
        label: "Window Size",
        description: "Number of periods in the rolling window (1–500)",
      },
      result: { label: "Window Max", description: "Output time series" },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Window Max computed",
      description: "Window maximum series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Window Max computation failed",
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
