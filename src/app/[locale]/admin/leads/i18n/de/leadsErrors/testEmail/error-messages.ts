import type { translations as EnglishErrorTranslations } from "../../en/leadsErrors/testEmail/error";

export const translations: typeof EnglishErrorTranslations = {
  validation: {
    title: "Test-E-Mail-Validierung fehlgeschlagen",
    description:
      "Überprüfen Sie Ihre Test-E-Mail-Daten und versuchen Sie es erneut",
  },
  unauthorized: {
    title: "Test-E-Mail nicht autorisiert",
    description: "Sie haben keine Berechtigung, Test-E-Mails zu senden",
  },
  server: {
    title: "Test-E-Mail-Serverfehler",
    description:
      "Test-E-Mail konnte aufgrund eines Serverfehlers nicht gesendet werden",
  },
  unknown: {
    title: "Test-E-Mail fehlgeschlagen",
    description:
      "Ein unerwarteter Fehler ist beim Senden der Test-E-Mail aufgetreten",
  },
  templateNotFound: {
    title: "E-Mail-Vorlage nicht gefunden",
    description: "Die angeforderte E-Mail-Vorlage konnte nicht gefunden werden",
  },
  sendingFailed: {
    title: "E-Mail-Versand fehlgeschlagen",
    description: "Die Test-E-Mail konnte nicht gesendet werden",
  },
  invalidConfiguration: {
    title: "Ungültige E-Mail-Konfiguration",
    description: "Die E-Mail-Konfiguration ist ungültig oder unvollständig",
  },
};
