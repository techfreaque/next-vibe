export const translations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Password",
      privateKey: "Private Key (PEM)",
      keyAgent: "SSH Agent",
      local: "Local Machine",
    },
  },

  errors: {
    connectionNotFound: "Connection not found",
    encryptionFailed: "Encryption failed — SSH_SECRET_KEY may be invalid",
  },

  get: {
    title: "SSH Connection",
    description: "View SSH connection details",
    fields: {
      id: { label: "Connection ID", description: "The connection to view" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to load connection",
      },
      notFound: { title: "Not Found", description: "Connection not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "Conflict occurred" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
    },
    success: {
      title: "Connection Loaded",
      description: "Connection details retrieved",
    },
  },
  patch: {
    title: "Update SSH Connection",
    description: "Update SSH connection settings",
    fields: {
      id: { label: "Connection ID", description: "The connection to update" },
      label: {
        label: "Label",
        description: "Display name for this connection",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Host",
        description: "Hostname or IP address",
        placeholder: "1.2.3.4",
      },
      port: { label: "Port", description: "SSH port", placeholder: "22" },
      username: {
        label: "Username",
        description: "SSH login user",
        placeholder: "deploy",
      },
      authType: { label: "Auth Type", description: "Authentication method" },
      secret: {
        label: "Password / Private Key",
        description: "Leave empty to keep existing secret",
      },
      passphrase: {
        label: "Key Passphrase",
        description: "Leave empty to keep existing passphrase or clear it",
      },
      isDefault: {
        label: "Set as Default",
        description: "Use this connection by default for terminal sessions",
      },
      notes: {
        label: "Notes",
        description: "Optional notes about this connection",
      },
    },
    response: {
      updatedAt: { title: "Updated At" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to update connection",
      },
      notFound: { title: "Not Found", description: "Connection not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "Conflict occurred" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
    },
    success: {
      title: "Connection Updated",
      description: "Connection updated successfully",
    },
  },
  delete: {
    title: "Delete SSH Connection",
    description: "Delete an SSH connection",
    fields: {
      id: { label: "Connection ID", description: "The connection to delete" },
    },
    response: {
      deleted: { title: "Deleted" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to delete connection",
      },
      notFound: { title: "Not Found", description: "Connection not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "Conflict occurred" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
    },
    success: {
      title: "Connection Deleted",
      description: "Connection deleted successfully",
    },
  },
  widget: {
    title: "Connection Details",
    host: "Host",
    user: "User",
    auth: "Auth",
    notes: "Notes",
    saveButton: "Save Changes",
    deleteButton: "Delete Connection",
    testButton: "Test Connection",
    confirmDelete: "Delete this connection? This cannot be undone.",
  },
};
