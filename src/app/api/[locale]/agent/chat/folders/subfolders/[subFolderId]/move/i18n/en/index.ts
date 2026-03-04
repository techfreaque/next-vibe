export const translations = {
  category: "Chat",
  tags: {
    folders: "Folders",
  },

  patch: {
    title: "Move Folder",
    description: "Move a folder to a different parent",
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder to move",
    },
    parentId: {
      label: "Parent Folder",
      description: "Move folder to a different parent (null for root)",
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
        description: "You must be logged in to move folders",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to move this folder",
      },
      notFound: {
        title: "Not Found",
        description: "The requested folder was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while moving the folder",
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
        description: "Cannot move folder to this location",
      },
    },
    success: {
      title: "Success",
      description: "Folder moved successfully",
    },
  },
  widget: {
    moveFolder: {
      description: "Select the destination folder",
      rootLevel: "(top level)",
    },
  },
};
