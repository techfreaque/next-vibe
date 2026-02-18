import { translations as retryTranslations } from "../../retry/i18n/en";
import { translations as stopTranslations } from "../../stop/i18n/en";

export const translations = {
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
  retry: retryTranslations,
  stop: stopTranslations,
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
    },
    retry: {
      title: "Retry Import Job",
      loadingRetrying: "Retrying job…",
      successMessage: "Job Retried Successfully",
      failureMessage: "Retry Failed",
    },
    stop: {
      title: "Stop Import Job",
      loadingStopping: "Stopping job…",
      successMessage: "Job Stopped Successfully",
      failureMessage: "Stop Failed",
    },
  },
};
