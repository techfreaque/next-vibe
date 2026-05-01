export const translations = {
  category: "SSH",

  errors: {
    invalidPath: "Invalid path: must be absolute without '..' segments",
    directoryNotFound: "Directory not found",
    connectionNotFound: "Connection not found",
    encryptionFailed: "Encryption failed - JWT_SECRET_KEY may be invalid",
    connectTimeout: "Connection timed out",
    sshAuthFailed: "SSH authentication failed",
    sshConnectionFailed: "SSH connection failed",
    fingerprintMismatch:
      "Host fingerprint has changed. Potential MITM attack. Use acknowledgeNewFingerprint=true to proceed.",
    notImplemented: {
      fileList: "SSH backend not yet implemented for file listing",
    },
  },

  get: {
    title: "List Files",
    description: "List directory contents on the local machine or via SSH",
    fields: {
      connectionId: {
        label: "Connection",
        description: "SSH connection (leave empty for local)",
        placeholder: "Local",
      },
      path: {
        label: "Path",
        description: "Directory path to list",
        placeholder: "~",
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
        description: "Failed to list directory",
      },
      notFound: { title: "Not Found", description: "Directory not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: { title: "Unsaved Changes" },
      conflict: { title: "Conflict", description: "Conflict occurred" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: {
      title: "Directory Listed",
      description: "Directory contents retrieved",
    },
  },
  widget: {
    title: "File Browser",
    emptyDir: "Empty directory",
    loading: "Loading...",
    backButton: "Back",
    nameCol: "Name",
    sizeCol: "Size",
    modifiedCol: "Modified",
    permissionsCol: "Permissions",
    file: "File",
    directory: "Directory",
    symlink: "Symlink",
    home: "~",
    unsavedChanges: "Unsaved Changes",
  },
};
