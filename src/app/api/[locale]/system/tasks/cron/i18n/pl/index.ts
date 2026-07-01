import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  history: {
    category: "Zarządzanie zadaniami",

    errors: {
      cronTaskNotFound: "Zadanie cron nie znalezione",
      repositoryInternalError: "Wystąpił błąd wewnętrzny",
      fetchCronTaskHistory: "Nie udało się pobrać historii zadań cron",
    },

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
        statusCounts: {
          title: "Liczba statusów",
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
          description:
            "Wystąpił błąd sieci podczas pobierania historii zadania",
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
  },
  stats: {
    category: "Zarządzanie zadaniami",

    errors: {
      fetchCronTaskStats: "Nie udało się pobrać statystyk zadań cron",
    },

    get: {
      title: "Pobierz Statystyki Zadań Cron",
      description: "Pobierz kompleksowe statystyki i metryki zadań cron",
      tag: "Statystyki Cron",
      form: {
        title: "Żądanie Statystyk Cron",
        description: "Skonfiguruj parametry do pobierania statystyk zadań cron",
      },
      fields: {
        period: {
          title: "Okres Czasu",
          description: "Okres czasu dla agregacji statystyk",
        },
        type: {
          title: "Typ Statystyk",
          description: "Typ statystyk do pobrania",
        },
        taskId: {
          title: "ID Zadania",
          description:
            "Opcjonalne konkretne ID zadania do filtrowania statystyk",
        },
        limit: {
          title: "Limit Wyników",
          description: "Maksymalna liczba wyników do zwrócenia",
        },
        timePeriod: {
          title: "Okres Czasu",
        },
        dateRangePreset: {
          title: "Wstępnie Ustawiony Zakres Dat",
        },
        taskName: {
          title: "Nazwa Zadania",
        },
        taskStatus: {
          title: "Status Zadania",
        },
        taskPriority: {
          title: "Priorytet Zadania",
        },
        healthStatus: {
          title: "Status Zdrowia",
        },
        minDuration: {
          title: "Minimalny Czas Trwania",
        },
        maxDuration: {
          title: "Maksymalny Czas Trwania",
        },
        includeDisabled: {
          title: "Uwzględnij Wyłączone",
        },
        includeSystemTasks: {
          title: "Uwzględnij Zadania Systemowe",
        },
        hasRecentFailures: {
          title: "Ma Ostatnie Błędy",
        },
        hasTimeout: {
          title: "Ma Timeout",
        },
        search: {
          title: "Szukaj",
        },
      },
      period: {
        hour: "Godzinowe",
        day: "Dzienne",
        week: "Tygodniowe",
        month: "Miesięczne",
      },
      type: {
        overview: "Przegląd",
        performance: "Wydajność",
        errors: "Analiza Błędów",
        trends: "Analiza Trendów",
      },
      response: {
        totalTasks: { title: "Łączne zadania" },
        executedTasks: { title: "Wykonane zadania" },
        successfulTasks: { title: "Pomyślne zadania" },
        failedTasks: { title: "Nieudane zadania" },
        averageExecutionTime: { title: "Śr. czas wykonania (ms)" },
        totalExecutions: { title: "Łączne wykonania" },
        executionsLast24h: { title: "Wykonania ostatnie 24h" },
        successRate: { title: "Wskaźnik sukcesu (%)" },
        successfulExecutions: { title: "Pomyślne wykonania" },
        failedExecutions: { title: "Nieudane wykonania" },
        failureRate: { title: "Wskaźnik błędów (%)" },
        avgExecutionTime: { title: "Śr. czas wykonania (ms)" },
        minExecutionTime: { title: "Min czas wykonania (ms)" },
        maxExecutionTime: { title: "Max czas wykonania (ms)" },
        medianExecutionTime: { title: "Mediana czasu wykonania (ms)" },
        pendingExecutions: { title: "Oczekujące wykonania" },
        runningExecutions: { title: "Uruchomione wykonania" },
        activeTasks: { title: "Aktywne zadania" },
        systemStatus: { title: "Status systemu" },
        uptime: { title: "Czas działania" },
        healthyTasks: { title: "Zdrowe zadania" },
        degradedTasks: { title: "Zdegradowane zadania" },
        systemLoad: { title: "Obciążenie systemu (%)" },
        queueSize: { title: "Rozmiar kolejki" },
      },
      errors: {
        server: {
          title: "Błąd Serwera",
          description:
            "Wystąpił wewnętrzny błąd serwera podczas pobierania statystyk",
        },
        validation: {
          title: "Błąd Walidacji",
          description: "Podane parametry są nieprawidłowe",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagana autoryzacja do dostępu do statystyk",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Niewystarczające uprawnienia do dostępu do statystyk",
        },
        notFound: {
          title: "Nie Znaleziono",
          description: "Żądane statystyki nie mogły zostać znalezione",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt podczas przetwarzania żądania",
        },
        network: {
          title: "Błąd Sieci",
          description: "Wystąpił błąd sieci podczas pobierania statystyk",
        },
        unknown: {
          title: "Nieznany Błąd",
          description: "Wystąpił nieznany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane Zmiany",
          description: "Istnieją niezapisane zmiany, które wymagają uwagi",
        },
      },
      success: {
        title: "Statystyki Pobrane",
        description: "Statystyki zadań cron pomyślnie pobrane",
      },
    },
    priority: {
      critical: "Krytyczny",
      high: "Wysoki",
      medium: "Średni",
      low: "Niski",
      background: "Tło",
    },
    widget: {
      title: "Statystyki Cron",
      loading: "Ładowanie statystyk...",
      viewTasks: "Zadania",
      viewHistory: "Historia",
      viewPulse: "Pulse",
      refresh: "Odśwież",
      totalTasks: "Łączne zadania",
      executedTasks: "Wykonane zadania",
      successfulTasks: "Pomyślne",
      failedTasks: "Nieudane",
      successRate: "Wskaźnik sukcesu",
      avgDuration: "Śr. czas",
      overallSuccessRate: "Ogólny wskaźnik sukcesu",
      activeTasks: "Aktywne zadania",
      runningExecutions: "Uruchomione",
      pendingExecutions: "Oczekujące",
      healthyTasks: "Zdrowe zadania",
      degradedTasks: "Zdegradowane zadania",
      systemLoad: "Obciążenie systemu",
      queueSize: "Rozmiar kolejki",
      executionsLast24h: "Ostatnie 24h",
      tasksByStatus: "Zadania wg statusu",
      tasksByPriority: "Zadania wg priorytetu",
      topPerforming: "Najlepsze zadania",
      problemTasks: "Zadania problemowe",
      recentActivity: "Ostatnia aktywność",
      dailyStats: "Statystyki dzienne",
      systemStatus: {
        healthy: "Zdrowy",
        warning: "Ostrzeżenie",
        critical: "Krytyczny",
        unknown: "Nieznany",
      },
      uptime: "Czas działania",
      col: {
        rank: "#",
        taskName: "Nazwa zadania",
        executions: "Wykonania",
        avgDuration: "Śr. czas",
        failures: "Błędy",
        failureRate: "Wskaźnik błędów",
        date: "Data",
        successes: "Sukcesy",
        uniqueTasks: "Unikalne zadania",
      },
    },
  },
  task: {
    category: "System",
    tags: {
      cron: "Cron",
      scheduling: "Planowanie",
    },
    get: {
      title: "Pobierz zadanie Cron",
      description: "Pobierz pojedyncze zadanie cron według ID",
      container: {
        title: "Szczegóły zadania Cron",
        description: "Wyświetl szczegóły konkretnego zadania cron",
      },
      fields: {
        id: {
          label: "ID zadania",
          description: "Unikalny identyfikator zadania",
        },
      },
      response: {
        task: {
          title: "Zadanie",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Podane ID zadania jest nieprawidłowe",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nie masz uprawnień do wyświetlenia tego zadania",
        },
        notFound: {
          title: "Zadanie nie znalezione",
          description: "Żądane zadanie nie zostało znalezione",
        },
        internal: {
          title: "Wewnętrzny błąd serwera",
          description: "Wystąpił błąd podczas pobierania zadania",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do dostępu do tego zadania",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt",
        },
      },
      success: {
        retrieved: {
          title: "Zadanie pobrane",
          description: "Zadanie pobrane pomyślnie",
        },
      },
    },
    put: {
      title: "Aktualizuj zadanie Cron",
      description: "Zaktualizuj istniejące zadanie cron",
      container: {
        title: "Aktualizuj zadanie Cron",
        description: "Zmodyfikuj ustawienia zadania",
      },
      fields: {
        id: {
          label: "ID zadania",
          description: "Unikalny identyfikator zadania",
        },
        displayName: {
          label: "Wyświetlana nazwa",
          description: "Czytelna dla człowieka etykieta tego zadania",
          placeholder: "Wprowadź wyświetlaną nazwę",
        },
        outputMode: {
          label: "Tryb wyjścia",
          description: "Kiedy wysyłać powiadomienia po wykonaniu",
          placeholder: "Wybierz tryb wyjścia",
        },
        description: {
          label: "Opis",
          description: "Opis zadania",
          placeholder: "Wprowadź opis zadania",
        },
        schedule: {
          label: "Harmonogram",
          description: "Wyrażenie harmonogramu cron",
          placeholder: "*/5 * * * *",
        },
        enabled: {
          label: "Włączone",
          description: "Czy zadanie jest włączone",
        },
        priority: {
          label: "Priorytet",
          description: "Poziom priorytetu zadania",
          placeholder: "Wybierz priorytet",
        },
        category: {
          label: "Kategoria",
          description: "Kategoria zadania",
          placeholder: "Wybierz kategorię",
        },
        timeout: {
          label: "Limit czasu",
          description: "Maksymalny czas wykonania w sekundach",
          placeholder: "3600",
        },
        retries: {
          label: "Ponowienia",
          description: "Liczba prób ponowienia w przypadku niepowodzenia",
          placeholder: "3",
        },
        retryAttempts: {
          label: "Próby ponowienia",
          description: "Liczba prób ponowienia w przypadku niepowodzenia",
        },
        retryDelay: {
          label: "Opóźnienie ponowienia (ms)",
          description: "Opóźnienie między ponowieniami w milisekundach",
          placeholder: "5000",
        },
        taskInput: {
          label: "Dane wejściowe zadania",
          description: "Dane wejściowe JSON dla zadania",
        },
        hidden: {
          label: "Ukryte",
          description:
            "Ukryj to zadanie w promptach systemowych AI i domyślnych listach zadań",
        },
        runOnce: {
          label: "Uruchom raz",
          description: "Uruchom to zadanie tylko raz, a następnie je wyłącz",
        },
        targetInstance: {
          label: "Docelowa instancja",
          description:
            "ID instancji, na której zadanie ma być uruchamiane. Pozostaw puste lub ustaw null dla wszystkich instancji.",
          placeholder: "np. hermes, thea-prod",
        },
        lastExecutionStatus: {
          label: "Status wykonania",
          description:
            "Nadpisz ostatni status wykonania. Użyj, aby zresetować zablokowane zadanie 'running'.",
          placeholder: "Wybierz status",
        },
      },
      response: {
        task: {
          title: "Zaktualizowane zadanie",
        },
        success: {
          title: "Sukces",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Podane dane są nieprawidłowe",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nie masz uprawnień do aktualizacji tego zadania",
        },
        notFound: {
          title: "Zadanie nie znalezione",
          description: "Zadanie do aktualizacji nie zostało znalezione",
        },
        internal: {
          title: "Wewnętrzny błąd serwera",
          description: "Wystąpił błąd podczas aktualizacji zadania",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do aktualizacji tego zadania",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt podczas aktualizacji zadania",
        },
      },
      submitButton: {
        label: "Zapisz zadanie",
        loadingText: "Zapisywanie...",
      },
      success: {
        updated: {
          title: "Zadanie zaktualizowane",
          description: "Zadanie zaktualizowane pomyślnie",
        },
      },
    },
    delete: {
      title: "Usuń zadanie Cron",
      description: "Usuń zadanie cron",
      container: {
        title: "Usuń zadanie Cron",
        description: "Usuń zadanie z systemu",
      },
      fields: {
        id: {
          label: "ID zadania",
          description: "Unikalny identyfikator zadania do usunięcia",
        },
      },
      response: {
        success: {
          title: "Sukces",
        },
        message: {
          title: "Wiadomość",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Podane ID zadania jest nieprawidłowe",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nie masz uprawnień do usunięcia tego zadania",
        },
        notFound: {
          title: "Zadanie nie znalezione",
          description: "Zadanie do usunięcia nie zostało znalezione",
        },
        internal: {
          title: "Wewnętrzny błąd serwera",
          description: "Wystąpił błąd podczas usuwania zadania",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do usunięcia tego zadania",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Nie można usunąć zadania z powodu konfliktu",
        },
      },
      success: {
        deleted: {
          title: "Zadanie usunięte",
          description: "Zadanie usunięte pomyślnie",
        },
      },
    },
    priority: {
      critical: "Krytyczny",
      high: "Wysoki",
      medium: "Średni",
      low: "Niski",
      background: "Tło",
    },
    status: {
      pending: "Oczekujące",
      running: "Uruchomione",
      completed: "Ukończone",
      failed: "Nieudane",
      timeout: "Przekroczenie czasu",
      cancelled: "Anulowane",
      skipped: "Pominięte",
      blocked: "Zablokowane",
      scheduled: "Zaplanowane",
      stopped: "Zatrzymane",
      error: "Błąd",
    },
    taskCategory: {
      development: "Programowanie",
      build: "Budowanie",
      watch: "Obserwowanie",
      generator: "Generator",
      test: "Test",
      maintenance: "Konserwacja",
      database: "Baza danych",
      system: "System",
      monitoring: "Monitorowanie",
    },
    outputMode: {
      storeOnly: "Tylko zapisz",
      notifyOnFailure: "Powiadom przy błędzie",
      notifyAlways: "Zawsze powiadamiaj",
    },
    widget: {
      notFound: "Nie znaleziono zadania",
      never: "Nigdy",
      history: "Historia",
      edit: "Edytuj",
      delete: "Usuń",
      enabled: "Włączone",
      disabled: "Wyłączone",
      identity: "Tożsamość",
      id: "ID zadania",
      routeId: "ID trasy",
      displayName: "Wyświetlana nazwa",
      version: "Wersja",
      category: "Kategoria",
      priority: "Priorytet",
      schedule: "Harmonogram",
      timezone: "Strefa czasowa",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      owner: "Właściciel",
      ownerSystem: "System",
      ownerUser: "Użytkownik",
      outputMode: "Tryb wyjścia",
      outputModes: {
        storeOnly: "Tylko zapisz",
        notifyOnFailure: "Powiadom przy błędzie",
        notifyAlways: "Zawsze powiadamiaj",
      },
      stats: {
        totalExecutions: "Łączne wykonania",
        successful: "Pomyślne",
        errors: "Błędy",
        successRate: "Wskaźnik sukcesu",
      },
      timingSection: "Czas",
      timing: {
        avgDuration: "Śr. czas trwania",
        lastDuration: "Ostatni czas trwania",
        lastRun: "Ostatnie uruchomienie",
        nextRun: "Następne uruchomienie",
        timeout: "Limit czasu",
        retries: "Ponowienia",
        retryDelay: "Opóźnienie ponowienia",
      },
      lastExecutionError: "Ostatni błąd",
      run: "Uruchom teraz",
      runSuccess: "Zadanie wykonane pomyślnie",
      running: "Uruchamianie...",
      refresh: "Odśwież",
      taskInput: {
        title: "Dane wejściowe zadania",
        loading: "Ładowanie definicji endpointu...",
        notFound: "Nie znaleziono definicji endpointu dla tego zadania",
        empty: "Brak skonfigurowanych parametrów wejściowych",
        editTitle: "Parametry wejściowe zadania",
        editDescription:
          "Skonfiguruj parametry wejściowe dla tego endpointu zadania",
      },
      scheduleAutocomplete: {
        customBadge: "Własny",
        noSchedulesFound: "Nie znaleziono harmonogramów",
        useCustomSchedule: "Użyj własnego harmonogramu",
        commonSchedules: "Popularne harmonogramy",
      },
      schedulePicker: {
        selectPlaceholder: "Wybierz harmonogram...",
        customOption: "Własny...",
        presets: {
          title: "Szybkie ustawienia",
          everyMinute: "Co minutę",
          every5m: "Co 5 minut",
          every15m: "Co 15 minut",
          every30m: "Co 30 minut",
          everyHour: "Co godzinę",
          every2h: "Co 2 godziny",
          every4h: "Co 4 godziny",
          every6h: "Co 6 godzin",
          every12h: "Co 12 godzin",
          dailyMidnight: "Codziennie o północy",
          daily6am: "Codziennie o 6 rano",
          dailyNoon: "Codziennie w południe",
          daily6pm: "Codziennie o 18:00",
          weeklyMon: "Co tydzień w poniedziałek",
          weeklySun: "Co tydzień w niedzielę",
          monthlyFirst: "1. każdego miesiąca",
        },
        custom: {
          title: "Własny harmonogram",
          repeatEvery: "Uruchom co",
          at: "O",
          onDays: "W",
          preview: "→ {{description}}",
          nextRun: "Następne: {{time}}",
          nextRunMultiple: "Następne: {{first}}, potem {{second}}",
          unit: {
            minutes: "minut",
            hours: "godzin",
            days: "dni",
            weeks: "tygodni",
            months: "miesięcy",
          },
          days: {
            mon: "Pon",
            tue: "Wt",
            wed: "Śr",
            thu: "Czw",
            fri: "Pt",
            sat: "Sob",
            sun: "Nd",
          },
          advanced: "Zaawansowany wyrażenie",
          advancedPlaceholder: "np. 0 9 * * 1-5",
          advancedInvalid: "Nieprawidłowe wyrażenie cron",
        },
      },
    },
  },
  tasks: {
    category: "Punkt końcowy API",
    tags: {
      tasks: "Tasks",
      cron: "Cron",
      scheduling: "Planowanie",
    },
    errors: {
      fetchCronTasks: "Nie udało się pobrać zadań cron",
      createCronTask: "Nie udało się utworzyć zadania cron",
      invalidTaskInput:
        "Dane wejściowe zadania nie pasują do schematu żądania endpointu",
      endpointNotFound:
        "Nie znaleziono endpointu dla podanego identyfikatora trasy",
      targetInstanceForbidden:
        "Tylko administratorzy mogą ustawiać instancję docelową dla zadań",
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
        hidden: {
          label: "Widoczność",
          description: "Filtruj według widoczności (domyślnie: tylko widoczne)",
          placeholder: "Widoczne zadania",
        },
        search: {
          label: "Szukaj",
          description:
            "Filtruj zadania według nazwy, trasy, opisu lub kategorii",
          placeholder: "Szukaj zadań...",
        },
        sort: {
          label: "Sortowanie",
          description: "Kolejność sortowania listy zadań",
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
          hidden: "Ukryte",
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
        id: {
          label: "ID zadania",
          description:
            "Unikalny, stały identyfikator tego zadania (np. 'db-health')",
          placeholder: "Wprowadź ID zadania...",
        },
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
        hidden: {
          label: "Ukryte",
          description:
            "Ukryj to zadanie w promptach systemowych AI i domyślnych listach zadań",
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
        taskInput: {
          label: "Dane wejściowe zadania",
          description: "Dane wejściowe JSON dla zadania",
        },
        runOnce: {
          label: "Uruchom raz",
          description: "Uruchom to zadanie tylko raz, a następnie je wyłącz",
        },
        targetInstance: {
          label: "Docelowa instancja",
          description:
            "ID instancji, na której zadanie ma być uruchamiane. Pozostaw puste dla wszystkich instancji.",
          placeholder: "Pozostaw puste dla wszystkich instancji",
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
        graphs: "Wykresy",
        history: "Historia",
        queue: "Kolejka",
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
        visible: "Widoczne",
        hiddenOnly: "Ukryte",
        allTasks: "Wszystkie zadania",
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
        hiddenBadge: "Ukryte",
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
        noTasks: "Brak zadań cron",
        noTasksDesc: "Utwórz swoje pierwsze zadanie cron",
        noMatches: "Żadne zadania nie pasują do filtrów",
        noMatchesDesc:
          "Spróbuj dostosować kryteria wyszukiwania lub filtrowania",
        clearFilters: "Wyczyść filtry",
      },
    },
  },
  errors: {
    fetch_all_failed: "Nie udało się pobrać zadań cron",
    fetch_by_id_failed: "Nie udało się pobrać zadania cron według ID",
    fetch_by_name_failed: "Nie udało się pobrać zadania cron według nazwy",
    create_failed: "Nie udało się utworzyć zadania cron",
    update_failed: "Nie udało się zaktualizować zadania cron",
    delete_failed: "Nie udało się usunąć zadania cron",
    not_found: "Zadanie cron nie zostało znalezione",
    execution_create_failed: "Nie udało się utworzyć wykonania zadania cron",
    execution_update_failed:
      "Nie udało się zaktualizować wykonania zadania cron",
    execution_not_found: "Wykonanie zadania cron nie zostało znalezione",
    executions_fetch_failed: "Nie udało się pobrać wykonań zadań cron",
    recent_executions_fetch_failed:
      "Nie udało się pobrać ostatnich wykonań cron",
    schedules_fetch_failed: "Nie udało się pobrać harmonogramów zadań cron",
    schedule_update_failed:
      "Nie udało się zaktualizować harmonogramu zadania cron",
    schedule_not_found: "Harmonogram zadania cron nie został znaleziony",
    statistics_fetch_failed: "Nie udało się pobrać statystyk zadań cron",
  },
};
