export const retryTranslations = {
  success: {
    title: "Import job retried",
    description: "Import job has been queued for retry",
  },
  error: {
    unauthorized: {
      title: "Import job retry not authorized",
      description: "You don't have permission to retry import jobs",
    },
    forbidden: {
      title: "Import job retry forbidden",
      description: "You don't have permission to retry this import job",
    },
    not_found: {
      title: "Import job not found",
      description: "The import job could not be found",
    },
    validation: {
      title: "Cannot retry import job",
      description: "This import job cannot be retried in its current state",
    },
    server: {
      title: "Import job retry server error",
      description: "Import job could not be retried due to a server error",
    },
  },
};
