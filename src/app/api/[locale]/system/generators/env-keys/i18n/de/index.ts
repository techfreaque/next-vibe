import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatoren",

  post: {
    title: "Env-Schlüssel generieren",
    description:
      "Flache Env-Schlüssel-Metadatendatei für die Settings-Definition generieren",
    container: {
      title: "Env-Schlüssel-Generierung",
      description: "Parameter für die Env-Schlüssel-Generierung konfigurieren",
    },
    fields: {
      outputFile: {
        label: "Ausgabedatei",
        description: "Pfad für die generierte Env-Schlüssel-Datei",
      },
      dryRun: {
        label: "Trockenlauf",
        description: "Vorschau ohne Dateien zu schreiben",
      },
      duration: { title: "Dauer" },
      success: { title: "Erfolg" },
      message: { title: "Nachricht" },
      keysFound: { title: "Gefundene Schlüssel" },
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
      server: { title: "Serverfehler", description: "Interner Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: { title: "Verboten", description: "Zugriff verboten" },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
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
