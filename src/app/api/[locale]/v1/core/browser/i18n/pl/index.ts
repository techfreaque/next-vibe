/**
 * Browser API translations (Polish)
 */

export const translations = {
  title: "Chrome DevTools MCP Tools",
  description:
    "Wykonaj narzędzia Chrome DevTools MCP dla automatyzacji przeglądarki i debugowania",
  category: "Core API",
  summary:
    "Dostęp do narzędzi Chrome DevTools Protocol przez MCP dla automatyzacji webowej",
  tags: {
    browserAutomation: "Automatyzacja przeglądarki",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "Narzędzia MCP",
    webDebugging: "Debugowanie webowe",
    performanceAnalysis: "Analiza wydajności",
  },

  form: {
    label: "Wykonanie narzędzia przeglądarki",
    description:
      "Wykonaj narzędzia Chrome DevTools MCP dla sterowania przeglądarką i analizy",
    fields: {
      tool: {
        label: "Narzędzie",
        description: "Wybierz narzędzie Chrome DevTools MCP do wykonania",
        placeholder: "Wybierz narzędzie...",
      },
      arguments: {
        label: "Argumenty",
        description: "Argumenty JSON dla wybranego narzędzia (opcjonalne)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Kliknij element",
    drag: "Przeciągnij element",
    fill: "Wypełnij pole wejściowe",
    fillForm: "Wypełnij formularz",
    handleDialog: "Obsłuż dialog",
    hover: "Najedź na element",
    pressKey: "Naciśnij klawisz",
    uploadFile: "Prześlij plik",

    // Navigation automation tools (6)
    closePage: "Zamknij stronę",
    listPages: "Lista stron",
    navigatePage: "Nawiguj stronę",
    newPage: "Nowa strona",
    selectPage: "Wybierz stronę",
    waitFor: "Czekaj na",

    // Emulation tools (2)
    emulate: "Emuluj urządzenie",
    resizePage: "Zmień rozmiar strony",

    // Performance tools (3)
    performanceAnalyzeInsight: "Analizuj insight wydajności",
    performanceStartTrace: "Rozpocznij trace wydajności",
    performanceStopTrace: "Zatrzymaj trace wydajności",

    // Network tools (2)
    getNetworkRequest: "Pobierz żądanie sieciowe",
    listNetworkRequests: "Lista żądań sieciowych",

    // Debugging tools (5)
    evaluateScript: "Oceniaj skrypt",
    getConsoleMessage: "Pobierz wiadomość konsoli",
    listConsoleMessages: "Lista wiadomości konsoli",
    takeScreenshot: "Zrób zrzut ekranu",
    takeSnapshot: "Zrób snapshot",
  },

  status: {
    statusItem: "Status item",
    pending: "Oczekujący",
    running: "Uruchomiony",
    completed: "Ukończony",
    failed: "Niepowodzenie",
  },

  response: {
    success: "Narzędzie wykonane pomyślnie",
    result: "Wynik wykonania",
    status: "Aktualny status wykonania",
    statusItem: "Status item",
    executionId: "ID wykonania do śledzenia",
  },

  examples: {
    requests: {
      navigate: {
        title: "Nawiguj do URL",
        description: "Nawiguj przeglądarkę do określonego URL",
      },
      screenshot: {
        title: "Zrób zrzut ekranu",
        description: "Zrób zrzut ekranu aktualnej strony",
      },
      click: {
        title: "Kliknij element",
        description: "Kliknij na określony element",
      },
      performance: {
        title: "Rozpocznij trace wydajności",
        description: "Rozpocznij nagrywanie metryk wydajności",
      },
      script: {
        title: "Oceniaj skrypt",
        description: "Wykonaj JavaScript w przeglądarce",
      },
    },
    responses: {
      navigate: {
        title: "Wynik nawigacji",
        description: "Wynik nawigacji strony",
      },
      screenshot: {
        title: "Wynik zrzutu ekranu",
        description: "Wynik wykonania zrzutu ekranu",
      },
      click: {
        title: "Wynik kliknięcia",
        description: "Wynik kliknięcia elementu",
      },
      performance: {
        title: "Trace wydajności rozpoczęty",
        description: "Śledzenie wydajności zainicjowane",
      },
      script: {
        title: "Wynik oceny skryptu",
        description: "Wynik wykonania JavaScript",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "Wykonanie narzędzia nie powiodło się",
      description: "Wybrane narzędzie nie mogło zostać wykonane pomyślnie",
    },
    invalidArguments: {
      title: "Nieprawidłowe argumenty",
      description: "Podane argumenty są nieprawidłowe dla tego narzędzia",
    },
    browserNotAvailable: {
      title: "Przeglądarka niedostępna",
      description: "Instancja przeglądarki Chrome jest niedostępna",
    },
    toolNotFound: {
      title: "Narzędzie nie znalezione",
      description: "Żądane narzędzie jest niedostępne",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź swoje dane wejściowe i spróbuj ponownie",
      toolRequired: "Wymagany jest wybór narzędzia",
      argumentsInvalid: "Argumenty muszą być prawidłowym JSON",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas wykonywania narzędzia",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania narzędzi przeglądarki",
    },
    forbidden: {
      title: "Zabronione",
      description: "Wykonywanie narzędzi przeglądarki jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądane narzędzie przeglądarki nie zostało znalezione",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas wykonywania narzędzia",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas wykonywania narzędzia",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas wykonywania narzędzia",
    },
  },

  success: {
    title: "Narzędzie wykonane pomyślnie",
    description: "Narzędzie przeglądarki zostało wykonane pomyślnie",
  },

  repository: {
    execute: {
      start: "Rozpoczynam wykonywanie narzędzia przeglądarki",
      success: "Narzędzie przeglądarki wykonane pomyślnie",
      error: "Błąd podczas wykonywania narzędzia przeglądarki",
    },
    mcp: {
      connect: {
        start: "Łączenie z serwerem Chrome DevTools MCP",
        success: "Pomyślnie połączono z serwerem MCP",
        error: "Błąd podczas łączenia z serwerem MCP",
      },
      tool: {
        call: {
          start: "Wywołuję narzędzie MCP",
          success: "Narzędzie MCP wywołane pomyślnie",
          error: "Błąd podczas wywoływania narzędzia MCP",
        },
      },
    },
  },
};
