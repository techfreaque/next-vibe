import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  get: {
    title: "Generuj klucz bezpieczeństwa",
    description:
      "Generuj kryptograficznie bezpieczny losowy 64-znakowy klucz hex",
    tags: {
      generateKey: "Generuj klucz",
    },
    response: {
      key: {
        title: "Wygenerowany klucz",
      },
    },
    success: {
      title: "Klucz wygenerowany",
      description: "Bezpieczny klucz wygenerowany pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wygenerować klucza",
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
        description: "Wystąpił konflikt",
      },
    },
  },
};
