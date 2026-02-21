import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pomoc narzędzi — Odkryj dostępne narzędzia AI",
    description:
      "Wyszukuj i odkrywaj wszystkie dostępne narzędzia AI. Użyj query do wyszukiwania po nazwie, opisie lub aliasie. Użyj category do filtrowania po kategorii. Zwraca nazwy narzędzi, opisy, aliasy i metadane.",
    response: {
      title: "Odpowiedź narzędzi AI",
      description: "Lista dostępnych narzędzi AI",
    },
    fields: {
      query: {
        label: "Zapytanie wyszukiwania",
        description:
          "Wyszukaj narzędzia po nazwie, opisie, aliasie lub tagu (bez uwzględniania wielkości liter)",
        placeholder: "np. szukaj, pamięć, pobierz...",
      },
      category: {
        label: "Filtr kategorii",
        description:
          "Filtruj narzędzia po nazwie kategorii (bez uwzględniania wielkości liter)",
      },
      toolName: {
        label: "Nazwa narzędzia (Szczegóły)",
        description:
          "Pełne szczegóły dla konkretnego narzędzia po nazwie lub aliasie. Zwraca schemat parametrów.",
      },
      tools: {
        title: "Dostępne narzędzia",
      },
      totalCount: {
        title: "Łączna liczba narzędzi",
      },
      matchedCount: {
        title: "Liczba dopasowanych narzędzi",
      },
      categories: {
        title: "Kategorie narzędzi",
      },
      hint: {
        title: "Wskazówka użycia",
      },
    },
    submitButton: {
      label: "Szukaj narzędzi",
      loadingText: "Wyszukiwanie...",
    },
    widget: {
      totalTools: "{{count}} narzędzi dostępnych",
      matchedOf: "{{matched}} z {{total}} narzędzi",
      categories: "{{count}} kategorii",
      noToolsFound: "Nie znaleziono narzędzi pasujących do wyszukiwania",
    },
    success: {
      title: "Narzędzia pobrane pomyślnie",
      description: "Dostępne narzędzia AI pobrane",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do narzędzi AI",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono punktu końcowego narzędzi AI",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać narzędzi",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas pobierania narzędzi AI",
      },
    },
  },
  category: "Narzędzia AI",
  tags: {
    tools: "narzędzia",
  },
};
