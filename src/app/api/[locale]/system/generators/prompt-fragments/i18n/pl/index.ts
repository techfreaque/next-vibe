export const translations = {
  category: "Generatory",

  post: {
    title: "Generuj fragmenty promptów",
    description: "Generuj indeks fragmentów promptów z dynamicznymi importami",
    container: {
      title: "Generowanie fragmentów promptów",
      description: "Konfiguracja generowania indeksu fragmentów promptów",
    },
    fields: {
      outputFile: {
        label: "Plik wyjściowy",
        description: "Ścieżka do wygenerowanego pliku prompt-fragments.ts",
      },
      dryRun: {
        label: "Próbny przebieg",
        description: "Podgląd bez zapisywania plików",
      },
      fragmentsFound: {
        title: "Znalezione fragmenty",
      },
      duration: {
        title: "Czas trwania",
      },
      success: {
        title: "Sukces",
      },
      message: {
        title: "Wiadomość",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera",
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
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wewnętrzny błąd serwera",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
