export const translations = {
  category: "Chat",
  tags: {
    folders: "Folders",
  },

  patch: {
    title: "Rename Folder",
    description: "Rename an existing folder",
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder to rename",
    },
    name: {
      label: "Name",
      description: "The new folder name",
    },
    icon: {
      label: "Icon",
      description: "Lucide or Simple Icons icon name",
    },
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided data is invalid",
        circularReference: "Cannot set folder as its own parent",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to rename folders",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to rename this folder",
      },
      notFound: {
        title: "Not Found",
        description: "The requested folder was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while renaming the folder",
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
        description: "A folder with this name already exists",
      },
    },
    success: {
      title: "Success",
      description: "Folder renamed successfully",
    },
  },
};
