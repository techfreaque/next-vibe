export const translations = {
  post: {
    title: "Export Leads",
    description: "Export leads data to file",
    form: {
      title: "Export Configuration",
      description: "Configure lead export parameters and filters",
    },
    response: {
      title: "Export File",
      description: "Generated export file with lead data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to export leads",
      },
      validation: {
        title: "Validation Error", 
        description: "Invalid export parameters or filters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred during export",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during export",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred during export",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for lead export",
      },
      notFound: {
        title: "No Data",
        description: "No leads found matching export criteria",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred during export",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes in the export form",
      },
    },
    success: {
      title: "Export Complete",
      description: "Lead export completed successfully",
    },
  },
} ;
