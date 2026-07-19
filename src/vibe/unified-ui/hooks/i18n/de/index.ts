import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widgets: {
    errorBoundary: {
      title: "Etwas ist schiefgelaufen",
      defaultMessage: "Ein unerwarteter Fehler ist aufgetreten",
      errorDetails: "Fehlerdetails",
    },
    error: {
      title: "Fehler",
    },
    chart: {
      noDataAvailable: "Keine Daten verfügbar",
      noDataToDisplay: "Keine Daten zur Anzeige",
    },
    codeQualityFiles: {
      affectedFiles: "Betroffene Dateien",
      andMoreFiles: "... und {{count}} weitere Datei(en)",
    },
    codeQualityList: {
      noIssues: "Keine Probleme gefunden",
    },
    codeQualitySummary: {
      errors: "Fehler",
      files: "Dateien",
      issues: "Probleme",
      of: "von",
      summary: "Zusammenfassung",
    },
    container: {
      noContent: "Kein Inhalt",
    },
    endpointRenderer: {
      cancel: "Abbrechen",
      submit: "Absenden",
      submitting: "Wird gesendet...",
    },
    formField: {
      requiresContext: "Dieses Feld erfordert Kontext",
    },
    markdown: {
      noContent: "Kein Inhalt",
    },
    pagination: {
      itemsPerPage: "Einträge pro Seite",
      page: "Seite",
      showing: "Zeige",
    },
    rangeSlider: {
      max: "Max",
      min: "Min",
    },
    toolCall: {
      creditsUsed_one: "{{count}} Credit verwendet",
      creditsUsed_other: "{{count}} Credits verwendet",
      actions: {
        confirm: "Bestätigen",
        deny: "Ablehnen",
        runInBackground: "Im Hintergrund ausführen",
        resumeWhenDone: "Nach Abschluss fortsetzen",
      },
      status: {
        complete: "Abgeschlossen",
        confirmed: "Bestätigt",
        confirmedWakeUp: "Bestätigt (Aktivierung)",
        deferred: "Verschoben",
        denied: "Abgelehnt",
        deniedWakeUp: "Abgelehnt (Aktivierung)",
        error: "Fehler",
        executing: "Wird ausgeführt",
        pendingCancellation: "Abbruch ausstehend",
        pendingConfirmation: "Bestätigung ausstehend",
        sentToBackground: "In den Hintergrund verschoben",
        waitingForConfirmation: "Warte auf Bestätigung",
        waitingForConfirmationWakeUp: "Warte auf Bestätigung (Aktivierung)",
        waitingForRemote: "Warte auf Remote",
        wakeUpBackground: "Aktivierung (Hintergrund)",
      },
      messages: {
        confirmationRequired: "Bestätigung erforderlich",
        confirmationRequiredWakeUp: "Bestätigung erforderlich (Aktivierung)",
        deferredResult: "Verschobenes Ergebnis",
        errorLabel: "Fehler",
        executingTool: "Tool wird ausgeführt...",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "Telefonnummer eingeben",
        required: "Pflichtfeld",
        selectDate: "Datum auswählen",
        unknownFieldType: "Unbekannter Feldtyp",
      },
      entityPicker: {
        change: "Ändern",
        loading: "Lädt...",
        noItems: "Keine Einträge gefunden",
        required: "Pflichtfeld",
        select: "Auswählen...",
        useToFind: "Zum Suchen verwenden",
      },
      markdownTextarea: {
        edit: "Bearbeiten",
        preview: "Vorschau",
        toolbar: {
          blockquote: "Zitat",
          bold: "Fett",
          bulletList: "Aufzählung",
          code: "Code",
          heading1: "Überschrift 1",
          heading2: "Überschrift 2",
          heading3: "Überschrift 3",
          horizontalRule: "Trennlinie",
          italic: "Kursiv",
          link: "Link",
          linkPrompt: "URL eingeben",
          orderedList: "Nummerierte Liste",
          strike: "Durchgestrichen",
        },
      },
    },
  },
  localstorage: {
    noCallback: "Kein Callback für localStorage-Operation bereitgestellt",
  },
  apiUtils: {
    errors: {
      http_error: "HTTP-Fehler",
      validation_error: "Validierungsfehler",
      internal_error: "Interner Fehler",
      auth_required: "Authentifizierung erforderlich",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "Mutation fehlgeschlagen",
        },
        validation_error: {
          title: "Validierungsfehler",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Netzwerkfehler",
      validation_failed: "Validierung fehlgeschlagen",
    },
  },
  store: {
    errors: {
      validation_failed: "Validierung fehlgeschlagen",
      request_failed: "Anfrage fehlgeschlagen",
      mutation_failed: "Mutation fehlgeschlagen",
      unexpected_failure: "Unerwarteter Fehler",
      refetch_failed: "Erneutes Abrufen fehlgeschlagen",
    },
    status: {
      loading_data: "Daten werden geladen...",
      cached_data: "Zwischengespeicherte Daten werden verwendet",
      success: "Erfolgreich",
      mutation_pending: "Mutation ausstehend...",
      mutation_success: "Mutation erfolgreich",
    },
  },
};
