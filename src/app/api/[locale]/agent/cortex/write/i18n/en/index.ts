export const translations = {
  post: {
    title: "Write File",
    description: "Save a file. Give it a path and content — done.",
    dynamicTitle: "Saved: {{path}}",
    status: {
      loading: "Writing...",
      done: "Saved",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Path",
        description:
          "Where to save. Use your locale's root (e.g. /dokumente/ for DE, /dokumenty/ for PL). Example: /documents/notes/ideas.md",
      },
      content: {
        label: "Content",
        description: "What to write (markdown)",
      },
      createParents: {
        label: "Create Folders",
        description: "Make missing folders along the way",
      },
    },
    submitButton: {
      label: "Save",
      loadingText: "Saving...",
    },
    response: {
      path: { content: "Path" },
      size: { text: "Size" },
      created: { text: "New File" },
      updated: { text: "Updated" },
      updatedAt: { content: "Updated" },
      content: { content: "Content" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check path and content" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: {
        title: "Read-Only",
        description: "This path is read-only",
      },
      notFound: {
        title: "Missing Folder",
        description: "Parent folder doesn't exist",
      },
      server: { title: "Server Error", description: "Something broke" },
      unknown: { title: "Error", description: "Something went wrong" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Save or discard first",
      },
      conflict: {
        title: "Already Exists",
        description: "Something's already there",
      },
    },
    success: {
      title: "Saved",
      description: "File saved",
    },
  },
};
