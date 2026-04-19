export const translations = {
  get: {
    title: "Show Tree",
    description: "See the full folder structure at a glance.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Scanning...",
      done: "Scanned",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Path",
        description: "Start from here (default: root)",
      },
      depth: {
        label: "Depth",
        description: "How many levels deep",
      },
    },
    submitButton: {
      label: "Show Tree",
      loadingText: "Loading...",
    },
    response: {
      tree: { content: "Tree" },
      totalFiles: { text: "Files" },
      totalDirs: { text: "Folders" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check path and depth" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: { title: "No Access", description: "Can't see this" },
      notFound: { title: "Not Found", description: "Folder doesn't exist" },
      server: { title: "Server Error", description: "Something broke" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: { title: "Conflict", description: "Try again" },
    },
    success: {
      title: "Tree",
      description: "Here's the structure",
    },
  },
};
