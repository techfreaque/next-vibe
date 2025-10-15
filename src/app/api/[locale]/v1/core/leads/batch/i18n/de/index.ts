import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Batch-Aktualisierung",
    description: "Leads basierend auf Filterkriterien in Stapeln aktualisieren",
    form: {
      title: "Batch-Aktualisierung-Konfiguration",
      description: "Parameter für Batch-Aktualisierung konfigurieren",
    },
    search: {
      label: "Suche",
      description: "Leads nach E-Mail oder Firmenname suchen",
      placeholder: "E-Mail oder Firmenname eingeben",
    },
    status: {
      label: "Status-Filter",
      description: "Leads nach aktuellem Status filtern",
    },
    currentCampaignStage: {
      label: "Kampagnenstufe-Filter",
      description: "Leads nach aktueller Kampagnenstufe filtern",
    },
    source: {
      label: "Quellen-Filter",
      description: "Leads nach Quelle filtern",
    },
    scope: {
      label: "Operationsbereich",
      description: "Bereich der Batch-Operation definieren",
    },
    dryRun: {
      label: "Testlauf",
      description: "Vorschau der Änderungen ohne Anwendung",
    },
    maxRecords: {
      label: "Max. Datensätze",
      description: "Maximale Anzahl zu verarbeitender Datensätze",
    },
    updates: {
      title: "Aktualisierungsfelder",
      description: "Zu aktualisierende Felder angeben",
      status: {
        label: "Neuer Status",
        description: "Lead-Status auf diesen Wert aktualisieren",
      },
      currentCampaignStage: {
        label: "Neue Kampagnenstufe",
        description: "Kampagnenstufe auf diesen Wert aktualisieren",
      },
      source: {
        label: "Neue Quelle",
        description: "Lead-Quelle auf diesen Wert aktualisieren",
      },
      notes: {
        label: "Notizen",
        description: "Notizen für den Lead hinzufügen oder aktualisieren",
      },
    },
    response: {
      title: "Aktualisierung-Antwort",
      description: "Batch-Aktualisierung Antwortdaten",
      success: "Erfolgreich",
      totalMatched: "Gesamt Gefunden",
      totalProcessed: "Gesamt Verarbeitet",
      totalUpdated: "Gesamt Aktualisiert",
      preview: "Vorschau",
      errors: "Fehler",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für Batch-Operationen erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter für Batch-Aktualisierung",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler bei Batch-Aktualisierung",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler bei Batch-Aktualisierung",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler bei Batch-Aktualisierung",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff für Batch-Operationen verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource für Batch-Aktualisierung nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt bei Batch-Aktualisierung",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen in der Batch-Aktualisierung",
      },
    },
    success: {
      title: "Aktualisierung Erfolgreich",
      description: "Batch-Aktualisierung erfolgreich abgeschlossen",
    },
  },
  delete: {
    title: "Batch-Löschung",
    description: "Leads basierend auf Filterkriterien in Stapeln löschen",
    form: {
      title: "Batch-Löschung-Konfiguration",
      description: "Parameter für Batch-Löschung konfigurieren",
    },
    search: {
      label: "Suche",
      description: "Leads nach E-Mail oder Firmenname suchen",
    },
    status: {
      label: "Status-Filter",
      description: "Leads nach aktuellem Status filtern",
    },
    confirmDelete: {
      label: "Löschung bestätigen",
      description:
        "Bestätigen, dass die ausgewählten Leads gelöscht werden sollen",
    },
    dryRun: {
      label: "Testlauf",
      description: "Vorschau der Löschungen ohne tatsächliche Entfernung",
    },
    maxRecords: {
      label: "Max. Datensätze",
      description: "Maximale Anzahl zu löschender Datensätze",
    },
    response: {
      title: "Löschung-Antwort",
      description: "Batch-Löschung Antwortdaten",
      success: "Erfolgreich",
      totalMatched: "Gesamt Gefunden",
      totalProcessed: "Gesamt Verarbeitet",
      totalDeleted: "Gesamt Gelöscht",
      preview: "Vorschau",
      errors: "Fehler",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung für Batch-Löschungsoperationen erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter für Batch-Löschung",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler bei Batch-Löschung",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler bei Batch-Löschung",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler bei Batch-Löschung",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff für Batch-Löschungsoperationen verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource für Batch-Löschung nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt bei Batch-Löschung",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen in der Batch-Löschung",
      },
    },
    success: {
      title: "Löschung Erfolgreich",
      description: "Batch-Löschung erfolgreich abgeschlossen",
    },
  },
  email: {
    admin: {
      batchUpdate: {
        title: "Batch-Aktualisierung Abgeschlossen",
        subject: "Batch-Aktualisierung Ergebnisse",
        preview: "{{totalProcessed}} Leads wurden verarbeitet",
        message:
          "Die Batch-Aktualisierung wurde mit {{totalProcessed}} verarbeiteten Leads abgeschlossen.",
        operationSummary: "Vorgangsübersicht",
        totalMatched: "Gesamt Gefunden",
        totalProcessed: "Gesamt Verarbeitet",
        totalUpdated: "Gesamt Aktualisiert",
        errors: "Fehler",
        dryRunNote:
          "Dies war ein Testlauf - es wurden keine tatsächlichen Änderungen vorgenommen.",
        viewLeads: "Aktualisierte Leads Anzeigen",
        error: {
          noData: "Keine Batch-Aktualisierungsdaten verfügbar",
        },
      },
      batchDelete: {
        title: "Batch-Löschung Abgeschlossen",
        subject: "Batch-Löschung Ergebnisse",
        preview: "{{totalProcessed}} Leads wurden zur Löschung verarbeitet",
        message:
          "Die Batch-Löschung wurde mit {{totalProcessed}} verarbeiteten Leads abgeschlossen.",
        operationSummary: "Vorgangsübersicht",
        totalMatched: "Gesamt Gefunden",
        totalProcessed: "Gesamt Verarbeitet",
        totalDeleted: "Gesamt Gelöscht",
        errors: "Fehler",
        dryRunNote:
          "Dies war ein Testlauf - es wurden keine tatsächlichen Löschungen vorgenommen.",
        viewLeads: "Leads Anzeigen",
        error: {
          noData: "Keine Batch-Löschungsdaten verfügbar",
        },
      },
    },
  },
};
