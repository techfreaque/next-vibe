export const translations = {
  delete: {
    title: "Delete",
    description: "Remove a file or folder. Gone forever.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Deleting...",
      done: "Deleted",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Path",
        description: "What to delete",
      },
      recursive: {
        label: "Include Contents",
        description: "Also delete everything inside",
      },
    },
    submitButton: {
      label: "Delete",
      loadingText: "Deleting...",
    },
    response: {
      path: { content: "Path" },
      nodesDeleted: { text: "Deleted" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check the path" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: { title: "No Access", description: "Can't delete this" },
      notFound: { title: "Not Found", description: "Nothing at this path" },
      server: { title: "Server Error", description: "Something broke" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: {
        title: "Not Empty",
        description: "Folder has stuff in it — use Include Contents",
      },
    },
    success: {
      title: "Deleted",
      description: "Gone",
    },
  },
};
