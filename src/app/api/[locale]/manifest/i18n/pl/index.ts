import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Generic manifest translations
  category: "Rdzeń",
  tags: {
    manifest: "Manifest",
    configuration: "Konfiguracja",
  },

  // Endpoint metadata
  title: "Pobierz Manifest Aplikacji Web",
  description:
    "Pobierz zlokalizowane dane manifestu aplikacji web dla konfiguracji Progressive Web App (PWA)",

  // Form translations
  form: {
    title: "Żądanie Manifestu",
    description:
      "Brak wymaganych parametrów wejściowych - ten endpoint zwraca dane manifestu na podstawie Twojej aktualnej lokalizacji",
  },

  // Response translations
  response: {
    title: "Manifest Aplikacji Web",
    description:
      "Kompletna konfiguracja manifestu PWA zawierająca metadane aplikacji, ikony i ustawienia lokalizacji",
    display: "Tryb Wyświetlania",
    orientation: "Orientacja",
    categories: "Kategorie",
    iconPurpose: "Przeznaczenie Ikony",
  },

  // Error translations
  errors: {
    validation: {
      title: "Nieprawidłowe Żądanie",
      description: "Parametry żądania są nieprawidłowe",
    },
    unauthorized: {
      title: "Nieautoryzowany Dostęp",
      description: "Nie masz uprawnień do dostępu do manifestu",
    },
    server: {
      title: "Błąd Serwera",
      description: "Nie udało się wygenerować manifestu aplikacji web",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    network: {
      title: "Błąd Sieci",
      description: "Nie można połączyć się z serwerem",
    },
    forbidden: {
      title: "Dostęp Zabroniony",
      description: "Nie masz uprawnień do dostępu do tego zasobu",
    },
    conflict: {
      title: "Konflikt Danych",
      description: "Wystąpił konflikt z żądanymi danymi",
    },
    not_found: {
      title: "Nie Znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    unsaved_changes: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany, które zostaną utracone",
    },
  },

  // Success translations
  success: {
    title: "Manifest Pobrany",
    description: "Manifest aplikacji web wygenerowany pomyślnie",
  },

  // Enum translations
  enums: {
    displayMode: {
      fullscreen: "Pełny Ekran",
      standalone: "Samodzielny",
      minimalUi: "Minimalny Interfejs",
      browser: "Przeglądarka",
    },
    orientation: {
      any: "Dowolna",
      natural: "Naturalna",
      landscape: "Pozioma",
      landscapePrimary: "Pozioma Główna",
      landscapeSecondary: "Pozioma Drugorzędna",
      portrait: "Pionowa",
      portraitPrimary: "Pionowa Główna",
      portraitSecondary: "Pionowa Drugorzędna",
    },
    category: {
      books: "Książki",
      business: "Biznes",
      education: "Edukacja",
      entertainment: "Rozrywka",
      finance: "Finanse",
      fitness: "Fitness",
      food: "Jedzenie",
      games: "Gry",
      government: "Rząd",
      health: "Zdrowie",
      kids: "Dzieci",
      lifestyle: "Styl Życia",
      magazines: "Magazyny",
      medical: "Medycyna",
      music: "Muzyka",
      navigation: "Nawigacja",
      news: "Wiadomości",
      personalization: "Personalizacja",
      photo: "Zdjęcia",
      politics: "Polityka",
      productivity: "Produktywność",
      security: "Bezpieczeństwo",
      shopping: "Zakupy",
      social: "Społeczność",
      sports: "Sport",
      travel: "Podróże",
      utilities: "Narzędzia",
      weather: "Pogoda",
    },
    iconPurpose: {
      maskable: "Maskowalny",
      any: "Dowolny",
      monochrome: "Monochromatyczny",
      maskableAny: "Maskowalny Dowolny",
    },
  },
};
