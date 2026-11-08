export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Sharp Drop",
    titleShort: "Drop",
    description:
      "Fires when a value falls sharply below its own trailing average",
    fields: {
      source: { label: "Source", description: "Input time series" },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to evaluate" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      window: {
        label: "Trailing bars",
        description: "How many previous bars form the baseline average",
      },
      dropPct: {
        label: "Drop",
        description: "Fire below baseline × (1 − drop). 0.5 = a 50% drop",
      },
      minBaseline: {
        label: "Min baseline",
        description:
          "Ignore bars whose baseline is below this (too little data)",
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
      title: "Drop evaluated",
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
        description: "Drop evaluation failed",
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
