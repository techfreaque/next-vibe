export const translations = {
  get: {
    title: "Read File",
    description:
      "Open any file — your notes, threads, memories, skills, or tasks.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Reading...",
      done: "Loaded",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Path",
        description: "Which file, e.g. /documents/notes/ideas.md",
      },
      maxLines: {
        label: "Max Lines",
        description: "Only show this many lines",
      },
    },
    submitButton: {
      label: "Read",
      loadingText: "Reading...",
    },
    response: {
      path: { content: "Path" },
      content: { content: "Content" },
      size: { text: "Size" },
      truncated: { text: "Cut Short" },
      readonly: { text: "Read-Only" },
      nodeType: { text: "Type" },
      updatedAt: { content: "Updated" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check the path" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: { title: "No Access", description: "You can't read this" },
      notFound: { title: "Not Found", description: "Nothing at this path" },
      server: { title: "Server Error", description: "Something broke" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: { title: "Conflict", description: "Version mismatch" },
    },
    success: {
      title: "Got It",
      description: "File loaded",
    },
  },
};
