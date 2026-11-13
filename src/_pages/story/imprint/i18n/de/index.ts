import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Impressum - {{appName}}",
    category: "Rechtliches",
    description: "Impressum und Anbieterkennzeichnung von {{appName}}",
    imageAlt: "Impressum",
    keywords:
      "Impressum, Anbieterkennzeichnung, Rechtliche Hinweise, {{appName}} Impressum",
    ogTitle: "Impressum - {{appName}}",
    ogDescription: "Impressum und Anbieterkennzeichnung von {{appName}}",
    twitterTitle: "Impressum - {{appName}}",
    twitterDescription: "Impressum und Anbieterkennzeichnung von {{appName}}",
  },
  printAriaLabel: "Impressum drucken",
  onThisPage: "Auf dieser Seite",
  printButton: "Drucken",
  title: "Impressum",
  lastUpdated: "Stand: Januar 2025",
  introduction:
    "Dieses Impressum enthält die gesetzlich vorgeschriebenen Angaben zu {{appName}} nach dem geltenden Recht.",
  sections: {
    partnerships: {
      title: "Partnerschaften",
      description: "Angaben zu unseren geschäftlichen Partnerschaften.",
      content:
        "{{appName}} arbeitet mit führenden KI-Anbietern zusammen, um seinen Nutzern den bestmöglichen Service zu bieten.",
    },
    companyInfo: {
      title: "Anbieter",
      description: "Rechtliche Angaben zum Anbieter von {{appName}}.",
    },
    responsiblePerson: {
      title: "Verantwortlich für den Inhalt",
      description: "Für den Inhalt dieser Website verantwortlich:",
    },
    contactInfo: {
      title: "Kontakt",
      description:
        "So erreichen Sie uns für rechtliche und geschäftliche Anfragen.",
    },
    disclaimer: {
      title: "Haftungsausschluss",
      copyright: {
        title: "Urheberrecht",
        content:
          "Alle Inhalte dieser Website sind urheberrechtlich geschützt. Jede Verwertung ohne Zustimmung ist untersagt.",
      },
      liability: {
        title: "Haftung für Inhalte",
        content:
          "Für die Vollständigkeit, Richtigkeit und Zuverlässigkeit der Informationen auf dieser Website übernehmen wir keine Gewähr.",
      },
      links: {
        title: "Haftung für Links",
        content:
          "Unsere Website kann Links zu externen Websites enthalten. Für deren Inhalte sind wir nicht verantwortlich.",
      },
    },
    disputeResolution: {
      title: "Streitbeilegung",
      description:
        "Angaben dazu, wie Streitigkeiten behandelt und beigelegt werden.",
      content:
        "Streitigkeiten aus der Nutzung dieser Website werden nach dem anwendbaren Recht beigelegt.",
    },
  },
  post: {
    title: "Impressum",
    description: "Impressum-Endpunkt",
    form: {
      title: "Impressum-Konfiguration",
      description: "Impressum-Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Impressum-Antwortdaten",
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
