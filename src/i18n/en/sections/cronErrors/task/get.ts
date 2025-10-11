export const getTranslations = {
  error: {
    validation: {
      title: "Task retrieval validation failed",
      description: "Please check your task ID and try again",
    },
    unauthorized: {
      title: "Task retrieval unauthorized",
      description: "You don't have permission to view this cron task",
    },
    notFound: {
      title: "Task not found",
      description: "The requested cron task could not be found",
    },
    server: {
      title: "Task retrieval server error",
      description: "Unable to retrieve task due to a server error",
    },
    unknown: {
      title: "Task retrieval failed",
      description: "An unexpected error occurred while retrieving the task",
    },
  },
  success: {
    title: "Task retrieved successfully",
    description: "Cron task details have been retrieved successfully",
  },
};
