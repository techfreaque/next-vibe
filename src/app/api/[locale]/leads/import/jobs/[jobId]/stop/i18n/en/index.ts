export const translations = {
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
};
