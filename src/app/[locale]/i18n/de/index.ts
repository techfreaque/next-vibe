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
  _components: componentsTranslations,
  story: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  help: helpTranslations,
  subscription: subscriptionTranslations,
  track: trackTranslations,
  user: userTranslations,
  currency: {
    usd: "USD",
    eur: "EUR",
    gbp: "GBP",
    jpy: "JPY",
    chf: "CHF",
    cad: "CAD",
    aud: "AUD",
    cny: "CNY",
    inr: "INR",
    brl: "BRL",
  },
  language: {
    english: "Englisch",
    german: "Deutsch",
    french: "Französisch",
    spanish: "Spanisch",
    italian: "Italienisch",
    portuguese: "Portugiesisch",
    dutch: "Niederländisch",
    russian: "Russisch",
    chinese: "Chinesisch",
    japanese: "Japanisch",
    korean: "Koreanisch",
    arabic: "Arabisch",
    hindi: "Hindi",
  },
  country: {
    united_states: "Vereinigte Staaten",
    canada: "Kanada",
    united_kingdom: "Vereinigtes Königreich",
    germany: "Deutschland",
    france: "Frankreich",
    italy: "Italien",
    spain: "Spanien",
    netherlands: "Niederlande",
    switzerland: "Schweiz",
    austria: "Österreich",
    belgium: "Belgien",
    sweden: "Schweden",
    norway: "Norwegen",
    denmark: "Dänemark",
    finland: "Finnland",
    australia: "Australien",
    new_zealand: "Neuseeland",
    japan: "Japan",
    south_korea: "Südkorea",
    china: "China",
    india: "Indien",
    brazil: "Brasilien",
    mexico: "Mexiko",
    argentina: "Argentinien",
  },
  timezone: {
    utc: "UTC",
    eastern: "Eastern Time (ET)",
    central: "Central Time (CT)",
    mountain: "Mountain Time (MT)",
    pacific: "Pacific Time (PT)",
    london: "London (GMT)",
    paris: "Paris (CET)",
    berlin: "Berlin (CET)",
    rome: "Rom (CET)",
    madrid: "Madrid (CET)",
    amsterdam: "Amsterdam (CET)",
    zurich: "Zürich (CET)",
    tokyo: "Tokio (JST)",
    shanghai: "Shanghai (CST)",
    seoul: "Seoul (KST)",
    sydney: "Sydney (AEDT)",
    auckland: "Auckland (NZDT)",
    mumbai: "Mumbai (IST)",
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
      title: "{{appName}} - Unzensierter KI-Chat",
      category: "KI-Chat-Plattform",
      description:
        "Erleben Sie wirklich unzensierte KI-Gespräche mit über {{modelCount}} Modellen. Keine Filter, keine Einschränkungen, nur ehrliche KI.",
      imageAlt: "{{appName}} - Unzensierte KI-Chat-Plattform",
      keywords:
        "unzensierte KI, KI-Chat, GPT-4, Claude, Gemini, KI-Modelle, keine Filter, ehrliche KI, KI-Gespräche",
    },
    aboutUs: {
      title: "Über uns - {{appName}}",
      category: "Über uns",
      description:
        "Erfahren Sie mehr über die Mission von {{appName}}, unzensierte KI-Gespräche bereitzustellen",
      imageAlt: "Über {{appName}}",
      keywords: "über {{appName}}, unzensierte KI, KI-Mission, KI-Werte",
      ogTitle: "Über {{appName}} - Unzensierte KI-Plattform",
      ogDescription:
        "Entdecken Sie unsere Mission, den Zugang zu unzensierter KI zu demokratisieren",
      twitterTitle: "Über {{appName}}",
      twitterDescription:
        "Erfahren Sie mehr über unsere Mission für unzensierte KI-Gespräche",
    },
    privacyPolicy: {
      title: "Datenschutzerklärung - {{appName}}",
      category: "Rechtliches",
      description:
        "Erfahren Sie, wie {{appName}} Ihre Privatsphäre schützt und Ihre Daten verarbeitet",
      imageAlt: "Datenschutzerklärung",
      keywords:
        "datenschutzerklärung, datenschutz, benutzerprivatsphäre, {{appName}} datenschutz",
    },
    termsOfService: {
      title: "Nutzungsbedingungen - {{appName}}",
      category: "Rechtliches",
      description:
        "Lesen Sie die Geschäftsbedingungen für die Nutzung von {{appName}}",
      imageAlt: "Nutzungsbedingungen",
      keywords:
        "nutzungsbedingungen, geschäftsbedingungen, benutzervereinbarung, {{appName}} bedingungen",
    },
    imprint: {
      title: "Impressum - {{appName}}",
      category: "Rechtliches",
      description:
        "Rechtliche Informationen und Unternehmensdetails für {{appName}}",
      imageAlt: "Impressum",
      keywords:
        "impressum, rechtliche hinweise, unternehmensinformationen, {{appName}} rechtliches",
    },
    careers: {
      title: "Karriere - {{appName}}",
      category: "Karriere",
      description:
        "Werden Sie Teil unseres Teams und helfen Sie, die Zukunft der unzensierten KI zu gestalten",
      imageAlt: "Karriere bei {{appName}}",
      keywords: "karriere, jobs, KI-Jobs, remote-arbeit, {{appName}} karriere",
    },
    pricing: {
      title: "Preise - {{appName}}",
      category: "Preise",
      description:
        "Erschwingliche KI-Chat-Pläne für jeden. Starten Sie kostenlos mit 10 täglichen Nachrichten.",
      imageAlt: "Preispläne",
      keywords: "preise, pläne, abonnement, KI-chat-preise, {{appName}} preise",
      ogTitle: "Preispläne - {{appName}}",
      ogDescription: "Einfache, transparente Preise für unzensierten KI-Chat",
      twitterTitle: "Preise - {{appName}}",
      twitterDescription: "Kostenlos starten mit 10 täglichen Nachrichten",
    },
    billing: {
      category: "Abrechnung",
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
      defaultTitle: "{{appName}} - Unzensierter KI-Chat",
      category: "KI-Chat-Plattform",
      description:
        "Erleben Sie wirklich unzensierte KI-Gespräche mit über {{modelCount}} Modellen. Keine Filter, keine Einschränkungen, nur ehrliche KI.",
    },
    openGraph: {
      imageAlt: "{{appName}} - Unzensierte KI-Chat-Plattform",
    },
    structuredData: {
      organization: {
        types: {
          organization: "Organisation",
          contactPoint: "Kontaktstelle",
        },
        contactPoint: {
          telephone: "{{config.group.contact.telephone}}",
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
        stackTrace: "Stack Trace",
        componentStack: "Komponenten-Stack",
        errorDetails: "Fehlerdetails",
        name: "Name:",
        errorMessage: "Nachricht:",
        cause: "Ursache:",
      },
    },
    errors: {
      noEndpoint:
        "Diese Funktion ist noch nicht verfügbar. Bitte versuchen Sie es später erneut",
      unknown: "Ein unbekannter Fehler ist aufgetreten",
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
  },
  shared: {
    error: {
      title: "Fehler",
      userError: "Benutzerfehler aufgetreten",
      invalidToken: "Ungültiges oder abgelaufenes Token",
    },
  },
  ui: {
    iconPicker: {
      title: "Symbol auswählen",
      selectIcon: "Ein Symbol auswählen",
      searchPlaceholder: "Symbole suchen...",
      showing: "Zeige {{count}} von {{total}} Symbolen",
      categories: {
        all: "Alle",
        general: "Allgemein",
        ai: "KI & Technik",
        education: "Bildung",
        communication: "Kommunikation",
        science: "Wissenschaft",
        arts: "Kunst",
        finance: "Finanzen",
        lifestyle: "Lifestyle",
        security: "Sicherheit",
        programming: "Programmierung",
        platforms: "Plattformen",
        aiProviders: "KI-Anbieter",
        media: "Medien",
        special: "Spezial",
        navigation: "Navigation",
        ui: "UI & Steuerung",
      },
    },
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
