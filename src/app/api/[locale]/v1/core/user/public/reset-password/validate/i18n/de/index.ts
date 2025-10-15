import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Passwort-Reset-Token validieren",
  description: "Endpunkt zur Validierung des Passwort-Reset-Tokens",
  tag: "Passwort-Reset-Validierung",
  groups: {
    tokenInput: {
      title: "Token-Validierung",
      description: "Geben Sie das Passwort-Reset-Token zur Validierung ein",
    },
  },
  fields: {
    token: {
      label: "Reset-Token",
      description: "Passwort-Reset-Token aus der E-Mail",
      placeholder: "Reset-Token eingeben",
      help: "Geben Sie das Token ein, das Sie per E-Mail erhalten haben",
    },
  },
  response: {
    title: "Validierungsergebnis",
    description: "Token-Validierungsantwort",
    valid: "Token gültig",
    message: "Validierungsnachricht",
    validationMessage: "Reset-Token-Validierung abgeschlossen",
    userId: "Benutzer-ID",
    expiresAt: "Token läuft ab am",
    nextSteps: {
      item: "Nächste Schritte nach Validierung",
      steps: [
        "Fahren Sie fort, um Ihr neues Passwort festzulegen",
        "Wählen Sie ein starkes, einzigartiges Passwort",
      ],
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Token-Validierung fehlgeschlagen",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Ungültiges oder abgelaufenes Token",
    },
    internal: {
      title: "Interner Fehler",
      description: "Interner Serverfehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler aufgetreten",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Token nicht gefunden",
    },
    unsaved: {
      title: "Ungespeicherte Änderungen",
      description: "Ungespeicherte Änderungen erkannt",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
  },
  success: {
    title: "Token gültig",
    description: "Passwort-Reset-Token ist gültig",
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
