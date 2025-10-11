import type { translations as enTranslations } from "../en";

/**
*

* Enhanced Template Stats API translations for German
*/

export const translations: typeof enTranslations = {
  enhancedStats: {
    title: "Erweiterte Vorlagenstatistiken abrufen",
    description: "Umfassende Vorlagenstatistiken mit erweiterter Filterung abrufen",
    category: "Vorlagen-API",
    tags: {
      analytics: "Analytik",
      statistics: "Statistiken",
    },
    form: {
      title: "Statistik-Anfrage",
      description: "Parameter für Vorlagenstatistiken konfigurieren",
    },

    // Time period options
    timePeriod: {
      label: "Zeitraum",
      description: "Zeitraum für Statistiken auswählen",
      placeholder: "Zeiträume wählen",
      day: "Tag",
      week: "Woche",
      month: "Monat",
      quarter: "Quartal",
      year: "Jahr",
    },

    // Date range preset options
    dateRangePreset: {
      label: "Datumszeitraum-Voreinstellung",
      description: "Vordefinierten Zeitraum auswählen",
      placeholder: "Zeitraum wählen",
      last_7_days: "Letzte 7 Tage",
      last_30_days: "Letzte 30 Tage",
      last_90_days: "Letzte 90 Tage",
      last_12_months: "Letzte 12 Monate",
      this_month: "Dieser Monat",
      last_month: "Letzter Monat",
      this_quarter: "Dieses Quartal",
      last_quarter: "Letztes Quartal",
      this_year: "Dieses Jahr",
      last_year: "Letztes Jahr",
    },

    // Chart type options
    chartType: {
      label: "Diagrammtyp",
      description: "Visualisierungstyp auswählen",
      placeholder: "Diagrammtypen wählen",
      line: "Liniendiagramm",
      bar: "Balkendiagramm",
      pie: "Kreisdiagramm",
    },

    // Date filters
    dateFrom: {
      label: "Von Datum",
      description: "Startdatum für Statistiken",
      placeholder: "Startdatum wählen",
    },
    dateTo: {
      label: "Bis Datum",
      description: "Enddatum für Statistiken",
      placeholder: "Enddatum wählen",
    },

    // Status filter
    status: {
      label: "Vorlagenstatus",
      description: "Nach Vorlagenstatus filtern",
      placeholder: "Status auswählen",
    },

    // User filter
    userId: {
      label: "Benutzer-ID",
      description: "Nach bestimmtem Benutzer filtern",
      placeholder: "Benutzer-ID eingeben",
    },

    // Tags filter
    tagsFilter: {
      label: "Tags",
      description: "Nach Vorlagen-Tags filtern",
      placeholder: "Tags auswählen",
    },

    // Content filters
    hasDescription: {
      label: "Hat Beschreibung",
      description: "Vorlagen mit Beschreibungen filtern",
    },
    hasContent: {
      label: "Hat Inhalt",
      description: "Vorlagen mit Inhalt filtern",
    },
    contentLengthMin: {
      label: "Minimale Inhaltslänge",
      description: "Mindestanzahl von Zeichen",
      placeholder: "Mindestlänge eingeben",
    },
    contentLengthMax: {
      label: "Maximale Inhaltslänge",
      description: "Höchstanzahl von Zeichen",
      placeholder: "Maximallänge eingeben",
    },

    // Date range filters
    createdAfter: {
      label: "Erstellt nach",
      description: "Vorlagen erstellt nach diesem Datum",
      placeholder: "Datum wählen",
    },
    createdBefore: {
      label: "Erstellt vor",
      description: "Vorlagen erstellt vor diesem Datum",
      placeholder: "Datum wählen",
    },
    updatedAfter: {
      label: "Aktualisiert nach",
      description: "Vorlagen aktualisiert nach diesem Datum",
      placeholder: "Datum wählen",
    },
    updatedBefore: {
      label: "Aktualisiert vor",
      description: "Vorlagen aktualisiert vor diesem Datum",
      placeholder: "Datum wählen",
    },

    // Search and display
    search: {
      label: "Suche",
      description: "In Vorlagennamen und Beschreibungen suchen",
      placeholder: "Suchbegriff eingeben",
    },
    includeComparison: {
      label: "Vergleich einbeziehen",
      description: "Mit vorheriger Periode vergleichen",
    },
    comparisonPeriod: {
      label: "Vergleichszeitraum",
      description: "Zeitraum zum Vergleich",
      placeholder: "Vergleichszeitraum wählen",
    },

    // Response
    response: {
      title: "Vorlagenstatistiken",
      description: "Umfassende Vorlagennutzungsstatistiken",
    },

    // Debug messages
    debug: {
      getting: "Erweiterte Vorlagenstatistiken werden abgerufen",
      retrieved: "Erweiterte Vorlagenstatistiken erfolgreich abgerufen",
    },

    // Errors
    errors: {
      validation: {
        title: "Ungültige Parameter",
        description: "Die angegebenen Parameter sind nicht gültig",
      },
      unauthorized: {
        title: "Unbefugter Zugriff",
        description: "Sie haben keine Berechtigung zur Anzeige von Statistiken",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Sie sind nicht berechtigt, auf diese Statistiken zuzugreifen",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Generieren der Statistiken",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Keine Verbindung zum Server möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konfliktfehler",
        description: "Der Vorgang steht im Konflikt mit dem aktuellen Zustand",
      },
    },

    // Success
    success: {
      title: "Statistiken generiert",
      description: "Vorlagenstatistiken erfolgreich generiert",
    },
  },
};