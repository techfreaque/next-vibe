import type { translations as en } from "../en";

export const translations: typeof en = {
  category: "System",

  errors: {
    repositoryInternalError: "Wystąpił błąd wewnętrzny",
    fetchErrorLogs: "Nie udało się pobrać logów błędów",
    updateErrorLog: "Nie udało się zaktualizować statusu logu błędu",
  },

  statusFilter: {
    all: "Wszystkie",
    active: "Aktywne",
    resolved: "Rozwiązane",
  },

  get: {
    title: "Logi błędów",
    description: "Przeglądaj logi błędów backendu z filtrowaniem i paginacją",
    tags: {
      monitoring: "Monitorowanie",
    },
    fields: {
      status: {
        label: "Status",
        description: "Filtruj według statusu rozwiązania",
      },
      search: {
        label: "Szukaj",
        description: "Szukaj w komunikatach błędów",
        placeholder: "Szukaj komunikatów...",
      },
      errorType: {
        label: "Typ błędu",
        description: "Filtruj według klasyfikacji typu błędu",
        placeholder: "np. INTERNAL_ERROR",
      },
      startDate: {
        label: "Od",
        description: "Pokaż błędy po tej dacie",
      },
      endDate: {
        label: "Do",
        description: "Pokaż błędy przed tą datą",
      },
      limit: {
        label: "Limit",
        description: "Liczba wyników do zwrócenia",
        placeholder: "50",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba wyników do pominięcia",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Wpisy logów błędów",
      },
      totalCount: {
        title: "Łączna liczba",
      },
      hasMore: {
        title: "Jest więcej",
      },
      unresolvedCount: {
        title: "Nierozwiązane błędy",
      },
    },
    success: {
      title: "Logi pobrane",
      description: "Logi błędów pobrane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Dostęp odmówiony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono logów",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać logów błędów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        titleChanges: "Niezapisane zmiany",
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
  },

  patch: {
    title: "Aktualizuj log błędu",
    description: "Rozwiąż lub otwórz ponownie log błędu według odcisku palca",
    tags: {
      monitoring: "Monitorowanie",
    },
    fields: {
      fingerprint: {
        label: "Odcisk palca",
        description: "Odcisk palca logu błędu",
        placeholder: "Wprowadź odcisk palca",
      },
      resolved: {
        label: "Rozwiązane",
        description:
          "Ustaw na prawda aby rozwiązać, fałsz aby otworzyć ponownie",
      },
    },
    response: {
      fingerprint: {
        title: "Odcisk palca",
      },
      resolved: {
        title: "Rozwiązane",
      },
      affectedRows: {
        title: "Zmienione wiersze",
      },
    },
    success: {
      title: "Log zaktualizowany",
      description: "Status logu błędu zaktualizowany pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Odmowa dostępu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono logu błędu",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować logu błędu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        titleChanges: "Niezapisane zmiany",
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
  },

  post: {
    title: "Uruchom skan monitora błędów",
    description:
      "Skanuj wiadomości czatu i logi backendu w poszukiwaniu wzorców błędów",
    tags: {
      monitoring: "Monitorowanie",
    },
    response: {
      errorsFound: "Znalezione błędy",
      threadsScanned: "Zeskanowane wątki",
      scanWindowFrom: "Okno skanu od",
      scanWindowTo: "Okno skanu do",
      patterns: "Wzorce błędów",
    },
    success: {
      title: "Skan zakończony",
      description: "Skan monitora błędów zakończony pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Dostęp odmówiony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się uruchomić skanu monitora błędów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
  },

  errorMonitor: {
    name: "Monitor błędów",
    description: "Skanuje w poszukiwaniu wzorców błędów co 3 godziny",
  },

  widget: {
    title: "Logi błędów",
    loading: "Ładowanie logów...",
    empty: "Nie znaleziono logów błędów",
    header: {
      refresh: "Odśwież",
      runScan: "Uruchom skan",
      back: "Wstecz",
      activeCount: "aktywnych",
    },
    col: {
      message: "Wiadomość",
      errorType: "Typ błędu",
      occurrences: "Wystąpienia",
      firstSeen: "Pierwsze wystąpienie",
      createdAt: "Ostatnie wystąpienie",
    },
    status: {
      active: "Aktywny",
      resolved: "Rozwiązany",
    },
    action: {
      resolve: "Rozwiąż",
      reopen: "Otwórz ponownie",
    },
    detail: {
      stackTrace: "Stack Trace",
      metadata: "Metadane",
      collapse: "Zwiń",
      resolved: "Rozwiązany",
    },
    pagination: {
      info: "Strona {{page}} z {{totalPages}} ({{total}} łącznie)",
      prev: "Poprzednia",
      next: "Następna",
    },
  },
};
