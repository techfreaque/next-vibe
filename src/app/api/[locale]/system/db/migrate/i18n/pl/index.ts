import { translations as taskManagementTranslations } from "../../task-management/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    dryRun: {
      title: "Próbny przebieg",
      description: "Podgląd migracji bez ich stosowania",
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
    generationFailedWithCode: "Generowanie migracji nie powiodło się z kodem {{code}}: {{output}}",
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
  taskManagement: taskManagementTranslations,
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
    syncCompleted: "Synchronizacja migracji zakończona pomyślnie ({{direction}})",
    failedToGenerate: "Nie udało się wygenerować migracji: {{error}}",
    failedToExecute: "Nie udało się wykonać migracji: {{error}}",
    failedToRedo: "Nie udało się ponowić migracji: {{error}}",
  },
};
