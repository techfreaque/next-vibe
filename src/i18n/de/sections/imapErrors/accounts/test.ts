import type { testTranslations as EnglishTestTranslations } from "../../../../en/sections/imapErrors/accounts/test";

export const testTranslations: typeof EnglishTestTranslations = {
  error: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Parameter für Konto-Test bereitgestellt.",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, dieses Konto zu testen.",
    },
    server: {
      title: "Server-Fehler",
      description:
        "Ein Fehler ist beim Testen der Konto-Verbindung aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Testen des Kontos aufgetreten.",
    },
  },
  success: {
    title: "Verbindungstest erfolgreich",
    description: "IMAP-Konto-Verbindung wurde erfolgreich getestet.",
  },
};
