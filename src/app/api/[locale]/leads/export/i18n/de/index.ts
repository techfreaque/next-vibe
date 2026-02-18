import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Leads exportieren",
    description: "Lead-Daten in Datei exportieren",
    form: {
      title: "Export-Konfiguration",
      description: "Lead-Exportparameter und Filter konfigurieren",
    },
    format: {
      label: "Exportformat",
      description: "Dateiformat für den Export",
    },
    status: {
      label: "Lead-Status",
      description: "Nach Lead-Status filtern",
    },
    country: {
      label: "Land",
      description: "Nach Land filtern",
      placeholder: "Land auswählen",
    },
    language: {
      label: "Sprache",
      description: "Nach Sprache filtern",
      placeholder: "Sprache auswählen",
    },
    source: {
      label: "Lead-Quelle",
      description: "Nach Lead-Quelle filtern",
      placeholder: "Quelle auswählen",
    },
    search: {
      label: "Suche",
      description: "Leads nach Text durchsuchen",
      placeholder: "Leads suchen...",
    },
    dateFrom: {
      label: "Startdatum",
      description: "Leads ab diesem Datum exportieren",
    },
    dateTo: {
      label: "Enddatum",
      description: "Leads bis zu diesem Datum exportieren",
    },
    includeMetadata: {
      label: "Metadaten einschließen",
      description: "Erstellungs- und Aktualisierungszeitstempel einschließen",
    },
    includeEngagementData: {
      label: "Engagement-Daten einschließen",
      description: "E-Mail-Tracking und Kampagnendaten einschließen",
    },
    response: {
      title: "Exportdatei",
      description: "Generierte Exportdatei mit Lead-Daten",
      fileName: "Dateiname",
      fileContent: "Dateiinhalt (Base64)",
      mimeType: "MIME-Typ",
      totalRecords: "Gesamtanzahl Datensätze",
      exportedAt: "Exportiert am",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich um Leads zu exportieren",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Exportparameter oder Filter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Export",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler beim Export",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Export",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff für Lead-Export verboten",
      },
      notFound: {
        title: "Keine Daten",
        description: "Keine Leads gefunden die den Exportkriterien entsprechen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Export",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen im Exportformular",
      },
    },
    success: {
      title: "Export abgeschlossen",
      description: "Lead-Export erfolgreich abgeschlossen",
    },
  },
  widget: {
    exportLeads: "Leads exportieren",
    import: "Importieren",
    viewList: "Liste anzeigen",
    importLeadsTitle: "Leads importieren",
    viewLeadsListTitle: "Lead-Liste anzeigen",
    copyCsvTitle: "CSV-Inhalt in Zwischenablage kopieren",
    generatingExport: "Export wird generiert…",
    generatingExportHint:
      "Dies kann bei großen Datensätzen einen Moment dauern",
    exportReady: "Export bereit",
    fileReadyToDownload: "Ihre Datei kann heruntergeladen werden",
    records: "Datensätze",
    format: "Format",
    fileSize: "Dateigröße",
    copied: "Kopiert!",
    copy: "Kopieren",
    download: "Herunterladen",
    exportedAt: "Exportiert am:",
    nextSteps: "Nächste Schritte:",
    viewLeads: "Leads anzeigen",
    importLeads: "Leads importieren",
    configureExport: "Export konfigurieren",
    configureExportHint:
      "Format und Filter unten auswählen, dann auf Exportieren klicken um die Datei zu generieren",
    formatLabel: "Format",
    formatHint: "CSV oder Excel (XLSX) auswählen",
    statusFilter: "Statusfilter",
    statusFilterHint: "Nur Leads mit einem bestimmten Status exportieren",
    dateRange: "Datumsbereich",
    dateRangeHint: "Export auf ein bestimmtes Zeitfenster einschränken",
    metadataEngagement: "Metadaten & Engagement",
    metadataEngagementHint:
      "Optional zusätzliche Spalten für erweiterte Analyse einschließen",
    viewLeadsList: "Lead-Liste anzeigen",
    excelSpreadsheet: "Excel-Tabelle",
    csvFile: "CSV-Datei",
  },
  headers: {
    email: "E-Mail",
    businessName: "Firmenname",
    contactName: "Kontaktname",
    phone: "Telefon",
    country: "Land",
    language: "Sprache",
    status: "Status",
    source: "Quelle",
    website: "Webseite",
    notes: "Notizen",
    campaignStage: "Kampagnenphase",
    emailsSent: "Gesendete E-Mails",
    emailsOpened: "Geöffnete E-Mails",
    emailsClicked: "Angeklickte E-Mails",
    lastEmailSent: "Letzte gesendete E-Mail",
    lastEngagement: "Letztes Engagement",
    unsubscribedAt: "Abgemeldet am",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    lastEngagementAt: "Letztes Engagement",
    metadata: "Metadaten",
  },
};
