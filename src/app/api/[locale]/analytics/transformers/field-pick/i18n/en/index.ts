export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Field Pick",
    description:
      "Field Pick — extracts a named field from a time series (superseded, returns empty)",
    fields: {
      source: { label: "Source", description: "Input time series" },
      field: {
        label: "Field",
        description: "Field name to extract (no longer supported)",
      },
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to compute" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start for warm-up",
      },
      result: { label: "Result", description: "Output time series" },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Field pick executed",
      description: "Result series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Field pick computation failed",
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
