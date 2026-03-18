export const translations = {
  category: "Chat",
  tags: {
    folderContents: "Folder Contents",
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
    title: "Get Folder Contents",
    description:
      "Retrieve merged list of folders and threads for a given folder level",
    rootFolderId: {
      label: "Root Folder",
      description: "The root folder (private, shared, public, etc.)",
    },
    subFolderId: {
      label: "Sub Folder",
      description: "The sub folder ID (null for root level)",
    },
    response: {
      items: {
        item: {
          type: { content: "Item Type" },
          sortOrder: { content: "Sort Order" },
          // Folder fields
          id: { content: "ID" },
          userId: { content: "User ID" },
          rootFolderId: { content: "Root Folder" },
          name: { content: "Name" },
          icon: { content: "Icon" },
          color: { content: "Color" },
          parentId: { content: "Parent Folder" },
          expanded: { content: "Expanded" },
          canManage: { content: "Can Manage" },
          canCreateThread: { content: "Can Create Thread" },
          canModerate: { content: "Can Moderate" },
          canDelete: { content: "Can Delete" },
          canManagePermissions: { content: "Can Manage Permissions" },
          // Thread fields
          title: { content: "Thread Title" },
          folderId: { content: "Folder" },
          status: { content: "Status" },
          preview: { content: "Preview" },
          pinned: { content: "Pinned" },
          archived: { content: "Archived" },
          canEdit: { content: "Can Edit" },
          canPost: { content: "Can Post" },
          streamingState: { content: "Streaming State" },
          createdAt: { content: "Created At" },
          updatedAt: { content: "Updated At" },
        },
      },
      rootFolderPermissions: {
        title: "Root Folder Permissions",
        description: "Permissions for the root folder",
        canCreateThread: { content: "Can Create Thread" },
        canCreateFolder: { content: "Can Create Folder" },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided folder ID is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view folder contents",
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
        description: "An error occurred while retrieving folder contents",
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
      description: "Folder contents retrieved successfully",
    },
  },
};
