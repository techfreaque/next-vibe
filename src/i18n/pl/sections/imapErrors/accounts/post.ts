import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/imapErrors/accounts/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    duplicate: {
      title: "Konto już istnieje",
      description: "Konto z tym adresem e-mail już istnieje.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas tworzenia konta.",
    },
  },
  success: {
    title: "Konto utworzone",
    description: "Konto IMAP zostało pomyślnie utworzone.",
  },
};
