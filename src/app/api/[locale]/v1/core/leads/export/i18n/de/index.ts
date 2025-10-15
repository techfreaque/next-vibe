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
};
