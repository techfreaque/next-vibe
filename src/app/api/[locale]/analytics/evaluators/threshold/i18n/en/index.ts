export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Threshold",
    description:
      "Fires when a series value satisfies a comparison against a constant",
    fields: {
      source: { label: "Source", description: "Input time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to evaluate" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      op: {
        label: "Operator",
        description: "Comparison operator (>, <, >=, <=, ==)",
      },
      value: {
        label: "Threshold",
        description: "Constant value to compare against",
      },
      signals: { label: "Signals", description: "Output signal events" },
    },
    backButton: {
      label: "Back",
    },
    submitButton: {
      label: "Evaluate",
      loadingText: "Evaluating…",
    },
    success: {
      title: "Threshold evaluated",
      description: "Signal events returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Threshold evaluation failed",
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
