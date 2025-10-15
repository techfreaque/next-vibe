import { translations as jobsTranslations } from "../../jobs/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  post: {
    title: "Import Leads",
    description: "Import leads from CSV file",
    form: {
      title: "Import Configuration",
      description: "Configure lead import parameters",
    },
    file: {
      label: "CSV File",
      description: "CSV file content (base64 encoded)",
      placeholder: "Paste base64 encoded CSV content",
      helpText: "Upload a CSV file with lead data",
    },
    fileName: {
      label: "File Name",
      description: "Name of the CSV file",
      placeholder: "leads.csv",
      helpText: "Provide a descriptive file name",
    },
    skipDuplicates: {
      label: "Skip Duplicates",
      description: "Skip leads with duplicate email addresses",
      helpText: "Enable to automatically skip existing email addresses",
    },
    updateExisting: {
      label: "Update Existing",
      description: "Update existing leads with new data",
      helpText: "Enable to update existing leads instead of skipping",
    },
    defaultCountry: {
      label: "Default Country",
      description: "Default country for leads without country specified",
      helpText: "Select the default country code",
    },
    defaultLanguage: {
      label: "Default Language",
      description: "Default language for leads without language specified",
      helpText: "Select the default language code",
    },
    defaultStatus: {
      label: "Default Status",
      description: "Default status for imported leads",
      helpText: "Select the initial status for new leads",
    },
    defaultCampaignStage: {
      label: "Default Campaign Stage",
      description: "Default email campaign stage for imported leads",
      helpText: "Select the initial campaign stage",
    },
    defaultSource: {
      label: "Default Source",
      description: "Default source attribution for imported leads",
      helpText: "Select the lead source for tracking",
    },
    useChunkedProcessing: {
      label: "Use Chunked Processing",
      description: "Process large imports in background chunks",
      helpText: "Enable for files with more than 1000 rows",
    },
    batchSize: {
      label: "Batch Size",
      description: "Number of rows to process per batch",
      helpText: "Recommended: 2000 rows per batch",
    },
    response: {
      batchId: "Batch ID",
      totalRows: "Total Rows",
      successfulImports: "Successful Imports",
      failedImports: "Failed Imports",
      duplicateEmails: "Duplicate Emails",
      errors: "Import Errors",
      summary: "Import Summary",
      isChunkedProcessing: "Using Chunked Processing",
      jobId: "Background Job ID",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid import parameters or CSV format",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to import leads",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for lead import",
      },
      notFound: {
        title: "Not Found",
        description: "CSV file not found or invalid",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict during import",
      },
      server: {
        title: "Server Error",
        description: "Internal server error during import",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during import",
      },
      network: {
        title: "Network Error",
        description: "Network error during import",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes in the import form",
      },
    },
    success: {
      title: "Import Started",
      description: "Lead import has been initiated successfully",
    },
  },
  jobs: jobsTranslations,
  status: statusTranslations,
  enums: {
    csvImportJobStatus: {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
    },
    csvImportJobAction: {
      retry: "Retry",
      delete: "Delete",
      stop: "Stop",
    },
    importMode: {
      createOnly: "Create Only",
      updateOnly: "Update Only",
      createOrUpdate: "Create or Update",
      skipDuplicates: "Skip Duplicates",
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV",
      json: "JSON",
    },
    importProcessingType: {
      immediate: "Immediate",
      chunked: "Chunked",
      scheduled: "Scheduled",
    },
    importErrorType: {
      validationError: "Validation Error",
      duplicateEmail: "Duplicate Email",
      invalidFormat: "Invalid Format",
      missingRequiredField: "Missing Required Field",
      processingError: "Processing Error",
      systemError: "System Error",
    },
    batchProcessingStatus: {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      retrying: "Retrying",
    },
    importPriority: {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
    },
    importSource: {
      webUpload: "Web Upload",
      apiUpload: "API Upload",
      scheduledImport: "Scheduled Import",
      bulkOperation: "Bulk Operation",
    },
    csvDelimiter: {
      comma: "Comma",
      semicolon: "Semicolon",
      tab: "Tab",
      pipe: "Pipe",
    },
    importValidationLevel: {
      strict: "Strict",
      moderate: "Moderate",
      lenient: "Lenient",
    },
    importNotificationType: {
      email: "Email",
      inApp: "In-App",
      webhook: "Webhook",
      none: "None",
    },
  },
};
