import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Geschäftsdaten",

  // GET endpoint translations
  get: {
    title: "Geschäftsinformationen Abrufen",
    description: "Geschäftsinformationen und Unternehmensdetails abrufen",

    form: {
      title: "Geschäftsinformationen Anfrage",
      description: "Anfrageformular zum Abrufen von Geschäftsinformationen",
    },

    response: {
      title: "Geschäftsinformationen",
      description: "Unternehmensdetails und Geschäftsinformationen",
      businessType: {
        title: "Unternehmenstyp",
      },
      businessName: {
        title: "Firmenname",
      },
      industry: {
        title: "Branche",
      },
      businessSize: {
        title: "Unternehmensgröße",
      },
      businessEmail: {
        title: "Geschäfts-E-Mail",
      },
      businessPhone: {
        title: "Geschäftstelefon",
      },
      website: {
        title: "Website",
      },
      country: {
        title: "Land",
      },
      city: {
        title: "Stadt",
      },
      foundedYear: {
        title: "Gründungsjahr",
      },
      completionStatus: {
        title: "Abschlussstatus",
        description: "Geschäftsinformationen-Abschlussstatus",
      },
    },

    errors: {
      unauthorized: {
        title: "Nicht Autorisiert",
        description:
          "Sie sind nicht berechtigt, auf diese Geschäftsinformationen zuzugreifen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter für Geschäftsinformationen",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein Fehler ist beim Abrufen der Geschäftsinformationen aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Verbindung zum Abrufen der Geschäftsinformationen nicht möglich",
      },
      forbidden: {
        title: "Zugriff Verboten",
        description:
          "Sie haben keine Berechtigung, diese Geschäftsinformationen anzuzeigen",
      },
      notFound: {
        title: "Geschäftsinfo Nicht Gefunden",
        description:
          "Keine Geschäftsinformationen für diesen Benutzer gefunden",
      },
    },

    success: {
      title: "Geschäftsinformationen Abgerufen",
      description: "Geschäftsinformationen erfolgreich abgerufen",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Geschäftsinformationen Aktualisieren",
    description: "Unternehmensdetails und Geschäftsinformationen aktualisieren",

    form: {
      title: "Geschäftsinformationen Aktualisieren",
      description:
        "Aktualisieren Sie Ihre Unternehmensdetails und Geschäftsinformationen",
    },

    response: {
      title: "Aktualisierte Geschäftsinformationen",
      description:
        "Ihre Geschäftsinformationen wurden erfolgreich aktualisiert",
      message: {
        content: "Geschäftsinformationen erfolgreich aktualisiert",
      },
      businessType: "Unternehmenstyp aktualisiert",
      businessName: "Firmenname aktualisiert",
      industry: "Branche aktualisiert",
      businessSize: "Unternehmensgröße aktualisiert",
      businessEmail: "Geschäfts-E-Mail aktualisiert",
      businessPhone: "Geschäftstelefon aktualisiert",
      website: "Website aktualisiert",
      country: "Land aktualisiert",
      city: "Stadt aktualisiert",
      foundedYear: "Gründungsjahr aktualisiert",
      businessDescription: "Unternehmensbeschreibung aktualisiert",
      completionStatus: {
        isComplete: "Bereich vollständig",
        completedFields: "Ausgefüllte Felder",
        totalFields: "Gesamtfelder",
        completionPercentage: "Vervollständigungsgrad",
        missingRequiredFields: "Fehlende Pflichtfelder",
      },
    },

    // Field labels and descriptions
    businessType: {
      label: "Unternehmensart",
      description: "Wählen Sie die Art der Unternehmensstruktur",
      placeholder: "Wählen Sie Ihre Unternehmensart",
    },

    businessName: {
      label: "Firmenname",
      description: "Geben Sie Ihren registrierten Firmennamen ein",
      placeholder: "z.B. Acme Corporation",
    },

    industry: {
      label: "Branche",
      description: "Wählen Sie Ihre Hauptbranche oder Ihren Sektor",
      placeholder: "Wählen Sie Ihre Branche",
    },

    businessSize: {
      label: "Unternehmensgröße",
      description: "Wählen Sie die Größe Ihres Unternehmens",
      placeholder: "Unternehmensgröße wählen",
    },

    businessEmail: {
      label: "Geschäfts-E-Mail",
      description: "Primäre E-Mail-Adresse für Geschäftskommunikation",
      placeholder: "kontakt@ihrunternehmen.de",
    },

    businessPhone: {
      label: "Geschäftstelefon",
      description: "Hauptgeschäftstelefonnummer",
      placeholder: "+49-555-0123",
    },

    website: {
      label: "Webseite",
      description: "URL Ihrer Unternehmenswebseite",
      placeholder: "https://www.ihrunternehmen.de",
    },

    country: {
      label: "Land",
      description: "Land, in dem Ihr Unternehmen registriert ist",
      placeholder: "Land auswählen",
    },

    city: {
      label: "Stadt",
      description: "Stadt, in der sich Ihr Unternehmen befindet",
      placeholder: "z.B. Berlin",
    },

    foundedYear: {
      label: "Gründungsjahr",
      description: "Jahr, in dem Ihr Unternehmen gegründet wurde",
      placeholder: "z.B. 2020",
    },

    employeeCount: {
      label: "Mitarbeiteranzahl",
      description: "Anzahl der Mitarbeiter in Ihrem Unternehmen",
      placeholder: "z.B. 25",
    },

    businessDescription: {
      label: "Unternehmensbeschreibung",
      description: "Kurze Beschreibung Ihres Unternehmens und was Sie tun",
      placeholder: "Beschreiben Sie Ihr Unternehmen in wenigen Sätzen...",
    },

    location: {
      label: "Standort",
      description: "Hauptgeschäftsstandort oder Adresse",
      placeholder: "Geben Sie Ihren Geschäftsstandort ein",
    },

    productsServices: {
      label: "Produkte & Dienstleistungen",
      description:
        "Beschreiben Sie Ihre wichtigsten Produkte und Dienstleistungen",
      placeholder: "Beschreiben Sie, was Ihr Unternehmen anbietet...",
    },

    additionalNotes: {
      label: "Zusätzliche Notizen",
      description: "Weitere Informationen über Ihr Unternehmen",
      placeholder: "Fügen Sie weitere relevante Informationen hinzu...",
    },

    errors: {
      unauthorized: {
        title: "Nicht Autorisiert",
        description:
          "Sie sind nicht berechtigt, diese Geschäftsinformationen zu aktualisieren",
      },
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      server: {
        title: "Serverfehler",
        description: "Aktualisierung der Geschäftsinformationen fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist beim Aktualisieren aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Verbindung zum Aktualisieren der Geschäftsinformationen nicht möglich",
      },
      forbidden: {
        title: "Zugriff Verboten",
        description:
          "Sie haben keine Berechtigung, diese Informationen zu aktualisieren",
      },
      notFound: {
        title: "Nicht Gefunden",
        description: "Geschäftsinformationsdatensatz nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Geschäftsinformationen stehen im Konflikt mit vorhandenen Daten",
      },
      unsavedChanges: {
        title: "Nicht Gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen an Ihren Geschäftsinformationen",
      },
    },

    success: {
      title: "Geschäftsinformationen Aktualisiert",
      description:
        "Ihre Geschäftsinformationen wurden erfolgreich aktualisiert",
      message: "Geschäftsinformationen gespeichert",
    },
  },

  // Enum translations
  enums: {
    businessType: {
      SaaS: "Software as a Service",
      E_COMMERCE: "E-Commerce",
      CONSULTING: "Beratung",
      AGENCY: "Agentur",
      FREELANCER: "Freiberufler",
      STARTUP: "Startup",
      SMALL_BUSINESS: "Kleines Unternehmen",
      CORPORATION: "Unternehmen",
      NON_PROFIT: "Gemeinnützig",
      SOLE_PROPRIETORSHIP: "Einzelunternehmen",
      PARTNERSHIP: "Partnerschaft",
      LLC: "GmbH",
      OTHER: "Andere",
    },

    industry: {
      TECHNOLOGY: "Technologie",
      HEALTHCARE: "Gesundheitswesen",
      FINANCE: "Finanzen",
      EDUCATION: "Bildung",
      RETAIL: "Einzelhandel",
      MANUFACTURING: "Fertigung",
      REAL_ESTATE: "Immobilien",
      HOSPITALITY: "Gastgewerbe",
      ENTERTAINMENT: "Unterhaltung",
      AUTOMOTIVE: "Automobilindustrie",
      CONSTRUCTION: "Bauwesen",
      CONSULTING: "Beratung",
      FOOD_BEVERAGE: "Lebensmittel & Getränke",
      FITNESS_WELLNESS: "Fitness & Wellness",
      BEAUTY_FASHION: "Schönheit & Mode",
      HOME_GARDEN: "Haus & Garten",
      SPORTS_RECREATION: "Sport & Erholung",
      TRAVEL_HOSPITALITY: "Reisen & Gastgewerbe",
      MARKETING_ADVERTISING: "Marketing & Werbung",
      LEGAL: "Rechtswesen",
      GOVERNMENT: "Regierung",
      NON_PROFIT: "Gemeinnützig",
      NON_PROFIT_CHARITY: "Gemeinnützig & Wohltätigkeit",
      TELECOMMUNICATIONS: "Telekommunikation",
      OTHER: "Andere",
    },

    businessSize: {
      STARTUP: "Startup (1-10 Mitarbeiter)",
      SMALL: "Klein (11-50 Mitarbeiter)",
      MEDIUM: "Mittel (51-250 Mitarbeiter)",
      LARGE: "Groß (251-1000 Mitarbeiter)",
      ENTERPRISE: "Konzern (1000+ Mitarbeiter)",
    },
  },

  // Tags
  tags: {
    businessInfo: "Businessinfo",
    company: "Unternehmen",
    update: "Aktualisieren",
  },

  // Individual completion status field translations
  isComplete: "Geschäftsinfo abgeschlossen",
  completedFields: "Abgeschlossene Geschäftsinfo-Felder",
  totalFields: "Gesamt-Geschäftsinfo-Felder",
  completionPercentage: "Geschäftsinfo-Vollständigkeitsprozentsatz",
  missingRequiredFields: "Fehlende erforderliche Geschäftsinfo-Felder",
};
