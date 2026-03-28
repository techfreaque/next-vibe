import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Karriere - unbottled.ai",
    category: "Karriere",
    description:
      "Werden Sie Teil unseres Teams und helfen Sie, die Zukunft der unzensierten KI zu gestalten",
    imageAlt: "Karriere bei unbottled.ai",
    keywords: "Karriere, Jobs, KI-Jobs, Remote-Arbeit, unbottled.ai Karriere",
    ogTitle: "Karriere - unbottled.ai",
    ogDescription:
      "Werden Sie Teil unseres Teams und helfen Sie, die Zukunft der unzensierten KI zu gestalten",
    twitterTitle: "Karriere - unbottled.ai",
    twitterDescription:
      "Werden Sie Teil unseres Teams und helfen Sie, die Zukunft der unzensierten KI zu gestalten",
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
