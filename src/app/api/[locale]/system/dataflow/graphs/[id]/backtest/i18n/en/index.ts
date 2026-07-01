export const translations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 Minute",
      "3m": "3 Minutes",
      "5m": "5 Minutes",
      "15m": "15 Minutes",
      "30m": "30 Minutes",
      "1h": "1 Hour",
      "4h": "4 Hours",
      "1d": "1 Day",
      "1w": "1 Week",
      "1M": "1 Month",
    },
  },
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Run Backtest",
    titleShort: "Backtest",
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
