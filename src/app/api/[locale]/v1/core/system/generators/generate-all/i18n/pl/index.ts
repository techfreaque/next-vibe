import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Generuj wszystko",
    description: "Uruchom wszystkie generatory kodu",
    container: {
      title: "Konfiguracja Generuj wszystko",
      description: "Skonfiguruj parametry generowania",
    },
    fields: {
      rootDir: {
        label: "Katalog główny",
        description: "Katalog główny do generowania",
      },
      outputDir: {
        label: "Katalog wyjściowy",
        description: "Katalog wyjściowy dla wygenerowanych plików",
      },
      verbose: {
        label: "Szczegółowe wyjście",
        description: "Włącz szczegółowe logowanie",
      },
      skipEndpoints: {
        label: "Pomiń punkty końcowe",
        description: "Pomiń generowanie punktów końcowych",
      },
      skipSeeds: {
        label: "Pomiń seedy",
        description: "Pomiń generowanie seedów",
      },
      skipTaskIndex: {
        label: "Pomiń indeks zadań",
        description: "Pomiń generowanie indeksu zadań",
      },
      success: {
        title: "Sukces",
      },
      generationCompleted: {
        title: "Generowanie zakończone",
      },
      output: {
        title: "Wyjście",
      },
      generationStats: {
        title: "Statystyki generowania",
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
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
