import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Nowi płacący klienci",
    titleShort: "Nowi płacący",
    description:
      "Użytkownicy, których pierwsza w historii płatność (pakiet lub subskrypcja) wypadła w tym okresie. Liczy osoby, nie płatności. Bez kont adminów.",
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
        label: "Nowi płacący klienci",
        description: "Wyjściowa seria czasowa",
      },
      meta: {
        label: "Meta",
        description: "Metadane wykonania węzła",
      },
    },
    success: {
      title: "Obliczono nowych płacących klientów",
      description: "Zwrócono serię nowych płacących klientów",
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
