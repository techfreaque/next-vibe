export const translations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Passwort",
      privateKey: "Privater Schlüssel (PEM)",
      keyAgent: "SSH-Agent",
      local: "Lokaler Rechner",
    },
  },

  errors: {
    connectionNotFound: "Verbindung nicht gefunden",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen — SSH_SECRET_KEY möglicherweise ungültig",
  },

  get: {
    title: "SSH-Verbindung",
    description: "SSH-Verbindungsdetails anzeigen",
    fields: {
      id: {
        label: "Verbindungs-ID",
        description: "Die anzuzeigende Verbindung",
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
        description: "Verbindung konnte nicht geladen werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Konflikt aufgetreten" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
    },
    success: {
      title: "Verbindung geladen",
      description: "Verbindungsdetails abgerufen",
    },
  },
  patch: {
    title: "SSH-Verbindung aktualisieren",
    description: "SSH-Verbindungseinstellungen aktualisieren",
    fields: {
      id: {
        label: "Verbindungs-ID",
        description: "Die zu aktualisierende Verbindung",
      },
      label: {
        label: "Name",
        description: "Anzeigename für diese Verbindung",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Host",
        description: "Hostname oder IP-Adresse",
        placeholder: "1.2.3.4",
      },
      port: { label: "Port", description: "SSH-Port", placeholder: "22" },
      username: {
        label: "Benutzername",
        description: "SSH-Anmeldebenutzer",
        placeholder: "deploy",
      },
      authType: {
        label: "Authentifizierungstyp",
        description: "Authentifizierungsmethode",
      },
      secret: {
        label: "Passwort / Privater Schlüssel",
        description: "Leer lassen um vorhandenes Secret beizubehalten",
      },
      passphrase: {
        label: "Schlüssel-Passphrase",
        description:
          "Leer lassen um vorhandene Passphrase beizubehalten oder zu löschen",
      },
      isDefault: {
        label: "Als Standard setzen",
        description:
          "Diese Verbindung standardmäßig für Terminal-Sitzungen verwenden",
      },
      notes: {
        label: "Notizen",
        description: "Optionale Notizen zu dieser Verbindung",
      },
    },
    response: {
      updatedAt: { title: "Aktualisiert am" },
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
        description: "Verbindung konnte nicht aktualisiert werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Konflikt aufgetreten" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
    },
    success: {
      title: "Verbindung aktualisiert",
      description: "Verbindung erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "SSH-Verbindung löschen",
    description: "Eine SSH-Verbindung löschen",
    fields: {
      id: {
        label: "Verbindungs-ID",
        description: "Die zu löschende Verbindung",
      },
    },
    response: {
      deleted: { title: "Gelöscht" },
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
        description: "Verbindung konnte nicht gelöscht werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Konflikt aufgetreten" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
    },
    success: {
      title: "Verbindung gelöscht",
      description: "Verbindung erfolgreich gelöscht",
    },
  },
  widget: {
    title: "Verbindungsdetails",
    host: "Host",
    user: "Benutzer",
    auth: "Authentifizierung",
    notes: "Notizen",
    saveButton: "Änderungen speichern",
    deleteButton: "Verbindung löschen",
    testButton: "Verbindung testen",
    confirmDelete:
      "Diese Verbindung löschen? Dies kann nicht rückgängig gemacht werden.",
  },
};
