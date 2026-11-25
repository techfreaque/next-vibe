import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Zwroty (USD)",
    titleShort: "Zwroty",
    description:
      "Udane zwroty w okresie, w przybliżeniu w USD (EUR i PLN po stałych kursach). Bez kont adminów.",
    fields: {
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: {
        label: "Zakres",
        description: "Zakres czasu do zapytania",
      },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu",
      },
      result: {
        label: "Zwroty (USD)",
        description: "Wyjściowa seria czasowa",
      },
      meta: {
        label: "Meta",
        description: "Metadane wykonania węzła",
      },
    },
    success: {
      title: "Obliczono zwroty",
      description: "Zwrócono serię zwrotów",
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
        description: "Zapytanie nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Nieprawidłowe parametry żądania",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt",
      },
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
