import { translations as jobsTranslations } from "../../jobs/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  jobs: jobsTranslations,
  status: statusTranslations,
  enums: {
    csvImportJobStatus: {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed", 
      failed: "Failed"
    },
    csvImportJobAction: {
      retry: "Retry",
      delete: "Delete",
      stop: "Stop"
    },
    importMode: {
      createOnly: "Create Only",
      updateOnly: "Update Only", 
      createOrUpdate: "Create or Update",
      skipDuplicates: "Skip Duplicates"
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV", 
      json: "JSON"
    },
    importProcessingType: {
      immediate: "Immediate",
      chunked: "Chunked",
      scheduled: "Scheduled"
    },
    importErrorType: {
      validationError: "Validation Error",
      duplicateEmail: "Duplicate Email",
      invalidFormat: "Invalid Format",
      missingRequiredField: "Missing Required Field",
      processingError: "Processing Error",
      systemError: "System Error"
    },
    batchProcessingStatus: {
      pending: "Pending", 
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      retrying: "Retrying"
    },
    importPriority: {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent"
    },
    importSource: {
      webUpload: "Web Upload",
      apiUpload: "API Upload",
      scheduledImport: "Scheduled Import",
      bulkOperation: "Bulk Operation"
    },
    csvDelimiter: {
      comma: "Comma",
      semicolon: "Semicolon", 
      tab: "Tab",
      pipe: "Pipe"
    },
    importValidationLevel: {
      strict: "Strict",
      moderate: "Moderate",
      lenient: "Lenient"
    },
    importNotificationType: {
      email: "Email",
      inApp: "In-App",
      webhook: "Webhook", 
      none: "None"
    }
  }
};
