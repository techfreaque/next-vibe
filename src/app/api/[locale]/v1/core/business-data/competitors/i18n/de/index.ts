import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "API Endpunkt",
  tags: {
    competitors: "Wettbewerber",
    market: "Marktanalyse",
    update: "Aktualisieren",
  },

  // GET endpoint translations
  get: {
    title: "Wettbewerberdaten abrufen",
    description: "Wettbewerberinformationen und -analysen abrufen",
    form: {
      title: "Wettbewerberinformationen",
      description: "Auf Ihre Wettbewerbsanalysedaten zugreifen",
    },
    response: {
      title: "Wettbewerberdaten",
      description: "Ihre Wettbewerberinformationen und Marktanalyse",
      competitors: {
        title: "Wettbewerberliste",
      },
      mainCompetitors: {
        title: "Hauptwettbewerber",
      },
      competitiveAdvantages: {
        title: "Wettbewerbsvorteile",
      },
      competitiveDisadvantages: {
        title: "Wettbewerbsnachteile",
      },
      marketPosition: {
        title: "Marktposition",
      },
      differentiators: {
        title: "Alleinstellungsmerkmale",
      },
      competitorStrengths: {
        title: "Stärken der Wettbewerber",
      },
      competitorWeaknesses: {
        title: "Schwächen der Wettbewerber",
      },
      marketGaps: {
        title: "Marktlücken",
      },
      additionalNotes: {
        title: "Zusätzliche Notizen",
      },
      completionStatus: {
        title: "Bearbeitungsstatus des Abschnitts",
        description: "Konkurrenz-Bereich Vollständigkeitsstatus",
        isComplete: "Bereich vollständig",
        completedFields: "Ausgefüllte Felder",
        totalFields: "Gesamtfelder",
        completionPercentage: "Vervollständigungsgrad",
        missingRequiredFields: "Fehlende Pflichtfelder",
      },
    },
    errors: {
      unauthorized: {
        title: "Zugriff verweigert",
        description:
          "Sie sind nicht berechtigt, auf diese Wettbewerberdaten zuzugreifen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Die Anfragedaten sind ungültig",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung fehlgeschlagen",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Wettbewerberdaten nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Wettbewerberdaten erfolgreich abgerufen",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Wettbewerberdaten aktualisieren",
    description: "Wettbewerberinformationen und -analysen aktualisieren",
    form: {
      title: "Wettbewerberinformationen aktualisieren",
      description: "Ihre Wettbewerbsanalysedaten ändern",
    },
    response: {
      title: "Aktualisierte Wettbewerberdaten",
      description: "Ihre aktualisierten Wettbewerberinformationen",
      message: {
        title: "Aktualisierungsstatusnachricht",
      },
      competitors: {
        title: "Wettbewerber aktualisiert",
      },
      mainCompetitors: {
        title: "Hauptwettbewerber aktualisiert",
      },
      competitiveAdvantages: {
        title: "Wettbewerbsvorteile aktualisiert",
      },
      competitiveDisadvantages: {
        title: "Wettbewerbsnachteile aktualisiert",
      },
      marketPosition: {
        title: "Marktposition aktualisiert",
      },
      differentiators: {
        title: "Alleinstellungsmerkmale aktualisiert",
      },
      competitorStrengths: {
        title: "Wettbewerberstärken aktualisiert",
      },
      competitorWeaknesses: {
        title: "Wettbewerberschwächen aktualisiert",
      },
      marketGaps: {
        title: "Marktlücken aktualisiert",
      },
      additionalNotes: {
        title: "Zusätzliche Notizen aktualisiert",
      },
      completionStatus: {
        title: "Bearbeitungsstatus aktualisiert",
        description: "Aktualisierter Konkurrenz-Vollständigkeitsstatus",
        isComplete: "Bereich vollständig",
        completedFields: "Ausgefüllte Felder",
        totalFields: "Gesamtfelder",
        completionPercentage: "Vervollständigungsgrad",
        missingRequiredFields: "Fehlende Pflichtfelder",
      },
    },

    // Field labels, descriptions, and placeholders
    competitors: {
      label: "Wettbewerber",
      description: "Listen Sie Ihre Hauptwettbewerber im Markt auf",
      placeholder: "Geben Sie Wettbewerbernamen durch Kommas getrennt ein",
    },
    mainCompetitors: {
      label: "Hauptwettbewerber",
      description:
        "Identifizieren Sie Ihre Hauptwettbewerber und deren Marktposition",
      placeholder: "Beschreiben Sie Ihre Hauptwettbewerber und deren Stärken",
    },
    competitiveAdvantages: {
      label: "Wettbewerbsvorteile",
      description: "Welche Vorteile haben Sie gegenüber Ihren Wettbewerbern?",
      placeholder: "Listen Sie Ihre wichtigsten Wettbewerbsvorteile auf",
    },
    competitiveDisadvantages: {
      label: "Wettbewerbsnachteile",
      description: "Welche Nachteile haben Sie im Vergleich zu Wettbewerbern?",
      placeholder:
        "Beschreiben Sie Bereiche, in denen Wettbewerber Vorteile haben",
    },
    marketPosition: {
      label: "Marktposition",
      description:
        "Beschreiben Sie Ihre Position im Markt relativ zu Wettbewerbern",
      placeholder: "Erklären Sie Ihre aktuelle Marktposition und Strategie",
    },
    differentiators: {
      label: "Alleinstellungsmerkmale",
      description:
        "Was macht Ihr Unternehmen einzigartig gegenüber Wettbewerbern?",
      placeholder: "Beschreiben Sie, was Sie von der Konkurrenz abhebt",
    },
    competitorStrengths: {
      label: "Wettbewerberstärken",
      description: "Was sind die Hauptstärken Ihrer Wettbewerber?",
      placeholder: "Analysieren Sie die wichtigsten Stärken Ihrer Wettbewerber",
    },
    competitorWeaknesses: {
      label: "Wettbewerberschwächen",
      description: "Welche Schwächen sehen Sie bei Ihren Wettbewerbern?",
      placeholder: "Identifizieren Sie Chancen, wo Wettbewerber schwach sind",
    },
    marketGaps: {
      label: "Marktlücken",
      description: "Welche Lücken gibt es im Markt, die Sie füllen könnten?",
      placeholder: "Beschreiben Sie unerfüllte Bedürfnisse oder Marktchancen",
    },
    additionalNotes: {
      label: "Zusätzliche Notizen",
      description: "Weitere Erkenntnisse über Ihre Wettbewerbslandschaft",
      placeholder:
        "Fügen Sie weitere relevante Wettbewerbsanalyse-Notizen hinzu",
    },

    errors: {
      unauthorized: {
        title: "Zugriff verweigert",
        description:
          "Sie sind nicht berechtigt, diese Wettbewerberdaten zu aktualisieren",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Die bereitgestellten Daten sind ungültig",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Aktualisieren aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler beim Aktualisieren aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung beim Aktualisieren fehlgeschlagen",
      },
      forbidden: {
        title: "Verboten",
        description: "Aktualisierungszugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Wettbewerberdaten für Aktualisierung nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Aktualisieren aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Wettbewerberdaten erfolgreich aktualisiert",
      message: "Ihre Wettbewerberinformationen wurden aktualisiert",
    },
  },

  // Enum translations
  enums: {
    competitorType: {
      direct: "Direkter Wettbewerber",
      indirect: "Indirekter Wettbewerber",
      substitute: "Ersatzprodukt",
      potential: "Potenzieller Wettbewerber",
    },
    marketPosition: {
      leader: "Marktführer",
      challenger: "Marktherausforderer",
      follower: "Marktfolger",
      niche: "Nischenspieler",
      disruptor: "Marktstörer",
    },
    competitiveAdvantage: {
      price: "Preisvorteil",
      quality: "Qualitätsvorteil",
      service: "Serviceexzellenz",
      innovation: "Innovation",
      brand: "Markenstärke",
      distribution: "Vertriebsnetz",
      technology: "Technologie",
      expertise: "Expertise",
      speed: "Marktgeschwindigkeit",
      customization: "Anpassung",
    },
    analysisArea: {
      pricing: "Preisstrategie",
      productFeatures: "Produktmerkmale",
      marketing: "Marketingansatz",
      customerService: "Kundenservice",
      distribution: "Vertriebskanäle",
      technology: "Technologie-Stack",
      brandPositioning: "Markenpositionierung",
      targetAudience: "Zielgruppe",
      strengths: "Stärken",
      weaknesses: "Schwächen",
    },
  },

  // Individual completion status field translations
  isComplete: "Konkurrenzanalyse abgeschlossen",
  completedFields: "Abgeschlossene Konkurrenzfelder",
  totalFields: "Gesamt-Konkurrenzfelder",
  completionPercentage: "Konkurrenz-Vollständigkeitsprozentsatz",
  missingRequiredFields: "Fehlende erforderliche Konkurrenzfelder",
};
