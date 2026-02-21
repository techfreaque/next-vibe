import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: {
    get: {
      title: "Pomoc narzędzi — odkryj dostępne narzędzia AI",
      description:
        "Wyszukuj i odkrywaj wszystkie dostępne narzędzia AI. Użyj query do wyszukiwania, category do filtrowania.",
      category: "Narzędzia AI",
      tags: {
        tools: "narzędzia",
      },
    },
  },
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
    descriptions: {
      noParametersRequired:
        "Brak wymaganych parametrów dla tego punktu końcowego",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nPrzykład: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Punkt końcowy dla ",
      hiddenPlaceholder: "[ukryty]",
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
      initializationFailed: "Inicjalizacja rejestru narzędzi nie powiodła się",
    },
  },
};
