import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  get: {
    title: "Eksportuj środowisko produkcyjne",
    description:
      "Generuje plik .env gotowy do wdrożenia z odszyfrowanymi wartościami, instrukcjami wdrożenia i listą kontrolną",
    tags: {
      exportEnv: "Eksportuj env",
    },
    response: {
      content: {
        title: "Zawartość pliku env",
      },
      filename: {
        title: "Nazwa pliku",
      },
    },
    success: {
      title: "Env wyeksportowany",
      description: "Plik env dla produkcji wygenerowany pomyślnie",
    },
    widget: {
      copy: "Kopiuj do schowka",
      copied: "Skopiowano!",
      download: "Pobierz .env.prod",
      instructions: "Skopiuj ten plik na serwer i uruchom ponownie aplikację.",
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
        description: "Ustawienia nie znalezione",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wygenerować pliku env",
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
