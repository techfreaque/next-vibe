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
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analytics",
    pipeline: "pipeline",
  },

  // Registry endpoint
  registry: {
    get: {
      title: "Indicator Registry",
      description:
        "List all registered indicators available for graph building",
      container: {
        title: "Indicators",
        description: "All registered indicators",
      },
      response: {
        indicators: "Indicators",
      },
      success: {
        title: "Registry loaded",
        description: "Indicator registry retrieved successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: {
          title: "Server error",
          description: "Failed to load registry",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid request",
        },
        notFound: { title: "Not found", description: "Registry not found" },
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
  },

  // Graph list
  graphs: {
    list: {
      title: "Pipeline Graphs",
      description: "List all graphs visible to the current user",
      container: {
        title: "Graphs",
        description: "All pipeline graphs",
      },
      response: {
        graphs: "Graphs",
      },
      success: {
        title: "Graphs loaded",
        description: "Pipeline graphs retrieved successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: { title: "Server error", description: "Failed to load graphs" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid request",
        },
        notFound: { title: "Not found", description: "No graphs found" },
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
    create: {
      title: "Create Graph",
      description: "Create a new pipeline graph",
      fields: {
        name: {
          label: "Name",
          description: "Graph display name",
          placeholder: "My graph",
        },
        slug: {
          label: "Slug",
          description: "Unique identifier",
          placeholder: "my-graph",
        },
        description: {
          label: "Description",
          description: "Optional description",
          placeholder: "",
        },
        config: { label: "Config", description: "Graph DAG configuration" },
      },
      response: {
        id: "Graph ID",
      },
      success: {
        title: "Graph created",
        description: "Pipeline graph created successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: {
          title: "Server error",
          description: "Failed to create graph",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid graph config",
        },
        notFound: { title: "Not found", description: "Resource not found" },
        conflict: {
          title: "Conflict",
          description: "Graph slug already exists",
        },
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
    get: {
      title: "Get Graph",
      description: "Get a specific graph by ID",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph version" },
      },
      response: {
        graph: "Graph",
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
    edit: {
      title: "Edit Graph",
      description:
        "Branch and edit a graph (creates new version, never mutates)",
      fields: {
        id: {
          label: "Graph ID",
          description: "UUID of the version to branch from",
        },
        config: { label: "Config", description: "Updated graph config" },
        name: { label: "Name", description: "Updated name" },
        description: {
          label: "Description",
          description: "Updated description",
        },
      },
      response: {
        id: "New Version ID",
      },
      success: {
        title: "Graph branched",
        description: "New graph version created successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access denied" },
        server: { title: "Server error", description: "Failed to edit graph" },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid config",
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
    promote: {
      title: "Promote to System",
      description: "Promote an admin graph to system-owned (read-only, shared)",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph to promote" },
      },
      response: {
        id: "Graph ID",
      },
      success: {
        title: "Graph promoted",
        description: "Graph promoted to system successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: {
          title: "Server error",
          description: "Failed to promote graph",
        },
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
    trigger: {
      title: "Trigger Graph",
      description: "Manually trigger on-demand graph execution",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph to trigger" },
        rangeFrom: { label: "From", description: "Range start (ISO date)" },
        rangeTo: { label: "To", description: "Range end (ISO date)" },
      },
      response: {
        nodeCount: "Nodes executed",
        errorCount: "Errors",
        errors: "Errors",
      },
      success: {
        title: "Graph executed",
        description: "Graph ran successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: {
          title: "Server error",
          description: "Graph execution failed",
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
    backtest: {
      title: "Run Backtest",
      description: "Run a backtest over a historical range (actions simulated)",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph version" },
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
        server: { title: "Server error", description: "Backtest failed" },
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
    data: {
      title: "Graph Data",
      description: "Fetch time-series data for a graph (on-demand execution)",
      fields: {
        id: { label: "Graph ID", description: "UUID of the graph" },
        rangeFrom: { label: "From", description: "Range start" },
        rangeTo: { label: "To", description: "Range end" },
      },
      response: {
        series: "Series",
        signals: "Signals",
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
        server: { title: "Server error", description: "Failed to fetch data" },
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
  },

  // Cleanup task
  cleanup: {
    post: {
      title: "Vibe Sense Cleanup",
      description: "Run retention cleanup for datapoints and expire snapshots",
      success: {
        title: "Cleanup complete",
        description: "Retention cleanup finished",
      },
      response: {
        nodesProcessed: "Nodes processed",
        totalDeleted: "Rows deleted",
        snapshotsDeleted: "Snapshots deleted",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Admin access required" },
        server: { title: "Server error", description: "Cleanup failed" },
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
    name: "Vibe Sense Cleanup",
    description: "Prunes old datapoints and expires snapshot cache",
  },
};
