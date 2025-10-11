import type { errorTranslations as EnglishErrorTranslations } from "../../../../en/sections/imapErrors/sync/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  unauthorized: {
    title: "Brak autoryzacji",
    description: "Nie masz uprawnień do wykonania synchronizacji.",
  },
  server: {
    title: "Błąd serwera",
    description: "Wystąpił błąd podczas synchronizacji.",
  },
  unknown: {
    title: "Nieznany błąd",
    description: "Wystąpił nieznany błąd podczas synchronizacji.",
  },
};
