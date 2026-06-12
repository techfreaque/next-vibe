export const translations = {
  tags: {
    import: "Import",
    leads: "Leads",
    csv: "CSV",
  },

  category: "Data Import",
  post: {
    title: "Import Leads",
    titleShort: "Import Leads",
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
      titleShort: "Process Import",
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
  jobs: {
    jobId: {
      category: "Data Import",
      tags: {
        leads: "Leads",
        management: "Management",
      },

      get: {
        title: "Get Import Job",
        description: "Get details of a specific import job",
        actions: {
          retry: "Retry",
          stop: "Stop",
          viewLeads: "View Leads",
        },
        jobId: {
          label: "Job ID",
          description: "Unique identifier for the import job",
        },
        form: {
          title: "Import Job Status",
          description: "Current status and progress of the import job",
        },
        response: {
          title: "Job Information",
          description: "Current import job details",
          info: {
            title: "Job Information",
            description: "Basic job details",
          },
          id: {
            content: "Job ID",
          },
          fileName: {
            content: "File Name",
          },
          status: {
            content: "Job Status",
          },
          progress: {
            title: "Import Progress",
            description: "Current import progress and statistics",
          },
          totalRows: {
            content: "Total Rows",
          },
          processedRows: {
            content: "Processed Rows",
          },
          successfulImports: {
            content: "Successful Imports",
          },
          failedImports: {
            content: "Failed Imports",
          },
          duplicateEmails: {
            content: "Duplicate Emails",
          },
          configuration: {
            title: "Job Configuration",
            description: "Current job configuration settings",
          },
          currentBatchStart: {
            content: "Current Batch Start",
          },
          batchSize: {
            content: "Batch Size",
          },
          retryCount: {
            content: "Retry Count",
          },
          maxRetries: {
            content: "Max Retries",
          },
          error: {
            content: "Error Message",
          },
          timestamps: {
            title: "Job Timestamps",
            description: "Job lifecycle timestamps",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
          startedAt: {
            content: "Started At",
          },
          completedAt: {
            content: "Completed At",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "The provided job ID is invalid",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to view jobs",
          },
          forbidden: {
            title: "Access Denied",
            description: "You don't have permission to view this job",
          },
          notFound: {
            title: "Job Not Found",
            description: "No import job found with the provided ID",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while retrieving the job",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          network: {
            title: "Network Error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred while retrieving the job",
          },
        },
        success: {
          title: "Success",
          description: "Import job retrieved successfully",
        },
      },
      patch: {
        title: "Update Import Job",
        description: "Update import job configuration settings",
        jobId: {
          label: "Job ID",
          description: "Unique identifier for the import job",
        },
        form: {
          title: "Update Job Settings",
          description: "Modify import job configuration",
        },
        settings: {
          title: "Job Settings",
          description: "Configuration settings for the import job",
        },
        batchSize: {
          label: "Batch Size",
          description: "Number of rows to process in each batch",
          placeholder: "100",
        },
        maxRetries: {
          label: "Max Retries",
          description: "Maximum number of retry attempts for failed rows",
          placeholder: "3",
        },
        response: {
          title: "Updated Job Information",
          description: "Updated import job details",
          info: {
            title: "Job Information",
            description: "Basic job details",
          },
          id: {
            content: "Job ID",
          },
          fileName: {
            content: "File Name",
          },
          status: {
            content: "Job Status",
          },
          progress: {
            title: "Import Progress",
            description: "Current import progress and statistics",
          },
          totalRows: {
            content: "Total Rows",
          },
          processedRows: {
            content: "Processed Rows",
          },
          successfulImports: {
            content: "Successful Imports",
          },
          failedImports: {
            content: "Failed Imports",
          },
          duplicateEmails: {
            content: "Duplicate Emails",
          },
          configuration: {
            title: "Job Configuration",
            description: "Current job configuration settings",
          },
          currentBatchStart: {
            content: "Current Batch Start",
          },
          batchSize: {
            content: "Batch Size",
          },
          retryCount: {
            content: "Retry Count",
          },
          maxRetries: {
            content: "Max Retries",
          },
          error: {
            content: "Error Message",
          },
          timestamps: {
            title: "Job Timestamps",
            description: "Job lifecycle timestamps",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
          startedAt: {
            content: "Started At",
          },
          completedAt: {
            content: "Completed At",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "The provided data is invalid",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to update jobs",
          },
          forbidden: {
            title: "Access Denied",
            description: "You don't have permission to update this job",
          },
          notFound: {
            title: "Job Not Found",
            description: "No import job found with the provided ID",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while updating the job",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          network: {
            title: "Network Error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Update Conflict",
            description: "The job was modified by another user",
          },
        },
        success: {
          title: "Success",
          description: "Import job updated successfully",
        },
      },
      delete: {
        title: "Delete Import Job",
        description: "Delete a specific import job",
        jobId: {
          label: "Job ID",
          description: "Unique identifier for the import job to delete",
        },
        form: {
          title: "Delete Import Job",
          description: "Confirm deletion of the import job",
        },
        response: {
          title: "Deletion Result",
          description: "Result of the deletion operation",
          success: {
            content: "Success Status",
          },
          message: {
            content: "Deletion Message",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "The provided job ID is invalid",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to delete jobs",
          },
          forbidden: {
            title: "Access Denied",
            description: "You don't have permission to delete this job",
          },
          notFound: {
            title: "Job Not Found",
            description: "No import job found with the provided ID",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while deleting the job",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          network: {
            title: "Network Error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Deletion Conflict",
            description: "Cannot delete job that is currently processing",
          },
        },
        success: {
          title: "Success",
          description: "Import job deleted successfully",
        },
      },
      retry: {
        category: "Data Import",
        tags: {
          leads: "Leads",
          management: "Management",
        },

        post: {
          title: "Retry Import Job",
          description: "Retry a failed import job",
          jobId: {
            label: "Job ID",
            description: "Unique identifier for the import job to retry",
          },
          form: {
            title: "Retry Import Job",
            description: "Retry the failed import job",
          },
          response: {
            title: "Retry Result",
            description: "Result of the retry operation",
            success: {
              content: "Success Status",
            },
            message: {
              content: "Retry Message",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "The provided job ID is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required to retry jobs",
            },
            forbidden: {
              title: "Access Denied",
              description: "You don't have permission to retry this job",
            },
            notFound: {
              title: "Job Not Found",
              description: "No import job found with the provided ID",
            },
            server: {
              title: "Server Error",
              description: "An error occurred while retrying the job",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred",
            },
            network: {
              title: "Network Error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Retry Conflict",
              description: "Cannot retry job that is currently processing",
            },
          },
          success: {
            title: "Success",
            description: "Import job retried successfully",
          },
        },
        widget: {
          title: "Retry Import Job",
          successMessage: "Job retry initiated successfully",
        },
      },
      stop: {
        category: "Data Import",
        tags: {
          leads: "Leads",
          management: "Management",
        },

        post: {
          title: "Stop Import Job",
          description: "Stop a running import job",
          jobId: {
            label: "Job ID",
            description: "Unique identifier for the import job to stop",
          },
          form: {
            title: "Stop Import Job",
            description: "Stop the running import job",
          },
          response: {
            title: "Stop Result",
            description: "Result of the stop operation",
            success: {
              content: "Success Status",
            },
            message: {
              content: "Stop Message",
            },
          },
          errors: {
            validation: {
              title: "Validation Error",
              description: "The provided job ID is invalid",
            },
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required to stop jobs",
            },
            forbidden: {
              title: "Access Denied",
              description: "You don't have permission to stop this job",
            },
            notFound: {
              title: "Job Not Found",
              description: "No import job found with the provided ID",
            },
            server: {
              title: "Server Error",
              description: "An error occurred while stopping the job",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unexpected error occurred",
            },
            network: {
              title: "Network Error",
              description: "Unable to connect to the server",
            },
            unsavedChanges: {
              title: "Unsaved Changes",
              description: "You have unsaved changes",
            },
            conflict: {
              title: "Stop Conflict",
              description: "Cannot stop job that is not currently processing",
            },
          },
          success: {
            title: "Success",
            description: "Import job stopped successfully",
          },
        },
        widget: {
          title: "Stop Import Job",
          successMessage: "Job stopped successfully",
        },
      },
      widget: {
        status: {
          title: "Import Job Status",
          loadingJobStatus: "Loading job status…",
          totalRows: "Total Rows",
          processed: "Processed",
          imported: "Imported",
          failed: "Failed",
          duplicates: "Duplicates",
          progress: "Progress",
          configurationTitle: "Configuration",
          batchSize: "Batch Size",
          batchStart: "Batch Start",
          retries: "Retries",
          timestampsTitle: "Timestamps",
          created: "Created",
          started: "Started",
          completed: "Completed",
          jobStatus: {
            enums: {
              csvImportJobStatus: {
                pending: "Pending",
                processing: "Processing",
                completed: "Completed",
                failed: "Failed",
              },
            },
          },
        },
        retry: {
          title: "Retry Import Job",
          loadingRetrying: "Retrying job…",
          successMessage: "Job Retried Successfully",
          failureMessage: "Retry Failed",
          viewJobStatus: "View Job Status",
          viewLeads: "View Leads",
        },
        stop: {
          title: "Stop Import Job",
          loadingStopping: "Stopping job…",
          successMessage: "Job Stopped Successfully",
          failureMessage: "Stop Failed",
          viewLeads: "View Leads",
          startNewImport: "Start New Import",
        },
      },
    },
  },
  status: {
    category: "Data Import",
    tags: {
      import: "Import",
      jobs: "Jobs",
      list: "List",
    },

    get: {
      title: "Import Jobs Status",
      titleShort: "Import Jobs",
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
    widget: {
      status: {
        pending: "Pending",
        running: "Running",
        completed: "Completed",
        failed: "Failed",
        stopped: "Stopped",
      },
      filter: {
        all: "All",
        pending: "Pending",
        running: "Running",
        completed: "Completed",
        failed: "Failed",
      },
      progress: {
        rows: "rows",
      },
      job: {
        total: "Total:",
        processed: "Processed:",
        ok: "OK:",
        fail: "Fail:",
        created: "Created:",
        done: "Done:",
      },
      header: {
        title: "Import Jobs",
        newImport: "New Import",
      },
      loading: "Loading import jobs\u2026",
      empty: {
        title: "No import jobs found",
        withFilter: "Try a different filter or start a new import.",
        withoutFilter: "Start your first import to see it here.",
        newImport: "New Import",
      },
    },
  },
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
