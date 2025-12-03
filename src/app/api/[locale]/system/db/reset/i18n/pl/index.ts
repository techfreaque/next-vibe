import { translations as taskManagementTranslations } from "../../task-management/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "reset",
  post: {
    title: "Reset bazy danych",
    description:
      "Resetuj bazę danych przez czyszczenie tabel, usuwanie schematu lub pełną inicjalizację",
    form: {
      title: "Konfiguracja resetu",
      description: "Skonfiguruj opcje resetu bazy danych",
    },
    response: {
      title: "Odpowiedź resetu",
      description: "Wyniki operacji resetu bazy danych",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry resetu",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do operacji resetu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia do operacji resetu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby resetu nie zostały znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas resetu",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas operacji resetu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas resetu",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt resetu",
      },
      database: {
        title: "Błąd bazy danych",
        description: "Błąd bazy danych podczas operacji resetu",
      },
      migration: {
        title: "Błąd migracji",
        description: "Błąd uruchamiania migracji po resecie",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Operacja resetu nie powiodła się",
      },
    },
    success: {
      title: "Reset zakończony sukcesem",
      description: "Reset bazy danych zakończony pomyślnie",
    },
  },
  fields: {
    mode: {
      title: "Tryb resetu",
      description: "Typ operacji resetu do wykonania",
      truncate: "Wyczyść tabele",
      drop: "Usuń i utwórz ponownie",
      initialize: "Pełna inicjalizacja",
    },
    force: {
      title: "Wymuś reset",
      description:
        "Pomiń kontrole bezpieczeństwa (wymagane dla destrukcyjnych operacji)",
    },
    skipMigrations: {
      title: "Pomiń migracje",
      description: "Pomiń uruchamianie migracji po resecie",
    },
    skipSeeds: {
      title: "Pomiń seedy",
      description: "Pomiń uruchamianie danych seed po resecie",
    },
    dryRun: {
      title: "Próbny przebieg",
      description: "Podgląd resetu bez wprowadzania zmian",
    },
    success: {
      title: "Status sukcesu",
    },
    tablesAffected: {
      title: "Dotknięte tabele",
    },
    migrationsRun: {
      title: "Wykonane migracje",
    },
    seedsRun: {
      title: "Wykonane seedy",
    },
    output: {
      title: "Wyjście",
    },
    operations: {
      title: "Operacje",
      item: {
        title: "Operacja",
      },
      type: {
        title: "Typ operacji",
      },
      status: {
        title: "Status",
      },
      details: {
        title: "Szczegóły",
      },
      count: {
        title: "Liczba",
      },
    },
    isDryRun: {
      title: "Tryb próbny",
    },
    requiresForce: {
      title: "Wymaga wymuszenia",
    },
    duration: {
      title: "Czas trwania (ms)",
    },
  },
  status: {
    pending: "Oczekujące",
    running: "W trakcie",
    success: "Sukces",
    failed: "Niepowodzenie",
    cancelled: "Anulowane",
  },
  taskManagement: taskManagementTranslations,
  messages: {
    dryRun: "PRÓBA: Nie wprowadzono faktycznych zmian",
    truncateRequiresForce:
      "Operacja czyszczenia wymaga flagi --force dla bezpieczeństwa",
    noTablesToTruncate: "Nie znaleziono tabel do wyczyszczenia",
    truncatedTables: "Wyczyszczono {{count}} tabel pomyślnie",
    failedToTruncate: "Nie udało się wyczyścić tabel: {{error}}",
    dropRequiresForce:
      "Operacja usuwania wymaga flagi --force dla bezpieczeństwa",
    droppedSchema: "Usunięto i odtworzono schemat (usunięto {{count}} tabel)",
    failedToDrop: "Nie udało się usunąć i odtworzyć: {{error}}",
    databaseInitialized: "Baza danych zainicjalizowana pomyślnie {{output}}",
    failedToInitialize: "Nie udało się zainicjalizować bazy danych: {{error}}",
    runningMigrations: "Migracje zostałyby uruchomione tutaj",
    runningSeeds: "Seedy zostałyby uruchomione tutaj",
  },
};
