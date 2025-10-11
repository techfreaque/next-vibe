import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Geschäftsdaten",
  tags: {
    brand: "Marke",
    businessData: "Geschäftsdaten",
    identity: "Identität",
    update: "Aktualisieren",
  },
  errors: {
    failed_to_get_brand_data: "Fehler beim Abrufen der Markendaten",
    failed_to_update_brand_data: "Fehler beim Aktualisieren der Markendaten",
  },
  // Enum translations
  enums: {
    personality: {
      professional: "Professionell",
      friendly: "Freundlich",
      innovative: "Innovativ",
      trustworthy: "Vertrauenswürdig",
      creative: "Kreativ",
      authoritative: "Autoritativ",
      playful: "Spielerisch",
      sophisticated: "Raffiniert",
      approachable: "Zugänglich",
      bold: "Kühn",
      caring: "Fürsorglich",
      reliable: "Zuverlässig",
    },
    voice: {
      formal: "Formell",
      casual: "Locker",
      conversational: "Gesprächig",
      authoritative: "Autoritativ",
      friendly: "Freundlich",
      professional: "Professionell",
      humorous: "Humorvoll",
      inspiring: "Inspirierend",
      educational: "Bildend",
      empathetic: "Empathisch",
    },
    visualStyle: {
      modern: "Modern",
      classic: "Klassisch",
      minimalist: "Minimalistisch",
      bold: "Kühn",
      elegant: "Elegant",
      playful: "Spielerisch",
      corporate: "Unternehmerisch",
      creative: "Kreativ",
      luxury: "Luxuriös",
      rustic: "Rustikal",
      tech: "Technisch",
      artistic: "Künstlerisch",
    },
    assetType: {
      logo: "Logo",
      colorPalette: "Farbpalette",
      typography: "Typografie",
      imagery: "Bildsprache",
      icons: "Symbole",
      patterns: "Muster",
    },
  },

  // GET endpoint translations
  get: {
    title: "Markenidentität abrufen",
    description: "Markenidentität und visuelle Stilinformationen abrufen",
    form: {
      title: "Markenidentität Übersicht",
      description: "Aktuelle Markenidentität und Stilkonfiguration anzeigen",
    },
    response: {
      title: "Markenidentitätsdaten",
      description: "Aktuelle Markenidentität und Abschlussstatus",
      brandGuidelines: {
        title: "Markenrichtlinien",
      },
      brandDescription: {
        title: "Markenbeschreibung",
      },
      brandValues: {
        title: "Markenwerte",
      },
      brandPersonality: {
        title: "Markenpersönlichkeit",
      },
      brandVoice: {
        title: "Markenstimme",
      },
      brandTone: {
        title: "Markenton",
      },
      brandColors: {
        title: "Markenfarben",
      },
      brandFonts: {
        title: "Markenschriften",
      },
      logoDescription: {
        title: "Logo-Beschreibung",
      },
      visualStyle: {
        title: "Visueller Stil",
      },
      brandPromise: {
        title: "Markenversprechen",
      },
      brandDifferentiators: {
        title: "Markenunterscheidungsmerkmale",
      },
      brandMission: {
        title: "Markenmission",
      },
      brandVision: {
        title: "Markenvision",
      },
      hasStyleGuide: {
        title: "Hat Styleguide",
      },
      hasLogoFiles: {
        title: "Hat Logo-Dateien",
      },
      hasBrandAssets: {
        title: "Hat Marken-Assets",
      },
      additionalNotes: {
        title: "Zusätzliche Notizen",
      },
      completionStatus: {
        title: "Abschlussstatus",
        description: "Marken-Abschlussstatus-Informationen",
      },
    },
    errors: {
      unauthorized: {
        title: "Unberechtigter Zugriff",
        description:
          "Sie haben keine Berechtigung, auf Markendaten zuzugreifen",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Anfrage für Markendaten",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen der Markendaten ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Markendienst nicht möglich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie dürfen nicht auf diese Markendaten zugreifen",
      },
      notFound: {
        title: "Daten nicht gefunden",
        description: "Die angeforderten Markendaten wurden nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Datenkonflikt",
        description: "Ein Konflikt bei den Markendaten ist aufgetreten",
      },
    },
    success: {
      title: "Markendaten abgerufen",
      description: "Markendaten erfolgreich abgerufen",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Markenidentität aktualisieren",
    description: "Markenidentität, Stimme und visuellen Stil aktualisieren",
    form: {
      title: "Markenidentität Konfiguration",
      description:
        "Definieren und aktualisieren Sie Ihre Markenidentität und Ihren visuellen Stil",
    },
    response: {
      title: "Aktualisierungsergebnisse",
      description:
        "Markenidentität Aktualisierungsergebnisse und Abschlussstatus",
      message: "Aktualisierungsstatusmeldung",
      brandName: "Markenname aktualisiert",
      brandGuidelines: "Markenrichtlinien aktualisiert",
      brandDescription: "Markenbeschreibung aktualisiert",
      brandValues: "Markenwerte aktualisiert",
      brandPersonality: "Markenpersönlichkeit aktualisiert",
      brandVoice: "Markenstimme aktualisiert",
      brandTone: "Markenton aktualisiert",
      brandColors: "Markenfarben aktualisiert",
      brandFonts: "Markenschriften aktualisiert",
      logoDescription: "Logobeschreibung aktualisiert",
      visualStyle: "Visueller Stil aktualisiert",
      brandPromise: "Markenversprechen aktualisiert",
      brandDifferentiators: "Markenunterscheidungsmerkmale aktualisiert",
      brandMission: "Markenmission aktualisiert",
      brandVision: "Markenvision aktualisiert",
      hasStyleGuide: "Styleguide-Status aktualisiert",
      hasLogoFiles: "Logo-Dateien-Status aktualisiert",
      hasBrandAssets: "Marken-Assets-Status aktualisiert",
      additionalNotes: "Zusätzliche Notizen aktualisiert",
      colorPalette: "Farbpalette aktualisiert",
      typography: "Typografie-Präferenzen aktualisiert",
      competitorBrands: "Konkurrenzmarken aktualisiert",
      completionStatus: {
        title: "Abschlussstatus aktualisiert",
        description: "Marken-Abschlussstatus wurde aktualisiert",
        isComplete: "Marken-Bereich abgeschlossen",
        completedFields: "Abgeschlossene Marken-Felder",
        totalFields: "Gesamt-Marken-Felder",
        completionPercentage: "Marken-Vollständigkeitsprozentsatz",
        missingRequiredFields: "Fehlende erforderliche Marken-Felder",
      },
    },
    brandName: {
      label: "Markenname",
      description: "Der offizielle Name Ihrer Marke oder Ihres Unternehmens",
      placeholder: "z.B. TechCorp Solutions, Green Garden Co...",
    },
    brandMission: {
      label: "Markenmission",
      description: "Das Mission Statement und der Kernzweck Ihrer Marke",
      placeholder:
        "z.B. Unternehmen durch innovative Technologielösungen stärken...",
    },
    brandVision: {
      label: "Markenvision",
      description: "Die langfristige Vision und Bestrebungen Ihrer Marke",
      placeholder:
        "z.B. Der führende Anbieter nachhaltiger Geschäftslösungen zu sein...",
    },
    brandValues: {
      label: "Markenwerte",
      description: "Kernwerte, die die Prinzipien Ihrer Marke definieren",
      placeholder:
        "z.B. Innovation, Integrität, Kundenfokus, Nachhaltigkeit...",
    },
    brandPersonality: {
      label: "Markenpersönlichkeit",
      description:
        "Wählen Sie die Persönlichkeitsmerkmale, die Ihre Marke am besten repräsentieren",
      placeholder: "Wählen Sie Markenpersönlichkeitsmerkmale...",
    },
    brandVoice: {
      label: "Markenstimme",
      description: "Der Ton und Stil der Kommunikation Ihrer Marke",
      placeholder: "Wählen Sie Ihren Markenstimmstil...",
    },
    visualStyle: {
      label: "Visueller Stil",
      description: "Die visuelle Ästhetik und der Designansatz für Ihre Marke",
      placeholder: "Wählen Sie Ihre bevorzugte visuelle Stilrichtung...",
    },
    colorPalette: {
      label: "Farbpalette",
      description: "Primärfarben, die Ihre Marke repräsentieren",
      placeholder:
        "z.B. Tiefblau (#003366), Hellgrün (#00CC66), Warmgrau (#F5F5F5)...",
    },
    logoDescription: {
      label: "Logobeschreibung",
      description:
        "Beschreiben Sie Ihr aktuelles Logo oder ideales Logokonzept",
      placeholder:
        "z.B. Modernes geometrisches Design mit Firmeninitialen, von der Natur inspiriertes Symbol...",
    },
    typography: {
      label: "Typografie-Präferenzen",
      description: "Schriftstile und Typografie-Präferenzen für Ihre Marke",
      placeholder:
        "z.B. Klare serifenlose Schriften, elegante Serifenschrift für Überschriften, modern und lesbar...",
    },
    brandGuidelines: {
      label: "Markenrichtlinien",
      description:
        "Spezifische Richtlinien oder Standards für Ihre Markenpräsentation",
      placeholder:
        "z.B. Logo immer auf weißem Hintergrund verwenden, 10px Abstand um Logo einhalten...",
    },
    competitorBrands: {
      label: "Konkurrenzmarken",
      description:
        "Marken, die Sie als Konkurrenten oder Inspiration betrachten",
      placeholder:
        "z.B. Apple (für Einfachheit), Nike (für Kühnheit), Patagonia (für Werte)...",
    },
    brandDifferentiators: {
      label: "Markenunterscheidungsmerkmale",
      description: "Was Ihre Marke von der Konkurrenz unterscheidet",
      placeholder:
        "z.B. Persönlicher Kundenservice, nachhaltige Praktiken, innovative Technologie...",
    },
    brandDescription: {
      label: "Markenbeschreibung",
      description: "Eine umfassende Beschreibung Ihrer Marke",
      placeholder: "Beschreiben Sie Ihre Marke im Detail...",
    },
    brandPromise: {
      label: "Markenversprechen",
      description: "Die Verpflichtung, die Ihre Marke gegenüber Kunden eingeht",
      placeholder:
        "z.B. Wir versprechen, Qualitätsprodukte pünktlich zu liefern...",
    },
    additionalNotes: {
      label: "Zusätzliche Notizen",
      description:
        "Alle zusätzlichen markenbezogenen Informationen oder Präferenzen",
      placeholder: "Fügen Sie weitere relevante Markeninformationen hinzu...",
    },
    errors: {
      unauthorized: {
        title: "Unberechtigter Zugriff",
        description:
          "Sie haben keine Berechtigung, Markendaten zu aktualisieren",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description:
          "Bitte überprüfen Sie die bereitgestellten Markeninformationen und versuchen Sie es erneut",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Aktualisieren der Markendaten ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist bei der Markenaktualisierung aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Markendienst nicht möglich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie dürfen Markendaten nicht ändern",
      },
      notFound: {
        title: "Daten nicht gefunden",
        description: "Die Markendaten konnten nicht gefunden werden",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Die Markendaten stehen im Konflikt mit vorhandenen Informationen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen an Ihren Markendaten",
      },
    },
    success: {
      title: "Marke aktualisiert",
      description: "Ihre Markenidentität wurde erfolgreich aktualisiert",
      message: "Markenidentität erfolgreich aktualisiert",
    },
    brandTone: {
      label: "Markenton",
      description:
        "Der spezifische Ton, den Ihre Marke in der Kommunikation verwendet",
      placeholder:
        "z.B. Professionell und dennoch freundlich, warm und zugänglich...",
    },
    brandColors: {
      label: "Markenfarben",
      description: "Primär- und Sekundärfarben für Ihre Marke",
      placeholder: "z.B. Primär: #007bff, Sekundär: #6c757d...",
    },
    brandFonts: {
      label: "Markenschriften",
      description:
        "Schriftfamilien, die in Ihren Markenmaterialien verwendet werden",
      placeholder: "z.B. Überschriften: Inter, Fließtext: Roboto...",
    },
    hasStyleGuide: {
      label: "Styleguide verfügbar",
      description: "Ob Sie einen dokumentierten Styleguide haben",
    },
    hasLogoFiles: {
      label: "Logo-Dateien verfügbar",
      description: "Ob Sie Logo-Dateien in verschiedenen Formaten haben",
    },
    hasBrandAssets: {
      label: "Marken-Assets verfügbar",
      description:
        "Ob Sie andere Marken-Assets haben (Vorlagen, Grafiken usw.)",
    },
  },

  // Individual completion status field translations
  isComplete: "Marke vollständig",
  completedFields: "Abgeschlossene Marken-Felder",
  totalFields: "Gesamt-Marken-Felder",
  completionPercentage: "Marken-Vollständigkeitsprozentsatz",
  missingRequiredFields: "Fehlende erforderliche Marken-Felder",
};
