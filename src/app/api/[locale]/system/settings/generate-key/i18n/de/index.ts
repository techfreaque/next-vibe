import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  get: {
    title: "Sicherheitsschlüssel generieren",
    description:
      "Einen kryptografisch sicheren zufälligen 64-stelligen Hex-Schlüssel generieren",
    tags: {
      generateKey: "Schlüssel generieren",
    },
    response: {
      key: {
        title: "Generierter Schlüssel",
      },
    },
    success: {
      title: "Schlüssel generiert",
      description: "Sicherer Schlüssel erfolgreich generiert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Schlüssel konnte nicht generiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
  },
};
