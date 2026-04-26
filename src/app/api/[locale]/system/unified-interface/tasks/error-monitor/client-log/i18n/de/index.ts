export const translations = {
  category: "System",

  post: {
    title: "Client-Fehler melden",
    description:
      "Client-seitigen Fehler oder Warnung im Fehlerprotokoll speichern",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      level: {
        label: "Level",
        description: "Log-Level: error oder warn",
      },
      message: {
        label: "Nachricht",
        description: "Fehlermeldung",
        placeholder: "Ein Fehler ist aufgetreten",
      },
      metadata: {
        label: "Metadaten",
        description: "Zusätzlicher strukturierter Kontext",
      },
    },
    response: {
      ok: {
        title: "Akzeptiert",
      },
    },
    success: {
      title: "Gespeichert",
      description: "Client-Fehler gespeichert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Fehlerprotokoll konnte nicht gespeichert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        titleChanges: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
  },
};
