export const translations = {
  post: {
    title: "Move",
    description: "Move or rename a file or folder.",
    dynamicTitle: "{{from}} → {{to}}",
    status: {
      loading: "Moving...",
      done: "Moved",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      from: {
        label: "From",
        description: "Current path",
      },
      to: {
        label: "To",
        description: "New path",
      },
    },
    submitButton: {
      label: "Move",
      loadingText: "Moving...",
    },
    response: {
      from: { content: "From" },
      to: { content: "To" },
      nodesAffected: { text: "Moved" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check both paths" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: { title: "No Access", description: "Can't move this" },
      notFound: {
        title: "Not Found",
        description: "Nothing at the source path",
      },
      server: { title: "Server Error", description: "Something broke" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: {
        title: "Blocked",
        description: "Something's already at the destination",
      },
    },
    success: {
      title: "Moved",
      description: "Done",
    },
  },
};
