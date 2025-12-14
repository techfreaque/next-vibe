export const translations = {
  post: {
    title: "Umgebungs-Generator",
    description: "Generiert konsolidierte Umgebungskonfigurationsdateien",
    form: {
      title: "Umgebungskonfiguration",
      description: "Konfigurieren Sie die Parameter der Umgebungsgenerierung",
    },
    fields: {
      outputDir: {
        label: "Ausgabeverzeichnis",
        description: "Verzeichnis zum Schreiben der generierten Dateien",
      },
      verbose: {
        label: "Ausführlich",
        description: "Zeige detaillierte Ausgabe",
      },
      dryRun: {
        label: "Testlauf",
        description: "Vorschau ohne Dateien zu schreiben",
      },
      success: {
        label: "Erfolg",
      },
      message: {
        label: "Nachricht",
      },
      serverEnvFiles: {
        label: "Server-Env-Dateien",
      },
      clientEnvFiles: {
        label: "Client-Env-Dateien",
      },
      duration: {
        label: "Dauer",
      },
      outputPaths: {
        label: "Ausgabepfade",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Env-Dateiexporte erkannt",
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
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Umgebungsdateien erfolgreich generiert",
    },
  },
  tags: {
    env: "Umgebung",
  },
  error: {
    validation_failed: "Env-Datei-Validierung fehlgeschlagen",
    generation_failed: "Env-Generierung fehlgeschlagen",
  },
  success: {
    generated: "Umgebungsdateien erfolgreich generiert",
  },
};
