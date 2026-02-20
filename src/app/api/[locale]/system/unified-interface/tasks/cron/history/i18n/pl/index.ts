import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    tags: {
      tasks: "Zadania",
      monitoring: "Monitorowanie",
    },
    title: "Historia wykonań zadań",
    description: "Wyświetl historyczne rekordy wykonań zadań cron",
    fields: {
      taskId: {
        label: "ID zadania",
        description: "Filtruj według konkretnego ID zadania",
        placeholder: "Wprowadź ID zadania",
      },
      taskName: {
        label: "Nazwa zadania",
        description: "Filtruj według nazwy zadania (częściowe dopasowanie)",
        placeholder: "Wprowadź nazwę zadania",
      },
      status: {
        label: "Status wykonania",
        description: "Filtruj według statusu wykonania",
        placeholder: "Wybierz statusy",
        options: {
          PENDING: "Oczekujące",
          SCHEDULED: "Zaplanowane",
          RUNNING: "Uruchomione",
          COMPLETED: "Zakończone",
          FAILED: "Nieudane",
          ERROR: "Błąd",
          TIMEOUT: "Limit czasu",
          SKIPPED: "Pominięte",
          CANCELLED: "Anulowane",
          STOPPED: "Zatrzymane",
          BLOCKED: "Zablokowane",
        },
      },
      priority: {
        label: "Priorytet zadania",
        description: "Filtruj według poziomu priorytetu zadania",
        placeholder: "Wybierz priorytety",
        options: {
          LOW: "Niski",
          MEDIUM: "Średni",
          HIGH: "Wysoki",
          CRITICAL: "Krytyczny",
        },
      },
      startDate: {
        label: "Data początkowa",
        description: "Filtruj wykonania po tej dacie",
      },
      endDate: {
        label: "Data końcowa",
        description: "Filtruj wykonania przed tą datą",
      },
      limit: {
        label: "Limit wyników",
        description: "Maksymalna liczba wyników do zwrócenia",
        placeholder: "50",
      },
      offset: {
        label: "Przesunięcie wyników",
        description: "Liczba wyników do pominięcia dla paginacji",
        placeholder: "0",
      },
    },
    response: {
      title: "Odpowiedź historii zadań",
      description: "Historyczne dane wykonań zadań cron",
      executions: {
        title: "Rekordy wykonań",
      },
      totalCount: {
        title: "Łączna liczba",
      },
      hasMore: {
        title: "Więcej wyników dostępnych",
      },
      summary: {
        title: "Podsumowanie wykonań",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry żądania",
      },
      internal: {
        title: "Wewnętrzny błąd serwera",
        description: "Nie udało się pobrać historii zadania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wyświetlania historii zadań",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zadanie lub rekord wykonania nie został znaleziony",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas pobierania historii zadania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do historii zadań jest zabroniony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
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
    success: {
      title: "Historia pobrana",
      description: "Historia wykonań zadania została pomyślnie pobrana",
    },
    log: {
      fetchSuccess: "Pomyślnie pobrano {{count}} rekordów wykonań",
      fetchError: "Nie udało się pobrać historii wykonań zadania",
    },
    request: {
      title: "Parametry żądania",
      description: "Filtruj historię wykonań zadań",
    },
    unknownTask: "Nieznane zadanie",
  },
  widget: {
    title: "Historia wykonań zadań",
    loading: "Ładowanie historii...",
    header: {
      tasks: "Zadania",
      stats: "Statystyki",
      pulse: "Pulse",
      refresh: "Odśwież",
    },
    summary: {
      total: "Łącznie",
      successful: "Pomyślne",
      failed: "Nieudane",
      successRate: "Wskaźnik sukcesu",
      avgDuration: "Śr. czas trwania",
    },
    search: {
      placeholder: "Szukaj zadań...",
    },
    filter: {
      all: "Wszystkie",
      running: "Uruchomione",
      completed: "Ukończone",
      failed: "Nieudane",
      timeout: "Przekroczono czas",
      cancelled: "Anulowane",
    },
    col: {
      taskName: "Nazwa zadania",
      status: "Status",
      duration: "Czas trwania",
      started: "Rozpoczęto",
      completed: "Ukończono",
      environment: "Środowisko",
      error: "Błąd",
    },
    empty: "Nie znaleziono historii wykonań",
    result: "Wynik",
    error: {
      collapse: "Zwiń błąd",
      label: "Błąd",
    },
    pagination: {
      info: "Strona {{page}} z {{totalPages}} (łącznie {{total}})",
      prev: "Poprzednia",
      next: "Następna",
    },
  },
};
