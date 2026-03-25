import { translations as cronTranslations } from "../../cron/i18n/pl";
import { translations as pulseTranslations } from "../../pulse/i18n/pl";
import { translations as unifiedRunnerTranslations } from "../../unified-runner/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie zadaniami",
  tags: {
    tasks: "Zadania",
  },
  type: {
    cron: "Zadanie Cron",
    side: "Zadanie w tle",
    task_runner: "Task Runner",
  },
  priority: {
    critical: "Krytyczny",
    high: "Wysoki",
    medium: "Średni",
    low: "Niski",
    background: "Tło",
    filter: {
      all: "Wszystkie priorytety",
      highAndAbove: "Wysoki i wyżej",
      mediumAndAbove: "Średni i wyżej",
    },
  },
  status: {
    pending: "Oczekujący",
    running: "Uruchomiony",
    completed: "Ukończony",
    failed: "Nieudany",
    timeout: "Przekroczenie czasu",
    cancelled: "Anulowany",
    skipped: "Pominięty",
    blocked: "Zablokowany",
    scheduled: "Zaplanowany",
    stopped: "Zatrzymany",
    error: "Błąd",
    filter: {
      all: "Wszystkie statusy",
      active: "Aktywny",
      error: "Stany błędów",
    },
  },
  taskCategory: {
    development: "Rozwój",
    build: "Budowanie",
    watch: "Obserwowanie",
    generator: "Generator",
    test: "Test",
    maintenance: "Konserwacja",
    database: "Baza danych",
    system: "System",
    monitoring: "Monitorowanie",
    leadManagement: "Zarządzanie leadami",
  },
  enabledFilter: {
    all: "Wszystkie",
    enabled: "Włączone",
    disabled: "Wyłączone",
  },
  hiddenFilter: {
    visible: "Widoczne",
    hidden: "Ukryte",
    all: "Wszystkie",
  },
  sort: {
    asc: "Rosnąco",
    desc: "Malejąco",
  },
  pulse: {
    health: {
      healthy: "Zdrowy",
      warning: "Ostrzeżenie",
      critical: "Krytyczny",
      unknown: "Nieznany",
    },
    execution: {
      success: "Sukces",
      failure: "Niepowodzenie",
      timeout: "Przekroczenie czasu",
      cancelled: "Anulowany",
      pending: "Oczekujący",
    },
  },
  cron: {
    frequency: {
      everyMinute: "co minutę",
      everyMinutes: "co {interval} minut",
      everyHour: "co godzinę",
      everyDays: "codziennie",
      hourly: "co godzinę",
    },
    days: {
      sunday: "niedziela",
      monday: "poniedziałek",
      tuesday: "wtorek",
      wednesday: "środa",
      thursday: "czwartek",
      friday: "piątek",
      saturday: "sobota",
    },
    common: {
      dailyAtMidnight: "codziennie o północy",
      dailyAtNoon: "codziennie w południe",
      weeklyOnSunday: "co tydzień w niedzielę",
      monthlyOnFirst: "co miesiąc 1. dnia",
      everyFiveMinutes: "co 5 minut",
      everyThreeMinutes: "co 3 minuty",
      everyOneMinutes: "co minutę",
      everyTenMinutes: "co 10 minut",
      everyFifteenMinutes: "co 15 minut",
      everyThirtyMinutes: "co 30 minut",
    },
    patterns: {
      everyIntervalMinutes: "co {interval} minut",
      everyIntervalMinutesStarting:
        "co {interval} minut począwszy od minuty {start}",
      atMinutes: "o minutach {minutes}",
      fromMinuteToMinute: "od minuty {from} do {to}",
      atMinute: "o minucie {minute}",
      everyIntervalHours: "co {interval} godzin",
      everyIntervalHoursStarting:
        "co {interval} godzin począwszy od godziny {start}",
      atHours: "o godzinach {hours}",
      fromHourToHour: "od godziny {from} do {to}",
      atHour: "o godzinie {hour}",
    },
    calendar: {
      onDays: "w dniach {days}",
      onDay: "w dniu {day}",
      inMonths: "w {months}",
      inMonth: "w {month}",
      onWeekdays: "w {weekdays}",
      fromWeekdayToWeekday: "od {from} do {to}",
      onWeekday: "w {weekday}",
    },
    timezone: "w {timezone}",
    time: {
      midnight: "północ",
      noon: "południe",
      hourAm: "{hour}",
      hourPm: "{hour}",
      hourMinuteAm: "{hour}:{minute}",
      hourMinutePm: "{hour}:{minute}",
    },
    weekdays: {
      sunday: "niedziela",
      monday: "poniedziałek",
      tuesday: "wtorek",
      wednesday: "środa",
      thursday: "czwartek",
      friday: "piątek",
      saturday: "sobota",
    },
    months: {
      january: "styczeń",
      february: "luty",
      march: "marzec",
      april: "kwiecień",
      may: "maj",
      june: "czerwiec",
      july: "lipiec",
      august: "sierpień",
      september: "wrzesień",
      october: "październik",
      november: "listopad",
      december: "grudzień",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "Nie udało się pobrać zadań Cron",
    createCronTask: "Nie udało się utworzyć zadania Cron",
    updateCronTask: "Nie udało się zaktualizować zadania Cron",
    deleteCronTask: "Nie udało się usunąć zadania Cron",
    fetchCronTaskHistory: "Nie udało się pobrać historii zadań Cron",
    fetchCronTaskStats: "Nie udało się pobrać statystyk zadań Cron",
    fetchCronStatus: "Nie udało się pobrać statusu systemu Cron",
    cronTaskNotFound: "Zadanie Cron nie znalezione",

    // Unified Runner errors
    startTaskRunner: "Nie udało się uruchomić Task Runnera",
    stopTaskRunner: "Nie udało się zatrzymać Task Runnera",
    getTaskRunnerStatus: "Nie udało się pobrać statusu Task Runnera",
    executeCronTask: "Nie udało się wykonać zadania Cron",

    // Pulse errors
    executePulse: "Nie udało się wykonać Pulse",
    fetchPulseStatus: "Nie udało się pobrać statusu Pulse",
    pulseExecutionFailed: "Wykonanie Pulse nie powiodło się",
    pulseInternalError: "Wewnętrzny błąd systemu Pulse",

    // Validation errors
    invalidTaskInput:
      "Dane wejściowe zadania nie pasują do schematu żądania endpointu",
    endpointNotFound:
      "Nie znaleziono endpointu dla podanego identyfikatora trasy",

    // Repository errors
    repositoryNotFound: "Zasób nie znaleziony",
    repositoryInternalError: "Wystąpił błąd wewnętrzny",
    repositoryGetTaskForbidden:
      "Nie masz uprawnień do wyświetlenia tego zadania",
    repositoryUpdateTaskForbidden:
      "Nie masz uprawnień do aktualizacji tego zadania",
    repositoryDeleteTaskForbidden:
      "Nie masz uprawnień do usunięcia tego zadania",

    // Task sync errors
    taskSyncListFailed: "Nie udało się wylistować zadań do synchronizacji",
    taskSyncSyncFailed:
      "Nie udało się zsynchronizować zadań z zdalnego serwera",
  },
  common: {
    cronRepositoryTaskUpdateFailed: "Nie udało się zaktualizować zadania cron",
    cronRepositoryTaskDeleteFailed: "Nie udało się usunąć zadania cron",
    cronRepositoryExecutionCreateFailed:
      "Nie udało się utworzyć wykonania zadania cron",
    cronRepositoryExecutionUpdateFailed:
      "Nie udało się zaktualizować wykonania zadania cron",
    cronRepositoryExecutionsFetchFailed:
      "Nie udało się pobrać wykonań zadań cron",
    cronRepositoryRecentExecutionsFetchFailed:
      "Nie udało się pobrać ostatnich wykonań zadań cron",
    cronRepositorySchedulesFetchFailed:
      "Nie udało się pobrać harmonogramów zadań cron",
    cronRepositoryScheduleUpdateFailed:
      "Nie udało się zaktualizować harmonogramu zadania cron",
    cronRepositoryStatisticsFetchFailed:
      "Nie udało się pobrać statystyk zadań cron",
  },
  outputMode: {
    storeOnly: "Tylko zapisz",
    notifyOnFailure: "Powiadom przy błędzie",
    notifyAlways: "Zawsze powiadamiaj",
  },
  dbHealthCheck: {
    name: "db-health-check",
    description: "Sprawdza stan połączenia z bazą danych co minutę",
  },
  pulseRunner: {
    name: "pulse-runner",
    description:
      "Wywołuje repozytorium pulse raz na minutę, aby uruchamiać zaplanowane zadania",
  },
  devWatcher: {
    name: "dev-file-watcher",
    description:
      "Obserwuje zmiany plików i uruchamia generatory w trybie deweloperskim",
  },
  dbHealth: {
    tag: "Baza danych",
    post: {
      title: "Sprawdzenie zdrowia DB",
      description: "Sprawdź połączenie z bazą danych",
      container: {
        title: "Zdrowie bazy danych",
        description: "Sprawdź, czy połączenie z bazą danych jest zdrowe",
      },
      response: {
        healthy: "Zdrowy",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        server: {
          title: "Błąd serwera",
          description: "Sprawdzenie zdrowia bazy danych nie powiodło się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
      },
      success: {
        title: "DB zdrowa",
        description: "Połączenie z bazą danych jest zdrowe",
      },
    },
  },
  taskSync: {
    name: "task-sync",
    description: "Regularnie pobiera nowe zadania ze zdalnej instancji Thea",
    post: {
      title: "Synchronizuj zadania",
      description: "Synchronizuj zadania ze zdalnej instancji Thea",
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Synchronizacja zadań nie powiodła się",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie znaleziony",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Wykryto niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt",
        },
      },
      success: {
        title: "Zadania zsynchronizowane",
        description: "Zadania zsynchronizowane pomyślnie",
      },
    },
    pull: {
      post: {
        title: "Pobierz zadania",
        description: "Pobierz zadania ze zdalnej instancji Thea",
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry żądania",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Wymagane uwierzytelnienie",
          },
          internal: {
            title: "Błąd wewnętrzny",
            description: "Pobieranie zadań nie powiodło się",
          },
          forbidden: {
            title: "Zabronione",
            description: "Odmowa dostępu",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Zasób nie znaleziony",
          },
          network: {
            title: "Błąd sieci",
            description: "Wystąpił błąd sieci",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsaved: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt",
          },
        },
        success: {
          title: "Zadania pobrane",
          description: "Zadania pobrane pomyślnie",
        },
      },
    },
  },
  completeTask: {
    post: {
      title: "Zakończ zadanie",
      description:
        "Oznacza zadanie cron jako ukończone lub nieudane i wysyła wynik do instancji źródłowej. Narzędzie MCP tylko dla dev, przeznaczone do interaktywnych sesji Claude Code. Gdy Thea tworzy zadanie dla Hermesa, Claude Code wywołuje to narzędzie po potwierdzeniu przez użytkownika.",
      fields: {
        taskId: {
          title: "ID zadania",
          description:
            "ID zadania cron w bazie danych do oznaczenia jako ukończone.",
        },
        status: {
          title: "Status",
          description:
            "Status końcowy: 'completed' dla sukcesu, 'failed' dla niepowodzenia, 'cancelled' do anulowania.",
        },
        summary: {
          title: "Podsumowanie",
          description:
            "Krótki opis tego, co zostało zrobione lub dlaczego się nie powiodło.",
        },
        output: {
          title: "Dane wyjściowe",
          description:
            "Opcjonalne dane strukturalne (pary klucz-wartość) dołączane do wyniku wykonania.",
        },
        completed: {
          title: "Ukończone",
          description: "Czy zadanie zostało pomyślnie oznaczone jako wykonane.",
        },
        pushedToRemote: {
          title: "Wysłane do zdalnej instancji",
          description:
            "Czy ukończenie zostało pomyślnie zgłoszone do instancji źródłowej.",
        },
        updatedAt: {
          title: "Zaktualizowano",
          description: "Znacznik czasu aktualizacji statusu zadania.",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zadania lub wartość statusu",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        internal: {
          title: "Nie udało się zakończyć",
          description: "Nie udało się oznaczyć zadania jako ukończone",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Zadanie nie znalezione",
          description: "Nie znaleziono zadania o podanym ID",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się wysłać ukończenia do zdalnej instancji",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Wykryto niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Zadanie nie jest w stanie umożliwiającym ukończenie",
        },
      },
      success: {
        title: "Zadanie ukończone",
        description:
          "Zadanie oznaczone jako wykonane i wynik wysłany do instancji źródłowej",
      },
    },
  },
  taskReport: {
    post: {
      title: "Zgłoś wynik zadania",
      description:
        "Przyjmuje wyniki wykonania ze zdalnej instancji. Wywoływane przez instancje dev do raportowania ukończenia zadań do instancji prod.",
      fields: {
        apiKey: {
          title: "Klucz API",
          description: "Wspólny sekret do uwierzytelniania instancji.",
        },
        taskId: {
          title: "ID zadania",
          description: "Unikalny identyfikator ukończonego zadania.",
        },
        executionId: {
          title: "ID wykonania",
          description: "Unikalny identyfikator wykonania do deduplikacji.",
        },
        status: {
          title: "Status",
          description: "Końcowy status wykonania.",
        },
        durationMs: {
          title: "Czas trwania (ms)",
          description: "Całkowity czas wykonania w milisekundach.",
        },
        summary: {
          title: "Podsumowanie",
          description: "Czytelne podsumowanie wyniku wykonania.",
        },
        error: {
          title: "Błąd",
          description: "Komunikat błędu, jeśli zadanie nie powiodło się.",
        },
        serverTimezone: {
          title: "Strefa czasowa serwera",
          description:
            "Strefa czasowa IANA serwera wykonującego (np. Europe/Vienna).",
        },
        executedByInstance: {
          title: "Wykonane przez",
          description: "ID instancji, która wykonała zadanie (np. hermes).",
        },
        output: {
          title: "Wynik",
          description: "Strukturalny wynik wykonania.",
        },
        startedAt: {
          title: "Rozpoczęto",
          description: "Znacznik czasu ISO rozpoczęcia wykonania.",
        },
        processed: {
          title: "Przetworzone",
          description: "Czy raport został zaakceptowany i zastosowany.",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe dane raportu",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nieprawidłowy klucz API",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Nie udało się przetworzyć raportu",
        },
        forbidden: {
          title: "Zabronione",
          description: "Odmowa dostępu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zadanie nie znalezione na tej instancji",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Wykryto niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt",
        },
      },
      success: {
        title: "Raport zaakceptowany",
        description: "Wynik wykonania zastosowany do rekordu zadania",
      },
    },
  },
  waitForTask: {
    post: {
      title: "Czekaj na zadanie",
      description:
        "Czeka na oczekujące zadanie w tle. Zwraca wynik natychmiast jeśli już ukończone, lub zatrzymuje strumień AI do czasu zakończenia zadania.",
      fields: {
        taskId: {
          title: "ID zadania",
          description: "ID zadania, na które ma czekać.",
        },
        status: {
          title: "Status",
          description: "Aktualny status zadania.",
        },
        result: {
          title: "Wynik",
          description: "Dane wynikowe zadania (obecne gdy ukończone).",
        },
        waiting: {
          title: "Oczekiwanie",
          description: "True gdy strumień jest zatrzymany czekając na zadanie.",
        },
        originalToolName: {
          title: "Narzędzie",
          description: "Oryginalne wykonane narzędzie.",
        },
        originalArgs: {
          title: "Argumenty",
          description: "Argumenty wejściowe oryginalnego narzędzia.",
        },
      },
      widget: {
        noToolName: "Brak nazwy narzędzia.",
        resolving: "Rozwiązywanie narzędzia...",
        unknownTool: "Nieznane narzędzie: {{toolName}}",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zadania",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Nie udało się zarejestrować oczekującego",
        },
        forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
        notFound: {
          title: "Zadanie nie znalezione",
          description: "Nie znaleziono zadania o tym ID",
        },
        network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Wykryto niezapisane zmiany",
        },
        conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      },
      success: {
        title: "Wynik zadania gotowy",
        description: "Zadanie ukończone lub oczekujący zarejestrowany",
      },
      status: {
        waiting: "Oczekiwanie na zadanie...",
        complete: "Zadanie ukończone",
      },
    },
  },
  errorMonitor: {
    name: "error-monitor",
    description:
      "Skanuje wątki czatu co 3 godziny w poszukiwaniu wzorców błędów",
    tag: "Monitoring",
    post: {
      title: "Monitor błędów",
      description:
        "Monitorowanie błędów z zachowaniem prywatności - skanuje wiadomości w poszukiwaniu wzorców błędów bez czytania treści",
      container: {
        title: "Wyniki skanowania błędów",
        description: "Zagregowane wzorce błędów z wiadomości czatu",
      },
      response: {
        errorsFound: "Znalezione błędy",
        threadsScanned: "Przeskanowane wątki",
        scanWindowFrom: "Początek okna skanowania",
        scanWindowTo: "Koniec okna skanowania",
        patternType: "Typ błędu",
        patternCount: "Liczba",
        patternThreadIds: "ID wątków",
        patternModel: "Model",
        patternTool: "Narzędzie",
        patternFirstSeen: "Pierwszy raz",
        patternLastSeen: "Ostatni raz",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagana autoryzacja",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Odmowa dostępu",
        },
        server: {
          title: "Błąd serwera",
          description: "Skanowanie błędów nie powiodło się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
      },
      success: {
        title: "Skanowanie zakończone",
        description: "Skanowanie błędów zakończone pomyślnie",
      },
    },
    cleanup: {
      name: "error-logs-cleanup",
      description:
        "Usuwa logi błędów starsze niż 6 miesięcy i ogranicza do 100K wpisów",
      post: {
        title: "Czyszczenie logów błędów",
        description:
          "Usuwanie starych wpisów logów błędów (czasowo + ilościowo) aby utrzymać bazę danych w dobrej kondycji",
        container: {
          title: "Wyniki czyszczenia",
          description: "Liczba usuniętych logów błędów",
        },
        response: {
          deletedCount: "Usunięte wpisy",
          deletedByTime: "Usunięte czasowo",
          deletedByCount: "Usunięte przez limit ilości",
          retentionDays: "Dni przechowywania",
          maxRows: "Maksymalna liczba wpisów",
        },
        success: {
          title: "Czyszczenie zakończone",
          description: "Stare logi błędów usunięte pomyślnie",
        },
      },
    },
  },
  csvProcessor: {
    description: "Przetwarza zadania importu CSV w partiach",
  },
  imapSync: {
    description: "Automatycznie synchronizuje konta IMAP, foldery i wiadomości",
  },
  newsletterUnsubscribeSync: {
    description: "Synchronizuje statusy leadów dla wypisań z newslettera",
  },
  cronSystem: cronTranslations,
  pulseSystem: pulseTranslations,
  unifiedRunner: unifiedRunnerTranslations,
};
