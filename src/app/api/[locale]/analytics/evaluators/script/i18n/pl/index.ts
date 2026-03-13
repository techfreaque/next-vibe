import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Ewaluator skryptowy",
    description:
      "Niestandardowa ocena w piaskownicy za pomocą ciała funkcji podanej przez użytkownika",
    fields: {
      source: { label: "Źródło", description: "Wejściowa seria czasowa" },
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: { label: "Zakres", description: "Zakres czasu do oceny" },
      lookback: {
        label: "Wsteczne spojrzenie",
        description: "Dodatkowe słupki przed początkiem zakresu do rozgrzewki",
      },
      fn: {
        label: "Funkcja",
        description:
          "Ciało funkcji — otrzymuje tablicę inputs, zwraca SignalEvent[]",
      },
      signals: {
        label: "Sygnały",
        description: "Wyjściowe zdarzenia sygnałów",
      },
    },
    success: {
      title: "Skrypt oceniony",
      description: "Zdarzenia sygnałów zwrócone",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Ocena skryptu nie powiodła się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
};
