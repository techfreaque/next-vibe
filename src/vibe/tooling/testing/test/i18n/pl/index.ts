import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Uruchom testy",
  titleShort: "Uruchom testy",
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
      description:
        "Wykonanie testów nie powiodło się z powodu błędu wewnętrznego",
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
    executionFailed:
      "Wykonanie testów nie powiodło się po {{duration}} ms: {{detail}}\n{{output}}",
    streamingUnsupported:
      "Odpowiedzi strumieniowe nie są obsługiwane w testach",
    responseSchemaFailed:
      "Walidacja schematu odpowiedzi dla {{path}} nie powiodła się: {{issues}}",
    requestFailed: "Żądanie testowe nie powiodło się: {{detail}}",
    browser: {
      serverNotRunning:
        "Serwer deweloperski Atlas nie działa - uruchom go poleceniem vibe dev",
      openFailed: "Nie udało się otworzyć strony w przeglądarce: {{detail}}",
      fillFailed: "Nie udało się wypełnić pól formularza: {{detail}}",
      submitFailed: "Nie udało się kliknąć przycisku wysyłania: {{detail}}",
      evaluateFailed:
        "Wykonanie skryptu na stronie nie powiodło się: {{detail}}",
      resultTimeout: "Brak wyniku mutacji w ciągu {{timeoutMs}} ms",
      parseFailed:
        "Nie udało się odczytać zapisanej odpowiedzi jako JSON: {{raw}}",
      cacheEmpty:
        "Pamięć podręczna mutacji jest pusta - odpowiedź nigdy się nie wczytała",
      requestFailed: "Test w przeglądarce nie powiódł się: {{detail}}",
    },
  },

  success: {
    title: "Testy zakończone",
    description: "Wykonanie testów zakończone pomyślnie",
  },
};
