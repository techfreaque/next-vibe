export const translations = {
  category: "Chat",
  tags: {
    folders: "Folders",
  },
  delete: {
    title: "Remove Knowledge File",
    titleShort: "Remove File",
    description: "Remove a knowledge file from this folder project",
    container: {
      title: "Remove Knowledge File",
      description: "The AI will no longer see this file in this folder.",
    },
    id: { label: "Folder ID", description: "The folder the file belongs to" },
    fileId: { label: "File ID", description: "The file to remove" },
    response: { removedPath: "Removed" },
    backButton: { label: "Back" },
    submitButton: { label: "Remove file", loadingText: "Removing..." },
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
