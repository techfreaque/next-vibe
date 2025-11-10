export const translations = {
  get: {
    title: "Get Thread Permissions",
    description: "Retrieve the list of moderators for a specific thread",
    container: {
      title: "Thread Permissions",
    },
    threadId: {
      label: "Thread ID",
      description: "The unique identifier of the thread",
    },
    response: {
      title: "Thread Permissions",
      moderatorIds: {
        title: "Moderator IDs",
        description: "List of user IDs who can moderate this thread",
        content: "User ID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided data is invalid",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred while retrieving thread permissions",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view thread permissions",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "You don't have permission to view this thread's permissions",
      },
      notFound: {
        title: "Not Found",
        description: "The requested thread was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving thread permissions",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "There was a conflict with the current state",
      },
    },
    success: {
      title: "Success",
      description: "Thread permissions retrieved successfully",
    },
  },
  patch: {
    title: "Update Thread Permissions",
    description: "Update the list of moderators for a specific thread",
    container: {
      title: "Update Thread Permissions",
    },
    threadId: {
      label: "Thread ID",
      description: "The unique identifier of the thread to update",
    },
    permissions: {
      title: "Permissions Update",
      moderatorIds: {
        label: "Moderator IDs",
        description: "List of user IDs who can moderate this thread",
        item: {
          label: "User ID",
        },
      },
    },
    response: {
      title: "Updated Permissions",
      message: {
        content: "Thread permissions updated successfully",
      },
      moderatorIds: {
        title: "Current Moderators",
        description: "Updated list of moderators for this thread",
        content: "User ID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided moderator IDs are invalid",
      },
      network: {
        title: "Network Error",
        description:
          "A network error occurred while updating thread permissions",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update thread permissions",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "You don't have permission to update this thread's permissions",
      },
      notFound: {
        title: "Not Found",
        description: "The requested thread was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating thread permissions",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "There was a conflict with the current state",
      },
    },
    success: {
      title: "Success",
      description: "Thread permissions updated successfully",
    },
  },
};
