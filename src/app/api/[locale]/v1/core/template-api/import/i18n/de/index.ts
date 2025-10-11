import type { translations as enTranslations } from "../en";

/**
*

* Template Import API translations for German
*/

export const translations: typeof enTranslations = {
  import: {
    // Enums
    enums: {
      importFormat: {
        csv: "CSV",
        json: "JSON",
        xml: "XML",
      },
      importMode: {
        createOnly: "Nur erstellen",
        updateOnly: "Nur aktualisieren",
        createOrUpdate: "Erstellen oder aktualisieren",
      },
      importStatus: {
        pending: "Ausstehend",
        processing: "Verarbeitung",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
      },
    },
    title: "Vorlagen importieren",
    description: "Vorlagen aus CSV-, JSON- oder XML-Dateien importieren",
    category: "Vorlagen-API",
    tags: {
      import: "Import",
      bulk: "Massenoperation",
      templates: "Vorlagen",
    },
    form: {
      title: "Import-Konfiguration",
      description: "Import-Einstellungen für Vorlagen konfigurieren",
    },

    // Field labels
    format: {
      label: "Dateiformat",
      description: "Wählen Sie das Format Ihrer Import-Datei",
      placeholder: "Dateiformat wählen",
    },
    mode: {
      label: "Import-Modus",
      description:
        "Wählen Sie, wie mit bestehenden Vorlagen umgegangen werden soll",
      placeholder: "Import-Modus auswählen",
    },
    data: {
      label: "Import-Daten",
      description: "Fügen Sie hier Ihre CSV-, JSON- oder XML-Daten ein",
      placeholder: "Fügen Sie Ihre Vorlagendaten ein...",
    },
    validateOnly: {
      label: "Nur validieren",
      description: "Daten nur validieren ohne zu importieren",
    },
    skipErrors: {
      label: "Fehler überspringen",
      description:
        "Import fortsetzen, auch wenn einige Datensätze Fehler haben",
    },
    defaultStatus: {
      label: "Standardstatus",
      description: "Status für Vorlagen ohne expliziten Status",
      placeholder: "Standardstatus auswählen",
    },

    // Response
    response: {
      title: "Import-Ergebnisse",
      description: "Details der Import-Operation",
    },

    // Errors
    errors: {
      validation: {
        title: "Ungültige Import-Daten",
        description: "Die Import-Daten sind ungültig oder fehlerhaft",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie haben keine Berechtigung zum Importieren von Vorlagen",
      },
      forbidden: {
        title: "Import verboten",
        description: "Vorlagen-Import ist für Ihr Konto nicht erlaubt",
      },
      server: {
        title: "Import fehlgeschlagen",
        description: "Beim Importieren der Vorlagen ist ein Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Import-Anfrage konnte nicht abgeschlossen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist beim Import aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Import-Konflikt",
        description:
          "Während des Import-Prozesses ist ein Konflikt aufgetreten",
      },
      unsupportedFormat: "Nicht unterstütztes Import-Format",
    },

    // Success
    success: {
      title: "Import abgeschlossen",
      description: "Vorlagen erfolgreich importiert",
    },
  },
};
