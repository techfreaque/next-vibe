export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Benutzer",
  },
  post: {
    title: "Benutzer erstellen",
    description: "Erstellt einen neuen Benutzer in einer Corvina-Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    username: {
      label: "Benutzername",
      description: "Eindeutiger Benutzername (min. 3 Zeichen).",
      placeholder: "muster",
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
    password: {
      label: "Passwort",
      description:
        "Startpasswort (min. 8 Zeichen). Leer lassen zum Überspringen.",
      placeholder: "••••••••",
    },
    temporaryPassword: {
      label: "Temporäres Passwort",
      description: "Benutzer muss Passwort beim ersten Login ändern.",
    },
    passwordChangeInvitation: {
      label: "Einladung senden",
      description: "Einladungs-E-Mail zum Passwort ändern senden.",
    },
    serviceAccount: {
      label: "Dienstkonto",
      description:
        "Diesen Benutzer als nicht-menschliches Dienstkonto markieren.",
    },
    emailVerified: {
      label: "E-Mail verifiziert",
      description: "E-Mail-Adresse als bereits verifiziert markieren.",
    },
    response: {
      id: "ID",
      username: "Benutzername",
      email: "E-Mail",
      firstName: "Vorname",
      lastName: "Nachname",
      serviceAccount: "Dienstkonto",
      mfaEnabled: "MFA",
      owner: "Eigentümer",
    },
    submitButton: {
      label: "Benutzer erstellen",
      loadingText: "Wird erstellt…",
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
          "Der API-Schlüssel hat keine Berechtigung zum Erstellen von Benutzern.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Benutzer mit diesem Benutzernamen oder dieser E-Mail existiert bereits.",
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
      title: "Erstellt",
      description: "Benutzer erfolgreich erstellt.",
    },
  },
};
