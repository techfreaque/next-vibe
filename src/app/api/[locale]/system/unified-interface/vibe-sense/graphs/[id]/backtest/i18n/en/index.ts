export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Run Backtest",
    description: "Run a backtest over a historical range (actions simulated)",
    fields: {
      id: { label: "Graph ID", description: "UUID of the graph" },
      rangeFrom: { label: "From", description: "Backtest range start" },
      rangeTo: { label: "To", description: "Backtest range end" },
      resolution: {
        label: "Resolution",
        description: "Timeframe for evaluation",
      },
    },
    response: {
      runId: "Run ID",
      eligible: "Eligible",
      ineligibleNodes: "Ineligible nodes",
    },
    widget: {
      eligible: "Eligible",
      notEligible: "Not Eligible",
      runLabel: "Run:",
      ineligibleNodesLabel: "Ineligible nodes:",
      ineligibleNodesHint:
        "These nodes cannot be backtested (missing persisted data, incompatible resolution, or script-only logic).",
    },
    success: {
      title: "Backtest complete",
      description: "Backtest ran successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Backtest failed",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid parameters",
      },
      notFound: { title: "Not found", description: "Graph not found" },
      conflict: { title: "Conflict", description: "Resource conflict" },
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
