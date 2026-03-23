export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Bollinger Bands",
    description:
      "Bollinger Bands - upper, middle (SMA), and lower band using standard deviation",
    fields: {
      source: { label: "Source", description: "Input time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to compute" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      period: {
        label: "Period",
        description: "Number of periods (2–200)",
      },
      stdDev: {
        label: "Std Dev Multiplier",
        description: "Standard deviation multiplier (0.1–5)",
      },
      upper: {
        label: "Upper Band",
        description: "Upper Bollinger Band time series",
      },
      middle: {
        label: "Middle Band",
        description: "Middle band (SMA) time series",
      },
      lower: {
        label: "Lower Band",
        description: "Lower Bollinger Band time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Bollinger Bands computed",
      description: "Upper, middle, and lower band series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Bollinger Bands computation failed",
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
