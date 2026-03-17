import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",

  post: {
    title: "Generuj klucze env",
    description: "Generuj plik metadanych kluczy env dla definicji ustawień",
    container: {
      title: "Generowanie kluczy env",
      description: "Skonfiguruj parametry generowania kluczy env",
    },
    fields: {
      outputFile: {
        label: "Plik wyjściowy",
        description: "Ścieżka dla wygenerowanego pliku kluczy env",
      },
      dryRun: {
        label: "Próbny przebieg",
        description: "Podgląd bez zapisywania plików",
      },
      duration: { title: "Czas trwania" },
      success: { title: "Sukces" },
      message: { title: "Wiadomość" },
      keysFound: { title: "Znalezione klucze" },
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
