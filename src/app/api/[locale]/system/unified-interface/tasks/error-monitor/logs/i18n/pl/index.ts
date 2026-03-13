import type { translations as en } from "../en";

export const translations: typeof en = {
  category: "System",

  errors: {
    repositoryInternalError: "Wystąpił błąd wewnętrzny",
    fetchErrorLogs: "Nie udało się pobrać logów błędów",
  },

  get: {
    title: "Logi błędów",
    description: "Przeglądaj logi błędów backendu z filtrowaniem i paginacją",
    tags: {
      monitoring: "Monitorowanie",
    },
    fields: {
      source: {
        label: "Źródło",
        description: "Filtruj według źródła błędu",
        placeholder: "backend, task, chat",
      },
      level: {
        label: "Poziom",
        description: "Filtruj według poziomu błędu",
        placeholder: "error, warn",
      },
      endpoint: {
        label: "Endpoint",
        description: "Filtruj według ścieżki endpointu (częściowe dopasowanie)",
        placeholder: "Wprowadź endpoint",
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

  widget: {
    title: "Logi błędów",
    loading: "Ładowanie logów...",
    empty: "Nie znaleziono logów błędów",
    header: {
      refresh: "Odśwież",
      runScan: "Uruchom skan",
    },
    col: {
      level: "Poziom",
      source: "Źródło",
      message: "Wiadomość",
      endpoint: "Endpoint",
      errorType: "Typ błędu",
      createdAt: "Czas",
    },
    detail: {
      stackTrace: "Stack Trace",
      metadata: "Metadane",
      collapse: "Zwiń",
    },
    pagination: {
      info: "Strona {{page}} z {{totalPages}} ({{total}} łącznie)",
      prev: "Poprzednia",
      next: "Następna",
    },
  },
};
