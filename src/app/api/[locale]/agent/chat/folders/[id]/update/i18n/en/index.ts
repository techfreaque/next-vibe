export const translations = {
  category: "Chat",
  tags: {
    folders: "Folders",
  },

  patch: {
    title: "Update Folder",
    description: "Update an existing folder",
    container: {
      title: "Update Folder",
      description: "Modify folder properties",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder to update",
    },
    sections: {
      updates: {
        title: "Folder Updates",
        description: "Fields to update",
      },
    },
    name: {
      label: "Name",
      description: "The folder name",
    },
    icon: {
      label: "Icon",
      description: "Lucide or Simple Icons icon name",
    },
    color: {
      label: "Color",
      description: "Hex color code for visual distinction",
    },
    parentId: {
      label: "Parent Folder",
      description: "Move folder to a different parent (null for root)",
    },
    expanded: {
      label: "Expanded",
      description: "Whether the folder is expanded in the UI",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Order for sorting folders",
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
        description: "You must be logged in to update folders",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this folder",
      },
      notFound: {
        title: "Not Found",
        description: "The requested folder was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating the folder",
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
      description: "Folder updated successfully",
    },
  },
};
