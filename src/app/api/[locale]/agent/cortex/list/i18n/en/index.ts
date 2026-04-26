export const translations = {
  get: {
    title: "List Folder",
    description: "See what's in a folder.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Listing...",
      done: "Listed",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Path",
        description: "Which folder, e.g. / or /documents",
      },
    },
    submitButton: {
      label: "Browse",
      loadingText: "Loading...",
    },
    emptyState: "This folder is empty",
    folderNames: {
      memories: "Memories",
      documents: "Documents",
      threads: "Threads",
      skills: "Skills",
      tasks: "Tasks",
      uploads: "Uploads",
      searches: "Searches",
      gens: "Generated Media",
      inbox: "Inbox",
      projects: "Projects",
      knowledge: "Knowledge",
      journal: "Journal",
      templates: "Templates",
      identity: "Identity",
      expertise: "Expertise",
      context: "Context",
    },
    response: {
      path: { content: "Path" },
      entries: {
        name: { content: "Name" },
        path: { content: "Path" },
        nodeType: { text: "Type" },
        size: { text: "Size" },
        updatedAt: { content: "Updated" },
      },
      total: { text: "Total" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check the path" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: { title: "No Access", description: "Can't see this folder" },
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
      title: "Listed",
      description: "Here's what's inside",
    },
  },
};
