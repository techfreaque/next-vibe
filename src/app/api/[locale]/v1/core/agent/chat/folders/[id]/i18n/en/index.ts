import { translations as permissionsTranslations } from "../../permissions/i18n/en";

export const translations = {
  permissions: permissionsTranslations,
  get: {
    title: "Get Folder",
    description: "Retrieve a specific folder by ID",
    container: {
      title: "Folder Details",
      description: "View folder information",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder",
    },
    response: {
      title: "Folder",
      description: "The requested folder details",
      folder: {
        title: "Folder",
        id: {
          content: "ID",
        },
        userId: {
          content: "User ID",
        },
        name: {
          content: "Name",
        },
        icon: {
          content: "Icon",
        },
        color: {
          content: "Color",
        },
        parentId: {
          content: "Parent Folder",
        },
        expanded: {
          content: "Expanded",
        },
        sortOrder: {
          content: "Sort Order",
        },
        metadata: {
          content: "Metadata",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided folder ID is invalid",
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
        description: "An error occurred while retrieving the folder",
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
        description: "A conflict occurred while processing your request",
      },
    },
    success: {
      title: "Success",
      description: "Folder retrieved successfully",
    },
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
    metadata: {
      label: "Metadata",
      description: "Additional folder metadata",
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
      title: "Updated Folder",
      description: "The updated folder details",
      folder: {
        title: "Folder",
        id: {
          content: "ID",
        },
        userId: {
          content: "User ID",
        },
        name: {
          content: "Name",
        },
        icon: {
          content: "Icon",
        },
        color: {
          content: "Color",
        },
        parentId: {
          content: "Parent Folder",
        },
        expanded: {
          content: "Expanded",
        },
        sortOrder: {
          content: "Sort Order",
        },
        metadata: {
          content: "Metadata",
        },
        createdAt: {
          content: "Created At",
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
  delete: {
    title: "Delete Folder",
    description: "Delete a folder and all its contents",
    container: {
      title: "Delete Folder",
      description: "Remove folder permanently",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder to delete",
    },
    response: {
      title: "Deletion Result",
      description: "Confirmation of folder deletion",
      success: {
        content: "Success",
      },
      deletedFolderId: {
        content: "Deleted Folder ID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided folder ID is invalid",
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
        description: "Cannot delete folder with active contents",
      },
    },
    success: {
      title: "Success",
      description: "Folder deleted successfully",
    },
  },
};
