import type { healthTranslations as EnglishHealthTranslations } from "../../../en/sections/imapErrors/health";

export const healthTranslations: typeof EnglishHealthTranslations = {
  get: {
    success: {
      title: "Gesundheitsstatus abgerufen",
      description: "IMAP-Server-Gesundheitsstatus erfolgreich abgerufen.",
    },
  },
  unauthorized: {
    title: "Nicht autorisiert",
    description: "Sie sind nicht berechtigt, den Gesundheitsstatus anzuzeigen.",
  },
  server: {
    title: "Serverfehler",
    description:
      "Beim Abrufen des Gesundheitsstatus ist ein Fehler aufgetreten.",
  },
  unknown: {
    title: "Unbekannter Fehler",
    description:
      "Beim Abrufen des Gesundheitsstatus ist ein unbekannter Fehler aufgetreten.",
  },
  accounts: {
    failed:
      "Fehler beim Abrufen der Kontostatistiken für die Gesundheitsüberwachung",
  },
};
