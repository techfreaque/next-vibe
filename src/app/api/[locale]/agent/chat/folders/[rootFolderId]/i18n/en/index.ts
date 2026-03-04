export const translations = {
  category: "Chat",
  tags: {
    folders: "Folders",
  },
  widget: {
    config: {
      foldersShort: {
        private: "Private",
        shared: "Shared",
        public: "Public",
        incognito: "Incognito",
        cron: "Cron",
      },
    },
    folderList: {
      newChatInFolder: "New chat in folder",
      moveUp: "Move Up",
      moveDown: "Move Down",
      newSubfolder: "New Subfolder",
      managePermissions: "Manage Permissions",
      renameFolder: "Rename Folder",
      moveToFolder: "Move to Folder",
      deleteFolder: "Delete Folder",
      deleteDialog: {
        title: "Delete Folder",
        description: 'Are you sure you want to delete "{{folderName}}"?',
      },
      pinned: "Pinned",
      pin: "Pin",
      unpin: "Unpin",
      today: "Today",
      lastWeek: "Last 7 Days",
      lastMonth: "Last 30 Days",
      older: "Older",
      showMore: "Show more",
    },
    renameFolder: {
      title: "Rename Folder",
    },
    moveFolder: {
      title: "Move Folder",
    },
    newFolder: {
      title: "Create New Folder",
    },
    permissions: {
      folderTitle: "Folder Permissions",
    },
    accessModal: {
      title: "Account Required",
      privateTitle: "Private Threads",
      sharedTitle: "Shared Threads",
      publicTitle: "Public Forum",
      incognitoTitle: "Incognito Mode",
      privateExplanation:
        "Private threads are your personal space for conversations with AI. All your chats are securely stored on our servers and automatically synchronized across all your devices.",
      sharedExplanation:
        "Shared threads allow you to create conversations and share them with others via secure links. Perfect for collaboration and sharing insights with your team or friends.",
      publicExplanation:
        "The Public Forum is a First Amendment protected space where people and AI engage in open dialogue. Share ideas, challenge perspectives, and participate in uncensored discussions.",
      incognitoExplanation:
        "Incognito mode keeps your conversations completely private and local. Your chats are stored only in your browser and never sent to our servers - not even tied to your account.",
      requiresAccount:
        "To access {{folderName}}, you need to create an account or sign in.",
      loginButton: "Login",
      signupButton: "Sign Up",
      close: "Close",
    },
    actions: {
      rename: "Rename",
      moveToFolder: "Move to Folder",
      pin: "Pin",
      unpin: "Unpin",
    },
    threadList: {
      deleteDialog: {
        title: "Delete Thread",
        description: 'Are you sure you want to delete "{{title}}"?',
      },
    },
    common: {
      cancel: "Cancel",
      delete: "Delete",
      noChatsFound: "No threads found",
      searchPlaceholder: "Search...",
      privateChats: "Private Threads",
      sharedChats: "Shared Threads",
      publicChats: "Public Threads",
      incognitoChats: "Incognito Threads",
      newChat: "New Thread",
      newPrivateChat: "Private Thread",
      newSharedChat: "Shared Thread",
      newPublicChat: "Public Thread",
      newIncognitoChat: "Incognito Thread",
      newPrivateFolder: "New Private Folder",
      newSharedFolder: "New Shared Folder",
      newPublicFolder: "New Public Folder",
      newIncognitoFolder: "New Incognito Folder",
      newFolder: "New Folder",
    },
  },
  errors: {
    not_implemented_on_native:
      "{{method}} is not implemented on native platform. Please use the web version for this operation.",
  },
  config: {
    folders: {
      private: "Private",
      shared: "Shared",
      public: "Public",
      cron: "Cron",
      incognito: "Incognito",
    },
  },
  get: {
    title: "Get Folders",
    description: "Retrieve all folders for the current root folder",
    rootFolderId: {
      label: "Root Folder",
      description:
        "The root folder to retrieve (private, shared, public, cron, incognito)",
    },
    container: {
      title: "Folder Details",
      description: "View folder information",
    },
    id: {
      label: "Folder ID",
      description: "The unique identifier of the folder",
    },
    response: {
      title: "Folders",
      description: "The folder list with permissions",
      rootFolderPermissions: {
        title: "Root Folder Permissions",
        description: "Permissions for the root folder",
        canCreateThread: {
          content: "Can Create Thread",
        },
        canCreateFolder: {
          content: "Can Create Folder",
        },
      },
      folders: {
        folder: {
          id: { content: "ID" },
          userId: { content: "User ID" },
          name: { content: "Name" },
          icon: { content: "Icon" },
          color: { content: "Color" },
          parentId: { content: "Parent Folder" },
          expanded: { content: "Expanded" },
          sortOrder: { content: "Sort Order" },
          rootFolderId: {
            content: "Root Folder",
          },
          canManage: {
            content: "Can Manage",
          },
          canCreateThread: {
            content: "Can Create Thread",
          },
          canModerate: {
            content: "Can Moderate",
          },
          canDelete: {
            content: "Can Delete",
          },
          canManagePermissions: {
            content: "Can Manage Permissions",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
        },
      },
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
  post: {
    errors: {
      forbidden: {
        title: "Forbidden",
        incognitoNotAllowed: "Folders are not supported in incognito mode",
      },
      unauthorized: {
        title: "Unauthorized",
      },
      server: {
        title: "Server Error",
      },
    },
  },
};
