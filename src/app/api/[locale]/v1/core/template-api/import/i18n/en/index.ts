/**
 * Template Import API translations for English
 */

export const translations = {
  import: {
    // Enums
    enums: {
      importFormat: {
        csv: "CSV",
        json: "JSON",
        xml: "XML",
      },
      importMode: {
        createOnly: "Create Only",
        updateOnly: "Update Only",
        createOrUpdate: "Create or Update",
      },
      importStatus: {
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        failed: "Failed",
      },
    },
    title: "Import Templates",
    description: "Import templates from CSV, JSON, or XML files",
    category: "Template API",
    tags: {
      import: "Import",
      bulk: "Bulk Operation",
      templates: "Templates",
    },
    form: {
      title: "Import Configuration",
      description: "Configure template import settings",
    },

    // Field labels
    format: {
      label: "File Format",
      description: "Select the format of your import file",
      placeholder: "Choose file format",
    },
    mode: {
      label: "Import Mode",
      description: "Choose how to handle existing templates",
      placeholder: "Select import mode",
    },
    data: {
      label: "Import Data",
      description: "Paste your CSV, JSON, or XML data here",
      placeholder: "Paste your template data...",
    },
    validateOnly: {
      label: "Validate Only",
      description: "Only validate the data without importing",
    },
    skipErrors: {
      label: "Skip Errors",
      description: "Continue importing even if some records have errors",
    },
    defaultStatus: {
      label: "Default Status",
      description: "Status to use for templates without explicit status",
      placeholder: "Select default status",
    },

    // Response
    response: {
      title: "Import Results",
      description: "Details of the import operation",
    },

    // Errors
    errors: {
      validation: {
        title: "Invalid Import Data",
        description: "The import data is invalid or malformed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You do not have permission to import templates",
      },
      forbidden: {
        title: "Import Forbidden",
        description: "Template import is not allowed for your account",
      },
      server: {
        title: "Import Failed",
        description: "An error occurred while importing templates",
      },
      network: {
        title: "Network Error",
        description: "Unable to complete the import request",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred during import",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      conflict: {
        title: "Import Conflict",
        description: "A conflict occurred during the import process",
      },
      unsupportedFormat: "Unsupported import format",
    },

    // Success
    success: {
      title: "Import Complete",
      description: "Templates imported successfully",
    },
  },
};
