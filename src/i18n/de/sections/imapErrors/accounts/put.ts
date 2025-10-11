import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/imapErrors/accounts/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    not_found: {
      title: "Konto nicht gefunden",
      description: "Das zu aktualisierende Konto konnte nicht gefunden werden.",
    },
    duplicate: {
      title: "Konto bereits vorhanden",
      description: "Ein Konto mit dieser E-Mail-Adresse existiert bereits.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Aktualisieren des Kontos aufgetreten.",
    },
  },
  success: {
    title: "Konto aktualisiert",
    description: "IMAP-Konto wurde erfolgreich aktualisiert.",
  },
};
