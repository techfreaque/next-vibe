import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "Wykonaj narzędzie",
      description:
        "Wykonuje dowolny zarejestrowany punkt końcowy według nazwy. Przekaż nazwę narzędzia i parametry wejściowe. Docelowa trasa egzekwuje własne uwierzytelnienie.",
      container: {
        title: "Wykonanie narzędzia",
        description: "Nazwa trasy i parametry wejściowe",
      },
      fields: {
        toolName: {
          label: "Nazwa narzędzia",
          description:
            "Zarejestrowana nazwa narzędzia lub alias (np. 'agent_chat_characters_GET'). Użyj system_help_GET aby odkryć dostępne narzędzia.",
          placeholder: "agent_chat_characters_GET",
        },
        input: {
          label: "Dane wejściowe",
          description:
            "Parametry wejściowe jako obiekt JSON. Parametry ścieżki URL są automatycznie wyodrębniane.",
        },
      },
      response: {
        result:
          "Dane wynikowe zwrócone przez docelową trasę. W przypadku błędu pole to jest nieobecne — sama odpowiedź zawiera błąd.",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "toolName lub parametry wejściowe są nieprawidłowe",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Narzędzie nie znalezione",
          description: "Brak zarejestrowanego narzędzia o podanej nazwie",
        },
        server: {
          title: "Błąd wykonania",
          description: "Docelowa trasa napotkała błąd serwera",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas wykonania",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
      },
      success: {
        title: "Narzędzie wykonane",
        description: "Narzędzie zostało wykonane pomyślnie",
      },
    },
  },
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
