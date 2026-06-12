export const translations = {
  category: "Chat",
  tags: {
    threads: "Threads",
  },
  patch: {
    title: "Rename Thread",
    titleShort: "Rename Thread",
    description: "Update the title and preview of a chat thread",
    container: {
      title: "Rename Thread",
      description: "Set a new title or preview for the thread",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread to rename",
    },
    threadTitle: {
      label: "Title",
      description: "New title for the thread",
      placeholder: "Enter thread title...",
    },
    preview: {
      label: "Preview",
      description: "Short description or preview text for the thread",
      placeholder: "Enter preview text...",
    },
    response: {
      threadId: {
        content: "Thread ID",
      },
      title: {
        content: "Title",
      },
      preview: {
        content: "Preview",
      },
      updatedAt: {
        content: "Updated At",
      },
    },
    errors: {
      validation: {
        title: "Invalid input",
        description:
          "Check that threadId is a valid UUID and at least one field is provided",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to rename threads",
      },
      forbidden: {
        title: "Access denied",
        description: "You don't have permission to rename this thread",
      },
      notFound: {
        title: "Thread not found",
        description: "No thread exists with this ID",
      },
      server: {
        title: "Server error",
        description: "Failed to rename the thread",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server",
      },
      unknown: {
        title: "Unknown error",
        description: "Something went wrong",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "The thread was modified by someone else",
      },
    },
    success: {
      title: "Thread renamed",
      description: "The thread title and preview have been updated",
    },
  },
};
