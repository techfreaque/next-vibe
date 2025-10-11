import type { testTranslations as EnglishTestTranslations } from "../../../../en/sections/imapErrors/accounts/test";

export const testTranslations: typeof EnglishTestTranslations = {
  error: {
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry do testowania konta.",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do testowania tego konta.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas testowania połączenia z kontem.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas testowania konta.",
    },
  },
  success: {
    title: "Test połączenia zakończony sukcesem",
    description: "Połączenie z kontem IMAP zostało pomyślnie przetestowane.",
  },
};
