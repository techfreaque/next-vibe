export const translations = {
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
};
