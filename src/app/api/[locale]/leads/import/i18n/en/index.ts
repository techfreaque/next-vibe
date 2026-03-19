import { translations as jobsTranslations } from "../../jobs/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  tags: {
    import: "Import",
    leads: "Leads",
    csv: "CSV",
  },

  category: "Data Import",
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
    widget: {
      headerTitle: "Import Leads from CSV",
      exportTemplateButton: "Export Template",
      importGuideTitle: "Import Guide",
      importGuideSubtitle: "Upload a CSV file with the following columns:",
      importGuideNote:
        "Only {{email}} is required. All other columns are optional and will fall back to the defaults configured below.",
      fileRequirementsTitle: "File Requirements",
      fileRequirementFormat:
        "Format: CSV (comma-separated values, UTF-8 encoded)",
      fileRequirementHeader:
        "First row must be the header row with column names",
      fileRequirementSize: "Maximum recommended size: 50 MB per upload",
      fileRequirementChunked:
        "For files larger than ~5 000 rows, enable {{chunkedProcessing}} to avoid timeouts",
      chunkedProcessingLabel: "Chunked Processing",
      downloadTemplateLink: "Download CSV template",
      loadingText: "Importing leads\u2026",
      backgroundProcessingTitle: "Background Processing",
      backgroundProcessingNote:
        "Large import queued as job: {{jobId}}. Processing {{totalRows}} rows in the background.",
      checkJobStatusButton: "Check Job Status",
      stopJobButton: "Stop Job",
      retryFailedButton: "Retry Failed",
      statTotalRows: "Total Rows",
      statImported: "Imported",
      statDuplicates: "Duplicates",
      statFailed: "Failed",
      viewImportedLeadsButton: "View Imported Leads",
      retryFailedWithCountButton: "Retry Failed ({{count}})",
      summaryTitle: "Summary",
      summaryNewLeads: "New Leads",
      summaryUpdated: "Updated",
      summarySkipped: "Skipped",
      successRateLabel: "Success Rate",
      importErrorsTitle: "{{count}} Import Errors",
      errorRowLabel: "Row {{row}}",
      findLeadButton: "Find Lead",
    },
  },
  process: {
    tag: "Import Process",
    post: {
      title: "Process Import Jobs",
      description: "Process pending CSV import jobs",
      container: {
        title: "Import Process Configuration",
        description: "Configure import process parameters",
      },
      fields: {
        maxJobsPerRun: {
          label: "Max Jobs Per Run",
          description: "Maximum number of jobs to process per run",
        },
        maxRetriesPerJob: {
          label: "Max Retries Per Job",
          description: "Maximum number of retries per job",
        },
        dryRun: {
          label: "Dry Run",
          description: "Run without making changes",
        },
        selfTaskId: {
          label: "Self Task ID",
          description: "Internal task ID for self-cleanup after processing",
        },
      },
      response: {
        jobsProcessed: "Jobs Processed",
        totalRowsProcessed: "Total Rows Processed",
        successfulImports: "Successful Imports",
        failedImports: "Failed Imports",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        server: {
          title: "Server Error",
          description: "An error occurred while processing imports",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
      },
      success: {
        title: "Import Processing Complete",
        description: "Import jobs processed successfully",
      },
    },
  },
  widget: {
    header: {
      title: "Import Jobs",
      newImport: "New Import",
    },
    filter: {
      all: "All",
      completed: "Completed",
      failed: "Failed",
      pending: "Pending",
      running: "Running",
    },
    loading: "Loading import jobs\u2026",
    empty: {
      title: "No import jobs found",
      withFilter: "Try a different filter or start a new import.",
      withoutFilter: "Start your first import to see it here.",
      newImport: "New Import",
    },
  },
  jobs: jobsTranslations,
  status: statusTranslations,
  csv: {
    post: {
      title: "Import CSV Data",
      description:
        "Import data from CSV files with intelligent processing and validation",
      form: {
        title: "CSV Import Configuration",
        description: "Configure your CSV import settings for optimal results",
      },
      fileSection: {
        title: "File Upload",
        description: "Select your CSV file and specify the target domain",
      },
      file: {
        label: "CSV File",
        description: "Select a CSV file to upload (max 10MB)",
        placeholder: "Choose CSV file...",
        helpText:
          "Supported format: CSV with comma-separated values. First row should contain column headers.",
      },
      fileName: {
        label: "File Name",
        description: "Name for this import (for your reference)",
        placeholder: "e.g., January 2024 Leads Import",
      },
      domain: {
        label: "Import Domain",
        description: "What type of data are you importing?",
        placeholder: "Select data type...",
      },
      processingSection: {
        title: "Processing Options",
        description: "Configure how your data should be processed",
      },
      skipDuplicates: {
        label: "Skip Duplicates",
        description: "Skip records with duplicate email addresses",
        helpText: "Recommended: Prevents importing the same contact twice",
      },
      updateExisting: {
        label: "Update Existing",
        description: "Update existing records with new data from CSV",
        helpText: "If unchecked, existing records will be left unchanged",
      },
      useChunkedProcessing: {
        label: "Background Processing",
        description: "Process large files in the background",
        helpText: "Recommended for files with more than 500 records",
      },
      batchSize: {
        label: "Batch Size",
        description: "Number of records to process at once",
        placeholder: "100",
        helpText: "Smaller batches are more stable, larger batches are faster",
      },
      defaultsSection: {
        title: "Default Values (Optional)",
        description: "Set default values for records missing this information",
      },
      defaultCountry: {
        label: "Default Country",
        description: "Country for records without location",
        placeholder: "Select country...",
      },
      defaultLanguage: {
        label: "Default Language",
        description: "Language for records without language preference",
        placeholder: "Select language...",
      },
      response: {
        title: "Import Results",
        description: "Summary of your CSV import operation",
        basicResults: {
          title: "Basic Results",
          description: "Core import statistics",
        },
        batchId: {
          label: "Batch ID",
        },
        totalRows: {
          label: "Total Rows",
        },
        isChunkedProcessing: {
          label: "Background Processing",
        },
        jobId: {
          label: "Job ID",
        },
        statistics: {
          title: "Import Statistics",
          description: "Detailed breakdown of the import operation",
        },
        successfulImports: {
          label: "Successful Imports",
        },
        failedImports: {
          label: "Failed Imports",
        },
        duplicateEmails: {
          label: "Duplicate Emails",
        },
        processingTimeMs: {
          label: "Processing Time (ms)",
        },
        summary: {
          title: "Import Summary",
          description: "Overview of import results",
        },
        newRecords: {
          label: "New Records",
        },
        updatedRecords: {
          label: "Updated Records",
        },
        skippedDuplicates: {
          label: "Skipped Duplicates",
        },
        errors: {
          title: "Error Details",
          row: {
            label: "Row",
          },
          email: {
            label: "Email",
          },
          error: {
            label: "Error",
          },
        },
        nextSteps: {
          title: "Next Steps",
          item: {
            label: "Next Step",
          },
        },
      },
      errors: {
        validation: {
          title: "Invalid Import Data",
          description: "Please check your CSV file and settings",
          emptyFile: "CSV file content is required",
          emptyFileName: "Please provide a name for this import",
          invalidDomain: "Please select a valid import domain",
          invalidBatchSize: "Batch size must be between 10 and 1000",
          fileTooLarge:
            "File size exceeds 10MB limit. Consider using background processing.",
        },
        unauthorized: {
          title: "Access Denied",
          description: "You don't have permission to import data",
        },
        fileTooLarge: {
          title: "File Too Large",
          description:
            "The selected file exceeds the maximum size limit of 10MB",
        },
        server: {
          title: "Import Failed",
          description:
            "An error occurred while processing your import. Please try again.",
        },
        network: {
          title: "Network Error",
          description: "Network connection failed during import",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to perform this import",
        },
        notFound: {
          title: "Not Found",
          description: "Import resource not found",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Data Conflict",
          description: "A conflict occurred with existing data",
        },
      },
      success: {
        title: "Import Successful",
        description: "Your CSV data has been successfully imported",
      },
    },
  },
  enum: {
    status: {
      pending: {
        label: "Pending",
        description: "Job is waiting to be processed",
      },
      processing: {
        label: "Processing",
        description: "Job is currently being processed",
      },
      completed: {
        label: "Completed",
        description: "Job finished successfully",
      },
      failed: {
        label: "Failed",
        description: "Job encountered an error",
      },
      cancelled: {
        label: "Cancelled",
        description: "Job was cancelled by user",
      },
      paused: {
        label: "Paused",
        description: "Job processing is temporarily paused",
      },
    },
    domain: {
      leads: {
        label: "Leads",
        description: "Potential customers and business contacts",
      },
      contacts: {
        label: "Contacts",
        description: "General contact information and address book",
      },
      businessData: {
        label: "Business Data",
        description: "Company information and business profiles",
      },
      emails: {
        label: "Email Lists",
        description: "Email marketing lists and campaigns",
      },
      users: {
        label: "Users",
        description: "System users and account information",
      },
      templates: {
        label: "Templates",
        description: "Email templates and content",
      },
    },
    format: {
      csv: {
        label: "CSV File",
        description: "Comma-separated values (most common)",
      },
      xlsx: {
        label: "Excel File",
        description: "Microsoft Excel spreadsheet",
      },
      json: {
        label: "JSON File",
        description: "JavaScript Object Notation data",
      },
      tsv: {
        label: "TSV File",
        description: "Tab-separated values",
      },
    },
    processing: {
      immediate: {
        label: "Process Now",
        description: "Process the file immediately (fastest)",
      },
      background: {
        label: "Background",
        description: "Process in the background (for large files)",
      },
      scheduled: {
        label: "Schedule Later",
        description: "Schedule processing for a specific time",
      },
    },
    errorType: {
      validation: {
        label: "Validation Error",
        description: "Data doesn't meet required format or rules",
      },
      duplicate: {
        label: "Duplicate Data",
        description: "Record already exists in the system",
      },
      format: {
        label: "Format Error",
        description: "File format is incorrect or corrupted",
      },
      processing: {
        label: "Processing Error",
        description: "Error occurred during data processing",
      },
      system: {
        label: "System Error",
        description: "Internal system error",
      },
    },
    batchSize: {
      small: {
        label: "Small (50)",
        description: "Best for testing or small imports",
      },
      medium: {
        label: "Medium (100)",
        description: "Recommended for most imports",
      },
      large: {
        label: "Large (250)",
        description: "Good for large files with simple data",
      },
      xlarge: {
        label: "Extra Large (500)",
        description: "For very large files (advanced users)",
      },
    },
  },
  nextSteps: {
    reviewErrors: "Review the error details to understand what went wrong",
    checkDuplicates: "Consider adjusting duplicate handling settings",
    reviewLeads: "Review your imported leads in the leads management section",
    startCampaign: "Consider starting an email campaign with your new leads",
    reviewContacts: "Review your imported contacts in the contacts section",
    organizeContacts: "Organize your contacts into groups or tags",
    reviewImported: "Review your imported data in the relevant section",
    monitorProgress: "Monitor the progress in the job history",
    checkJobsList: "Check the jobs list for detailed status updates",
  },
  errors: {
    cancel: {
      server: "Failed to cancel import job",
    },
    retry: {
      server: "Failed to retry import job",
    },
    delete: {
      server: "Failed to delete import job",
    },
    status: {
      server: "Failed to get job status",
    },
  },
  error: {
    default: "An error occurred",
  },
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
    leadStatus: {
      new: "New",
      pending: "Pending",
      campaignRunning: "Campaign Running",
      websiteUser: "Website User",
      newsletterSubscriber: "Newsletter Subscriber",
      inContact: "In Contact",
      signedUp: "Signed Up",
      subscriptionConfirmed: "Subscription Confirmed",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced",
      invalid: "Invalid",
    },
    emailCampaignStage: {
      notStarted: "Not Started",
      initial: "Initial Contact",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Nurture",
      reactivation: "Reactivation",
    },
    leadSource: {
      website: "Website",
      socialMedia: "Social Media",
      emailCampaign: "Email Campaign",
      referral: "Referral",
      csvImport: "CSV Import",
    },
  },
};
