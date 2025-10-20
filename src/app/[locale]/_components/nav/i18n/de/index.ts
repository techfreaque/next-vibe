import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  help: "Hilfe",
  logout: "Abmelden",
  enableLightMode: "Hellen Modus aktivieren",
  enableDarkMode: "Dunklen Modus aktivieren",
  notifications: "Benachrichtigungen",
  company: "Unternehmen",
  about: {
    title: "Über uns",
    description: "Erfahren Sie mehr über unser Unternehmen",
  },
  careers: {
    title: "Karriere",
    description: "Werden Sie Teil unseres Teams",
  },
  user: {
    dashboard: "Dashboard",
    completeOnboarding: "Onboarding abschließen",
    login: "Anmelden",
    signup: "Registrieren",
  },
  home: "Startseite",
  pricing: "Preise",
  services: {
    title: "Dienstleistungen",
    features: {
      title: "Funktionen",
      description: "Entdecken Sie unsere leistungsstarken Funktionen",
    },
    process: {
      title: "Unser Prozess",
      description: "Wie wir mit Ihnen arbeiten",
    },
    premiumContent: {
      title: "Premium-Inhalte",
      description: "Zugang zu exklusiven Inhalten",
    },
    contact: {
      title: "Kontakt",
      description: "Nehmen Sie Kontakt mit unserem Team auf",
    },
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
