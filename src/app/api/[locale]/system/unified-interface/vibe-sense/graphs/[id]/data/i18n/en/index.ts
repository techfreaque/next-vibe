export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Graph Detail",
    description: "View graph chart with indicators and signals",
    fields: {
      id: { label: "Graph ID", description: "UUID of the graph" },
      resolution: {
        label: "Resolution",
        description: "Bucket size for time series",
      },
      cursor: {
        label: "Cursor",
        description: "Oldest loaded timestamp for pagination",
      },
    },
    response: {
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Name",
        description: "Description",
        ownerType: "Owner Type",
        isActive: "Active",
        createdAt: "Created At",
        config: "Config",
      },
      series: {
        nodeId: "Node ID",
        timestamp: "Timestamp",
        value: "Value",
      },
      signals: {
        nodeId: "Node ID",
        timestamp: "Timestamp",
        fired: "Fired",
      },
    },
    widget: {
      loading: "Loading graph...",
      back: "Back",
      active: "Active",
      inactive: "Inactive",
      nodes: "nodes",
      trigger: "Trigger",
      backtest: "Backtest",
      edit: "Edit",
      archive: "Archive",
      promote: "Promote",
      signal: "Signal",
      noData: "No data in this range",
      loadingEarlierData: "Loading earlier data\u2026",
    },
    success: {
      title: "Graph loaded",
      description: "Graph retrieved successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Access denied" },
      server: { title: "Server error", description: "Failed to load graph" },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: { title: "Validation failed", description: "Invalid ID" },
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
