export const translations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },

  list: {
    title: "Pipeline Graphs",
    description: "List all graphs visible to the current user",
    fields: {
      search: {
        label: "Search",
        description: "Filter graphs by name or slug",
        placeholder: "Search graphs...",
      },
    },
    container: {
      title: "Graphs",
      description: "All pipeline graphs",
    },
    response: {
      graphs: "Graphs",
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Name",
        description: "Description",
        ownerType: "Owner Type",
        ownerId: "Owner ID",
        isActive: "Active",
        createdAt: "Created At",
      },
    },
    success: {
      title: "Graphs loaded",
      description: "Pipeline graphs retrieved successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to list graphs",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server error",
        description: "Failed to load graphs",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred while loading graphs",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request parameters",
      },
      notFound: {
        title: "Not found",
        description: "No graphs found",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict occurred",
      },
      network: {
        title: "Network error",
        description: "Network request failed while loading graphs",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save changes before continuing",
      },
    },
  },

  widget: {
    refresh: "Refresh",
    createGraph: "New Graph",
    active: "Active",
    inactive: "Inactive",
    empty: "No graphs yet. Create your first pipeline graph.",
    error: "Failed to load graphs. Please try again.",
    archive: "Archive",
    searchPlaceholder: "Search by name, slug, or description\u2026",
    noMatchTitle: "No matching graphs",
    noMatchHint: "Try a different search term",
    clearSearch: "Clear search",
    searchResults: "results for",
    stats: {
      total: "Total Graphs",
      active: "Active",
      system: "System",
      admin: "Admin",
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
        description: "Unique identifier (lowercase, hyphens only)",
        placeholder: "my-graph",
      },
      description: {
        label: "Description",
        description: "Optional description",
        placeholder: "",
      },
      config: {
        label: "Config",
        description: "Graph DAG configuration",
      },
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
        description: "Authentication required to create graphs",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server error",
        description: "Failed to create graph",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred while creating graph",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid graph configuration",
      },
      notFound: {
        title: "Not found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Graph slug already exists",
      },
      network: {
        title: "Network error",
        description: "Network request failed while creating graph",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save changes before continuing",
      },
    },
  },
};
