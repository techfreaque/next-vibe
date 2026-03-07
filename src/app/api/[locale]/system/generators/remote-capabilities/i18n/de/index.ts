export const translations = {
  category: "Generatoren",

  post: {
    title: "Remote-Fähigkeiten generieren",
    description:
      "Remote-Fähigkeits-Snapshot-Dateien für Tool-Discovery generieren",
    container: {
      title: "Remote-Fähigkeiten Konfiguration",
    },
    fields: {
      outputDir: {
        label: "Ausgabeverzeichnis",
        description: "Verzeichnis für Fähigkeitsdateien",
      },
      dryRun: {
        label: "Testlauf",
        description: "Vorschau ohne Schreiben",
      },
      success: { title: "Erfolg" },
      message: { title: "Nachricht" },
      duration: { title: "Dauer" },
      endpointsFound: { title: "Endpunkte gefunden" },
      filesWritten: { title: "Dateien geschrieben" },
    },
    success: {
      title: "Erfolg",
      description: "Remote-Fähigkeiten erfolgreich generiert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      server: { title: "Serverfehler", description: "Interner Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung fehlgeschlagen",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Ressourcenkonflikt" },
    },
  },
  success: {
    generated: "Remote-Fähigkeiten erfolgreich generiert",
  },
};
