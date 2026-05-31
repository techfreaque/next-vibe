export const translations = {
  get: {
    title: "List User Notes",
    description: "List CRM notes for a user, filtered by type and visibility",
    fields: {
      userId: {
        label: "User ID",
        description: "Whose notes to list",
        placeholder: "User UUID",
      },
      type: {
        label: "Type",
        description: "Filter by activity type",
        placeholder: "All types",
      },
      isPrivate: {
        label: "Private Only",
        description: "Show only your private notes",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the filters and try again",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have access to these notes",
      },
      notFound: {
        title: "Not Found",
        description: "User not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network request failed",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "Server error — try again",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
    },
    success: {
      title: "Notes Loaded",
      description: "Notes retrieved successfully",
    },
    widget: {
      addNote: "Add Note",
      total: "Total",
      empty: "No notes yet",
      delete: "Delete",
      private: "Private",
      ago: "ago",
    },
    response: {
      notes: "Notes",
      total: "Total",
      note: {
        id: "Note ID",
        userId: "User ID",
        authorUserId: "Author ID",
        type: "Type",
        content: "Content",
        isPrivate: "Private",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
  },
  tag: "CRM",
};
