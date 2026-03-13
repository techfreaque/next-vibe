import type { translations as en } from "../en";

export const translations: typeof en = {
  category: "System",

  errors: {
    repositoryInternalError: "Wystąpił błąd wewnętrzny",
    fetchErrorGroups: "Nie udało się pobrać grup błędów",
    updateErrorGroup: "Nie udało się zaktualizować statusu grupy błędów",
  },

  statusFilter: {
    all: "Wszystkie",
    active: "Aktywne",
    resolved: "Rozwiązane",
  },

  get: {
    title: "Grupy błędów",
    description:
      "Przeglądaj zgrupowane błędy według odcisku palca z filtrowaniem i paginacją",
    tags: {
      monitoring: "Monitorowanie",
    },
    fields: {
      status: {
        label: "Status",
        description: "Filtruj według statusu grupy",
        placeholder: "Wszystkie statusy",
      },
      errorType: {
        label: "Typ błędu",
        description: "Filtruj według typu błędu (częściowe dopasowanie)",
        placeholder: "np. INTERNAL_ERROR",
      },
      search: {
        label: "Szukaj",
        description: "Szukaj w komunikatach błędów",
        placeholder: "Szukaj komunikatów...",
      },
      startDate: {
        label: "Od",
        description: "Pokaż grupy z błędami po tej dacie",
      },
      endDate: {
        label: "Do",
        description: "Pokaż grupy z błędami przed tą datą",
      },
      limit: {
        label: "Limit",
        description: "Liczba grup do zwrócenia",
        placeholder: "50",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba grup do pominięcia",
        placeholder: "0",
      },
    },
    response: {
      groups: {
        title: "Grupy błędów",
      },
      totalCount: {
        title: "Łączna liczba",
      },
      hasMore: {
        title: "Więcej dostępne",
      },
    },
    success: {
      title: "Grupy pobrane",
      description: "Grupy błędów pobrane pomyślnie",
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
        description: "Nie znaleziono grup",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać grup błędów",
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
    title: "Aktualizuj grupę błędów",
    description:
      "Rozwiąż lub otwórz ponownie grupę błędów według odcisku palca",
    tags: {
      monitoring: "Monitorowanie",
    },
    fields: {
      fingerprint: {
        label: "Odcisk palca",
        description: "Odcisk palca grupy błędów",
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
      title: "Grupa zaktualizowana",
      description: "Status grupy błędów zaktualizowany pomyślnie",
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
        description: "Nie znaleziono grupy błędów",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować grupy błędów",
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
    title: "Grupy błędów",
    loading: "Ładowanie grup...",
    empty: "Nie znaleziono grup błędów",
    header: {
      refresh: "Odśwież",
      activeGroups: "aktywnych",
    },
    col: {
      status: "Status",
      message: "Komunikat",
      errorType: "Typ błędu",
      occurrences: "Wystąpienia",
      firstSeen: "Pierwsze wystąpienie",
      lastSeen: "Ostatnie wystąpienie",
    },
    status: {
      active: "Aktywny",
      resolved: "Rozwiązany",
    },
    action: {
      resolve: "Rozwiąż",
      reopen: "Otwórz ponownie",
    },
    pagination: {
      info: "Strona {{page}} z {{totalPages}} ({{total}} łącznie)",
      prev: "Poprzednia",
      next: "Następna",
    },
  },
};
