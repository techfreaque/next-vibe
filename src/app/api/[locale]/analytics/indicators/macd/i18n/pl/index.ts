import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "MACD",
    description:
      "Zbieżność i rozbieżność średnich kroczących - wskaźnik momentum podążający za trendem",
    fields: {
      source: { label: "Źródło", description: "Wejściowa seria czasowa" },
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: { label: "Zakres", description: "Zakres czasu do obliczenia" },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu do rozgrzewki",
      },
      fastPeriod: {
        label: "Szybki okres",
        description: "Szybki okres EMA (1–100)",
      },
      slowPeriod: {
        label: "Wolny okres",
        description: "Wolny okres EMA (1–200)",
      },
      signalPeriod: {
        label: "Okres sygnału",
        description: "Okres EMA linii sygnału (1–50)",
      },
      macd: {
        label: "MACD",
        description: "Linia MACD (szybka EMA − wolna EMA)",
      },
      signal: {
        label: "Sygnał",
        description: "Linia sygnału (EMA linii MACD)",
      },
      histogram: {
        label: "Histogram",
        description: "Histogram (MACD − sygnał)",
      },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
    },
    success: {
      title: "MACD obliczony",
      description: "Zwrócono serie MACD, sygnału i histogramu",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Obliczenie MACD nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Walidacja nie powiodła się",
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
