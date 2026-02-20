import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    tasks: "Tasks",
  },
  list: {
    columns: {
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
  },
  get: {
    title: "Lista zadań Cron",
    description: "Pobierz listę zadań cron z opcjonalnym filtrowaniem",
    container: {
      title: "Lista zadań Cron",
      description: "Filtruj i wyświetlaj zadania cron",
    },
    fields: {
      status: {
        label: "Status",
        description: "Filtruj według statusu zadania",
        placeholder: "Wybierz status...",
      },
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
      enabled: {
        label: "Status",
        description: "Filtruj według statusu włączenia",
        placeholder: "Wszystkie zadania",
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
        title: "Zadania",
      },
      task: {
        title: "Zadanie",
        description: "Informacje o indywidualnym zadaniu",
        id: "ID zadania",
        name: "Nazwa zadania",
        taskDescription: "Opis",
        schedule: "Harmonogram",
        enabled: "Włączone",
        priority: "Priorytet",
        status: "Status",
        category: "Kategoria",
        lastRun: "Ostatnie uruchomienie",
        nextRun: "Następne uruchomienie",
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
        successCount: "Liczba sukcesów",
        errorCount: "Liczba błędów",
        averageExecutionTime: "Średni czas uruchomienia (ms)",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
      totalTasks: "Łączna liczba zadań",
    },
    errors: {
      internal: {
        title: "Wystąpił błąd wewnętrzny serwera podczas pobierania zadań",
        description:
          "Wystąpił nieoczekiwany błąd podczas pobierania listy zadań",
      },
      unauthorized: {
        title: "Nieautoryzowany dostęp do listy zadań",
        description: "Nie masz uprawnień do wyświetlania listy zadań",
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
        title: "Zadania nie znalezione",
        description: "Nie znaleziono zadań spełniających kryteria",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas pobierania zadań",
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
        title: "Zadania pobrane pomyślnie",
        description: "Lista zadań została pomyślnie pobrana",
      },
    },
  },
  post: {
    title: "Utwórz zadanie Cron",
    description: "Utwórz nowe zadanie cron",
    container: {
      title: "Utwórz zadanie",
      description: "Skonfiguruj nowe zadanie cron",
    },
    fields: {
      routeId: {
        label: "ID trasy",
        description:
          "Identyfikator obsługi: nazwa zadania, alias endpointu lub 'cron-steps'",
        placeholder: "Wprowadź ID trasy...",
      },
      displayName: {
        label: "Wyświetlana nazwa",
        description: "Czytelna dla człowieka etykieta tego zadania",
        placeholder: "Wprowadź wyświetlaną nazwę...",
      },
      outputMode: {
        label: "Tryb wyjścia",
        description: "Kiedy wysyłać powiadomienia po wykonaniu",
        placeholder: "Wybierz tryb wyjścia...",
      },
      description: {
        label: "Opis",
        description: "Opis zadania",
        placeholder: "Wprowadź opis...",
      },
      schedule: {
        label: "Harmonogram",
        description: "Wyrażenie harmonogramu Cron",
        placeholder: "*/5 * * * *",
      },
      priority: {
        label: "Priorytet",
        description: "Poziom priorytetu zadania",
      },
      category: {
        label: "Kategoria",
        description: "Kategoria zadania",
      },
      enabled: {
        label: "Włączone",
        description: "Włącz lub wyłącz zadanie",
      },
      timeout: {
        label: "Limit czasu (ms)",
        description: "Maksymalny czas wykonania w milisekundach",
      },
      retries: {
        label: "Ponowne próby",
        description: "Liczba prób ponowienia",
      },
      retryDelay: {
        label: "Opóźnienie ponowienia (ms)",
        description: "Opóźnienie między ponownymi próbami w milisekundach",
      },
    },
    response: {
      task: {
        title: "Utworzone zadanie",
      },
    },
    errors: {
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podane dane zadania są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do tworzenia zadań",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd podczas tworzenia zadania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      conflict: {
        title: "Konflikt",
        description: "Zadanie o tej nazwie już istnieje",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      created: {
        title: "Zadanie utworzone",
        description: "Zadanie zostało pomyślnie utworzone",
      },
    },
  },
  widget: {
    title: "Zadania Cron",
    loading: "Ładowanie zadań...",
    header: {
      stats: "Statystyki",
      history: "Historia",
      refresh: "Odśwież",
      create: "Nowe zadanie",
    },
    filter: {
      all: "Wszystkie",
      running: "Uruchomione",
      completed: "Ukończone",
      failed: "Nieudane",
      pending: "Oczekujące",
      disabled: "Wyłączone",
      allPriorities: "Wszystkie priorytety",
      allCategories: "Wszystkie kategorie",
    },
    search: {
      placeholder: "Szukaj zadań...",
    },
    sort: {
      nameAsc: "Nazwa A-Z",
      nameDesc: "Nazwa Z-A",
      schedule: "Harmonogram",
      lastRunNewest: "Ostatnie uruchomienie (najnowsze)",
      executionsMost: "Najwięcej wykonań",
    },
    task: {
      executions: "Wykonania:",
      lastRun: "Ostatni przebieg:",
      never: "Nigdy",
      nextRun: "Następny przebieg:",
      notScheduled: "Nie zaplanowano",
      routeId: "ID trasy",
      owner: {
        system: "System",
        user: "Użytkownik",
      },
      outputMode: {
        storeOnly: "Tylko zapisz",
        notifyOnFailure: "Powiadom przy błędzie",
        notifyAlways: "Zawsze powiadamiaj",
      },
    },
    action: {
      view: "Pokaż szczegóły",
      history: "Pokaż historię",
      edit: "Edytuj zadanie",
      delete: "Usuń zadanie",
      runNow: "Uruchom teraz",
    },
    empty: {
      noTasks: "Brak zadań cron",
      noTasksDesc: "Utwórz swoje pierwsze zadanie cron",
      noMatches: "Żadne zadania nie pasują do filtrów",
      noMatchesDesc: "Spróbuj dostosować kryteria wyszukiwania lub filtrowania",
      clearFilters: "Wyczyść filtry",
    },
  },
};
