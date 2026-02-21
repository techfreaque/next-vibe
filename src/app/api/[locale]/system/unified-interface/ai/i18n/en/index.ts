export const translations = {
  tools: {
    // Translations moved to system/help/get — see system/help/i18n/en/index.ts
    get: {
      title: "Tool Help — Discover Available Tools",
      description:
        "Search and discover all AI tools available to you. Use query to search by name, description, or alias. Use category to filter by tool category. Returns tool names, descriptions, aliases, and metadata.",
      category: "AI Tools",
      tags: {
        tools: "tools",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "Tool not found: {{toolName}}",
      parameterValidationFailed: "Parameter validation failed: {{errors}}",
      executionFailed: "Tool execution failed",
    },
  },
  factory: {
    errors: {
      executionFailed: "Tool execution failed",
    },
    descriptions: {
      noParametersRequired: "No parameters required for this endpoint",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nExample: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Endpoint for ",
      hiddenPlaceholder: "[hidden]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "Tool registry initialization failed",
    },
  },
};
