export const translations = {
  post: {
    title: "Datei schreiben",
    description:
      "Datei auf dem lokalen Rechner oder via SSH schreiben oder überschreiben",
    fields: {
      connectionId: {
        label: "Verbindung",
        description: "SSH-Verbindung (leer lassen für lokal)",
        placeholder: "Lokal",
      },
      path: {
        label: "Pfad",
        description: "Zu schreibender Dateipfad",
        placeholder: "/tmp/output.txt",
      },
      content: {
        label: "Inhalt",
        description: "Zu schreibender Dateiinhalt",
        placeholder: "Dateiinhalt eingeben...",
      },
      createDirs: {
        label: "Verzeichnisse erstellen",
        description:
          "Übergeordnete Verzeichnisse erstellen falls nicht vorhanden",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugang erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Schreibberechtigung",
      },
      server: {
        title: "Serverfehler",
        description: "Datei konnte nicht geschrieben werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Übergeordnetes Verzeichnis nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: { title: "Nicht gespeicherte Änderungen" },
      conflict: { title: "Konflikt", description: "Konflikt aufgetreten" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      timeout: { title: "Timeout", description: "Zeitlimit überschritten" },
    },
    success: {
      title: "Datei geschrieben",
      description: "Datei erfolgreich geschrieben",
    },
  },
  widget: {
    title: "Datei-Schreiber",
    writeButton: "Datei schreiben",
    writing: "Schreibt...",
    bytesWritten: "Geschriebene Bytes",
    placeholder: "Dateiinhalt eingeben...",
  },
};
