import type { translations as enTranslations } from "../en";

/**
*

* Template Export API translations for German
*/

export const translations: typeof enTranslations = {
  export: {
    title: "Vorlagen exportieren",
    description: "Vorlagen in verschiedenen Formaten exportieren",
    category: "Vorlagen-API",
    tags: {
      export: "Export",
      download: "Download",
    },
    form: {
      title: "Export-Konfiguration",
      description: "Export-Optionen für Vorlagen konfigurieren",
    },

    // Field labels
    format: {
      label: "Export-Format",
      description: "Wählen Sie das Format für exportierte Vorlagen",
      placeholder: "Export-Format auswählen",
    },
    templateIds: {
      label: "Vorlagen-IDs",
      description:
        "Spezifische Vorlagen-IDs zum Exportieren (leer lassen für alle)",
      placeholder: "Vorlagen zum Exportieren auswählen",
    },
    status: {
      label: "Statusfilter",
      description: "Vorlagen mit ausgewählten Status exportieren",
      placeholder: "Status auswählen",
    },
    tagsFilter: {
      label: "Tag-Filter",
      description: "Vorlagen mit ausgewählten Tags exportieren",
      placeholder: "Tags auswählen",
    },
    includeContent: {
      label: "Inhalt einschließen",
      description: "Vorlageninhalt in Export einschließen",
    },
    includeMetadata: {
      label: "Metadaten einschließen",
      description: "Erstellungsdaten und Benutzerinformationen einschließen",
    },
    dateFrom: {
      label: "Startdatum",
      description:
        "Vorlagen exportieren, die nach diesem Datum erstellt wurden",
      placeholder: "Startdatum auswählen",
    },
    dateTo: {
      label: "Enddatum",
      description: "Vorlagen exportieren, die vor diesem Datum erstellt wurden",
      placeholder: "Enddatum auswählen",
    },

    // Response
    response: {
      title: "Export-Ergebnis",
      description: "Exportierte Vorlagendaten",
    },

    // Enums
    enums: {
      exportFormat: {
        json: "JSON",
        csv: "CSV",
        xml: "XML",
      },
      importMode: {
        createOnly: "Nur erstellen",
        updateOnly: "Nur aktualisieren",
        createOrUpdate: "Erstellen oder aktualisieren",
      },
      exportStatus: {
        pending: "Ausstehend",
        processing: "Verarbeitung",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
      },
    },

    // Debug messages
    debug: {
      exporting: "Vorlagen-Export wird gestartet",
      noTemplates:
        "Keine Vorlagen gefunden, die den Export-Kriterien entsprechen",
      success: "Vorlagen erfolgreich exportiert",
    },

    // Errors
    errors: {
      validation: {
        title: "Ungültige Export-Parameter",
        description: "Die angegebenen Export-Parameter sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie haben keine Berechtigung zum Exportieren von Vorlagen",
      },
      forbidden: {
        title: "Export verboten",
        description: "Vorlagen-Export ist für Ihr Konto nicht erlaubt",
      },
      notFound: {
        title: "Keine Vorlagen gefunden",
        description:
          "Keine Vorlagen gefunden, die den Export-Kriterien entsprechen",
      },
      server: {
        title: "Export fehlgeschlagen",
        description: "Beim Exportieren der Vorlagen ist ein Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Export-Anfrage konnte nicht abgeschlossen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist beim Export aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Export-Konflikt",
        description:
          "Während des Export-Prozesses ist ein Konflikt aufgetreten",
      },
    },

    // Success
    success: {
      title: "Export abgeschlossen",
      description: "Vorlagen erfolgreich exportiert",
    },
  },
};
