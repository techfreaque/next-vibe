import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Clamp",
    description:
      "Ograniczenie wartości do zakresu [min, max] - przycina wartości odstające",
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
      min: {
        label: "Min",
        description: "Wartość minimalna (dolna granica)",
      },
      max: {
        label: "Max",
        description: "Wartość maksymalna (górna granica)",
      },
      result: { label: "Ograniczona", description: "Wyjściowa seria czasowa" },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
    },
    success: {
      title: "Clamp obliczona",
      description: "Ograniczona seria zwrócona",
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
        description: "Obliczenie clamp nie powiodło się",
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
