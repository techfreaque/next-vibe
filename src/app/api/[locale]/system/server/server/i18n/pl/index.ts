import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Serwer systemowy",
  enum: {
    processStatus: {
      running: "Działa",
      stopped: "Zatrzymany",
      error: "Błąd",
    },
    environment: {
      development: "Rozwój",
      production: "Produkcja",
      testing: "Testowanie",
      staging: "Staging",
    },
    mode: {
      development: "Rozwój",
      production: "Produkcja",
    },
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  build: {
    category: "Zarządzanie serwerem",
    tags: {
      build: "Build",
    },
    post: {
      title: "Zbuduj aplikację",
      description: "Zbuduj aplikację do wdrożenia produkcyjnego",
      form: {
        title: "Konfiguracja budowania",
        description: "Skonfiguruj opcje i ustawienia budowania",
      },
      fields: {
        package: {
          title: "Zbuduj pakiet",
          description: "Zbuduj pakiet przed aplikacją",
        },
        skipNextCommand: {
          title: "Pomiń polecenie Next.js",
          description: "Pomiń uruchamianie polecenia budowania Next.js",
        },
        target: {
          title: "Cel budowania",
          description: "Określ cel budowania (np. 'production', 'staging')",
        },
        skipGeneration: {
          title: "Pomiń generowanie kodu",
          description:
            "Pomiń generowanie punktów końcowych API podczas budowania",
        },
        generate: {
          title: "Generuj kod",
          description: "Uruchom generowanie kodu podczas budowania",
        },
        generateEndpoints: {
          title: "Generuj endpointy",
          description: "Generuj pliki endpointów API podczas budowania",
        },
        generateSeeds: {
          title: "Generuj seedy",
          description: "Generuj pliki seedów podczas budowania",
        },
        nextBuild: {
          title: "Build Next.js",
          description: "Uruchom proces budowania Next.js",
        },
        migrate: {
          title: "Uruchom migracje",
          description: "Uruchom migracje bazy danych podczas budowania",
        },
        seed: {
          title: "Uruchom seeding",
          description: "Uruchom seeding bazy danych podczas budowania",
        },
        force: {
          title: "Wymuś budowanie",
          description: "Kontynuuj budowanie nawet przy błędach",
        },
        framework: {
          title: "Framework",
          description: "Frontend framework/bundler",
        },
        webpack: {
          title: "Użyj Webpack",
          description:
            "Użyj webpack zamiast Turbopack. Mniejsze użycie pamięci (~7,5 GB vs ~12 GB). Domyślnie włączone w produkcyjnych buildach Docker.",
        },
        skipEndpoints: {
          title: "Pomiń generowanie punktów końcowych",
          description: "Pomiń generowanie plików punktów końcowych",
        },
        skipSeeds: {
          title: "Pomiń generowanie seedów",
          description: "Pomiń generowanie plików seedów",
        },
        skipProdMigrations: {
          title: "Pomiń migracje produkcyjne",
          description: "Pomiń uruchamianie migracji bazy danych dla produkcji",
        },
        skipProdSeeding: {
          title: "Pomiń seeding produkcyjny",
          description: "Pomiń seeding bazy danych dla produkcji",
        },
        runProdDatabase: {
          title: "Uruchom operacje produkcyjnej bazy danych",
          description: "Uruchom operacje produkcyjnej bazy danych po budowaniu",
        },
        success: {
          title: "Sukces budowania",
        },
        output: {
          title: "Wynik budowania",
        },
        duration: {
          title: "Czas budowania (ms)",
        },
        errors: {
          title: "Błędy budowania",
        },
        steps: {
          title: "Kroki budowania",
        },
        label: {
          title: "Krok",
        },
        ok: {
          title: "Sukces",
        },
        skipped: {
          title: "Pominięto",
        },
      },
      errors: {
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Podano nieprawidłowe parametry budowania",
        },
        network: {
          title: "Błąd sieci",
          description: "Połączenie sieciowe nie powiodło się podczas budowania",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Musisz być zalogowany, aby zbudować aplikację",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do budowania aplikacji",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasoby budowania nie zostały znalezione",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera podczas budowania",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd podczas budowania",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt budowania",
        },
        nextjs_build_failed: {
          title: "Budowanie Next.js nie powiodło się",
          description: "Proces budowania Next.js nie powiódł się: {{error}}",
        },
      },
      success: {
        title: "Budowanie zakończone",
        description: "Budowanie aplikacji zakończone pomyślnie",
      },
      repository: {
        messages: {
          buildStart: "🚀 Rozpoczynanie budowania aplikacji...",
          packageBuildStart: "Budowanie pakietu...",
          packageBuildSuccess: "✅ Budowanie pakietu zakończone pomyślnie",
          packageBuildFailed: "Budowanie pakietu nie powiodło się",
          buildPrerequisites: "Uruchamianie wymagań budowania...",
          skipGeneration:
            "Pomijanie generowania punktów końcowych API (--skip-generation)",
          generatingEndpoints: "Generowanie punktów końcowych API...",
          generationSuccess: "✅ Generowanie kodu zakończone pomyślnie",
          generationFailed: "Generowanie kodu nie powiodło się",
          skipNextBuild:
            "Pomijanie budowania Next.js (będzie obsługiwane przez package.json)",
          buildingNextjs: "Budowanie aplikacji Next.js...",
          nextjsBuildSuccess: "✅ Budowanie Next.js zakończone pomyślnie",
          nextjsBuildFailed: "Budowanie Next.js nie powiodło się",
          skipProdDb:
            "Pomijanie operacji produkcyjnej bazy danych (--run-prod-database=false)",
          buildFailed: "❌ Budowanie nie powiodło się",
          schemaGenerationStart: "Generowanie schematu bazy danych...",
          schemaGenerationSuccess:
            "✅ Generowanie schematu bazy danych zakończone",
          schemaGenerationFailed:
            "Generowanie schematu bazy danych nie powiodło się",
          skipSchemaGeneration:
            "Pomijanie generowania schematu bazy danych (--run-prod-database=false)",
          reportsGenerationStart: "Generowanie wszystkich raportów...",
          reportsGenerationSuccess:
            "✅ Wszystkie raporty wygenerowane pomyślnie",
          reportsGenerationFailed: "Generowanie raportów nie powiodło się",
          prodDbStart: "🚀 Uruchamianie operacji produkcyjnej bazy danych...",
          prodDbSuccess:
            "🎉 Operacje produkcyjnej bazy danych zakończone pomyślnie",
          prodDbFailed:
            "❌ Budowanie produkcyjne nie powiodło się podczas operacji bazy danych",
          prodDbNotReady:
            "💡 To budowanie NIE jest gotowe do wdrożenia produkcyjnego",
          deploymentReady:
            "🚀 Twoja aplikacja jest gotowa do wdrożenia produkcyjnego!",
          dbConnectionError:
            "Połączenie z bazą danych nie powiodło się. Upewnij się, że baza danych działa i jest dostępna.",
          dbStartSuggestion:
            "Spróbuj uruchomić 'docker compose -f docker-compose-dev.yml up -d', aby uruchomić bazę danych",
          nextBuildHandled:
            "✅ Budowanie Next.js będzie obsługiwane przez polecenie yarn build",
          failedProdMigrations:
            "Nie udało się uruchomić migracji produkcyjnych",
        },
      },
    },
  },
  dev: {
    category: "Serwer systemowy",

    post: {
      title: "Tytuł",
      description: "Opis endpointu",
      form: {
        title: "Konfiguracja",
        description: "Skonfiguruj parametry",
      },
      response: {
        title: "Odpowiedź",
        description: "Dane odpowiedzi",
      },
      fields: {
        debug: {
          title: "Tryb debugowania",
          description: "Włącz tryb debugowania dla szczegółowych komunikatów",
        },
        skipDbSetup: {
          title: "Pomiń konfigurację bazy",
          description: "Pomiń kroki konfiguracji bazy danych",
        },
        skipNextCommand: {
          title: "Pomiń polecenie Next",
          description: "Pomiń uruchamianie serwera deweloperskiego Next.js",
        },
        skipDbReset: {
          title: "Pomiń reset bazy",
          description: "Pomiń operację resetu bazy danych",
        },

        port: {
          title: "Port",
          description: "Numer portu dla serwera deweloperskiego",
        },
        skipGeneratorWatcher: {
          title: "Pomiń obserwator generatora",
          description: "Pomiń automatyczny obserwator generatora kodu",
        },
        generatorWatcherInterval: {
          title: "Interwał generatora",
          description: "Interwał dla obserwatora generatora w milisekundach",
        },
        skipTaskRunner: {
          title: "Pomiń runner zadań",
          description: "Pomiń uruchamianie systemu runnera zadań",
        },
        skipMigrations: {
          title: "Pomiń migracje",
          description: "Pomiń migracje bazy danych",
        },
        skipMigrationGeneration: {
          title: "Pomiń generowanie migracji",
          description: "Pomiń automatyczne generowanie migracji",
        },
        skipSeeding: {
          title: "Pomiń seeding",
          description: "Pomiń seedowanie bazy danych z danymi początkowymi",
        },
        framework: {
          title: "Framework",
          description: "Frontend framework/bundler",
        },
        profile: {
          title: "Profilowanie",
          description:
            "Włącz profilowanie: ustawia NEXT_TURBOPACK_TRACING=1 (plik trace pod .next/dev/trace-turbopack) i NEXT_CPU_PROF=1 (zapisuje .cpuprofile przy wyjściu)",
        },
        fixtureMode: {
          title: "Tryb fixture",
          description:
            "Włącz buforowanie HTTP fixture (VIBE_FIXTURE_MODE=true). Przechwytuje zewnętrzne wywołania API i zapisuje/odtwarza je z fixtures/http-cache/. Do testów E2E z tym serwerem jako zdalnym.",
        },
        success: {
          title: "Sukces",
        },
        output: {
          title: "Wyjście",
        },
        duration: {
          title: "Czas trwania",
        },
        serverUrl: {
          title: "URL serwera",
        },
        databaseStatus: {
          title: "Status bazy danych",
        },
        processes: {
          title: "Procesy",
        },
        errors: {
          title: "Błędy",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
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
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
  },
  health: {
    category: "Serwer systemowy",

    tag: "Zdrowie",
    get: {
      title: "Sprawdzenie Zdrowia",
      description: "Pobierz status zdrowia serwera i diagnostykę",
      form: {
        title: "Opcje sprawdzania zdrowia",
        description: "Skonfiguruj parametry sprawdzania zdrowia",
      },
      fields: {
        detailed: {
          title: "Szczegółowy raport",
          description: "Dołącz szczegółowe informacje systemowe",
        },
        includeDatabase: {
          title: "Dołącz bazę danych",
          description: "Dołącz sprawdzanie zdrowia bazy danych",
        },
        includeTasks: {
          title: "Dołącz zadania",
          description: "Dołącz sprawdzanie zdrowia task runnera",
        },
        includeSystem: {
          title: "Dołącz system",
          description: "Dołącz informacje o zasobach systemowych",
        },
      },
      response: {
        status: {
          title: "Status",
          description: "Ogólny status zdrowia",
        },
        timestamp: {
          title: "Znacznik czasu",
          description: "Czas sprawdzenia zdrowia",
        },
        uptime: {
          title: "Czas działania",
          description: "Czas działania serwera w sekundach",
        },
        environment: {
          title: "Środowisko",
          description: "Informacje o środowisku serwera",
          name: {
            title: "Nazwa środowiska",
          },
          nodeEnv: {
            title: "Środowisko Node",
          },
          platform: {
            title: "Platforma",
          },
          supportsTaskRunners: {
            title: "Obsługuje task-runnery",
          },
        },
        database: {
          title: "Status bazy danych",
          description: "Status połączenia z bazą danych",
          status: {
            title: "Status połączenia",
          },
          responseTime: {
            title: "Czas odpowiedzi (ms)",
          },
          error: {
            title: "Komunikat błędu",
          },
        },
        tasks: {
          title: "Status zadań",
          description: "Status task runnera",
          runnerStatus: {
            title: "Status uruchamiania",
          },
          activeTasks: {
            title: "Aktywne zadania",
          },
          totalTasks: {
            title: "Łączne zadania",
          },
          errors: {
            title: "Liczba błędów",
          },
          lastError: {
            title: "Ostatni błąd",
          },
        },
        system: {
          title: "Informacje systemowe",
          description: "Informacje o zasobach systemowych",
          memory: {
            title: "Użycie pamięci",
            description: "Informacje o pamięci systemowej",
            used: {
              title: "Używana pamięć",
            },
            total: {
              title: "Całkowita pamięć",
            },
            percentage: {
              title: "Użycie pamięci %",
            },
          },
          cpu: {
            title: "Użycie CPU",
            description: "Informacje o CPU systemowym",
            usage: {
              title: "Użycie CPU %",
            },
            loadAverage: {
              title: "Średnie obciążenie",
            },
          },
          disk: {
            title: "Użycie dysku",
            description: "Informacje o dysku systemowym",
            available: {
              title: "Dostępne miejsce",
            },
            total: {
              title: "Całkowite miejsce",
            },
            percentage: {
              title: "Użycie dysku %",
            },
          },
        },
        checks: {
          title: "Kontrole zdrowia",
          description: "Kontrole zdrowia poszczególnych komponentów",
          item: {
            title: "Kontrola zdrowia",
            description: "Wynik indywidualnej kontroli zdrowia",
            name: {
              title: "Nazwa kontroli",
            },
            status: {
              title: "Status kontroli",
            },
            message: {
              title: "Komunikat kontroli",
            },
            duration: {
              title: "Czas trwania (ms)",
            },
          },
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
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
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Istnieją niezapisane zmiany",
        },
      },
      success: {
        title: "Sukces",
        description: "Sprawdzenie zdrowia zakończone pomyślnie",
      },
    },
  },
  start: {
    category: "Zarządzanie serwerem",
    tags: {
      start: "Start",
    },
    post: {
      title: "Tytuł",
      description: "Opis endpointu",
      form: {
        title: "Konfiguracja",
        description: "Skonfiguruj parametry",
      },
      response: {
        title: "Odpowiedź",
        description: "Dane odpowiedzi",
      },
      fields: {
        skipPre: {
          title: "Pomiń zadania wstępne",
          description:
            "Pomiń uruchamianie zadań wstępnych przed startem serwera",
        },
        skipNextCommand: {
          title: "Pomiń polecenie Next.js",
          description: "Pomiń uruchamianie polecenia start Next.js",
        },
        mode: {
          title: "Tryb serwera",
          description:
            "Które podsystemy uruchomić: all (domyślnie), web (tylko Next.js + WS), tasks (tylko Task Runner)",
          options: {
            all: "Wszystkie (domyślnie)",
            web: "Tylko Web (Next.js + WebSocket)",
            tasks: "Tylko Tasks (Cron Runner)",
          },
        },
        seed: {
          title: "Uruchom seeding",
          description: "Uruchom seeding bazy danych przy starcie",
        },
        dbSetup: {
          title: "Konfiguracja bazy danych",
          description:
            "Uruchom konfigurację bazy danych i migracje przy starcie",
        },
        taskRunner: {
          title: "Task Runner",
          description: "Uruchom system Task Runner",
        },
        nextServer: {
          title: "Serwer Next.js",
          description: "Uruchom serwer Next.js",
        },
        port: {
          title: "Port",
          description: "Numer portu dla serwera",
        },
        profile: {
          title: "Profilowanie",
          description:
            "Włącz profilowanie: ustawia NEXT_CPU_PROF=1 (zapisuje .cpuprofile przy wyjściu) dla produkcyjnego serwera Next.js",
        },
        framework: {
          title: "Framework",
          description: "Frontend framework/bundler",
        },
        skipTaskRunner: {
          title: "Pomiń Task Runner",
          description: "Pomiń Task Runner",
        },
        success: {
          title: "Sukces",
        },
        serverStarted: {
          title: "Serwer uruchomiony",
        },
        output: {
          title: "Wyjście",
        },
        serverInfo: {
          title: "Informacje o serwerze",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
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
        tanstackBuildNotFound:
          "Nie znaleziono buildu TanStack Start - czy uruchomiono 'vibe build --tanstack'?",
        tanstackServerExited:
          "Serwer TanStack Start zakończył działanie natychmiast",
        nextBuildNotFound:
          "Nie znaleziono buildu .next-prod - czy uruchomiono 'vibe build'?",
        startFailed: "Nie udało się uruchomić serwera",
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
      repository: {
        messages: {
          startingServer: "🚀 Uruchamianie serwera produkcyjnego...",
          environment: "✅ Środowisko:",
          runningPreTasks: "Uruchamianie zadań wstępnych...",
          runningMigrations: "Uruchamianie migracji bazy danych...",
          migrationsCompleted: "✅ Migracje bazy danych zakończone",
          failedMigrations: "Migracje nie powiodły się",
          seedingDatabase: "Wypełnianie bazy danych...",
          seedingCompleted: "✅ Wypełnianie bazy danych zakończone",
          failedSeeding: "Wypełnianie bazy danych nie powiodło się:",
          startingTaskRunner:
            "Uruchamianie systemu Task Runner produkcyjnego...",
          taskRunnerStarted: "✅ Task Runner produkcyjny uruchomiony z",
          taskRunnerStartedSuffix: " zadań",
          failedTaskRunner: "Nie udało się uruchomić Task Runner",
          taskRunnerSkipped:
            "Task Runner produkcyjny pominięty (użyto flagi --skip-task-runner)",
          skipNextStart:
            "Pomijanie startu Next.js (będzie obsługiwane przez package.json)",
          serverWillStart:
            "Serwer produkcyjny zostanie uruchomiony przez package.json",
          serverAvailable:
            "Serwer będzie dostępny pod adresem http://localhost:",
          startupPrepared:
            "✅ Start serwera produkcyjnego przygotowany pomyślnie",
          failedStart: "❌ Start serwera produkcyjnego nie powiódł się:",
          gracefulShutdown:
            "Żądanie graceful shutdown dla Task Runner produkcyjnego",
        },
      },
    },
  },
};
