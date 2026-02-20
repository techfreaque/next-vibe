export const translations = {
  tag: "Bulk Actions",
  post: {
    title: "Bulk Update Messages",
    description: "Apply an action to multiple messages at once",
    ids: {
      label: "Message IDs",
      description: "List of message IDs to update",
    },
    action: {
      label: "Action",
      description: "Action to apply to selected messages",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid bulk action parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "One or more messages not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred during bulk update",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes exist",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Bulk Update Successful",
      description: "Selected messages have been updated",
    },
  },
};
