import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    sideTasksActionLabel: "Akcja",
    sideTasksActionDescription: "Wybierz akcję do wykonania",
    sideTasksActionList: "Lista zadań",
    sideTasksActionGet: "Pobierz zadanie",
    sideTasksActionCreate: "Utwórz zadanie",
    sideTasksActionUpdate: "Aktualizuj zadanie",
    sideTasksActionDelete: "Usuń zadanie",
    sideTasksActionStats: "Statystyki zadań",
    sideTasksActionExecutions: "Wykonania zadań",
    sideTasksActionHealthCheck: "Sprawdzenie stanu",
    sideTasksIdLabel: "ID zadania",
    sideTasksIdDescription: "Unikalny identyfikator zadania",
    sideTasksNameLabel: "Nazwa zadania",
    sideTasksNameDescription: "Nazwa zadania",
    sideTasksLimitLabel: "Limit",
    sideTasksLimitDescription: "Maksymalna liczba wyników do zwrócenia",
    sideTasksDataLabel: "Dane zadania",
    sideTasksDataDescription: "Dodatkowe dane dla zadania",
    sideTasksRepositoryFetchAllFailed: "Nie udało się pobrać wszystkich zadań pobocznych",
    sideTasksRepositoryFetchByIdFailed: "Nie udało się pobrać zadania pobocznego według ID",
    sideTasksRepositoryCreateFailed: "Nie udało się utworzyć zadania pobocznego",
  },
  post: {
    title: "Zarządzanie zadaniami pobocznymi",
    description: "Zarządzaj operacjami zadań pobocznych",
    category: "Zadania systemowe",
    container: {
      title: "Zadania poboczne",
      description: "Konfiguruj operacje zadań pobocznych",
    },
  },
  get: {
    title: "Pobierz zadanie poboczne",
    description: "Pobierz informacje o zadaniu pobocznym",
    container: {
      title: "Szczegóły zadania pobocznego",
      description: "Wyświetl szczegóły zadania pobocznego",
    },
    response: {
      healthyTasks: {
        title: "Zdrowe zadania",
      },
      unhealthyTasks: {
        title: "Niezdrowe zadania",
      },
      runningTasks: {
        title: "Uruchomione zadania",
      },
      totalTasks: {
        title: "Wszystkie zadania",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do przeglądania zadań pobocznych",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania zadań pobocznych",
      },
      unknownError: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
    success: {
      title: "Sukces",
      description: "Zadania poboczne pobrane pomyślnie",
    },
  },
  tasks: {
    side: {
      response: {
        success: {
          title: "Sukces",
        },
        message: {
          title: "Wiadomość",
        },
        data: {
          title: "Dane",
        },
        count: {
          title: "Liczba",
        },
      },
    },
  },
  category: "Punkt końcowy API",
  tags: {
    sidetasks: "Sidetasks",
  },
  errors: {
    fetchByNameFailed: "Nie udało się pobrać zadania pobocznego według nazwy",
    updateTaskFailed: "Nie udało się zaktualizować zadania pobocznego",
    deleteTaskFailed: "Nie udało się usunąć zadania pobocznego",
    createExecutionFailed: "Nie udało się utworzyć wykonania zadania pobocznego",
    updateExecutionFailed: "Nie udało się zaktualizować wykonania zadania pobocznego",
    fetchExecutionsFailed: "Nie udało się pobrać wykonań zadań pobocznych",
    fetchRecentExecutionsFailed: "Nie udało się pobrać ostatnich wykonań zadań pobocznych",
    createHealthCheckFailed: "Nie udało się utworzyć sprawdzenia zdrowia zadania pobocznego",
    fetchLatestHealthCheckFailed: "Nie udało się pobrać ostatniego sprawdzenia zdrowia",
    fetchHealthCheckHistoryFailed: "Nie udało się pobrać historii sprawdzeń zdrowia",
    fetchStatisticsFailed: "Nie udało się pobrać statystyk zadań pobocznych",
    taskNotFound: "Zadanie poboczne nie zostało znalezione",
    executionNotFound: "Wykonanie zadania pobocznego nie zostało znalezione",
  },
};
