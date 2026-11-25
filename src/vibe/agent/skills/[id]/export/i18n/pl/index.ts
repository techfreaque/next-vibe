import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Narzędzia AI",
  tags: {
    skills: "skille",
  },
  get: {
    title: "Eksportuj kartę postaci",
    titleShort: "Eksportuj kartę",
    description:
      "Eksportuje skill jako kartę postaci V2 w formacie JSON. Zaimportujesz ją w SillyTavern, RisuAI, Chub i każdej aplikacji zgodnej z formatem Tavern albo zachowasz jako kopię zapasową. Działa dla Twoich skilli, publicznych skilli społeczności i publicznych skilli wbudowanych. Karta podaje autora i link do strony skilla.",
    dynamicTitle: "Eksport: {{name}}",
    id: {
      label: "Skill",
      description: "Skill do eksportu",
    },
    widget: {
      intro:
        "Twoja postać jako plik, który należy do Ciebie. Karta postaci V2, format importowany przez SillyTavern, RisuAI i Chub.",
      included:
        "W środku: imię, pełny prompt postaci, tagline, opis, autor i link tutaj.",
      download: "Pobierz kartę",
      copy: "Kopiuj JSON",
      copied: "Skopiowano",
    },
    card: {
      skillPage: "Strona skilla: {{url}}",
    },
    response: {
      name: { content: "Nazwa" },
      fileName: { content: "Nazwa pliku" },
      card: { content: "JSON karty" },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź ID skilla.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem.",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby wyeksportować ten skill.",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie możesz wyeksportować tego skilla.",
      },
      notFound: {
        title: "Nie znaleziono skilla",
        description:
          "Ten skill nie istnieje albo nie jest dla Ciebie widoczny.",
      },
      server: {
        title: "Eksport się nie udał",
        description:
          "Coś poszło nie tak przy tworzeniu karty. Spróbuj ponownie.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany.",
      },
      conflict: {
        title: "Konflikt",
        description: "Skill zmienił się podczas eksportu. Spróbuj ponownie.",
      },
    },
    success: {
      title: "Karta gotowa",
      description: "Pobierz ją albo skopiuj JSON.",
    },
  },
};
