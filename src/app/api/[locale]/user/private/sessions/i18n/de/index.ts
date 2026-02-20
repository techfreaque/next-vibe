export const translations = {
  list: {
    title: "Meine Sitzungen",
    description: "Alle aktiven Sitzungen für Ihr Konto auflisten",
    tag: "Sitzungen",
    response: {
      sessions: "Sitzungen",
    },
    success: {
      title: "Sitzungen abgerufen",
      description: "Ihre aktiven Sitzungen wurden abgerufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
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
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
    },
  },
  create: {
    title: "Sitzungstoken erstellen",
    description:
      "Einen benannten Sitzungstoken für den programmatischen Zugriff erstellen",
    tag: "Sitzungen",
    form: {
      name: "Token-Name",
      namePlaceholder: "z.B. Mein Agent-Bot",
    },
    response: {
      token: "Token",
      id: "Sitzungs-ID",
      name: "Name",
      message: "Kopieren Sie diesen Token — er wird nicht wieder angezeigt",
    },
    success: {
      title: "Sitzung erstellt",
      description: "Ihr Sitzungstoken wurde erstellt",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
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
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
    },
  },
  revoke: {
    title: "Sitzung widerrufen",
    description: "Einen Sitzungstoken nach ID widerrufen",
    tag: "Sitzungen",
    response: {
      message: "Sitzung widerrufen",
    },
    success: {
      title: "Sitzung widerrufen",
      description: "Die Sitzung wurde widerrufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
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
        description: "Sitzung nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
    },
  },
};
