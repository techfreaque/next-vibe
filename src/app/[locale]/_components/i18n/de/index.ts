import { translations as navTranslations } from "../../nav/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: navTranslations,
  common: {
    active: "Aktiv",
    filter: "Filtern",
    refresh: "Aktualisieren",
    appName: "unbottled.ai",
    weekday: {
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
      sunday: "Sonntag",
    },
    company: {
      name: "unbottled.ai",
      legalForm: "GmbH (Gesellschaft mit beschränkter Haftung)",
      registrationNumber: "CHE-123.456.789",
      address: {
        title: "Adresse",
        street: "Musterstrasse 123",
        city: "8000 Zürich",
        country: "Schweiz",
        addressIn1Line: "Musterstrasse 123, 8000 Zürich, Schweiz",
      },
      responsiblePerson: {
        name: "Max Mustermann",
      },
    },
    selector: {
      country: "Land",
      language: "Sprache",
    },
    accessibility: {
      srOnly: {
        enableLightMode: "Hellen Modus aktivieren",
        enableDarkMode: "Dunklen Modus aktivieren",
        toggleMenu: "Menü umschalten",
      },
    },
    error: {
      title: "Fehler",
      message: "Etwas ist schief gelaufen",
      description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      tryAgain: "Erneut versuchen",
      sending_sms: "SMS konnte nicht gesendet werden",
    },
    errors: {
      unknown: "Ein unbekannter Fehler ist aufgetreten",
    },
    success: {
      title: "Erfolg",
      message: "Vorgang erfolgreich abgeschlossen",
      description: "Ihre Aktion wurde erfolgreich abgeschlossen.",
    },
    info: {
      title: "Information",
      message: "Bitte beachten",
      description: "Hier sind einige Informationen für Sie.",
    },
    api: {
      notifications: {
        welcome: {
          title: "Willkommen!",
          description:
            "Danke, dass Sie sich uns angeschlossen haben. Lassen Sie uns beginnen!",
        },
      },
    },
    footer: {
      description:
        "Verwandeln Sie Ihre Social-Media-Präsenz mit professioneller Content-Erstellung und strategischem Management.",
      copyright: "© {{year}} {{appName}}. Alle Rechte vorbehalten.",
      tagline: "Verbessern Sie Ihr Social-Media-Spiel",
      social: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
        linkedin: "LinkedIn",
      },
      services: {
        title: "Dienstleistungen",
        socialAccountSetup: "Social-Media-Konto-Einrichtung",
        contentCreation: "Content-Erstellung",
        strategyDevelopment: "Strategieentwicklung",
        performanceAnalytics: "Leistungsanalyse",
        communityManagement: "Community-Management",
        audienceBuilding: "Publikumsaufbau",
        adCampaigns: "Werbekampagnen",
      },
      company: {
        title: "Unternehmen",
        aboutUs: "Über uns",
        contactUs: "Kontakt",
        careers: "Karriere",
        privacyPolicy: "Datenschutz",
        termsOfService: "Nutzungsbedingungen",
        imprint: "Impressum",
      },
    },
  },
  newsletter: {
    title: "Bleiben Sie auf dem Laufenden",
    description:
      "Abonnieren Sie unseren Newsletter für die neuesten Updates und Einblicke.",
    emailPlaceholder: "E-Mail eingeben",
    subscribe: "Abonnieren",
    subscription: {
      unsubscribe: {
        title: "Abmelden",
        confirmButton: "Abmeldung bestätigen",
      },
    },
  },
  pages: {
    error: {
      title: "Etwas ist schief gelaufen!",
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
    home: {
      title: "unbottled.ai - Unzensierter KI-Chat",
      category: "KI-Chat-Plattform",
      description:
        "Erleben Sie wirklich unzensierte KI-Gespräche mit über 40 Modellen. Keine Filter, keine Einschränkungen, nur ehrliche KI.",
      imageAlt: "unbottled.ai - Unzensierte KI-Chat-Plattform",
      keywords:
        "unzensierte KI, KI-Chat, GPT-4, Claude, Gemini, KI-Modelle, keine Filter, ehrliche KI, KI-Gespräche",
    },
    aboutUs: {
      title: "Über uns - Unbottled.ai",
      category: "Über uns",
      description:
        "Erfahren Sie mehr über die Mission von Unbottled.ai, unzensierte KI-Gespräche bereitzustellen",
      imageAlt: "Über Unbottled.ai",
      keywords: "über unbottled.ai, unzensierte KI, KI-Mission, KI-Werte",
      ogTitle: "Über Unbottled.ai - Unzensierte KI-Plattform",
      ogDescription:
        "Entdecken Sie unsere Mission, den Zugang zu unzensierter KI zu demokratisieren",
      twitterTitle: "Über Unbottled.ai",
      twitterDescription:
        "Erfahren Sie mehr über unsere Mission für unzensierte KI-Gespräche",
    },
    privacyPolicy: {
      title: "Datenschutzerklärung - Unbottled.ai",
      category: "Rechtliches",
      description:
        "Erfahren Sie, wie Unbottled.ai Ihre Privatsphäre schützt und Ihre Daten verarbeitet",
      imageAlt: "Datenschutzerklärung",
      keywords:
        "datenschutzerklärung, datenschutz, benutzerprivatsphäre, unbottled.ai datenschutz",
    },
    termsOfService: {
      title: "Nutzungsbedingungen - Unbottled.ai",
      category: "Rechtliches",
      description:
        "Lesen Sie die Geschäftsbedingungen für die Nutzung von Unbottled.ai",
      imageAlt: "Nutzungsbedingungen",
      keywords:
        "nutzungsbedingungen, geschäftsbedingungen, benutzervereinbarung, unbottled.ai bedingungen",
    },
    imprint: {
      title: "Impressum - Unbottled.ai",
      category: "Rechtliches",
      description:
        "Rechtliche Informationen und Unternehmensdetails für Unbottled.ai",
      imageAlt: "Impressum",
      keywords:
        "impressum, rechtliche hinweise, unternehmensinformationen, unbottled.ai rechtliches",
    },
    careers: {
      title: "Karriere - Unbottled.ai",
      category: "Karriere",
      description:
        "Werden Sie Teil unseres Teams und helfen Sie, die Zukunft der unzensierten KI zu gestalten",
      imageAlt: "Karriere bei Unbottled.ai",
      keywords: "karriere, jobs, KI-Jobs, remote-arbeit, unbottled.ai karriere",
    },
    notFound: {
      title: "404 - Seite nicht gefunden",
      category: "Fehler",
      description: "Die gesuchte Seite existiert nicht",
      imageAlt: "404 Nicht gefunden",
      keywords: "404, nicht gefunden, fehler",
    },
  },
  socialMedia: {
    platforms: {
      facebook: "Facebook",
      twitter: "Twitter",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      threads: "Threads",
      mastodon: "Mastodon",
      tiktok: "TikTok",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      whatsapp: "WhatsApp",
    },
  },
  layout: {
    metadata: {
      defaultTitle: "unbottled.ai - Unzensierter KI-Chat",
      category: "KI-Chat-Plattform",
      description:
        "Erleben Sie wirklich unzensierte KI-Gespräche mit über 40 Modellen. Keine Filter, keine Einschränkungen, nur ehrliche KI.",
    },
    openGraph: {
      imageAlt: "unbottled.ai - Unzensierte KI-Chat-Plattform",
    },
    structuredData: {
      organization: {
        types: {
          organization: "Organisation",
          contactPoint: "Kontaktstelle",
        },
        name: "unbottled.ai",
        contactPoint: {
          telephone: "+1-555-0123",
          contactType: "Kundenservice",
        },
      },
    },
  },
  constants: {
    languages: {
      en: "English",
      de: "Deutsch",
      pl: "Polski",
    },
  },
};
