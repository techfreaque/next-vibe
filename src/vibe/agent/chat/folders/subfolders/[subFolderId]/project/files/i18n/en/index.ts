export const translations = {
  category: "Chat",
  tags: {
    folders: "Folders",
  },
  post: {
    title: "Add Knowledge File",
    titleShort: "Add File",
    description:
      "Add a document the AI can reference in every chat of this folder",
    container: {
      title: "Add Knowledge File",
      description:
        "Saved as a Cortex document. The AI reads it with cortex-read and cortex-search.",
    },
    id: { label: "Folder ID", description: "The folder to add the file to" },
    name: {
      label: "File name",
      description: "A short name. .md is added if missing.",
      placeholder: "launch-brief",
    },
    content: {
      label: "Content",
      description: "Paste the text of the document (markdown works best)",
    },
    response: { fileId: "File ID", path: "Cortex path" },
    backButton: { label: "Back" },
    submitButton: { label: "Add file", loadingText: "Adding..." },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to edit this project",
      },
      notFound: {
        title: "Not Found",
        description: "The folder or file was not found",
      },
      server: {
        title: "Server Error",
        description: "Something went wrong. Try again.",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "The project was changed elsewhere",
      },
      notSupported: {
        title: "Not Supported",
        description: "Projects work in private and shared folders only",
      },
    },
    success: {
      title: "Saved",
      description: "Done",
    },
  },
};
