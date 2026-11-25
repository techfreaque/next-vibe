export const translations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    metric: {
      occurrences: "Occurrences",
      distinct: "Error classes seen",
      new: "New error classes",
      openBacklog: "Open backlog (unresolved now)",
    },
    level: {
      all: "Errors and warnings",
      error: "Errors only",
      warn: "Warnings only",
    },
  },
  post: {
    title: "Error Log Series",
    titleShort: "Error Logs",
    description:
      "Error log volume over time. Occurrences and classes seen come from the per-day counter (daily buckets, history since 2026-11-22). New classes count first sightings. Open backlog is the current unresolved count, recorded on every graph run.",
    fields: {
      resolution: {
        label: "Resolution",
        description:
          "Computation timeframe (occurrences and classes seen are daily at most)",
      },
      range: {
        label: "Range",
        description: "Time range to query",
      },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      metric: {
        label: "Metric",
        description:
          "What to count: occurrences, error classes seen, new classes or the open backlog",
      },
      level: {
        label: "Level",
        description: "Errors, warnings or both",
      },
      result: {
        label: "Error log count",
        description: "Output time series",
      },
      meta: {
        label: "Meta",
        description: "Node execution metadata",
      },
    },
    success: {
      title: "Error log series computed",
      description: "Error log series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: { title: "Server error", description: "Query failed" },
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
