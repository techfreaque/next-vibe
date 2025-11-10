export const translations = {
  get: {
    title: "Get Root Folder Permissions",
    description: "Compute permissions for a root folder",
    container: {
      title: "Root Folder Permissions",
      description: "View permissions for root folders",
    },
    rootFolderId: {
      label: "Root Folder ID",
      description: "The ID of the root folder to check permissions for",
      placeholder: "private, shared, public, or incognito",
    },
    response: {
      canCreateThread: {
        content: "Can Create Thread",
      },
      canCreateFolder: {
        content: "Can Create Folder",
      },
    },
    success: {
      title: "Success",
      description: "Root folder permissions retrieved successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid root folder ID provided",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to check permissions",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Not Found",
        description: "Root folder not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
  },
};
