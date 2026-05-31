export const translations = {
  post: {
    title: "Create User Note",
    description:
      "Add a CRM note, call log, email record, meeting or task for a user",
    fields: {
      userId: {
        label: "User",
        description: "The user this note is about",
        placeholder: "Select user",
      },
      type: {
        label: "Activity Type",
        description: "What kind of interaction this records",
        placeholder: "Select type",
      },
      content: {
        label: "Content",
        description: "Details of the activity",
        placeholder: "Write what happened...",
      },
      isPrivate: {
        label: "Private",
        description: "Only you can see private notes",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the fields and try again",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have access to this user",
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
      title: "Note Created",
      description: "The note was saved",
    },
    widget: {
      created: "Note Created",
      noteId: "Note ID",
      backToNotes: "Back to Notes",
    },
    response: {
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
  tag: "CRM",
};
