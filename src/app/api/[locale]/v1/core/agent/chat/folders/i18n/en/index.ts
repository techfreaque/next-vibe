/**
 * English translations for folders endpoints
 */

import { translations as idTranslations } from "../../[id]/i18n/en";
import { translations as rootPermissionsTranslations } from "../../root-permissions/i18n/en";

export const translations = {
  id: idTranslations,
  rootPermissions: rootPermissionsTranslations,
  get: {
    title: "List Folders",
    description: "Retrieve all folders for the current user",
    rootFolderId: {
      label: "Root Folder",
      description: "Filter by root folder (private, shared, public, incognito)",
    },
    container: {
      title: "Folders List",
      description: "Hierarchical folder structure",
    },
    response: {
      title: "Folders Response",
      description: "List of all folders",
      folders: {
        title: "Folders",
        description: "Array of folder objects",
        folder: {
          title: "Folder",
          description: "Individual folder details",
          id: { content: "Folder ID" },
          userId: { content: "User ID" },
          rootFolderId: { content: "Root Folder" },
          name: { content: "Folder Name" },
          icon: { content: "Icon" },
          color: { content: "Color" },
          parentId: { content: "Parent Folder ID" },
          expanded: { content: "Expanded State" },
          sortOrder: { content: "Sort Order" },
          metadata: { content: "Metadata" },
          createdAt: { content: "Created At" },
          updatedAt: { content: "Updated At" },
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The request data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to access folders",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access these folders",
      },
      notFound: {
        title: "Not Found",
        description: "The requested folder was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving folders",
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
      description: "Folders retrieved successfully",
    },
  },
  post: {
    title: "Create Folder",
    description: "Create a new folder",
    container: {
      title: "Create Folder",
      description: "Create a new folder for organizing threads",
    },
    sections: {
      folder: {
        title: "Folder Details",
        description: "Basic folder information",
        rootFolderId: {
          label: "Root Folder",
          description: "Root folder (private, shared, public, incognito)",
        },
        name: {
          label: "Folder Name",
          description: "Name of the folder",
        },
        icon: {
          label: "Icon",
          description: "Icon for the folder (lucide or si icon name)",
        },
        color: {
          label: "Color",
          description: "Hex color for visual distinction",
        },
        parentId: {
          label: "Parent Folder",
          description: "Parent folder ID for nested folders",
        },
      },
    },
    response: {
      title: "Created Folder",
      description: "Newly created folder details",
      folder: {
        title: "Folder",
        description: "Created folder object",
        id: { content: "Folder ID" },
        userId: { content: "User ID" },
        rootFolderId: { content: "Root Folder" },
        name: { content: "Folder Name" },
        icon: { content: "Icon" },
        color: { content: "Color" },
        parentId: { content: "Parent Folder ID" },
        expanded: { content: "Expanded State" },
        sortOrder: { content: "Sort Order" },
        metadata: { content: "Metadata" },
        createdAt: { content: "Created At" },
        updatedAt: { content: "Updated At" },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The folder data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to create folders",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create folders",
        incognitoNotAllowed:
          "Incognito folders cannot be created on the server",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while creating the folder",
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
      description: "Folder created successfully",
    },
  },
};
