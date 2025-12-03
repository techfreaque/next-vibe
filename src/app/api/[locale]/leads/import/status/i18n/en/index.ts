export const translations = {
  get: {
    title: "Import Jobs Status",
    description: "List and monitor CSV import jobs",
    form: {
      title: "Job Filters",
      description: "Filter import jobs by status and pagination",
    },
    filters: {
      title: "Filters",
      description: "Filter options for import jobs",
    },
    status: {
      label: "Job Status",
      description: "Filter by job status",
      placeholder: "Select status",
    },
    limit: {
      label: "Results Per Page",
      description: "Number of jobs to return",
      placeholder: "50",
    },
    offset: {
      label: "Page Offset",
      description: "Number of jobs to skip",
      placeholder: "0",
    },
    response: {
      title: "Import Jobs",
      description: "List of import jobs with their current status",
      items: {
        title: "Jobs List",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid filter parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to view import jobs",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for import jobs",
      },
      notFound: {
        title: "Not Found",
        description: "No import jobs found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error while fetching jobs",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error while fetching jobs",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Jobs Retrieved",
      description: "Import jobs list retrieved successfully",
    },
  },
};
