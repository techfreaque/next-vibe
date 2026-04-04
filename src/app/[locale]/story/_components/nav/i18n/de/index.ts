import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  help: "Hilfe",
  logout: "Abmelden",
  enableLightMode: "Hellen Modus aktivieren",
  enableDarkMode: "Dunklen Modus aktivieren",
  notifications: "Benachrichtigungen",
  welcomeNotification: {
    title: "Willkommen bei {{appName}}!",
    description:
      "Starten Sie damit, die KI-Modelle zu erkunden und Ihr erstes Gespräch zu erstellen.",
  },
  company: "Unternehmen",
  about: {
    title: "Über uns",
    description: "Erfahren Sie mehr über unser Unternehmen",
  },
  careers: {
    title: "Karriere",
    description: "Werden Sie Teil unseres Teams",
  },
  invest: {
    title: "Investieren",
    description: "Unterstütze die offene KI-Plattform",
  },
  blog: {
    title: "Blog",
    description: "Technische Einblicke in die Architektur von next-vibe",
  },
  user: {
    dashboard: "Dashboard",
    completeOnboarding: "Onboarding abschließen",
    login: "Anmelden",
    signup: "Registrieren",
  },
  home: "Startseite",
  pricing: "Preise",
  features: "Funktionen",
  framework: {
    title: "Framework",
    description: "Die Open-Source-Engine hinter der Plattform",
  },
  forum: "Forum",
  contact: "Kontakt",
  getStarted: "Kostenlos starten",
  signIn: "Anmelden",
  goToApp: "App öffnen",
  services: {
    title: "Plattform",
    features: {
      title: "Funktionen",
      description: "KI-Chat + Forum-Funktionen",
    },
    process: {
      title: "Wie es funktioniert",
      description: "Starten Sie in 4 einfachen Schritten",
    },
    aiModels: {
      title: "KI-Modelle",
      description: "{{modelCount}} unzensierte KI-Modelle",
    },
    folders: {
      title: "Privatsphäre-Level",
      description: "Privat, Inkognito, Geteilt, Öffentlich",
    },
    characters: {
      title: "KI-Skills",
      description: "Benutzerdefinierte & Community-Skills",
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
