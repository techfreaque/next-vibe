export const statusTranslations = {
  error: {
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to view agent processing status.",
    },
    validation: {
      title: "Validation error",
      description: "Invalid parameters provided for status query.",
    },
    server: {
      title: "Server error",
      description:
        "An error occurred while retrieving agent processing status.",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred while retrieving status.",
    },
  },
  success: {
    title: "Status retrieved",
    description: "Agent processing status retrieved successfully.",
  },
};
