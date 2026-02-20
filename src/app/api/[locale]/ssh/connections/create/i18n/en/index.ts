export const translations = {
  post: {
    title: "Create SSH Connection",
    description: "Save a new SSH connection configuration",
    fields: {
      label: {
        label: "Label",
        description: "Friendly name for this connection",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Host",
        description: "SSH server hostname or IP",
        placeholder: "192.168.1.1",
      },
      port: { label: "Port", description: "SSH port", placeholder: "22" },
      username: {
        label: "Username",
        description: "SSH username",
        placeholder: "deploy",
      },
      authType: {
        label: "Auth Type",
        description: "Authentication method",
        placeholder: "",
      },
      secret: {
        label: "Secret",
        description: "Password or PEM private key",
        placeholder: "",
      },
      passphrase: {
        label: "Passphrase",
        description: "Passphrase for PEM key (if encrypted)",
        placeholder: "",
      },
      isDefault: {
        label: "Default Connection",
        description: "Use as default for AI sessions",
        placeholder: "",
      },
      notes: {
        label: "Notes",
        description: "Optional notes about this connection",
        placeholder: "",
      },
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
        description: "Failed to create connection",
      },
      notFound: { title: "Not Found", description: "Not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: { title: "Unsaved Changes" },
      conflict: {
        title: "Conflict",
        description: "Connection with this label already exists",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: {
      title: "Connection Created",
      description: "SSH connection saved successfully",
    },
  },
  widget: {
    title: "New SSH Connection",
    createButton: "Save Connection",
    creating: "Saving...",
    testFirst: "Test connection before saving",
  },
};
