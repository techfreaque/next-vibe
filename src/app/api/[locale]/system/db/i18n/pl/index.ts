import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operacje bazodanowe",
  generate: {
    category: "Operacje bazodanowe",
    tag: "migracja",
    post: {
      title: "Generuj migracje",
      description: "Generuj pliki migracji Drizzle ze zmian schematu",
      form: {
        title: "Konfiguracja generowania",
        description: "Skonfiguruj opcje generowania migracji",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        network: {
          title: "Generowanie nie powiodło się",
          description: "drizzle-kit generate nie powiodło się",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        forbidden: {
          title: "Zabronione",
          description: "Niewystarczające uprawnienia",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasoby nie zostały znalezione",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        conflict: { title: "Konflikt", description: "Wykryto konflikt" },
      },
      success: {
        title: "Generowanie zakończone sukcesem",
        description: "Pliki migracji wygenerowane pomyślnie",
      },
    },
    fields: {
      success: { title: "Status sukcesu" },
      output: { title: "Wyjście" },
      duration: { title: "Czas trwania (ms)" },
    },
  },
  migrate: {
    category: "Operacje bazodanowe",

    tag: "migracja",
    post: {
      title: "Migracja bazy danych",
      description: "Uruchom migracje bazy danych",
      form: {
        title: "Konfiguracja migracji",
        description: "Skonfiguruj opcje migracji bazy danych",
      },
      response: {
        title: "Odpowiedź migracji",
        description: "Wyniki operacji migracji",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry migracji",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Operacja migracji nie powiodła się",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja do operacji migracji",
        },
        forbidden: {
          title: "Zabronione",
          description: "Niewystarczające uprawnienia do operacji migracji",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasoby migracji nie zostały znalezione",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera podczas migracji",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas migracji",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt migracji",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas operacji migracji",
        },
      },
      success: {
        title: "Migracja zakończona sukcesem",
        description: "Migracja bazy danych zakończona pomyślnie",
      },
    },
    fields: {
      generate: {
        title: "Generuj migracje",
        description: "Generuj nowe pliki migracji ze zmian schematu",
      },
      redo: {
        title: "Ponów ostatnią migrację",
        description: "Wycofaj i ponownie zastosuj ostatnią migrację",
      },
      schema: {
        title: "Schemat bazy danych",
        description: "Docelowy schemat bazy danych (domyślnie: public)",
      },
      success: {
        title: "Status sukcesu",
      },
      migrationsRun: {
        title: "Wykonane migracje",
      },
      migrationsGenerated: {
        title: "Wygenerowane migracje",
      },
      output: {
        title: "Wyjście",
      },
      duration: {
        title: "Czas trwania (ms)",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry migracji",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Operacja migracji nie powiodła się",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do operacji migracji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia do operacji migracji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby migracji nie zostały znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas migracji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas migracji",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt migracji",
      },
      generationFailed: "Nie udało się wygenerować migracji: {{message}}",
      generationFailedWithCode:
        "Generowanie migracji nie powiodło się z kodem {{code}}: {{output}}",
      migrationFailed: "Nie udało się uruchomić migracji: {{message}}",
    },
    success: {
      title: "Migracja zakończona sukcesem",
      description: "Migracja bazy danych zakończona pomyślnie",
    },
    status: {
      pending: "Oczekujące",
      running: "W trakcie",
      success: "Sukces",
      failed: "Niepowodzenie",
      rolledBack: "Wycofane",
    },
    direction: {
      up: "W górę",
      down: "W dół",
    },
    environment: {
      development: "Rozwój",
      staging: "Staging",
      production: "Produkcja",
    },
    messages: {
      dryRun: "PRÓBA: Uruchomiłoby migracje",
      generatingMigrations: "Generowanie migracji:\n{{output}}\n",
      noMigrationsFolder: "Nie znaleziono folderu migracji",
      noMigrationFiles: "Nie znaleziono plików migracji",
      executedMigrations: "Wykonano {{count}} migracji pomyślnie",
      redoNotImplemented: "Funkcja ponawiania zostałaby tu zaimplementowana",
      repairCompleted: "Naprawa migracji zakończona pomyślnie",
      repairDryRun: "Próba: Naprawa migracji zostałaby wykonana",
      trackingReset: "Śledzenie migracji zresetowane pomyślnie",
      productionCompleted: "Migracje produkcyjne zakończone pomyślnie",
      productionWithBackup: " (z kopią zapasową)",
      syncCompleted:
        "Synchronizacja migracji zakończona pomyślnie ({{direction}})",
      failedToGenerate: "Nie udało się wygenerować migracji: {{error}}",
      failedToExecute: "Nie udało się wykonać migracji: {{error}}",
      failedToRedo: "Nie udało się ponowić migracji: {{error}}",
    },
  },
  ping: {
    category: "Operacje bazodanowe",
    tag: "baza danych",
    post: {
      title: "Ping bazy danych",
      description: "Sprawdź połączenie i stan bazy danych",
      form: {
        title: "Konfiguracja ping",
        description: "Skonfiguruj parametry pingu bazy danych",
      },
      response: {
        title: "Odpowiedź",
        description: "Dane odpowiedzi ping",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja do operacji bazodanowych",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania ping",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera podczas pingu bazy danych",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas pingu bazy danych",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas łączenia z bazą danych",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony - niewystarczające uprawnienia",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób bazy danych nie został znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych podczas operacji",
        },
      },
      success: {
        title: "Ping bazy danych zakończony sukcesem",
        description: "Pomyślnie połączono z bazą danych",
      },
    },
    fields: {
      silent: {
        title: "Tryb cichy",
        description: "Wykonaj ping bez komunikatów wyjściowych",
      },
      keepConnectionOpen: {
        title: "Pozostaw połączenie otwarte",
        description: "Pozostaw połączenie z bazą danych otwarte po pingu",
      },
      success: {
        title: "Status sukcesu",
        content: "Sukces",
      },
      isAccessible: {
        title: "Baza danych dostępna",
        content: "Dostępna",
      },
      output: {
        title: "Komunikat wyjściowy",
        content: "Wyjście",
      },
      connectionInfo: {
        title: "Informacje o połączeniu",
        totalConnections: {
          content: "Wszystkie połączenia",
        },
        idleConnections: {
          content: "Bezczynne połączenia",
        },
        waitingClients: {
          content: "Oczekujący klienci",
        },
      },
    },
    status: {
      success: "Sukces",
      failed: "Niepowodzenie",
      timeout: "Przekroczenie czasu",
      error: "Błąd",
    },
    connectionType: {
      primary: "Główny",
      replica: "Replika",
      cache: "Pamięć podręczna",
    },
  },
  seed: {
    category: "Operacje bazodanowe",

    tag: "seed",
    post: {
      title: "Zasiew bazy danych",
      description: "Wypełnij bazę danych danymi",
      form: {
        title: "Konfiguracja zasiewu",
        description: "Skonfiguruj parametry zasiewu",
      },
      response: {
        title: "Odpowiedź zasiewu",
        description: "Wyniki operacji zasiewu bazy danych",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja do zasiewu bazy danych",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Podano nieprawidłowe parametry zasiewu",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera podczas zasiewu",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Operacja zasiewu bazy danych nie powiodła się",
        },
        database: {
          title: "Błąd bazy danych",
          description: "Wystąpił błąd bazy danych podczas zasiewu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas zasiewu",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas zasiewu",
        },
        forbidden: {
          title: "Zabronione",
          description: "Niewystarczające uprawnienia do zasiewu bazy danych",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasoby zasiewu nie zostały znalezione",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt danych podczas zasiewu",
        },
      },
      success: {
        title: "Baza danych zasilona",
        description: "Zasiew bazy danych zakończony pomyślnie",
      },
    },
    fields: {
      environment: {
        title: "Środowisko",
        description: "Docelowe środowisko zasiewu (dev, test, prod)",
      },
      success: {
        title: "Status sukcesu",
      },
      seedsExecuted: {
        title: "Wykonane seedy",
      },
      collections: {
        title: "Kolekcje seedów",
        item: {
          title: "Kolekcja",
        },
        name: {
          title: "Nazwa kolekcji",
        },
        status: {
          title: "Status",
        },
        recordsCreated: {
          title: "Utworzone rekordy",
        },
      },
      totalRecords: {
        title: "Wszystkie rekordy",
      },
      duration: {
        title: "Czas trwania (ms)",
      },
    },
  },
  sql: {
    category: "Operacje bazodanowe",

    tag: "sql",
    post: {
      title: "Wykonaj SQL",
      description: "Wykonaj zapytania SQL na bazie danych",
      form: {
        title: "Konfiguracja zapytania SQL",
        description: "Skonfiguruj parametry zapytania SQL",
      },
      response: {
        title: "Odpowiedź zapytania",
        description: "Wyniki wykonania zapytania SQL",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja do wykonania SQL",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe zapytanie SQL lub parametry",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera podczas wykonywania SQL",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Wykonanie zapytania SQL nie powiodło się",
        },
        database: {
          title: "Błąd bazy danych",
          description:
            "Wystąpił błąd bazy danych podczas wykonywania zapytania",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas wykonywania SQL",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas wykonywania SQL",
        },
        forbidden: {
          title: "Zabronione",
          description: "Niewystarczające uprawnienia do wykonania SQL",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasoby SQL nie zostały znalezione",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt SQL",
        },
      },
      success: {
        title: "Zapytanie wykonane",
        description: "Zapytanie SQL wykonane pomyślnie",
      },
    },
    fields: {
      query: {
        title: "Zapytanie SQL",
        description: "Zapytanie SQL do wykonania",
      },
      queryFile: {
        title: "Ścieżka pliku zapytania",
        description: "Ścieżka do pliku SQL do wykonania",
        placeholder: "/ścieżka/do/zapytania.sql",
      },
      dryRun: {
        title: "Próbny przebieg",
        description: "Podgląd zapytania bez wykonywania",
      },
      verbose: {
        title: "Szczegółowe wyjście",
        description: "Pokaż szczegółowe informacje o zapytaniu",
      },
      limit: {
        title: "Limit wierszy",
        description: "Maksymalna liczba wierszy do zwrócenia (1-1000)",
      },
      success: {
        title: "Status sukcesu",
      },
      output: {
        title: "Wyjście",
      },
      results: {
        title: "Wyniki zapytania",
      },
      rowCount: {
        title: "Liczba wierszy",
      },
      queryType: {
        title: "Typ zapytania",
      },
    },
  },
  studio: {
    category: "Operacje bazodanowe",

    tag: "studio",
    post: {
      title: "Studio Bazy Danych",
      description:
        "Otwórz studio bazy danych do wizualnego zarządzania bazą danych",
      form: {
        title: "Konfiguracja Studio",
        description: "Skonfiguruj parametry studio bazy danych",
      },
      response: {
        title: "Odpowiedź Studio",
        description: "Wyniki uruchomienia studio bazy danych",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja do studio bazy danych",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry studio",
        },
        server: {
          title: "Błąd serwera",
          description: "Wewnętrzny błąd serwera podczas uruchamiania studio",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Uruchomienie studio bazy danych nie powiodło się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas uruchamiania studio",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas uruchamiania studio",
        },
        forbidden: {
          title: "Zabronione",
          description: "Niewystarczające uprawnienia do studio bazy danych",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasoby studio nie zostały znalezione",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt portu studio",
        },
      },
      success: {
        title: "Studio uruchomione",
        description: "Studio bazy danych uruchomione pomyślnie",
      },
    },
    fields: {
      port: {
        title: "Port",
        description: "Numer portu dla studio bazy danych (1024-65535)",
      },
      openBrowser: {
        title: "Otwórz przeglądarkę",
        description: "Automatycznie otwórz studio w przeglądarce",
      },
      success: {
        title: "Status sukcesu",
      },
      url: {
        title: "URL Studio",
      },
      portUsed: {
        title: "Rzeczywiście używany port",
      },
      output: {
        title: "Wyjście uruchomienia",
      },
      duration: {
        title: "Czas trwania uruchomienia",
      },
    },
  },
  utils: {
    category: "Operacje bazodanowe",

    dockerOperations: {
      title: "Operacje Docker",
      description: "Wykonywanie poleceń Docker i zarządzanie kontenerami",
      category: "Docker",
      tags: {
        docker: "Docker",
        utils: "Narzędzia",
        dockeroperations: "Operacje Docker",
      },
      container: {
        title: "Operacje Docker",
        description: "Wykonywanie poleceń Docker z właściwą obsługą błędów",
      },
      fields: {
        command: {
          label: "Polecenie Docker",
          description: "Polecenie Docker do wykonania",
          placeholder: "docker ps",
        },
        options: {
          label: "Opcje wykonania",
          description: "Opcje konfiguracji dla wykonania polecenia",
          placeholder: "Skonfiguruj opcje timeout i logowania",
        },
      },
      response: {
        success: {
          label: "Polecenie pomyślne",
        },
        output: {
          label: "Wynik polecenia",
        },
        error: {
          label: "Szczegóły błędu",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry polecenia Docker",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie dla operacji Docker",
        },
        forbidden: {
          title: "Zabronione",
          description: "Niewystarczające uprawnienia dla operacji Docker",
        },
        internal: {
          title: "Błąd Docker",
          description: "Wykonanie polecenia Docker nie powiodło się",
        },
        timeout: {
          title: "Timeout polecenia",
          description: "Polecenie Docker przekroczyło limit czasu",
        },
        executionFailed: {
          title: "Wykonanie nie powiodło się",
          description: "Wykonanie polecenia Docker nie powiodło się",
        },
        composeDownFailed: {
          title: "Compose Down nie powiodło się",
          description: "Operacja Docker Compose down nie powiodła się",
        },
        composeUpFailed: {
          title: "Compose Up nie powiodło się",
          description: "Operacja Docker Compose up nie powiodła się",
        },
      },
      success: {
        title: "Polecenie Docker pomyślne",
        description: "Polecenie Docker wykonane pomyślnie",
      },
      messages: {
        executingCommand: "Wykonywanie polecenia Docker: {command}",
        timeoutError:
          "Polecenie Docker przekroczyło limit czasu po {timeout}ms: {command}",
        commandFailed:
          "Polecenie Docker nie powiodło się z kodem {code}: {command}",
        executionFailed: "Nie udało się wykonać polecenia Docker: {command}",
        commandError: "Błąd polecenia Docker: {error}",
      },
    },
    title: "Narzędzia bazy danych",
    description: "Funkcje pomocnicze do operacji bazy danych",
    tag: "utils",
    includeDetails: {
      title: "Uwzględnij szczegóły",
      description: "Uwzględnij szczegółowe informacje w odpowiedzi",
    },
    checkConnections: {
      title: "Sprawdź połączenia",
      description: "Sprawdź status połączenia z bazą danych",
    },
    status: {
      title: "Status zdrowia",
    },
    timestamp: {
      title: "Znacznik czasu",
    },
    connections: {
      title: "Status połączenia",
      primary: "Połączenie główne",
      replica: "Połączenie repliki",
    },
    details: {
      title: "Szczegóły bazy danych",
      version: "Wersja",
      uptime: "Czas działania (sekundy)",
      activeConnections: "Aktywne połączenia",
      maxConnections: "Maksymalna liczba połączeń",
    },
    errors: {
      health_check_failed: "Sprawdzenie stanu bazy danych nie powiodło się",
      connection_failed: "Połączenie z bazą danych nie powiodło się",
      stats_failed: "Nie udało się pobrać statystyk bazy danych",
      docker_check_failed: "Sprawdzenie dostępności Docker nie powiodło się",
      reset_failed: "Operacja resetowania bazy danych nie powiodła się",
      manage_failed: "Operacja zarządzania bazą danych nie powiodła się",
      reset_operation_failed: "Operacja resetowania nie powiodła się",
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry narzędzi bazy danych",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie dla narzędzi bazy danych",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Operacja narzędzia bazy danych nie powiodła się",
      },
    },
    success: {
      title: "Narzędzia bazy danych pomyślne",
      description: "Operacje narzędzi bazy danych zakończone pomyślnie",
    },
    docker: {
      executing_command: "Wykonywanie polecenia Docker: {{command}}",
      command_timeout:
        "Polecenie Docker przekroczyło czas {{timeout}}ms: {{command}}",
      command_failed:
        "Polecenie Docker nie powiodło się z kodem {{code}}: {{command}}",
      execution_failed: "Nie udało się wykonać polecenia Docker: {{command}}",
      command_error: "Błąd polecenia Docker: {{error}}",
      stopping_containers: "Zatrzymywanie kontenerów Docker...",
      starting_containers: "Uruchamianie kontenerów Docker...",
    },
  },
};
