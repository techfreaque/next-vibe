export const translations = {
  get: {
    title: "Search",
    description: "Find files by name or content. Searches everything.",
    dynamicTitle: "{{query}}",
    status: {
      loading: "Searching...",
      done: "Found",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      query: {
        label: "Search",
        description: "What to look for",
      },
      path: {
        label: "In Folder",
        description: "Only search here (default: everywhere)",
      },
      maxResults: {
        label: "Limit",
        description: "How many results (default: 20)",
      },
    },
    submitButton: {
      label: "Search",
      loadingText: "Searching...",
    },
    noResults: "No results found",
    response: {
      query: { content: "Searched" },
      results: {
        path: { content: "Path" },
        name: { content: "Name" },
        nodeType: { text: "Type" },
        excerpt: { content: "Match" },
        score: { text: "Score" },
        updatedAt: { content: "Updated" },
      },
      total: { text: "Found" },
      searchMode: { text: "Mode" },
    },
    errors: {
      validation: { title: "Bad Input", description: "Check search text" },
      network: { title: "Offline", description: "Can't reach server" },
      unauthorized: { title: "Not Logged In", description: "Log in first" },
      forbidden: { title: "No Access", description: "Can't search here" },
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
      title: "Done",
      description: "Search complete",
    },
  },
};
