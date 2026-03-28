import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    error: {
      title: "Etwas ist schiefgelaufen!",
      message: "Es tut uns leid, aber etwas Unerwartetes ist passiert.",
      errorId: "Fehler-ID: {{id}}",
      error_message: "Fehler: {{message}}",
      stackTrace: "Stack-Trace: {{stack}}",
      tryAgain: "Erneut versuchen",
      backToHome: "Zurück zur Startseite",
    },
    notFound: {
      title: "Seite nicht gefunden",
      description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      goBack: "Zurück",
      goHome: "Zur Startseite",
    },
  },
  meta: {
    title: "404 - Seite nicht gefunden",
    category: "Fehler",
    description: "Die gesuchte Seite existiert nicht",
    imageAlt: "404 Nicht gefunden",
    keywords: "404, nicht gefunden, Fehler",
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
