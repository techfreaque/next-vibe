export const translations = {
  get: {
    title: "Datei abrufen",
    description: "Hochgeladene Datei abrufen",
    success: {
      title: "Datei abgerufen",
      description: "Datei erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Dateianforderungsparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Datei konnte aufgrund eines Netzwerkfehlers nicht abgerufen werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich um auf diese Datei zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung auf diese Datei zuzugreifen",
      },
      notFound: {
        title: "Datei nicht gefunden",
        description:
          "Die angeforderte Datei wurde nicht gefunden oder der Zugriff wurde verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Datei konnte aufgrund eines Serverfehlers nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
  },
  errors: {
    fileNotFound: "Datei nicht gefunden oder Zugriff verweigert",
  },
};
