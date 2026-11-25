import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Narzędzia AI",
  tags: {
    skills: "skille",
  },
  enums: {
    platform: {
      characterAi: "Character.AI",
      talkie: "Talkie",
      characterCard: "Karta postaci",
    },
    visibility: {
      private: "Prywatna",
      unlisted: "Poza listą",
      public: "Publiczna",
    },
  },
  post: {
    title: "Importuj postać z linku",
    titleShort: "Import z linku",
    description:
      "Importuje postać z publicznego linku Character.AI (character.ai, c.ai) lub Talkie (talkie-ai.com). Kopiuje nazwę, awatar, powitanie, opis, definicję i tagi do nowej postaci, która należy do Ciebie, podaje oryginalnego twórcę i link do źródła. Ponowny import tego samego linku zwraca istniejącą postać.",
    dynamicTitle: "Import: {{url}}",
    intro:
      "Wklej publiczny link do postaci. Kopiujemy to, co strona pokazuje publicznie, i podajemy oryginalnego twórcę.",
    supported: "Działa z Character.AI i Talkie.",
    url: {
      label: "Link do postaci",
      description: "Publiczny link do strony postaci",
      placeholder: "https://character.ai/character/...",
      validation: {
        invalid: "Wklej pełny link zaczynający się od https://",
      },
    },
    visibility: {
      label: "Widoczność",
      description:
        "Prywatna: tylko Ty. Poza listą: nie widać jej na publicznej liście. Publiczna: widoczna dla wszystkich.",
    },
    response: {
      id: { content: "ID postaci" },
      name: { content: "Nazwa" },
      platform: { content: "Źródło" },
      creatorName: { content: "Oryginalny twórca" },
      sourceUrl: { content: "Link źródłowy" },
      avatarUrl: { content: "Awatar" },
      alreadyImported: { content: "Już zaimportowana" },
      importedFields: { content: "Zaimportowano" },
    },
    fields: {
      name: "nazwa",
      avatar: "awatar",
      greeting: "powitanie",
      description: "opis",
      definition: "definicja",
      tags: "tagi",
    },
    result: {
      imported: "{{name}} jest gotowa.",
      alreadyImported:
        "{{name}} masz już zaimportowaną. Otwieramy Twoją kopię.",
      credit: "Oryginalnie od {{creator}} na {{platform}}",
      creditUnknown: "Zaimportowano z {{platform}}",
      cardCredit: "Autor karty: {{creator}}",
      cardCreditUnknown: "Zaimportowano z karty postaci",
      fieldsList: "Zaimportowano: {{fields}}",
      openSkill: "Otwórz postać",
      importAnother: "Importuj kolejną",
    },
    errors: {
      validation: {
        title: "Nieprawidłowy link",
        description: "Wklej pełny publiczny link do postaci.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem.",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby importować postacie.",
      },
      forbidden: {
        title: "Brak uprawnień",
        description: "Twoje konto nie może importować postaci.",
      },
      notFound: {
        title: "Nie znaleziono postaci",
        description:
          "Strona nie pokazuje publicznych danych postaci. Może być prywatna, usunięta albo wymagać logowania.",
      },
      server: {
        title: "Import nieudany",
        description: "Coś poszło nie tak podczas importu. Spróbuj ponownie.",
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
        title: "Już zaimportowana",
        description: "Ta postać jest już zaimportowana.",
      },
      unsupported:
        "Ten link nie jest obsługiwany. Wklej link do postaci z Character.AI (character.ai, c.ai) lub Talkie (talkie-ai.com).",
      blocked:
        "{{platform}} zablokował żądanie. Spróbuj za kilka minut albo stwórz postać ręcznie.",
      noPublicData:
        "{{platform}} nie pokazuje publicznych danych tej postaci. Może być prywatna, usunięta albo wymagać logowania.",
      rateLimited:
        "Za dużo importów. Odczekaj {{seconds}} s i spróbuj ponownie.",
      notConfigured:
        "Strony {{platform}} wymagają pobierania stron, które nie jest skonfigurowane na tym serwerze.",
    },
    success: {
      title: "Postać zaimportowana",
      description: "Twoja kopia jest gotowa do rozmowy.",
    },
    backButton: {
      label: "Wstecz",
    },
    submitButton: {
      label: "Importuj",
      loadingText: "Importowanie...",
    },
  },
};
