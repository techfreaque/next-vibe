export const translations = {
  get: {
    title: "Get Folder Permissions",
    description: "Retrieve the list of moderators for a specific folder",
    container: {
      title: "Folder Permissions",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder",
    },
    response: {
      title: "Folder Permissions",
      moderatorIds: {
        title: "Moderator IDs",
        description: "List of user IDs who can moderate this folder",
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
        description: "A network error occurred while retrieving folder permissions",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view folder permissions",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view this folder's permissions",
      },
      notFound: {
        title: "Not Found",
        description: "The requested folder was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving folder permissions",
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
      description: "Folder permissions retrieved successfully",
    },
  },
  patch: {
    title: "Update Folder Permissions",
    description: "Update the list of moderators for a specific folder",
    container: {
      title: "Update Folder Permissions",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder to update",
    },
    permissions: {
      title: "Permissions Update",
      moderatorIds: {
        label: "Moderator IDs",
        description: "List of user IDs who can moderate this folder",
        item: {
          label: "User ID",
        },
      },
    },
    response: {
      title: "Updated Permissions",
      message: {
        content: "Folder permissions updated successfully",
      },
      moderatorIds: {
        title: "Current Moderators",
        description: "Updated list of moderators for this folder",
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
        description: "A network error occurred while updating folder permissions",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update folder permissions",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this folder's permissions",
      },
      notFound: {
        title: "Not Found",
        description: "The requested folder was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating folder permissions",
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
      description: "Folder permissions updated successfully",
    },
  },
};
