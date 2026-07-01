import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  execute: {
    category: "Wykonanie Pulse",
    tags: {
      execute: "Wykonaj",
    },
    post: {
      title: "Wykonaj Pulse",
      description: "Wykonaj monitorowanie zdrowia pulse i wykonywanie zadań",
      container: {
        title: "Wykonanie Pulse",
        description:
          "Wykonaj monitorowanie pulse i uruchom zaplanowane zadania",
      },
      fields: {
        dryRun: {
          label: "Próbny przebieg",
          description:
            "Wykonaj próbny przebieg bez wprowadzania rzeczywistych zmian",
        },
        taskNames: {
          label: "Nazwy zadań",
          description: "Konkretne nazwy zadań do wykonania (opcjonalne)",
        },
        force: {
          label: "Wymuś wykonanie",
          description: "Wymuś wykonanie nawet jeśli zadania nie są wymagane",
        },
        success: {
          title: "Sukces",
        },
        message: {
          title: "Wiadomość",
        },
      },
      response: {
        pulseId: "ID Pulse",
        executedAt: "Wykonano o",
        totalTasksDiscovered: "Łączna liczba odkrytych zadań",
        tasksDue: "Zadania wymagane",
        tasksExecuted: "Zadania wykonane",
        tasksSucceeded: "Zadania udane",
        tasksFailed: "Zadania nieudane",
        tasksSkipped: "Zadania pominięte",
        totalExecutionTimeMs: "Całkowity czas wykonania (ms)",
        errors: "Błędy",
        summary: "Podsumowanie wykonania",
        results: "Wyniki",
        resultsDescription: "Wyniki wykonania zadań",
        taskName: "Nazwa zadania",
        success: "Sukces",
        duration: "Czas trwania",
        message: "Wiadomość",
        executionFailed: "Wykonanie nie powiodło się",
        dryRunSuccess: "Próbne uruchomienie zakończone pomyślnie",
        executionSuccess: "Wykonanie zakończone pomyślnie",
      },
      examples: {
        basic: {
          title: "Podstawowe wykonanie Pulse",
        },
        dryRun: {
          title: "Wykonanie próbnego przebiegu",
        },
        success: {
          title: "Udane wykonanie",
        },
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagana autoryzacja",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Wystąpił błąd wewnętrzny serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie został znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Istnieją niezapisane zmiany",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
  },
  status: {
    category: "Punkt końcowy API",
    tags: {
      status: "Status",
    },
    get: {
      title: "Status Pulsu",
      description: "Pobierz status monitorowania zdrowia pulsu",
      container: {
        title: "Status Zdrowia Pulsu",
        description: "Monitoruj zdrowie wykonywania pulsu i statystyki",
      },
      fields: {
        status: {
          title: "Status",
          label: "Status Pulsu",
          description: "Aktualny status zdrowia pulsu",
        },
        lastPulseAt: {
          title: "Ostatni Puls O",
          label: "Ostatni Puls",
          description: "Znacznik czasu ostatniego wykonania pulsu",
        },
        successRate: {
          title: "Wskaźnik Sukcesu",
          label: "Wskaźnik Sukcesu",
          description: "Procent udanych wykonań pulsu",
        },
        totalExecutions: {
          title: "Łączne Wykonania",
          label: "Łączne Wykonania",
          description: "Łączna liczba wykonań pulsu",
        },
      },
      examples: {
        basic: {
          title: "Podstawowe Żądanie Statusu",
        },
        success: {
          title: "Udana Odpowiedź Statusu",
        },
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagana autoryzacja",
        },
        internal: {
          title: "Błąd Wewnętrzny",
          description: "Wystąpił błąd wewnętrzny serwera",
        },
        unknown: {
          title: "Nieznany Błąd",
          description: "Wystąpił nieznany błąd",
        },
        network: {
          title: "Błąd Sieci",
          description: "Wystąpił błąd sieci",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony",
        },
        notFound: {
          title: "Nie Znaleziono",
          description: "Zasób nie został znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
        unsaved: {
          title: "Niezapisane Zmiany",
          description: "Istnieją niezapisane zmiany",
        },
        validation: {
          title: "Błąd Walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
  },
  history: {
    category: "Zarządzanie zadaniami",

    tags: {
      pulse: "Pulse",
      monitoring: "Monitorowanie",
    },

    errors: {
      fetchCronTaskHistory: "Nie udało się pobrać historii wykonań pulse",
    },

    get: {
      title: "Historia wykonań Pulse",
      description: "Przeglądaj historyczne cykle wykonań Pulse",
      fields: {
        startDate: {
          label: "Data początkowa",
          description: "Filtruj cykle Pulse po tej dacie",
        },
        endDate: {
          label: "Data końcowa",
          description: "Filtruj cykle Pulse przed tą datą",
        },
        status: {
          label: "Status",
          description: "Filtruj według statusu wykonania",
          placeholder: "Wszystkie statusy",
        },
        limit: {
          label: "Limit wyników",
          description: "Maksymalna liczba zwracanych wyników",
          placeholder: "50",
        },
        offset: {
          label: "Przesunięcie wyników",
          description: "Liczba wyników do pominięcia przy paginacji",
          placeholder: "0",
        },
      },
      response: {
        executions: { title: "Wykonania Pulse" },
        totalCount: { title: "Łączna liczba" },
        hasMore: { title: "Więcej wyników" },
        summary: { title: "Podsumowanie wykonań" },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Podano nieprawidłowe parametry żądania",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas pobierania historii Pulse",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nie masz uprawnień do przeglądania historii Pulse",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp do historii Pulse jest zabroniony",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Rekord wykonania Pulse nie został znaleziony",
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
          title: "Niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
      },
      success: {
        title: "Historia pobrana",
        description: "Historia wykonań Pulse pobrana pomyślnie",
      },
    },
    pulse: {
      execution: {
        success: "Sukces",
        failure: "Niepowodzenie",
        timeout: "Przekroczenie czasu",
        cancelled: "Anulowane",
        pending: "Oczekujące",
      },
    },
    widget: {
      title: "Historia Pulse",
      empty: "Nie znaleziono wykonań Pulse",
      details: "Szczegóły",
      discovered: "{{count}} wykrytych",
      due: "{{count}} do wykonania",
      succeeded: "{{count}} ok",
      failed: "{{count}} nieudanych",
      tasksExecuted: "Wykonane",
      tasksSucceeded: "Zakończone sukcesem",
      tasksFailed: "Nieudane",
      tasksSkipped: "Pominięte",
      header: {
        cronHistory: "Historia Cron",
        stats: "Statystyki",
        refresh: "Odśwież",
      },
      summary: {
        total: "Łącznie",
        successful: "Udane",
        failed: "Nieudane",
        successRate: "Wskaźnik sukcesu",
        avgDuration: "Śr. czas trwania",
      },
      filter: {
        all: "Wszystkie",
        success: "Udane",
        failure: "Nieudane",
        timeout: "Timeout",
      },
      pagination: {
        info: "Strona {{page}} z {{totalPages}} ({{total}} łącznie)",
        prev: "Poprzednia",
        next: "Następna",
      },
    },
  },
  success: {
    title: "Sukces",
    description: "Puls wykonany pomyślnie",
    content: "Sukces",
  },
  container: {
    title: "Kontener pulsu",
    description: "Opis kontenera pulsu",
  },
};
