export const translations = {
  get: {
    title: "Get Folder Permissions",
    description: "Retrieve the list of moderators for a specific folder",
    container: {
      title: "Folder Permissions",
      description: "View and manage folder access permissions",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder",
    },
    response: {
      title: "Folder Permissions",
      rolesView: {
        label: "View Roles",
        description: "Roles that can view this folder",
      },
      rolesManage: {
        label: "Manage Roles",
        description: "Roles that can manage folder settings",
      },
      rolesCreateThread: {
        label: "Create Thread Roles",
        description: "Roles that can create threads in this folder",
      },
      rolesPost: {
        label: "Post Roles",
        description: "Roles that can post messages",
      },
      rolesModerate: {
        label: "Moderate Roles",
        description: "Roles that can moderate content",
      },
      rolesAdmin: {
        label: "Admin Roles",
        description: "Roles with full administrative access",
      },
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
        description:
          "A network error occurred while retrieving folder permissions",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view folder permissions",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "You don't have permission to view this folder's permissions",
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
      description: "Modify folder access permissions",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder to update",
    },
    rolesView: {
      label: "View Roles",
      description: "Roles that can view this folder",
    },
    rolesManage: {
      label: "Manage Roles",
      description: "Roles that can manage folder settings",
    },
    rolesCreateThread: {
      label: "Create Thread Roles",
      description: "Roles that can create threads in this folder",
    },
    rolesPost: {
      label: "Post Roles",
      description: "Roles that can post messages",
    },
    rolesModerate: {
      label: "Moderate Roles",
      description: "Roles that can moderate content",
    },
    rolesAdmin: {
      label: "Admin Roles",
      description: "Roles with full administrative access",
    },
    permissions: {
      title: "Permissions Update",
      moderatorIds: {
        label: "Moderator IDs",
        description: "List of user IDs who can moderate this folder",
      },
    },
    response: {
      title: "Updated Permissions",
      rolesView: {
        label: "View Roles",
        description: "Roles that can view this folder",
      },
      rolesManage: {
        label: "Manage Roles",
        description: "Roles that can manage folder settings",
      },
      rolesCreateThread: {
        label: "Create Thread Roles",
        description: "Roles that can create threads in this folder",
      },
      rolesPost: {
        label: "Post Roles",
        description: "Roles that can post messages",
      },
      rolesModerate: {
        label: "Moderate Roles",
        description: "Roles that can moderate content",
      },
      rolesAdmin: {
        label: "Admin Roles",
        description: "Roles with full administrative access",
      },
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
        description:
          "A network error occurred while updating folder permissions",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update folder permissions",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "You don't have permission to update this folder's permissions",
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
