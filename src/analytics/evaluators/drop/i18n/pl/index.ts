import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Gwałtowny spadek",
    titleShort: "Spadek",
    description:
      "Uruchamia się, gdy wartość mocno spada poniżej własnej średniej kroczącej",
    fields: {
      source: { label: "Źródło", description: "Wejściowy szereg czasowy" },
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: { label: "Zakres", description: "Zakres czasu do oceny" },
      lookback: {
        label: "Wstecz",
        description: "Dodatkowe słupki przed początkiem zakresu na rozgrzewkę",
      },
      window: {
        label: "Poprzednie słupki",
        description: "Ile poprzednich słupków tworzy średnią bazową",
      },
      dropPct: {
        label: "Spadek",
        description:
          "Uruchamia poniżej bazy × (1 − spadek). 0,5 = spadek o 50%",
      },
      minBaseline: {
        label: "Minimalna baza",
        description: "Pomijaj słupki z mniejszą bazą (za mało danych)",
      },
      signals: {
        label: "Sygnały",
        description: "Wyjściowe zdarzenia sygnałów",
      },
    },
    backButton: {
      label: "Wróć",
    },
    submitButton: {
      label: "Oceń",
      loadingText: "Ocenianie…",
    },
    success: {
      title: "Spadek oceniony",
      description: "Zwrócono zdarzenia sygnałów",
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
        description: "Ocena nie powiodła się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Walidacja nieudana",
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
