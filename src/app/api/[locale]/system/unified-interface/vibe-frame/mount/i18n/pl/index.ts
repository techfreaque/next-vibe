export const translations = {
  category: "System",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Osadzanie",
    widget: "Widget",
    iframe: "Iframe",
  },
  get: {
    title: "Zamontuj Vibe Frame",
    description:
      "Zamontuj endpoint next-vibe w izolowanym iframe do osadzenia na dowolnej stronie lub natywnym WebView",
    container: {
      title: "Montowanie Vibe Frame",
      description: "Skonfiguruj i zamontuj ramkę endpointu",
    },
    fields: {
      endpoint: {
        label: "Endpoint",
        description:
          "Identyfikator endpointu (np. contact_POST, agent_chat_threads_GET)",
        placeholder: "Wprowadź identyfikator endpointu...",
      },
      frameId: {
        label: "ID Ramki",
        description: "Unikalny identyfikator ramki do komunikacji przez bridge",
        placeholder: "Generowane automatycznie",
      },
      urlPathParams: {
        label: "Parametry URL",
        description: "Parametry ścieżki URL w formacie JSON",
        placeholder: '{"id": "123"}',
      },
      data: {
        label: "Dane",
        description: "Dane wstępne formularza w formacie JSON",
        placeholder: "{}",
      },
      theme: {
        label: "Motyw",
        description: "Motyw kolorystyczny zamontowanej ramki",
      },
      authToken: {
        label: "Token uwierzytelniania",
        description: "Token uwierzytelniania do osadzania cross-origin",
        placeholder: "Token Bearer...",
      },
    },
    response: {
      html: {
        title: "Wyrenderowany HTML",
        description: "Kompletny dokument HTML dla iframe",
      },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe parametry montowania",
        description: "Podane parametry montowania są nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie dla tego endpointu",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do zamontowania tego endpointu",
      },
      notFound: {
        title: "Endpoint nie znaleziony",
        description: "Określony endpoint nie istnieje",
      },
      internal: {
        title: "Montowanie nie powiodło się",
        description: "Wystąpił błąd podczas renderowania ramki endpointu",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Podczas montowania ramki wystąpił nieznany błąd",
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
      endpointNotFound: "Żądany endpoint nie został znaleziony",
      mountFailed: "Nie udało się zamontować endpointu vibe frame",
    },
    success: {
      mounted: {
        title: "Ramka zamontowana",
        description: "Endpoint został pomyślnie zamontowany",
      },
    },
  },
};
