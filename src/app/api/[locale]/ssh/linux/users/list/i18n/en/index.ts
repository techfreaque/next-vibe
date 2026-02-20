export const translations = {
  get: {
    title: "List Linux Users",
    description: "List OS user accounts on the host (uid >= 1000)",
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
      server: { title: "Server Error", description: "Failed to list users" },
      notFound: { title: "Not Found", description: "Not found" },
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
    success: { title: "Users Listed", description: "OS users retrieved" },
  },
  widget: {
    title: "Linux Users",
    createButton: "Create User",
    lockButton: "Lock",
    unlockButton: "Unlock",
    deleteButton: "Delete",
    usernameCol: "Username",
    uidCol: "UID",
    homeDirCol: "Home",
    shellCol: "Shell",
    groupsCol: "Groups",
    statusCol: "Status",
    locked: "Locked",
    active: "Active",
    localModeOnly: "Only available in LOCAL_MODE",
    confirmDelete: "Delete user {username}? This cannot be undone.",
  },
};
