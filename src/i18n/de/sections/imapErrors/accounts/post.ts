import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/imapErrors/accounts/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    duplicate: {
      title: "Konto bereits vorhanden",
      description: "Ein Konto mit dieser E-Mail-Adresse existiert bereits.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Erstellen des Kontos aufgetreten.",
    },
  },
  success: {
    title: "Konto erstellt",
    description: "IMAP-Konto wurde erfolgreich erstellt.",
  },
};
