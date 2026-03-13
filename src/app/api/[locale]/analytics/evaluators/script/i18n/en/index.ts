export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Script Evaluator",
    description: "Sandboxed custom evaluation via user-provided function body",
    fields: {
      source: { label: "Source", description: "Input time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to evaluate" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      fn: {
        label: "Function",
        description:
          "Function body — receives inputs array, returns SignalEvent[]",
      },
      signals: { label: "Signals", description: "Output signal events" },
    },
    success: {
      title: "Script evaluated",
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
        description: "Script evaluation failed",
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
