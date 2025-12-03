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
