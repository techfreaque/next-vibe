export const translations = {
  category: "Generatoren",

  post: {
    title: "Prompt-Fragmente generieren",
    description: "Prompt-Fragmente-Index mit dynamischen Importen generieren",
    container: {
      title: "Prompt-Fragmente-Generierung",
      description: "Konfiguration der Prompt-Fragmente-Index-Generierung",
    },
    fields: {
      outputFile: {
        label: "Ausgabedatei",
        description: "Pfad zur generierten prompt-fragments.ts-Datei",
      },
      dryRun: {
        label: "Testlauf",
        description: "Vorschau ohne Dateien zu schreiben",
      },
      fragmentsFound: {
        title: "Gefundene Fragmente",
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
        description: "Zugriff verweigert",
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
        description: "Interner Serverfehler",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
