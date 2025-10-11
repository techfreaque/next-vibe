import type { translations as enTranslations } from "../en";

/**
 * Business Data Audience API Übersetzungen für Deutsch
 */

export const translations: typeof enTranslations = {
  category: "Geschäftsdaten",
  tags: {
    audience: "Zielgruppe",
    businessData: "Geschäftsdaten",
    get: "Abrufen",
    update: "Aktualisieren",
  },

  // Completion status field translations
  isComplete: "Publikum vollständig",
  completedFields: "Ausgefüllte Felder",
  totalFields: "Gesamtfelder",
  completionPercentage: "Vervollständigungsgrad",
  missingRequiredFields: "Fehlende Pflichtfelder",

  // GET Endpunkt Übersetzungen
  get: {
    title: "Zielgruppendaten Abrufen",
    description: "Zielgruppeninformationen für das Unternehmen abrufen",
    form: {
      title: "Zielgruppendaten Abruf",
      description: "Aktuelle Zielgruppenkonfiguration anzeigen",
    },
    response: {
      title: "Zielgruppendaten",
      description: "Zielgruppeninformationen und Demografie",
      targetAudience: { title: "Zielgruppenbeschreibung" },
      ageRange: { title: "Altersbereich-Demografie" },
      gender: { title: "Geschlechtsdemografie" },
      location: { title: "Geografischer Standort" },
      income: { title: "Einkommensniveau" },
      interests: { title: "Interessen und Hobbys" },
      values: { title: "Werte und Überzeugungen" },
      lifestyle: { title: "Lebensstil-Merkmale" },
      onlineBehavior: { title: "Online-Verhaltensmuster" },
      purchaseBehavior: { title: "Kaufverhaltensmuster" },
      preferredChannels: { title: "Bevorzugte Kommunikationskanäle" },
      painPoints: { title: "Schmerzpunkte und Herausforderungen" },
      motivations: { title: "Motivationen und Antriebe" },
      additionalNotes: { title: "Zusätzliche Notizen" },
      completionStatus: { title: "Abschlussstatus des Abschnitts" },
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description:
          "Die Zielgruppendaten-Anfrage konnte nicht validiert werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Zielgruppendaten-Service nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisierter Zugriff",
        description:
          "Sie haben keine Berechtigung, auf Zielgruppendaten zuzugreifen",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Sie dürfen nicht auf diese Zielgruppendaten zugreifen",
      },
      notFound: {
        title: "Daten nicht gefunden",
        description:
          "Die angeforderten Zielgruppendaten konnten nicht gefunden werden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein Fehler ist beim Abrufen der Zielgruppendaten aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen an Ihren Zielgruppendaten",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Die Zielgruppendaten stehen im Konflikt mit vorhandenen Informationen",
      },
    },
    success: {
      title: "Zielgruppendaten abgerufen",
      description: "Zielgruppendaten wurden erfolgreich abgerufen",
    },
  },

  // PUT Endpunkt Übersetzungen
  put: {
    title: "Zielgruppendaten Aktualisieren",
    description: "Zielgruppeninformationen für das Unternehmen aktualisieren",
    form: {
      title: "Zielgruppen-Konfiguration",
      description: "Definieren und aktualisieren Sie Ihre Zielgruppenmerkmale",
    },
    response: {
      title: "Aktualisierungsergebnisse",
      description:
        "Ergebnisse der Zielgruppendaten-Aktualisierung und Abschlussstatus",
      message: {
        title: "Aktualisierungsnachricht",
        description: "Statusnachricht für die Aktualisierung",
      },
      targetAudience: "Zielgruppe aktualisiert",
      ageRange: "Altersbereich aktualisiert",
      gender: "Geschlechtsdemografie aktualisiert",
      location: "Geografischer Standort aktualisiert",
      income: "Einkommensniveau aktualisiert",
      interests: "Interessen aktualisiert",
      values: "Werte aktualisiert",
      lifestyle: "Lebensstil aktualisiert",
      onlineBehavior: "Online-Verhalten aktualisiert",
      purchaseBehavior: "Kaufverhalten aktualisiert",
      preferredChannels: "Bevorzugte Kanäle aktualisiert",
      painPoints: "Schmerzpunkte aktualisiert",
      motivations: "Motivationen aktualisiert",
      additionalNotes: "Zusätzliche Notizen aktualisiert",
      completionStatus: {
        title: "Bearbeitungsstatus aktualisiert",
        description: "Publikumsvervollständigungsstatus wurde aktualisiert",
      },
    },

    // Feldbezeichnungen und Beschreibungen
    targetAudience: {
      label: "Zielgruppenbeschreibung",
      description:
        "Geben Sie eine detaillierte Beschreibung Ihrer primären Zielgruppe an",
      placeholder:
        "z.B. Junge Berufstätige im Alter von 25-35 Jahren in städtischen Gebieten...",
    },
    ageRange: {
      label: "Altersbereich",
      description:
        "Wählen Sie die Altersbereiche aus, die Ihre Zielgruppe am besten repräsentieren",
      placeholder: "Altersbereiche auswählen...",
    },
    gender: {
      label: "Geschlecht",
      description: "Wählen Sie die Geschlechtsdemografie Ihrer Zielgruppe aus",
      placeholder: "Geschlechtsdemografie auswählen...",
    },
    location: {
      label: "Geografischer Standort",
      description:
        "Beschreiben Sie den geografischen Standort oder die Regionen Ihrer Zielgruppe",
      placeholder: "z.B. Städtische Gebiete in Nordamerika, Europa...",
    },
    income: {
      label: "Einkommensniveau",
      description:
        "Wählen Sie die Einkommensniveaus aus, die Ihre Zielgruppe repräsentieren",
      placeholder: "Einkommensniveaus auswählen...",
    },
    interests: {
      label: "Interessen & Hobbys",
      description: "Beschreiben Sie die Interessen und Hobbys Ihrer Zielgruppe",
      placeholder: "z.B. Technologie, Fitness, Reisen, Kochen...",
    },
    values: {
      label: "Werte & Überzeugungen",
      description:
        "Beschreiben Sie die Kernwerte und Überzeugungen Ihrer Zielgruppe",
      placeholder: "z.B. Work-Life-Balance, Nachhaltigkeit, Familie...",
    },
    lifestyle: {
      label: "Lebensstil-Merkmale",
      description: "Beschreiben Sie die Lebensstilmuster und -merkmale",
      placeholder: "z.B. Aktiv, technikaffin, gesundheitsbewusst...",
    },
    onlineBehavior: {
      label: "Online-Verhalten",
      description: "Beschreiben Sie, wie sich Ihre Zielgruppe online verhält",
      placeholder:
        "z.B. Aktiv in sozialen Medien, Mobile-First, recherchiert vor dem Kauf...",
    },
    purchaseBehavior: {
      label: "Kaufverhalten",
      description:
        "Beschreiben Sie die Kaufmuster und den Entscheidungsprozess",
      placeholder: "z.B. Preisbewusst, markentreu, Impulskäufer...",
    },
    preferredChannels: {
      label: "Bevorzugte Kommunikationskanäle",
      description:
        "Wählen Sie die Kommunikationskanäle aus, die Ihre Zielgruppe bevorzugt",
      placeholder: "Bevorzugte Kanäle auswählen...",
    },
    painPoints: {
      label: "Schmerzpunkte & Herausforderungen",
      description:
        "Beschreiben Sie die Hauptprobleme und Herausforderungen Ihrer Zielgruppe",
      placeholder:
        "z.B. Zeitmanagement, Budgetbeschränkungen, Informationsmangel...",
    },
    motivations: {
      label: "Motivationen & Antriebe",
      description:
        "Beschreiben Sie, was Ihre Zielgruppe motiviert und antreibt",
      placeholder:
        "z.B. Karriereentwicklung, persönliches Wachstum, Familiensicherheit...",
    },
    additionalNotes: {
      label: "Zusätzliche Notizen",
      description:
        "Zusätzliche Einblicke oder Beobachtungen über Ihre Zielgruppe",
      placeholder:
        "Fügen Sie weitere relevante Details über Ihre Zielgruppe hinzu...",
    },

    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description:
          "Bitte überprüfen Sie die angegebenen Zielgruppeninformationen und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Zielgruppendaten-Service nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie haben keine Berechtigung, Zielgruppendaten zu aktualisieren",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Sie dürfen Zielgruppendaten nicht ändern",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Zielgruppendaten-Datensatz nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Aktualisieren der Zielgruppendaten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist beim Aktualisieren aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen an Ihren Zielgruppendaten",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Zielgruppen-Aktualisierung steht im Konflikt mit vorhandenen Daten",
      },
    },
    success: {
      title: "Zielgruppe aktualisiert",
      description: "Ihre Zielgruppendaten wurden erfolgreich aktualisiert",
      message: "Zielgruppendaten erfolgreich aktualisiert",
    },
  },

  // Erfolg Übersetzungen (für GET und PUT)
  success: {
    title: "Zielgruppendaten Erfolg",
    description: "Ihre Zielgruppendaten wurden erfolgreich verarbeitet",
  },

  // Fehler Übersetzungen (gemeinsam)
  errors: {
    validation: {
      title: "Ungültige Zielgruppendaten",
      description:
        "Bitte überprüfen Sie die angegebenen Zielgruppeninformationen und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung zum Zielgruppendaten-Service nicht möglich",
    },
    unauthorized: {
      title: "Nicht autorisierter Zugriff",
      description:
        "Sie haben keine Berechtigung, auf Zielgruppendaten zuzugreifen",
    },
    forbidden: {
      title: "Zugriff verboten",
      description: "Sie dürfen nicht auf diese Zielgruppendaten zugreifen",
    },
    notFound: {
      title: "Zielgruppendaten nicht gefunden",
      description:
        "Die angeforderten Zielgruppendaten konnten nicht gefunden werden",
    },
    server: {
      title: "Serverfehler",
      description:
        "Bei der Verarbeitung Ihrer Zielgruppendaten-Anfrage ist ein Fehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unerwarteter Fehler mit den Zielgruppendaten ist aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen an Ihren Zielgruppendaten",
    },
    conflict: {
      title: "Datenkonflikt",
      description:
        "Die Zielgruppendaten stehen im Konflikt mit vorhandenen Informationen",
    },
  },

  // Enum Übersetzungen
  enums: {
    gender: {
      all: "Alle Geschlechter",
      male: "Männlich",
      female: "Weiblich",
      nonBinary: "Nicht-binär",
      other: "Andere",
    },
    ageRange: {
      teens: "Teenager (13-19)",
      youngAdults: "Junge Erwachsene (20-24)",
      millennials: "Millennials (25-40)",
      genX: "Generation X (41-56)",
      middleAged: "Mittleres Alter (57-65)",
      babyBoomers: "Babyboomer (66-75)",
      seniors: "Senioren (76+)",
      allAges: "Alle Altersgruppen",
    },
    incomeLevel: {
      low: "Niedriges Einkommen",
      lowerMiddle: "Untere Mittelschicht",
      middle: "Mittelschicht",
      upperMiddle: "Obere Mittelschicht",
      high: "Hohes Einkommen",
      luxury: "Luxus-Einkommen",
      allLevels: "Alle Einkommensstufen",
    },
    communicationChannel: {
      email: "E-Mail",
      socialMedia: "Soziale Medien",
      phone: "Telefon",
      sms: "SMS/Text",
      inPerson: "Persönlich",
      website: "Website",
      mobileApp: "Mobile App",
      directMail: "Direktwerbung",
      advertising: "Werbung",
      wordOfMouth: "Mundpropaganda",
    },
  },
};
