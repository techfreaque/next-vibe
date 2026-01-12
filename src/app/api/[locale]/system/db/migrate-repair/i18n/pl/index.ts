import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Naprawa Migracji Bazy Danych",
    description:
      "Napraw śledzenie migracji, aby zapewnić prawidłowy stan dla buildów produkcyjnych",
    form: {
      title: "Opcje Naprawy Migracji",
      description: "Skonfiguruj ustawienia operacji naprawy migracji",
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Podane parametry naprawy migracji są nieprawidłowe",
      },
      network: {
        title: "Błąd Sieci",
        description:
          "Nie udało się połączyć z bazą danych w celu naprawy migracji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie jesteś upoważniony do wykonywania operacji naprawy migracji",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Operacje naprawy migracji nie są dozwolone dla Twojej roli",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Żądany zasób naprawy migracji nie został znaleziony",
      },
      server: {
        title: "Błąd Serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas naprawy migracji",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas naprawy migracji",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji naprawy migracji",
      },
    },
    success: {
      title: "Naprawa Migracji Udana",
      description: "Śledzenie migracji zostało pomyślnie naprawione",
    },
  },
  fields: {
    force: {
      title: "Wymuś Operację",
      description: "Wymuś naprawę bez monitów o potwierdzenie",
    },
    dryRun: {
      title: "Próbny Przebieg",
      description:
        "Pokaż co zostałoby zrobione bez faktycznego wykonywania zmian",
    },
    reset: {
      title: "Resetuj Śledzenie",
      description:
        "Resetuj śledzenie migracji (wyczyść wszystkie śledzone migracje)",
    },
    success: {
      title: "Sukces",
    },
    output: {
      title: "Wyjście",
    },
    hasTable: {
      title: "Ma Tabelę Migracji",
    },
    schema: {
      title: "Schemat",
    },
    tableName: {
      title: "Nazwa Tabeli",
    },
    trackedMigrations: {
      title: "Śledzone Migracje",
    },
    migrationFiles: {
      title: "Pliki Migracji",
    },
    repaired: {
      title: "Liczba Naprawionych",
    },
  },
  messages: {
    upToDate:
      "✅ Śledzenie migracji jest aktualne - naprawa nie jest potrzebna",
    dryRunComplete: "✅ Próbny przebieg zakończony - nie wprowadzono zmian",
    repairComplete:
      "✅ Naprawa migracji zakończona pomyślnie! Oznaczono {{count}} migracji jako zastosowane",
    success:
      "✅ Naprawa migracji zakończona pomyślnie! 🚀 Gotowe do buildów produkcyjnych",
  },
  tag: "Baza Danych",
};
