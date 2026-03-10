export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Graph Detail",
    description: "View graph chart with indicators and signals",
    fields: { id: { label: "Graph ID", description: "UUID of the graph" } },
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
  post: {
    title: "Graph Data",
    description: "Fetch time-series data for a graph (on-demand execution)",
    fields: {
      id: { label: "Graph ID", description: "UUID of the graph" },
      rangeFrom: { label: "From", description: "Range start (ISO date)" },
      rangeTo: { label: "To", description: "Range end (ISO date)" },
    },
    response: {
      series: {
        nodeId: "Node ID",
        points: {
          timestamp: "Timestamp",
          value: "Value",
        },
      },
      signals: {
        nodeId: "Node ID",
        events: {
          timestamp: "Timestamp",
          fired: "Fired",
        },
      },
    },
    widget: {
      loadButton: "Load Data",
      loadingButton: "Loading...",
      noData: "No data in this range",
    },
    success: {
      title: "Data loaded",
      description: "Graph data retrieved successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Access denied" },
      server: {
        title: "Server error",
        description: "Failed to fetch data",
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
