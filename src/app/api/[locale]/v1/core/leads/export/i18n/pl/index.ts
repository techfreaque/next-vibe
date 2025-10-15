import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Eksportuj leady",
    description: "Eksportuj dane leadów do pliku",
    form: {
      title: "Konfiguracja eksportu",
      description: "Skonfiguruj parametry eksportu leadów i filtry",
    },
    format: {
      label: "Format eksportu",
      description: "Format pliku dla eksportu",
    },
    status: {
      label: "Status leada",
      description: "Filtruj według statusu leada",
    },
    country: {
      label: "Kraj",
      description: "Filtruj według kraju",
      placeholder: "Wybierz kraj",
    },
    language: {
      label: "Język",
      description: "Filtruj według języka",
      placeholder: "Wybierz język",
    },
    source: {
      label: "Źródło leada",
      description: "Filtruj według źródła leada",
      placeholder: "Wybierz źródło",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj leadów według tekstu",
      placeholder: "Szukaj leadów...",
    },
    dateFrom: {
      label: "Data początkowa",
      description: "Eksportuj leady utworzone od tej daty",
    },
    dateTo: {
      label: "Data końcowa",
      description: "Eksportuj leady utworzone do tej daty",
    },
    includeMetadata: {
      label: "Uwzględnij metadane",
      description: "Uwzględnij znaczniki czasu utworzenia i aktualizacji",
    },
    includeEngagementData: {
      label: "Uwzględnij dane zaangażowania",
      description: "Uwzględnij śledzenie e-maili i dane kampanii",
    },
    response: {
      title: "Plik eksportu",
      description: "Wygenerowany plik eksportu z danymi leadów",
      fileName: "Nazwa pliku",
      fileContent: "Zawartość pliku (Base64)",
      mimeType: "Typ MIME",
      totalRecords: "Łączna liczba rekordów",
      exportedAt: "Wyeksportowano o",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do eksportu leadów",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry eksportu lub filtry",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas eksportu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas eksportu",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas eksportu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla eksportu leadów",
      },
      notFound: {
        title: "Brak danych",
        description: "Nie znaleziono leadów spełniających kryteria eksportu",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas eksportu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany w formularzu eksportu",
      },
    },
    success: {
      title: "Eksport zakończony",
      description: "Eksport leadów zakończony pomyślnie",
    },
  },
};
