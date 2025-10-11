import type { listTranslations as EnglishListTranslations } from "../../../../en/sections/imapErrors/accounts/list";

export const listTranslations: typeof EnglishListTranslations = {
  error: {
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry do listowania kont.",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do listowania kont.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas listowania kont.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas listowania kont.",
    },
  },
};
