export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "MACD",
    description:
      "Moving Average Convergence Divergence — trend-following momentum indicator",
    fields: {
      source: { label: "Source", description: "Input time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to compute" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      fastPeriod: {
        label: "Fast Period",
        description: "Fast EMA period (1–100)",
      },
      slowPeriod: {
        label: "Slow Period",
        description: "Slow EMA period (1–200)",
      },
      signalPeriod: {
        label: "Signal Period",
        description: "Signal line EMA period (1–50)",
      },
      macd: { label: "MACD", description: "MACD line (fast EMA − slow EMA)" },
      signal: {
        label: "Signal",
        description: "Signal line (EMA of MACD line)",
      },
      histogram: {
        label: "Histogram",
        description: "Histogram (MACD − signal)",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "MACD computed",
      description: "MACD, signal, and histogram series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "MACD computation failed",
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
