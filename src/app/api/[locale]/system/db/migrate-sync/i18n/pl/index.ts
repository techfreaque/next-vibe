import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Synchronizacja Migracji Bazy Danych",
    description:
      "Zsynchronizuj stan migracji pozwalając Drizzle prawidłowo obsługiwać śledzenie unikając konfliktów",
    form: {
      title: "Opcje Synchronizacji Migracji",
      description: "Skonfiguruj ustawienia operacji synchronizacji migracji",
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Podane parametry synchronizacji migracji są nieprawidłowe",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie udało się połączyć z bazą danych w celu synchronizacji migracji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie jesteś upoważniony do wykonywania operacji synchronizacji migracji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacje synchronizacji migracji nie są dozwolone dla Twojej roli",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Żądany zasób synchronizacji migracji nie został znaleziony",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas synchronizacji migracji",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas synchronizacji migracji",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji synchronizacji migracji",
      },
    },
    success: {
      title: "Synchronizacja Migracji Udana",
      description: "Stan migracji został pomyślnie zsynchronizowany",
    },
  },
  fields: {
    force: {
      title: "Wymuś Operację",
      description: "Wymuś synchronizację bez monitów o potwierdzenie",
    },
    dryRun: {
      title: "Próbny Przebieg",
      description: "Pokaż co zostałoby zrobione bez faktycznego wykonywania zmian",
    },
    success: {
      title: "Sukces",
    },
    output: {
      title: "Wyjście",
    },
    trackingCleared: {
      title: "Śledzenie Wyczyszczone",
    },
    trackingFilesCreated: {
      title: "Pliki Śledzenia Utworzone",
    },
    drizzleMigrationRun: {
      title: "Migracja Drizzle Uruchomiona",
    },
    originalFilesRestored: {
      title: "Oryginalne Pliki Przywrócone",
    },
    migrationsProcessed: {
      title: "Migracje Przetworzone",
    },
  },
  messages: {
    dryRunComplete: "✅ Próbny przebieg zakończony - nie wprowadzono zmian",
    success:
      "✅ Synchronizacja migracji zakończona pomyślnie! 🚀 Migracje są teraz prawidłowo śledzone przez Drizzle",
  },
  tag: "Baza Danych",
};
