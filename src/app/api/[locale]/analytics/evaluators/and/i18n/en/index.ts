export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "AND",
    description: "Fires only when all input signals fire at the same timestamp",
    fields: {
      signals: {
        label: "Signal Streams",
        description: "Array of signal streams to AND together",
      },
      result: { label: "Result", description: "Output signal events" },
    },
    success: {
      title: "AND evaluated",
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
        description: "AND evaluation failed",
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
