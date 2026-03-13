import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Próg",
    description: "Uruchamia się, gdy wartość serii spełnia porównanie ze stałą",
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
      op: {
        label: "Operator",
        description: "Operator porównania (>, <, >=, <=, ==)",
      },
      value: {
        label: "Próg",
        description: "Stała wartość do porównania",
      },
      signals: {
        label: "Sygnały",
        description: "Wyjściowe zdarzenia sygnałów",
      },
    },
    success: {
      title: "Próg oceniony",
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
        description: "Ocena progu nie powiodła się",
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
