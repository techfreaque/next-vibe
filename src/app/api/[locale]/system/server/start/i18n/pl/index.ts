import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
        description: "Pomiń uruchamianie zadań wstępnych przed startem serwera",
      },
      skipNextCommand: {
        title: "Pomiń polecenie Next.js",
        description: "Pomiń uruchamianie polecenia start Next.js",
      },
      port: {
        title: "Port",
        description: "Numer portu dla serwera",
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
        startingTaskRunner: "Uruchamianie systemu Task Runner produkcyjnego...",
        taskRunnerStarted: "✅ Task Runner produkcyjny uruchomiony z",
        taskRunnerStartedSuffix: " zadań",
        failedTaskRunner: "Nie udało się uruchomić Task Runner",
        taskRunnerSkipped:
          "Task Runner produkcyjny pominięty (użyto flagi --skip-task-runner)",
        skipNextStart:
          "Pomijanie startu Next.js (będzie obsługiwane przez package.json)",
        serverWillStart:
          "Serwer produkcyjny zostanie uruchomiony przez package.json",
        serverAvailable: "Serwer będzie dostępny pod adresem http://localhost:",
        startupPrepared:
          "✅ Start serwera produkcyjnego przygotowany pomyślnie",
        failedStart: "❌ Start serwera produkcyjnego nie powiódł się:",
        gracefulShutdown:
          "Żądanie graceful shutdown dla Task Runner produkcyjnego",
      },
    },
  },
};
