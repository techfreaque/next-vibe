import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
