import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/imapErrors/accounts/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    not_found: {
      title: "Konto nie znalezione",
      description: "Konto do aktualizacji nie mogło zostać znalezione.",
    },
    duplicate: {
      title: "Konto już istnieje",
      description: "Konto z tym adresem e-mail już istnieje.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas aktualizacji konta.",
    },
  },
  success: {
    title: "Konto zaktualizowane",
    description: "Konto IMAP zostało pomyślnie zaktualizowane.",
  },
};
