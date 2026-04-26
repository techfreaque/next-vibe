export const translations = {
  post: {
    title: "Backfill Embeddings",
    description: "Generate embeddings for all cortex nodes missing them.",
    status: {
      loading: "Embedding...",
      done: "Done",
    },
    tags: {
      cortex: "Cortex",
    },
    widget: {
      hint: "Generate embeddings for all cortex nodes that are missing them. This may take a while.",
    },
    fields: {},
    submitButton: {
      label: "Start Backfill",
      loadingText: "Processing...",
    },
    response: {
      processed: { text: "Embedded" },
      failed: { text: "Failed" },
      skipped: { text: "Skipped" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Invalid request",
      },
      network: {
        title: "Offline",
        description: "Can't reach server",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "Log in first",
      },
      forbidden: {
        title: "Admin Only",
        description: "Requires admin access",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      server: {
        title: "Server Error",
        description: "Embedding service failed",
      },
      unknown: {
        title: "Error",
        description: "Something went wrong",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: {
        title: "Already Running",
        description: "A backfill is already in progress",
      },
    },
    success: {
      title: "Backfill Complete",
      description: "All embeddings processed",
    },
  },
};
