export const translations = {
  // === MAIN CATEGORY ===
  category: "Data Import",

  // === CSV IMPORT ENDPOINT ===
  csv: {
    post: {
      title: "Import CSV Data",
      description:
        "Import data from CSV files with intelligent processing and validation",

      form: {
        title: "CSV Import Configuration",
        description: "Configure your CSV import settings for optimal results",
      },

      // === FILE UPLOAD SECTION ===
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

      // === PROCESSING SECTION ===
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

      // === DEFAULTS SECTION ===
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

      // === RESPONSE ===
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

      // === ERRORS ===
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

  // === JOBS LIST ENDPOINT ===
  jobs: {
    get: {
      title: "Import Job History",
      description: "View and manage your import jobs",

      form: {
        title: "Filter Import Jobs",
        description: "Filter jobs by status, date, or other criteria",
      },

      status: {
        label: "Job Status",
        description: "Filter by current job status",
        placeholder: "All statuses",
      },

      limit: {
        label: "Results Per Page",
        description: "Number of jobs to show per page",
        placeholder: "20",
      },

      offset: {
        label: "Page Offset",
        description: "Skip this many results (for pagination)",
        placeholder: "0",
      },

      response: {
        title: "Import Jobs",
        description: "Your import job history and current status",

        jobs: {
          title: "Jobs List",
        },

        job: {
          title: "Job Details",

          id: {
            label: "Job ID",
          },

          fileName: {
            label: "File Name",
          },

          domain: {
            label: "Domain",
          },

          status: {
            label: "Status",
          },

          progress: {
            title: "Progress Information",

            totalRows: {
              label: "Total Rows",
            },

            processedRows: {
              label: "Processed Rows",
            },

            currentBatchStart: {
              label: "Current Batch Start",
            },

            batchSize: {
              label: "Batch Size",
            },

            percentComplete: {
              label: "Percent Complete",
            },
          },

          results: {
            title: "Results",

            successfulImports: {
              label: "Successful Imports",
            },

            failedImports: {
              label: "Failed Imports",
            },

            duplicateEmails: {
              label: "Duplicate Emails",
            },
          },

          timing: {
            title: "Timing Information",

            createdAt: {
              label: "Created At",
            },

            updatedAt: {
              label: "Updated At",
            },

            startedAt: {
              label: "Started At",
            },

            completedAt: {
              label: "Completed At",
            },
          },

          errorInfo: {
            title: "Error Information",

            error: {
              label: "Error Message",
            },

            retryCount: {
              label: "Retry Count",
            },

            maxRetries: {
              label: "Max Retries",
            },
          },
        },
      },

      errors: {
        unauthorized: {
          title: "Access Denied",
          description: "You don't have permission to view import jobs",
        },
        server: {
          title: "Failed to Load Jobs",
          description: "Unable to retrieve your import job history",
        },
      },

      success: {
        title: "Jobs Loaded",
        description: "Successfully retrieved your import job history",
      },
    },
  },

  // === ENUM TRANSLATIONS ===
  enum: {
    // === JOB STATUS ===
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

    // === IMPORT DOMAINS ===
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

    // === FILE FORMATS ===
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

    // === PROCESSING MODES ===
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

    // === ERROR TYPES ===
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

    // === BATCH SIZE PRESETS ===
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

  // === NEXT STEPS ===
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

  // === ACTION MESSAGES ===
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

  // === TAGS ===
  tags: {
    csv: "CSV",
    upload: "Upload",
    batch: "Batch Processing",
    jobs: "Jobs",
    status: "Status",
    history: "History",
    statistics: "Statistics",
    analytics: "Analytics",
  },
  error: {
    default: "An error occurred",
  },
};
