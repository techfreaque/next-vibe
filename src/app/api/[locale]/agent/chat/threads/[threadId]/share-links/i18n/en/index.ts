export const translations = {
  // Top-level keys used across methods
  empty: "", // For hidden/internal fields
  linkId: {
    label: "Link ID",
  },
  label: {
    label: "Label",
    description: "Optional label to identify this link",
    placeholder: "Enter a label for this share link",
  },
  allowPosting: {
    label: "Allow Posting",
    description: "Allow recipients to post messages in this thread",
  },
  requireAuth: {
    label: "Require Authentication",
    description: "Require users to sign in to access this link",
  },
  shareLink: {
    label: "Label",
    shareUrl: "Share URL",
    active: "Active",
    allowPosting: "Allow Posting",
    requireAuth: "Require Auth",
    accessCount: "Access Count",
    lastAccessedAt: "Last Accessed",
    createdAt: "Created",
    editAction: "Edit",
    deleteAction: "Revoke",
  },
  shareLinks: {
    emptyTitle: "No Share Links",
    emptyDescription: "Create a share link to share this thread with others",
  },
  get: {
    title: "Get Share Links",
    description: "Retrieve all share links for a thread",
    container: {
      title: "Share Links",
      description: "All share links for this thread",
    },
    response: {
      shareLink: {
        title: "Share Link",
        id: {
          content: "Link ID",
        },
        token: {
          content: "Share Token",
        },
        label: {
          content: "Label",
        },
        allowPosting: {
          content: "Allow Posting",
        },
        requireAuth: {
          content: "Require Auth",
        },
        active: {
          content: "Active",
        },
        accessCount: {
          content: "Access Count",
        },
        lastAccessedAt: {
          content: "Last Accessed",
        },
        createdAt: {
          content: "Created",
        },
        editAction: {
          text: "Edit",
        },
        deleteAction: {
          text: "Revoke",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view share links",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view these share links",
      },
      notFound: {
        title: "Not Found",
        description: "Thread or share link not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve share links",
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
        description: "This resource has been modified",
      },
    },
    success: {
      title: "Success",
      description: "Share links retrieved successfully",
    },
  },
  post: {
    title: "Create Share Link",
    description: "Create a new share link for a thread",
    container: {
      title: "New Share Link",
      description: "Configure your new share link",
    },
    label: {
      label: "Label",
      description: "Optional label to identify this link",
      placeholder: "Enter a label for this share link",
    },
    allowPosting: {
      label: "Allow Posting",
      description: "Allow recipients to post messages in this thread",
    },
    requireAuth: {
      label: "Require Authentication",
      description: "Require users to sign in to access this link",
    },
    response: {
      id: {
        content: "Link ID",
      },
      token: {
        content: "Share Token",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid share link parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to create share links",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "Only threads in the Shared folder can be shared via links",
      },
      notFound: {
        title: "Not Found",
        description: "Thread not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to create share link",
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
        description: "This resource has been modified",
      },
    },
    success: {
      title: "Success",
      description: "Share link created successfully",
    },
  },
  patch: {
    title: "Update Share Link",
    description: "Update an existing share link",
    container: {
      title: "Update Share Link",
      description: "Modify share link settings",
    },
    linkId: {
      label: "Link ID",
      description: "ID of the link to update",
    },
    label: {
      label: "Label",
      description: "Optional label to identify this link",
      placeholder: "Enter a label for this share link",
    },
    allowPosting: {
      label: "Allow Posting",
      description: "Allow recipients to post messages in this thread",
    },
    requireAuth: {
      label: "Require Authentication",
      description: "Require users to sign in to access this link",
    },
    deleteAction: {
      text: "Revoke Link",
    },
    response: {
      id: {
        content: "Link ID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid update parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update share links",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this link",
      },
      notFound: {
        title: "Not Found",
        description: "Share link not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to update share link",
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
        description: "This resource has been modified",
      },
    },
    success: {
      title: "Success",
      description: "Share link updated successfully",
    },
  },
  delete: {
    title: "Revoke Share Link",
    description: "Revoke an active share link",
    container: {
      title: "Revoke Share Link",
      description: "This will deactivate the link permanently",
    },
    linkId: {
      label: "Link ID",
      description: "ID of the link to revoke",
    },
    response: {
      id: {
        content: "Link ID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid link ID",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to revoke share links",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to revoke this link",
      },
      notFound: {
        title: "Not Found",
        description: "Share link not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to revoke share link",
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
        description: "This resource has been modified",
      },
    },
    success: {
      title: "Success",
      description: "Share link revoked successfully",
    },
  },
};
