export const translations = {
  post: {
    title: "Write File",
    description: "Write or overwrite a file on the local machine or via SSH",
    fields: {
      connectionId: {
        label: "Connection",
        description: "SSH connection (leave empty for local)",
        placeholder: "Local",
      },
      path: {
        label: "Path",
        description: "File path to write",
        placeholder: "/tmp/output.txt",
      },
      content: {
        label: "Content",
        description: "File content to write",
        placeholder: "Enter file content...",
      },
      createDirs: {
        label: "Create Directories",
        description: "Create parent directories if they don't exist",
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
      forbidden: { title: "Forbidden", description: "No permission to write" },
      server: { title: "Server Error", description: "Failed to write file" },
      notFound: {
        title: "Not Found",
        description: "Parent directory not found",
      },
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
      title: "File Written",
      description: "File written successfully",
    },
  },
  widget: {
    title: "File Writer",
    writeButton: "Write File",
    writing: "Writing...",
    bytesWritten: "Bytes written",
    placeholder: "Enter file content...",
  },
};
