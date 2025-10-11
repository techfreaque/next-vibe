export const deleteTranslations = {
  error: {
    validation: {
      title: "Task deletion validation failed",
      description: "Please check your task ID and try again",
    },
    unauthorized: {
      title: "Task deletion unauthorized",
      description: "You don't have permission to delete this cron task",
    },
    notFound: {
      title: "Task not found",
      description: "The task you're trying to delete could not be found",
    },
    server: {
      title: "Task deletion server error",
      description: "Unable to delete task due to a server error",
    },
    unknown: {
      title: "Task deletion failed",
      description: "An unexpected error occurred while deleting the task",
    },
  },
  success: {
    title: "Task deleted successfully",
    description: "Cron task has been deleted successfully",
  },
};
