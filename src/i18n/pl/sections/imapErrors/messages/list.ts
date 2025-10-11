import type { listTranslations as EnglishListTranslations } from "../../../../en/sections/imapErrors/messages/list";

export const listTranslations: typeof EnglishListTranslations = {
  error: {
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry dla listy wiadomości.",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do wyświetlania wiadomości.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas wyświetlania wiadomości.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas wyświetlania wiadomości.",
    },
  },
  success: {
    title: "Wiadomości wyświetlone",
    description: "Wiadomości zostały pomyślnie wyświetlone.",
  },
};
