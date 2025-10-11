export const translations = {
  patch: {
    title: "Batch Update",
    description: "Batch update leads based on filter criteria",
    form: {
      title: "Batch Update Configuration",
      description: "Configure batch update parameters",
    },
    search: {
      label: "Search",
      description: "Search leads by email or business name",
      placeholder: "Enter email or business name",
    },
    status: {
      label: "Status Filter",
      description: "Filter leads by current status",
    },
    currentCampaignStage: {
      label: "Campaign Stage Filter",
      description: "Filter leads by current campaign stage",
    },
    source: {
      label: "Source Filter",
      description: "Filter leads by source",
    },
    scope: {
      label: "Operation Scope",
      description: "Define the scope of the batch operation",
    },
    dryRun: {
      label: "Dry Run",
      description: "Preview changes without applying them",
    },
    maxRecords: {
      label: "Max Records",
      description: "Maximum number of records to process",
    },
    updates: {
      title: "Update Fields",
      description: "Specify which fields to update",
      status: {
        label: "New Status",
        description: "Update lead status to this value",
      },
      currentCampaignStage: {
        label: "New Campaign Stage",
        description: "Update campaign stage to this value",
      },
      source: {
        label: "New Source",
        description: "Update lead source to this value",
      },
      notes: {
        label: "Notes",
        description: "Add or update notes for the lead",
      },
    },
    response: {
      title: "Update Response",
      description: "Batch update response data",
      success: "Success",
      totalMatched: "Total Matched",
      totalProcessed: "Total Processed",
      totalUpdated: "Total Updated",
      preview: "Preview",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for batch operations",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters for batch update",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred during batch update",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during batch update",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred during batch update",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for batch operations",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found for batch update",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred during batch update",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes in the batch update",
      },
    },
    success: {
      title: "Update Success",
      description: "Batch update operation completed successfully",
    },
  },
  delete: {
    title: "Batch Delete",
    description: "Batch delete leads based on filter criteria",
    form: {
      title: "Batch Delete Configuration",
      description: "Configure batch delete parameters",
    },
    search: {
      label: "Search",
      description: "Search leads by email or business name",
    },
    status: {
      label: "Status Filter",
      description: "Filter leads by current status",
    },
    confirmDelete: {
      label: "Confirm Delete",
      description: "Confirm that you want to delete the selected leads",
    },
    dryRun: {
      label: "Dry Run",
      description: "Preview deletions without actually removing records",
    },
    maxRecords: {
      label: "Max Records",
      description: "Maximum number of records to delete",
    },
    response: {
      title: "Delete Response",
      description: "Batch delete response data",
      success: "Success",
      totalMatched: "Total Matched",
      totalProcessed: "Total Processed",
      totalDeleted: "Total Deleted",
      preview: "Preview",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for batch delete operations",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters for batch delete",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred during batch delete",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during batch delete",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred during batch delete",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for batch delete operations",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found for batch delete",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred during batch delete",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes in the batch delete",
      },
    },
    success: {
      title: "Delete Success",
      description: "Batch delete operation completed successfully",
    },
  },
  email: {
    admin: {
      batchUpdate: {
        title: "Batch Update Complete",
        subject: "Batch Update Results",
        preview: "{{totalProcessed}} leads were processed",
        message:
          "The batch update operation has completed with {{totalProcessed}} leads processed.",
        operationSummary: "Operation Summary",
        totalMatched: "Total Matched",
        totalProcessed: "Total Processed",
        totalUpdated: "Total Updated",
        errors: "Errors",
        dryRunNote: "This was a dry run - no actual changes were made.",
        viewLeads: "View Updated Leads",
        error: {
          noData: "No batch update data available",
        },
      },
      batchDelete: {
        title: "Batch Delete Complete",
        subject: "Batch Delete Results",
        preview: "{{totalProcessed}} leads were processed for deletion",
        message:
          "The batch delete operation has completed with {{totalProcessed}} leads processed.",
        operationSummary: "Operation Summary",
        totalMatched: "Total Matched",
        totalProcessed: "Total Processed",
        totalDeleted: "Total Deleted",
        errors: "Errors",
        dryRunNote: "This was a dry run - no actual deletions were made.",
        viewLeads: "View Leads",
        error: {
          noData: "No batch delete data available",
        },
      },
    },
  },
};
