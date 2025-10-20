import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Übersetzungsstatistiken",
    description: "Übersetzungsstatistiken und Analysen abrufen",
    container: {
      title: "Übersetzungsstatistiken",
      description: "Übersetzungsdateiverwendung und Schlüsselmetriken anzeigen",
    },
    response: {
      title: "Statistiken",
      description: "Übersetzungsstatistikdaten",
    },
    success: {
      title: "Statistiken abgerufen",
      description: "Übersetzungsstatistiken erfolgreich abgerufen",
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
  },
};
