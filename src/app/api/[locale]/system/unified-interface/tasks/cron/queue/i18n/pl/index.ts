import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    tasks: "Tasks",
    cron: "Cron",
    scheduling: "Planowanie",
    queue: "Kolejka",
  },
  errors: {
    fetchQueue: "Nie udało się pobrać kolejki zadań",
  },
  get: {
    title: "Kolejka zadań",
    description:
      "Wyświetl nadchodzącą kolejkę wykonania zadań posortowaną według czasu następnego uruchomienia",
    fields: {
      priority: {
        label: "Priorytet",
        description: "Filtruj według priorytetu zadania",
        placeholder: "Wybierz priorytet...",
      },
      category: {
        label: "Kategoria",
        description: "Filtruj według kategorii zadania",
        placeholder: "Wybierz kategorię...",
      },
      hidden: {
        label: "Widoczność",
        description: "Uwzględnij ukryte zadania (domyślnie: wszystkie zadania)",
        placeholder: "Wszystkie zadania",
      },
      search: {
        label: "Szukaj",
        description: "Filtruj zadania według nazwy, trasy lub kategorii",
        placeholder: "Szukaj w kolejce...",
      },
      limit: {
        label: "Limit",
        description: "Maksymalna liczba zadań do zwrócenia",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba zadań do pominięcia",
      },
    },
    response: {
      tasks: {
        title: "Zadania w kolejce",
      },
      task: {
        title: "Zadanie",
        description: "Informacje o indywidualnym zadaniu",
        id: "ID zadania",
        routeId: "ID trasy",
        displayName: "Nazwa",
        taskDescription: "Opis",
        schedule: "Harmonogram",
        enabled: "Włączone",
        hidden: "Ukryte",
        priority: "Priorytet",
        status: "Status",
        category: "Kategoria",
        version: "Wersja",
        timezone: "Strefa czasowa",
        timeout: "Limit czasu (ms)",
        retries: "Ponowne próby",
        retryDelay: "Opóźnienie ponowienia (ms)",
        lastExecutedAt: "Ostatnie uruchomienie",
        lastExecutionStatus: "Status ostatniego uruchomienia",
        lastExecutionError: "Błąd ostatniego uruchomienia",
        lastExecutionDuration: "Czas ostatniego uruchomienia (ms)",
        nextExecutionAt: "Następne uruchomienie",
        executionCount: "Liczba uruchomień",
        consecutiveFailures: "Kolejne niepowodzenia",
        successCount: "Liczba sukcesów",
        errorCount: "Liczba błędów",
        averageExecutionTime: "Średni czas uruchomienia (ms)",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
        userId: "ID użytkownika",
        outputMode: "Tryb wyjścia",
      },
      totalTasks: "Łączna liczba zadań",
    },
    errors: {
      internal: {
        title: "Błąd wewnętrzny serwera podczas pobierania kolejki",
        description:
          "Wystąpił nieoczekiwany błąd podczas pobierania kolejki zadań",
      },
      unauthorized: {
        title: "Nieautoryzowany dostęp do kolejki zadań",
        description: "Nie masz uprawnień do wyświetlania kolejki zadań",
      },
      validation: {
        title: "Nieprawidłowe parametry żądania",
        description: "Podane parametry żądania są nieprawidłowe",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      notFound: {
        title: "Kolejka nie znaleziona",
        description: "Nie znaleziono zadań w kolejce",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas pobierania kolejki",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany, które wymagają uwagi",
      },
      conflict: {
        title: "Błąd konfliktu",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
    },
    success: {
      retrieved: {
        title: "Kolejka pobrana pomyślnie",
        description: "Kolejka zadań została pomyślnie pobrana",
      },
    },
  },
  widget: {
    title: "Kolejka zadań",
    loading: "Ładowanie kolejki...",
    header: {
      tasks: "Wszystkie zadania",
      history: "Historia",
      stats: "Statystyki",
      create: "Nowe zadanie",
      refresh: "Odśwież",
    },
    filter: {
      visible: "Widoczne",
      hiddenOnly: "Ukryte",
      allTasks: "Wszystkie zadania",
      allPriorities: "Wszystkie priorytety",
      allCategories: "Wszystkie kategorie",
    },
    search: {
      placeholder: "Szukaj w kolejce...",
    },
    queue: {
      position: "#",
      nextRun: "Następne uruchomienie",
      lastRun: "Ostatnie uruchomienie",
      never: "Nigdy",
      notScheduled: "Nie zaplanowano",
      in: "za",
      ago: "temu",
      justNow: "właśnie teraz",
      overdue: "przeterminowane",
      hiddenBadge: "Ukryte",
      owner: {
        system: "System",
        user: "Użytkownik",
      },
    },
    action: {
      view: "Pokaż szczegóły",
      history: "Pokaż historię",
      edit: "Edytuj zadanie",
      run: "Uruchom teraz",
    },
    bulk: {
      selected: "{count} zaznaczono",
      selectAll: "Zaznacz wszystkie",
      clearSelection: "Wyczyść zaznaczenie",
      enable: "Włącz",
      disable: "Wyłącz",
      runNow: "Uruchom teraz",
      delete: "Usuń",
      confirmDeleteTitle: "Usunąć zadania?",
      confirmDelete:
        "Usunąć {count} zadanie(a)? Tej operacji nie można cofnąć.",
      cancel: "Anuluj",
      success: "{succeeded} udanych, {failed} nieudanych",
    },
    empty: {
      noTasks: "Kolejka jest pusta",
      noTasksDesc: "Brak aktywnych zadań z zaplanowanymi uruchomieniami",
      noMatches: "Żadne zadania nie pasują do filtrów",
      noMatchesDesc: "Spróbuj dostosować kryteria wyszukiwania lub filtrowania",
      clearFilters: "Wyczyść filtry",
    },
  },
};
