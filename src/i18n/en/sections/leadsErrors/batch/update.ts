export const updateTranslations = {
  success: {
    title: "Batch update successful",
    description: "Leads have been updated successfully",
  },
  error: {
    server: {
      title: "Batch update failed",
      description: "Unable to update leads due to a server error",
    },
    validation: {
      title: "Validation failed",
      description: "Please check your input and try again",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to perform batch updates",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access to batch updates is forbidden",
    },
    not_found: {
      title: "Not found",
      description: "The requested resource was not found",
    },
    unknown: {
      title: "Unknown error",
      description: "An unexpected error occurred during batch update",
    },
  },
  validation: {
    no_fields: "At least one update field must be provided",
  },
};
