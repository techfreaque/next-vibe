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
  error: {
    unauthorized: "Nicht autorisiert",
    errorTypes: {
      database_error: "Datenbankfehler",
      internal_error: "Interner Fehler",
      not_found: "Nicht gefunden",
      invalid_response_error: "Ungültige Antwort",
      external_service_error: "Externer Dienstfehler",
      two_factor_required: "Zwei-Faktor-Authentifizierung erforderlich",
      forbidden: "Verboten",
      bad_request: "Ungültige Anfrage",
      unknown_error: "Unbekannter Fehler",
      validation_error: "Validierungsfehler",
      auth_error: "Authentifizierungsfehler",
      unauthorized: "Nicht autorisiert",
      email_error: "E-Mail-Fehler",
      no_response_data: "Keine Antwortdaten",
      http_error: "HTTP-Fehler",
      sms_error: "SMS-Fehler",
      token_expired_error: "Token abgelaufen",
      permission_error: "Berechtigungsfehler",
      invalid_token_error: "Ungültiges Token",
      permission_denied: "Berechtigung verweigert",
      invalid_credentials_error: "Ungültige Anmeldedaten",
      invalid_request_error: "Ungültige Anfrage",
      invalid_data_error: "Ungültige Daten",
      invalid_format_error: "Ungültiges Format",
      invalid_input_error: "Ungültige Eingabe",
      invalid_method_error: "Ungültige Methode",
      invalid_parameter_error: "Ungültiger Parameter",
      invalid_path_error: "Ungültiger Pfad",
      invalid_payload_error: "Ungültige Nutzdaten",
      invalid_query_error: "Ungültige Abfrage",
      invalid_status_error: "Ungültiger Status",
      invalid_url_error: "Ungültige URL",
      partial_failure: "Teilweiser Fehler",
      payment_failed: "Zahlung fehlgeschlagen",
    },
    errors: {
      invalid_request_data: "Ungültige Anfragedaten",
      invalid_url_parameters: "Ungültige URL-Parameter",
    },
    general: {
      internal_server_error: "Interner Serverfehler",
    },
    api: {
      store: {
        status: {
          loading_data: "Daten werden geladen",
        },
      },
    },
  },
  common: {
    logoPart1: "Unbottled",
    logoPart2: ".ai",
    appName: "Unbottled.ai",
    active: "Aktiv",
    filter: "Filtern",
    refresh: "Aktualisieren",
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
      name: "Unbottled.ai",
      legalForm: "Gesellschaft mit beschränkter Haftung (GmbH)",
      registrationNumber: "REG-2024-UNBOTTLED-AI",
      address: {
        title: "Adresse",
        street: "123 AI Innovation Drive",
        city: "San Francisco, CA 94105",
        country: "Vereinigte Staaten",
        addressIn1Line:
          "123 AI Innovation Drive, San Francisco, CA 94105, Vereinigte Staaten",
      },
      responsiblePerson: {
        name: "Geschäftsführer",
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
