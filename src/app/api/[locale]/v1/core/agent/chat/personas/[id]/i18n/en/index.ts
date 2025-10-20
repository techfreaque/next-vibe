export const translations = {
  get: {
    title: "Get Persona",
    description: "Retrieve a specific persona by ID",
    container: {
      title: "Persona Details",
      description: "Details of the requested persona",
    },
    id: {
      label: "Persona ID",
      description: "The unique identifier of the persona",
    },
    response: {
      persona: {
        title: "Persona",
        id: { content: "Persona ID" },
        name: { content: "Persona Name" },
        description: { content: "Persona Description" },
        icon: { content: "Persona Icon" },
        systemPrompt: { content: "System Prompt" },
        category: { content: "Category" },
        source: { content: "Source" },
        preferredModel: { content: "Preferred Model" },
        suggestedPrompts: { content: "Suggested Prompts" },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to access this resource",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Persona Not Found",
        description: "The requested persona does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving the persona",
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
        description: "A conflict occurred with the current state",
      },
    },
    success: {
      title: "Success",
      description: "Persona retrieved successfully",
    },
  },
  patch: {
    title: "Update Persona",
    description: "Update an existing custom persona",
    container: {
      title: "Update Persona",
      description: "Modify an existing custom persona",
    },
    response: {
      success: {
        content: "Persona updated successfully",
      },
    },
    id: {
      label: "Persona ID",
      description: "The unique identifier of the persona to update",
    },
    name: {
      label: "Name",
      description: "The name of the persona",
    },
    personaDescription: {
      label: "Description",
      description: "A brief description of the persona",
    },
    icon: {
      label: "Icon",
      description: "An emoji icon for the persona",
    },
    systemPrompt: {
      label: "System Prompt",
      description: "The system prompt that defines the persona's behavior",
    },
    category: {
      label: "Category",
      description: "The category this persona belongs to",
    },
    preferredModel: {
      label: "Preferred Model",
      description: "The preferred AI model for this persona",
    },
    suggestedPrompts: {
      label: "Suggested Prompts",
      description: "Example prompts to use with this persona",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The persona data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update personas",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to update this persona",
      },
      notFound: {
        title: "Persona Not Found",
        description: "The persona you're trying to update does not exist",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating the persona",
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
        description: "A conflict occurred while updating the persona",
      },
    },
    success: {
      title: "Persona Updated",
      description: "Your custom persona has been updated successfully",
    },
  },
};
