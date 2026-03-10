import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },
  get: {
    title: "Rejestr wskaźników",
    description:
      "Lista wszystkich zarejestrowanych wskaźników dla budowania grafów",
    container: {
      title: "Wskaźniki",
      description: "Wszystkie zarejestrowane wskaźniki",
    },
    response: {
      indicators: "Wskazniki",
      indicator: {
        id: "ID",
        domain: "Domena",
        description: "Opis",
        resolution: "Rozdzielczosc",
        persist: "Trwalosc",
        lookback: "Okres wsteczny",
        inputs: {
          item: "Wejscie",
        },
        isDerived: "Pochodny",
        isMultiValue: "Wielowartosciowy",
      },
    },
    success: {
      title: "Rejestr załadowany",
      description: "Rejestr wskaźników pobrany pomyślnie",
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
        description: "Nie udało się załadować rejestru",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Rejestr nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt zasobów" },
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
