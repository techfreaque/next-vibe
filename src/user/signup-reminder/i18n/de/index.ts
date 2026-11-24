import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nutzer",

  post: {
    title: "Registrierungs-Erinnerung",
    titleShort: "Registrierungs-Erinnerung",
    description:
      "Schickt eine Erinnerung an Leute, die die Registrierung begonnen, ihre E-Mail aber nie bestätigt haben. Die Erinnerung enthält einen neuen Code und einen Link, der 24 Stunden gilt.",
    tag: "Registrierungs-Erinnerung",
    container: {
      title: "Registrierungs-Erinnerung",
      description:
        "Offene Registrierungen, letzte Mail vor 2 bis 24 Stunden, nie bestätigt",
    },
    fields: {
      batchSize: {
        label: "Batch-Größe",
        description: "Maximale Erinnerungen pro Lauf",
      },
      dryRun: {
        label: "Probelauf",
        description: "Zählt, wer eine Erinnerung bekäme, ohne zu senden",
      },
    },
    response: {
      candidates: "Unbestätigte Registrierungen im Zeitfenster",
      sent: "Erinnerungen gesendet",
      skipped: "Übersprungen",
      failed: "Fehlgeschlagen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Nur Admins können Registrierungs-Erinnerungen senden",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Senden der Registrierungs-Erinnerungen fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Einstellungen",
      },
    },
    success: {
      title: "Erinnerungen verarbeitet",
      description: "Registrierungs-Erinnerungen verarbeitet",
    },
  },
  task: {
    name: "Registrierungserinnerung",
    description:
      "Alle 30 Minuten: eine Erinnerung an Registrierungen, die 2 Stunden nach der letzten Mail noch unbestätigt sind",
  },
};
