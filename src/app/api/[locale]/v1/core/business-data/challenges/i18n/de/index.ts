import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Geschäftsdaten",
  tags: {
    challenges: "Herausforderungen",
    businessData: "Geschäftsdaten",
    business: "Geschäft",
    update: "Aktualisierung",
  },

  // GET endpoint translations
  get: {
    title: "Geschäftsherausforderungen abrufen",
    description: "Aktuelle Geschäftsherausforderungen und Hindernisse abrufen",
    form: {
      title: "Übersicht der Geschäftsherausforderungen",
      description:
        "Aktuelle Geschäftsherausforderungen und Auswirkungsbewertung anzeigen",
    },
    response: {
      title: "Geschäftsherausforderungen-Daten",
      description: "Aktuelle Geschäftsherausforderungen und Abschlussstatus",
      currentChallenges: {
        title: "Aktuelle Herausforderungen",
      },
      marketingChallenges: {
        title: "Marketing-Herausforderungen",
      },
      operationalChallenges: {
        title: "Betriebliche Herausforderungen",
      },
      financialChallenges: {
        title: "Finanzielle Herausforderungen",
      },
      technicalChallenges: {
        title: "Technische Herausforderungen",
      },
      biggestChallenge: {
        title: "Größte Herausforderung",
      },
      challengeImpact: {
        title: "Auswirkungen der Herausforderung",
      },
      previousSolutions: {
        title: "Bisherige Lösungen",
      },
      resourceConstraints: {
        title: "Ressourcenbeschränkungen",
      },
      budgetConstraints: {
        title: "Budgetbeschränkungen",
      },
      timeConstraints: {
        title: "Zeitbeschränkungen",
      },
      supportNeeded: {
        title: "Benötigte Unterstützung",
      },
      priorityAreas: {
        title: "Prioritätsbereiche",
      },
      additionalNotes: {
        title: "Zusätzliche Notizen",
      },
      completionStatus: {
        title: "Bearbeitungsstatus",
        description: "Geschäfts-Herausforderungen-Bearbeitungsstatus",
      },
    },
    errors: {
      unauthorized: {
        title: "Unbefugter Zugriff",
        description:
          "Sie haben keine Berechtigung zum Zugriff auf Geschäftsherausforderungen-Daten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Anfrage für Geschäftsherausforderungen-Daten",
      },
      server: {
        title: "Server-Fehler",
        description:
          "Ein Fehler beim Abrufen der Geschäftsherausforderungen ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerk-Fehler",
        description:
          "Verbindung zum Geschäftsherausforderungen-Service nicht möglich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Sie dürfen nicht auf diese Geschäftsherausforderungen-Daten zugreifen",
      },
      notFound: {
        title: "Daten nicht gefunden",
        description:
          "Die angeforderten Geschäftsherausforderungen-Daten konnten nicht gefunden werden",
      },
    },
    success: {
      title: "Herausforderungen abgerufen",
      description: "Geschäftsherausforderungen-Daten erfolgreich abgerufen",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Geschäftsherausforderungen aktualisieren",
    description:
      "Geschäftsherausforderungen und Einschränkungsinformationen aktualisieren",
    form: {
      title: "Konfiguration der Geschäftsherausforderungen",
      description:
        "Definieren und aktualisieren Sie Ihre Geschäftsherausforderungen und Einschränkungen",
    },
    response: {
      title: "Aktualisierungsergebnisse",
      description:
        "Ergebnisse der Geschäftsherausforderungen-Aktualisierung und Abschlussstatus",
      completionStatus: {
        title: "Abschlussstatus aktualisiert",
        description: "Herausforderungen-Abschlussstatus wurde aktualisiert",
        isComplete: "Herausforderungen-Bereich abgeschlossen",
        completedFields: "Abgeschlossene Herausforderungen-Felder",
        totalFields: "Gesamt-Herausforderungen-Felder",
        completionPercentage: "Herausforderungen-Vollständigkeitsprozentsatz",
        missingRequiredFields:
          "Fehlende erforderliche Herausforderungen-Felder",
      },
    },
    // Form field translations
    currentChallenges: {
      label: "Aktuelle Geschäftsherausforderungen",
      description:
        "Beschreiben Sie die Hauptherausforderungen, denen Ihr Unternehmen derzeit gegenübersteht",
      placeholder:
        "z.B. Geringe Markenbekanntheit, Schwierigkeiten bei der Kundenakquise, umkämpfter Markt...",
    },
    marketingChallenges: {
      label: "Marketing-Herausforderungen",
      description: "Spezifische Herausforderungen im Marketing und der Werbung",
      placeholder:
        "z.B. Begrenzte Reichweite, hohe Akquisitionskosten, niedrige Conversion-Raten...",
    },
    operationalChallenges: {
      label: "Operative Herausforderungen",
      description:
        "Interne operative Herausforderungen, die die Geschäftsleistung beeinträchtigen",
      placeholder:
        "z.B. Prozessineffizienzen, Ressourcenzuteilung, Workflow-Engpässe...",
    },
    financialChallenges: {
      label: "Finanzielle Herausforderungen",
      description: "Finanzielle Einschränkungen und monetäre Herausforderungen",
      placeholder:
        "z.B. Cashflow-Probleme, Finanzierungsbeschränkungen, Preisdruck...",
    },
    technicalChallenges: {
      label: "Technische Herausforderungen",
      description:
        "Technologiebezogene Herausforderungen und technische Hindernisse",
      placeholder:
        "z.B. Veraltete Systeme, mangelnde Automatisierung, technische Schulden...",
    },
    biggestChallenge: {
      label: "Größte Herausforderung",
      description:
        "Die einzelne bedeutendste Herausforderung, der Ihr Unternehmen derzeit gegenübersteht",
      placeholder:
        "z.B. Kundenbindung, Skalierung von Abläufen, Marktdurchdringung...",
    },
    challengeImpact: {
      label: "Auswirkung der Herausforderungen",
      description:
        "Wie sich diese Herausforderungen auf Ihre Geschäftsleistung auswirken",
      placeholder:
        "z.B. Langsameres Wachstum, reduzierte Rentabilität, Mitarbeiter-Burnout...",
    },
    previousSolutions: {
      label: "Bereits versuchte Lösungen",
      description:
        "Lösungen oder Strategien, die Sie bereits zur Bewältigung dieser Herausforderungen versucht haben",
      placeholder:
        "z.B. Berater eingestellt, neue Software implementiert, Prozesse geändert...",
    },
    resourceConstraints: {
      label: "Ressourceneinschränkungen",
      description:
        "Einschränkungen bei personellen Ressourcen oder Fähigkeiten",
      placeholder:
        "z.B. Kleines Team, mangelnde Expertise, begrenzte Kapazitäten...",
    },
    budgetConstraints: {
      label: "Budgeteinschränkungen",
      description:
        "Finanzielle Einschränkungen, die Ihre Fähigkeit zur Bewältigung von Herausforderungen beeinträchtigen",
      placeholder:
        "z.B. Begrenztes Marketing-Budget, Cashflow-Beschränkungen...",
    },
    timeConstraints: {
      label: "Zeiteinschränkungen",
      description: "Zeitliche Einschränkungen und Dringlichkeitsanforderungen",
      placeholder:
        "z.B. Schnelle Ergebnisse erforderlich, saisonale Fristen, Markt-Timing...",
    },
    supportNeeded: {
      label: "Benötigte Unterstützung",
      description:
        "Art der Unterstützung oder Hilfe, die Sie zur Überwindung dieser Herausforderungen benötigen",
      placeholder:
        "z.B. Strategische Beratung, technische Expertise, zusätzliche Ressourcen...",
    },
    priorityAreas: {
      label: "Prioritätsbereiche",
      description:
        "Bereiche, die sofortige Aufmerksamkeit benötigen oder höchste Priorität haben",
      placeholder: "z.B. Kundenakquise, operative Effizienz, Kostensenkung...",
    },
    painPoints: {
      label: "Schmerzpunkte",
      description:
        "Spezifische Schmerzpunkte, die Schwierigkeiten in Ihrem Unternehmen verursachen",
      placeholder:
        "z.B. Kundenabwanderung, niedrige Conversion-Raten, hohe Betriebskosten...",
    },
    obstacles: {
      label: "Geschäftshindernisse",
      description:
        "Größere Hindernisse, die Ihr Unternehmen daran hindern, seine Ziele zu erreichen",
      placeholder:
        "z.B. Regulatorische Hürden, technologische Beschränkungen, Qualifikationslücken...",
    },
    marketChallenges: {
      label: "Marktherausforderungen",
      description:
        "Herausforderungen im Zusammenhang mit Ihrem Markt und der Wettbewerbslandschaft",
      placeholder:
        "z.B. Marktsättigung, Wettbewerbsdruck, sich ändernde Kundenpräferenzen...",
    },
    technologyChallenges: {
      label: "Technologie-Herausforderungen",
      description:
        "Herausforderungen im Zusammenhang mit Technologie und technischer Infrastruktur",
      placeholder:
        "z.B. Legacy-Systeme, Integrationsprobleme, Cybersicherheitsbedenken...",
    },
    additionalNotes: {
      label: "Zusätzliche Notizen",
      description:
        "Zusätzlicher Kontext oder Details zu Ihren Geschäftsherausforderungen",
      placeholder:
        "Fügen Sie weitere relevante Informationen zu Ihren Herausforderungen hinzu...",
    },
    errors: {
      unauthorized: {
        title: "Unbefugter Zugriff",
        description:
          "Sie haben keine Berechtigung zur Aktualisierung von Geschäftsherausforderungen",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description:
          "Bitte überprüfen Sie die bereitgestellten Geschäftsherausforderungen-Informationen und versuchen Sie es erneut",
      },
      server: {
        title: "Server-Fehler",
        description:
          "Ein Fehler beim Aktualisieren der Geschäftsherausforderungen ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler bei der Aktualisierung der Geschäftsherausforderungen ist aufgetreten",
      },
      network: {
        title: "Netzwerk-Fehler",
        description:
          "Verbindung zum Geschäftsherausforderungen-Service nicht möglich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie dürfen keine Geschäftsherausforderungen-Daten ändern",
      },
      notFound: {
        title: "Daten nicht gefunden",
        description:
          "Die Geschäftsherausforderungen-Daten konnten nicht gefunden werden",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Die Geschäftsherausforderungen-Daten stehen im Konflikt mit vorhandenen Informationen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Sie haben ungespeicherte Änderungen an Ihren Geschäftsherausforderungen",
      },
    },
    success: {
      title: "Herausforderungen aktualisiert",
      description:
        "Ihre Geschäftsherausforderungen wurden erfolgreich aktualisiert",
      message: "Geschäftsherausforderungen erfolgreich aktualisiert",
    },
  },

  // Response field translations
  response: {
    currentChallenges: "Aktuelle Geschäftsherausforderungen",
    marketingChallenges: "Marketing-Herausforderungen",
    operationalChallenges: "Operative Herausforderungen",
    financialChallenges: "Finanzielle Herausforderungen",
    technicalChallenges: "Technische Herausforderungen",
    biggestChallenge: "Größte Herausforderung",
    challengeImpact: "Auswirkung der Herausforderungen",
    previousSolutions: "Bereits versuchte Lösungen",
    resourceConstraints: "Ressourceneinschränkungen",
    budgetConstraints: "Budgeteinschränkungen",
    timeConstraints: "Zeiteinschränkungen",
    supportNeeded: "Benötigte Unterstützung",
    priorityAreas: "Prioritätsbereiche",
    additionalNotes: "Zusätzliche Notizen",
    message: "Antwortnachricht",
    completionStatus: "Abschlussstatus des Abschnitts",
  },

  // Enum translations
  enums: {
    challengeCategory: {
      marketing: "Marketing",
      operations: "Betrieb",
      financial: "Finanziell",
      technical: "Technisch",
      humanResources: "Personalwesen",
      customerService: "Kundenservice",
      productDevelopment: "Produktentwicklung",
      sales: "Vertrieb",
      strategy: "Strategie",
      compliance: "Compliance",
    },
    challengeSeverity: {
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      critical: "Kritisch",
    },
    resourceConstraint: {
      budget: "Budget",
      time: "Zeit",
      staff: "Personal",
      skills: "Fähigkeiten",
      technology: "Technologie",
      equipment: "Ausrüstung",
      space: "Platz",
      knowledge: "Wissen",
    },
    supportArea: {
      strategy: "Strategie",
      marketing: "Marketing",
      technology: "Technologie",
      operations: "Betrieb",
      finance: "Finanzen",
      humanResources: "Personalwesen",
      legal: "Rechtsberatung",
      training: "Schulung",
      consulting: "Beratung",
      implementation: "Umsetzung",
    },
  },

  // Individual completion status field translations
  isComplete: "Herausforderungen abgeschlossen",
  completedFields: "Abgeschlossene Herausforderungen-Felder",
  totalFields: "Gesamt-Herausforderungen-Felder",
  completionPercentage: "Herausforderungen-Vollständigkeitsprozentsatz",
  missingRequiredFields: "Fehlende erforderliche Herausforderungen-Felder",
};
