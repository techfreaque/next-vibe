export const translations = {
  patch: {
    title: "Edit File",
    description:
      "Change part of a file. Find text and replace it, or edit specific lines.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Editing...",
      done: "Edited",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Path",
        description: "Which file to edit",
      },
      find: {
        label: "Find",
        description: "Text to find",
      },
      replace: {
        label: "Replace",
        description: "Replace it with this",
      },
      startLine: {
        label: "From Line",
        description: "Start at this line number",
      },
      endLine: {
        label: "To Line",
        description: "End at this line number",
      },
      newContent: {
        label: "New Content",
        description: "Put this instead of those lines",
      },
    },
    submitButton: {
      label: "Apply",
      loadingText: "Applying...",
    },
    response: {
      path: { content: "Path" },
      size: { text: "Size" },
      replacements: { text: "Changes" },
      updatedAt: { content: "Updated" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Check path and find/replace",
      },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: { title: "No Access", description: "Can't edit this" },
      notFound: { title: "Not Found", description: "File doesn't exist" },
      server: { title: "Server Error", description: "Something broke" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: {
        title: "Conflict",
        description: "File changed while editing",
      },
    },
    success: {
      title: "Edited",
      description: "Changes saved",
    },
  },
};
