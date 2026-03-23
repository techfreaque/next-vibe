export const translations = {
  category: "System",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Osadzanie",
    widget: "Widget",
    config: "Konfiguracja",
  },
  post: {
    title: "Konfiguracja Vibe Frame",
    description:
      "Zwraca URL-e iframe dla żądanych integracji. Serwer odczytuje prawdziwe ciasteczka auth i tworzy krótkotrwałe tokeny wymiany.",
    container: {
      title: "Konfiguracja Vibe Frame",
      description: "Zażądaj URL-i iframe dla jednej lub więcej integracji",
    },
    fields: {
      leadId: {
        label: "Lead ID",
        description:
          "ID odwiedzającego ze strony hosta (cross-origin - nie można odczytać z ciasteczek)",
      },
      authToken: {
        label: "Token uwierzytelniania",
        description:
          "Token JWT z sesji strony hosta (dla uwierzytelnionych widgetów)",
      },
      integrations: {
        label: "Integracje",
        description: "Lista integracji do skonfigurowania",
      },
      integration: {
        label: "Integracja",
        description: "Konfiguracja pojedynczej integracji",
      },
      id: {
        label: "ID integracji",
        description: "Unikalny identyfikator tego slotu integracji",
        placeholder: "contact_POST",
      },
      endpoint: {
        label: "Endpoint",
        description: "Identyfikator endpointu (domyślnie: id)",
        placeholder: "contact_POST",
      },
      hasRendered: {
        label: "Już wyrenderowano",
        description: "Jeśli true, serwer może pominąć tę integrację",
      },
      theme: {
        label: "Motyw",
        description: "Motyw kolorystyczny ramki",
      },
      urlPathParams: {
        label: "Parametry URL",
        description: "Parametry ścieżki URL w formacie JSON",
        placeholder: '{"id":"123"}',
      },
      data: {
        label: "Dane",
        description: "Dane wstępne w formacie JSON",
        placeholder: "{}",
      },
      widgets: {
        label: "Widgety",
        description: "Mapa ID integracji do konfiguracji widgetu",
      },
      widget: {
        label: "Widget",
        description: "Konfiguracja widgetu dla jednej integracji",
      },
      frameId: {
        label: "ID ramki",
        description: "Unikalny ID ramki do komunikacji przez bridge",
      },
      widgetUrl: {
        label: "URL widgetu",
        description: "URL src iframe z tokenem wymiany",
      },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe parametry",
        description: "Podane parametry są nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Brak uprawnień",
      },
      notFound: {
        title: "Endpoint nie znaleziony",
        description: "Jeden lub więcej endpointów nie istnieje",
      },
      internal: {
        title: "Konfiguracja nie powiodła się",
        description: "Błąd podczas tworzenia odpowiedzi konfiguracyjnej",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
    repository: {
      invalidUrlPathParams: "Nieprawidłowy format parametrów ścieżki URL",
      invalidData: "Nieprawidłowy format danych",
      endpointNotFound: "Endpoint nie został znaleziony",
      configFailed: "Nie udało się zbudować odpowiedzi konfiguracyjnej",
      tokenMintFailed: "Nie udało się utworzyć tokenu wymiany",
    },
    success: {
      configured: {
        title: "Konfiguracja gotowa",
        description: "URL-e iframe wygenerowane pomyślnie",
      },
    },
  },
};
