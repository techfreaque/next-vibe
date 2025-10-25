import { translations as toolsTranslations } from "../../tools/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: toolsTranslations,
  executor: {
    errors: {
      toolNotFound: "Tool nicht gefunden: {{toolName}}",
      parameterValidationFailed:
        "Parametervalidierung fehlgeschlagen: {{errors}}",
      executionFailed: "Tool-Ausführung fehlgeschlagen",
    },
  },
  factory: {
    errors: {
      executionFailed: "Tool-Ausführung fehlgeschlagen",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nBeispiel: ",
      versionSegments: ["v1", "v2", "core"],
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Endpunkt für ",
      hiddenPlaceholder: "[verborgen]",
    },
  },
  discovery: {
    constants: {
      versionSegments: ["v1", "v2", "core"],
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed: "Tool-Registry-Initialisierung fehlgeschlagen",
    },
  },
};
