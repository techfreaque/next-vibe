import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: {
    category: "Narzędzia MCP",
    tags: {
      mcp: "MCP",
    },
    get: {
      title: "Lista narzędzi MCP",
      description: "Pobierz wszystkie dostępne narzędzia MCP dla bieżącego użytkownika",
      fields: {
        name: "Nazwa narzędzia",
        description: "Opis",
        inputSchema: "Schemat wejściowy",
      },
      response: {
        title: "Lista narzędzi MCP",
        description: "Lista dostępnych narzędzi MCP",
      },
      errors: {
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Nieprawidłowe parametry żądania",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć z serwerem",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do tego zasobu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie został znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt zasobów",
        },
      },
      success: {
        title: "Sukces",
        description: "Narzędzia pobrane pomyślnie",
      },
    },
  },
  execute: {
    category: "Wykonanie MCP",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Wykonaj narzędzie MCP",
      description: "Wykonaj narzędzie MCP według nazwy z argumentami",
      fields: {
        title: "Parametry wykonania narzędzia",
        description: "Parametry wykonania narzędzia",
        name: {
          title: "Nazwa narzędzia",
          description: "Nazwa narzędzia do wykonania (np. core:system:db:ping)",
          placeholder: "core:system:db:ping",
        },
        arguments: {
          title: "Argumenty",
          description: "Argumenty narzędzia jako pary klucz-wartość",
          placeholder: "{}",
        },
      },
      response: {
        title: "Wynik wykonania narzędzia",
        description: "Wynik wykonania narzędzia",
        result: {
          content: {
            type: "Typ zawartości",
            text: "Zawartość",
          },
          isError: "Czy błąd",
        },
      },
      errors: {
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Nieprawidłowa nazwa narzędzia lub argumenty",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć z serwerem",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wykonania tego narzędzia",
        },
        notFound: {
          title: "Narzędzie nie znalezione",
          description: "Określone narzędzie nie istnieje",
        },
        server: {
          title: "Błąd serwera",
          description: "Wykonanie narzędzia nie powiodło się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt zasobów",
        },
      },
      success: {
        title: "Sukces",
        description: "Narzędzie wykonane pomyślnie",
      },
    },
  },
  serve: {
    category: "Serwer MCP",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "Uruchom serwer MCP",
      description: "Uruchom serwer Model Context Protocol",
      response: {
        title: "Status serwera MCP",
        description: "Status serwera MCP",
      },
      errors: {
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się uruchomić serwera MCP",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
      },
      success: {
        title: "Sukces",
        description: "Serwer MCP uruchomiony pomyślnie",
      },
    },
  },
  registry: {
    toolNotFound: "Narzędzie nie znalezione",
    endpointNotFound: "Punkt końcowy nie znaleziony",
    permissionDenied: "Brak uprawnień",
    toolExecutionFailed: "Wykonanie narzędzia nie powiodło się",
  },
};
