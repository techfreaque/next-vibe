import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  get: {
    title: "Produktionsumgebung exportieren",
    description:
      "Generiert eine produktionsbereite .env-Datei mit entschlüsselten Werten, Deployment-Anleitung und Checkliste",
    tags: {
      exportEnv: "Env exportieren",
    },
    response: {
      content: {
        title: "Env-Dateiinhalt",
      },
      filename: {
        title: "Dateiname",
      },
    },
    success: {
      title: "Env exportiert",
      description: "Produktions-Env-Datei erfolgreich generiert",
    },
    widget: {
      copy: "In Zwischenablage kopieren",
      copied: "Kopiert!",
      download: ".env.prod herunterladen",
      instructions:
        "Kopieren Sie diese Datei auf Ihren Server und starten Sie die Anwendung neu.",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Einstellungen nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Env-Datei konnte nicht generiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
  },
};
