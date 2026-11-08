export const translations = {
  category: "Chat",
  tags: {
    folders: "Folders",
  },
  get: {
    title: "Project Settings",
    titleShort: "Project",
    description: "Instructions and knowledge files for a folder project",
    id: { label: "Folder ID", description: "The folder to read" },
    response: {
      folderName: "Folder",
      instructions: "Instructions",
      canManage: "Can manage",
      knowledgePath: "Knowledge path",
      files: {
        id: "ID",
        name: "Name",
        path: "Path",
        size: "Size",
        updatedAt: "Updated",
      },
    },
    heading: "Project",
    subheading:
      "Instructions apply to every chat in this folder and its subfolders. Knowledge files are available to the AI.",
    instructionsTitle: "Instructions",
    noInstructions:
      "No instructions yet. Tell the AI how to behave in this folder.",
    editInstructions: "Edit instructions",
    addInstructions: "Add instructions",
    knowledgeTitle: "Knowledge files",
    noFiles:
      "No knowledge files yet. Add notes, briefs or docs the AI should know.",
    addFile: "Add file",
    removeFile: "Remove",
    bytes: "chars",
    noData: "Loading project...",
    noAccess: "Only folder editors can change project settings.",
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
  patch: {
    title: "Edit Project Instructions",
    titleShort: "Instructions",
    description:
      "Set the instructions the AI follows in every chat of this folder",
    container: {
      title: "Project Instructions",
      description: "Applied to every chat in this folder and its subfolders",
    },
    id: { label: "Folder ID", description: "The folder to update" },
    instructions: {
      label: "Instructions",
      description:
        "How the AI should behave, what it should know, tone, format. Empty clears them.",
      placeholder:
        "e.g. You are my launch copywriter. Keep it punchy. Always answer in bullet points.",
    },
    response: { folderId: "Folder", hasInstructions: "Instructions active" },
    backButton: { label: "Back" },
    submitButton: { label: "Save instructions", loadingText: "Saving..." },
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
