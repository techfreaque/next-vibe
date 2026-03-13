export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  cleanup: {
    name: "Vibe Sense Cleanup",
    description: "Prunes old datapoints and expires snapshot cache",
  },
  graphRunner: {
    name: "Vibe Sense Graph Runner",
    description: "Executes all cron-triggered pipeline graphs that are due",
  },
  post: {
    title: "Vibe Sense Cleanup",
    description: "Run retention cleanup for datapoints and expire snapshots",
    response: {
      nodesProcessed: "Nodes processed",
      totalDeleted: "Rows deleted",
      snapshotsDeleted: "Snapshots deleted",
      graphsChecked: "Graphs checked",
      graphsExecuted: "Graphs executed",
    },
    success: {
      title: "Cleanup complete",
      description: "Retention cleanup finished",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Cleanup failed",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request",
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
