export const translations = {
  post: {
    title: "Create Linux User",
    description: "Create a new OS user account on the host",
    fields: {
      username: {
        label: "Username",
        description: "Lowercase alphanumeric + hyphen, 1-32 chars",
        placeholder: "alice",
      },
      groups: {
        label: "Groups",
        description: "Extra groups to add the user to",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Shell",
        description: "Login shell",
        placeholder: "/bin/bash",
      },
      homeDir: {
        label: "Home Directory",
        description: "Home directory path (default: /home/username)",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Sudo Access",
        description: "Add to sudo group (not recommended)",
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
      forbidden: { title: "Forbidden", description: "LOCAL_MODE required" },
      server: { title: "Server Error", description: "Failed to create user" },
      notFound: { title: "Not Found", description: "Not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: { title: "Unsaved Changes" },
      conflict: { title: "Conflict", description: "Username already exists" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: {
      title: "User Created",
      description: "OS user account created successfully",
    },
  },
  widget: {
    title: "Create Linux User",
    createButton: "Create User",
    creating: "Creating...",
    sudoWarning: "Granting sudo access is a security risk. Use with caution.",
  },
};
