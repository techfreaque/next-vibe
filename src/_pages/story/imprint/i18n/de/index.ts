import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Impressum - {{appName}}",
    category: "Rechtliches",
    description:
      "Rechtliche Informationen und Unternehmensdetails für {{appName}}",
    imageAlt: "Impressum",
    keywords:
      "Impressum, rechtlicher Hinweis, Unternehmensinformationen, {{appName}} rechtlich",
    ogTitle: "Impressum - {{appName}}",
    ogDescription:
      "Rechtliche Informationen und Unternehmensdetails für {{appName}}",
    twitterTitle: "Impressum - {{appName}}",
    twitterDescription:
      "Rechtliche Informationen und Unternehmensdetails für {{appName}}",
  },
  printAriaLabel: "Impressum drucken",
  printButton: "Drucken",
  title: "Impressum",
  lastUpdated: "Zuletzt aktualisiert: Januar 2025",
  introduction:
    "Dieses Impressum enthält die gesetzlich vorgeschriebenen Informationen über {{appName}} gemäß den geltenden Gesetzen.",
  sections: {
    partnerships: {
      title: "Partnerschaften & Zugehörigkeiten",
      description:
        "Informationen über unsere Geschäftspartnerschaften und Zugehörigkeiten.",
      content:
        "{{appName}} unterhält Partnerschaften mit führenden KI-Anbietern, um unseren Nutzern den bestmöglichen Service zu bieten.",
    },
    companyInfo: {
      title: "Unternehmensinfos",
      description:
        "Rechtliche Informationen über {{appName}} und unsere eingetragene Geschäftseinheit.",
    },
    responsiblePerson: {
      title: "Verantwortliche Person",
      description:
        "Informationen über die für den Inhalt dieser Website verantwortliche Person.",
    },
    contactInfo: {
      title: "Kontaktinformationen",
      description:
        "So erreichen Sie uns für rechtliche und geschäftliche Anfragen.",
    },
    disclaimer: {
      title: "Haftungsausschluss",
      copyright: {
        title: "Urheberrecht",
        content:
          "Alle Inhalte auf dieser Website sind urheberrechtlich geschützt. Unbefugte Nutzung ist untersagt.",
      },
      liability: {
        title: "Haftung",
        content:
          "Wir machen keine Zusicherungen oder Gewährleistungen über die Vollständigkeit, Genauigkeit oder Zuverlässigkeit der Informationen auf dieser Website.",
      },
      links: {
        title: "Externe Links",
        content:
          "Unsere Website kann Links zu externen Websites enthalten. Wir sind nicht verantwortlich für den Inhalt externer Websites.",
      },
    },
    disputeResolution: {
      title: "Streitbeilegung",
      description:
        "Informationen darüber, wie Streitigkeiten behandelt und gelöst werden.",
      content:
        "Alle Streitigkeiten, die sich aus der Nutzung dieser Website ergeben, werden gemäß dem anwendbaren Recht beigelegt.",
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
