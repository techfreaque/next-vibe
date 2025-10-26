import { translations as toolsTranslations } from "../../tools/i18n/en";

export const translations = {
  tools: toolsTranslations,
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
  converter: {},
  discovery: {},
  registry: {
    errors: {
      initializationFailed: "Tool registry initialization failed",
    },
  },
};
