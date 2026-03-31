import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Przecięcie",
    description: "Uruchamia się, gdy seria A przecina serię B od dołu",
    fields: {
      seriesA: {
        label: "Seria A",
        description: "Pierwsza wejściowa seria czasowa",
      },
      seriesB: {
        label: "Seria B",
        description: "Druga wejściowa seria czasowa",
      },
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: { label: "Zakres", description: "Zakres czasu do oceny" },
      lookback: {
        label: "Wsteczne spojrzenie",
        description: "Dodatkowe słupki przed początkiem zakresu do rozgrzewki",
      },
      signals: {
        label: "Sygnały",
        description: "Wyjściowe zdarzenia sygnałów",
      },
    },
    backButton: {
      label: "Wstecz",
    },
    submitButton: {
      label: "Oblicz",
      loadingText: "Obliczanie…",
    },
    success: {
      title: "Przecięcie ocenione",
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
        description: "Ocena przecięcia nie powiodła się",
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
