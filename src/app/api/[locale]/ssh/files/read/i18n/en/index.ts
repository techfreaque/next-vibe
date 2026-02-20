export const translations = {
  get: {
    title: "Read File",
    description: "Read a text file from the local machine or via SSH",
    fields: {
      connectionId: {
        label: "Connection",
        description: "SSH connection (leave empty for local)",
        placeholder: "Local",
      },
      path: {
        label: "Path",
        description: "File path to read",
        placeholder: "/etc/nginx/nginx.conf",
      },
      maxBytes: {
        label: "Max Bytes",
        description: "Maximum bytes to read (default 64 KB)",
        placeholder: "65536",
      },
      offset: {
        label: "Offset",
        description: "Byte offset to start reading from",
        placeholder: "0",
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
      server: { title: "Server Error", description: "Failed to read file" },
      notFound: { title: "Not Found", description: "File not found" },
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
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: { title: "File Read", description: "File contents retrieved" },
  },
  widget: {
    title: "File Viewer",
    editButton: "Edit",
    saveButton: "Save",
    cancelButton: "Cancel",
    truncatedWarning: "⚠ File was truncated. Use offset to read more.",
    size: "Size",
    encoding: "Encoding",
    loading: "Loading...",
    empty: "Empty file",
  },
};
