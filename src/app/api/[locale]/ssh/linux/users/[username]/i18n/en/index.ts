export const translations = {
  delete: {
    title: "Delete Linux User",
    description: "Delete an OS user account from the host",
    fields: {
      removeHome: {
        label: "Remove Home Directory",
        description: "Also delete the user's home directory",
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
      forbidden: {
        title: "Forbidden",
        description: "Cannot delete system users or current process user",
      },
      server: { title: "Server Error", description: "Failed to delete user" },
      notFound: { title: "Not Found", description: "User not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: { title: "Unsaved Changes" },
      conflict: { title: "Conflict", description: "User cannot be deleted" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: {
      title: "User Deleted",
      description: "OS user account deleted successfully",
    },
  },
};
