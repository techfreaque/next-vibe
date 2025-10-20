import { translations as idTranslations } from "../../[id]/i18n/en";

export const translations = {
  id: idTranslations,
  get: {
    title: "List Personas",
    description: "Get all available personas (default + custom)",
    container: {
      title: "Personas List",
      description: "All available personas for the user",
    },
    response: {
      personas: {
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
        description: "You must be logged in to access custom personas",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving personas",
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
      description: "Personas retrieved successfully",
    },
  },
  post: {
    title: "Create Persona",
    description: "Create a new custom persona",
    container: {
      title: "Create New Persona",
      description: "Define a new custom persona",
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
    response: {
      id: { content: "Created Persona ID" },
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
        description: "You must be logged in to create personas",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create personas",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while creating the persona",
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
        description: "A persona with this name already exists",
      },
    },
    success: {
      title: "Persona Created",
      description: "Your custom persona has been created successfully",
    },
  },
};
