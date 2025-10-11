import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Geschäftsdaten",
  tags: {
    goals: "Ziele",
    objectives: "Zielsetzungen",
    update: "Aktualisieren",
  },

  // Completion status field translations
  isComplete: "Ziele vollständig",
  completedFields: "Ausgefüllte Felder",
  totalFields: "Gesamtfelder",
  completionPercentage: "Vervollständigungsgrad",
  missingRequiredFields: "Fehlende Pflichtfelder",

  // GET endpoint translations
  get: {
    title: "Ziele abrufen",
    description: "Geschäftsziele und Zielsetzungen abrufen",

    form: {
      title: "Ziele-Anfrage",
      description: "Anfrage zum Abrufen von Geschäftszielen",
    },

    response: {
      title: "Geschäftsziele",
      description: "Ihre Geschäftsziele und Zielsetzungen",
      primaryGoals: {
        title: "Hauptgeschäftsziele",
      },
      budgetRange: {
        title: "Budgetbereich",
      },
      shortTermGoals: {
        title: "Kurzfristige Ziele",
      },
      longTermGoals: {
        title: "Langfristige Ziele",
      },
      revenueGoals: {
        title: "Umsatzziele",
      },
      growthGoals: {
        title: "Wachstumsziele",
      },
      marketingGoals: {
        title: "Marketingziele",
      },
      successMetrics: {
        title: "Erfolgskennzahlen",
      },
      priorities: {
        title: "Geschäftsprioritäten",
      },
      timeline: {
        title: "Zeitplan und Meilensteine",
      },
      additionalNotes: {
        title: "Zusätzliche Notizen",
      },
      completionStatus: {
        title: "Bearbeitungsstatus des Abschnitts",
        description: "Aktuelle Informationen zum Bearbeitungsstatus",
      },
    },

    errors: {
      unauthorized: {
        title: "Unbefugter Zugriff",
        description: "Sie sind nicht berechtigt, auf diese Ziele zuzugreifen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter für Ziele",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen der Ziele ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Abrufen der Ziele nicht möglich",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Sie haben keine Berechtigung, diese Ziele anzuzeigen",
      },
      notFound: {
        title: "Ziele nicht gefunden",
        description: "Keine Ziele für diesen Benutzer gefunden",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Ziele-Daten stehen im Konflikt mit vorhandenen Informationen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen an Ihren Zielen",
      },
    },

    success: {
      title: "Ziele abgerufen",
      description: "Geschäftsziele erfolgreich abgerufen",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Ziele aktualisieren",
    description: "Geschäftsziele und Zielsetzungen aktualisieren",

    form: {
      title: "Ziele aktualisieren",
      description: "Aktualisieren Sie Ihre Geschäftsziele und Zielsetzungen",
    },

    response: {
      title: "Aktualisierte Ziele",
      description: "Ihre Ziele wurden erfolgreich aktualisiert",
      message: {
        title: "Aktualisierungsnachricht",
        description: "Statusnachricht für die Aktualisierung",
      },
      primaryGoals: {
        title: "Hauptziele aktualisiert",
      },
      budgetRange: {
        title: "Budgetbereich aktualisiert",
      },
      shortTermGoals: {
        title: "Kurzfristige Ziele aktualisiert",
      },
      longTermGoals: {
        title: "Langfristige Ziele aktualisiert",
      },
      revenueGoals: {
        title: "Umsatzziele aktualisiert",
      },
      growthGoals: {
        title: "Wachstumsziele aktualisiert",
      },
      marketingGoals: {
        title: "Marketingziele aktualisiert",
      },
      successMetrics: {
        title: "Erfolgskennzahlen aktualisiert",
      },
      priorities: {
        title: "Prioritäten aktualisiert",
      },
      timeline: {
        title: "Zeitplan aktualisiert",
      },
      additionalNotes: {
        title: "Zusätzliche Notizen aktualisiert",
      },
      completionStatus: {
        title: "Bearbeitungsstatus aktualisiert",
        description: "Ziel-Bearbeitungsstatus wurde aktualisiert",
      },
    },

    // Field labels and descriptions
    primaryGoals: {
      label: "Hauptziele",
      description: "Wählen Sie Ihre wichtigsten Geschäftsziele",
      placeholder: "Wählen Sie Ihre Hauptziele",
    },

    budgetRange: {
      label: "Budgetrahmen",
      description: "Ihr verfügbares Budget zur Erreichung dieser Ziele",
      placeholder: "z.B. 10.000 € - 50.000 €",
    },

    shortTermGoals: {
      label: "Kurzfristige Ziele (6 Monate)",
      description: "Was Sie in den nächsten 6 Monaten erreichen möchten",
      placeholder: "Beschreiben Sie Ihre kurzfristigen Ziele...",
    },

    longTermGoals: {
      label: "Langfristige Ziele (1-2 Jahre)",
      description: "Ihre Vision für die nächsten 1-2 Jahre",
      placeholder: "Beschreiben Sie Ihre langfristige Vision...",
    },

    revenueGoals: {
      label: "Umsatzziele",
      description: "Ihre Umsatzziele und finanziellen Zielsetzungen",
      placeholder: "z.B. Umsatzsteigerung um 30%",
    },

    growthGoals: {
      label: "Wachstumsziele",
      description: "Geschäftsausbau und Wachstumsziele",
      placeholder: "z.B. Expansion in 3 neue Märkte",
    },

    marketingGoals: {
      label: "Marketingziele",
      description: "Marketing- und Markenbekanntheitsziele",
      placeholder: "z.B. Verdopplung der Social-Media-Follower",
    },

    successMetrics: {
      label: "Erfolgsmetriken",
      description: "Wie Sie Erfolg messen werden",
      placeholder: "z.B. Monatlich aktive Nutzer, Konversionsrate",
    },

    priorities: {
      label: "Prioritäten",
      description:
        "Ihre wichtigsten Prioritäten in der Reihenfolge ihrer Bedeutung",
      placeholder: "Listen Sie Ihre Prioritäten auf...",
    },

    timeline: {
      label: "Zeitplan",
      description: "Wichtige Meilensteine und Fristen",
      placeholder: "z.B. Q1: Neues Produkt einführen, Q2: Team erweitern",
    },

    additionalNotes: {
      label: "Zusätzliche Anmerkungen",
      description: "Weitere Ziele oder Überlegungen",
      placeholder: "Fügen Sie zusätzliche Informationen hinzu...",
    },

    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, diese Ziele zu aktualisieren",
      },
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      server: {
        title: "Serverfehler",
        description: "Ziele konnten nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Beim Aktualisieren ist ein unerwarteter Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Aktualisieren der Ziele nicht möglich",
      },
      forbidden: {
        title: "Zugriff verboten",
        description:
          "Sie haben keine Berechtigung, diese Ziele zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ziele-Datensatz nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ziele-Aktualisierung steht im Konflikt mit vorhandenen Daten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen an Ihren Zielen",
      },
    },

    success: {
      title: "Ziele aktualisiert",
      description: "Ihre Ziele wurden erfolgreich aktualisiert",
      message: "Ziele gespeichert",
    },
  },

  // Enum translations
  enums: {
    businessGoal: {
      increaseRevenue: "Umsatz steigern",
      growCustomerBase: "Kundenstamm erweitern",
      improveBrandAwareness: "Markenbekanntheit verbessern",
      enhanceCustomerEngagement: "Kundenbindung verbessern",
      expandMarketReach: "Marktreichweite erweitern",
      optimizeOperations: "Betrieb optimieren",
      launchNewProducts: "Neue Produkte einführen",
      improveCustomerRetention: "Kundenbindung verbessern",
      reduceCosts: "Kosten reduzieren",
      digitalTransformation: "Digitale Transformation",
      improveOnlinePresence: "Online-Präsenz verbessern",
      generateLeads: "Leads generieren",
    },
    goalCategory: {
      revenue: "Umsatz",
      growth: "Wachstum",
      marketing: "Marketing",
      operations: "Betrieb",
      customer: "Kunde",
      product: "Produkt",
      team: "Team",
      brand: "Marke",
      efficiency: "Effizienz",
      expansion: "Expansion",
    },
    goalTimeframe: {
      shortTerm: "Kurzfristig (0-6 Monate)",
      mediumTerm: "Mittelfristig (6-12 Monate)",
      longTerm: "Langfristig (1+ Jahre)",
      ongoing: "Fortlaufend",
    },
    goalPriority: {
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      critical: "Kritisch",
    },
    metricType: {
      revenue: "Umsatz",
      customers: "Kunden",
      traffic: "Traffic",
      conversions: "Konversionen",
      engagement: "Engagement",
      retention: "Bindung",
      satisfaction: "Zufriedenheit",
      efficiency: "Effizienz",
      reach: "Reichweite",
      brandAwareness: "Markenbekanntheit",
    },
  },
};
