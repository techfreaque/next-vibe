import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/imapErrors/accounts/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do usunięcia tego konta.",
    },
    not_found: {
      title: "Konto nie znalezione",
      description: "Konto do usunięcia nie mogło zostać znalezione.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas usuwania konta.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas usuwania konta.",
    },
  },
  success: {
    title: "Konto usunięte",
    description: "Konto IMAP zostało pomyślnie usunięte.",
  },
};
