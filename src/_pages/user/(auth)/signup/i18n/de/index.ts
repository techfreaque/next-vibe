import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    failedToLoadBrowserIdentity:
      "Browseridentität konnte nicht geladen werden. Bitte aktualisieren Sie die Seite.",
  },
  meta: {
    title: "Registrieren: {{appName}}",
    description:
      "Erstellen Sie Ihr {{appName}} Konto und chatten Sie mit Mainstream- und unzensierten KI-Modellen. Gratis-Credits inklusive.",
    category: "Authentifizierung",
    imageAlt: "{{appName}} Registrierung",
    keywords: "registrieren, anmelden, konto erstellen, {{appName}}",
    ogTitle: "Registrieren Sie sich für {{appName}}",
    ogDescription:
      "Treten Sie {{appName}} bei und chatten Sie noch heute mit Mainstream- und unzensierten KI-Modellen",
    twitterTitle: "Registrieren Sie sich für {{appName}}",
    twitterDescription:
      "Erstellen Sie Ihr Konto und chatten Sie auf {{appName}} los",
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
