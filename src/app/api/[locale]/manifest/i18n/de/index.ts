import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Generic manifest translations
  category: "Kern",
  tags: {
    manifest: "Manifest",
    configuration: "Konfiguration",
  },

  // Endpoint metadata
  title: "Web App Manifest Abrufen",
  description:
    "Lokalisierte Web App Manifest-Daten für Progressive Web App (PWA) Konfiguration abrufen",

  // Form translations
  form: {
    title: "Manifest-Anfrage",
    description:
      "Keine Eingabeparameter erforderlich - dieser Endpunkt gibt Manifest-Daten basierend auf Ihrem aktuellen Gebietsschema zurück",
  },

  // Response translations
  response: {
    title: "Web App Manifest",
    description:
      "Vollständige PWA-Manifest-Konfiguration einschließlich App-Metadaten, Icons und Lokalisierungseinstellungen",
    display: "Anzeigemodus",
    orientation: "Ausrichtung",
    categories: "Kategorien",
    iconPurpose: "Icon-Zweck",
  },

  // Error translations
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description: "Die Anfrageparameter sind nicht gültig",
    },
    unauthorized: {
      title: "Unbefugter Zugriff",
      description: "Sie haben keine Berechtigung, auf das Manifest zuzugreifen",
    },
    server: {
      title: "Serverfehler",
      description: "Fehler beim Generieren des Web App Manifests",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Keine Verbindung zum Server möglich",
    },
    forbidden: {
      title: "Zugriff Verboten",
      description: "Sie sind nicht berechtigt, auf diese Ressource zuzugreifen",
    },
    conflict: {
      title: "Datenkonflikt",
      description: "Es gibt einen Konflikt mit den angeforderten Daten",
    },
    not_found: {
      title: "Nicht Gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    unsaved_changes: {
      title: "Nicht Gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
    },
  },

  // Success translations
  success: {
    title: "Manifest Abgerufen",
    description: "Web App Manifest erfolgreich generiert",
  },

  // Enum translations
  enums: {
    displayMode: {
      fullscreen: "Vollbild",
      standalone: "Eigenständig",
      minimalUi: "Minimale Benutzeroberfläche",
      browser: "Browser",
    },
    orientation: {
      any: "Beliebig",
      natural: "Natürlich",
      landscape: "Querformat",
      landscapePrimary: "Querformat Primär",
      landscapeSecondary: "Querformat Sekundär",
      portrait: "Hochformat",
      portraitPrimary: "Hochformat Primär",
      portraitSecondary: "Hochformat Sekundär",
    },
    category: {
      books: "Bücher",
      business: "Geschäft",
      education: "Bildung",
      entertainment: "Unterhaltung",
      finance: "Finanzen",
      fitness: "Fitness",
      food: "Essen",
      games: "Spiele",
      government: "Regierung",
      health: "Gesundheit",
      kids: "Kinder",
      lifestyle: "Lebensstil",
      magazines: "Magazine",
      medical: "Medizin",
      music: "Musik",
      navigation: "Navigation",
      news: "Nachrichten",
      personalization: "Personalisierung",
      photo: "Foto",
      politics: "Politik",
      productivity: "Produktivität",
      security: "Sicherheit",
      shopping: "Einkaufen",
      social: "Sozial",
      sports: "Sport",
      travel: "Reisen",
      utilities: "Dienstprogramme",
      weather: "Wetter",
    },
    iconPurpose: {
      maskable: "Maskierbar",
      any: "Beliebig",
      monochrome: "Einfarbig",
      maskableAny: "Maskierbar Beliebig",
    },
  },
};
