import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as notFoundTranslations } from "../../[...notFound]/i18n/de";
import { translations as adminTranslations } from "../../admin/i18n/de";
import { translations as chatTranslations } from "../../chat/i18n/de";
import { translations as helpTranslations } from "../../help/i18n/de";
import { translations as siteTranslations } from "../../story/i18n/de";
import { translations as subscriptionTranslations } from "../../subscription/i18n/de";
import { translations as trackTranslations } from "../../track/i18n/de";
import { translations as userTranslations } from "../../user/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...componentsTranslations,
  story: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  help: helpTranslations,
  subscription: subscriptionTranslations,
  track: trackTranslations,
  user: userTranslations,
  native: {
    page: {
      welcome: "Willkommen bei {{appName}}",
      description: "Eine einheitliche Next.js und React Native Anwendung",
      locale: {
        title: "Aktuelle Sprache",
        description: "Ihre aktuellen Sprache- und Regionseinstellungen",
      },
      features: {
        title: "Plattformfunktionen",
        description:
          "Diese Seite funktioniert sowohl im Web als auch auf Mobilgeräten",
        unified: {
          title: "✅ Einheitliche Komponenten",
          description:
            "Verwendung von next-vibe-ui Komponenten, die nahtlos über Plattformen hinweg funktionieren",
        },
        types: {
          title: "✅ Typsicherheit",
          description:
            "Vollständige TypeScript-Unterstützung mit korrekter Typinferenz",
        },
        async: {
          title: "✅ Asynchrone Serverkomponenten",
          description:
            "Next.js 15 asynchrone Seitkomponenten funktionieren in React Native",
        },
      },
      links: {
        chat: "Zum Chat gehen",
        help: "Zur Hilfe gehen",
        about: "Über uns",
        story: "Unsere Geschichte",
        designTest: "Design Test",
      },
      status: {
        title: "Systemstatus",
        platform: "Plattform",
        universal: "Universal",
        routing: "Routing",
        filebased: "Dateibasiert",
        styling: "Styling",
        nativewind: "NativeWind",
      },
    },
  },
  common: {
    active: "Aktiv",
    filter: "Filtern",
    refresh: "Aktualisieren",
    notAvailable: "N/V",
    weekday: {
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
      sunday: "Sonntag",
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
        previousPage: "Vorherige Seite",
        nextPage: "Nächste Seite",
        more: "Mehr",
        close: "Schließen",
      },
    },
    actions: {
      previous: "Zurück",
      next: "Weiter",
    },
    searchCountries: "Länder durchsuchen",
    noCountryFound: "Kein Land gefunden",
    preferred: "Bevorzugt",
    allCountries: "Alle Länder",
    enterPhoneNumber: "Telefonnummer eingeben",
    selectDate: "Datum auswählen",
    unknownFieldType: "Unbekannter Feldtyp",
    required: "Erforderlich",
    addTags: "Tags hinzufügen",
    addCustomValue: "'{{value}}' hinzufügen",
    selectOption: "Option auswählen",
    searchOptions: "Optionen durchsuchen",
    customValue: "Benutzerdefinierter Wert",
    noOptionsFound: "Keine Optionen gefunden",
    useCustomValue: "Benutzerdefinierten Wert verwenden",
    cancel: "Abbrechen",
    countries: {
      global: "Global",
      de: "Deutschland",
      pl: "Polen",
      us: "Vereinigte Staaten",
    },
    languages: {
      en: "Englisch",
      de: "Deutsch",
      pl: "Polnisch",
    },
    error: {
      title: "Fehler",
      message: "Etwas ist schief gelaufen",
      description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      tryAgain: "Erneut versuchen",
      sending_sms: "SMS konnte nicht gesendet werden",
      boundary: {
        stackTrace: "Stack-Trace",
        componentStack: "Komponenten-Stack",
        errorDetails: "Fehlerdetails",
        name: "Name:",
        errorMessage: "Nachricht:",
        cause: "Ursache:",
      },
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
};
