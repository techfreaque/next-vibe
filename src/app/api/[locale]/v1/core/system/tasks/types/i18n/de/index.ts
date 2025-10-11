import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Aufgabentypen",
    description: "Aufgabentyp-Definitionen und Metadaten abrufen",
    container: {
      title: "Aufgabentypen-Verwaltung",
      description: "Aufgabentyp-Definitionen verwalten und abrufen",
    },
    fields: {
      operation: {
        label: "Operation",
        description: "Art der auszuführenden Operation",
      },
      category: {
        label: "Kategorie",
        description: "Aufgabenkategorie zum Filtern",
      },
      format: {
        label: "Format",
        description: "Ausgabeformat für die Antwort",
      },
    },
    operation: {
      list: "Typen auflisten",
      validate: "Typen validieren",
      export: "Typen exportieren",
    },
    category: {
      cron: "Cron-Aufgaben",
      side: "Nebenaufgaben",
      config: "Konfiguration",
      execution: "Ausführung",
    },
    format: {
      json: "JSON",
      typescript: "TypeScript",
      schema: "Schema",
    },
    response: {
      success: {
        title: "Erfolg",
      },
      types: {
        title: "Typen",
      },
      metadata: {
        title: "Metadaten",
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
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
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
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Operation erfolgreich abgeschlossen",
    },
  },
};
