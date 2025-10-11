import type { listTranslations as EnglishListTranslations } from "../../../../en/sections/imapErrors/folders/list";

export const listTranslations: typeof EnglishListTranslations = {
  error: {
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry dla listy folderów.",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do wyświetlania folderów.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas wyświetlania folderów.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas wyświetlania folderów.",
    },
  },
  success: {
    title: "Foldery wyświetlone",
    description: "Foldery zostały pomyślnie wyświetlone.",
  },
};
