import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/imapErrors/sync/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    invalid_accounts: {
      title: "Nieprawidłowe konta",
      description:
        "Jedno lub więcej określonych kont nie mogło zostać znalezionych.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas synchronizacji.",
    },
  },
};
