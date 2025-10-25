import { translations as toolsTranslations } from "../../tools/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: toolsTranslations,
  executor: {
    errors: {
      toolNotFound: "Narzędzie nie znalezione: {{toolName}}",
      parameterValidationFailed:
        "Walidacja parametrów nie powiodła się: {{errors}}",
      executionFailed: "Wykonanie narzędzia nie powiodło się",
    },
  },
  factory: {
    errors: {
      executionFailed: "Wykonanie narzędzia nie powiodło się",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nPrzykład: ",
      versionSegments: ["v1", "v2", "core"],
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Punkt końcowy dla ",
      hiddenPlaceholder: "[ukryte]",
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
      initializationFailed: "Inicjalizacja rejestru narzędzi nie powiodła się",
    },
  },
};
