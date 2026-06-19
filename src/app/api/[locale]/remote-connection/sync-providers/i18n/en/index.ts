export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  // Sync provider labels — keyed by provider.labelKey
  providers: {
    memories: "Memories",
    documents: "Documents",
    skills: "Skills",
    favorites: "Favorites",
    threads: "Threads",
    chat: "Live Chat",
  },
  // Sync provider descriptions
  providerDescriptions: {
    memories: "Sync your AI memories across instances",
    documents: "Sync your document library",
    skills: "Sync custom skills and prompts",
    favorites: "Sync saved favorite configurations",
    threads: "Sync conversation threads",
    chat: "Relay live message stream events in real time",
  },
  get: {
    title: "Sync Providers",
    titleShort: "Sync Providers",
    description: "List all registered sync providers for connection settings",
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: { title: "Network Error", description: "Failed to connect" },
      unauthorized: {
        title: "Not Logged In",
        description: "Authentication required",
      },
      forbidden: { title: "Access Denied", description: "Admin role required" },
      notFound: { title: "Not Found", description: "No providers registered" },
      server: {
        title: "Server Error",
        description: "Failed to load providers",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "A conflict occurred" },
    },
    success: {
      title: "Providers Loaded",
      description: "Sync provider list retrieved successfully",
    },
  },
};
