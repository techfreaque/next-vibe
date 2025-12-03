import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Generuj indeks zadań",
    description: "Generuj pliki indeksu zadań",
    container: {
      title: "Generowanie indeksu zadań",
      description: "Skonfiguruj parametry generowania indeksu zadań",
    },
    fields: {
      outputDir: {
        label: "Katalog wyjściowy",
        description: "Katalog dla wygenerowanych plików indeksu zadań",
      },
      verbose: {
        label: "Szczegółowe wyjście",
        description: "Włącz szczegółowe logowanie",
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
      tasksFound: {
        title: "Znalezione zadania",
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
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
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
