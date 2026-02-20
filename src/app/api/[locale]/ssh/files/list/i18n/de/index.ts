export const translations = {
  get: {
    title: "Dateien auflisten",
    description:
      "Verzeichnisinhalt auf dem lokalen Rechner oder via SSH auflisten",
    fields: {
      connectionId: {
        label: "Verbindung",
        description: "SSH-Verbindung (leer lassen für lokal)",
        placeholder: "Lokal",
      },
      path: {
        label: "Pfad",
        description: "Aufzulistendes Verzeichnis",
        placeholder: "~",
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
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
      server: {
        title: "Serverfehler",
        description: "Verzeichnis konnte nicht aufgelistet werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verzeichnis nicht gefunden",
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
      timeout: {
        title: "Timeout",
        description: "Anfrage hat das Zeitlimit überschritten",
      },
    },
    success: {
      title: "Verzeichnis aufgelistet",
      description: "Verzeichnisinhalt abgerufen",
    },
  },
  widget: {
    title: "Datei-Browser",
    emptyDir: "Leeres Verzeichnis",
    loading: "Wird geladen...",
    backButton: "Zurück",
    nameCol: "Name",
    sizeCol: "Größe",
    modifiedCol: "Geändert",
    permissionsCol: "Berechtigungen",
    file: "Datei",
    directory: "Verzeichnis",
    symlink: "Symlink",
  },
};
