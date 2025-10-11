export const stopTranslations = {
  success: {
    title: "Import job stopped",
    description: "Import job has been successfully stopped",
  },
  error: {
    unauthorized: {
      title: "Import job stop not authorized",
      description: "You don't have permission to stop import jobs",
    },
    forbidden: {
      title: "Import job stop forbidden",
      description: "You don't have permission to stop this import job",
    },
    not_found: {
      title: "Import job not found",
      description: "The import job could not be found",
    },
    validation: {
      title: "Cannot stop import job",
      description: "This import job cannot be stopped in its current state",
    },
    server: {
      title: "Import job stop server error",
      description: "Import job could not be stopped due to a server error",
    },
  },
};
