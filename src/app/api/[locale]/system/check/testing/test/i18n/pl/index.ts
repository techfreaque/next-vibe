import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Uruchom testy",
  description: "Wykonaj zestaw testów z opcjonalnymi konfiguracjami",
  category: "Testowanie",
  tag: "Test",

  container: {
    title: "Konfiguracja testów",
    description: "Skonfiguruj parametry wykonywania testów",
  },

  fields: {
    path: {
      label: "Ścieżka testów",
      description: "Ścieżka do plików testowych lub katalogu",
      placeholder: "src/",
    },
    verbose: {
      label: "Szczegółowe wyjście",
      description: "Włącz szczegółowe wyjście testów",
    },
    watch: {
      label: "Tryb watch",
      description: "Uruchom testy w trybie watch dla zmian plików",
    },
    coverage: {
      label: "Raport pokrycia",
      description: "Wygeneruj raport pokrycia testów",
    },
  },

  response: {
    success: "Status wykonania testów",
    output: "Wyjście i wyniki testów",
    duration: "Czas wykonania testów (ms)",
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry konfiguracji testów",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wykonanie testów nie powiodło się z powodu błędu wewnętrznego",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Odmowa uprawnień do wykonania testów",
    },
    forbidden: {
      title: "Zabronione",
      description: "Wykonanie testów jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Pliki testowe lub katalog nie został znaleziony",
    },
    server: {
      title: "Błąd serwera",
      description: "Błąd serwera podczas wykonywania testów",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Istnieją niezapisane zmiany, które mogą wpłynąć na testy",
    },
    conflict: {
      title: "Konflikt",
      description: "Wykryto konflikt wykonania testów",
    },
  },

  success: {
    title: "Testy zakończone",
    description: "Wykonanie testów zakończone pomyślnie",
  },
};
