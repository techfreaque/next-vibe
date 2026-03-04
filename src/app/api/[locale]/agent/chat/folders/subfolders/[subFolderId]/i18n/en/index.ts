export const translations = {
  category: "Chat",
  tags: {
    folders: "Folders",
  },

  get: {
    title: "Get Folder",
    description: "Get a folder by ID",
    container: {
      title: "Folder",
      description: "Folder details",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder",
    },
    response: {
      folder: {
        id: { content: "ID" },
        name: { content: "Name" },
        icon: { content: "Icon" },
        color: { content: "Color" },
        parentId: { content: "Parent ID" },
        rootFolderId: { content: "Root Folder" },
        expanded: { content: "Expanded" },
        sortOrder: { content: "Sort Order" },
        createdAt: { content: "Created At" },
        updatedAt: { content: "Updated At" },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view folders",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view this folder",
      },
      notFound: {
        title: "Not Found",
        description: "The requested folder was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while fetching the folder",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "A conflict occurred" },
    },
    success: { title: "Success", description: "Folder fetched successfully" },
  },

  delete: {
    title: "Delete Folder",
    description: "Delete a folder by ID",
    container: {
      title: "Delete Folder",
      description: "Confirm folder deletion",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder to delete",
    },
    response: {
      id: { content: "ID" },
      name: { content: "Name" },
      updatedAt: { content: "Deleted At" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to delete folders",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to delete this folder",
      },
      notFound: {
        title: "Not Found",
        description: "The requested folder was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while deleting the folder",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
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
        description: "Cannot delete folder — it may have contents",
      },
    },
    success: { title: "Success", description: "Folder deleted successfully" },
  },

  errors: {
    not_implemented_on_native: "{{method}} is not implemented on native",
  },
};
