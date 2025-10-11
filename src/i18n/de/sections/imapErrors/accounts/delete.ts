import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/imapErrors/accounts/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, dieses Konto zu löschen.",
    },
    not_found: {
      title: "Konto nicht gefunden",
      description: "Das zu löschende Konto konnte nicht gefunden werden.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Löschen des Kontos aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Löschen des Kontos aufgetreten.",
    },
  },
  success: {
    title: "Konto gelöscht",
    description: "IMAP-Konto wurde erfolgreich gelöscht.",
  },
};
