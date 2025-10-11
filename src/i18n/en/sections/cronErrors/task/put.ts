export const putTranslations = {
  error: {
    validation: {
      title: "Task update validation failed",
      description: "Please check your task parameters and try again",
    },
    unauthorized: {
      title: "Task update unauthorized",
      description: "You don't have permission to update this cron task",
    },
    notFound: {
      title: "Task not found",
      description: "The task you're trying to update could not be found",
    },
    server: {
      title: "Task update server error",
      description: "Unable to update task due to a server error",
    },
    unknown: {
      title: "Task update failed",
      description: "An unexpected error occurred while updating the task",
    },
  },
  success: {
    title: "Task updated successfully",
    description: "Your cron task has been updated successfully",
  },
};
