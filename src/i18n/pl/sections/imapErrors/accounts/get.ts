import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/accounts/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    not_found: {
      title: "Konto nie znalezione",
      description: "Żądane konto IMAP nie mogło zostać znalezione.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania konta.",
    },
  },
  success: {
    title: "Konto pobrane",
    description: "Konto IMAP zostało pomyślnie pobrane.",
  },
};
