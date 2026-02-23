import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operacje bazodanowe",

  post: {
    title: "Migracja Produkcyjnej Bazy Danych",
    description:
      "Uruchom migracje produkcyjnej bazy danych z kontrolami bezpieczeństwa dla pipeline'ów CI/CD",
    form: {
      title: "Opcje Migracji Produkcyjnej",
      description: "Skonfiguruj ustawienia operacji migracji produkcyjnej",
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Podane parametry migracji produkcyjnej są nieprawidłowe",
      },
      network: {
        title: "Błąd Sieci",
        description:
          "Nie udało się połączyć z bazą danych w celu migracji produkcyjnej",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie jesteś upoważniony do wykonywania operacji migracji produkcyjnej",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Operacje migracji produkcyjnej nie są dozwolone dla Twojej roli",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Żądany zasób migracji produkcyjnej nie został znaleziony",
      },
      server: {
        title: "Błąd Serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas migracji produkcyjnej",
      },
      unknown: {
        title: "Nieznany Błąd",
        description:
          "Wystąpił nieoczekiwany błąd podczas migracji produkcyjnej",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji migracji produkcyjnej",
      },
    },
    success: {
      title: "Migracja Produkcyjna Udana",
      description: "Migracja produkcyjna została pomyślnie zakończona",
    },
  },
  fields: {
    skipSeeding: {
      title: "Pomiń Seeding",
      description: "Pomiń uruchamianie seedingu produkcyjnego po migracjach",
    },
    force: {
      title: "Wymuś Operację",
      description: "Wymuś operacje bez monitów o potwierdzenie",
    },
    dryRun: {
      title: "Próbny Przebieg",
      description:
        "Pokaż co zostałoby zrobione bez faktycznego wykonywania zmian",
    },
    success: {
      title: "Sukces",
    },
    output: {
      title: "Wyjście",
    },
    environment: {
      title: "Środowisko",
    },
    databaseUrl: {
      title: "URL Bazy Danych",
    },
    migrationsGenerated: {
      title: "Migracje Wygenerowane",
    },
    migrationsApplied: {
      title: "Migracje Zastosowane",
    },
    seedingCompleted: {
      title: "Seeding Zakończony",
    },
  },
  messages: {
    dryRunComplete: "✅ Próbny przebieg zakończony - nie wprowadzono zmian",
    successWithSeeding:
      "✅ Migracja produkcyjna zakończona pomyślnie! 🚀 Gotowe do wdrożenia",
    successWithoutSeeding:
      "✅ Migracja produkcyjna zakończona pomyślnie (seeding pominięty)! 🚀 Gotowe do wdrożenia",
  },
  errors: {
    notProduction:
      "❌ NODE_ENV nie jest ustawione na 'production'. Użyj --force aby nadpisać.",
    noDatabaseUrl: "❌ Zmienna środowiskowa DATABASE_URL jest wymagana",
    localhostDatabase:
      "❌ DATABASE_URL wygląda na localhost. Użyj --force aby nadpisać.",
  },
  tag: "Baza Danych",
};
