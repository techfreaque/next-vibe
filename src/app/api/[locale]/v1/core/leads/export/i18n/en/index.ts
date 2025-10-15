export const translations = {
  get: {
    title: "Export Leads",
    description: "Export leads data to file",
    form: {
      title: "Export Configuration",
      description: "Configure lead export parameters and filters",
    },
    format: {
      label: "Export Format",
      description: "File format for the export",
    },
    status: {
      label: "Lead Status",
      description: "Filter by lead status",
    },
    country: {
      label: "Country",
      description: "Filter by country",
      placeholder: "Select country",
    },
    language: {
      label: "Language",
      description: "Filter by language",
      placeholder: "Select language",
    },
    source: {
      label: "Lead Source",
      description: "Filter by lead source",
      placeholder: "Select source",
    },
    search: {
      label: "Search",
      description: "Search leads by text",
      placeholder: "Search leads...",
    },
    dateFrom: {
      label: "Start Date",
      description: "Export leads created from this date",
    },
    dateTo: {
      label: "End Date",
      description: "Export leads created until this date",
    },
    includeMetadata: {
      label: "Include Metadata",
      description: "Include creation and update timestamps",
    },
    includeEngagementData: {
      label: "Include Engagement Data",
      description: "Include email tracking and campaign data",
    },
    response: {
      title: "Export File",
      description: "Generated export file with lead data",
      fileName: "File Name",
      fileContent: "File Content (Base64)",
      mimeType: "MIME Type",
      totalRecords: "Total Records",
      exportedAt: "Exported At",
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
};
