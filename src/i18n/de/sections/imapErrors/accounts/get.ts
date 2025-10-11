import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/accounts/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    not_found: {
      title: "Konto nicht gefunden",
      description: "Das angeforderte IMAP-Konto konnte nicht gefunden werden.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Abrufen des Kontos aufgetreten.",
    },
  },
  success: {
    title: "Konto abgerufen",
    description: "IMAP-Konto wurde erfolgreich abgerufen.",
  },
};
