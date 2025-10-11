import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/sync/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania statusu synchronizacji.",
    },
  },
};
