export const translations = {
  category: "Lead Management",
  tags: {
    leads: "Leads",
    search: "Search",
  },
  get: {
    title: "Search Leads",
    description: "Search leads with filtering and pagination",
    form: {
      title: "Lead Search Form",
      description: "Enter search criteria to find leads",
    },
    search: {
      label: "Search Query",
      description:
        "Search term to filter leads by email, business name, or notes",
      placeholder: "Enter search term...",
    },
    limit: {
      label: "Results Limit",
      description: "Maximum number of results to return (1-100)",
    },
    offset: {
      label: "Results Offset",
      description: "Number of results to skip for pagination",
    },
    response: {
      title: "Search Results",
      description: "Paginated search results with lead data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to search leads",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid search parameters provided",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred while searching leads",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while searching leads",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while searching leads",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for lead search",
      },
      notFound: {
        title: "No Results",
        description: "No leads found matching search criteria",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes in the search form",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred while searching leads",
      },
    },
    success: {
      title: "Search Complete",
      description: "Lead search completed successfully",
    },
  },
};
