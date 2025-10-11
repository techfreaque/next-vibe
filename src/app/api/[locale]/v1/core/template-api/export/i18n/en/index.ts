/**
 * Template Export API translations for English
 */

export const translations = {
  export: {
    title: "Export Templates",
    description: "Export templates in various formats",
    category: "Template API",
    tags: {
      export: "Export",
      download: "Download",
    },
    form: {
      title: "Export Configuration",
      description: "Configure template export options",
    },

    // Field labels
    format: {
      label: "Export Format",
      description: "Choose the format for exported templates",
      placeholder: "Select export format",
    },
    templateIds: {
      label: "Template IDs",
      description: "Specific template IDs to export (leave empty for all)",
      placeholder: "Select templates to export",
    },
    status: {
      label: "Status Filter",
      description: "Export templates with selected statuses",
      placeholder: "Select status",
    },
    tagsFilter: {
      label: "Tag Filter",
      description: "Export templates with selected tags",
      placeholder: "Select tags",
    },
    includeContent: {
      label: "Include Content",
      description: "Include template content in export",
    },
    includeMetadata: {
      label: "Include Metadata",
      description: "Include creation dates and user information",
    },
    dateFrom: {
      label: "Start Date",
      description: "Export templates created after this date",
      placeholder: "Select start date",
    },
    dateTo: {
      label: "End Date",
      description: "Export templates created before this date",
      placeholder: "Select end date",
    },

    // Response
    response: {
      title: "Export Result",
      description: "Exported template data",
    },

    // Enums
    enums: {
      exportFormat: {
        json: "JSON",
        csv: "CSV",
        xml: "XML",
      },
      importMode: {
        createOnly: "Create Only",
        updateOnly: "Update Only",
        createOrUpdate: "Create or Update",
      },
      exportStatus: {
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        failed: "Failed",
      },
    },

    // Debug messages
    debug: {
      exporting: "Starting template export",
      noTemplates: "No templates found matching export criteria",
      success: "Templates exported successfully",
    },

    // Errors
    errors: {
      validation: {
        title: "Invalid Export Parameters",
        description: "The export parameters provided are invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You do not have permission to export templates",
      },
      forbidden: {
        title: "Export Forbidden",
        description: "Template export is not allowed for your account",
      },
      notFound: {
        title: "No Templates Found",
        description: "No templates found matching the export criteria",
      },
      server: {
        title: "Export Failed",
        description: "An error occurred while exporting templates",
      },
      network: {
        title: "Network Error",
        description: "Unable to complete the export request",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred during export",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      conflict: {
        title: "Export Conflict",
        description: "A conflict occurred during the export process",
      },
    },

    // Success
    success: {
      title: "Export Complete",
      description: "Templates exported successfully",
    },
  },
};
