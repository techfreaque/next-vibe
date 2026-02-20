export const translations = {
  delete: {
    title: "Linux-Benutzer löschen",
    description: "OS-Benutzerkonto vom Host löschen",
    fields: {
      removeHome: {
        label: "Heimverzeichnis entfernen",
        description: "Auch das Heimverzeichnis des Benutzers löschen",
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
        description:
          "Systembenutzer oder aktueller Prozessbenutzer kann nicht gelöscht werden",
      },
      server: {
        title: "Serverfehler",
        description: "Benutzer konnte nicht gelöscht werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Benutzer nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: { title: "Nicht gespeicherte Änderungen" },
      conflict: {
        title: "Konflikt",
        description: "Benutzer kann nicht gelöscht werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      timeout: { title: "Timeout", description: "Zeitlimit überschritten" },
    },
    success: {
      title: "Benutzer gelöscht",
      description: "OS-Benutzerkonto erfolgreich gelöscht",
    },
  },
};
