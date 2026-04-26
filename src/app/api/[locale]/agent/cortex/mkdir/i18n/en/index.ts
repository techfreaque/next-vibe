export const translations = {
  post: {
    title: "New Folder",
    description: "Create a folder.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Creating...",
      done: "Created",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Path",
        description:
          "Folder path. Use your locale's root (e.g. /dokumente/ for DE, /dokumenty/ for PL). Example: /documents/projects/my-app",
      },
      viewType: {
        label: "View",
        description: "How to display it (list, kanban, calendar, grid)",
      },
      createParents: {
        label: "Create Folders",
        description: "Make missing parent folders too",
      },
    },
    submitButton: {
      label: "Create",
      loadingText: "Creating...",
    },
    response: {
      path: { content: "Path" },
      created: { text: "Created" },
      alreadyExists: { text: "Already exists" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check the path" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: {
        title: "No Access",
        description: "Can't create folders here",
      },
      notFound: {
        title: "Missing Parent",
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
        description: "Folder already there",
      },
    },
    success: {
      title: "Created",
      description: "Folder ready",
    },
  },
};
