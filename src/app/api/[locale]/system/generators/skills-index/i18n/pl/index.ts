import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",

  post: {
    title: "Generuj indeks umiejętności",
    description: "Generuj domyślny plik indeksu umiejętności",
    container: {
      title: "Generowanie indeksu umiejętności",
      description: "Skonfiguruj parametry generowania indeksu umiejętności",
    },
    fields: {
      outputFile: {
        label: "Plik wyjściowy",
        description: "Ścieżka dla wygenerowanego pliku indeksu umiejętności",
      },
      dryRun: {
        label: "Próbny przebieg",
        description: "Podgląd bez zapisywania plików",
      },
      duration: { title: "Czas trwania" },
      success: { title: "Sukces" },
      message: { title: "Wiadomość" },
      skillsFound: { title: "Znalezione umiejętności" },
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
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: { title: "Sukces", description: "Operacja zakończona pomyślnie" },
  },
};
