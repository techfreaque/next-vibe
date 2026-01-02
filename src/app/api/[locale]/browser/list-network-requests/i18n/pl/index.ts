import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista żądań sieciowych",
  description: "Lista wszystkich żądań dla aktualnie wybranej strony od ostatniej nawigacji",
  form: {
    label: "Lista żądań sieciowych",
    description: "Pobierz wszystkie żądania sieciowe ze strony przeglądarki",
    fields: {
      includePreservedRequests: {
        label: "Uwzględnij zachowane żądania",
        description: "Ustaw na true, aby zwrócić zachowane żądania z ostatnich 3 nawigacji",
        placeholder: "false",
      },
      pageIdx: {
        label: "Indeks strony",
        description: "Numer strony do zwrócenia (0-based, pomiń dla pierwszej strony)",
        placeholder: "Wprowadź indeks strony",
      },
      pageSize: {
        label: "Rozmiar strony",
        description: "Maksymalna liczba żądań do zwrócenia (pomiń, aby zwrócić wszystkie żądania)",
        placeholder: "Wprowadź rozmiar strony",
      },
      resourceTypes: {
        label: "Typy zasobów",
        description:
          "Filtruj żądania, aby zwracać tylko żądania określonych typów zasobów (pomiń dla wszystkich)",
        placeholder: "Wybierz typy zasobów",
        options: {
          document: "Dokument",
          stylesheet: "Arkusz stylów",
          image: "Obraz",
          media: "Media",
          font: "Czcionka",
          script: "Skrypt",
          texttrack: "Ścieżka tekstowa",
          xhr: "XHR",
          fetch: "Fetch",
          prefetch: "Prefetch",
          eventsource: "Źródło zdarzeń",
          websocket: "WebSocket",
          manifest: "Manifest",
          signedexchange: "Podpisana wymiana",
          ping: "Ping",
          cspviolationreport: "Raport naruszenia CSP",
          preflight: "Preflight",
          fedcm: "FedCM",
          other: "Inne",
        },
      },
    },
  },
  response: {
    success: "Żądania sieciowe pobrane pomyślnie",
    result: {
      title: "Wynik",
      description: "Wynik listy żądań sieciowych",
      requests: {
        reqid: "ID żądania",
        url: "URL",
        method: "Metoda",
        status: "Status",
        type: "Typ",
      },
      totalCount: "Łączna liczba",
    },
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas listowania żądań sieciowych",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do listowania żądań sieciowych",
    },
    forbidden: {
      title: "Zabronione",
      description: "Listowanie żądań sieciowych jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas listowania żądań sieciowych",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas listowania żądań sieciowych",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas listowania żądań sieciowych",
    },
  },
  success: {
    title: "Żądania sieciowe pobrane pomyślnie",
    description: "Żądania sieciowe zostały pomyślnie pobrane",
  },
};
