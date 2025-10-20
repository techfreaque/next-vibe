import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Task-Index generieren",
    description: "Task-Index-Dateien generieren",
    container: {
      title: "Task-Index-Generierung",
      description: "Parameter für Task-Index-Generierung konfigurieren",
    },
    fields: {
      outputDir: {
        label: "Ausgabeverzeichnis",
        description: "Verzeichnis für generierte Task-Index-Dateien",
      },
      verbose: {
        label: "Ausführliche Ausgabe",
        description: "Ausführliche Protokollierung aktivieren",
      },
      duration: {
        title: "Dauer",
      },
      success: {
        title: "Erfolg",
      },
      message: {
        title: "Nachricht",
      },
      tasksFound: {
        title: "Gefundene Tasks",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
