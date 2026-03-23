export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Ratio",
    description: "Ratio - divides series A by series B, aligned by timestamp",
    fields: {
      a: { label: "Numerator (A)", description: "Dividend time series" },
      b: { label: "Denominator (B)", description: "Divisor time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to compute" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      result: { label: "Ratio", description: "Output time series (A / B)" },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Ratio computed",
      description: "Ratio series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Ratio computation failed",
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
