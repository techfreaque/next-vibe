export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Benutzer",
  },
  get: {
    title: "Benutzer abrufen",
    description: "Lädt einen einzelnen Corvina-Benutzer per ID.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    userId: {
      label: "Benutzer-ID",
      description: "Numerische Corvina-Benutzer-ID.",
    },
    response: {
      id: "ID",
      username: "Benutzername",
      email: "E-Mail",
      firstName: "Vorname",
      lastName: "Nachname",
      country: "Land",
      serviceAccount: "Dienstkonto",
      mfaEnabled: "MFA aktiv",
      owner: "Eigentümer",
      groupPoliciesEnabled: "Gruppenrichtlinien",
      userImpersonation: "Identitätswechsel",
    },
    widget: {
      edit: "Bearbeiten",
      delete: "Löschen",
      sections: {
        identity: "Identität",
        flags: "Berechtigungen",
      },
      labels: {
        username: "Benutzername",
        email: "E-Mail",
        name: "Name",
        country: "Land",
        owner: "Eigentümer",
      },
      badges: {
        serviceAccount: "Dienstkonto",
        mfaEnabled: "MFA aktiv",
        mfaDisabled: "Kein MFA",
        groupPolicies: "Gruppenrichtlinien",
        impersonation: "Identitätswechsel",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Der API-Schlüssel hat keinen Zugriff auf diesen Benutzer.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Benutzer mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es liegen nicht gespeicherte Änderungen vor.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Erfolg",
      description: "Benutzer erfolgreich geladen.",
    },
  },
  put: {
    title: "Benutzer aktualisieren",
    description: "Aktualisiert einen bestehenden Corvina-Benutzer.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    userId: {
      label: "Benutzer-ID",
      description: "Numerische Corvina-Benutzer-ID zum Aktualisieren.",
    },
    email: {
      label: "E-Mail",
      description: "E-Mail-Adresse des Benutzers.",
      placeholder: "muster@beispiel.de",
    },
    firstName: {
      label: "Vorname",
      description: "Vorname des Benutzers.",
      placeholder: "Max",
    },
    lastName: {
      label: "Nachname",
      description: "Nachname des Benutzers.",
      placeholder: "Muster",
    },
    country: {
      label: "Land",
      description: "Ländercode des Benutzers.",
      placeholder: "DE",
    },
    defaultHomePage: {
      label: "Standard-Startseite",
      description: "URL der Standard-Startseite des Benutzers.",
      placeholder: "/dashboard",
    },
    groupPoliciesEnabled: {
      label: "Gruppenrichtlinien aktiv",
      description:
        "Gruppenbasierte Richtliniendurchsetzung für diesen Benutzer aktivieren.",
    },
    userImpersonation: {
      label: "Identitätswechsel erlauben",
      description: "Diesem Benutzer erlauben, andere Benutzer zu vertreten.",
    },
    submitButton: {
      label: "Änderungen speichern",
      loadingText: "Speichern…",
    },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description: "Corvina hat die Aktualisierung abgelehnt.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Der API-Schlüssel hat keinen Schreibzugriff auf diesen Benutzer.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Benutzer mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt für diese Aktualisierung.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es liegen nicht gespeicherte Änderungen vor.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Gespeichert",
      description: "Benutzer erfolgreich aktualisiert.",
    },
  },
  delete: {
    title: "Benutzer löschen",
    description: "Löscht einen Corvina-Benutzer dauerhaft.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    userId: {
      label: "Benutzer-ID",
      description: "Numerische Corvina-Benutzer-ID zum Löschen.",
    },
    widget: {
      warning:
        "Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden.",
      confirmButton: "Benutzer löschen",
      cancelButton: "Abbrechen",
      deletedTitle: "Benutzer gelöscht",
      deletedDescription: "Der Benutzer wurde dauerhaft entfernt.",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Der API-Schlüssel hat keine Berechtigung zum Löschen dieses Benutzers.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Benutzer mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es liegen nicht gespeicherte Änderungen vor.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Gelöscht",
      description: "Benutzer erfolgreich gelöscht.",
    },
  },
};
