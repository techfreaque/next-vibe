export const translations = {
  post: {
    title: "Delete User Note",
    description: "Delete a CRM note — only the author or an admin can do this",
    fields: {
      noteId: {
        label: "Note ID",
        description: "The note to delete",
        placeholder: "Note UUID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid note ID",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Forbidden",
        description: "Only the author or an admin can delete this note",
      },
      notFound: {
        title: "Not Found",
        description: "Note not found",
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
      title: "Note Deleted",
      description: "The note was permanently removed",
    },
    widget: {
      warning: "This note will be permanently deleted.",
      deleted: "Note deleted.",
      backToNotes: "Back to Notes",
    },
    response: {
      deleted: "Deleted",
    },
  },
  tag: "CRM",
};
